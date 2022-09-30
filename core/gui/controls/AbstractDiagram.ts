import {IArgs_HtmlTag_Utils}   from "../../BaseUtils";
import {Args_AnyWidget}        from "../AnyWidget";
import {AnyWidgetStandard}     from "../AnyWidgetStandard";
import {Diagram, DiagramModel} from '@syncfusion/ej2-diagrams';


export class Args_AbstractDiagram extends Args_AnyWidget<DiagramModel> {
   synchronousInstantiation?: boolean;
}


export abstract class AbstractDiagram extends AnyWidgetStandard<Diagram, Args_AbstractDiagram, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractDiagram(args: Args_AbstractDiagram) {
      args          = IArgs_HtmlTag_Utils.init(args);
      this.initArgs = args;
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WgtDiagram_Abstract


   async localLogicImplementation() {

      let diagramModel = this.initArgs?.ej;
      if (diagramModel == null)
         diagramModel = {} as DiagramModel;

      let thisX = this;
      if (this.hget) {
         if (this.initArgs.synchronousInstantiation) {
            thisX.obj = new Diagram(diagramModel);
            thisX.obj.appendTo(thisX.hget);
         } else {
            setTimeout(() => {
               thisX.obj = new Diagram(diagramModel);
               thisX.obj.appendTo(thisX.hget);
            }, 100);
         }
      } else {
         console.log('AbstractDiagram.localLogicImplementation: this.hget is null');
      }


   } // localLogicImplementation


} // main class