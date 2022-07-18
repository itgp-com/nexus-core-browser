import {AbstractWidget, Args_AbstractWidget}                                   from "../AbstractWidget";
import {Args_AnyWidget, IArgs_HtmlTag_Utils}                                   from "../Args_AnyWidget";
import {Splitter, SplitterModel}                                               from '@syncfusion/ej2-layouts';
import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {PanePropertiesModel}                                                   from "@syncfusion/ej2-layouts/src/splitter/splitter-model";

export class Args_WgtSplitter extends Args_AnyWidget<SplitterModel> {
   /**
    * These widgets will be inserted as paneSettings components
    */
   panes?: AbstractWidget[];
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


      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);
      x += `<div id="${this.tagId}" ${classString}></div>`; // NEVER use <div />

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

      if (thisX.args.ej == null)
         thisX.args.ej = {};

      if (thisX.args?.panes) {
         let panesOriginal: PanePropertiesModel[] = thisX.args.ej.paneSettings;
         if (panesOriginal == null)
            panesOriginal = []
         let paneCount = panesOriginal.length;

         let panes: PanePropertiesModel[] = [];
         for (let i = 0; i < thisX.args.panes.length; i++) {
            const pane = thisX.args.panes[i];

            let paneModel: PanePropertiesModel;

            if (i < paneCount)
               paneModel = panesOriginal[i]; // existing settings
            else
               paneModel = {};
            paneModel.content = await pane.initContent();
            panes.push(paneModel);
         } // for

         thisX.args.ej.paneSettings = panes;
      } // if panes

      thisX.obj = new Splitter(this.args?.ej);
      thisX.obj.appendTo(anchor); // doing this in separate line because of EJ2 bug as of 2022-01-03


      if (thisX.args?.panes) {
         for (let i = 0; i < thisX.args.panes.length; i++) {
            const pane = thisX.args.panes[i];
            await pane.initLogic();
         }
      }


   } // localLogicImplementation

} // main class