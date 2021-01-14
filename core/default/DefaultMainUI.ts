import {Sidebar, TreeView}                          from "@syncfusion/ej2-navigations";
import * as utils                                   from "../CoreUtils";
import {getModules}                                 from "../ModuleRegistry";
import {getErrorHandler}                            from "../CoreErrorHandling";
import {Button}                                     from "@syncfusion/ej2-buttons";
import {ej2_icon_close, ej2_icon_menu_hamburger} from "../index";
import {openModule, STORAGE_CURRENT_MODULE_ID} from "../ModuleUtils";
import {NexusUI}                               from "../NexusUI";

export interface SelectionListener {
   nodeSelected(): void;
}

export abstract class DefaultMainUI extends NexusUI {

   lastOpenModule_modId: string      = null;
   lastOpenModule_initialParams: any = null;

   initialModuleToDisplay_modId: string      = null;
   initialModuleToDisplay_initialParams: any = null;

   protected treeView: TreeView;
   protected _selectionListeners: SelectionListener[] = [];

   private _treeMenuTagID:string = 'default-treemenu';
   private _sidebarTagID:string  = 'default-sidebar';

   // ----------------------- Start MainUI abstract method implementation -------------------------------
   /**
    * Gets called right after init() to allow for all the initial URL-based processing to happen
    * One should do their await based calls here at the beginning of the app, and only then
    * instantiate the UI
    */
   async init():Promise<void> {
      sessionStorage.removeItem(STORAGE_CURRENT_MODULE_ID); // clean up any previous keys on startup

      // Pre-load the app path for the whole app
      await utils.asyncGetAppPath();
   } // init

   async initUI():Promise<void> {

      this.createSlider(); // should this be here or inside the main method of each app
      this.renderModuleMenu(); // should this be here or inside the main method of each app

      this.openInitialModuleToDisplay();


   } // initUI

   async processURLParameters(initialParamsAsString: string): Promise<void> {
      try {
         // Process the initial parameters
         if (initialParamsAsString.startsWith('{') && initialParamsAsString.endsWith('}')) {
            // it's JSON
            let initParams = JSON.parse(initialParamsAsString);
            if (initParams.mod)
               await openModule({modID: initParams.mod as string, initialParams: initParams});
         }
      } catch (ex) {
         let errorHandler = getErrorHandler();
         errorHandler.displayExceptionToUser(ex);
      }
   } // processURLParameters



   // ----------------------- End MainUI abstract method implementation -------------------------------

   public openInitialModuleToDisplay() {
      let thisX = this;
      setTimeout(
         async () => {
            await thisX._openInitialModuleToDisplay();
         }

         , 500); // do this after everything is painted and loaded
   }

   protected async _openInitialModuleToDisplay() {
      if (this.lastOpenModule_modId == null) {
         // if no other module has been opened, then initialize the view to this module
         if (this.initialModuleToDisplay_modId != null) {
            // if there's an initial module defined, open it
            await openModule({
                                     modID:         this.initialModuleToDisplay_modId,
                                     initialParams: this.initialModuleToDisplay_initialParams
                                  });
         }
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


      let classThis = this; // save the context so it can be used from inside the nodeSelected event

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

                                      nodeSelected: async function (evt) {
                                         let nodeData: object = evt.nodeData;
                                         // console.log("Selected: " + JSON.stringify(nodeData));

                                         let moduleID: string = nodeData['id'];

                                         await openModule({modID: moduleID});
                                         classThis.treeView.selectedNodes = [];
                                         classThis._selectionListeners.forEach(listener => {
                                            listener.nodeSelected();
                                         });
                                      }

                                   });

      this.treeView.appendTo(`#${this.treeMenuTagID}`)
   } // createModuleTree

   createSlider() {

      let defaultSidebar: Sidebar = new Sidebar({
                                                   width: "25%",
                                                   type:  "Push",
                                                   // target: '.maincontent'
                                                });
      defaultSidebar.appendTo(`#${this.sidebarTagID}`);
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

   }


   get treeMenuTagID(): string {
      return this._treeMenuTagID;
   }

   set treeMenuTagID(value: string) {
      this._treeMenuTagID = value;
   }

   get sidebarTagID(): string {
      return this._sidebarTagID;
   }

   set sidebarTagID(value: string) {
      this._sidebarTagID = value;
   }


} // main class