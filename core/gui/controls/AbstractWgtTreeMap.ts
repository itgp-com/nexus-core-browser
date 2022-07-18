import {Args_AbstractWidget}                                                                      from "../AbstractWidget";
import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils}                    from "../Args_AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {DataManager}                                                                              from "@syncfusion/ej2-data";
import {TreeMapAjax}                                                                              from "@syncfusion/ej2-treemap/src/treemap/utils/helper";
import {TreeMap, TreeMapHighlight, TreeMapLegend, TreeMapModel, TreeMapSelection, TreeMapTooltip} from '@syncfusion/ej2-treemap';

TreeMap.Inject(TreeMapTooltip,TreeMapHighlight,TreeMapSelection, TreeMapLegend  );

export class Args_WgtTreeMap extends Args_AnyWidget<TreeMapModel> {
}

export abstract class AbstractWgtTreeMap extends AnyWidget<TreeMap, Args_WgtTreeMap, any> {
   args: Args_WgtTreeMap;

   protected constructor() {
      super();
   }

   initialize_AbstractWgtTreeMap(args: Args_WgtTreeMap) {
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

      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);
      x += `<div id="${this.tagId}" ${classString}></div>`; // NEVER use <div />

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new TreeMap(this.args?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj)
         this.obj.dataSource= [];
   } // localClearImplementation

   async localRefreshImplementation() {
      try {
         if (this.obj) {
            this.obj.refresh();
         }
      } catch (ex) {
         this.handleError(ex);
      }
   } // localRefreshImplementation

   get value(): DataManager | TreeMapAjax | Object[] {
      if (this.obj)
         return this.obj.dataSource;
      else
         return [];
   }

   set value(value: DataManager | TreeMapAjax | Object[]) {
      if (this.obj) {
         this.obj.dataSource = value;
      }
   }

} // main class