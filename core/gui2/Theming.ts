// noinspection UnnecessaryLocalVariableJS
import {ChartTheme} from '@syncfusion/ej2-charts/src/common/utils/enum'
import {BaseListener} from '../BaseListener';
import {ListenerHandler} from '../ListenerHandler';
import * as _ from 'lodash';

export type {ChartTheme}; // make it available to other modules

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
 * switchTheme('app-theme', 'light');
 */
export function switchTheme(newThemeState: ThemeState) {
    // Check if the new theme state is valid
    if (!newThemeState)
        return;
    if ( _currentThemeState && _.isEqual(_currentThemeState, newThemeState))
        return;




    // Query all the elements with the specified class name to find the theme links
    const links = document.querySelectorAll(`.${newThemeState.style_class_name}`);

    // Convert the NodeList to an array for easier manipulation
    const linksArray = Array.from(links);

    // Create an array of promises to track the loading state of each link
    const loadPromises = linksArray.map((link: HTMLLinkElement) => {
        return new Promise<void>((resolve, reject) => {
            // Clone the existing link element to ensure the load event fires
            const clonedLink = link.cloneNode(false) as HTMLLinkElement;

            // Add a "load" event listener to the cloned link
            clonedLink.addEventListener("load", function onLoad() {
                // Remove the event listener to avoid multiple triggers
                clonedLink.removeEventListener("load", onLoad);
                resolve();
            });

            // Add an "error" event listener to the cloned link
            clonedLink.addEventListener("error", function onError() {
                // Remove the event listener to avoid multiple triggers
                clonedLink.removeEventListener("error", onError);
                reject(new Error("Failed to load CSS"));
            });

            // Extract the current href value
            const currentHref = link.href;

            // Extract the prefix and base name from the current href
            const prefix = currentHref.substring(0, currentHref.lastIndexOf('/') + 1);
            const baseName = currentHref.substring(currentHref.lastIndexOf('/') + 1, currentHref.lastIndexOf('.'));
            const newBaseName = baseName.replace(/-dark$/, ''); // Remove '-dark' if present

            // Construct the new href based on the theme type
            const newHref = newThemeState.theme_type === 'light' ? `${prefix}${newBaseName}.css` : `${prefix}${newBaseName}-dark.css`;

            // Update the href of the cloned link
            clonedLink.href = newHref;

            // Replace the original link with the cloned link
            link.parentNode?.replaceChild(clonedLink, link);
        });
    });

    // Wait for all the promises to resolve
    Promise.all(loadPromises).then(() => {
        // console.log("All CSS files have been loaded!");

        // Fire the theme change event
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

    }).catch((error) => {
        console.error("switchTheme function error: Failed to load some CSS files:", error);
    });

    // Update the current theme state
    _currentThemeState = newThemeState;
} // switchTheme