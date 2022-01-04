import {AnyWidget}                                                             from "../AnyWidget";
import {TreeView, TreeViewModel}                                               from "@syncfusion/ej2-navigations";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                                    from "../Args_AnyWidget";
import {Args_AbstractWidget}                                                   from "../AbstractWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {DataManager}                                                           from "@syncfusion/ej2-data";

export class Args_WgtTreeView extends Args_AbstractWidget {
   /**
    * If this is present,  a new wrapper div is created around the actual element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej ?: TreeViewModel
}

export class WgtTreeView extends AnyWidget<TreeView, Args_WgtTreeView, any> {
   args: Args_WgtTreeView;

   protected constructor() {
      super();
   }

   initialize_WgtTreeView(args: Args_WgtTreeView) {
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
   } // initialize_WgtTreeView

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      x += `<div id="${this.tagId}"></div>`; // NEVER use <div />

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new TreeView(this.args?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.fields = {
            dataSource: []
         };
      }
   } // localClearImplementation

   // async localRefreshImplementation() {
   //    if (this.obj) {
   //       this.obj.refresh();
   //    }
   // } // localRefreshImplementation

   get value(): DataManager | { [key: string]: Object }[] {
      if (this.obj)
         return this.obj.fields.dataSource;
      else
         return [];
   }

   set value(value: DataManager | { [key: string]: Object }[]) {
      if (this.obj) {
         this.obj.fields.dataSource = value;
      }
   }
} // main class