import {AnyWidget}                                                             from "../AnyWidget";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                                    from "../Args_AnyWidget";
import {AbstractWidget, Args_AbstractWidget}                                   from "../AbstractWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";

import {Sidebar, SidebarModel} from '@syncfusion/ej2-navigations';
import {EventArgs}             from "@syncfusion/ej2-navigations/src/sidebar/sidebar";

export class Args_WgtSidebar_VisualStateChanged<T extends AbstractWgtSidebar> {
   wgtSidebar: T;
   sidebarvisible: boolean;
}

export class Args_WgtSidebar extends Args_AbstractWidget {
   /**
    * If this is present,  a new wrapper div is created around the whole Sidebar (aside and content)
    */
   wrapper           ?: IArgs_HtmlTag;
   ej ?: SidebarModel
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

export abstract class AbstractWgtSidebar extends AnyWidget<Sidebar, Args_WgtSidebar, any> {
   protected argsWgtSidebar: Args_WgtSidebar;
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

   async initialize_AbstractWgtSidebar(args: Args_WgtSidebar) {
      let thisX = this;

      if (!args)
         args = {};
      if (!args.ej)
         args.ej = {};

      this.argsWgtSidebar  = args;
      this.content         = args.content;
      this.exteriorContent = args.exteriorContent;
      if (this.content)
         this.contentResolved = await this.content
      if (this.exteriorContent)
         this.exteriorContentResolved = await this.exteriorContent


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
   } // initialize_WgtTreeGrid

   async localContentBegin(): Promise<string> {

      let x: string = "";

      // x += `<aside id="${this.tagId}"></aside>`
      x += `<aside id="${this.tagId}">`
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
      if (this.obj) {
         this.content = value;
         if (value)
            setImmediate(async () => {
               this.contentResolved = await value;
            })
      }
   }

   get contentWrapperTagId(): string {
      return `${this.tagId}_content`;
   }

   get contentWrapperHTMLElement(): HTMLElement {
      return document.getElementById(this.contentWrapperTagId);
   }

} // main class