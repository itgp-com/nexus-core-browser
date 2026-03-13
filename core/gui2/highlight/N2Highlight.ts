import {isArray} from 'lodash';
import {
    CSS_CLASS_grid_cell_detail_container,
    CSS_CLASS_grid_cell_detail_value,
    CSS_CLASS_grid_cell_highlight_container
} from '../../Constants';
import {cssAdd} from '../../CssUtils';
import {N2Grid} from '../ej2/ext/N2Grid';
import {addClassesToElement, IHtmlUtils, N2HtmlDecorator} from '../N2HtmlDecorator';
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

export const HIGHLIGHT_RECORD_COLUMN_NAME: string = '___highlights___';
// export const HIGHLIGHT_RECORD_COLUMN_NLS_TEXT_MATCHES: string = '___nls_text_matches___';
export const HIGHLIGHT_RECORD_COLUMN_VALUES: string = '___highlight_values___';
export const HIGHLIGHT_RECORD_COLUMN_EXCERPTS: string = '___highlight_values_excerpts___';

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

//And interface for an object with string key, string content, without knowing the key values at compile time
export interface HighlightedExcerpts {
    [key: string]: string;
} // HighlightedExcerpt

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


.${N2Grid.CLASS_IDENTIFIER} .${CSS_CLASS_grid_cell_highlight_container}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS} {
        position: relative;
        border: 2px dashed var(--app-color-gray-500);
        border-radius: 6px;
        padding: 0 3px;
}

.${N2Grid.CLASS_IDENTIFIER} .${CSS_CLASS_grid_cell_highlight_container}.${CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS}::before {
      content: '';
      position: absolute;
      top: -6px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 6px solid var(${CSS_VAR_APP_COLOR_YELLOW_01_50PCT});
      border-radius: 6px;
      pointer-events: none;
      box-sizing: border-box;
}  


    `); // end cssAdd

});

/**
 * Checks if a record contains highlighting.
 * @param record
 * @return {any}
 */
export function containsHighlighing(record: any) {
    return record && (record[HIGHLIGHT_RECORD_COLUMN_NAME]);
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
 * @param {string} value - The input string containing the text to be highlighted.
 * @return {string} - The processed string with highlight tags replaced by HTML span elements.
 */
export function highlight_apply(value: any): string | string[] {
    if (value == null || value == '') {
        return ''; //empty string even for null since it's a highlighted string (Always a string)
    } else if (isArray(value)) {
        let arrayRawValues = value as any[];
        // noinspection UnnecessaryLocalVariableJS
        let arrayValues: string[] = arrayRawValues.map((v) => highlight_apply(v) as string);
        return arrayValues;
    } else {
        try {

            // from here on it's a real string
            let highlight_tag_open_html = getHighlightTagOpenHtml();
            let highlight_tag_close_html = getHighlightTagCloseHtml();

            return value.toString().replace(new RegExp(HIGHLIGHT_TAG_OPEN, 'g'), highlight_tag_open_html)
                .replace(new RegExp(HIGHLIGHT_TAG_CLOSE, 'g'), highlight_tag_close_html);
        } catch (e) {
            console.error('Error in highlight_apply', e);
            return value;
        }
    } // if else


//
// if ( !(value && (isString(value) || isArray(value)) ) ) {
//     // null, empty string, or non-string input
//     return value;
// }
//
// // from here on it's a real string
// let highlight_tag_open_html = getHighlightTagOpenHtml();
// let highlight_tag_close_html = getHighlightTagCloseHtml();
// try {
//
//
//
//
//     return value.replace(new RegExp(HIGHLIGHT_TAG_OPEN, 'g'), highlight_tag_open_html)
//         .replace(new RegExp(HIGHLIGHT_TAG_CLOSE, 'g'), highlight_tag_close_html);
// } catch (e) {
//     console.error('Error in highlight_apply', e);
//     return value;
// }

} // highlight_apply


/**
 * Retrieves the highlighted value for a specified field from a record.
 * If there is no highlighted value, it returns the original value from the record.
 *
 * @param {any} record - The record containing field values and optionally highlighted values.
 * @param {string} field - The field name to retrieve the value for.
 * @returns {string} - The highlighted value or the original value if no highlight exists. Returns null if the record is invalid.
 */
export function highlight_value(record: any, field: string): any {
    let value = highlighted_raw_value(record, field);
    if (value)
        value = highlight_apply(value); // expand placeholders to HTML
    else
        value = record[field]; // if no highlight, use the original value
    return value;
}

export function highlighted_raw_value(record: any, field: string): any {
    if (!record)
        return null;
    let highlights = record[HIGHLIGHT_RECORD_COLUMN_VALUES];
    if (!highlights)
        return record[field]; // return actual value when no highlighting
    return highlights[field]; // could be null
}


export interface RecFieldVal {
    /**
     * true if the value is highlighted, false if not
     */
    is_highlighted: boolean;

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
     * Automated tooltip content.
     */
    value_tooltip: any;
}

export function rec_field_value(record: any, field: string): RecFieldVal {
    let recFieldVal: RecFieldVal = {value: null, value_visible: null, is_highlighted: false, value_tooltip: null};

    if (record) {
        recFieldVal.value = record[field]; // return actual value when no highlighting

        recFieldVal.is_highlighted = isFieldHighlightedInRecord(record, field); // column should be highlighted, but there might be no actual text inside to highlight

        let highlighted_values = record[HIGHLIGHT_RECORD_COLUMN_VALUES];
        let highlighted_excerpts = record[HIGHLIGHT_RECORD_COLUMN_EXCERPTS];

        let fieldValue = (highlighted_values == null ? null:  highlight_apply(highlighted_values[field]) );
        let fieldExcerpt = (highlighted_excerpts == null ? null : highlight_apply(highlighted_excerpts[field]) );

        recFieldVal.value_visible = recFieldVal.value; // start here
        if (!highlighted_values) {
            recFieldVal.value_visible = record[field];
        } else {
            if (fieldValue)
                recFieldVal.value_visible = fieldValue;
        } // if highlighted_values

        recFieldVal.value_tooltip = recFieldVal.value_visible;
        if (!fieldValue && fieldExcerpt)
            recFieldVal.value_tooltip = fieldExcerpt; // if no columnValue, use columnExcerpt for tooltip

    } // if record
    return recFieldVal;
} // rec_field_value

export function isRecFieldVal(obj: any): obj is RecFieldVal {
    return obj && obj.hasOwnProperty('value') && obj.hasOwnProperty('value_visible') && obj.hasOwnProperty('is_highlighted');
}

export function highlighted_grid_cell_content(): HTMLElement {
    let wrapper_highlight: HTMLElement = document.createElement('div');
    addClassesToElement(wrapper_highlight, [CSS_CLASS_grid_cell_highlight_container, CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS]);
    return wrapper_highlight;
}

export function isFieldHighlightedInRecord(record: any, field: string): boolean {
    if (!record || !field)
        return false;
    let highlighted_fields = record[HIGHLIGHT_RECORD_COLUMN_NAME];
    return highlighted_fields && isArray(highlighted_fields) && highlighted_fields.includes(field);
} // isFieldHighlightedInRecord