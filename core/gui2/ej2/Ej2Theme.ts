
/**
 * Switches the theme for Syncfusion EJ2 components by updating the href attribute of the specified link elements.
 *
 * @param {string} linkClassName - The class name of the link elements to target.
 * @param {string} themeName - The name of the theme to switch to. Must be one of the themes listed at https://ej2.syncfusion.com/documentation/appearance/theme#cdn-reference (e.g., 'material', 'material-dark', etc.).
 * @see {@link https://ej2.syncfusion.com/documentation/appearance/theme#cdn-reference} for the available theme names.
 * @example
 * //Example usage to switch to the "material" theme for elements with the class "app-theme"
 * switchEj2Theme('app-theme', 'material');
 */
export function switchEj2Theme(linkClassName: string, themeName: string) {
    // Query all the elements with the specified class name
    const links = document.querySelectorAll(`.${linkClassName}`);

    // Iterate through the elements and update the "href" attribute
    links.forEach((link: HTMLLinkElement) => {
        // Get the current href value
        const currentHref = link.href;

        // Find the last '/' character and replace the text after it with the new theme name
        const newHref = currentHref.substring(0, currentHref.lastIndexOf('/') + 1) + themeName + '.css';

        // Update the "href" attribute with the new value
        link.href = newHref;
    });
}