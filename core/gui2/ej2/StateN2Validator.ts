import {N2} from '../N2';

export const N2_VALIDATOR:string = '_n2_validator';

/**
 * The interface inside StateN2 that allows an N2Validator to be defined
 */
export interface StateN2Validator<WIDGET extends N2 = N2> {
    validationRule ?: N2Validator<WIDGET>;
}
/**
 * Represents an event object for N2 validator functions.
 * @template WIDGET - The type of N2 widget being validated, must extend N2.
 * @template DATATYPE - The type of data being validated, defaults to any.
 */
export interface N2ValidatorEvent<WIDGET extends N2 = N2, DATATYPE = any> {
    /** The N2 widget instance being validated. */
    n2Widget: WIDGET;

    /** The HTML element associated with the widget. */
    element: HTMLElement;

    /** The current value of the widget being validated. */
    value: DATATYPE;

    /**
     * The error message.
     * Always comes in null
     * Should be returned null or empty string if no error, or an error message if there is an error.
     * This should be set by the validator function if the value is invalid.
     */
    error?: string;
}

/**
 * Represents a validator function for N2 widgets.
 * @template WIDGET - The type of N2 widget being validated, must extend N2.
 * @template DATATYPE - The type of data being validated, defaults to any.
 *
 * @param ev - The validation event object.
 *
 * @returns void
 *
 * @description
 * The validator function should:
 * - Set `ev.error` to a non-null/non-empty error message string if there is an error in `ev.value`.
 * - Do absolutely nothing if the value is valid.
 *
 * @example
 * const myValidator: N2Validator<N2TextField, string> = (ev) => {
 *   if (ev.value.length < 3) {
 *     ev.error = "Input must be at least 3 characters long";
 *   }
 * };
 */
export type N2Validator<WIDGET extends N2, DATATYPE = any> = (ev: N2ValidatorEvent<WIDGET, DATATYPE>) => void;