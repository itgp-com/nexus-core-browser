import { debounce } from 'moderndash';

/**
 * Extend moderndash’s debounced function type.
 */
export type DebouncedFunction<
    TFunc extends (...args: any[]) => any
> = TFunc & {
    cancel: () => void;
    flush: (...args: Parameters<TFunc>) => void;
    pending: () => boolean;
};


/**
 * A debounced function wrapper that prevents overlapping executions unlike standard debounce implementations.
 *  - At most one running and one pending invocation
 *  - Full public API: execute, cancel, flush, isPending, isExecuting, waitForCompletion
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
    private isRunning = false;
    private pendingArgs: TArgs | null = null;
    private completionPromise: Promise<void> | null = null;
    private completionResolve: (() => void) | null = null;

    private readonly debouncedFn: DebouncedFunction<(...args: TArgs) => void>;

    constructor(
        private readonly originalFn: (...args: TArgs) => Promise<TReturn>,
        private readonly waitMs: number
    ) {
        this.debouncedFn = debounce(
            (...args: TArgs) => this.onDebounceFire(...args),
            this.waitMs
        ) as DebouncedFunction<(...args: TArgs) => void>;
    }

    /**
     * Schedule the debounced function.
     */
    public execute(...args: TArgs): void {
        this.debouncedFn(...args);
    }

    /**
     * Cancel any pending debounce timer.
     */
    public cancel(): void {
        this.debouncedFn.cancel();
    }

    /**
     * Flush the debounce: fire immediately with given args.
     */
    public flush(...args: TArgs): void {
        this.debouncedFn.flush(...args);
    }

    /**
     * Returns true if a debounce timer is active.
     */
    public isPending(): boolean {
        return this.debouncedFn.pending();
    }

    /**
     * Returns true if the original function is executing.
     */
    public isExecuting(): boolean {
        return this.isRunning;
    }

     /**
     * Waits for the debounce timer to fire and any pending run to finish.
     */
    public async waitForCompletion(): Promise<void> {
        await new Promise<void>((resolve) => {
            const check = () => {
                const timerPending = this.debouncedFn.pending();
                if (!this.isRunning && !timerPending && this.pendingArgs == null) {
                    resolve();
                } else {
                    setTimeout(check, 20);
                }
            };
            check();
        });
    }


    /**
     * Internal debounce fire handler.
     */
    private async onDebounceFire(...args: TArgs): Promise<void> {
        // Always keep latest args
        if (this.isRunning) {
            this.pendingArgs = args;
            return;
        }

        this.isRunning = true;
        try {
            await this.originalFn(...args);
        } catch (err) {
            // Optional: log or handle the error
            console.error('DebouncedExecutor error:', err);
        } finally {
            this.isRunning = false;

            // Signal completion
            if (this.completionResolve) {
                this.completionResolve();
                this.completionPromise = null;
                this.completionResolve = null;
            }

            // If a call came in during execution, run it now
            if (this.pendingArgs) {
                const next = this.pendingArgs;
                this.pendingArgs = null;
                // Invoke without debounce delay
                await this.onDebounceFire(...next);
            }
        }
    }
}

// /**
//  * Factory helper.
//  */
// export function createDebouncedExecutor<
//     TArgs extends unknown[],
//     TReturn
// >(
//     fn: (...args: TArgs) => Promise<TReturn>,
//     waitMs: number
// ): DebouncedExecutor<TArgs, TReturn> {
//     return new DebouncedExecutor(fn, waitMs);
// }