import {TextBox, TextBoxModel} from "@syncfusion/ej2-inputs";
import {StateNx2PropertyName} from "../../generic/StateNx2PropertyName";
import {Nx2Evt_OnHtml} from "../../Nx2";
import {addNx2Class, IHtmlUtils, Nx2HtmlDecorator} from "../../Nx2HtmlDecorator";
import {createNx2HtmlBasic, createNx2HtmlBasicFromDecorator, findHtmlInputElement} from "../../Nx2Utils";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {ValidationRuleDetails, StateNx2Validator} from '../StateNx2Validator';

export enum TextFieldType_Ej2_Material {
    regular = '',
    filled = 'e-filled',
    outline = 'e-outline',
}

export interface StateNx2EjTextFieldRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTextField;
    errorElement?: HTMLElement;
    labelElement?: HTMLElement;
    wrapperElement?: HTMLElement;
}

export interface StateNx2EjTextField<WIDGET extends Nx2EjTextField = Nx2EjTextField> extends StateNx2EjBasic<TextBoxModel>, StateNx2PropertyName, StateNx2Validator {

    required?: boolean;

    validationRule ?: ValidationRuleDetails<WIDGET>;

    /**
     * Defaults to always having an error line.
     * Set to true to not include the error HTMLElement
     */
    noErrorLine?: boolean;

    labelDecorator?: Nx2HtmlDecorator;
    errorDecorator?: Nx2HtmlDecorator;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTextFieldRef;
}

export class Nx2EjTextField extends Nx2EjBasic<StateNx2EjTextField, TextBox> {

    labelTagId: string;

    constructor(state ?: StateNx2EjTextField) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTextField');
    }

    protected _constructor(state ?: StateNx2EjTextField) {
        super._constructor(state);
    }

    protected onStateInitialized(state: StateNx2EjTextField) {
        state.wrapperTagId = `${this.state.tagId}_wrapper`;
        this.labelTagId = `${this.state.tagId}_label`;

        IHtmlUtils.initForNx2(state);

        super.onStateInitialized(state);
    }


    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
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
        let labelElement: HTMLElement = createNx2HtmlBasicFromDecorator(labelDeco);

        //------- Error Element ---
        let errorElement: HTMLElement
        if (hasErrorLine) {
            state.errorDecorator = IHtmlUtils.init(state.errorDecorator);
            state.errorDecorator.otherAttr['id'] = errorTagId;
            errorElement = createNx2HtmlBasicFromDecorator(state.errorDecorator);
            state.ref.errorElement = errorElement;
        }

        let wrapperElement: HTMLElement = createNx2HtmlBasic<StateNx2EjTextField>(state);
        state.ref.wrapperElement = wrapperElement; // stamp wrapper

        wrapperElement.appendChild(lineElement);
        wrapperElement.appendChild(labelElement);
        if ( errorElement)
            wrapperElement.appendChild(errorElement);


        return wrapperElement;
        // return super.onHtml(args); // no super - all html elements generated here
    }

    createEjObj(): void {
        this.obj = new TextBox(this.state.ej);
    }

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