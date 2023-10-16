import {N2} from '../../../N2';

/**
 * Sets the placeholder text for the input element within a widget's wrapper.
 *
 * If the widget exists, it retrieves the wrapper ID from the widget's state,
 * then selects the input element within the wrapper and sets its placeholder attribute.
 *
 * @param {N2} widget - The widget instance containing the input element.
 * @param {string} placeholderText - The text to set as the placeholder.
 */
export function placeholderWrapperInput(widget:N2, placelholderText: string){
    if (widget){
        let wrapper_id = widget.state?.wrapperTagId;
        const selectedInput = document.getElementById(wrapper_id).querySelector('input');
        if (selectedInput) {
            selectedInput.setAttribute('placeholder', placelholderText);
        }
    }
} // placeholderWrapperInput