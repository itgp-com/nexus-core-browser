import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';
import {Nx2EjBasic} from "../ej2/Nx2EjBasic";
import {Nx2Evt_OnHtml} from "../Nx2";
import {addNx2Class} from '../Nx2HtmlDecorator';
import {StateNx2, StateNx2Ref} from "../StateNx2";

export interface StateNx2FormRef extends StateNx2Ref{
    widget ?: Nx2FormHtml;
}

export interface StateNx2Form extends StateNx2 {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2FormRef;
}

export class Nx2FormHtml<STATE extends StateNx2Form = StateNx2Form> extends Nx2EjBasic<STATE> {
    constructor(state: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2FormHtml');
    }

    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
        let state = this.state;
        state.deco.tag = 'form';
        return super.onHtml(args);
    } // onHtml

    /**
     Returns the HTMLFormElement associated with this instance.
     @public
     @property {HTMLFormElement} htmlFormElement - The HTMLFormElement that is associated with the instance. If the associated anchor element is not an HTMLFormElement, this property will return null.
     @returns {HTMLFormElement} The associated HTMLFormElement, or null if the associated anchor element is not an HTMLFormElement.
     */
    public get htmlFormElement(): HTMLFormElement {
        let anchor = super.htmlElementAnchor;
        if (anchor instanceof HTMLFormElement) {
            return super.htmlElementAnchor as HTMLFormElement;
        } else {
            return null;
        }
    }

    /**
     * Creates and returns a new FormValidator instance using the associated HTMLFormElement and provided options.
     * @param {FormValidatorModel} options - The configuration options for the FormValidator.
     * @returns {FormValidator|null} A new FormValidator instance configured with the provided options and associated form element, or null if there is no associated HTMLFormElement.
     */
    getFormValidator(options: FormValidatorModel): FormValidator {
        let form = this.htmlFormElement;
        if (!form) {
            return null;
        }
        return new FormValidator(form, options);
    } // getFormValidator

    public createEjObj(): void {
        // there is no Ej2 object for this class
    }
} // Nx2FormHtml