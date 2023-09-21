

const CLS_SPINWRAP = 'e-spinner-pane';

/**
 * Checks if a spinner has been created in the specified container.
 *
 * @param {HTMLElement} container - Specifies the element to check for a spinner.
 * @returns {boolean} - Returns true if a spinner exists in the container, otherwise false.
 */
export function isSpinnerCreated(container: HTMLElement): boolean {
    let spinnerWrap: HTMLElement | null;

    if (container) {
        if (container.classList.contains(CLS_SPINWRAP)) {
            spinnerWrap = container;
        } else {
            const spinWrapCollection = container.querySelectorAll('.' + CLS_SPINWRAP);
            spinnerWrap = Array.from(spinWrapCollection).find(wrap => wrap.parentElement === container) as HTMLElement|| null;
        }
    }

    return !!spinnerWrap;
}