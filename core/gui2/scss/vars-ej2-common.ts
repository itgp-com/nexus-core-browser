import {ThemeChangeEvent, themeChangeListeners} from '../Theming';

// Create an instance of SyncfusionCss and export it
export const CSS_VARS_EJ2: Ej2Css = {};

// Define the SyncfusionCss class with optional fields
class Ej2Css {
    font_family?: string;
    font_size?: string;
    font_weight?: string;
    font_path?: string;
    header_bg_color?: string;
    header_gradient_color?: string;
    header_border_color?: string;
    header_font_color?: string;
    header_icon_color?: string;
    content_bg_color?: string;
    content_border_color?: string;
    content_font_color?: string;
    default_bg_color?: string;
    default_gradient_color?: string;
    default_border_color?: string;
    default_font_color?: string;
    default_icon_color?: string;
    hover_bg_color?: string;
    hover_gradient_color?: string;
    hover_border_color?: string;
    hover_font_color?: string;
    hover_icon_color?: string;
    active_bg_color?: string;
    active_gradient_color?: string;
    active_border_color?: string;
    active_font_color?: string;
    active_icon_color?: string;
    error_font_color?: string;
    warning_font_color?: string;
    success_font_color?: string;
    information_font_color?: string;
    overlay_bg_color?: string;
    shadow_color?: string;
    border_size?: string;
    border_type?: string;
    border_radius?: string;
    border_left_radius?: string;
    border_right_radius?: string;
    border_top_radius?: string;
    border_bottom_radius?: string;
//----
    grid_hover_bg_color?: string;
    grid_table_background_color?: string;
    grid_header_border_color?: string;
    grid_header_font_weight ?: string;
    grid_header_font_size ?:string;
    grid_header_height ?:string;
    panel_box_shadow?: string;
    chip_bg_color?: string;
}


let updateThemeVariables = (ev: ThemeChangeEvent) => {

    const rootStyle = getComputedStyle(document.documentElement);

    CSS_VARS_EJ2.font_family = rootStyle.getPropertyValue('--font-family').trim();
    CSS_VARS_EJ2.font_size = rootStyle.getPropertyValue('--font-size').trim();
    CSS_VARS_EJ2.font_weight = rootStyle.getPropertyValue('--font-weight').trim();
    CSS_VARS_EJ2.font_path = rootStyle.getPropertyValue('--font-path').trim();
    CSS_VARS_EJ2.header_bg_color = rootStyle.getPropertyValue('--header-bg-color').trim();
    CSS_VARS_EJ2.header_gradient_color = rootStyle.getPropertyValue('--header-gradient-color').trim();
    CSS_VARS_EJ2.header_border_color = rootStyle.getPropertyValue('--header-border-color').trim();
    CSS_VARS_EJ2.header_font_color = rootStyle.getPropertyValue('--header-font-color').trim();
    CSS_VARS_EJ2.header_icon_color = rootStyle.getPropertyValue('--header-icon-color').trim();
    CSS_VARS_EJ2.content_bg_color = rootStyle.getPropertyValue('--content-bg-color').trim();
    CSS_VARS_EJ2.content_border_color = rootStyle.getPropertyValue('--content-border-color').trim();
    CSS_VARS_EJ2.content_font_color = rootStyle.getPropertyValue('--content-font-color').trim();
    CSS_VARS_EJ2.default_bg_color = rootStyle.getPropertyValue('--default-bg-color').trim();
    CSS_VARS_EJ2.default_gradient_color = rootStyle.getPropertyValue('--default-gradient-color').trim();
    CSS_VARS_EJ2.default_border_color = rootStyle.getPropertyValue('--default-border-color').trim();
    CSS_VARS_EJ2.default_font_color = rootStyle.getPropertyValue('--default-font-color').trim();
    CSS_VARS_EJ2.default_icon_color = rootStyle.getPropertyValue('--default-icon-color').trim();
    CSS_VARS_EJ2.hover_bg_color = rootStyle.getPropertyValue('--hover-bg-color').trim();
    CSS_VARS_EJ2.hover_gradient_color = rootStyle.getPropertyValue('--hover-gradient-color').trim();
    CSS_VARS_EJ2.hover_border_color = rootStyle.getPropertyValue('--hover-border-color').trim();
    CSS_VARS_EJ2.hover_font_color = rootStyle.getPropertyValue('--hover-font-color').trim();
    CSS_VARS_EJ2.hover_icon_color = rootStyle.getPropertyValue('--hover-icon-color').trim();
    CSS_VARS_EJ2.active_bg_color = rootStyle.getPropertyValue('--active-bg-color').trim();
    CSS_VARS_EJ2.active_gradient_color = rootStyle.getPropertyValue('--active-gradient-color').trim();
    CSS_VARS_EJ2.active_border_color = rootStyle.getPropertyValue('--active-border-color').trim();
    CSS_VARS_EJ2.active_font_color = rootStyle.getPropertyValue('--active-font-color').trim();
    CSS_VARS_EJ2.active_icon_color = rootStyle.getPropertyValue('--active-icon-color').trim();
    CSS_VARS_EJ2.error_font_color = rootStyle.getPropertyValue('--error-font-color').trim();
    CSS_VARS_EJ2.warning_font_color = rootStyle.getPropertyValue('--warning-font-color').trim();
    CSS_VARS_EJ2.success_font_color = rootStyle.getPropertyValue('--success-font-color').trim();
    CSS_VARS_EJ2.information_font_color = rootStyle.getPropertyValue('--information-font-color').trim();
    CSS_VARS_EJ2.overlay_bg_color = rootStyle.getPropertyValue('--overlay-bg-color').trim();
    CSS_VARS_EJ2.shadow_color = rootStyle.getPropertyValue('--shadow-color').trim();
    CSS_VARS_EJ2.border_size = rootStyle.getPropertyValue('--border-size').trim();
    CSS_VARS_EJ2.border_type = rootStyle.getPropertyValue('--border-type').trim();
    CSS_VARS_EJ2.border_radius = rootStyle.getPropertyValue('--border-radius').trim();
    CSS_VARS_EJ2.border_left_radius = rootStyle.getPropertyValue('--border-left-radius').trim();
    CSS_VARS_EJ2.border_right_radius = rootStyle.getPropertyValue('--border-right-radius').trim();
    CSS_VARS_EJ2.border_top_radius = rootStyle.getPropertyValue('--border-top-radius').trim();
    CSS_VARS_EJ2.border_bottom_radius = rootStyle.getPropertyValue('--border-bottom-radius').trim();
    //----
    CSS_VARS_EJ2.grid_table_background_color = rootStyle.getPropertyValue('--grid-table-background-color').trim();
    CSS_VARS_EJ2.grid_header_border_color = rootStyle.getPropertyValue('--grid-header-border-color').trim();
    CSS_VARS_EJ2.grid_header_font_weight = rootStyle.getPropertyValue('--grid-header-font-weight').trim();
    CSS_VARS_EJ2.grid_header_font_size = rootStyle.getPropertyValue('--grid-header-font-size').trim();
    CSS_VARS_EJ2.grid_header_height = rootStyle.getPropertyValue('--grid-header-height').trim();

    CSS_VARS_EJ2.panel_box_shadow = rootStyle.getPropertyValue('--panel-box-shadow').trim();
    CSS_VARS_EJ2.chip_bg_color = rootStyle.getPropertyValue('--chip-bg-color').trim();

};

// Listener function with a priority of 0 (default is 100) so it loads first
themeChangeListeners().add(updateThemeVariables, 0); // priority 0 so it loads first