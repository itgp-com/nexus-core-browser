import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';
import {nexusMain} from '../../../NexusMain';
import {N2, N2Evt_DomAdded, N2Evt_OnHtml, N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {findN2ChildrenAllLevels} from '../../N2Utils';
import {StateN2, StateN2Ref} from '../../StateN2';
import {N2EjBasic} from '../N2EjBasic';
import {N2_VALIDATOR, N2ValidatorEvent} from '../StateN2Validator';

export interface StateN2FormRef extends StateN2Ref {
    widget?: N2Form;
    validator?: FormValidator;
}

export interface StateN2Form extends StateN2 {


    validatorModel?: FormValidatorModel;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2FormRef;

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
    static readonly CLASS_IDENTIFIER: string = 'N2Form'

    private initializedValidatorRulesFromChildren: boolean = false;

    constructor(state: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Form.CLASS_IDENTIFIER);
        if (state.validatorModel == null) {
            state.validatorModel = {rules: {}}; // initial value just in case it gets called before onDomAdded is processed
        }
        super.onStateInitialized(state)
    }


    onDOMAdded(args: N2Evt_DomAdded) {
        this._initializeValidator();//initialize at this point since the children are present
        super.onDOMAdded(args);
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
        return (anchor instanceof HTMLFormElement ? anchor : null);
    } // get htmlFormElement

    protected _initializeValidator() {
        let thisX = this;
        let state = this.state;

        if (state.validatorModel == null) {
            state.validatorModel = {rules: {}};
        }

        let htmlFormElement = this.htmlFormElement;
        if (htmlFormElement) {
            let validator: FormValidator = new FormValidator(htmlFormElement, state.validatorModel);
            state.ref.validator = validator;


            let f_existing_validate = validator.validate;
            validator.validate = (selected?: string): boolean => {
                if (!thisX.initializedValidatorRulesFromChildren) {
                    thisX.updateValidatorRulesFromChildren.call(thisX);
                    thisX.initializedValidatorRulesFromChildren = true;
                }
                return f_existing_validate.call(validator, selected);
            } // validate

        } // if htmlFormElement1
    } // if validatorModel

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
        let thisX = this;

        findN2ChildrenAllLevels(this).forEach((n2) => {
            if (n2?.state?.validationRule)
                _attachValidation.call(thisX, n2);
        });
    }

    public createEjObj(): void {
        // there is no Ej2 object for this class
    }


    get classIdentifier() {
        return N2Form.CLASS_IDENTIFIER;
    }
} // N2FormHtml


function _attachValidation(n2: N2): void {

    if (!n2)
        return; // no n2, nothing to validateF

    let htmlElement = n2?.htmlElementAnchor; // actual element representing the widget
    if (!htmlElement)
        return; // no html element, nothing to validate

    let n2Form: N2Form = this;
    let n2State = n2.state;

    let widgetName: string = htmlElement.getAttribute('name');
    if (!widgetName) {
        let name: string = n2State.tagId;
        if (name) {
            widgetName = name;
            htmlElement.setAttribute('name', widgetName);
        }
    }

    if (!widgetName)
        return; // if no name, there's nothing to validate here

    let existingRules = n2Form.getFormValidator().rules[widgetName];
    if (existingRules) {
        let rules = n2Form.getFormValidator().rules[widgetName]; // remove existing rules for this widget
        if (rules) {
            let n2_validation_rule = rules[N2_VALIDATOR];
            if (n2_validation_rule) {
                delete n2Form.getFormValidator().rules[widgetName][N2_VALIDATOR];
            }
        }
    }

    if ((n2State as any).validationRule) {

        const SYNCFUSION_VALIDATION_FUNCTION_TEMPLATE: string = '{0}';
        const LAST_VALIDATOR_RESULT: string = 'last_validator_result';


        /**
         * This function is called by Syncfusion twice:
         * 1. with regular parameters in order to to validate the widget
         * 2. the SYNCFUSION_VALIDATION_FUNCTION_TEMPLATE as a string parameter in order to obtain the error message
         * @param syncfusionArgs
         * @return {boolean | string}
         */
        let fnSyncfusionValidation = (syncfusionArgs: any): boolean | string => {

            if (typeof syncfusionArgs === 'string') {
                let string_args: string = syncfusionArgs;
                if (string_args === SYNCFUSION_VALIDATION_FUNCTION_TEMPLATE) {

                    let last_result: string = (fnSyncfusionValidation as any)[LAST_VALIDATOR_RESULT] as string;
                    (fnSyncfusionValidation as any)[LAST_VALIDATOR_RESULT] = null; // remove any old value

                    return (last_result ?? 'Error'); // ?? is the elvis operator (The ?? operator returns the left-hand operand if it's not null or undefined; otherwise, it returns the right-hand operand.)

                } else {
                    // no idea what this is
                    return `Error: unexpected parameter '${string_args}'`;
                }

            } else {

                // create N2ValidatorEvent, call n2Widget.validationRule
                let ev: N2ValidatorEvent = {
                    n2Widget: n2State.ref.widget,
                    element: syncfusionArgs?.element,
                    value: syncfusionArgs?.value,
                    error: null
                };

                if (n2State.validationRule) {
                    n2State.validationRule(ev);
                }

                let error_msg = ev.error;
                if (error_msg == '')
                    error_msg = null; // empty string means no error

                // set the value on the function instance itself, so when it's recursively called with the SYNCFUSION_VALIDATION_FUNCTION_TEMPLATE
                // it has access to the error message it generated
                (fnSyncfusionValidation as any)[LAST_VALIDATOR_RESULT] = error_msg; // save the error message

                return (error_msg == null); // null error message means success

            } // if (typeof syncfusionArgs === 'string'
        } // fnSyncfusionValidation

        // As far as Syncfusion is concerned, the validation is made of a custom function
        // and the error message will be returned by the same function with the '{0}' template
        // which means it will call the same function with the '{0}' as the parameter and expect the full
        // error message to be returned

        n2Form.getFormValidator().rules[widgetName] = {N2_VALIDATION_RULE: [fnSyncfusionValidation, SYNCFUSION_VALIDATION_FUNCTION_TEMPLATE]};
    } // if state.validationRule


} // attachValidation


nexusMain.UIStartedListeners.add((ev: any) => {
    //Overwrite Syncfusion order or calling errorMessages and the isValid so that errorMessage are called only after validation fails


    function showMessage__custom(errorRule: any): void {
        this.infoElement.style.display = 'block';
        this.infoElement.innerHTML = errorRule.message;

        let rulesObj = this.rules[`${errorRule.name}`]

        if (Object.hasOwnProperty.call(rulesObj, 'required'))
            this.checkRequired(errorRule.name);
    }

    //// ---- original function does not allow code to place errors for no characters even when required is not there ------------
    // showMessage(errorRule: ErrorRule): void {
    //     this.infoElement.style.display = 'block';
    //     this.infoElement.innerHTML = errorRule.message;
    //     this.checkRequired(errorRule.name);
    // }

    //Monkey-hammer the entire showMessage implementation
    (FormValidator.prototype as any).showMessage = showMessage__custom;


    // Validate each rule based on input element name
    function validateRules___custom(name: string): void {
        if (!this.rules[`${name}`]) {
            return;
        }
        const rules: string[] = Object.keys(this.rules[`${name}`]);
        let hiddenType: boolean = false;
        let validateHiddenType: boolean = false;
        const vhPos: number = rules.indexOf('validateHidden');
        const hPos: number = rules.indexOf('hidden');
        this.getInputElement(name);
        if (hPos !== -1) {
            hiddenType = true;
        }
        if (vhPos !== -1) {
            validateHiddenType = true;
        }
        if (!hiddenType || (hiddenType && validateHiddenType)) {
            if (vhPos !== -1) {
                rules.splice(vhPos, 1);
            }
            if (hPos !== -1) {
                rules.splice((hPos - 1), 1);
            }
            this.getErrorElement(name);
            for (const rule of rules) {
                //----------- removed call to getErrorMessages from here and moved below the next if ----------------
                const eventArgs: any = {
                    inputName: name,
                    element: this.inputElement,
                    message: ''
                };
                if (!this.isValid(name, rule) && !this.inputElement.classList.contains(this.ignore)) {

                    //---------- moved the errorMessage to fire AFTER we find out validation failed -------------------
                    const errorMessage: string = this.getErrorMessage(this.rules[`${name}`][`${rule}`], rule);
                    const errorRule: any = {name: name, message: errorMessage};
                    eventArgs.message = errorMessage;


                    this.removeErrorRules(name);
                    this.errorRules.push(errorRule);
                    // Set aria attributes to invalid elements
                    this.inputElement.setAttribute('aria-invalid', 'true');
                    this.inputElement.setAttribute('aria-describedby', this.inputElement.id + '-info');
                    const inputParent: HTMLElement = this.inputElement.parentElement;
                    const grandParent: HTMLElement = inputParent.parentElement;
                    if (inputParent.classList.contains('e-control-wrapper') || inputParent.classList.contains('e-wrapper') ||
                        (this.inputElement.classList.contains('e-input') && inputParent.classList.contains('e-input-group'))) {
                        inputParent.classList.add(this.errorClass);
                        inputParent.classList.remove(this.validClass);
                    } else if ((grandParent != null) && (grandParent.classList.contains('e-control-wrapper') ||
                        grandParent.classList.contains('e-wrapper'))) {
                        grandParent.classList.add(this.errorClass);
                        grandParent.classList.remove(this.validClass);
                    } else {
                        this.inputElement.classList.add(this.errorClass);
                        this.inputElement.classList.remove(this.validClass);
                    }
                    if (!this.infoElement) {
                        this.createErrorElement(name, errorRule.message, this.inputElement);
                    } else {
                        this.showMessage(errorRule);
                    }
                    eventArgs.errorElement = this.infoElement;
                    eventArgs.status = 'failure';
                    if (inputParent.classList.contains('e-control-wrapper') || inputParent.classList.contains('e-wrapper') ||
                        (this.inputElement.classList.contains('e-input') && inputParent.classList.contains('e-input-group'))) {
                        inputParent.classList.add(this.errorClass);
                        inputParent.classList.remove(this.validClass);
                    } else if ((grandParent != null) && (grandParent.classList.contains('e-control-wrapper') ||
                        grandParent.classList.contains('e-wrapper'))) {
                        grandParent.classList.add(this.errorClass);
                        grandParent.classList.remove(this.validClass);
                    } else {
                        this.inputElement.classList.add(this.errorClass);
                        this.inputElement.classList.remove(this.validClass);
                    }



                    let rulesObj = this.rules[`${errorRule.name}`]                  // added this line
                    if (Object.hasOwnProperty.call(rulesObj, 'required'))           // added this line to allow zero-length function validation when required not specified
                        this.optionalValidationStatus(name, eventArgs);



                    this.trigger('validationComplete', eventArgs);
                    // Set aria-required to required rule elements
                    if (rule === 'required') {
                        this.inputElement.setAttribute('aria-required', 'true');
                    }
                    break;
                } else {
                    this.hideMessage(name);
                    eventArgs.status = 'success';
                    this.trigger('validationComplete', eventArgs);
                }
            }
        } else {
            return;
        }
    }

    //Monkey-hammer the entire implementation
    (FormValidator.prototype as any).validateRules = validateRules___custom;

/*
    ---- original syncfusion implementation below ----------/
    // Validate each rule based on input element name
private validateRules(name: string): void {
        if (!this.rules[`${name}`]) {
        return;
    }
    const rules: string[] = Object.keys(this.rules[`${name}`]);
    let hiddenType: boolean = false;
    let validateHiddenType: boolean = false;
    const vhPos: number = rules.indexOf('validateHidden');
    const hPos: number = rules.indexOf('hidden');
    this.getInputElement(name);
    if (hPos !== -1) {
        hiddenType = true;
    }
    if (vhPos !== -1) {
        validateHiddenType = true;
    }
    if (!hiddenType || (hiddenType && validateHiddenType)) {
        if (vhPos !== -1) {
            rules.splice(vhPos, 1);
        }
        if (hPos !== -1) {
            rules.splice((hPos - 1), 1);
        }
        this.getErrorElement(name);
        for (const rule of rules) {
            const errorMessage: string = this.getErrorMessage(this.rules[`${name}`][`${rule}`], rule);
            const errorRule: ErrorRule = { name: name, message: errorMessage };
            const eventArgs: FormEventArgs = {
                inputName: name,
                element: this.inputElement,
                message: errorMessage
            };
            if (!this.isValid(name, rule) && !this.inputElement.classList.contains(this.ignore)) {
                this.removeErrorRules(name);
                this.errorRules.push(errorRule);
                // Set aria attributes to invalid elements
                this.inputElement.setAttribute('aria-invalid', 'true');
                this.inputElement.setAttribute('aria-describedby', this.inputElement.id + '-info');
                const inputParent: HTMLElement = this.inputElement.parentElement;
                const grandParent: HTMLElement = inputParent.parentElement;
                if (inputParent.classList.contains('e-control-wrapper') || inputParent.classList.contains('e-wrapper') ||
                    (this.inputElement.classList.contains('e-input') && inputParent.classList.contains('e-input-group'))) {
                    inputParent.classList.add(this.errorClass);
                    inputParent.classList.remove(this.validClass);
                }
                else if ((grandParent != null) && (grandParent.classList.contains('e-control-wrapper') ||
                    grandParent.classList.contains('e-wrapper'))) {
                    grandParent.classList.add(this.errorClass);
                    grandParent.classList.remove(this.validClass);
                }
                else {
                    this.inputElement.classList.add(this.errorClass);
                    this.inputElement.classList.remove(this.validClass);
                }
                if (!this.infoElement) {
                    this.createErrorElement(name, errorRule.message, this.inputElement);
                } else {
                    this.showMessage(errorRule);
                }
                eventArgs.errorElement = this.infoElement;
                eventArgs.status = 'failure';
                if (inputParent.classList.contains('e-control-wrapper') || inputParent.classList.contains('e-wrapper') ||
                    (this.inputElement.classList.contains('e-input') && inputParent.classList.contains('e-input-group'))) {
                    inputParent.classList.add(this.errorClass);
                    inputParent.classList.remove(this.validClass);
                }
                else if ((grandParent != null) && (grandParent.classList.contains('e-control-wrapper') ||
                    grandParent.classList.contains('e-wrapper'))) {
                    grandParent.classList.add(this.errorClass);
                    grandParent.classList.remove(this.validClass);
                }
                else {
                    this.inputElement.classList.add(this.errorClass);
                    this.inputElement.classList.remove(this.validClass);
                }
                this.optionalValidationStatus(name, eventArgs);
                this.trigger('validationComplete', eventArgs);
                // Set aria-required to required rule elements
                if (rule === 'required') {
                    this.inputElement.setAttribute('aria-required', 'true');
                }
                break;
            } else {
                this.hideMessage(name);
                eventArgs.status = 'success';
                this.trigger('validationComplete', eventArgs);
            }
        }
    } else {
        return;
    }
}
*/

}); // normal priority