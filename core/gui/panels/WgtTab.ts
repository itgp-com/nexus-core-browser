import {AnyWidget}                                          from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";

import {SelectEventArgs, Tab, TabItemModel, TabModel} from '@syncfusion/ej2-navigations';
import {AbstractWidget}                               from "../AbstractWidget";
import {
   Args_AnyWidget_Initialized_Event,
   Args_AnyWidget_Initialized_Listener
}                                                     from "../Args_AnyWidget_Initialized_Listener";
import {htmlToElement, voidFunction}                  from "../../CoreUtils";
import {AnyScreen}                                    from "../AnyScreen";

export class Args_WgtTab implements IArgs_HtmlTag {
   htmlTagType ?: string;
   htmlTagClass ?: string;
   htmlTagStyle ?: string;

   wrapper ?: IArgs_HtmlTag;
   children: AbstractWidget[];
   ej ?: TabModel;
   onCreate ?: voidFunction;
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

      //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      this.args_AnyWidgetinitializedListeners.add(
         new class extends Args_AnyWidget_Initialized_Listener {
            argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {

               // initialize the tags so they available in initContentBegin/End
               thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;
            }
         }
      );


      args = <Args_WgtTab>IArgs_HtmlTag_Utils.init(args);

      this.args = args;
      if (!args.children) {
         args.children = []; // initialize to non-null
      }


      this.initialize_AnyWidget();
   } // initialize_WgtTab


   localContentBegin(): string {
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

   localContentEnd(): string {
      let args = this.args;
      let x    = '';
      x += `</${args.htmlTagType}>`; // the tag div
      if (args.wrapper) {
         x += `</${args.wrapper.htmlTagType}>`
      }
      return x;
   }


   localLogicImplementation() {
      let thisX = this;
      let args  = this.args;
      args.ej   = args.ej || {}; // ensure it's not null

      this.createTabModel();
      thisX.obj = new Tab(this.tabModel, thisX.hget);

   } //doInitLogic

   createTabModel() {
      let thisX = this;
      let args  = this.args;

      let itemModelList: TabItemModel[] = [];
      for (let tabObj of this.args.children) {
         let tabHtml = tabObj.initContent();
         itemModelList.push(
            {
               header:  {'text': tabObj.title},
               content: tabHtml,
            }
         );
         tabObj.parent = thisX;

      } // for


      this.tabModel = {
         heightAdjustMode: 'None',
         overflowMode:     "MultiRow", // "Popup", //"Extended",
         // overflowMode: "Popup",
         // height: 250,

         items: itemModelList,

         selecting: (e) => {
            // this is the ACTUAL tab number being selected as far as the children are concerned.

            this.lastSelectingIndex = e.selectingIndex; // e.selectedIndex;
         },
         selected:  (e) => {
            // let index: number = e.selectedIndex;
            let index = this.lastSelectingIndex; // cached from event above
            thisX.tabSelected(index);
         },
         cssClass:  "e-fill", // fill tab header with accent background
         created:   (_e) => {
            setImmediate(
               () => {
                  thisX.obj.refresh(); // hack to repaint tab scrollbar when it overflows

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

      setImmediate(() => {
         // Fix 2020-04-27 D. Pociu
         // this is ABSOLUTELY necessary in order to give the HTML in the tab constrol
         // a chance to be inserted. Without this, you get very weird Syncfusion EJ2
         // error about parts of the widgets being undefined during refresh
         let tabObj: AbstractWidget = this.args.children[index];
         if (tabObj) {
            if (!tabObj.initialized) {
               try {
                  tabObj.initLogic(); // this includes a refresh
                  tabObj.initLogicAsTab();
               } catch (error) {
                  console.log(error);
                  // this.handleError(error);
               }
            }

            try {
               tabObj.selectedAsTab();
            } catch (error) {
               console.log(error);
               // this.handleError(error);
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
               /**
                * Only perform the refresh if the component in the tab is not extending AnyScreen.
                * AnyScreen will already trigger a refresh at the end of it's initLogic implementation
                * and that initalization is also on setImmediate (as of 2020-05-11 Dave) so there's
                * no need for this refresh to fire here.
                */
               if (!(tabObj instanceof AnyScreen)) {
                  tabObj.refresh(); // all the button enable/disable (the initialized flag prevents re-initialization of EJ2 components)
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


   localDestroyImplementation()
      :
      void {
      // destroy the children then this object
      for (let tabObj of this.args.children
         ) {
         tabObj.destroy();
      }
      if (this.obj)
         this.obj.destroy();
   }

   localClearImplementation()
      :
      void {
      for (let tabObj of this.args.children
         ) {
         tabObj.clear();
      }
   }

   localRefreshImplementation()
      :
      void {
      for (let tabObj of this.args.children
         ) {
         tabObj.refresh();
      }
   }

} // main class