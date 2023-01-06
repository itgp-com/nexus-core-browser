import {TextBoxModel}                   from "@syncfusion/ej2-inputs";
import {Ix2State}                       from "../../Ix2State";
import {StateEjStandard, Ax2EjStandard} from "../Ax2EjStandard";
import {IHtmlUtils}                     from "../../Ix2HtmlDecorator";
import {StateEjSingleVal}               from "../Ax2EjSingleVal";

export interface StateWx2TextField extends StateEjSingleVal<TextBoxModel> {
   errorTagId ?: string;

   labelTagId ?: string;

}

export class Wx2TextField extends Ax2EjStandard<StateWx2TextField> {

   protected constructor(state: StateWx2TextField) {
      super(state);
   }


   protected async _initialSetup(state: StateWx2TextField): Promise<void> {
      state = state || {};
      state.labelTagId = `label_${this.tagId}`;
      state.errorTagId = `error_${this.tagId}`;



      IHtmlUtils.initDecorator(state);
      let d = state.decorator;
      d.tag = 'input';
      d.otherAttr['data-msg-containerid'] = state.errorTagId;
      d.otherAttr['name']                 = state.propertyName;

      await super._initialSetup(state);
   }


}