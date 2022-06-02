import {AnyWidget}                                                             from "../AnyWidget";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                                    from "../Args_AnyWidget";
import {AbstractWidget, Args_AbstractWidget}                                   from "../AbstractWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";

import {Sidebar, SidebarModel} from '@syncfusion/ej2-navigations';

export class Args_AbstractWgtSidebar extends Args_AbstractWidget {
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


}

export abstract class AbstractWgtSidebar extends AnyWidget<Sidebar, Args_AbstractWgtSidebar, any> {
   protected argsWgtSidebar: Args_AbstractWgtSidebar;
   protected content: AbstractWidget | Promise<AbstractWidget>
   private _resolvedContent: AbstractWidget;

   protected constructor() {
      super();
   }

   initialize_AbstractWgtSidebar(args: Args_AbstractWgtSidebar) {
      let thisX = this;

      if (!args)
         args = {};
      if (!args.ej)
         args.ej = {};

      this.argsWgtSidebar = args;

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
      if (this._resolvedContent == null)
         this._resolvedContent = await this.content

      let x: string = "";
      if (this.argsWgtSidebar?.wrapper) {
         this.argsWgtSidebar.wrapper = IArgs_HtmlTag_Utils.init(this.argsWgtSidebar.wrapper);
         x += `<${this.argsWgtSidebar.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.argsWgtSidebar.wrapper)}>`;
      }

      x += `<aside id="${this.tagId}"></aside>`

      if (this.argsWgtSidebar?.contentWrapper) {
         this.argsWgtSidebar.contentWrapper = IArgs_HtmlTag_Utils.init(this.argsWgtSidebar.contentWrapper);
         x += `<${this.argsWgtSidebar.contentWrapper.htmlTagType} id="${this.contentWrapperTagId}" ${IArgs_HtmlTag_Utils.all(this.argsWgtSidebar.contentWrapper)}>`;
      }

      if (this._resolvedContent)
         x += `${await this._resolvedContent.initContent()}`;

      if (this.argsWgtSidebar?.contentWrapper) {
         x += `</${this.argsWgtSidebar.contentWrapper.htmlTagType}>`; // <!-- id="${this.contentTagId}" -->
      }


      if (this.argsWgtSidebar?.wrapper) {
         x += `</${this.argsWgtSidebar.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new Sidebar(this.argsWgtSidebar?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         if (this._resolvedContent = null)
            this._resolvedContent = await this.content;
         await this._resolvedContent?.destroy();
         this._resolvedContent                    = null
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
         this.handleError(ex);
      }
   } // localRefreshImplementation


   async localDestroyImplementation(): Promise<void> {
      try {
         if (this.content) {
            this._resolvedContent = await this.content
            await this._resolvedContent.destroy();
            this._resolvedContent = null;
            this.content = null;
            this.argsWgtSidebar = null;
         }
      } catch (ex) {
         this.handleError(ex);
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
         this.content          = value;
         this._resolvedContent = null;
      }
   }

   get contentWrapperTagId(): string {
      return `${this.tagId}_content`;
   }

   get contentWrapperHTMLElement(): HTMLElement {
      return document.getElementById(this.contentWrapperTagId);
   }

} // main class