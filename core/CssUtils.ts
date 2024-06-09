const defaultStyleId = '___nexus_default_style___';
/**
 * Adds CSS content to a specified or default style element.
 *
 * @param {string} cssContent - The CSS content to be added.
 * @param {string} [styleId] - The ID of the style element to add the CSS content to. If not specified, the default style element '___nexus_default_style___' is used.
 * @returns {void}
 */

export function cssAdd(cssContent: string, styleId?: string): void {
    if (!cssContent) {
        console.error("cssAdd function was passed an empty cssContent parameter!");
        return;
    }

    let styleElement: HTMLStyleElement | null;
    if ( !styleId)
        styleId = defaultStyleId;

    if (styleId) {
        // Find or create the style element with the specified id
        styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
    }
    // Append the CSS content to the specified or default style element
    styleElement.textContent += cssContent;
} // end cssAdd

/**
 * Removes a CSS selector from a specified or default style element ('___nexus_default_style___').
 *
 * @param {string} cssSelector - The CSS selector to be removed.
 * @param {string} [styleId] - The ID of the style element to remove the CSS selector from. If not specified, the default style element is checked first, and then all other styles are traversed.
 * @returns {boolean} - Returns true if the selector was successfully removed, otherwise false.
 */
export function cssRemove(cssSelector: string, styleId?: string): boolean {
    if (!cssSelector) {
        console.error("cssRemoveSelector function was passed an empty cssSelector parameter!");
        return false;
    }

    const removeRule = (styleElement: HTMLStyleElement): boolean => {
        if (!styleElement.sheet) return false;

        const rules = styleElement.sheet.cssRules;
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i] as CSSStyleRule;
            if (rule.selectorText === cssSelector) {
                styleElement.sheet.deleteRule(i);
                return true;
            }
        }
        return false;
    };

    if (styleId) {
        const styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (styleElement && removeRule(styleElement)) {
            return true;
        }
    } else {
        const defaultStyleElement = document.getElementById(defaultStyleId) as HTMLStyleElement;
        if (defaultStyleElement && removeRule(defaultStyleElement)) {
            return true;
        }
    }

    // Traverse all style elements if not found in the specified or default style element
    const styleElements = document.getElementsByTagName('style');
    for (let i = 0; i < styleElements.length; i++) {
        const styleElement = styleElements[i];
        if (styleElement.id !== styleId && styleElement.id !== defaultStyleId) {
            if (removeRule(styleElement as HTMLStyleElement)) {
                return true;
            }
        }
    }

    console.warn(`cssRemove: Selector ${cssSelector} not found in any style element.`);
    return false;
}