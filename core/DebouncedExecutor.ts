import { debounce } from 'moderndash';


/**
 * Type definition for moderndash debounced function
 */
export type DebouncedFunction<TFunc extends (...args: any[]) => any> = TFunc & {
    cancel: () => void;
    flush: (...args: Parameters<TFunc>) => void;
    pending: () => boolean;
};

/**
 * A debounced function wrapper that prevents overlapping executions unlike standard debounce implementations.
 *
 * Uses moderndash debounce for timing control and availability of isPending() functionality
 * Uses a mutex for execution serialization to prevent overlapping executions
 *
 *
 * Execution timeline for DebouncedExecutor with:
 *  - debounce wait: 700 ms
 *  - function duration: 3000 ms
 *
 * | Call # | Call Time (ms) | Debounce Timer (fire at ms) | Action            | Actual Start (ms) | Actual End (ms) |
 * |--------|----------------|-----------------------------|-------------------|-------------------|-----------------|
 * | 1      | 0              | 700                         | Timer set         | —                 | —               |
 * | 2      | 600            | 1300                        | Timer reset       | —                 | —               |
 * | 3      | 1200           | 1900                        | Timer reset       | —                 | —               |
 * | 4      | 1800           | 2500                        | Timer reset       | —                 | —               |
 * | 5      | 2400           | 3100                        | Timer reset       | —                 | —               |
 * | 6      | 3000           | 3700                        | Timer reset       | —                 | —               |
 * | 7      | 3600           | 4300                        | Timer reset       | —                 | —               |
 * | 8      | 4200           | 4900                        | Timer reset       | —                 | —               |
 * | 9      | 4800           | 5500                        | Timer reset       | —                 | —               |
 * | 10     | 5400           | 6100                        | Timer reset       | —                 | —               |
 * | —      | 6100           | —                           | Debounce fires    | 6100              | 9100            |
 * |--------|----------------|-----------------------------|-------------------|-------------------|-----------------|
 *
 *
 * @see ThrottledExecutor for similar throttled implementation
 * @author David P
 * @created 2025-06-15
 *
 */
export class DebouncedExecutor<TArgs extends unknown[], TReturn> {
    private readonly debouncedFunction: DebouncedFunction<(...args: TArgs) => void>;
    private readonly mutex = new ExecutionMutex<TReturn>();

    constructor(
        private readonly originalFunction: (...args: TArgs) => Promise<TReturn>,
        private readonly waitTimeBetweenSaveCalls: number
    ) {
        // Create debounced wrapper that queues execution through mutex
        this.debouncedFunction = debounce(
            (...args: TArgs) => {
                this.mutex.execute(() => this.originalFunction(...args));
            },
            waitTimeBetweenSaveCalls
        ) as DebouncedFunction<(...args: TArgs) => void>;
    }

    /**
     * Execute the function with debouncing and overlap prevention
     */
    public execute(...args: TArgs): void {
        this.debouncedFunction(...args);
    }

    /**
     * Cancel any pending debounced execution
     */
    public cancel(): void {
        this.debouncedFunction.cancel();
    }

    /**
     * Flush any pending debounced execution immediately
     */
    public flush(...args: TArgs): void {
        this.debouncedFunction.flush(...args);
    }

    /**
     * Check if there's a pending debounced execution
     */
    public isPending(): boolean {
        return this.debouncedFunction.pending();
    }

    /**
     * Check if the function is currently executing
     */
    public isExecuting(): boolean {
        return this.mutex.isLocked();
    }

    /**
     * Wait for any currently executing function to complete
     */
    public async waitForCompletion(): Promise<void> {
        return this.mutex.waitForCompletion();
    }
}

/**
 * Mutex implementation for serializing async function executions
 * Ensures only one execution happens at a time
 */
class ExecutionMutex<TReturn> {
    private currentExecution: Promise<TReturn> | null = null;
    private executionQueue: Array<() => Promise<TReturn>> = [];
    private isProcessing = false;

    /**
     * Execute a function with mutual exclusion
     */
    public execute(fn: () => Promise<TReturn>): void {
        this.executionQueue.push(fn);
        this.processQueue();
    }

    /**
     * Check if a function is currently executing
     */
    public isLocked(): boolean {
        return this.currentExecution !== null;
    }

    /**
     * Wait for the current execution to complete
     */
    public async waitForCompletion(): Promise<void> {
        if (this.currentExecution) {
            try {
                await this.currentExecution;
            } catch {
                // Ignore errors, we just want to wait for completion
            }
        }
    }

    /**
     * Process the execution queue serially
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        while (this.executionQueue.length > 0) {
            const nextFunction = this.executionQueue.shift()!;

            try {
                this.currentExecution = nextFunction();
                await this.currentExecution;
            } catch (error) {
                // Log error but continue processing queue
                console.error('Execution error in debounced function:', error);
            } finally {
                this.currentExecution = null;
            }
        }

        this.isProcessing = false;
    }
}

/**
 * Factory function for creating debounced executors
 */
export function createDebouncedExecutor<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>,
    waitTimeBetweenSaveCalls: number
): DebouncedExecutor<TArgs, TReturn> {
    return new DebouncedExecutor(fn, waitTimeBetweenSaveCalls);
}