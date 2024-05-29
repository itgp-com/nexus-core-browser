import {cssAddClass, cssAddSelector} from "../../CoreUtils";
import {nexusMain} from '../../NexusMain';

export const CSS_FLEX_MAX_XY: string = "flex-component-max flex-full-height";
export const CSS_FLEX_MAX_HEIGHT: string = "flex-full-height";
export const CSS_FLEX_MAX_WIDTH: string = "flex-full-width";
export const CSS_FLEX_ROW_DIRECTION: string = "flex-container-row";
export const CSS_FLEX_COL_DIRECTION: string = "flex-container-column";
export const CSS_FLEX_COL_DIRECTION_MAX: string = "core-full";
export const CSS_FLEX_CENTER_MAIN_AXIS: string = "flex-mainAxis-centerContainer";
export const CSS_FLEX_CENTER_SELF: string = "flex-align-self-centerContainer";
export const CSS_FLEX_CONTAINER: string = "flex-container-lcr";
export const CSS_FLEX_CONTAINER_CENTERING: string = "flex-lcr-box";
export const CSS_FLEX_CONTAINER_LEFT_JUSTIFIED: string = "flex-lcr-box-leftContainer";
export const CSS_FLEX_CONTAINER_RIGHT_JUSTIFIED: string = "flex-lcr-box-rightContainer";
export const CSS_MAX_XY: string = "core_height_width_100_percent";
export const CSS_CLASS_grid_btn_font_awesome: string = 'grid-btn-font-awesome';

export const CSS_CLASS_vertical_spacer: string = 'core_vertical_spacer';
export const CSS_CLASS_horizontal_spacer: string = 'core-horizontal-spacer';
export const CSS_CLASS_row_number_001: string = 'core_row_number_001';
export const CSS_CLASS_core_island_001: string = 'core_island_001';
/**
 * Added next to e-grid and N2Grid, WxGrid when the customized excel filter is present
 * CSS looks for this class in order to position the sort indicators (arrow and sort order number bubble) correctly
 * */
export const CSS_CLASS_GRID_FILTER_MENU_PRESENT: string = 'grid_filter_menu_present';

export const CSS_CLASS_horizontal_divider: string = 'core_horizontal_divider';


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
export const CSS_CORE_FLEX_FULL_WIDTH: string = 'css_core_flex_full_width';
/**
 *    display: flex;
 *  justify-content: center; // Centers horizontally
 *  align-items: center; // Centers vertically
 *  height: 100%; // Takes full height of the parent
 *  width: 100%; // Takes full width of the parent
 */
export const CSS_CORE_FLEX_CENTER_ALL_FULL: string = 'css_core_flex_center_all_full';

/**
 * display: flex;
 * justify-content: centerContainer;
 */


nexusMain.UIStartedListeners.add(async () => {

    cssAddClass(CSS_CORE_FLEX_FULL_WIDTH, `  display: flex;  flex-direction: row;  height: 100%;`);


    cssAddClass(CSS_CORE_FLEX_CENTER_ALL_FULL, ` 
    display: flex;
    justify-content: center; 
    align-items: center; 
    height: 100%; 
    width: 100%; 
    `);

// remove ugly extra space from tooltip if we have more than one html element. HTML will handle itself
    cssAddSelector(`.tippy-box .tippy-content`,
        `
  white-space: unset;
  `);

    // cssAddSelector(
    //     ``,
    //     ``);


}) // regular priority