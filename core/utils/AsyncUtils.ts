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
    return new Promise<void>((resolve) => {
        setTimeout(async () => {
            await callback.call(this); // Execute the callback and await if it is async
            resolve();
        }, delay);
    });
} // setTimeoutWithPromise