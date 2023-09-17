import {ThemeChangeEvent, themeChangeListeners} from '../Theming';

export const CORE_MATERIAL: CoreMaterialCss = {};

const CoreMaterialCssFieldNames: string[] = [

    'material_primary_color',
    'material_primary_font_color',
    'material_accent_color',
    'material_accent_font_color',
    'grey_dark',

    'app_color_panel_background',
    'app_font_main',
    'app_font_family',
    'font_family',
    'app_font_size_base_number', // integer
    'app_font_size_regular',
    'app_font_size_minus_1',
    'app_font_size_minus_2',
    'app_font_size_plus_1',
    'app_font_size_plus_2',
    'app_font_size_label',
    'app_font_size_header',
    'app_font_size_section_title',
    'app_dialog_header_font_color',
    'app_dialog_header_background_color',
    'app_color_green',
    'app_color_blue',
    'app_color_link_blue',
    'app_color_cyan',
    'app_color_light_gray_001',
    'app_grid_line_color',
    'app_gray_input_background',
    'app_light_background',
    'app_bright_red',
    'app_label_color_coolgray',
    'app_color_gray_text1',
    'app_color_gray_text2',
    'app_color_gray_text3',
    'app_header_text_color_dark_gray',
    'app_header_text_color_dark_green',
    'app_row_disabled_background_color_lightgray',
    'app_filter_text_background_color',
    'app_dashboard_button_text_color',
    'app_dashboard_button_background_color',
    'app_widget_spacing',
    'app_nav_band_background',
    'app_text_highlight_warn_background_color',
    'app_text_highlight_warn_text_color',
    'app_color_red_01',
    'app_color_red_02',
    'app_color_yellow_01',
    'app_color_yellow_02',
    'app_color_yellow_03',
    'app_color_yellow_04',
    'app_color_green_01',
    'app_color_green_02',
    'app_color_green_03',
    'app_color_blue_01',
    'app_dialog_header_close_button_size',
];

class CoreMaterialCss {
    material_primary_color ?:string;
    material_primary_font_color ?:string;
    material_accent_color ?:string;
    material_accent_font_color ?:string;
    grey_dark ?:string;

    app_color_panel_background ?: string;
    app_font_main ?: string;
    app_font_family ?: string;
    font_family ?: string;
    app_font_size_base_number ?: string;
    app_font_size_regular ?: string;
    app_font_size_minus_1 ?: string;
    app_font_size_minus_2 ?: string;
    app_font_size_plus_1 ?: string;
    app_font_size_plus_2 ?: string;
    app_font_size_label ?: string;
    app_font_size_header ?: string;
    app_font_size_section_title ?: string;
    app_dialog_header_font_color ?: string;
    app_dialog_header_background_color ?: string;
    app_color_green ?: string;
    app_color_blue ?: string;
    app_color_link_blue ?: string;
    app_color_cyan ?: string;
    app_color_light_gray_001 ?: string;
    app_grid_line_color ?: string;
    app_gray_input_background ?: string;
    app_light_background ?: string;
    app_bright_red ?: string;
    app_label_color_coolgray ?: string;
    app_color_gray_text1 ?: string;
    app_color_gray_text2 ?: string;
    app_color_gray_text3 ?: string;
    app_header_text_color_dark_gray ?: string;
    app_header_text_color_dark_green ?: string;
    app_row_disabled_background_color_lightgray ?: string;
    app_filter_text_background_color ?: string;
    app_dashboard_button_text_color ?: string;
    app_dashboard_button_background_color ?: string;
    app_widget_spacing ?: string;
    app_nav_band_background ?: string;
    app_text_highlight_warn_background_color ?: string;
    app_text_highlight_warn_text_color ?: string;
    app_color_red_01 ?: string;
    app_color_red_02 ?: string;
    app_color_yellow_01 ?: string;
    app_color_yellow_02 ?: string;
    app_color_yellow_03 ?: string;
    app_color_yellow_04 ?: string;
    app_color_green_01 ?: string;
    app_color_green_02 ?: string;
    app_color_green_03 ?: string;
    app_color_blue_01 ?: string;
    app_dialog_header_close_button_size ?: string;

}


function updateThemeVariables (ev: ThemeChangeEvent) {
    const rootStyle = getComputedStyle(document.documentElement);

    // Add all the properties here
    CoreMaterialCssFieldNames.forEach(key => {
        const cssVarName = `--${key.replace(/_/g, '-')}`;
        // console.log('Assigning value for ', cssVarName);
        CORE_MATERIAL[key] = rootStyle.getPropertyValue(cssVarName).trim();
    });
}

// Listener function with a priority of 0 (default is 100) so it loads first (parallel with VARS_EJ2_COMMON)
themeChangeListeners().add(updateThemeVariables, 0); // 0 is the highest priority since all other theme clases and selectors use these