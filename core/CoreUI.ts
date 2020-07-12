import {getModules, ModuleInfo, ModuleInit}                  from "./ModuleRegistry";
import * as utils                                            from "./CoreUtils";
import {Button}                                              from '@syncfusion/ej2-buttons';
import {Sidebar, TreeView}                                   from '@syncfusion/ej2-navigations';
import {coreUI, cu, ej2_icon_close, ej2_icon_menu_hamburger} from "./index";
import {getErrorHandler}                                     from "./CoreErrorHandling";
import {ListenerHandler}                                     from "./ListenerHandler";
import {UIStartedListener}                                   from "./temp/UIStartedListener";


//---------------------------------------------------
let moduleContainerTagID: string = '_nexus_moduleContainer';

export function getModuleContainerTagID(): string {
   return moduleContainerTagID;
}

// noinspection JSUnusedGlobalSymbols
export function setModuleContainerTagID(tagID: string) {
   moduleContainerTagID = tagID;
}

//---------------------------------------------------

/**
 * ID of HTML element where the menu containing all the registered menus will instantiate
 */
let moduleMenuTagID: string = '_nexus_moduleMenu';

export function getModuleMenuTagID(): string {
   return moduleMenuTagID;
}

// noinspection JSUnusedGlobalSymbols
export function setModuleMenuTagID(tagID: string): void {
   moduleMenuTagID = tagID;
}

//---------------------------------------------------

let sidebarTagID = 'default-sidebar';

export function getSidebarTagID(): string {
   return sidebarTagID;
}

// noinspection JSUnusedGlobalSymbols
export function setSidebarTagID(tagID: string): void {
   sidebarTagID = tagID;
}

//---------------------------------------------------


const STORAGE_CURRENT_MODULE_ID: string = 'currentModule';

interface SelectionListener {
   nodeSelected(): void;
}

export class MainUI {

   lastOpenModule_modId: string      = null;
   lastOpenModule_initialParams: any = null;

   initialModuleToDisplay_modId: string      = null;
   initialModuleToDisplay_initialParams: any = null;

   protected treeView: TreeView;
   protected _selectionListeners: SelectionListener[] = [];

   UIStartedListeners: ListenerHandler<any, UIStartedListener>;


   init() {
      sessionStorage.removeItem(STORAGE_CURRENT_MODULE_ID); // clean up any previous keys on startup
   }

   /**
    * Gets called right after init() to allow for all the initial URL-based processing to happen
    * One should do their await based calls here at the beginning of the app, and only then
    * instantiate the UI
    */
   async init_async() {

      // Pre-load the app path for the whole app
      await utils.asyncGetAppPath();


      this.createSlider(); // should this be here or inside the main method of each app
      this.renderModuleMenu(); // should this be here or inside the main method of each app

      this.openInitialModuleToDisplay();

      /**
       * TODO: This is a horrible hack that needs to disappear - allows all the table models to register their UIStartedListeners
       */
      setTimeout(() => {
                    //--- 2020-05-13 Dave
                    // fire all the UIStart listeners then delete them - it's a one time deal for the whole app
                    if (this.UIStartedListeners) {
                       try {
                          this.UIStartedListeners.fire({
                                                          event:            {}, // empty event
                                                          exceptionHandler: event => {
                                                             console.log(event);
                                                          }
                                                       });

                       } catch (t) {
                          console.log(t);
                       }
                       this.UIStartedListeners.clear(); // delete all the listeners
                    } // if (this.UIStartedListeners)
                    //--------------------------

                 },
                 1000);
   }

   public openInitialModuleToDisplay() {
      let thisX = this;
      setTimeout(
         () => {
            thisX._openInitialModuleToDisplay();
         }

         , 500); // do this after everything is painted and loaded
   }

   protected _openInitialModuleToDisplay() {
      if (this.lastOpenModule_modId == null) {
         // if no other module has been opened, then initialize the view to this module
         if (this.initialModuleToDisplay_modId != null) {
            // if there's an initial module defined, open it
            this.openModule({
                               modID:         this.initialModuleToDisplay_modId,
                               initialParams: this.initialModuleToDisplay_initialParams
                            });
         }
      }
   }

   public defaultModuleInitFunction(moduleInit: ModuleInit) {
      moduleInit.getModuleDisplayContainer().innerHTML = ""; // "<h3 style='color: blue'>Please select a module</h3>"
   }


   public openModule(args: { modID: string, initialParams?: any }) {


      let moduleInfo = getModules().get(args.modID);
      if (!moduleInfo) {
         // // Create a blank screen if the menu does not exist
         // moduleInfo = new ModuleInfo({
         //                                moduleInitFunction: webUIStart.mainUI.defaultModuleInitFunction
         //                             });
         getErrorHandler().displayErrorMessageToUser(`Module ID ${args.modID} is not in the list of modules. Add it first using the ModuleRegistry.addModule(module) function!!`)
         return;
      }

      let currentModuleId = sessionStorage.getItem(STORAGE_CURRENT_MODULE_ID);
      if (currentModuleId) {
         let currentModuleInfo: ModuleInfo = getModules().get(currentModuleId);
         if (currentModuleInfo) {
            if (currentModuleInfo.moduleExitFunction) {

               // inform previous module that it's exiting
               currentModuleInfo.moduleExitFunction(
                  currentModuleInfo,
                  moduleInfo,
                  null
               )
            }
         }
      }
      sessionStorage.setItem(STORAGE_CURRENT_MODULE_ID, args.modID); // log current module ID

      if (moduleInfo.moduleInitFunction) {
         let f: Function = moduleInfo.moduleInitFunction;

         let moduleInit = new ModuleInit({
                                            currentDocument:      document,
                                            currentWindow:        window,
                                            moduleContainerTagID: getModuleContainerTagID(),
                                            initialParams:        args.initialParams
                                         });

         this.lastOpenModule_modId         = args.modID;
         this.lastOpenModule_initialParams = args.initialParams;

         f(moduleInit);
      }
   }


   public renderModuleMenu() {
      if (this.treeView) {
         this.treeView.destroy() // remove the old tree
      }

      let treeModel: { [key: string]: Object } [] = [];
      treeModel.push(
         {
            id:           '0',
            name:         "Menu",
            hasAttribute: {class: 'remove rename'},
            hasChild:     true,
            expanded:     true,
         }
      );

      let modules = getModules();

      // Map iterates in insertion order in JS6
      modules.forEach(function (module) {
                         if (module.showInMenu) {
                            let treeEntry: any = {
                               id:       module.id,
                               name:     module.name,
                               pid:      '0',
                               hasChild: false

                            };
                            //modules are added in the order in which they were added. That means the order they defined in the webpack 'entries'
                            treeModel.push(treeEntry);
                         }
                      }
      );


      let classThis: MainUI = this; // save the context so it can be used from inside the nodeSelected event

      // Render the TreeView by mapping its fields property with data source properties
      this.treeView = new TreeView({
                                      fields: {
                                         dataSource:     treeModel,
                                         id:             'id',
                                         text:           'name',
                                         parentID:       'pid',
                                         hasChildren:    'hasChild',
                                         htmlAttributes: 'hasAttribute'
                                      },

                                      nodeSelected: function (evt) {
                                         let nodeData: object = evt.nodeData;
                                         // console.log("Selected: " + JSON.stringify(nodeData));

                                         let moduleID: string = nodeData['id'];

                                         classThis.openModule({modID: moduleID});
                                         classThis.treeView.selectedNodes = [];
                                         classThis._selectionListeners.forEach(listener => {
                                            listener.nodeSelected();
                                         });
                                      }

                                   });

      this.treeView.appendTo(`#${getModuleMenuTagID()}`)
   } // createModuleTree

   createSlider() {

      let defaultSidebar: Sidebar = new Sidebar({
                                                   width: "25%",
                                                   type:  "Push",
                                                   // target: '.maincontent'
                                                });
      defaultSidebar.appendTo(`#${getSidebarTagID()}`);
      //end of Sidebar initialization


      let menuButtonStates = {
         menuClosed: "Menu",
         menuOpen:   "Close"
      };

      //toggle button initialization
      let togglebtn: Button = new Button(
         {
            cssClass: `e-btn e-info`,
            iconCss:  `e-icons ${ej2_icon_menu_hamburger}`,
            isToggle: true,
            content:  menuButtonStates.menuClosed
         },
         '#toggle');

      // noinspection JSUnusedLocalSymbols
      let closeBtn: Button = new Button(
         {
            cssClass: `e-btn e-info`,
            iconCss:  `e-icons ${ej2_icon_close} app-sidebar-close-button`,
            isToggle: true,
            content:  menuButtonStates.menuOpen
         },
         '#close');


      function closeSideBar() {
         defaultSidebar.hide();
         let toggleButton: HTMLElement = document.getElementById('toggle');
         toggleButton.classList.remove('e-active');
         togglebtn.content = menuButtonStates.menuClosed;
         setTimeout(() => {
                       // remove the leftover ripple divs
                       let childrenToRemove = toggleButton.getElementsByClassName('e-ripple-element');
                       let len              = childrenToRemove.length;
                       for (let i = 0; i < len; i++) {
                          let child = childrenToRemove[i];
                          if (child) {
                             let childParent = child.parentNode;
                             if (childParent) {
                                childParent.removeChild(child);
                             }
                          }
                       }

                       window.dispatchEvent(new Event('resize'));
                    },
                    50);
      }


      this._selectionListeners.push(new class implements SelectionListener {
         nodeSelected(): void {
            closeSideBar();
         }
      });


      // Close the Sidebar
      document.getElementById('close').onclick = (): void => {
         closeSideBar()
      };


      //Click Event.
      document.getElementById('toggle').onclick = (ev): void => {
         if (document.getElementById('toggle').classList.contains('e-active')) {
            // togglebtn.content = menuButtonStates.menuOpen;
            defaultSidebar.show();

            // // on click outside sidebar, close it
            utils.callbackOnClickOutside(defaultSidebar, defaultSidebar.element, () => {
               closeSideBar();
            })
         } else {
            togglebtn.content = menuButtonStates.menuClosed;
            defaultSidebar.hide();
         }
         ev.stopPropagation(); // do not propagate to window
      };

   } // createSlider

} // MainUI

export class WebUIStart {
   mainUI: MainUI;

   private readonly _UIStartedListeners: ListenerHandler<any, UIStartedListener> = new ListenerHandler<any, UIStartedListener>();

   // noinspection JSUnusedGlobalSymbols
   public async start() {

      try {
         if (coreUI.webUIStart) {

            let thisX = coreUI.webUIStart;

            // First save the base URL of the application for later relative URL processing
            let baseURL = new URL(".", window.location.href);// Startup should always occur in index.html. Therefore that is the appBase
            cu.setAppBase(baseURL);

            let initialParamsAsString: string = decodeURI(window.location.hash.substr(1)); // all the stuff after # but without #

            if (thisX.mainUI) {
               // console.log("Calling mainUI with custom UI of type " + thisX.mainUI.constructor.name)
            } else {
               // console.log("Calling mainUI with default MainUI instance");
               thisX.mainUI = new coreUI.MainUI();
            }

            //---------- 2020-05-13 Dave - tag the instance with the start listeners
            let existingListeners = thisX.mainUI.UIStartedListeners;
            if (existingListeners) {
               existingListeners.list().forEach(value => {
                  thisX._UIStartedListeners.add(value); // merge the 2 lists of listeners
               })
            }
            thisX.mainUI.UIStartedListeners = thisX._UIStartedListeners;
            //--------------


            thisX.mainUI.init();

            //Await all the aync activity to finish
            await thisX.mainUI.init_async();

            // Menu system started.

            try {
               // Process the initial parameters
               if (initialParamsAsString.startsWith('{') && initialParamsAsString.endsWith('}')) {
                  // it's JSON
                  let initParams = JSON.parse(initialParamsAsString);
                  if (initParams.mod)
                     thisX.mainUI.openModule({modID: initParams.mod as string, initialParams: initParams});
               }
            } catch (ex) {
               let errorHandler = getErrorHandler();
               errorHandler.displayExceptionToUser(ex);
            }
         }
      } catch (ex) {
         // A catastrophic error has occurred on instantiating the very basic UI for the app
         console.log(ex);
         window.alert('Startup error: ' + ex);
      }
   };


   get UIStartedListeners(): ListenerHandler<any, UIStartedListener> {
      return this._UIStartedListeners;
   }
}

// console.log("Initialized webUIStart  ");
export var webUIStart: WebUIStart = new WebUIStart();// overwriteable from a module

//
// // /* GLOBAL STARTUP*/
// ////  ---- this code executes twice because of code duplication from bionexus.ts and core.ts transpiling duplicating all of CoreUI.ts and others
// // document.addEventListener("DOMContentLoaded",
// //     startup
// // );
// /* GLOBAL STARTUP*/
// window.onload = startup;
