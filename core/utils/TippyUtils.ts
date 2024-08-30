import {Instance} from 'tippy.js';

/**
 * Close the tooltip when the escape key is pressed
 * Call this from onShow as follows:
 * ``` typescript
 * {
 *     ...
 *     onShow: (instance: Instance<Props>) => {
 *        tippyCloseOnEscape(instance);
 *     }
 * } as Props
 * ```
 * @param {Instance} instance
 */
export function tippyCloseOnEscape(instance: Instance) {
    const onEscapeKey = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {  // Use the 'key' property instead of 'keyCode'
            instance.hide();
            event.stopPropagation(); // Prevent the event from propagating to parent elements
        }
    };

    document.addEventListener('keydown', onEscapeKey, { capture: true });

    // Clean up the event listener when the tooltip is hidden
    // Preserve the existing onHidden handler if it exists
    const existingOnHidden = instance.props.onHidden;

    instance.setProps({
        onHidden(instance2: Instance) {
            // Your custom onHidden logic
            document.removeEventListener('keydown', onEscapeKey, { capture: true });

            // Call the existing onHidden handler if it exists
            if (existingOnHidden) {
                existingOnHidden(instance2);
            }
        }, // onHidden
    });
} // tippyCloseOnEscape