import { throttle } from 'moderndash';

/**
 * Type definition for ModernDash’s throttled function
 */
type ThrottledFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
    cancel?: () => void;
    flush?: (...args: TArgs) => void;
    pending?: () => boolean;
};

/**
 * ThrottledExecutor class
 * - Throttles calls to `originalFunction` by `waitTimeMs`
 * - Prevents overlapping executions via an internal mutex
 *
 * Execution timeline for ThrottledExecutor with:
 *  - throttle wait: 700 ms
 *  - function duration: 3000 ms
 *
 * | Call # | Call Time (ms) | Throttle Check                     | Mutex Action             | Actual Start (ms) | Actual End (ms) |
 * |--------|----------------|------------------------------------|--------------------------|-------------------|-----------------|
 * | 1      | 0              | Allowed (first call)               | Starts immediately       | 0                 | 3000            |
 * | 2      | 600            | Blocked (<700 ms since last start) | Ignored                  | —                 | —               |
 * | 3      | 1200           | Allowed (1200 – 0 ≥ 700 ms)        | Queued (mutex busy)      | 3000              | 6000            |
 * | 4      | 1800           | Blocked (<700 ms since last start) | Ignored                  | —                 | —               |
 * | 5      | 2400           | Allowed (2400 – 1200 ≥ 700 ms)     | Queued (mutex busy)      | 6000              | 9000            |
 * | 6      | 3000           | Blocked (<700 ms since last start) | Ignored                  | —                 | —               |
 * | 7      | 3600           | Allowed (3600 – 2400 ≥ 700 ms)     | Queued (mutex busy)      | 9000              | 12000           |
 * | 8      | 4200           | Blocked (<700 ms since last start) | Ignored                  | —                 | —               |
 * | 9      | 4800           | Allowed (4800 – 3600 ≥ 700 ms)     | Queued (mutex busy)      | 12000             | 15000           |
 * | 10     | 5400           | Blocked (<700 ms since last start) | Ignored                  | —                 | —               |
 * |--------|----------------|------------------------------------|--------------------------|-------------------|-----------------|
 *
 * @see DebouncedExecutor for similar debounced implementation
 * @author David P
 * @created 2025-06-15
 */

export class ThrottledExecutor<TArgs extends unknown[], TReturn> {
    private readonly throttledFn: ThrottledFunction<TArgs>;
    private readonly mutex = new ExecutionMutex<TReturn>();

    /**
     * @param originalFunction Async function to throttle
     * @param waitTimeMs Minimum milliseconds between start of executions
     */
    constructor(
        private readonly originalFunction: (...args: TArgs) => Promise<TReturn>,
        private readonly waitTimeMs: number
    ) {
        // Wrap and throttle, queueing calls through the mutex
        this.throttledFn = throttle(
            (...args: TArgs) => {
                this.mutex.execute(() => this.originalFunction(...args));
            },
            waitTimeMs
        ) as ThrottledFunction<TArgs>;
    }

    /** Invoke the throttled function */
    public execute(...args: TArgs): void {
        this.throttledFn(...args);
    }

    /** Cancel any pending throttle timer (if supported) */
    public cancel(): void {
        this.throttledFn.cancel?.();
    }

    /** Immediately invoke pending call (if supported) */
    public flush(...args: TArgs): void {
        this.throttledFn.flush?.(...args);
    }

    /** Check if a call is pending (if supported) */
    public isPending(): boolean {
        return this.throttledFn.pending?.() ?? false;
    }

    /** Check if execution is in progress */
    public isExecuting(): boolean {
        return this.mutex.isLocked();
    }

    /** Wait for any in-progress execution to finish */
    public async waitForCompletion(): Promise<void> {
        await this.mutex.waitForCompletion();
    }
}

/**
 * Mutex for serializing async executions
 */
class ExecutionMutex<TReturn> {
    private currentExecution: Promise<TReturn> | null = null;
    private executionQueue: Array<() => Promise<TReturn>> = [];
    private isProcessing = false;

    /** Queue a function and process serially */
    public execute(fn: () => Promise<TReturn>): void {
        this.executionQueue.push(fn);
        this.processQueue();
    }

    /** Returns true if an execution is ongoing */
    public isLocked(): boolean {
        return this.currentExecution !== null;
    }

    /** Wait until current execution completes */
    public async waitForCompletion(): Promise<void> {
        // Fast path: queue empty and no current execution
        if (!this.currentExecution && this.executionQueue.length === 0) {
            return;
        }

        // Otherwise, poll until both conditions are false
        await new Promise<void>((resolve) => {
            const check = () => {
                if (!this.currentExecution && this.executionQueue.length === 0) {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        });
    }


    /** Internal loop to dequeue and run functions one by one */
    private async processQueue(): Promise<void> {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.executionQueue.length) {
            const fn = this.executionQueue.shift()!;
            try {
                this.currentExecution = fn();
                await this.currentExecution;
            } catch (err) {
                console.error('Error in throttled execution:', err);
            } finally {
                this.currentExecution = null;
            }
        }

        this.isProcessing = false;
    }
}