import {AnyWidget, Args_AnyWidget}          from "../../AnyWidget";
import {AbstractWidget, addWidgetClass}     from "../../AbstractWidget";

import {Sidebar, SidebarModel}              from '@syncfusion/ej2-navigations';
import {EventArgs}                          from "@syncfusion/ej2-navigations/src/sidebar/sidebar";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../../../BaseUtils";

export class Args_WgtSidebar_VisualStateChanged<T extends AbstractSidebar> {
   wgtSidebar: T;
   sidebarvisible: boolean;
}

export class Args_AbstractSidebar extends Args_AnyWidget<SidebarModel> {

   content ?: AbstractWidget | Promise<AbstractWidget>
   /**
    * Mandatory wrapper styles around the AbstractWidget content
    */
   contentWrapper?: IArgs_HtmlTag;

   /**
    * The exterior content that is still visible when the sidebar is hidden.
    * For example a div containing a toggle button that opens and closes the Sidebar
    */
   exteriorContent ?: AbstractWidget | Promise<AbstractWidget>

   /**
    * Event triggered whenever the visual state changes (sidebar visible/hidden)
    */
   visualStateChanged ?: (ev: Args_WgtSidebar_VisualStateChanged<any>) => Promise<void>;
}

export abstract class AbstractSidebar extends AnyWidget<Sidebar, Args_AbstractSidebar, any> {
   protected argsWgtSidebar: Args_AbstractSidebar;
   protected content: AbstractWidget | Promise<AbstractWidget>
   protected contentResolved: AbstractWidget;
   protected exteriorContent: AbstractWidget | Promise<AbstractWidget>
   protected exteriorContentResolved: AbstractWidget;

   /**
    * Flag that reliably shows the status of the panel (whether visible or hidden)
    */
   sidebarVisible: boolean = false;

   protected constructor() {
      super();
   }

   protected async initialize_AbstractSidebar(args: Args_AbstractSidebar) {
      args      = IArgs_HtmlTag_Utils.init(args);
      args.ej   = args.ej || {};
      addWidgetClass(args,'AbstractSidebar');

      this.argsWgtSidebar  = args;
      this.content         = args.content;
      this.exteriorContent = args.exteriorContent;
      if (args.ej?.isOpen != null)
         this.sidebarVisible = args.ej.isOpen
      if (this.content)
         this.contentResolved = await this.content
      if (this.exteriorContent)
         this.exteriorContentResolved = await this.exteriorContent


      await this.initialize_AnyWidget(args);

   } // initialize_WgtTreeGrid

   async localContentBegin(): Promise<string> {
      let x: string = "";

      x += `<aside id="${this.tagId}" ${IArgs_HtmlTag_Utils.all(this.argsWgtSidebar)}>`;
      if (this.argsWgtSidebar?.contentWrapper) {
         this.argsWgtSidebar.contentWrapper = IArgs_HtmlTag_Utils.init(this.argsWgtSidebar.contentWrapper);
         x += `<${this.argsWgtSidebar.contentWrapper.htmlTagType} id="${this.contentWrapperTagId}" ${IArgs_HtmlTag_Utils.all(this.argsWgtSidebar.contentWrapper)}>`;
      }

      if (this.contentResolved)
         x += `${await this.contentResolved.initContent()}`;

      if (this.argsWgtSidebar?.contentWrapper) {
         x += `</${this.argsWgtSidebar.contentWrapper.htmlTagType}>`; // <!-- id="${this.contentTagId}" -->
      }

      x += `</aside>`;

      if (this.argsWgtSidebar?.wrapper) {
         this.argsWgtSidebar.wrapper = IArgs_HtmlTag_Utils.init(this.argsWgtSidebar.wrapper);
         x += `<${this.argsWgtSidebar.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.argsWgtSidebar.wrapper)}>`;
      }

      if (this.exteriorContentResolved)
         x += await this.exteriorContentResolved.initContent();

      if (this.argsWgtSidebar?.wrapper) {
         x += `</${this.argsWgtSidebar.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin


   async localLogicImplementation() {
      let thisX            = this;
      let anchor           = this.hget;
      let ej: SidebarModel = this.argsWgtSidebar?.ej || {}

      let userOpen = ej.open;
      ej.open      = (ev: EventArgs) => {
         thisX.sidebarVisible = true;

         try {
            if (thisX.argsWgtSidebar.visualStateChanged) {
               thisX.argsWgtSidebar.visualStateChanged({
                                                          wgtSidebar:     thisX,
                                                          sidebarvisible: true,
                                                       })
            }
         } catch (err) {
            thisX.handleWidgetError(err);
         }

         if (userOpen)
            userOpen.call(this, ev);

         // //after open, show close icon
         // toggleButton.content = btnIconClosed;
         // // toggleButton.refresh();
      }

      let userClose = ej.close;
      ej.close      = (ev: EventArgs) => {
         thisX.sidebarVisible = false;

         try {
            if (thisX.argsWgtSidebar.visualStateChanged) {
               thisX.argsWgtSidebar.visualStateChanged({
                                                          wgtSidebar:     thisX,
                                                          sidebarvisible: false,
                                                       })
            }
         } catch (err) {
            thisX.handleWidgetError(err);
         }

         if (userClose)
            userClose.call(this, ev);

         // //after close, show open icon
         // toggleButton.content = btnIconOpen;
         // // toggleButton.refresh();
      }


      this.obj = new Sidebar(this.argsWgtSidebar?.ej);
      this.obj.appendTo(anchor);
      try {
         if (this.contentResolved)
            await this.contentResolved.initLogic();

      } catch (ex) {
         this.widgetErrorHandler.handleWidgetError(ex);
      }
      try {
         if (this.exteriorContentResolved)
            await this.exteriorContentResolved.initLogic();
      } catch (ex) {
         this.widgetErrorHandler.handleWidgetError(ex);
      }


   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         await this?.contentResolved?.destroy();
         this.contentResolved                     = null
         this.content                             = null;
         this.contentWrapperHTMLElement.innerHTML = ''; // dispose of content
      }
   } // localClearImplementation

   async localRefreshImplementation() {
      try {
         if (this.obj) {
            this.obj.refresh();
         }
      } catch (ex) {
         this.widgetErrorHandler.handleWidgetError(ex);
      }
   } // localRefreshImplementation


   async localDestroyImplementation(): Promise<void> {
      try {
         if (this.contentResolved) {
            await this.contentResolved.destroy();
            this.contentResolved = null;
            this.content         = null;
            this.argsWgtSidebar  = null;
         }
      } catch (ex) {
         this.widgetErrorHandler.handleWidgetError(ex);
      }
      return super.localDestroyImplementation();
   }

   get value(): AbstractWidget | Promise<AbstractWidget> {
      if (this.obj)
         return this.content;
      else
         return null;
   }

   set value(value: AbstractWidget | Promise<AbstractWidget>) {
      let thisX = this;
      if (this.obj) {
         this.content = value;
         if (value)
            setTimeout(async () => {
               thisX.contentResolved = await value;
               thisX.setSuperValue(thisX.contentResolved);
            }); // set timeout to immediate
      }
   }

   /**
    * Method exists because we cannot call super.value from setTimeout, but we can call thisX.setSuperValue
    * @param val
    * @private
    */
   private setSuperValue(val: AbstractWidget ){
      super.value = val;
   }

   get contentWrapperTagId(): string {
      return `${this.tagId}_content`;
   }

   get contentWrapperHTMLElement(): HTMLElement {
      return document.getElementById(this.contentWrapperTagId);
   }

} // main class