
/**
 * Executes a provided callback function after a specified delay on a separate thread,
 * returning a Promise that resolves when the asynchronous processing has completed.
 *
 * This function wraps the native `setTimeout` in a Promise, allowing you to chain further
 * asynchronous actions after the delay or await its completion within an async function.
 * The callback function is invoked with the same `this` context as the `setTimeoutWithPromise` function.
 *
 * @param {() => void} callback - The function to be executed after the delay. Can be async, since the signature allows for async()=>Promise<void>
 *        This function is called with no arguments and the `this` value set to the same
 *        `this` as the `setTimeoutWithPromise` function.
 *
 * @param {number} [delay=0] - The time, in milliseconds, to delay the execution of the callback.
 *        Defaults to 0, meaning the callback will be executed as soon as possible after the
 *        current event loop completes.
 *
 * @returns {Promise<void>} A Promise that resolves when the callback has been executed.
 *          This allows for asynchronous chaining or the use of `await` in an async function.
 *
 * @example
 * // Example of usage with async/await
 * async function runAfterDelay() {
 *     await setTimeoutWithPromise(() => {
 *         console.log('Executed after delay');
 *     }, 1000);
 *     console.log('This runs after the delayed execution');
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
export function setTimeoutWithPromise(callback: () => void, delay: number = 0): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            callback.call(this); // Execute the callback with the same context as setTimeoutWithPromise
            resolve();
        }, delay);
    });
} // setTimeoutWithPromise