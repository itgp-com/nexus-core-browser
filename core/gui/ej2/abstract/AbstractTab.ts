import {IArgs_HtmlTag_Utils}                                              from "../../../BaseUtils";
import {AbstractWidget}                                                   from "../../AbstractWidget";
import {Args_AnyWidget}                                                   from "../../AnyWidget";
import {AnyWidgetStandard}                                                from "../../AnyWidgetStandard";
import {Event}                                                            from "@syncfusion/ej2-base";
import {SelectEventArgs, SelectingEventArgs, Tab, TabItemModel, TabModel} from '@syncfusion/ej2-navigations';
import {resolveWidgetArray}                                               from "../../WidgetUtils";
import {isArray}                                                          from "lodash";
import {RemoveEventArgs}                                                  from "@syncfusion/ej2-navigations/src/tab/tab";

export class Args_AbstractTab extends Args_AnyWidget<TabModel> {
}

export abstract class AbstractTab extends AnyWidgetStandard<Tab, Args_AnyWidget, any> {

   // wrapperTagID: string;
   tabModel: TabModel;
   lastSelectingIndex: number;
   lastSelectingEvent: SelectingEventArgs;
   lastSelectedEvent: SelectEventArgs;

   private _tabWidgets: AbstractWidget[];

   protected constructor() {
      super();
      this.doRegisterInfo = false; // no not register an event at this level
   }


   protected async initialize_AbstractTab(args: Args_AbstractTab) {
      let thisX     = this;
      args          = IArgs_HtmlTag_Utils.init(args)
      this.initArgs = args;

      if (!args.children) {
         args.children = []; // initialize to non-null
      }
      if (args.children.length > 0) {
         args.children = args.children.filter(value => {
            return value != null; // keep non-null children only
         });
      }

      // The children cannot be passed to super because they would become initialized (initLogic) by AbstractWidget
      // We need the Tab's children to ONLY be initialized after the tab is created (usually when tab is selected)
      // otherwise the HTML for the tabs is not properly processed and the tab components will just show one under
      // the other and not inside tabs
      thisX._tabWidgets = await resolveWidgetArray(args.children);
      args.children     = [];
      try {
         await thisX.initialize_AnyWidgetStandard(args);
      } finally {
         args.children = thisX.tabWidgets;
      }
   } // initialize_WgtTab


   async localLogicImplementation() {
      let thisX = this;
      let args  = (this.initArgs as Args_AbstractTab);
      if (!args.children)
         args.children = [];
      if (!thisX._tabWidgets)
         thisX._tabWidgets = [];

      args.ej = args.ej || {};

      await this.createTabModel(this.tabWidgets);
      thisX.obj = new Tab(this.tabModel, thisX.hget);
      // thisX.obj.appendTo(thisX.hget); <--- Must do extensive testing before enabling
   } //doInitLogic


   async createTabItemModels(widgetList: AbstractWidget[]): Promise<TabItemModel[]> {
      let thisX                         = this;
      let tabItemModels: TabItemModel[] = [];

      if (widgetList && widgetList.length > 0) {
         for (let tabObj of widgetList) {
            let tabHtml = await tabObj.initContent();
            tabItemModels.push(
               {
                  header:  {'text': tabObj.title},
                  content: tabHtml,
               }
            );
            tabObj.parent = thisX;
         } // for
      } // if
      return tabItemModels;
   } // createTabItemModels

   async createTabModel(widgetList: AbstractWidget[]) {
      let thisX = this;
      let args  = (this.initArgs as Args_AbstractTab); // cannot be null because they have required properties
      let ej    = this.initArgs.ej || {};

      let itemModelList: TabItemModel[] = await thisX.createTabItemModels(widgetList);

      let ejSelecting = ej.selecting;
      let ejSelected  = ej.selected;
      let ejCssClass  = ej.cssClass || '';
      let ejCreated   = ej.created;
      let ejRemoved   = ej.removed;

      // e-fill: fill tab header with accent background
      if (ejCssClass.length > 0) {
         ejCssClass += `e-fill ${ejCssClass}`;
      } else {
         ejCssClass = 'e-fill';
      }

      // @ts-ignore
      let baseTabModel: TabModel = {

         selecting: (e: SelectingEventArgs) => {
            // this is the ACTUAL tab number being selected as far as the children are concerned.

            thisX.lastSelectingIndex = e.selectingIndex; // e.selectedIndex;
            thisX.lastSelectingEvent = e;

            if (ejSelecting) {
               ejSelecting(e);
            }
         },
         selected:  async (e: SelectEventArgs) => {
            try {
               if (ejSelected) {
                  ejSelected(e);
               }
            } catch (e) {
               thisX.handleWidgetError(e);
               ;
            }


            // let index: number = e.selectedIndex;
            thisX.lastSelectedEvent = e;
            let index               = thisX.lastSelectingIndex; // cached from event above
            await thisX.tabSelected(index);
         },
         cssClass:  ejCssClass,
         created:   async (ev: Event) => {
            // setTimeout is used because of Syncfusion implementation
            setTimeout(
               async () => {

                  try {
                     // Remove uppercasing from tab header
                     thisX.hget.querySelectorAll('.e-tab-text')?.forEach((e: HTMLElement) => {
                        e.classList.add('app-tab-no-text-transform');
                     });
                  } catch (e) {
                     console.error(e);
                  }

                  if (ejCreated) {
                     try {
                        ejCreated(ev);
                     } catch (ex) {
                        thisX.handleWidgetError(ex);
                     }
                  }

                  if ((this.initArgs as Args_AbstractTab).children.length > 0) {
                     try {
                        await thisX.tabSelected(0); // initialize the first tab on start
                     } catch (ex) {
                        thisX.handleWidgetError(ex);
                     }
                  }

               }
            ); // setTimeout no delay
         }, // created
         removed:   (ev: RemoveEventArgs) => {
            if (ejRemoved) {
               try {
                  ejRemoved(ev);
               } catch (ex) {
                  thisX.handleWidgetError(ex);
               }
            } // if ejRemoved

            try {
               let index: number = ev.removedIndex;
               if (this.obj && this.initialized) {
                  let widget = this._tabWidgets[index];
                  if (widget) {
                     this._tabWidgets.splice(index, 1); // changes the array IN PLACE
                  }
               }
            } catch (ex) {
               thisX.handleWidgetError(ex);
            }

         }, // removed
      };


      thisX.tabModel = {
         heightAdjustMode: 'None',
         overflowMode:     "MultiRow", // "Popup", //"Extended",
         items:            itemModelList,

         ...args.ej,
         ...baseTabModel
      };
   } // createTabModel


   async tabSelected(index: number) {
      if (index < 0 || index >= this.tabWidgets.length)
         return;

      let thisX         = this;
      let _intermediate = thisX.tabWidgets[index];
      if (!_intermediate)
         return;

      // Fix 2020-04-27 D. Pociu
      // this is ABSOLUTELY necessary in order to give the HTML in the tab control
      // a chance to be inserted. Without this, you get very weird Syncfusion EJ2
      // error about parts of the widgets being undefined during refresh
      let tabObj: AbstractWidget = await _intermediate;

      setTimeout(async () => {
         if (tabObj) {
            let initialized: boolean = tabObj.initialized;
            if (!tabObj.initialized) {
               try {
                  await tabObj.initLogic(); // this includes a refresh
                  await tabObj.initLogicAsTab({
                                                 initialized: tabObj.initialized,
                                                 index:       index,
                                                 instance:    thisX
                                              }); // trigger this on the component inside the tab
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
               await tabObj.selectedAsTab({
                                             index:       index,
                                             initialized: initialized,
                                             instance:    thisX,
                                          });
            } catch (error) {
               console.log(error);
               // this.handleError(error);
            }


            try {
               // trigger this on the component inside the tab
               await tabObj.activatedAsInnerWidget({
                                                      parentWidget: thisX,
                                                      parentInfo:   {
                                                         'selecting': thisX.lastSelectingIndex,
                                                         'selected':  thisX.lastSelectedEvent,
                                                         'index':     index,
                                                      }
                                                   });
            } catch (error) {
               console.log(error);
               // this.handleError(error);
            }
         }
         // });
      }); // setTimeout

   } // initializeTab

   resetTabInitializations() {
      for (let tabObj of this.tabWidgets) {
         tabObj.initialized = false; // reset the state to not initialized
      }
   } // resetTabInitializations


   async localDestroyImplementation() {
      // destroy the children then this object
      for (let tabObj of this.tabWidgets) {
         try {
            await tabObj.destroy();
         } catch (e) {
            console.error(e);
         }
      }

      this._tabWidgets        = null;
      this.lastSelectingEvent = null;
      this.lastSelectedEvent  = null;
      this.lastSelectingIndex = -1;

      if (this.obj)
         this.obj.destroy();
   }

   async localClearImplementation() {
      for (let tabObj of this.tabWidgets) {
         await tabObj.clear();
      }
   }

   async localRefreshImplementation() {
      for (let tabObj of this.tabWidgets) {
         try {
            await tabObj.refresh();
         } catch (e) {
            console.error(e);
         }
      }
   }

   //------------------------------------

   get tabWidgets(): AbstractWidget[] {
      return this._tabWidgets;
   }


   /**
    * Dynamically add tabs to the Tab widget, after initial instantiation
    * @param newWidgets new tabs to add
    * @param index position to add the tabs at
    */
   async addTab(newWidgets: AbstractWidget | Promise<AbstractWidget> | (AbstractWidget | Promise<AbstractWidget>)[], index?: number): Promise<number> {
      try {
         if (this.obj && this.initialized) {

            if (index == null) {
               index = this.obj.items?.length;
            }

            let localArray: (AbstractWidget | Promise<AbstractWidget>)[] = []
            if (newWidgets) {
               if (isArray(newWidgets)) {
                  localArray = newWidgets;
               } else {
                  localArray = [newWidgets];
               }
            } // if newWidgets

            let resolvedWidgets: AbstractWidget[]     = await resolveWidgetArray(localArray);
            let resolvedTabItemModels: TabItemModel[] = await this.createTabItemModels(resolvedWidgets);
            this.obj.addTab(resolvedTabItemModels, index);
            this._tabWidgets.splice(index, 0, ...resolvedWidgets); // changes the array IN PLACE
            return index;
         }
      } catch (e) {
         console.error(e);
      }
      return -1;
   }

   removeTab(index: number) {
      if (this.obj && this.initialized) {
         let widget = this._tabWidgets[index];
         if (widget) {
            this.obj.removeTab(index);
            this._tabWidgets.splice(index, 1); // changes the array IN PLACE
         }
      }

   }

} // main class