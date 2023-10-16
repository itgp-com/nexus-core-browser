import {N2Ej} from '../../N2Ej';

/**
 * Sets the placeholder text for an input element within an N2Ej widget's parent element.
 *
 * If the widget exists, it retrieves the input element within the widget's parent element
 * and sets its placeholder attribute to the specified text.
 *
 * @param {N2Ej} widget - The N2Ej widget instance containing the input element.
 * @param {string} placeholderText - The text to set as the placeholder.
 */
export function placeholderN2EjInput(widget:N2Ej, placeholderText:string) {
    if (widget) {
        const selectedInput = widget.obj?.element?.parentElement?.querySelector('input');

        if (selectedInput) {
            selectedInput.setAttribute('placeholder', placeholderText);
        }
    }
} // placeholderN2EjInput