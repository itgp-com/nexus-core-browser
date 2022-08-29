import {PdfViewer, PdfViewerModel} from "@syncfusion/ej2-pdfviewer"
import {Args_AnyWidget}            from "../AnyWidget";
import {AnyWidgetStandard}         from "../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}       from "../../BaseUtils";
import {addWidgetClass}            from "../AbstractWidget";

export class Args_AbstractPdfViewer extends Args_AnyWidget<PdfViewerModel>{
}

export abstract class AbstractPdfViewer extends AnyWidgetStandard<PdfViewer, Args_AbstractPdfViewer, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractPdfViewer(args: Args_AbstractPdfViewer) {
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      addWidgetClass(args, 'AbstractPdfViewer');
      await this.initialize_AnyWidgetStandard(args);
   }


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new PdfViewer(this.descriptor?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation

   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.unload();
      }
   } // localClearImplementation



} // main