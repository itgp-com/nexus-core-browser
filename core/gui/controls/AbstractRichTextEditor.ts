import {IArgs_HtmlTag_Utils, StringArg, stringArgVal}                                                from "../../BaseUtils";
import {DataProvider, IDataProviderSimple}                                                           from "../../data/DataProvider";
import {AnyWidget, Args_AnyWidget}                                                                   from "../AnyWidget";
import {ChangeEventArgs}                                                                             from "@syncfusion/ej2-richtexteditor/src/rich-text-editor/base/interface";
import {HtmlEditor, Image, Link, QuickToolbar, Resize, RichTextEditor, RichTextEditorModel, Toolbar} from '@syncfusion/ej2-richtexteditor';
import {AnyWidgetStandard}                                                                           from "../AnyWidgetStandard";


RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, QuickToolbar, Resize);

export class Args_AbstractRichTextEditor extends Args_AnyWidget<RichTextEditorModel> {
   initialValue?: StringArg;
}

//TODO Implement using standard content builders
export abstract class AbstractRichTextEditor extends AnyWidgetStandard<RichTextEditor, Args_AbstractRichTextEditor> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractRichTextEditor(args: Args_AbstractRichTextEditor) {
      args            = IArgs_HtmlTag_Utils.init(args);
      this.descriptor = args;
      await this.initialize_AnyWidget(args);
      args.ej = args.ej || {};
      args.htmlTagType = 'textarea';

      await super.initialize_AnyWidget(args);

   } // initialize_Base_WgtRichTextEditor

   // async localContentBegin(): Promise<string> {
   //    let x: string = "";
   //    let args      = this.descriptor;
   //    if (args?.wrapper) {
   //       args.wrapper = IArgs_HtmlTag_Utils.init(args.wrapper);
   //       x += `<${args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(args.wrapper)}>`;
   //    }
   //
   //    x += `<textarea id="${this.tagId}"></textarea>`; // NEVER use <div />
   //
   //    if (args?.wrapper) {
   //       x += `</${args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
   //    }
   //    return x; // no call to super
   // } // localContentBegin

   async localLogicImplementation() {
      let thisX = this;
      let args  = this.descriptor;

      let originalChange = args.ej?.change;
      args.ej.change     = async (changeEv: ChangeEventArgs) => {

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
         this.obj = new RichTextEditor(args.ej);
         this.obj.appendTo(anchor);


         if (args.initialValue)
            this.value = stringArgVal(args.initialValue);


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
      let args = this.descriptor;

      if (this.obj && args.dataProviderName) {
         let data             = DataProvider.byName(this, args.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (args.ej.enabled) {
            // if the general properties allow you to enable, then enable if there's data, disable when there's no data link
            this.obj.enabled = enabled;
         }
      } else {

      }

   }

   //--------------------------- AnyWidget implementation ---------------


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
      if (this.descriptor.dataProviderName)
         dataProvider = DataProvider.dataProviderByName(this, this.descriptor.dataProviderName);
      return dataProvider;
   }

} // main class