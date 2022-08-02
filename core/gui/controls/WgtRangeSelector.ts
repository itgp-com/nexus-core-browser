import {AnyWidget, Args_AnyWidget, Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../AnyWidget";
import {RangeNavigator, RangeNavigatorModel}                                                              from '@syncfusion/ej2-charts';
import {Args_AbstractWidget}                                                   from "../AbstractWidget";
import {IArgs_HtmlTag_Utils}                                                   from "../../BaseUtils";

export class Args_WgtRangeSelector extends Args_AnyWidget<RangeNavigatorModel> {
   native ?: RangeNavigatorModel;

} // Args_WgtChart

export class WgtRangeSelector extends AnyWidget<RangeNavigator, Args_WgtRangeSelector, any> {
   args: Args_WgtRangeSelector;

   //---- should move from WgtSimple to AnyWidget -------
   wrapperTagID: string;

   //----

   protected constructor() {
      super();
   }


   initialize_WgtRangeSelector(args: Args_WgtRangeSelector) {
      let thisX = this;
      if (!args)
         args = {}


      if ( !args.native)
         args.native = {};

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

   } // initialize_WgtChart

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
      this.obj   = new RangeNavigator(this.args?.native, anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.value = [];
      }
   } // localClearImplementation

   async localRefreshImplementation() {
      if (this.obj) {
         this.obj.refresh();
      }
   } // localRefreshImplementation

   get value(): any {
      if (this.obj)
         return this.obj.dataSource;
   }

   set value(value: any) {
      if (this.obj) {
         this.obj.dataSource = value;
      }
   }
} // main