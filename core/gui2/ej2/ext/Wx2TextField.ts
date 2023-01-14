import {TextBox, TextBoxModel}                                    from "@syncfusion/ej2-inputs";
import {IHtmlUtils, Ix2HtmlDecorator}                             from "../../Ix2HtmlDecorator";
import {Ix2StateGenerated}                                        from "../../Ix2State";
import {createWx2HTMLStandard, createWx2HtmlStandardForDecorator} from "../../Wx2Utils";
import {StateEjSingleVal}                                         from "../Ax2EjSingleVal";
import {Ax2EjStandard}                                            from "../Ax2EjStandard";

export interface StateWx2TextField extends StateEjSingleVal<Wx2TextField,TextBoxModel> {

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
      let wrapperTagId = `wrapper_${this.tagId}`;

      IHtmlUtils.initDecorator(state);


      state.onHtml = () => {

         state.wrapperDecorator                 = IHtmlUtils.init(state.wrapperDecorator);
         state.wrapperDecorator.otherAttr['id'] = wrapperTagId;
         let wrapperElement: HTMLElement        = createWx2HtmlStandardForDecorator(state.wrapperDecorator);


         let errorTagId = `error_${this.tagId}`;

         let widgetDecorator = state.deco;
         widgetDecorator.tag = 'input';
         if (state.includeErrorLine)
            widgetDecorator.otherAttr['data-msg-containerid'] = errorTagId;
         if (state.propertyName)
            widgetDecorator.otherAttr['name'] = state.propertyName;
         let widgetElement: HTMLElement = createWx2HTMLStandard<StateWx2TextField>(state);
         state.gen.htmlElement        = widgetElement;


         wrapperElement.appendChild(widgetElement);
         if (state.includeErrorLine) {
            state.errorDecorator                 = IHtmlUtils.init(state.errorDecorator);
            state.errorDecorator.otherAttr['id'] = errorTagId;
            let errorElement:HTMLElement       = createWx2HtmlStandardForDecorator(state.errorDecorator);
            state.gen.errorElement             = errorElement;
            wrapperElement.appendChild(errorElement);
         }

         return wrapperElement;
      } // onHtml

      state.onLogic = () => {
         let obj:TextBox= new TextBox(state.ej);
         state.gen.widget.obj = obj;
         obj.appendTo(state.gen.htmlElement);
      }

   } // _customizeState



}