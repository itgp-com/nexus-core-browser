import {FormValidator, FormValidatorModel} from "@syncfusion/ej2-inputs";
import {Nx2FormHtml, StateNx2Form, StateNx2FormRef} from "../../generic/Nx2FormHtml";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';


export interface StateNx2EjFormRef extends StateNx2FormRef {
    widget?: Nx2EjForm;
    validator?: FormValidator;
}

export interface StateNx2EjForm extends StateNx2Form {
    validatorModel?: FormValidatorModel;
    /**
     * By default, submit on enter is disabled
     */
    submitOnEnter?: boolean;
    ref?: StateNx2EjFormRef;
}


export class Nx2EjForm<STATE extends StateNx2EjForm = StateNx2EjForm> extends Nx2FormHtml<STATE> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjForm');
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

    protected _initializeValidator() {
        if (this.state.validatorModel) {
            let htmlElement = this.htmlElement;
            if (htmlElement instanceof HTMLFormElement) {
                this.state.ref.validator = new FormValidator(htmlElement, this.state.validatorModel);
            }
        }
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

}