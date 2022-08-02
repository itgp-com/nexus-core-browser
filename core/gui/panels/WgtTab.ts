import {AnyWidget, Args_AnyWidget} from "../AnyWidget";

import {SelectEventArgs, SelectingEventArgs, Tab, TabItemModel, TabModel} from '@syncfusion/ej2-navigations';
import {AbstractWidget, Args_AbstractWidget}                              from "../AbstractWidget";
import {Event}                                                            from "@syncfusion/ej2-base";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                               from "../../BaseUtils";

export class Args_WgtTab extends Args_AnyWidget<TabModel> implements IArgs_HtmlTag {
   htmlTagType ?: string;
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
}

export class WgtTab extends AnyWidget<Tab, Args_AnyWidget, any> {

   args: Args_WgtTab;
   wrapperTagID: string;
   tabModel: TabModel;
   lastSelectingIndex: number;
   lastSelectingEvent: SelectingEventArgs;
   lastSelectedEvent: SelectEventArgs;

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

      args = <Args_WgtTab>IArgs_HtmlTag_Utils.init(args);

      thisX.args = args;
      if (!args.children) {
         args.children = []; // initialize to non-null
      }
      if (args.children.length > 0) {
         args.children = args.children.filter(value => {
            return value != null; // keep non-null children only
         });
      }

      thisX.initialize_AnyWidget();
   } // initialize_WgtTab


   async localContentBegin(): Promise<string> {
      let args      = this.args;
      IArgs_HtmlTag_Utils.init(this.args); // htmlTagClass is not null

      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, false);
      if (classString) {
         if (this.args.htmlTagClass )
            this.args.htmlTagClass += ' '
         this.args.htmlTagClass += classString
      } // if classString


      let x: string = "";

      x += `<${args.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.all(this.args)}>`;

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
      if (!args) {
         args = {
            children: [],
         }
      }
      ;
      args.ej = args.ej || {};

      await this.createTabModel();
      thisX.obj = new Tab(this.tabModel, thisX.hget);
      // thisX.obj.appendTo(thisX.hget); <--- Must do extensive testing before enabling
   } //doInitLogic

   async createTabModel() {
      let thisX = this;
      let args  = this.args; // cannot be null because they have required properties
      let ej    = this.args.ej;

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

      let ejCreated = ej.created;

      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      thisX.tabModel = {
         heightAdjustMode: 'None',
         overflowMode:     "MultiRow", // "Popup", //"Extended",
         // overflowMode: "Popup",
         // height: 250,

         items: itemModelList,

         selecting: (e: SelectingEventArgs) => {
            // this is the ACTUAL tab number being selected as far as the children are concerned.

            thisX.lastSelectingIndex = e.selectingIndex; // e.selectedIndex;
            thisX.lastSelectingEvent = e;
         },
         selected:  async (e: SelectEventArgs) => {
            // let index: number = e.selectedIndex;
            thisX.lastSelectedEvent = e;
            let index               = thisX.lastSelectingIndex; // cached from event above
            await thisX.tabSelected(index);
         },
         cssClass:  "e-fill", // fill tab header with accent background
         created:   async (_e: Event) => {
            // setImmediate is used because of Syncfusion implementation
            setImmediate(
               async () => {
                  await thisX.obj.refresh(); // hack to repaint tab scrollbar when it overflows

                  // Remove uppercasing from tab header
                 // $(".e-tab-text").addClass('app-tab-no-text-transform');
                  let tabs = thisX.hget.getElementsByClassName('e-tab-text');
                  for (let i = 0; i < tabs.length; i++) {
                     const tab = tabs[i];
                     tab.classList.add('app-tab-no-text-transform')
                  }

                  if (ejCreated) {
                     try {
                        ejCreated.call(thisX);
                     } catch (ex) {
                        thisX.handleWidgetError(ex);
                     }
                  }

                  if (thisX.args.children.length > 0) {
                     try {
                        await thisX.tabSelected(0); // initialize the first tab on start
                     } catch (ex) {
                        thisX.handleWidgetError(ex);
                     }
                  }

               }
            );
         }, // created
      };

      if (args.ej)
         this.tabModel = {...this.tabModel, ...args.ej};

   } // createTabModel


   async tabSelected(index: number) {
      //    if (index < 0 || index >= this.args.children.length)
      //       return;
      //    await this.initializeTab(index);
      // } // tabSelected
      //
      // async initializeTab(index: number) {
      if (index < 0 || index >= this.args.children.length)
         return;
      let thisX: WgtTab = this;

      // setImmediate(async () => {
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
            // trigger this on the component inside the tab
            tabObj.activatedAsInnerWidget({
                                             parentWidget: thisX,
                                             parentInfo:   {
                                                'selecting': thisX.lastSelectingIndex,
                                                'selected':  thisX.lastSelectedEvent,
                                             }
                                          });
         } catch (error) {
            console.log(error);
            // this.handleError(error);
         }

         // try {
         //    /**
         //     * Only perform the refresh if the component in the tab is not extending AnyScreen.
         //     * AnyScreen will already trigger a refresh at the end of it's initLogic implementation
         //     * and that initalization is also on setImmediate (as of 2020-05-11 Dave) so there's
         //     * no need for this refresh to fire here.
         //     */
         //    if (!(tabObj instanceof AnyScreen)) {
         //       if (tabObj.hackRefreshOnWgtTabInit) // major hack to be eliminated
         //          await tabObj.refresh(); // all the button enable/disable (the initialized flag prevents re-initialization of EJ2 components)
         //    }
         // } catch (error) {
         //    console.log(error);
         //    this.handleError(error);
         // }
      }
      // });


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
      for (let tabObj of this.args.children) {
         await tabObj.clear();
      }
   }

   async localRefreshImplementation() {
      for (let tabObj of this.args.children) {
         await tabObj.refresh();
      }
   }

} // main class