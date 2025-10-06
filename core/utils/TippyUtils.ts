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


import tippy, {Props, roundArrow} from 'tippy.js';
import {findElementWithTippyTooltip, removeTippyTooltip} from '../CoreUtils';

export interface htmlElement_addTooltop_Options {
    // Placeholder for future options; currently unused but kept for API compatibility
}

export function htmlElement_addTooltip<T extends Props = Props>(
    elem: HTMLElement,
    tippyPropsParam?: Partial<T> | (() => Partial<T>),
    _options?: htmlElement_addTooltop_Options
): void {
    if (!elem) return;
    if (!tippyPropsParam) return;

    let tippyProps: Partial<T> | undefined;
    try {
        if (typeof tippyPropsParam === 'function') {
            // @ts-ignore
            tippyProps = (tippyPropsParam as Function).call(null) as Partial<T>;
        } else {
            tippyProps = tippyPropsParam as Partial<T>;
        }
    } catch (e) {
        console.error(e);
    }

    if (!tippyProps) return;

    const tippyModel: Partial<T> = {
        arrow: roundArrow as any,
        allowHTML: true,
        appendTo: document.body,
        // Some sensible defaults
        theme: (tippyProps as any)?.theme ?? 'light-border',
        duration: (tippyProps as any)?.duration ?? [275, 0],
        delay: (tippyProps as any)?.delay ?? 100,
        interactive: (tippyProps as any)?.interactive ?? true,
        maxWidth: (tippyProps as any)?.maxWidth ?? Math.round(screen.width * 0.3),
        placement: (tippyProps as any)?.placement ?? 'right',
        popperOptions: {
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: [
                            'left', 'left-start', 'left-end', 'right-start', 'right-end'
                        ],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        altAxis: true,
                        tether: false,
                    },
                },
            ],
        },
        ...tippyProps,
    } as Partial<T>;

    try {
        // remove any existing tooltip from either the element or its children
        const ttElem = findElementWithTippyTooltip(elem);
        if (ttElem) removeTippyTooltip(ttElem);
    } catch (e) {
        console.error(e);
    }

    try {
        tippy(elem, tippyModel as T);
    } catch (e) {
        console.error(e);
    }
} // htmlElement_addTooltip