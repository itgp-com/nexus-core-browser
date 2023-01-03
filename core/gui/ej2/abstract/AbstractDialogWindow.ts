// noinspection UnnecessaryLocalVariableJS

import {getRandomString, hget}                                                   from "../../../BaseUtils";
import {getErrorHandler}                                                         from "../../../CoreErrorHandling";
import {ErrorHandler}                                                            from "../../../ErrorHandler";
import {AbstractWidget}                                                          from "../../AbstractWidget";
import {CoreOnly_SpacerHorizontal}                                               from "../../coreonly/CoreOnly_SpacerHorizontal";
import {CoreOnly_RowFlex}                                                        from "../../coreonly/CoreOnly_RowFlex";
import {CoreLabel}                                                               from "../../coreonly/CoreLabel";
import {CoreWgtPanel_HTML}                                                       from "../../coreonly/CoreWgtPanel_HTML";
import {IDialogWindow}                                                           from "./IDialogWindow";
import {BeforeCloseEventArgs, BeforeOpenEventArgs, Dialog, DialogModel, Tooltip} from "@syncfusion/ej2-popups";
import {AnimationSettingsModel}                                                  from "@syncfusion/ej2-popups/src/dialog/dialog-model";
import {isString}                                                                from "lodash";


export abstract class Args_AbstractDialogWindow {

   dialogTagId ?: string;
   content: AbstractWidget<any> | Promise<AbstractWidget<any>>;
   header ?: string | Promise<string> | AbstractWidget<any> | Promise<AbstractWidget<any>>;
   cssClass ?: string;
   isModal ?: boolean;
   animationSettings ?: AnimationSettingsModel;
   showCloseIcon ?: boolean;
   closeOnEscape ?: boolean;
   allowDragging ?: boolean;
   visible ?: boolean;
   width?: string | number | undefined;
   height?: string | number | undefined;
   enableResize?: boolean;
   htmlClassesPrefix ?: string;
   htmlClass ?: string;
   htmlClassesSuffix?: string;
   htmlStyle?: string;


   headerStartWidgets?: AbstractWidget[] | Promise<AbstractWidget[]>;
   showHeaderBackArrow?: boolean;

   headerEndWidgets?: AbstractWidget[] | Promise<AbstractWidget[]>;

   onBeforeOpen?(instance: AbstractDialogWindow): void;

   onAfterOpen?(instance: AbstractDialogWindow): void;

   /**
    *
    * @param instance
    * return true if close should continue, false otherwise
    */
   onBeforeClose?(instance: AbstractDialogWindow): boolean | Promise<boolean>;

   onAfterClose?(instance: AbstractDialogWindow): void;

   /**
    * Optional function that if it exists, will be called instead of screen.destroy().
    * The original screen.destroy() should usually be called inside the implementation of this function
    */
   destroy_function ?: (screen: (AbstractWidget | Promise<AbstractWidget>)) => (void | Promise<void>);
}

export class DialogWindowOpenEvent {
   instance: AbstractDialogWindow;
}

export abstract class AbstractDialogWindow<ARGS_TYPE extends Args_AbstractDialogWindow = Args_AbstractDialogWindow> implements IDialogWindow {

   private _initArgs: ARGS_TYPE;
   readonly dialogContentTagId: string = getRandomString('dialogContent');
   protected resolvedContent: AbstractWidget<any>;
   protected localAnchorID: string;

   // noinspection JSUnusedLocalSymbols
   private _dialogModel: DialogModel;

   private _dialog: Dialog;
   private _beforeCloseHideCalled: boolean = false;

   protected headerWidget: AbstractWidget;
   readonly headerBackArrowId: string = getRandomString('hdrBackArrow');
   readonly headerRefreshId: string   = getRandomString('hrdRefresh');

   /**
    * The color of the back arrow in the header. Overwrite in extending classes
    */
   color_header_font: string       = 'white';
   color_header_background: string = 'black';


   protected async initialize_AbstractDialogWindow(args: ARGS_TYPE) {
      let thisX     = this;
      this.initArgs = args;

      // initialize class and style
      if (args.htmlClassesPrefix == null)
         args.htmlClassesPrefix = "";
      if (!args.htmlClass)
         args.htmlClass = "flex-component-max flex-full-height";
      if (!args.htmlClassesSuffix)
         args.htmlClassesSuffix = "";
      if (!args.htmlStyle)
         args.htmlStyle = "";

      this.dialogModel = await this.initialize_DialogModel();

      if (args.isModal != null)
         this.dialogModel.isModal = args.isModal;

      if (args.animationSettings != null)
         this.dialogModel.animationSettings = args.animationSettings;

      if (args.showCloseIcon != null)
         this.dialogModel.showCloseIcon = args.showCloseIcon;

      if (args.closeOnEscape != null)
         this.dialogModel.closeOnEscape = args.closeOnEscape;

      if (args.allowDragging != null)
         this.dialogModel.allowDragging = args.allowDragging;

      if (args.visible != null)
         this.dialogModel.visible = args.visible;

      this.dialogModel.width        = (args.width ? args.width : '99%');
      this.dialogModel.height       = (args.height ? args.height : '99%');
      this.dialogModel.enableResize = (args.enableResize != null ? args.enableResize : true);
      if (args.cssClass) {
         let x         = this.dialogModel.cssClass
         args.cssClass = (x ? `${x} ${args.cssClass}` : args.cssClass);
      }

      this.resolvedContent = await args.content;

      try {
         await this.afterContentResolved(this.resolvedContent);
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }


      let targetElem: HTMLElement;
      if (this.initArgs.dialogTagId)
         targetElem = hget(this.initArgs.dialogTagId)
      else {
         this.localAnchorID = getRandomString('anchor_');
         let elem           = document.createElement('div')
         elem.id            = this.localAnchorID
         document.body.appendChild(elem);
         targetElem = elem
      }


      // Create classes for DialogWindow DIV
      let cs = ''
      if (args?.htmlClassesPrefix)
         cs += args.htmlClassesPrefix;
      if (cs.length > 0 && args?.htmlClass)
         cs += ' ';
      if (args?.htmlClass)
         cs += args.htmlClass;
      if (cs.length > 0 && args?.htmlClassesSuffix)
         cs += ' ';
      if (args?.htmlClassesSuffix)
         cs += args.htmlClassesSuffix;
      let style = '';
      if (args.htmlStyle.length > 0)
         style = `style="${args.htmlStyle}"`;


      let dialogContent: string = `
<div id="${this.dialogContentTagId}" class="${cs} ${style}"> 
      `;

      if (this.initArgs && this.resolvedContent)
         dialogContent += await this.resolvedContent.initContent();

      dialogContent += `
</div>
`;
      // this.dialog.content = dialogContent;
      this.dialogModel.content = dialogContent;


      try {
         await this.beforeHeaderInstantiated();
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      thisX.headerWidget      = await thisX.headerMakeHeaderMainRow();
      //this.dialog.header = await thisX.headerWidget.initContent();
      this.dialogModel.header = await thisX.headerWidget.initContent();


      try {
         await this.beforeDialogInstantiated();
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      this.dialog = new Dialog(this.dialogModel, targetElem);

   }


   //--------------- Start Container methods -----------------------

   /**
    * Override this method to insert logic after the content is resolved (awaited)
    * @protected
    */
   protected async afterContentResolved(resolvedContent: AbstractWidget) {

   }

   /**
    * Called before the EJ2 Dialog is instantiated (the entire dialog model including content and header are set).
    * The dialogModel can be found in <code>this.dialogModel</code>, and the initial arguments in <code>this.initArgs</code>
    * @protected
    */
   protected async beforeDialogInstantiated() {

   }

   /**
    * Called before the header og EJ2 Dialog is instantiated, but AFTER the content is resolved (initContent called and set in the DialogModel).
    * The dialogModel can be found in <code>this.dialogModel</code>, and the initial arguments in <code>this.initArgs</code>
    * @protected
    */
   protected async beforeHeaderInstantiated() {

   }


   //--------------------- Start Header methods --------------------

   /**
    * Widgets that are placed before the header text from the parameters and before the headerStartWidgets in the parameters
    * @protected
    */
   protected async headerStartWidgets(): Promise<AbstractWidget[]> {
      return [];
   }

   /**
    * Widgets that are placed after the header text from the parameters but before the headerEndWidgets in the parameters
    * @protected
    */
   protected async headerEndWidgets(): Promise<AbstractWidget[]> {
      return [];
   }


   protected async headerFullWidgetList(): Promise<AbstractWidget[]> {
      let headerFromInitArgs: AbstractWidget = await this.headerMakeWidgetFromArgsHeaderField();

      let list = [];

      try {
         list.push((this.initArgs?.showHeaderBackArrow ? await this.headerBackArrowWidget() : null));
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      try {
         list.push(...await this.headerStartWidgets());
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      try {
         let startWidgets = await this.initArgs?.headerStartWidgets;
         list.push(...(startWidgets ? startWidgets : []));
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      list.push(headerFromInitArgs);

      try {
         list.push(...await this.headerEndWidgets());
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      try {
         let endWidgets = await this.initArgs?.headerEndWidgets;
         list.push(...(endWidgets ? endWidgets : []));
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }


      list.push(await CoreOnly_SpacerHorizontal.create({pixels: 20}));

      return list;
   } // headerMakeHeaderMainRowChildren

   protected async headerMakeHeaderMainRow(): Promise<AbstractWidget> {
      let children = await this.headerFullWidgetList();

      return await CoreOnly_RowFlex.create(
         {
            // htmlTagStyle:    `flex-shrink:0;flex-grow:1;align-content:stretch;`,
            htmlTagStyle: {
               "flex-shrink": 0,
               "flex-grow":   1,
               "align-content": "stretch",
            },
            children: children
         });
   } // headerMakeHeaderMainRow


   /**
    * Override this method to create the Widget that represents the header content passed in from the dialog arguments.
    * This component will then be wrapped along with standard widgets (ex: back arrow, refresh icon, etc.)
    * @protected
    */
   protected async headerMakeWidgetFromArgsHeaderField(): Promise<AbstractWidget> {
      if (this.initArgs.header == null)
         this.initArgs.header = ''; // there's always a header so that we always have the top widgets

      let arg_header: String | AbstractWidget = await this.initArgs.header

      let headerFromInitArgs: AbstractWidget;
      if (isString(arg_header)) {
         // html
         headerFromInitArgs = await CoreLabel.create({labelHTML: arg_header as string, htmlTagStyle: {"align-self": "center", "margin-left":"2px"}, htmlTagType: 'span'});
      } else {
         // AbstractWidget
         headerFromInitArgs = arg_header as AbstractWidget;
      }
      let wrapper = await CoreOnly_RowFlex.create(
         {
            htmlTagStyle:    {"flex-shrink":0, "flex-grow":1,"align-content":"stretch"},
            children: [headerFromInitArgs],
         });
      return wrapper;
   } //header_makeWidgetFromArgs

   /**
    * Creates the back arrow that is placed in the left-most part of the dialog header and allows an iOS-like "Back" effect
    * @protected
    */
   protected async headerBackArrowWidget(): Promise<AbstractWidget> {
      let thisX = this;
      return CoreWgtPanel_HTML.create({
                                     htmlContent:         `<span id="${thisX.headerBackArrowId}"  style="margin-right:5px;"><button type="button" style="background-color: ${thisX.color_header_background}"><i class="fa fa-arrow-circle-left" style="font-weight:900;font-size:20px;color: ${this.color_header_font} !important;"></i></button></span>`,
                                     logicImplementation: async () => {
                                        let htmlElement: HTMLElement = document.getElementById(thisX.headerBackArrowId);
                                        htmlElement.addEventListener('click', (_ev) => {
                                           thisX.headerBackArrowAction.call(thisX, _ev);
                                        });

                                        await thisX.headerBackArrowTooltip();
                                     },
                                  })
   } // header_backArrowWidget

   /**
    * Override this method to control the action taken when the back arrow widget defined in header_backArrowWidget() is clicked
    *
    * Note: if the header_backArrowWidget() method is overridden, then this method might not be called by the new widget.
    * @param _ev
    * @protected
    */
   protected async headerBackArrowAction(_ev: MouseEvent) {
      this.hide(); // close
   } // header_backArrowAction

   protected headerBackArrowTooltip() {
      let htmlElement: HTMLElement = document.getElementById(this.headerBackArrowId);
      if (htmlElement) {
         let tooltip = new Tooltip({
                                      content:   'Close',
                                      openDelay: 300,
                                   });
         tooltip.appendTo(htmlElement);
      }
   } // headerRefreshTooltip


   //-------------------- End Header Methods --------------------


   show() {
      this.dialog.show()
   }

   hide() {
      this.dialog.hide();
   }


   protected async initialize_DialogModel(): Promise<DialogModel> {
      let thisX = this;
      return {
         isModal:           true,
         animationSettings: {effect: "FadeZoom"},
         showCloseIcon:     true,
         closeOnEscape:     true,
         enableResize:      true,
         allowDragging:     true,
         visible:           false,
         cssClass:          thisX.constructor.name, // name of the class

         /*
          The calls below MUST be made using thisX.functionName(args) so that the CONTEXT of the DialogWindow is passed correctly
          Something like:
          beforeOpen:thisX.beforeOpen
          does not pass the context correctly
          */
         beforeOpen:  async (beforeOpenEventArgs: BeforeOpenEventArgs) => {
            await thisX.beforeOpen(beforeOpenEventArgs);
         },
         open:        async (e: any) => {
            await thisX.open(e);
         },
         beforeClose: (beforeCloseEventArgs: BeforeCloseEventArgs) => {
            /**
             * Transforms a synchronous method into asynchronous one by using the _beforeCloseHideCalled flag.
             *
             * First time through, _beforeCloseHideCalled = false
             * The beforeCloseEventArgs.cancel flag is set to true (don't close window) and the asynchronous function
             * thisX.beforeClose(beforeCloseEventArgs) is called.
             *
             * When that executes, if it needs to close the dialog, it will actually invoke the hide() method in the dialog
             *  but first it will set the _beforeCloseHideCalled to true so that the close is allowed to go through in this case.
             *
             */


            if (thisX._beforeCloseHideCalled) {
               beforeCloseEventArgs.cancel  = false; // allow the close since the flag is set
               thisX._beforeCloseHideCalled = false; // reset the flag
            } else {
               beforeCloseEventArgs.cancel = true; // cancel the close in synchronous mode (before async below has executed)
               thisX.beforeClose(beforeCloseEventArgs); // it's async actually, but uses the  _beforeCloseHideCalled
            }

         },
         close:       async (e: any) => {
            try {
               if (this.resolvedContent)
                  await this.resolvedContent.onDialogWindow_Close({dialog: this, closeEventArgs: e});
            } catch (ex) {
               console.error(ex);
            }

            await thisX.close();
         },
      };
   } //initialize_DialogModel

   /**
    * Event triggers when the dialog is being opened. If you cancel this event, the dialog remains closed. Set the cancel argument to true to cancel the open of a dialog.
    * @param beforeOpenEventArgs
    */
   async beforeOpen(beforeOpenEventArgs: BeforeOpenEventArgs) {
      if (this.initArgs) {
         try {
            if (this.initArgs.onBeforeOpen) {
               this.initArgs.onBeforeOpen(this); // call init function
            } // if (this.initArgs.onOpen)
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      } //  if (this.initArgs)

      if (this.resolvedContent) {
         try {
            await this.resolvedContent.onDialogWindow_BeforeOpen({dialog: this, beforeOpenEventArgs: beforeOpenEventArgs});
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      }
   } // beforeOpen

   /**
    * Event triggers when a dialog is opened.
    * @param e
    */
   async open(e: any) {
      let thisX = this;
      // e.preventFocus = true; // preventing focus ( Uncaught TypeError: Cannot read property 'matrix' of undefined in Dialog:  https://www.syncfusion.com/support/directtrac/incidents/255376 )

      if (thisX.initArgs && thisX.headerWidget) {
         try {
            await thisX.headerWidget.initLogic();
         } catch (ex) {
            let eh: ErrorHandler = getErrorHandler();
            eh.displayExceptionToUser(ex);
         }
      }

      if (thisX.initArgs && thisX.resolvedContent) {
         try {
            thisX.resolvedContent.dialogWindowContainer = thisX;
            thisX.resolvedContent.registerInfo(hget(thisX.dialogContentTagId));
            await thisX.resolvedContent.initLogic(); // execute the logic for the content

            try {
               await thisX.resolvedContent.onDialogWindow_Open({dialog: thisX, openEventArgs: e});
            } catch (ex) {
               let eh: ErrorHandler = getErrorHandler();
               eh.displayExceptionToUser(ex);
            }

         } catch (ex) {
            let eh: ErrorHandler = getErrorHandler();
            eh.displayExceptionToUser(ex);
         }

      } //  if (this.initArgs)


      let rootElem = thisX.dialog.getRootElement();
      // If the currently focused element is not a descendand of the popup's root
      // element, then request focus for the popup
      let focusedElement = document.activeElement;
      if (rootElem && focusedElement && rootElem != focusedElement) {
         if (!rootElem.contains(focusedElement)) {
            rootElem.focus();
         }
      }


      if (thisX.initArgs) {
         try {
            if (thisX.initArgs.onAfterOpen) {
               thisX.initArgs.onAfterOpen(thisX); // call init function
            } // if (thisX.initArgs.onOpen)
         } catch (ex) {
            let eh: ErrorHandler = getErrorHandler();
            eh.displayExceptionToUser(ex);
         }
      }
   } // open

   /**
    * Event triggers before the dialog is closed. If you cancel this event, the dialog remains opened. Set the cancel argument to true to cancel the closure of a dialog.
    * @param beforeCloseEventArgs
    */
   async beforeClose(beforeCloseEventArgs: BeforeCloseEventArgs) {
      let shouldClose = true;

      try {

         if (this.initArgs) {
            if (this.initArgs.onBeforeClose) {
               shouldClose = await this.initArgs.onBeforeClose(this); // call init function
            } // if (this.initArgs.onOpen)
         } //  if ( this.initArgs)

         if (shouldClose) {
            if (this.resolvedContent)
               await this.resolvedContent.onDialogWindow_BeforeClose({dialog: this, beforeCloseEventArgs: beforeCloseEventArgs});
         }

      } catch (ex) {
         shouldClose = true; // if exception then close no matter what
         getErrorHandler().displayExceptionToUser(ex);
      }

      if (shouldClose) {
         if (this.resolvedContent) {
            if (this.initArgs.destroy_function) {
               // If the destroy function exists, call that instead of AnyScreen destroy
               await this.initArgs.destroy_function(this.resolvedContent);
            } else {
               await this.resolvedContent.destroy();
            }
         }
         this._beforeCloseHideCalled = true; // allow dialog to actually close
         this._dialog?.hide();
         // } else {
         //    beforeCloseEventArgs.cancel = true; // cancel the close
      } // if (shouldClose)

   } // beforeClose


   /**
    * Triggers AFTER the dialog has been closed.
    */
   async close() {
      try {
         if (this.resolvedContent)
            this.resolvedContent.dialogWindowContainer = undefined;

         this.dialog.destroy(); // clean up after this window


         let focusedElement = document.activeElement;
         if (focusedElement) {
            let elem = focusedElement.parentElement;
            // if it's a rowcell, change the focus from the <a> tag to the grid before doing anything else
            if (elem?.classList?.contains('e-rowcell')) {
               let dialog = elem.closest('.e-dialog') as HTMLElement
               if (dialog) {
                  dialog.focus();
               }
            }

         } else {
            let anchorElem = document.getElementById(this.localAnchorID);
            if (anchorElem) {
               let containingDialogHTMLElement = anchorElem.closest('.e-dialog') as HTMLElement;
               if (containingDialogHTMLElement) {
                  containingDialogHTMLElement.focus();
               }
            }
         }


         if (this.initArgs) {
            if (this.initArgs.onAfterClose) {
               this.initArgs.onAfterClose(this); // call init function
            } // if (this.initArgs.onOpen)
         } //  if ( this.initArgs)

      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      try {
         if (this.localAnchorID) {
            let anchorElem = document.getElementById(this.localAnchorID);
            if (anchorElem)
               anchorElem.parentNode.removeChild(anchorElem);
         }
      } catch (e) {
         console.log(e);
      }
   }


//--------------------------- set/get --------------

   get initArgs(): ARGS_TYPE {
      return this._initArgs;
   }


   set initArgs(value: ARGS_TYPE) {
      this._initArgs = value;
   }

   get dialogModel(): DialogModel {
      return this._dialogModel;
   }

   // noinspection JSUnusedGlobalSymbols
   set dialogModel(value: DialogModel) {
      this._dialogModel = value;
   }

   get dialog(): Dialog {
      return this._dialog;
   }

   set dialog(value: Dialog) {
      this._dialog = value;
   }
}