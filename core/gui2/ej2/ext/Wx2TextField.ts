import {TextBox, TextBoxModel}                                    from "@syncfusion/ej2-inputs";
import {IHtmlUtils, Ix2HtmlDecorator}                             from "../../Ix2HtmlDecorator";
import {Ix2StateGenerated}                                        from "../../Ix2State";
import {createWx2HTMLStandard, createWx2HtmlStandardForDecorator} from "../../Wx2Utils";
import {StateEjSingleVal}                                         from "../Ax2EjSingleVal";
import {Ax2EjStandard}                                            from "../Ax2EjStandard";

export interface StateWx2TextField extends StateEjSingleVal<Wx2TextField, TextBoxModel> {

   required?: boolean;
   includeErrorLine?: boolean;

   wrapperDecorator?: Ix2HtmlDecorator;
   labelDecorator?: Ix2HtmlDecorator;
   errorDecorator?: Ix2HtmlDecorator;

   gen?: StateWx2GeneratedTextField; // overwrite the type
}

export interface StateWx2GeneratedTextField extends Ix2StateGenerated {
   errorElement?: HTMLElement;
   labelElement?: HTMLElement;
   wrapperElement?: HTMLElement;
}

export class Wx2TextField extends Ax2EjStandard<StateWx2TextField> {

   constructor(state: StateWx2TextField) {
      super(state);
   }

   // public static async create(state: StateWx2TextField): Promise<Wx2TextField> {
   //    return new Wx2TextField(state);
   // }

   protected _constructor(state: StateWx2TextField) {
      super._constructor(state);
   }

   protected async _initialSetup(state: StateWx2TextField) {
      this._customizeState(state);
      super._initialSetup(state);
   }


   protected _customizeState(state: StateWx2TextField): void {
      let wrapperTagId = `wrapper_${this.state.tagId}`;
      let labelTagId   = `label_${this.state.tagId}`;

      IHtmlUtils.initDecorator(state);

      state.ej.cssClass = 'e-filled';


      state.onHtml = () => {

         state.wrapperDecorator          = IHtmlUtils.init(state.wrapperDecorator);
         let wrapperDeco                 = state.wrapperDecorator;
         wrapperDeco.classes             = ['e-input-group', 'e-float-input']
         wrapperDeco.otherAttr['id']     = wrapperTagId;
         let wrapperElement: HTMLElement = createWx2HtmlStandardForDecorator(wrapperDeco);


         let errorTagId = `error_${this.state.tagId}`;

         let deco = state.deco;
         deco.tag = 'input';
         if (state.includeErrorLine)
            deco.otherAttr['data-msg-containerid'] = errorTagId;
         if (state.propertyName)
            deco.otherAttr['name'] = state.propertyName;
         let inputElement: HTMLElement = createWx2HTMLStandard<StateWx2TextField>(state);
         wrapperElement.appendChild(inputElement);

         let lineElement: HTMLSpanElement = document.createElement('span');
         lineElement.classList.add('e-float-line');
         wrapperElement.appendChild(lineElement);

         state.labelDecorator          = IHtmlUtils.init(state.labelDecorator);
         let labelDeco                 = state.labelDecorator;
         labelDeco.tag                 = 'label';
         labelDeco.classes             = ['e-float-text'];
         labelDeco.otherAttr['for']    = state.tagId;
         labelDeco.otherAttr['id']     = labelTagId;
         let labelElement: HTMLElement = createWx2HtmlStandardForDecorator(labelDeco);
         wrapperElement.appendChild(labelElement);

         if (state.includeErrorLine) {
            state.errorDecorator                 = IHtmlUtils.init(state.errorDecorator);
            state.errorDecorator.otherAttr['id'] = errorTagId;
            let errorElement: HTMLElement        = createWx2HtmlStandardForDecorator(state.errorDecorator);
            state.gen.errorElement               = errorElement;
            wrapperElement.appendChild(errorElement);
         }

         return wrapperElement;
      } // onHtml

      state.onLogic = () => {
         let obj: TextBox      = new TextBox(state.ej);
         state.gen.widget.obj  = obj;
         let opc               = obj.onPropertyChanged
         obj.onPropertyChanged = (newProp: any, oldProp: any) => {
            if (opc)
               opc(newProp, oldProp);
         }
         let anchor            = state.gen.htmlElement.getElementsByTagName('input')[0];
         obj.appendTo(anchor);
      }

   } // _customizeState


}