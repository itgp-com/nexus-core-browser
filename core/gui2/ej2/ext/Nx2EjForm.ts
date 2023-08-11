import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';
import {Nx2EjBasic} from "../Nx2EjBasic";
import {Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {StateNx2, StateNx2Ref} from "../../StateNx2";

export interface StateNx2EjFormRef extends StateNx2Ref{
    widget ?: Nx2EjForm;
    validator?: FormValidator;
}

export interface StateNx2EjForm extends StateNx2 {


    validatorModel?: FormValidatorModel;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjFormRef;

    /**
     * By default, submit on enter is disabled
     */
    submitOnEnter?: boolean;
}

/**
 * This is a basic Form widget that creates a simple HTMLFormElement.
 * It also provides a way to get an EJ2 FormValidator instance that acts upon the HTMLFormElement.
 *
 */
export class Nx2EjForm<STATE extends StateNx2EjForm = StateNx2EjForm> extends Nx2EjBasic<STATE> {
    constructor(state: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2FormHtml');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);
        try {

            if (this?.state?.submitOnEnter) {
                // allow submit on enter
            } else {
                // no submit on enter
                this.htmlElement.addEventListener('keydown', (evt: KeyboardEvent) => {
                    if (evt.key === 'Enter') {
                        evt.preventDefault();
                        // Handle the Enter key press here if needed
                    } // if
                }) // addEventListener
            } // if

            this._initializeValidator()
        } catch (e) {
            console.error(e); // not a user error
        }
    } // onLogic

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
            let formElement:HTMLFormElement = super.htmlElementAnchor as HTMLFormElement;

            return formElement;
        } else {
            return null;
        }
    }

    protected _initializeValidator() {
        if (this.state.validatorModel) {
            let htmlFormElement = this.htmlFormElement;
            if (htmlFormElement) {
                this.state.ref.validator = new FormValidator(htmlFormElement, this.state.validatorModel);
            } // if htmlFormElement1
        } // if validatorModel
    }

    /**
     * Get validator created if there was a validatorModel property defined in state.
     *
     * You can always create a new FormValidator by setting/changing the validatorModel property in state, then calling updateValidator()
     * @return {FormValidator}
     */
    public getFormValidator(): FormValidator {
        return this.state?.ref?.validator;
    }

    /**
     * Create/Recreate the validator based on the current setttings in state.validatorModel
     */
    public updateValidator() {
        this._initializeValidator();
    }

    public createEjObj(): void {
        // there is no Ej2 object for this class
    }
} // Nx2FormHtml