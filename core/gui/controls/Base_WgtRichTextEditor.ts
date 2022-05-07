import {HtmlEditor, Image, Link, QuickToolbar, RichTextEditor, RichTextEditorModel, Toolbar, Resize} from '@syncfusion/ej2-richtexteditor';

import {IArgs_HtmlTag_Utils}               from "../Args_AnyWidget";
import {DataProvider, IDataProviderSimple} from "../../data/DataProvider";
import {Args_WgtSimple, WgtSimple}         from "./WgtSimple";
import {ChangeEventArgs}         from "@syncfusion/ej2-richtexteditor/src/rich-text-editor/base/interface";
import {StringArg, stringArgVal} from "../../CoreUtils";

RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, QuickToolbar, Resize);

export class Args_Base_WgtRichTextEditor extends Args_WgtSimple<RichTextEditorModel> {
   initialValue?:StringArg;
}

export abstract class Base_WgtRichTextEditor<A extends Args_Base_WgtRichTextEditor> extends WgtSimple<RichTextEditor, A> {

   args: A;

   protected constructor() {
      super();
   }

   initialize_Base_WgtRichTextEditor(argsLocal: A) {
      let thisX = this;
      if (!argsLocal)
         argsLocal = {} as A;

      if (!argsLocal.ej) {
         argsLocal.ej = {};
      }
      thisX.args = argsLocal;

      this.initialize_WgtSimple(argsLocal);

   } // initialize_Base_WgtRichTextEditor

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      x += `<textarea id="${this.tagId}"></textarea>`; // NEVER use <div />

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin

   async localLogicImplementation() {
      let thisX = this;

      let originalChange  = thisX.args.ej?.change;
      this.args.ej.change = async (changeEv: ChangeEventArgs) => {

         await thisX._onValueChanged(); // trigger change functionality

         if (originalChange) {
            try {
               originalChange.call(thisX, changeEv); // keep the context to thisX when executing
            } catch (e) {
               console.error(e);
            }
         }

      } // change


      let anchor = thisX.hget;
      try {
         this.obj = new RichTextEditor(this.args.ej);
         this.obj.appendTo(anchor);


         if (thisX.args.initialValue)
            this.value = stringArgVal(thisX.args.initialValue);


         // if we have an initial value, then set it the previous value to same
         if (this.value)
            this.previousValue = this.value;


      } catch (ex) {
         this.handleError(ex);
      }
   } // localLogicImplementation

   async localClearImplementation(): Promise<void> {
      await super.localClearImplementation();
      if (this.obj)
         this.value = '';
      this.previousValue = '';
   }

   async localRefreshImplementation(): Promise<void> {

      if (this.obj && this.args.dataProviderName) {
         let data             = DataProvider.byName(this, this.args.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.args.ej.enabled) {
            // if the general properties allow you to enable, the enable if there's data, disable when there's no data link
            this.obj.enabled = enabled;
         }
      } else {

      }


   }

   //--------------------------- WgtSimple implementation ---------------


   get value(): string {
      if (this.obj) {
         return this.obj.value;
      }
      return '';
   }

   set value(val: string) {
      if (this.obj) {
         val            = this.convertValueBeforeSet(val);
         this.obj.value = val;
      }
   }

   convertValueBeforeSet(val: string): string {
      if (val == null)
         val = ''; // default null, undefined to ''
      return val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.args.dataProviderName)
         dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
      return dataProvider;
   }

} // main class