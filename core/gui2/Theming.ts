// noinspection UnnecessaryLocalVariableJS
import {ChartTheme} from '@syncfusion/ej2-charts/src/chart/utils/enum'
import {BaseListener} from '../BaseListener';
import {ListenerHandler} from '../ListenerHandler';

export {ChartTheme}; // make it available to other modules

/** @type {string} - Represents the theme type, either 'light' or 'dark' */
export type ThemeType = 'light' | 'dark';

/** @type {ThemeState} - Represents the current theme state */
let _currentThemeState: ThemeState;
/**
 * Returns the current theme state.
 * @returns {ThemeState} - The current theme state
 */
export function currentThemeState(): ThemeState {
    return _currentThemeState;
}

/**
 * Abstract class for theme change listener.
 * @extends {BaseListener<any>}
 */
export abstract class ThemeChangeListener extends BaseListener<any>{

    eventFired(ev: ThemeChangeEvent): void {
        this.themeChanged(ev);
    }

    abstract themeChanged(ev: ThemeChangeEvent): void;
}
export class ThemeState {
    style_class_name: string;
    theme_type: ThemeType;
    ej2ThemeName: ChartTheme;
}
/**
 * Class representing the theme change event.
 */
export class ThemeChangeEvent {
    previousState: ThemeState;
    newState: ThemeState;
}


const _themeChangeListeners: ListenerHandler<ThemeChangeEvent, ThemeChangeListener> = new ListenerHandler<ThemeChangeEvent, ThemeChangeListener>();
/**
 * Returns the theme change listeners.
 * @returns {ListenerHandler<ThemeChangeEvent, ThemeChangeListener>} - The theme change listeners
 */
export function themeChangeListeners(): ListenerHandler<ThemeChangeEvent, ThemeChangeListener> {
    return _themeChangeListeners;
}

/**
 * Switches the theme for Syncfusion EJ2 components by updating the href attribute of the link elements li class=<code>newThemeState.style_class_name</code>.
 * * Switches the EJ2 theme to the specified theme state.
 *  * @param {ThemeState} newThemeState - The new theme state
 *
 * @param {string} linkClassName - The class name of the link elements to target.
 * @param {'light' | 'dark'} themeType - The type of theme to switch to. Must be either 'light' or 'dark'.
 * @example
 * // Switch to the "light" theme for elements with the class "app-theme"
 * switchEj2Theme('app-theme', 'light');
 */
export function switchEj2Theme(newThemeState: ThemeState) {
    if (!newThemeState)
        return;

    // Query all the elements with the specified class name
    const links = document.querySelectorAll(`.${newThemeState.style_class_name}`);

    // Iterate through the elements and update the "href" attribute
    links.forEach((link: HTMLLinkElement) => {
        // Get the current href value
        const currentHref = link.href;

        // Find the last '/' character and extract the prefix before the '.css'
        const prefix = currentHref.substring(0, currentHref.lastIndexOf('/') + 1);
        const baseName = currentHref.substring(currentHref.lastIndexOf('/') + 1, currentHref.lastIndexOf('.'));
        const newBaseName = baseName.replace(/-dark$/, ''); // Remove '-dark' suffix if present

        // Construct the new href value based on the theme type
        const newHref = newThemeState.theme_type === 'light' ? `${prefix}${newBaseName}.css` : `${prefix}${newBaseName}-dark.css`;

        // Update the "href" attribute with the new value
        link.href = newHref;
    });


    try {
        let themeChangeEvent: ThemeChangeEvent = {
            previousState: _currentThemeState,
            newState: newThemeState
        }

        _themeChangeListeners.fire({
            event: themeChangeEvent
        });

    } catch (e) {
        console.error(e);
    }

    _currentThemeState = newThemeState;
} // switchEj2Theme