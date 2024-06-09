import {CSS_CLASS_grid_cell_detail_container, CSS_CLASS_grid_cell_detail_value} from '../../Constants';
import {cssAdd} from '../../CssUtils';
import {IHtmlUtils, N2HtmlDecorator} from '../N2HtmlDecorator';
import {CSS_VARS_CORE} from '../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../Theming';

export const HIGHLIGHT_TAG_OPEN:string  = '::{' ;
export const HIGHLIGHT_TAG_CLOSE:string  = '}::'
export const CSS_CLASS_N2_HIGHLIGHT_STRONG:string = 'n2-highlight-strong';
export const CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS:string = 'n2-highlight-surroundings';
export const CSS_VAR_APP_COLOR_YELLOW_01:string = '--app-color-yellow-01';
export const CSS_VAR_APP_COLOR_YELLOW_01_50PCT:string = '--app-color-yellow-01-50pct';

//----------  Variables below are public so they can be overwritten if needed  ---------------

export const highlight_deco:N2HtmlDecorator = {
    tag: 'span',
    classes : [CSS_CLASS_N2_HIGHLIGHT_STRONG]
}

export let highlight_record_column_name:string = '___highlights___';
export let highlight_record_column_nls_text_matches:string = '___nls_text_matches___';

/**
 * Overwritable function to get the HTML for the opening highlight tag.
 * @return {string}
 */
export function getHighlightTagOpenHtml() {
    return `<${highlight_deco.tag} ${IHtmlUtils.all(highlight_deco)}>`;
}

/**
 * Overwritable function to get the HTML for the closing highlight tag.
 * @return {string}
 */
export function getHighlightTagCloseHtml() {
    return `</${highlight_deco.tag}>`;
}

/**
 * The highlight_apply function uses new RegExp(HIGHLIGHT_TAG_OPEN, 'g') and new RegExp(HIGHLIGHT_TAG_CLOSE, 'g') to create global regular expressions.
 *
 * In JavaScript, { and } have special meanings in regex (denoting quantifiers), but they are not active unless they follow a digit and are properly formatted as quantifiers (e.g., {3} or {1,4}). Since we are using them as part of a larger string (:: as prefix and suffix), they are treated as literal characters.
 *
 * Example:
 * ```typescript
 * const example = "This is a ::{highlighted}:: text.";
 * const result = highlight_apply(example);
 * console.log(result);
 * // Output: This is a <span class="n2-highlight-strong">highlighted</span> text.
 * ```
 *
 * @param {string} innerHTML - The input string containing the text to be highlighted.
 * @return {string} - The processed string with highlight tags replaced by HTML span elements.
 */
export function highlight_apply(innerHTML:string) {
    let highlight_tag_open_html = getHighlightTagOpenHtml();
    let highlight_tag_close_html = getHighlightTagCloseHtml();
    return innerHTML.replace(new RegExp(HIGHLIGHT_TAG_OPEN, 'g'), highlight_tag_open_html)
        .replace(new RegExp(HIGHLIGHT_TAG_CLOSE, 'g'), highlight_tag_close_html);
}

themeChangeListeners().add((ev:ThemeChangeEvent) => {
    // cssAddSelector(`.${CSS_CLASS_N2_HIGHLIGHT_STRONG}`, `
    // background-color: ${(ev.newState.theme_type === 'dark' ? CSS_VARS_CORE.app_color_yellow_02 : CSS_VARS_CORE.app_color_yellow_01)};
    // color: black;
    // padding: 1px 4px;
    // border: 1px dashed var(--app-color-gray-400);
    // border-radius: 10px;
    // font-weight: bold;
    // `
    // );



    cssAdd(`
    
.${CSS_CLASS_N2_HIGHLIGHT_STRONG} {
    background-color: ${(ev.newState.theme_type === 'dark' ? CSS_VARS_CORE.app_color_yellow_02 : CSS_VARS_CORE.app_color_yellow_01)};
    color: black;
    padding: 1px 4px;
    border: 1px dashed var(--app-color-gray-400);
    border-radius: 10px;
    font-weight: bold;    
}
    
:root {
    ${CSS_VAR_APP_COLOR_YELLOW_01_50PCT}: rgba(254, 254, 78, 0.5);
}

.${CSS_CLASS_grid_cell_detail_container} .${CSS_CLASS_grid_cell_detail_value}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS} {
        position: relative;
        border: 2px dashed var(--app-color-gray-500);
        border-radius: 10px;
} 

.${CSS_CLASS_grid_cell_detail_container} .${CSS_CLASS_grid_cell_detail_value}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}::before {
      content: '';
      position: absolute;
      // top: -6px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 6px solid var(${CSS_VAR_APP_COLOR_YELLOW_01_50PCT});
      border-radius: 10px;
      pointer-events: none;
      box-sizing: border-box;
}    

    `); // end cssAdd


    //
    // cssAddSelector(`.${CSS_CLASS_grid_cell_detail_container} .${CSS_CLASS_grid_cell_detail_value}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}`, `
    //     position: relative;
    //     border: 2px dashed var(--app-color-gray-500);
    //     border-radius: 10px;
    // `
    // );
    //
    // cssAddSelector(`.${CSS_CLASS_grid_cell_detail_container} .${CSS_CLASS_grid_cell_detail_value}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}::before`, `
    //   content: '';
    //   position: absolute;
    //   top: -6px;
    //   left: -4px;
    //   right: -4px;
    //   bottom: -4px;
    //   border: 6px solid var(${CSS_VAR_APP_COLOR_YELLOW_01_50PCT});
    //   border-radius: 10px;
    //   pointer-events: none;
    //   box-sizing: border-box;
    // `
    // );








    // cssAddSelector(`.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}`, `
    //     position: relative;
    // `
    // );
    //
    // cssAddSelector(`.${CSS_CLASS_grid_cell_detail_container} .${CSS_CLASS_grid_cell_detail_value}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}`, `
    //     border: 2px dashed var(--app-color-blue-01);
    //     position: relative;
    // `
    // );
    //
    // cssAddSelector(`.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}::before`, `
    //   content: '';
    //   position: absolute;
    //   top: -4px;
    //   left: -4px;
    //   right: -4px;
    //   bottom: -4px;
    //   box-shadow: 0 0 0 4px var(--app-color-yellow-01), 0 0 10px 4px var(--app-color-yellow-01, 0.5);
    //   pointer-events: none;
    // `
    // );
});