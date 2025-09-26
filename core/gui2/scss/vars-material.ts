import {cssAdd, cssSetRootVariables, CssVariables} from '../../CssUtils';
import {ThemeChangeEvent, themeChangeListeners} from '../Theming';

// Listener function with a priority of 0 (default is 100) so it loads first
themeChangeListeners().add(_coreUpdateThemeCssVariables, 0);

export interface CoreCssVariables extends CssVariables {
    app_bright_red: string;
    app_button_bg_color: string,
    app_button_color: string,
    app_button_color_accent: string,
    app_color_blue: string;
    app_color_blue_01: string;
    app_color_blue_02: string;
    app_color_cyan: string;
    app_color_gray_text1: string;
    app_color_gray_text2: string;
    app_color_gray_text3: string;
    app_color_green: string;
    app_color_green_01: string;
    app_color_green_02: string;
    app_color_green_03: string;
    app_color_green_04: string;
    app_color_green_05: string;
    app_color_light_gray_001: string;
    app_color_link_blue: string;
    app_color_panel_background: string;
    app_color_red_01: string;
    app_color_red_02: string;
    app_color_yellow_01: string;
    app_color_yellow_02: string;
    app_color_yellow_03: string;
    app_color_yellow_04: string;
    app_custom_excel_filter_width_number: string;
    app_dashboard_button_background_color: string;
    app_dashboard_button_text_color: string;
    app_dialog_border_radius: string;
    app_dialog_header_background_color: string;
    app_dialog_header_close_button_size: string;
    app_dialog_header_font_color: string;
    app_filter_text_background_color: string;
    app_font_family: string;
    app_font_main: string;
    app_font_size_base_number: string;
    app_font_size_header: string;
    app_font_size_label: string;
    app_font_size_minus_1: string;
    app_font_size_minus_2: string;
    app_font_size_plus_1: string;
    app_font_size_plus_2: string;
    app_font_size_regular: string;
    app_font_size_section_title: string;
    app_gray_input_background: string;
    app_header_text_color_dark_gray: string;
    app_header_text_color_dark_green: string;
    app_label_color: string;
    app_label_color_coolgray: string;
    app_light_background: string;
    app_nav_band_background: string;
    app_row_disabled_background_color_lightgray: string;
    app_text_color: string;
    app_text_color_accent: string,
    app_text_highlight_warn_background_color: string;
    app_text_highlight_warn_text_color: string;
    app_widget_spacing: string;
    font_family: string;
    grey_dark: string;
    island_background_color: string;
    material_accent_color: string;
    material_accent_font_color: string;
    material_primary_color: string;
    material_primary_font_color: string;
} // CoreCssVariables

const coreCssCommonVariables: CoreCssVariables = {
    //--- app specific properties, undefined are theme specific ----
    app_bright_red: '#E1251B',
    app_button_bg_color: undefined,
    app_button_color: undefined,
    app_button_color_accent: undefined,
    app_color_blue: '#10669F',
    app_color_blue_01: '#2174af',
    app_color_blue_02: '#4a90e2',
    app_color_blue_lighter_10:'#137abd',
    app_color_blue_lighter_20:'#168ddc',
    app_color_blue_lighter_30:'#2a9dea',
    app_color_blue_lighter_40:'#48abed',
    app_color_blue_lighter_50:'#67b9f0',
    app_color_blue_lighter_60:'#85c7f3',
    app_color_blue_lighter_70:'#a4d5f6',
    app_color_blue_lighter_80:'#c2e3f9',
    app_color_blue_lighter_90:'#e1f1fc',
    app_color_blue_lighter_95:'#f0f8fd',
    app_color_blue_lighter_96:'#f3f9fe',
    app_color_blue_lighter_97:'#f6fbfe',
    app_color_blue_lighter_98:'#f9fcfe',
    app_color_blue_midnight: '#191970', // midnight blue
    app_color_blue_dark: '#00008b', // dark blue
    app_color_coral_dark: '#EF5350',
    app_color_coral_light: '#F8BBD0',
    app_color_coral_medium: '#FF799C',
    app_color_crimson: '#DC143C',
    app_color_cyan: '#03E0DF',
    app_color_firebrick: '#B22222',
    app_color_gray_50: '#fafafa',
    app_color_gray_100: '#f5f5f5',
    app_color_gray_200: '#eee',
    app_color_gray_300: '#e0e0e0',
    app_color_gray_400: '#bdbdbd',
    app_color_gray_500: '#9e9e9e',
    app_color_gray_600: '#757575',
    app_color_gray_700: '#616161',
    app_color_gray_800: '#424242',
    app_color_gray_900: '#212121',
    app_color_gray_dark: '#303030',
    app_color_gray_text1: '#a3a3a3',
    app_color_gray_text2: '#b3b3b3',
    app_color_gray_text3: '#c3c3c3',
    app_color_green: '#087b3e',
    app_color_green_01: '#087b3e',
    app_color_green_02: undefined,
    app_color_green_03: '#92D050',
    app_color_green_04: '#679f2b',
    app_color_green_05: '#2ea44f',
    app_color_light_gray_001: '#E9E9E9',
    app_color_link_blue: '#1e90ff',
    app_color_panel_background: undefined,
    app_color_red_01: '#E1251B',
    app_color_red_02: undefined,
    app_color_red_dark: '#D50000',
    app_color_red_light: '#FF8A80',
    app_color_red_vivid: '#F44336',
    app_color_salmon: '#FA8072',
    app_color_tomato: '#FF6347',
    app_color_yellow_01: '#fefe4c',
    app_color_yellow_02: undefined,
    app_color_yellow_03: undefined,
    app_color_yellow_04: '#ffd43b',
    app_color_orangedark_darker_20: '#cc7000',
    app_color_orangedark_darker_10: '#e67e00',
    app_color_orangedark: '#ff8c00',
    app_color_orangedark_lighter_10: '#ff981a',
    app_color_orangedark_lighter_20: '#ffa333',
    app_color_orangedark_lighter_30: '#ffaf4d',
    app_color_orangedark_lighter_40: '#ffba66',
    app_color_orangedark_lighter_50: '#ffc680',
    app_color_orangedark_lighter_60: '#ffd199',
    app_color_orangedark_lighter_70: '#ffddb3',
    app_color_orangedark_lighter_80: '#ffe8cc',
    app_color_orangedark_lighter_90: '#fff3e5',
    app_color_orangedark_lighter_95: '#fff9f2',
    app_custom_excel_filter_width_number: '18px',
    app_dashboard_button_background_color: undefined,
    app_dashboard_button_text_color: undefined,
    app_dialog_border_radius: '10px',
    app_dialog_header_background_color: undefined,
    app_dialog_header_close_button_size: '18',
    app_dialog_header_font_color: undefined,
    app_filter_text_background_color: undefined,
    app_font_family: 'Roboto-Regular, sans-serif',
    app_font_main: 'Roboto-Regular',
    app_font_size_base_number: '12',
    app_font_size_header: '13.5px',
    app_font_size_label: '10.5px',
    app_font_size_minus_1: '11px',
    app_font_size_minus_2: '10px',
    app_font_size_plus_1: '13px',
    app_font_size_plus_2: '14px',
    app_font_size_regular: '12px',
    app_font_size_section_title: '14.25px',
    app_gray_input_background: undefined,
    app_header_text_color_dark_gray: undefined,
    app_header_text_color_dark_green: undefined,
    app_label_color: undefined,
    app_label_color_coolgray: undefined,
    app_light_background: undefined,
    app_nav_band_background: '#2174af',
    app_row_disabled_background_color_lightgray: undefined,
    app_text_color: undefined,
    app_text_color_accent: undefined,
    app_text_highlight_warn_background_color: undefined,
    app_text_highlight_warn_text_color: undefined,
    app_widget_spacing: '10px',
    font_family: 'Roboto-Regular, sans-serif',
    grey_dark: '#303030',
    island_background_color: undefined,
    material_accent_color: '#10669F',
    material_accent_font_color: '#fff',
    material_primary_color: '#37474f',
    material_primary_font_color: '#fff',

} as CoreCssVariables;

const coreCssLightThemeVariables: CoreCssVariables = {
    app_button_bg_color: coreCssCommonVariables.app_color_gray_50,
    app_button_color: 'rgba(#000, .87)',
    app_button_color_accent: coreCssCommonVariables.material_accent_color,
    app_color_green_02: '#E9FEF3',
    app_color_panel_background: '#f5f5f5',
    app_color_red_02: '#FDF4F4',
    app_color_yellow_02: '#FFFFE0',
    app_color_yellow_03: '#fcfcb3',
    app_dashboard_button_background_color: '#10669F',
    app_dashboard_button_text_color: '#fff',
    app_dialog_header_background_color: '#000',
    app_dialog_header_font_color: '#fff',
    app_filter_text_background_color: '#F2F8FF',
    app_gray_input_background: '#F3F3F3',
    app_header_text_color_dark_gray: '#4D4D4D',
    app_header_text_color_dark_green: '#6C7E7F',
    app_label_color: '#000',
    app_label_color_coolgray: '#616161',
    app_light_background: '#a5d4f6',
    app_row_disabled_background_color_lightgray: '#E6E6E6',
    app_text_color: '#000',
    app_text_color_accent: coreCssCommonVariables.material_accent_color,
    app_text_highlight_warn_background_color: '#f73b2a',
    app_text_highlight_warn_text_color: '#fff',
    island_background_color: '#FFFFFF',
} as CoreCssVariables;

const app_dark_color_accent = '#03a9f4';
const coreCssDarkThemeVariables: CoreCssVariables = {
    app_button_bg_color: coreCssCommonVariables.app_color_gray_700,
    app_button_color: '#fff',
    app_button_color_accent: app_dark_color_accent,
    app_color_green_02: '#1c3d2c',
    app_color_panel_background: '#303030',
    app_color_red_02: '#3d1c1c',
    app_color_yellow_02: '#3d3d20',
    app_color_yellow_03: '#4d4d2c',
    app_dashboard_button_background_color: '#1e4a6e',
    app_dashboard_button_text_color: '#fff',
    app_dialog_header_background_color: '#000',
    app_dialog_header_font_color: '#fff',
    app_filter_text_background_color: '#0d2133',
    app_gray_input_background: '#424242',
    app_header_text_color_dark_gray: '#b2b2b2',
    app_header_text_color_dark_green: '#93a7a8',
    app_label_color: '#ffffffb3',
    app_label_color_coolgray: '#b1b1b1',
    app_light_background: '#1e4a6e',
    app_row_disabled_background_color_lightgray: '#4a4a4a',
    app_text_color: '#fff',
    app_text_color_accent: app_dark_color_accent,
    app_text_highlight_warn_background_color: '#8f2319',
    app_text_highlight_warn_text_color: '#fff',
    island_background_color: 'rgba(48, 48, 48, 0.6)',
} as CoreCssVariables;

export const CSS_VARS_CORE: CoreCssVariables = {...coreCssCommonVariables, ...coreCssLightThemeVariables} as CoreCssVariables;

function _coreUpdateThemeCssVariables(ev: ThemeChangeEvent) {
    const themeVariables = ev.newState.theme_type === 'light' ? coreCssLightThemeVariables : coreCssDarkThemeVariables;
    const updatedVariables = {...coreCssCommonVariables, ...themeVariables};

    Object.keys(updatedVariables).forEach(key => {
        const typedKey = key as keyof CoreCssVariables;
        CSS_VARS_CORE[typedKey] = updatedVariables[typedKey] as string;
    });

    cssSetRootVariables(CSS_VARS_CORE); // all the variables are updated - this is the core
    css();
}

function css() {

    /* start dismantling excel filter settings that should never have been set in the first place */
    cssAdd(`
    
.e-contextmenu-wrapper ul, .e-contextmenu-container ul {
  font-size: ${CSS_VARS_CORE.app_font_size_regular} !important;
}

.e-excel-menu.e-contextmenu.e-menu-parent {
  max-height: unset !important;
  overflow-y: unset !important;
}
    `)
}


export function getCSS_VARS_CORE(): CoreCssVariables {
    return CSS_VARS_CORE;
}