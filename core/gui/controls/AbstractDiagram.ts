import {Args_AnyWidget}        from "../AnyWidget";
import {Diagram, DiagramModel} from '@syncfusion/ej2-diagrams';
import {AnyWidgetStandard}     from "../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}   from "../../BaseUtils";

export class Args_AbstractDiagram extends Args_AnyWidget<DiagramModel> {
   synchronousInstantiation?: boolean;
}


export abstract class AbstractDiagram extends AnyWidgetStandard<Diagram, Args_AbstractDiagram, any> {

   protected async  initialize_AbstractDiagram(args: Args_AbstractDiagram) {
      args = IArgs_HtmlTag_Utils.init(args);
      this.descriptor = args;
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WgtDiagram_Abstract


   async localLogicImplementation() {

      let diagramModel = this.descriptor?.ej;
      if (diagramModel == null)
         diagramModel = {} as DiagramModel;

      let thisX = this;
      if ( this.descriptor.synchronousInstantiation){
         thisX.obj = new Diagram(diagramModel );
         thisX.obj.appendTo(thisX.hget);
      } else {
         setTimeout(() => {
            thisX.obj = new Diagram(diagramModel );
            thisX.obj.appendTo(thisX.hget);
         }, 100);
      }


   } // localLogicImplementation


} // main class