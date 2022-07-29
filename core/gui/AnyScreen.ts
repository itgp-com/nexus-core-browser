import {AnyWidget}                     from "./AnyWidget";
import {Args_AnyWidget}                from "./Args_AnyWidget";
import {getRandomString}                            from "../ej2/WidgetUtils";
import {addCssClass, htmlToElement, removeTemplate} from "../CoreUtils";
import {CSS_FLEX_MAX_XY}                            from "./css/CssDef";
import {Args_AbstractWidget}           from "./AbstractWidget";

export class Args_AnyScreen<CONTROLMODEL = any>  extends Args_AnyWidget<CONTROLMODEL>  {
   tagName ?: string = 'div';
   overwriteDefaultClasses ?: string[];

} //AnyScreenParams

/**
 * The base component of any screen - be it in the base window itself or inside a Dialog/Popup
 *
 * Default HTML is:
 * <div id="contentXYZ" class="flex-component-max flex-full-height">
 * </div>
 *
 * @author David Pociu - InsiTech
 * @since 0.1
 */
export abstract class AnyScreen<DATA_TYPE = any>
   extends AnyWidget<HTMLElement, Args_AnyWidget, DATA_TYPE> {

   private _anyScreenDescriptor: Args_AnyScreen;
   private _extraTagIdList: string[]    = [];
   protected insideInitRefreshAnyScreen = false;
   protected _templateIdList: string[]  = [];

   /**
    * Unique uuid that will uniquely identify this screen even after any future refactoring changes the name of the class
    */
   private _ui_uuid: string;

   protected constructor() {
      super();
   }


   initialize_AnyScreen(anyScreenDescriptor ?: Args_AnyScreen) {
      let thisX = this;

      if (anyScreenDescriptor)
         // ensure that default fields are filled, but overwritten by contents of parameter passed in
         anyScreenDescriptor = {...new Args_AnyScreen(), ...anyScreenDescriptor};
      else
         anyScreenDescriptor = new Args_AnyScreen();

      // Initialize as extension of AnyWidget
      Args_AnyWidget.initialize(anyScreenDescriptor, this);

      this.anyScreenDescriptor = anyScreenDescriptor;

      if (anyScreenDescriptor.overwriteDefaultClasses) {
         // anyScreenDescriptor.classSpecificCssClasses not null because of the  Args_AnyWidget.initialize call above
         addCssClass(anyScreenDescriptor, anyScreenDescriptor.overwriteDefaultClasses);
      } else {
         addCssClass(anyScreenDescriptor, CSS_FLEX_MAX_XY);
      }

      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(anyScreenDescriptor, true);

      anyScreenDescriptor.localContentBegin = () => {
         return `<${anyScreenDescriptor.tagName} id="${this.tagId}" ${classString}>`
      };


      // ------------------ initContentEnd --------------------------
      anyScreenDescriptor.localContentEnd = () => {
         let b: string = '';

         if (anyScreenDescriptor.extraTagIdCount > 0) {
            for (let i = 0; i < anyScreenDescriptor.extraTagIdCount; i++) {
               let extraTagId = getRandomString(`extraTagId${i}`);

               // store the tag id in the list
               this.extraTagIdList.push(extraTagId);

               // add the div tag in the HTML
               b += `
<div id="${extraTagId}"></div>
`;

            } //for anyScreenDescriptor.extraTagIdCount
         } //if (descriptor.extraTagIdCount > 0)

         b += `</${anyScreenDescriptor.tagName}>`;
         return b;
      };

      // ------------------ initLogic --------------------------
      anyScreenDescriptor.initLogic = () => {
         //2020-05-11 - The refresh MUST be AFTER the form is done painting if we want the spinner to show up in the grids of the screen
         setImmediate(async () => {
            thisX.insideInitRefreshAnyScreen = true;
            await thisX.refresh(); // a screen should always refresh the controls at the end of their being instantiated
            thisX.insideInitRefreshAnyScreen = false;
         });
      };


      // -------------- NOW properly initialize the super component ---------------
      super.initialize_AnyWidget(anyScreenDescriptor);
   } // initAnyScreen


   /**
    * @since 1,0.24
    */
   async localDestroyImplementation() {
      try {

         let list = this.listTemplateIds();

         // remove all templates added to this screen
         if (list?.length > 0) {
            for (let i = list.length - 1; i >= 0; i--) {
               let listTemplateId = list[i];
               if (listTemplateId) {
                  try {
                     removeTemplate(this, listTemplateId);
                  } catch (ex) {
                     console.log(ex);
                  }
               }
            } // for
         } // if list
      } catch (ex) {
         console.log(ex);
      }
      await super.localDestroyImplementation();
   }


   // noinspection JSUnusedGlobalSymbols
   extraTagId(position: number): string {
      if (position < 0 || position > this.extraTagIdList.length)
         return null;
      return this.extraTagIdList[position];
   } // extraTagId


   // noinspection JSUnusedGlobalSymbols
   get anyScreenDescriptor(): Args_AnyScreen {
      return this._anyScreenDescriptor;
   }

   set anyScreenDescriptor(value: Args_AnyScreen) {
      this._anyScreenDescriptor = value;
   }

   get extraTagIdList(): string[] {
      return this._extraTagIdList;
   }

   // noinspection JSUnusedGlobalSymbols
   set extraTagIdList(value: string[]) {
      this._extraTagIdList = value;
   }

   get contentTagId(): string {
      return this.tagId;
   }

   isInsideRefreshAnyScreen(): boolean {
      if (this.insideInitRefreshAnyScreen)
         return true;
      let parent = this.parent;

      while (parent != null && parent instanceof AnyScreen) {
         return parent.isInsideRefreshAnyScreen()
      }
      return false;
   }

   /**
    * Unique uuid that will uniquely identify this screen even after any future refactoring changes the name of the class
    */
   get ui_uuid(): string {
      return this._ui_uuid;
   }

   set ui_uuid(value: string) {
      this._ui_uuid = value;
   }


   addTemplateId(template_id: string) {
      let index = this._templateIdList.indexOf(template_id);
      if (index < 0) {
         this._templateIdList.push(template_id)
      }
   }

   removeTemplateId(template_id: string) {
      let index = this._templateIdList.indexOf(template_id);
      if (index >= 0) {
         this._templateIdList.splice(index, 1);
      }
   }

   listTemplateIds() {
      return this._templateIdList;
   }


   /**
    * Append DIV with uniqueID to the screen and return that id if successful. Return null if it failed
    */
   appendDivToScreen(): string {
      let id          = getRandomString(this.thisClassName);
      let htmlContent = `<div id="${id}"></div>`
      let success     = this.appendHTMLToScreen(htmlContent);
      if (success) {
         return id;
      } else {
         return null;
      }
   }

   /**
    * Append html string to the screen
    *
    * @param htmlContent html to be added. Ex: <div id="2342342"></div>
    * @return <code>true</code> if successful, <code>false</code> if it fails (exception logged in console)
    */
   appendHTMLToScreen(htmlContent: string): boolean {

      let success = false;
      try {
         if (htmlContent) {
            let contentElement = htmlToElement(htmlContent);
            this.hget.appendChild(contentElement);
            success = true;
         }
      } catch (ex) {
         console.log(ex);
      }

      return success;
   }


} // AnyScreen