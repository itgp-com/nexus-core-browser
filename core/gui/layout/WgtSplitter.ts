import {Args_AbstractWidget}                                                   from "../AbstractWidget";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                                    from "../Args_AnyWidget";
import {Splitter, SplitterModel}                                               from '@syncfusion/ej2-layouts';
import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {AbstractWidget}                                                        from "../..";

export class Args_WgtSplitter extends Args_AbstractWidget {
   /**
    * If this is present,  a new wrapper div is created around the actual element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej ?: SplitterModel;
   children ?: AbstractWidget[];

}

export class WgtSplitter extends AnyWidget<Splitter, Args_WgtSplitter, any> {
   args: Args_WgtSplitter;


   protected constructor() {
      super();
   }

   initialize_WgtSplitter(args: Args_WgtSplitter) {
      let thisX = this;

      if (!args)
         args = {};
      if (!args.ej)
         args.ej = {};
      if (!args.children)
         args.children = [];

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
   }

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      x += `<div id="${this.tagId}">`;

      return x; // no call to super
   } // localContentBegin


   async localContentEnd(): Promise<string> {
      let x: string = "";
      x += `</div>`;

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   }

   async localLogicImplementation() {
      let anchor = this.hget;
      let thisX  = this;
      // window.setTimeout(()=>{
      thisX.obj  = new Splitter(this.args?.ej);
      thisX.obj.appendTo(anchor); // doing this in separate line because of EJ2 bug as of 2022-01-03

   } // localLogicImplementation

} // main class