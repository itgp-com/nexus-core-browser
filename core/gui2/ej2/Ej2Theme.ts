// noinspection UnnecessaryLocalVariableJS

/**
 * Switches the theme for Syncfusion EJ2 components by updating the href attribute of the specified link elements.
 *
 * @param {string} linkClassName - The class name of the link elements to target.
 * @param {'light' | 'dark'} themeType - The type of theme to switch to. Must be either 'light' or 'dark'.
 * @example
 * // Switch to the "light" theme for elements with the class "theme-material-dark"
 * switchEj2Theme('theme-material-dark', 'light');
 */
export function switchEj2Theme(linkClassName: string, themeType: 'light' | 'dark') {
    // Query all the elements with the specified class name
    const links = document.querySelectorAll(`.${linkClassName}`);

    // Iterate through the elements and update the "href" attribute
    links.forEach((link: HTMLLinkElement) => {
        // Get the current href value
        const currentHref = link.href;

        // Find the last '/' character and extract the prefix before the '.css'
        const prefix = currentHref.substring(0, currentHref.lastIndexOf('/') + 1);
        const baseName = currentHref.substring(currentHref.lastIndexOf('/') + 1, currentHref.lastIndexOf('.'));
        const newBaseName = baseName.replace(/-dark$/, ''); // Remove '-dark' suffix if present

        // Construct the new href value based on the theme type
        const newHref = themeType === 'light' ? `${prefix}${newBaseName}.css` : `${prefix}${newBaseName}-dark.css`;

        // Update the "href" attribute with the new value
        link.href = newHref;
    });
} // switchEj2Theme