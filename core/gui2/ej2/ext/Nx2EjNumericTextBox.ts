import {NumericTextBox, NumericTextBoxModel} from "@syncfusion/ej2-inputs";
import {StateNx2PropertyName} from "../../generic/StateNx2PropertyName";
import {Nx2Evt_OnHtml} from "../../Nx2";
import {addNx2Class, IHtmlUtils, Nx2HtmlDecorator} from "../../Nx2HtmlDecorator";
import {createNx2HtmlBasic, createNx2HtmlBasicFromDecorator} from "../../Nx2Utils";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

export enum NumericTextBoxType_Ej2_Material {
    regular = '',
    filled = 'e-filled',
    outline = 'e-outline',
}

export interface StateNx2EjNumericTextBoxRef extends StateNx2EjBasicRef{
    widget ?: Nx2EjNumericTextBox;
    errorElement?: HTMLElement;
    labelElement?: HTMLElement;
    wrapperElement?: HTMLElement;
}

export interface StateNx2EjNumericTextBox extends StateNx2EjBasic<NumericTextBoxModel>, StateNx2PropertyName {

    required?: boolean;


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
    ref ?:StateNx2EjNumericTextBoxRef;
}

export class Nx2EjNumericTextBox extends Nx2EjBasic<StateNx2EjNumericTextBox, NumericTextBox> {

   labelTagId:string;

    constructor(state ?: StateNx2EjNumericTextBox) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjNumericTextBox');
    }

    protected _constructor(state ?: StateNx2EjNumericTextBox) {
        super._constructor(state);
    }

    protected onStateInitialized(state: StateNx2EjNumericTextBox) {
       this.labelTagId = `label_${this.state.tagId}`;
       if ( !state.wrapper){
            state.wrapper = {};

       }

       IHtmlUtils.initForNx2(state);

        super.onStateInitialized(state);
    }



   onHtml(args: Nx2Evt_OnHtml): HTMLElement {
       let state = this.state;
        let hasErrorLine = !state.noErrorLine;

      state.wrapper = IHtmlUtils.init(state.wrapper);
      let wrapperDeco = state.wrapper;
      wrapperDeco.otherAttr['id'] = state.wrapperTagId;
      let wrapperElement: HTMLElement = createNx2HtmlBasicFromDecorator(wrapperDeco);


      let errorTagId = `error_${this.state.tagId}`;

      let deco = state.deco;
      deco.tag = 'input';
      deco.otherAttr.type = 'text';
      if (hasErrorLine)
         deco.otherAttr['data-msg-containerid'] = errorTagId;

      deco.otherAttr['name'] = (state.name ?  state.name : state.tagId);

      let inputElement: HTMLElement = createNx2HtmlBasic<StateNx2EjNumericTextBox>(state);
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
      let labelElement: HTMLElement = createNx2HtmlBasicFromDecorator(labelDeco);
      wrapperElement.appendChild(labelElement);

      if (hasErrorLine) {
         state.errorDecorator = IHtmlUtils.init(state.errorDecorator);
         state.errorDecorator.otherAttr['id'] = errorTagId;
         let errorElement: HTMLElement = createNx2HtmlBasicFromDecorator(state.errorDecorator);
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



}