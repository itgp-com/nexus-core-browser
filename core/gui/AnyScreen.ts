import {getRandomString, htmlToElement}            from "../BaseUtils";
import {CSS_FLEX_MAX_XY}                           from "../CoreCSS";
import {addWidgetClass}                            from "./AbstractWidget";
import {Args_AnyWidget, initialize_Args_AnyWidget} from "./AnyWidget";
import {AnyWidgetStandard}                         from "./AnyWidgetStandard";

export class Args_AnyScreen<CONTROLMODEL = any> extends Args_AnyWidget<CONTROLMODEL> {
   tagName ?: string = 'div';
   overwriteDefaultClasses ?: string[];

} //AnyScreenParams

/**
 * Creates a template under the {@link template_id} id, with the body being the {@link templateHtmlContent}
 * Adds the template id to the screen list of templates
 *
 * <code>
 * <script id="' + instance.template_id + '" type="text/x-template">
 * ${templateHtmlContent}
 * </script>
 * </code>
 * @param screen the screen to add the template to (auto destroys the template on close)
 * @param template_id string unique id for this template
 * @param templateHtmlContent content body to be inserted between <script></script>
 * @return null if there's a problem, the HTMLElement if all is ok
 */
export function addTemplate(screen: AnyScreen, template_id: string, templateHtmlContent: string): HTMLElement {
   let templateDiv: HTMLElement = null;
   if (template_id && templateHtmlContent) {
      try {
         let templateDiv = htmlToElement(`
<script id="${template_id}" type="text/x-template">
${templateHtmlContent}
</script>`);
         document.body.appendChild(templateDiv);
         if (screen)
            screen.addTemplateId(template_id);
      } catch (ex) {
         console.log(ex);
      }
   }
   return templateDiv;
}

/**
 * Remove the template added with {@link addTemplate} in order to clean up.
 * This is usually done in the destroy phase.
 *
 * Called automatically by the localDestroyImplementation of AnyScreen.
 *
 * @param screen
 * @param template_id
 */
export function removeTemplate(screen: AnyScreen, template_id: string): boolean {
   let success: boolean = false;
   if (template_id) {
      try {
         let removedChild = document.body.removeChild(document.getElementById(template_id));
         if (screen)
            screen.removeTemplateId(template_id);
         return (removedChild != null)
      } catch (ex) {
         console.log(ex);
      }
   }
   return success;
}

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
export abstract class AnyScreen<DATA_TYPE = any> extends AnyWidgetStandard<HTMLElement, Args_AnyScreen, DATA_TYPE> {

   private _extraTagIdList: string[]    = [];
   protected _templateIdList: string[]  = [];

   /**
    * Unique uuid that will uniquely identify this screen even after any future refactoring changes the name of the class
    */
   private _ui_uuid: string;

   protected constructor() {
      super();
   }


   initialize_AnyScreen(anyScreenDescriptor ?: Args_AnyScreen) {

      if (anyScreenDescriptor)
         // ensure that default fields are filled, but overwritten by contents of parameter passed in
         anyScreenDescriptor = {...new Args_AnyScreen(), ...anyScreenDescriptor};
      else
         anyScreenDescriptor = new Args_AnyScreen();

      // Initialize as extension of AnyWidget
      initialize_Args_AnyWidget(anyScreenDescriptor, this);
      this.initArgs = anyScreenDescriptor;

      if (anyScreenDescriptor.overwriteDefaultClasses) {
         // anyScreenDescriptor.overwriteDefaultClasses not null because of the  Args_AnyWidget.initialize call above
         addWidgetClass(anyScreenDescriptor, anyScreenDescriptor.overwriteDefaultClasses);
      } else {
         addWidgetClass(anyScreenDescriptor, CSS_FLEX_MAX_XY);
      }

      // -------------- NOW properly initialize the super component ---------------
      super.initialize_AnyWidgetStandard(anyScreenDescriptor);
   } // initAnyScreen


   async localContentEnd(): Promise<string> {
      let b: string = '';

      if (this.initArgs?.extraTagIdCount > 0) {
         for (let i = 0; i < this.initArgs.extraTagIdCount; i++) {
            let extraTagId = getRandomString(`extraTagId${i}`);

            // store the tag id in the list
            this.extraTagIdList.push(extraTagId);

            // add the div tag in the HTML
            b += `
<div id="${extraTagId}"></div>
`;

         } //for anyScreenDescriptor.extraTagIdCount
      } //if (descriptor.extraTagIdCount > 0)

      b += await super.localContentEnd();
      return b
   } // localContentEnd

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