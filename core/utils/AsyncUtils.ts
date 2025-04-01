import _ from "lodash";

/**
 * Executes a provided callback function, which can be either synchronous or asynchronous,
 * after a specified delay on a separate thread, returning a Promise that resolves when
 * the asynchronous processing has completed.
 *
 * This function wraps the native `setTimeout` in a Promise, allowing you to chain further
 * asynchronous actions after the delay or await its completion within an async function.
 * If the callback is an asynchronous function, the Promise will wait until it has finished
 * executing before resolving.
 *
 * @param {() => void | Promise<void>} callback - The function to be executed after the delay.
 *        This function can be either synchronous or asynchronous. It is called with no arguments
 *        and the `this` value set to the same `this` as the `setTimeoutWithPromise` function.
 *
 * @param {number} [delay=0] - The time, in milliseconds, to delay the execution of the callback.
 *        Defaults to 0, meaning the callback will be executed as soon as possible after the
 *        current event loop completes.
 *
 * @returns {Promise<void>} A Promise that resolves when the callback has been executed.
 *          If the callback is asynchronous, the Promise resolves after the callback's Promise resolves.
 *          This allows for asynchronous chaining or the use of `await` in an async function.
 *
 * @example
 * // Example of usage with async/await
 * async function runAfterDelay() {
 *     await setTimeoutWithPromise(async () => {
 *         await someAsyncOperation();
 *         console.log('Executed after async operation');
 *     }, 1000);
 *     console.log('This runs after the delayed async execution');
 * }
 *
 * @example
 * // Example of usage with .then() chaining
 * setTimeoutWithPromise(() => {
 *     console.log('Executed after delay');
 * }, 1000).then(() => {
 *     console.log('This runs after the delayed execution');
 * });
 */
export function setTimeoutWithPromise(callback: () => void | Promise<void>, delay: number = 0): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
            try {
                const result = await callback();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, delay);
    });
} // setTimeoutWithPromise

/**
 * Creates a debounced version of an asynchronous function that returns a promise.
 *
 * This function wraps an async function `fn` with debounce behavior. Multiple rapid calls
 * to the returned function are consolidated into a single call after the specified delay.
 * All callers receive the same pending promise, which resolves or rejects once the debounced
 * function eventually executes.
 *
 * @template T - The type of the resolved value of the promise returned by `fn`.
 * @param {(...args: any[]) => Promise<T>} fn - The asynchronous function to debounce.
 *        It must return a promise that resolves to a value of type T.
 * @param {number} delay - The debounce delay in milliseconds. Execution of `fn` will be delayed
 *        by this amount after the last call.
 * @param {_.DebounceSettings} [options={}] - Optional settings for lodash's debounce behavior,
 *        such as `leading` or `trailing` flags.
 *
 * @returns {(...args: any[]) => Promise<T>} - A debounced function that accepts the same arguments
 *          as `fn` and returns a promise. If multiple calls occur within the delay window, all calls
 *          share the same promise, which resolves with the value from `fn` or rejects if an error occurs.
 *
 * @example
 * async function fetchData(id: number): Promise<string> {
 *   // Simulate an asynchronous operation
 *   return `Data for id: ${id}`;
 * }
 *
 * // Create a debounced version of fetchData with a 200ms delay.
 * const debouncedFetchData = debounceWithPromise(fetchData, 200);
 *
 * // If called rapidly, only the last call's argument (here, 2) will be used and both calls share the same promise.
 * debouncedFetchData(1).then(console.log);
 * debouncedFetchData(2).then(console.log);
 */
export function debounceWithPromise<T>(
    fn: (...args: any[]) => Promise<T>,
    delay: number,
    options: _.DebounceSettings = {}
): (...args: any[]) => Promise<T> {
    let promise: Promise<T> | null = null;
    let resolveFunc: ((value: T) => void) | null = null;
    let rejectFunc: ((reason?: any) => void) | null = null;

    const debouncedFn = _.debounce(async (...args: any[]) => {
        try {
            const result = await fn(...args);
            resolveFunc && resolveFunc(result);
        } catch (error) {
            rejectFunc && rejectFunc(error);
        }
        // Reset for the next round of calls
        promise = null;
        resolveFunc = null;
        rejectFunc = null;
    }, delay, options);

    return (...args: any[]): Promise<T> => {
        if (!promise) {
            promise = new Promise<T>((resolve, reject) => {
                resolveFunc = resolve;
                rejectFunc = reject;
            });
        }
        debouncedFn(...args);
        return promise;
    };
} // debounceWithPromise