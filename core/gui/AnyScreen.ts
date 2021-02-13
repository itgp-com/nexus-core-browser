import {AnyWidget}       from "./AnyWidget";
import {Args_AnyWidget}  from "./Args_AnyWidget";
import {getRandomString} from "../ej2/WidgetUtils";
import {AbstractWidget}  from "./AbstractWidget";
import set = Reflect.set;
import {removeTemplate}  from "../CoreUtils";

export class Args_AnyScreen {
   extraTagIdCount ?: number = 0;
   tagName ?: string         = 'div';
   classAttrReplacement ?: string;
   classAttrPrefix ?: string;
   classAttrSuffix ?: string;
   title ?: string           = '';
   children ?: AbstractWidget[];

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
   private _extraTagIdList: string[] = [];
   protected insideInitRefreshAnyScreen = false;
   protected _templateIdList: string[] = [];

   /**
    * Unique uuid that will uniquely identify this screen even after any future refactoring changes the name of the class
    */
   private _ui_uuid:string;

   protected constructor() {
      super();
   }


   initialize_AnyScreen(anyScreenDescriptor ?: Args_AnyScreen) {
      let thisX = this;

      if (anyScreenDescriptor) {
         // ensure that default fields are filled, but overwritten by contents of parameter passed in
         anyScreenDescriptor = {...new Args_AnyScreen(), ...anyScreenDescriptor};
      } else {
         anyScreenDescriptor = new Args_AnyScreen();
      }

      this.anyScreenDescriptor = anyScreenDescriptor;

      // this.title = anyScreenDescriptor.title; //Commented out 2020-06-05 DDP because it's now transferred to AnyWidget

      // -------------- prepare the descriptor so we can properly initialize the super component ---------------
      let descriptor: Args_AnyWidget = new Args_AnyWidget();

      // ------------------ straight property movement -----------------
      descriptor.extraTagIdCount = anyScreenDescriptor.extraTagIdCount;
      descriptor.children        = anyScreenDescriptor.children;
      descriptor.title           = anyScreenDescriptor.title;

      // ------------------ initContentBegin --------------------------
      let classAttrPrefix = (anyScreenDescriptor.classAttrPrefix ? anyScreenDescriptor.classAttrPrefix : '');
      let classAttrSuffix = (anyScreenDescriptor.classAttrSuffix ? anyScreenDescriptor.classAttrSuffix : '');
      let classAttrMain   = (anyScreenDescriptor.classAttrReplacement ? anyScreenDescriptor.classAttrReplacement : 'flex-component-max flex-full-height');

      let classAttr = `${classAttrPrefix} ${classAttrMain} ${classAttrSuffix}`;

      descriptor.localContentBegin = () => {
         return `
<${anyScreenDescriptor.tagName} id="${this.tagId}" class="${classAttr}">
   `
      };


      // ------------------ initContentEnd --------------------------
      descriptor.localContentEnd = () => {
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
      descriptor.initLogic = () => {
         //2020-05-11 - The refresh MUST be AFTER the form is done painting if we want the spinner to show up in the grids of the screen
         setImmediate(async () => {
             thisX.insideInitRefreshAnyScreen = true;
             await thisX.refresh(); // a screen should always refresh the controls at the end of their being instantiated
            thisX.insideInitRefreshAnyScreen = false;
         });
      };


      // -------------- NOW properly initialize the super component ---------------
      super.initialize_AnyWidget(descriptor);
   } // initAnyScreen


   /**
    * @since 1,0.24
    */
   localDestroyImplementation() {
      try {
         // remove all templates added to this screen
         if(this.listTemplateIds().length> 0){
            for (const listTemplateId of this.listTemplateIds()) {
               try {
                  removeTemplate(this, listTemplateId);
               } catch(ex){
                  console.log(ex);
               }
            }
         }
      } catch (ex){
         console.log(ex);
      }
      super.localDestroyImplementation();
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

   isInsideRefreshAnyScreen():boolean {
      if (this.insideInitRefreshAnyScreen)
         return true;
      let parent = this.parent;
      while(parent != null && parent instanceof AnyScreen){
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


   addTemplateId(template_id:string){
      let index = this._templateIdList.indexOf(template_id);
      if (index < 0){
         this._templateIdList.push(template_id)
      }
   }

   removeTemplateId(template_id:string){
      let index = this._templateIdList.indexOf(template_id);
      if (index >= 0){
        this._templateIdList.splice(index, 1);
      }
   }
   
   listTemplateIds(){
      return this._templateIdList;
   }

} // AnyScreen