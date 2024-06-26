import {CSS_CLASS_grid_cell_detail_container, CSS_CLASS_grid_cell_detail_value} from '../../Constants';
import {cssAdd} from '../../CssUtils';
import {IHtmlUtils, N2HtmlDecorator} from '../N2HtmlDecorator';
import {CSS_VARS_CORE} from '../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../Theming';

export const HIGHLIGHT_TAG_OPEN: string = '::{';
export const HIGHLIGHT_TAG_CLOSE: string = '}::'
export const CSS_CLASS_N2_HIGHLIGHT_STRONG: string = 'n2-highlight-strong';
export const CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS: string = 'n2-highlight-surroundings';
export const CSS_VAR_APP_COLOR_YELLOW_01: string = '--app-color-yellow-01';
export const CSS_VAR_APP_COLOR_YELLOW_01_50PCT: string = '--app-color-yellow-01-50pct';

//----------  Variables below are public so they can be overwritten if needed  ---------------

export const highlight_deco: N2HtmlDecorator = {
    tag: 'span',
    classes: [CSS_CLASS_N2_HIGHLIGHT_STRONG]
}

export let highlight_record_column_name: string = '___highlights___';
export let highlight_record_column_nls_text_matches: string = '___nls_text_matches___';
export let highlight_record_column_values: string = '___highlight_values___';

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

themeChangeListeners().add((ev: ThemeChangeEvent) => {


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
      top: -6px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 6px solid var(${CSS_VAR_APP_COLOR_YELLOW_01_50PCT});
      border-radius: 10px;
      pointer-events: none;
      box-sizing: border-box;
}    

    `); // end cssAdd

});

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
export function highlight_apply(innerHTML: string) {
    let highlight_tag_open_html = getHighlightTagOpenHtml();
    let highlight_tag_close_html = getHighlightTagCloseHtml();
    return innerHTML.replace(new RegExp(HIGHLIGHT_TAG_OPEN, 'g'), highlight_tag_open_html)
        .replace(new RegExp(HIGHLIGHT_TAG_CLOSE, 'g'), highlight_tag_close_html);
}

/**
 * Retrieves the highlighted value for a specified field from a record.
 * If there is no highlighted value, it returns the original value from the record.
 *
 * @param {any} record - The record containing field values and optionally highlighted values.
 * @param {string} field - The field name to retrieve the value for.
 * @returns {string} - The highlighted value or the original value if no highlight exists. Returns null if the record is invalid.
 */
export function highlight_value(record: any, field: string): any {
    if (!record)
        return null;
    let highlights = record[highlight_record_column_values];
    if (!highlights)
        return record[field]; // return actual value when no highlighting
    let value = highlights[field];
    if (value)
        value = highlight_apply(value); // expand placeholders to HTML
    else
        value = record[field]; // if no highlight, use the original value
    return value;
}


export interface RecFieldVal {
    /**
     * the internal value for the field as straight record[field]
     */
    value: any;
    /**
     * if highlighted, the value will have the HTML highlighting tags
     * If not highlighted, this will be the same as value (internal value as rec[field]
     */
    value_visible: any;
    /**
     * true if the value is highlighted, false if not
     */
    is_highlighted: boolean;
}

export function rec_field_value(record: any, field: string): RecFieldVal {
    let fieldval: RecFieldVal = {value: null, value_visible: null, is_highlighted: false};

    if (record) {
        fieldval.value = record[field]; // return actual value when no highlighting
        let highlights = record[highlight_record_column_values];
        if (!highlights) {
            fieldval.value_visible = record[field];
        } else {
            if (fieldval.value)
                fieldval.value_visible = highlight_apply(fieldval.value); // expand placeholders to HTML
            fieldval.is_highlighted = true;
        }
    } // if record
    return fieldval;
} // rec_field_value

export function isRecFieldVal(obj: any): obj is RecFieldVal {
    return obj && obj.value !== undefined && obj.value_visible !== undefined && obj.is_highlighted !== undefined;
}