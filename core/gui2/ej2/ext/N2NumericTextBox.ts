import {NumericTextBox, NumericTextBoxModel} from '@syncfusion/ej2-inputs';
import {StateN2PropertyName} from '../../generic/StateN2PropertyName';
import {N2Evt_OnHtml} from '../../N2';
import {addN2Class, IHtmlUtils, N2HtmlDecorator} from '../../N2HtmlDecorator';
import {createN2HtmlBasic, createN2HtmlBasicFromDecorator} from '../../N2Utils';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

export enum NumericTextBoxType_Ej2_Material {
    regular = '',
    filled = 'e-filled',
    outline = 'e-outline',
}

export interface StateN2NumericTextBoxRef extends StateN2EjBasicRef {
    widget?: N2NumericTextBox;
    errorElement?: HTMLElement;
    labelElement?: HTMLElement;
    wrapperElement?: HTMLElement;
}

export interface StateN2NumericTextBox extends StateN2EjBasic<NumericTextBoxModel>, StateN2PropertyName {

    required?: boolean;


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
    ref?: StateN2NumericTextBoxRef;
}

export class N2NumericTextBox extends N2EjBasic<StateN2NumericTextBox, NumericTextBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2NumericTextBox';

    labelTagId: string;

    constructor(state ?: StateN2NumericTextBox) {
        super(state);
        addN2Class(this.state.deco, N2NumericTextBox.CLASS_IDENTIFIER);
    }

    protected _constructor(state ?: StateN2NumericTextBox) {
        super._constructor(state);
    }

    protected onStateInitialized(state: StateN2NumericTextBox) {
        this.labelTagId = `label_${this.state.tagId}`;
        if (!state.wrapper) {
            state.wrapper = {};

        }

        IHtmlUtils.initForN2(state);

        super.onStateInitialized(state);
    }


    onHtml(args: N2Evt_OnHtml): HTMLElement {
        let state = this.state;
        let hasErrorLine = !state.noErrorLine;

        state.wrapper = IHtmlUtils.init(state.wrapper);
        let wrapperDeco = state.wrapper;
        wrapperDeco.otherAttr['id'] = state.wrapperTagId;
        let wrapperElement: HTMLElement = createN2HtmlBasicFromDecorator(wrapperDeco);


        let errorTagId = `error_${this.state.tagId}`;

        let deco = state.deco;
        deco.tag = 'input';
        deco.otherAttr.type = 'text';
        if (hasErrorLine)
            deco.otherAttr['data-msg-containerid'] = errorTagId;

        deco.otherAttr['name'] = (state.name ? state.name : state.tagId);

        let inputElement: HTMLElement = createN2HtmlBasic<StateN2NumericTextBox>(state);
        wrapperElement.appendChild(inputElement);

        let lineElement: HTMLSpanElement = document.createElement('span');
        lineElement.classList.add('e-float-line');
        wrapperElement.appendChild(lineElement);

        state.labelDecorator = IHtmlUtils.init(state.labelDecorator);
        let labelDeco = state.labelDecorator;
        labelDeco.tag = 'label';
        labelDeco.classes = ['e-float-text'];
        labelDeco.otherAttr['for'] = state.tagId;
        labelDeco.otherAttr['id'] = this.labelTagId;
        let labelElement: HTMLElement = createN2HtmlBasicFromDecorator(labelDeco);
        wrapperElement.appendChild(labelElement);

        if (hasErrorLine) {
            state.errorDecorator = IHtmlUtils.init(state.errorDecorator);
            state.errorDecorator.otherAttr['id'] = errorTagId;
            let errorElement: HTMLElement = createN2HtmlBasicFromDecorator(state.errorDecorator);
            state.ref.errorElement = errorElement;
            wrapperElement.appendChild(errorElement);
        }

        state.ref.wrapperElement = wrapperElement;

        return wrapperElement;
        // return super.onHtml(args);
    }

    createEjObj(): void {
        this.obj = new NumericTextBox(this.state.ej);
    }

    get classIdentifier(): string { return N2NumericTextBox.CLASS_IDENTIFIER; }

}