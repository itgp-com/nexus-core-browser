import {ThemeChangeEvent, themeChangeListeners} from '../Theming';

// Create an instance of SyncfusionCss and export it
export const TIPPY: TippyCss = {};
export const TIPPY_THEME_DEFAULT = "tippy-default";

const TippyCssFieldNames: string[] = [
    'tippy-bg-color',
    'tippy-font-color',
    'tippy-border-color',
    'tippy-arrow-fill',
]

// Define the SyncfusionCss class with optional fields
class TippyCss {
    tippy_bg_color?: string;
    tippy_font_color?: string;
    tippy_border_color?: string;
    tippy_arrow_fill?: string;
}


function updateThemeVariables (ev: ThemeChangeEvent) {
    const rootStyle = getComputedStyle(document.documentElement);

    // Add all the properties here
    TippyCssFieldNames.forEach(key => {
        const cssVarName = `--${key.replace(/_/g, '-')}`;
        // console.log('Assigning value for ', cssVarName);
        (TIPPY as any)[key] = rootStyle.getPropertyValue(cssVarName).trim();
    });
}

themeChangeListeners().add(updateThemeVariables);