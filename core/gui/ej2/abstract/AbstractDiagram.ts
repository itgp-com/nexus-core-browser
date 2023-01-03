import {IArgs_HtmlTag_Utils}              from "../../../BaseUtils";
import {Args_AnyWidget}                   from "../../AnyWidget";
import {AnyWidgetStandard}                from "../../AnyWidgetStandard";
import {Diagram, DiagramModel, NodeModel} from '@syncfusion/ej2-diagrams';
import {IClickEventArgs}                  from "@syncfusion/ej2-diagrams/src/diagram/objects/interface/IElement";
import {addWidgetClass}                   from "../../AbstractWidget";
import {WxSizedHtmlElement}               from "../../utils/HtmlUtils";


export class Args_AbstractDiagram extends Args_AnyWidget<DiagramModel> {
   synchronousInstantiation?: boolean;
}


export abstract class AbstractDiagram<ARGS extends Args_AbstractDiagram = Args_AbstractDiagram> extends AnyWidgetStandard<Diagram, Args_AbstractDiagram, any> {
   static readonly CLASS_NAME:string = 'AbstractDiagram';

   protected constructor() {
      super();
   }

   protected async _initialize(args: ARGS) {
      args          = IArgs_HtmlTag_Utils.init(args) as ARGS;
      addWidgetClass(args, AbstractDiagram.CLASS_NAME);
      this.initArgs = args;
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WgtDiagram_Abstract


   async localLogicImplementation() {
      let diagramModel = this.initArgs?.ej;
      if (diagramModel == null)
         diagramModel = {};

      let thisX = this;


      // ---------- start htmlnode initialization on create -------
      let createdFunction  = diagramModel.created;
      diagramModel.created = (args: any) => {
         if (createdFunction)
            createdFunction(args);

         // Replace html in node with activated HTML Element (containing js objects)
         for (const node of thisX.obj.nodes) {
            if (isWxNodeModelHTML(node)) {
               let htmlInfo = node.wxSizedHtmlElement;
               if (htmlInfo.htmlElementId) {
                  let docTreeHtmlElement = document.getElementById(htmlInfo.htmlElementId);
                  if (docTreeHtmlElement) {
                     if (htmlInfo.htmlElement) {
                        docTreeHtmlElement.replaceWith(htmlInfo.htmlElement); // replace simple HTML with already initialized HTML (Events and all)
                     } // if (htmlInfo.htmlElement)
                  } // if (docTreeHtmlElement)
               } //  if ( htmlInfo.htmlElementId)
            } // if ( isWxNodeModelHTML(node) )
         } // for (const node of diagram.obj.nodes)
      } // created

      // ---------- end htmlnode initialization on create -------


      if (this.initArgs.synchronousInstantiation) {
         thisX.obj = new Diagram(diagramModel);
         thisX.obj.appendTo(thisX.hget);
      } else {
         setTimeout(() => {
            thisX.obj = new Diagram(diagramModel);
            thisX.obj.appendTo(thisX.hget);
         }, 100);
      }

   } // localLogicImplementation


   getHTMLElementsOnClick(ev: IClickEventArgs): HTMLElement[] {
      let thisX                   = this;
      // let b = thisX.obj.findObjectsUnderMouse(ev.position);
      let elements: HTMLElement[] = document.elementsFromPoint(thisX.hget.getBoundingClientRect().left + ev.position.x, thisX.hget.getBoundingClientRect().top + ev.position.y) as any[];
      return elements;
   }

} // WxDiagram

export interface WxNodeModelHTML extends NodeModel {
   wxSizedHtmlElement: WxSizedHtmlElement
} // WxNodeModelHTML

/**
 *
 * @param obj
 */
export function isWxNodeModelHTML(obj: any): obj is WxNodeModelHTML {
   // uses suggestion from https://stackoverflow.com/questions/14425568/interface-type-check-with-typescript
   if (!obj)
      return false;

   return 'wxSizedHtmlElement' in obj;

} // isWxNodeModelHTML