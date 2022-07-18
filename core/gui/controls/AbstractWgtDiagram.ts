import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils, IKeyValueString} from "../Args_AnyWidget";
import {AnyWidget}                                                           from "../AnyWidget";
import {Diagram, DiagramModel}                                               from '@syncfusion/ej2-diagrams';
import {Args_AbstractWidget}                                                 from "../AbstractWidget";

export class Args_WgtDiagram_Abstract extends Args_AnyWidget<DiagramModel> implements IArgs_HtmlTag {
   htmlOtherAttr?: IKeyValueString;
   htmlTagClass?: string;
   htmlTagStyle?: string;
   htmlTagType?: string;

   synchronousInstantiation?: boolean;
} // Args_WgtDiagram_Abstract


export abstract class AbstractWgtDiagram extends AnyWidget<Diagram, Args_WgtDiagram_Abstract, any> {
   args_WgtDiagram_Abstract: Args_WgtDiagram_Abstract;
   // wrapperTagID: string;

   protected initialize_AbstractWgtDiagram(args_WgtDiagram_Abstract: Args_WgtDiagram_Abstract) {
      let thisX                      = this;
      thisX.args_WgtDiagram_Abstract = args_WgtDiagram_Abstract;

      this.initialize_AnyWidget(args_WgtDiagram_Abstract);

   } // initialize_WgtDiagram_Abstract


    async localContentBegin(): Promise<string> {
       let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args_WgtDiagram_Abstract, false);
       IArgs_HtmlTag_Utils.init(this.args_WgtDiagram_Abstract); // htmlTagClass is not null
       if (classString) {
          if (this.args_WgtDiagram_Abstract.htmlTagClass )
             this.args_WgtDiagram_Abstract.htmlTagClass += ' '
          this.args_WgtDiagram_Abstract.htmlTagClass += classString
       } // if classString


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
         thisX.obj = new Diagram(diagramModel );
         thisX.obj.appendTo(document.getElementById(thisX.tagId));
      } else {
         setTimeout(() => {
            thisX.obj = new Diagram(diagramModel );
            thisX.obj.appendTo(document.getElementById(thisX.tagId));
         }, 100);
      }


   } // localLogicImplementation


} // main class