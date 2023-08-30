import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';
import {N2Evt_OnHtml, N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {findN2ChildrenAllLevels, findParentN2ByClass} from '../../N2Utils';
import {StateN2, StateN2Ref} from '../../StateN2';
import {N2EjBasic} from '../N2EjBasic';
import {N2_VALIDATION_RULE, ValidationErrorMessage, ValidationEvent} from '../StateN2Validator';

export interface StateN2FormRef extends StateN2Ref{
    widget ?: N2Form;
    validator?: FormValidator;
}

export interface StateN2Form extends StateN2 {


    validatorModel?: FormValidatorModel;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateN2FormRef;

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
export class N2Form<STATE extends StateN2Form = StateN2Form> extends N2EjBasic<STATE> {
    static readonly CLASS_IDENTIFIER:string = 'N2Form'

    private initializedValidatorRulesFromChildren:boolean = false;

    constructor(state: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Form.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }



    onLogic(args: N2Evt_OnLogic) {
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

    onHtml(args: N2Evt_OnHtml): HTMLElement {
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
        let state = this.state;
        if (state.validatorModel) {
            let htmlFormElement = this.htmlFormElement;
            if (htmlFormElement) {
                let validator : FormValidator = new FormValidator(htmlFormElement, state.validatorModel);
                state.ref.validator = validator;


                let fnValidate = validator.validate;
                validator.validate = (selected?: string):boolean =>{
                    if ( !this.initializedValidatorRulesFromChildren) {
                        this.updateValidatorRulesFromChildren();
                        this.initializedValidatorRulesFromChildren = true;
                    }
                    return fnValidate.call(validator, selected);
                } // validate

            } // if htmlFormElement1
        } // if validatorModel
    }

    /**
     * Get validationRule created if there was a validatorModel property defined in state.
     *
     * You can always create a new FormValidator by setting/changing the validatorModel property in state, then calling updateValidator()
     * @return {FormValidator}
     */
    public getFormValidator(): FormValidator {
        return this.state?.ref?.validator;
    }

    /**
     * Create/Recreate the FormValidator based on the current settings in state.validatorModel
     */
    public updateValidator() {
        this._initializeValidator();
    }

    /**
     * Update the validationRule rules for all N2 children of all levels  of this instance that have an validationRule property defined in the state
     */
    public updateValidatorRulesFromChildren() {

        findN2ChildrenAllLevels(this).forEach((n2) => {
            let state = n2.state;
            if ( state?.validationRule){
                attachValidation(state);
            } // if state?.validationRule
        });
    }

    public createEjObj(): void {
        // there is no Ej2 object for this class
    }


    get classIdentifier() {
        return N2Form.CLASS_IDENTIFIER;
    }
} // N2FormHtml


export function attachValidation(n2State: StateN2) : void {

    let n2Form = findParentN2ByClass<N2Form>(n2State.ref.widget, N2Form.CLASS_IDENTIFIER);
    if (!n2Form)
        return; // if no form, nothing to attach

    let widgetName: string = n2State['name'];
    if (!widgetName)
        return; // if no name, there's nothing to validate here


    let existingRules = n2Form.getFormValidator().rules[widgetName];
    if (existingRules) {
        let rules = n2Form.getFormValidator().rules[widgetName]; // remove existing rules for this widget
        if ( rules) {
            let n2_validation_rule = rules[N2_VALIDATION_RULE];
            if (n2_validation_rule) {
                delete n2Form.getFormValidator().rules[widgetName][N2_VALIDATION_RULE];
            }
        }
    }

    if ( (n2State as any).validationRule) {

        let fnSyncfusionValidation = (syncfusionArgs: any): boolean | string => {

            let vData: any = null;
            if ((n2State as any)?.validationRule?.data) {
                let validatorFunctionOrData = (n2State as any)?.validationRule?.data;
                if (typeof validatorFunctionOrData === 'function') {
                    try {
                        vData = validatorFunctionOrData();
                    } catch (e) {
                        console.log(`Error in validationRule.data function for '${widgetName}': `, e);
                    }
                } else {
                    vData = validatorFunctionOrData;
                }
            } // if data


            if (typeof syncfusionArgs === 'string') {
                if ((n2State as any)?.validationRule?.errorMessage) {
                    // create ValidationErrorMessage, call n2Widget.errorMessage
                    let validationErrorMessage: ValidationErrorMessage = {
                        n2Widget: n2State.ref.widget,
                        data: vData
                    }
                    return (n2State as any).validationRule.errorMessage(validationErrorMessage);
                } else {
                    return 'Error';
                }
            } else {
                // create ValidationEvent, call n2Widget.validationRule
                let validationEvent: ValidationEvent = {
                    n2Widget: n2State.ref.widget,
                    element: syncfusionArgs?.element,
                    value: syncfusionArgs?.value,
                    data: vData
                };
                return (n2State as any).validationRule.validator(validationEvent);
            }
        } // fnSyncfusionValidation

        // As far as Syncfusion is concerned, the validation is made of a custom function
        // and the error message will be returned by the same function with the '{0}' template
        // which means it will call the same function with the '{0}' as the parameter and expect the full
        // error message to be

        n2Form.getFormValidator().rules[widgetName] = {N2_VALIDATION_RULE: [fnSyncfusionValidation, '{0}']};
    } // if state.validationRule


} // attachValidation