import {AnyWidget}                                                             from "../AnyWidget";
import {Component}                                                             from "@syncfusion/ej2-base";
import {Args_AnyWidget, IArgs_HtmlTag_Utils}                                   from "../Args_AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {Args_AbstractWidget}                                                   from "../AbstractWidget";

export class AnyWidgetGeneric<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any, ARGS_ANY_WIDGET extends Args_AnyWidget = Args_AnyWidget, DATA_TYPE = any>
   extends AnyWidget<EJ2COMPONENT, ARGS_ANY_WIDGET, DATA_TYPE> {


   protected constructor() {
      super();
   }

   initialize_AnyWidgetGeneric(args: ARGS_ANY_WIDGET) {
      let thisX = this;

      if (!args)
         args = {} as any;
      if (!args.ej)
         args.ej = {};


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
   } // initialize_WgtTreeView

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.descriptor?.wrapper) {
         this.descriptor.wrapper = IArgs_HtmlTag_Utils.init(this.descriptor.wrapper);
         x += `<${this.descriptor.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.descriptor.wrapper)}>`;
      }

      IArgs_HtmlTag_Utils.init(this.descriptor);
      // Combine class array with string classes
      if (this.descriptor.htmlTagClass){
         let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.descriptor, true);
         if (classString) {
            this.descriptor.htmlTagClass += ` ${classString}`;
         }
      }

      x += `<${this.descriptor.htmlTagType} id="${this.tagId}" ${IArgs_HtmlTag_Utils.all(this.descriptor.wrapper)}>`
      return x; // no call to super
   } // localContentBegin

   async localContentEnd(): Promise<string> {
      let x = `</${this.descriptor.htmlTagType}>`; // NEVER use <div />

      if (this.descriptor?.wrapper) {
         x += `</${this.descriptor.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   } // localContentEnd()


} // main