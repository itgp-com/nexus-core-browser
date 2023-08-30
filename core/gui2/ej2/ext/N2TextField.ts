import {TextBox, TextBoxModel} from '@syncfusion/ej2-inputs';
import {StateN2PropertyName} from '../../generic/StateN2PropertyName';
import {N2Evt_OnHtml} from '../../N2';
import {addN2Class, IHtmlUtils, N2HtmlDecorator} from '../../N2HtmlDecorator';
import {createN2HtmlBasic, createN2HtmlBasicFromDecorator, findHtmlInputElement} from '../../N2Utils';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {StateN2Validator, ValidationRuleDetails} from '../StateN2Validator';

export enum TextFieldType_Ej2_Material {
    regular = '',
    filled = 'e-filled',
    outline = 'e-outline',
}

export interface StateN2TextFieldRef extends StateN2EjBasicRef {
    widget?: N2TextField;
    errorElement?: HTMLElement;
    labelElement?: HTMLElement;
    wrapperElement?: HTMLElement;
}

export interface StateN2TextField<WIDGET extends N2TextField = N2TextField> extends StateN2EjBasic<TextBoxModel>, StateN2PropertyName, StateN2Validator {

    required?: boolean;

    validationRule?: ValidationRuleDetails<WIDGET>;

    /**
     * Defaults to always having an error line.
     * Set to true to not include the error HTMLElement
     */
    noErrorLine?: boolean;

    labelDecorator?: N2HtmlDecorator;
    errorDecorator?: N2HtmlDecorator;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TextFieldRef;
}

export class N2TextField extends N2EjBasic<StateN2TextField, TextBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2TextField';

    labelTagId: string;

    constructor(state ?: StateN2TextField) {
        super(state);
    }

    protected onStateInitialized(state: StateN2TextField) {
        addN2Class(state.deco, N2TextField.CLASS_IDENTIFIER);
        state.wrapperTagId = `${this.state.tagId}_wrapper`;
        this.labelTagId = `${this.state.tagId}_label`;

        IHtmlUtils.initForN2(state);

        super.onStateInitialized(state);
    }


    onHtml(args: N2Evt_OnHtml): HTMLElement {
        let state = this.state;
        let hasErrorLine = !state.noErrorLine;
        let errorTagId = `error_${this.state.tagId}`;

        //---------- main input tag
        let deco = state.deco;
        deco.tag = 'input';
        deco.otherAttr.type = 'text';
        if (hasErrorLine)
            deco.otherAttr['data-msg-containerid'] = errorTagId;
        deco.otherAttr['name'] = (state.name ? state.name : state.tagId);

        //------- Wrapper (always present) ---
        state.wrapper = IHtmlUtils.init(state.wrapper);


        //------ Line Element ---
        let lineElement: HTMLSpanElement = document.createElement('span');
        lineElement.classList.add('e-float-line');


        //------- Floating Label Element ---

        state.labelDecorator = IHtmlUtils.init(state.labelDecorator);
        let labelDeco = state.labelDecorator;
        labelDeco.tag = 'label';
        labelDeco.classes = ['e-float-text'];
        labelDeco.otherAttr['for'] = state.tagId;
        labelDeco.otherAttr['id'] = this.labelTagId;
        let labelElement: HTMLElement = createN2HtmlBasicFromDecorator(labelDeco);

        //------- Error Element ---
        let errorElement: HTMLElement
        if (hasErrorLine) {
            state.errorDecorator = IHtmlUtils.init(state.errorDecorator);
            state.errorDecorator.otherAttr['id'] = errorTagId;
            errorElement = createN2HtmlBasicFromDecorator(state.errorDecorator);
            state.ref.errorElement = errorElement;
        }

        let wrapperElement: HTMLElement = createN2HtmlBasic<StateN2TextField>(state);
        state.ref.wrapperElement = wrapperElement; // stamp wrapper

        wrapperElement.appendChild(lineElement);
        wrapperElement.appendChild(labelElement);
        if (errorElement)
            wrapperElement.appendChild(errorElement);


        return wrapperElement;
        // return super.onHtml(args); // no super - all html elements generated here
    }

    createEjObj(): void {
        this.obj = new TextBox(this.state.ej);
    }

    get classIdentifier(): string { return N2TextField.CLASS_IDENTIFIER; }

    //--------------------------- Custom Methods for this class -----------------------------
    /**
     * Gets the HTMLInputElement associated with the current instance.
     *
     * This method first checks if the `htmlElement` of the current instance has the same ID as `state.tagId` and is an instance of HTMLInputElement.
     * If not, it searches for an element with the ID specified by `state.tagId` within the `htmlElement`.
     * If no matching element is found, it returns the first input element within the `htmlElement`.
     *
     * @returns {HTMLInputElement | undefined} The HTMLInputElement that matches the specified criteria, or undefined if no matching element is found.
     */
    get htmlInputElement(): HTMLInputElement {
        return findHtmlInputElement(this);
    } // htmlInputElement

}