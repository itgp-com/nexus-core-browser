import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils, IKeyValueString} from "../Args_AnyWidget";
import {AnyWidget}                                                           from "../AnyWidget";
import {Diagram, DiagramModel}                                               from '@syncfusion/ej2-diagrams';

export class Args_WgtDiagram_Abstract extends Args_AnyWidget implements IArgs_HtmlTag {
   ej ?: DiagramModel;

   htmlOtherAttr?: IKeyValueString;
   htmlTagClass?: string;
   htmlTagStyle?: string;
   htmlTagType?: string;

   wrapper ?: IArgs_HtmlTag;

   synchronousInstantiation?: boolean;
} // Args_WgtDiagram_Abstract


export abstract class WgtDiagram_Abstract extends AnyWidget<Diagram, Args_WgtDiagram_Abstract, any> {
   args_WgtDiagram_Abstract: Args_WgtDiagram_Abstract;
   // wrapperTagID: string;

   protected initialize_WgtDiagram_Abstract(args_WgtDiagram_Abstract: Args_WgtDiagram_Abstract) {
      let thisX                      = this;
      thisX.args_WgtDiagram_Abstract = args_WgtDiagram_Abstract;

      // //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      // this.args_AnyWidgetInitializedListeners.add(
      //    new class extends Args_AnyWidget_Initialized_Listener {
      //       argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {
      //
      //          // initialize the tags so they available in localContentBegin/End
      //          thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;
      //       }
      //    }
      // );


      this.initialize_AnyWidget(args_WgtDiagram_Abstract);

   } // initialize_WgtDiagram_Abstract


    async localContentBegin(): Promise<string> {

      let x: string = "";
      if (this?.args_WgtDiagram_Abstract)
         this.args_WgtDiagram_Abstract = IArgs_HtmlTag_Utils.init(this?.args_WgtDiagram_Abstract);

      if (this?.args_WgtDiagram_Abstract.wrapper)
         this.args_WgtDiagram_Abstract.wrapper = IArgs_HtmlTag_Utils.init(this?.args_WgtDiagram_Abstract.wrapper);

      if (this.args_WgtDiagram_Abstract.wrapper) {
         this.args_WgtDiagram_Abstract.wrapper = IArgs_HtmlTag_Utils.init(this.args_WgtDiagram_Abstract.wrapper);
         x += `<${this.args_WgtDiagram_Abstract.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.args_WgtDiagram_Abstract.wrapper)}>`;
      }

      x += `<${this?.args_WgtDiagram_Abstract.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.all(this?.args_WgtDiagram_Abstract)}></div>`


      if (this.args_WgtDiagram_Abstract?.wrapper) {
         x += `</${this.args_WgtDiagram_Abstract.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   } // localContentBegin

   async localLogicImplementation() {

      let diagramModel = this.args_WgtDiagram_Abstract?.ej;
      if (diagramModel == null)
         diagramModel = {} as DiagramModel;

      let thisX = this;
      if ( this.args_WgtDiagram_Abstract.synchronousInstantiation){
         thisX.obj = new Diagram(diagramModel, `#${thisX.tagId}`);
      } else {
         setImmediate(() => {
            thisX.obj = new Diagram(diagramModel, `#${thisX.tagId}`);
         });
      }

   } // localLogicImplementation


} // main class