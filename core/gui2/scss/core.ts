import {cssAddClass} from "../../CoreUtils";

export const CSS_FLEX_MAX_XY = "flex-component-max flex-full-height";
export const CSS_FLEX_MAX_HEIGHT = "flex-full-height";
export const CSS_FLEX_MAX_WIDTH = "flex-full-width";
export const CSS_FLEX_ROW_DIRECTION = "flex-container-row";
export const CSS_FLEX_COL_DIRECTION = "flex-container-column";
export const CSS_FLEX_COL_DIRECTION_MAX = "core-full";
export const CSS_FLEX_CENTER_MAIN_AXIS = "flex-mainAxis-centerContainer";
export const CSS_FLEX_CENTER_SELF = "flex-align-self-centerContainer";
export const CSS_FLEX_CONTAINER = "flex-container-lcr";
export const CSS_FLEX_CONTAINER_CENTERING = "flex-lcr-box";
export const CSS_FLEX_CONTAINER_LEFT_JUSTIFIED = "flex-lcr-box-leftContainer";
export const CSS_FLEX_CONTAINER_RIGHT_JUSTIFIED = "flex-lcr-box-rightContainer";
export const CSS_MAX_XY = "core_height_width_100_percent";
export const CSS_CLASS_grid_btn_font_awesome: string = 'grid-btn-font-awesome';

export const CSS_CLASS_vertical_spacer = 'core_vertical_spacer';
export const CSS_CLASS_horizontal_spacer = 'core-horizontal-spacer';
export const CSS_CLASS_row_number_001 = 'core_row_number_001';
/**
 * Added next to e-grid and N2Grid, WxGrid when the customized excel filter is present
 * CSS looks for this class in order to position the sort indicators (arrow and sort order number bubble) correctly
 * */
export const CSS_CLASS_GRID_FILTER_MENU_PRESENT = 'grid_filter_menu_present';

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
    display: "flex",
    "justify-content": "center",
});