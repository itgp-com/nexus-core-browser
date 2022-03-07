import {cssAddClass} from "./CoreUtils";
// import * as CSS                    from 'csstype';


/**
 *   display: flex;
 *   flex-direction: row;
 *   height: 100%;
 */
export const CSS_CORE_FLEX_FULL_WIDTH = 'css_core_flex_full_width';
cssAddClass(CSS_CORE_FLEX_FULL_WIDTH, `  display: flex;  flex-direction: row;  height: 100%;`);


/**
 * display: flex;
 * justify-content: space-around;
 */
export const CSS_CORE_CENTER_SELF = 'css_core_center_self';
// cssAddClass(CSS_CORE_CENTER_SELF, `display: flex;justify-content:space-around;`);
cssAddClass(CSS_CORE_CENTER_SELF, {
   display:"flex",
   "justify-content":"space-around",
});
// cssAddClass2(CSS_CORE_CENTER_SELF, {
//    display: "flex",
//    justifyContent: "space-around",
//
// } );

