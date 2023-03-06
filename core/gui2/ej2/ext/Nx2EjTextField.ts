import {TextBox, TextBoxModel} from "@syncfusion/ej2-inputs";
import {IHtmlUtils, Nx2HtmlDecorator} from "../../Nx2HtmlDecorator";
import {createNx2HtmlBasic, createNx2HtmlBasicFromDecorator} from "../../Nx2Utils";
import {StateNx2EjSingleVal, StateNx2EjSingleValRef} from "../Nx2EjSingleVal";
import {Nx2EjBasic} from "../Nx2EjBasic";
import {Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "../../Nx2";

export enum TextFieldType_Ej2_Material {
    regular = '',
    filled = 'e-filled',
    outline = 'e-outline',
}

export interface StateNx2EjTextFieldRef extends StateNx2EjSingleValRef{
    widget ?: Nx2EjTextField;
    errorElement?: HTMLElement;
    labelElement?: HTMLElement;
    wrapperElement?: HTMLElement;
}

export interface StateNx2EjTextField extends StateNx2EjSingleVal<TextBoxModel> {

    required?: boolean;


    /**
     * Defaults to always having an error line.
     * Set to true to not include the error HTMLElement
     */
    noErrorLine?: boolean;

    wrapperDecorator?: Nx2HtmlDecorator;
    labelDecorator?: Nx2HtmlDecorator;
    errorDecorator?: Nx2HtmlDecorator;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateNx2EjTextFieldRef;
}

export class Nx2EjTextField extends Nx2EjBasic<StateNx2EjTextField> {

   wrapperTagId:string;
   labelTagId:string;

    constructor(state: StateNx2EjTextField) {
        super(state);
    }

    protected _constructor(state: StateNx2EjTextField) {
        super._constructor(state);
    }

    protected _initialSetup(state: StateNx2EjTextField) {
       this.wrapperTagId = `wrapper_${this.state.tagId}`;
       this.labelTagId = `label_${this.state.tagId}`;

       IHtmlUtils.initDecorator(state);

        super._initialSetup(state);
    }



   onHtml(args: Nx2Evt_OnHtml): HTMLElement {
       let state = this.state;
        let hasErrorLine = !state.noErrorLine;

      state.wrapperDecorator = IHtmlUtils.init(state.wrapperDecorator);
      let wrapperDeco = state.wrapperDecorator;
      // wrapperDeco.classes = ['e-input-group', 'e-float-input']
      wrapperDeco.otherAttr['id'] = this.wrapperTagId;
      let wrapperElement: HTMLElement = createNx2HtmlBasicFromDecorator(wrapperDeco);


      let errorTagId = `error_${this.state.tagId}`;

      let deco = state.deco;
      deco.tag = 'input';
      if (hasErrorLine)
         deco.otherAttr['data-msg-containerid'] = errorTagId;

      deco.otherAttr['name'] = (state.name ?  state.name : state.tagId);

      let inputElement: HTMLElement = createNx2HtmlBasic<StateNx2EjTextField>(state);
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

   onLogic(args: Nx2Evt_OnLogic) {
        let state = this.state;

        let obj: TextBox = new TextBox(state.ej);
        this.obj = obj;
        let opc = obj.onPropertyChanged
        obj.onPropertyChanged = (newProp: any, oldProp: any) => {
            if (opc)
                opc(newProp, oldProp);
        }
        let anchor = this.htmlElement.getElementsByTagName('input')[0];
        obj.appendTo(anchor);

        // super.onLogic(args);
    }
}