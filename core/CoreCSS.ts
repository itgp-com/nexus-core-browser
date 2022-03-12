import {cssAddClass} from "./CoreUtils";

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
 * justify-content: center;
 */
export const CSS_CORE_CENTER_SELF = 'css_core_center_self';
cssAddClass(CSS_CORE_CENTER_SELF, {
   display:"flex",
   "justify-content":"center",
});

