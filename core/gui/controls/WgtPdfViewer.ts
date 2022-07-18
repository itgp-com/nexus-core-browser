import {PdfViewer, PdfViewerModel}                                             from "@syncfusion/ej2-pdfviewer"
import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AbstractWidget}                                                   from "../AbstractWidget";
import {Args_AnyWidget, IArgs_HtmlTag_Utils}                                   from "../Args_AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";

export class Args_WgtPdfViewer extends Args_AnyWidget<PdfViewerModel>{
}

export class Args_PdfViewer_Value {
   pdfPath:string;
   password ?: string;
}


export class WgtPdfViewer extends AnyWidget<PdfViewer, Args_WgtPdfViewer, any> {
   args: Args_WgtPdfViewer;

   protected constructor() {
      super();
   }


   initialize_WgtPdfViewer(args: Args_WgtPdfViewer) {
      let thisX = this;

      if (!args)
         args = {};
      if (!args.ej)
         args.ej = {};

      this.args = args;

      this.initialize_AnyWidget(args);
      //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      this.args_AnyWidgetInitializedListeners.addListener(
         new class extends Args_AnyWidget_Initialized_Listener {
            argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {

               // initialize the tags so they available in initContentBegin/End
               thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;

            }
         }
      );

   } // initialize_WgtPdfViewer

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);
      x += `<div id="${this.tagId}" ${classString}></div>`; // NEVER use <div />

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin

   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new PdfViewer(this.args?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation

   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.unload();
      }
   } // localClearImplementation

   async localRefreshImplementation() {
      try {
         if (this.obj) {
            this.obj.refresh();
         }
      } catch (ex) {
         this.handleError(ex);
      }
   } // localRefreshImplementation

   // get value(): string|Args_PdfViewer_Value {
   //    if (this.obj)
   //       return this.obj.loadSuccess()
   //    else
   //       return [];
   // }
   //
   // set value(value: DataManager | { [key: string]: Object }[]) {
   //    if (this.obj) {
   //       this.obj.fields.dataSource = value;
   //    }
   // }

} // main