import {cssAddClass} from "./CoreUtils";

export const CSS_FLEX_MAX_XY                    = "flex-component-max flex-full-height";
export const CSS_FLEX_MAX_HEIGHT                = "flex-full-height";
export const CSS_FLEX_MAX_WIDTH                 = "flex-full-width";
export const CSS_FLEX_ROW_DIRECTION             = "flex-container-row";
export const CSS_FLEX_COL_DIRECTION             = "flex-container-column";
export const CSS_FLEX_COL_DIRECTION_MAX         = "core-full";
export const CSS_FLEX_CENTER_MAIN_AXIS          = "flex-mainAxis-centerContainer";
export const CSS_FLEX_CENTER_SELF               = "flex-align-self-centerContainer";
export const CSS_FLEX_CONTAINER                 = "flex-container-lcr";
export const CSS_FLEX_CONTAINER_CENTERING       = "flex-lcr-box";
export const CSS_FLEX_CONTAINER_LEFT_JUSTIFIED  = "flex-lcr-box-leftContainer";
export const CSS_FLEX_CONTAINER_RIGHT_JUSTIFIED = "flex-lcr-box-rightContainer";
export const CSS_MAX_XY                         = "core_height_width_100_percent";

export const css_vertical_spacer      = 'core_vertical_spacer';
export const css_bootstrap_no_gutters = 'no-gutters';
export const ej2_icon_menu_hamburger  = 'ej2-icon-menu-hamburger';
export const ej2_icon_close           = 'ej2-icon-close';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_add             = 'ej2-icon-add';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_search          = 'ej2-icon-search';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_feedback        = 'ej2-icon-feedback';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_save            = 'ej2-icon-save';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_clearall        = 'ej2-icon-mt-clearall';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_delete          = 'ej2-icon-delete';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_info            = 'ej2-icon-info';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_update          = 'ej2-icon-update';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_createlink      = 'ej2-icon-createlink';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_ok              = 'ej2-icon-ok';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_close2          = 'ej2-icon-close2';
// noinspection JSUnusedGlobalSymbols
export const css_horizontal_spacer    = 'core-horizontal-spacer';
export const ej2_icon_excel_export    = 'ej2-icon-excel-export';


/***
 *  See
 * https://yyjhao.com/posts/roll-your-own-css-in-js/
 * https://yyjhao.com/posts/roll-your-own-css-in-js-3/
 *
 * for further info
 */

/**
 *   display: flex;
 *   flex-direction: row;
 *   height: 100%;
 */
export const CSS_CORE_FLEX_FULL_WIDTH = 'css_core_flex_full_width';
cssAddClass(CSS_CORE_FLEX_FULL_WIDTH, `  display: flex;  flex-direction: row;  height: 100%;`);

/**
 * display: flex;
 * justify-content: centerContainer;
 */
export const CSS_CORE_CENTER_SELF = 'css_core_center_self';
cssAddClass(CSS_CORE_CENTER_SELF, {
   display:           "flex",
   "justify-content": "center",
});