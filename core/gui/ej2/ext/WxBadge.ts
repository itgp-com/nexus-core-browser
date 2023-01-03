import {AbstractButton, Args_AbstractButton} from "../abstract/AbstractButton";
import {addWidgetClass}                      from "../../AbstractWidget";
import {isFunction, isString}                         from "lodash";
import {IArgs_HtmlTag_Utils, StringArg, stringArgVal} from "../../../BaseUtils";
import {WxPanel}                                      from "./WxPanel";


export class Args_WxBadge extends Args_AbstractButton {
   badgeLabel: StringArg
}

export class WxBadge extends AbstractButton {
   static readonly CLASS_NAME:string = 'WxBadge';

   protected constructor() {
      super();
   }

   static async create(args?: Args_WxBadge): Promise<WxBadge> {
      let instance = new WxBadge();
      await instance._initialize(args);

      return instance;
   }


   async _initialize(args: Args_WxBadge) {
      args = args || {badgeLabel: '', label: 'n/a'};
      args.ej = args.ej || {};
      addWidgetClass(args,    WxBadge.CLASS_NAME);


      this.wrapperTagID = this.badgeLabelTagId;
      args.wrapper      = IArgs_HtmlTag_Utils.init(args.wrapper);
      addWidgetClass(args.wrapper, ['Wej2Badge', "badge-bar"]);

      args.htmlTagType           = 'button';
      args.htmlOtherAttr['type'] = 'button';
      let originalChildren = args.children || [];
      args.children        = [
         await WxPanel.create({
                                      htmlTagType:  'span',
                                      htmlTagClass: 'e-badge e-badge-info e-badge-notification e-badge-overlap'
                                   }),
         ...originalChildren,
      ];

      await this.initialize_AbstractButton(args)
   }


   get badgeLabelTagId(): string {
      if (!this.wrapperTagID)
         return this.wrapperTagID
      return `${this.tagId}_badgeSpan`
   }


   async localLogicImplementation() {
      //Badge is just a number of CSS tags in EJ2
      await super.localLogicImplementation();
      await this.refresh();
   }

   async localRefreshImplementation() {
      try {
         this.value = (this.initArgs as Args_AbstractButton).label;
      } catch (e) {
         console.log(e);
      }

      try {
         this.badgeLabel = (this.initArgs as Args_WxBadge).badgeLabel;
      } catch (e) {
         console.log(e);
      }
   }


   get value(): StringArg | any {
      return super.value;
   }

   set value(value: any) {
      let existingValue = this.value;
      if (existingValue == null && value == null)
         return; // no change
      if (value != null && isString(value)) {
         // only if string, because if it's a function, that comparison would be invalid
         if (existingValue == value)
            return; // no changes
      }

      super.value                   = value;
      let args: Args_WxBadge = this.initArgs as Args_WxBadge;
      if (isFunction(value) || isString(value)) {
         try {
            args.label = value;
         } catch (e) {
            console.error(e);
         }
      }

      if (this.obj) {
         document.getElementById(this.tagId).innerHTML           = stringArgVal(args.label); // Button Label
      }
   }

   get badgeLabel(): StringArg {
      return (this.initArgs as Args_WxBadge).badgeLabel
   }

   set badgeLabel(value:StringArg) {
      let args: Args_WxBadge = this.initArgs as Args_WxBadge;
      if (!args) {
         this.initArgs = new Args_WxBadge();
         args = this.initArgs as Args_WxBadge;
      }

      let existingValue = args.badgeLabel;
      if (existingValue == null && value == null)
         return; // no change
      if (value != null && isString(value)) {
         // only if string, because if it's a function, that comparison would be invalid
         if (existingValue == value)
            return; // no changes
      }

      if (isFunction(value) || isString(value)) {
         try {
            args.badgeLabel = value;
         } catch (e) {
            console.error(e);
         }
      }

      let newBadgeLabel                                       = stringArgVal(args.badgeLabel);
      document.getElementById(this.badgeLabelTagId).innerHTML = newBadgeLabel
   }

} // WgtBadge