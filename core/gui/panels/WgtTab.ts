import {AnyWidget}                                          from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";

import {Tab, TabItemModel, TabModel, SelectingEventArgs, SelectEventArgs}      from '@syncfusion/ej2-navigations';
import {AbstractWidget}                                                        from "../AbstractWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {voidFunction}                                                          from "../../CoreUtils";
import {AnyScreen}                                                             from "../AnyScreen";
import {Event}                                                                 from "@syncfusion/ej2-base";

export class Args_WgtTab implements IArgs_HtmlTag {
   htmlTagType ?: string;
   htmlTagClass ?: string;
   htmlTagStyle ?: string;

   wrapper ?: IArgs_HtmlTag;
   children: AbstractWidget[];
   ej ?: TabModel;
   onCreate ?: voidFunction;
}

export class Args_WgtTab_SelectedAsTab {
   initialized: boolean;
   index: number;
   wgtTab: WgtTab;
}


export class WgtTab extends AnyWidget<Tab, Args_AnyWidget, any> {

   args: Args_WgtTab;
   wrapperTagID: string;
   tabModel: TabModel;
   lastSelectingIndex: number;

   protected constructor() {
      super();
      this.doRegisterInfo = false; // no not register an event at this level
   }


   static create(args: Args_WgtTab): WgtTab {
      let instance = new WgtTab();
      instance.initialize_WgtTab(args);
      return instance;
   }


   initialize_WgtTab(args: Args_WgtTab) {
      let thisX = this;

      // //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      // this.args_AnyWidgetInitializedListeners.add(
      //    new class extends Args_AnyWidget_Initialized_Listener {
      //       argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {
      //
      //          // initialize the tags so they available in initContentBegin/End
      //          thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;
      //       }
      //    }
      // );


      args = <Args_WgtTab>IArgs_HtmlTag_Utils.init(args);

      this.args = args;
      if (!args.children) {
         args.children = []; // initialize to non-null
      }
      if ( args.children.length > 0){
         args.children = args.children.filter(value => {
            return value != null; // keep non-null children only
         });
      }


      this.initialize_AnyWidget();
   } // initialize_WgtTab


   async localContentBegin(): Promise<string> {
      let args      = this.args;
      let x: string = "";

      x += `<${args.htmlTagType} id="${this.tagId}" >`;

      if (args.wrapper) {
         args.wrapper   = IArgs_HtmlTag_Utils.init(args.wrapper);
         let x1: string = `<${args.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.class(args.wrapper)}${IArgs_HtmlTag_Utils.style(args.wrapper)}">`;
         x              = x1 + x;
      }

      return x;
   }

   async localContentEnd(): Promise<string> {
      let args = this.args;
      let x    = '';
      x += `</${args.htmlTagType}>`; // the tag div
      if (args.wrapper) {
         x += `</${args.wrapper.htmlTagType}>`
      }
      return x;
   }


   async localLogicImplementation() {
      let thisX = this;
      let args  = this.args;
      args.ej   = args.ej || {}; // ensure it's not null

      await this.createTabModel();
      thisX.obj = new Tab(this.tabModel, thisX.hget);
   } //doInitLogic

   async createTabModel() {
      let thisX = this;
      let args  = this.args;

      let itemModelList: TabItemModel[] = [];
      for (let tabObj of this.args.children) {
         let tabHtml = await tabObj.initContent();
         itemModelList.push(
            {
               header:  {'text': tabObj.title},
               content: tabHtml,
            }
         );
         tabObj.parent = thisX;

      } // for


      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      this.tabModel = {
         heightAdjustMode: 'None',
         overflowMode:     "MultiRow", // "Popup", //"Extended",
         // overflowMode: "Popup",
         // height: 250,

         items: itemModelList,

         selecting: (e:SelectingEventArgs) => {
            // this is the ACTUAL tab number being selected as far as the children are concerned.

            this.lastSelectingIndex = e.selectingIndex; // e.selectedIndex;
         },
         selected:  (e:SelectEventArgs) => {
            // let index: number = e.selectedIndex;
            let index = this.lastSelectingIndex; // cached from event above
            thisX.tabSelected(index);
         },
         cssClass:  "e-fill", // fill tab header with accent background
         created:   (_e:Event) => {
            setImmediate(
               async () => {
                  await thisX.obj.refresh(); // hack to repaint tab scrollbar when it overflows

                  // Remove uppercasing from tab header
                  $(".e-tab-text").addClass('app-tab-no-text-transform');

                  if (args.onCreate) {
                     args.onCreate.call(thisX); // run onCreate in the context of the WgtTab object
                  }

                  if (thisX.args.children.length > 0) {
                     thisX.initializeTab(0); // initialize the first tab on start
                  }
               }
            );
         },
      };

      if (args.ej)
         this.tabModel = {...this.tabModel, ...args.ej};

   } // createTabModel


   tabSelected(index: number): void {
      if (index < 0 || index >= this.args.children.length)
         return;
      this.initializeTab(index);
   } // tabSelected

   initializeTab(index: number) {
      let thisX: WgtTab = this;

      setImmediate(async () => {
         // Fix 2020-04-27 D. Pociu
         // this is ABSOLUTELY necessary in order to give the HTML in the tab control
         // a chance to be inserted. Without this, you get very weird Syncfusion EJ2
         // error about parts of the widgets being undefined during refresh
         let tabObj: AbstractWidget = this.args.children[index];
         if (tabObj) {
            let initialized: boolean = tabObj.initialized;
            if (!tabObj.initialized) {
               try {
                  await tabObj.initLogic(); // this includes a refresh
                  tabObj.initLogicAsTab(); // trigger this on the component inside the tab
               } catch (error) {
                  console.log(error);
                  // this.handleError(error);
               }
            }

            /**
             * Added 2020-05-14 David Pociu to register the panes in the tab (since initContentAndLogic i
             */
            try {
               if (tabObj.doRegisterInfo) {
                  tabObj.registerInfo(thisX.hget);
               }
            } catch (ex) {
               console.log(ex)
            }

            try {
               // trigger this on the component inside the tab
               tabObj.selectedAsTab({
                                       index:       index,
                                       initialized: initialized,
                                       wgtTab:      thisX,
                                    });
            } catch (error) {
               console.log(error);
               // this.handleError(error);
            }

            try {
               /**
                * Only perform the refresh if the component in the tab is not extending AnyScreen.
                * AnyScreen will already trigger a refresh at the end of it's initLogic implementation
                * and that initalization is also on setImmediate (as of 2020-05-11 Dave) so there's
                * no need for this refresh to fire here.
                */
               if (!(tabObj instanceof AnyScreen)) {
                  await tabObj.refresh(); // all the button enable/disable (the initialized flag prevents re-initialization of EJ2 components)
               }
            } catch (error) {
               console.log(error);
               this.handleError(error);
            }
         }
      });


   } // initializeTab

   resetTabInitializations() {
      for (let tabObj of this.args.children) {
         tabObj.initialized = false; // reset the state to not initialized
      }
   } // resetTabInitializations


   async localDestroyImplementation() {
      // destroy the children then this object
      for (let tabObj of this.args.children) {
         await tabObj.destroy();
      }
      if (this.obj)
         this.obj.destroy();
   }

   async localClearImplementation() {
      for (let tabObj of this.args.children  ) {
         await tabObj.clear();
      }
   }

   async localRefreshImplementation() {
      for (let tabObj of this.args.children ) {
         await tabObj.refresh();
      }
   }

} // main class