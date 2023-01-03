import {AbstractDialogWindow, Args_AbstractDialogWindow} from "../abstract/AbstractDialogWindow";
import {WxPanelBase}                                     from "../../ej2/panel/WxPanelBase";
import {CoreOnly_PopupDialogContent}                     from "../../coreonly/CoreOnly_PopupDialogContent";
import {BeforeCloseEventArgs}                            from "@syncfusion/ej2-popups";
import {AbstractWidget}                                  from "../../AbstractWidget";
import {AnyScreen}                                       from "../../AnyScreen";

export class Args_WxDialogWindow extends Args_AbstractDialogWindow {
   horizontal_button_space ?: number;
}

export class WxDialogWindow extends AbstractDialogWindow<Args_WxDialogWindow> {
   static readonly CLASS_NAME: string = 'WxDialogWindow';

//------------------------- constructor -------------------
   protected constructor() {
      super();

   } // constructor

   static async createAndShow(args: Args_WxDialogWindow) {
      let instance = await WxDialogWindow.create(args);
      instance.show();
      return instance;
   }

   static async create(args: Args_WxDialogWindow) {
      let instance: WxDialogWindow = new WxDialogWindow();
      await instance._initialize(args);
      return instance;
   }

   async _initialize(args: Args_WxDialogWindow) {
      // App specific flags
      if (args == null)
         args = new Args_WxDialogWindow();

      args.htmlClass = args.htmlClass || '';
      args.htmlClass += (args.htmlClass ? ' ' + WxDialogWindow.CLASS_NAME : WxDialogWindow.CLASS_NAME);
      args.htmlClass += ' flex-component-max flex-full-height';

      if (args.horizontal_button_space == null)
         args.horizontal_button_space = 15;

      if (args.showHeaderBackArrow == null)
         args.showHeaderBackArrow = true; // unless otherwise instructed, show the back arrow all the time

      await this.initialize_AbstractDialogWindow(args);
   }

   protected async beforeHeaderInstantiated() {

      if (!this.resolvedContent)
         return;
      if (this.resolvedContent instanceof WxPanelBase) {
         // this.initArgs.headerEndWidgets = getOrcaDialogHeaderWidgets(this, this.resolvedContent);
         this.initArgs.headerEndWidgets    = this.headerWidgets(this, this.resolvedContent);
      } // if WgtScreen_Main_App

      if (this.resolvedContent instanceof CoreOnly_PopupDialogContent) {
         // temporary hack for PopupDialog until it's rewritten based on WgtScreen_Grid_App

         this.initArgs.showHeaderBackArrow = true; // unless otherwise instructed, show the back arrow all the time
         // this.initArgs.headerEndWidgets    = await getOrcaDialogHeaderWidgets(this, this.resolvedContent);
         this.initArgs.headerEndWidgets    = this.headerWidgets(this, this.resolvedContent);
      } //if  WgtPopupDialog_Content
   }

   /**
    * Override this method in your application's custom WxWindowDialog to add custom widgets to the header
    * @param thisX
    * @param screenWidget
    */
   async headerWidgets(thisX: WxDialogWindow, screenWidget: AnyScreen): Promise<AbstractWidget[]> {
      return [];
   }



   dialogElement: HTMLElement;

   async beforeClose(ev: BeforeCloseEventArgs): Promise<void> {
      this.dialogElement = ev.element as HTMLElement;
      await super.beforeClose(ev);
   }


   async close(): Promise<void> {
      await super.close();
      if (this.dialogElement) {
         this.dialogElement.classList.remove(WxDialogWindow.CLASS_NAME);
         this.dialogElement.classList.remove('e-resize-viewport'); // clean up Syncfusion dialog leftover
      }
   }
} // class WxDialogWindow