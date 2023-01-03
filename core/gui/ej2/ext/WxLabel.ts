import {StringArg, stringArgVal} from "../../../BaseUtils";
import {AnyWidgetStandard}       from "../../AnyWidgetStandard";
import {Args_AnyWidget}          from "../../AnyWidget";
import {addWidgetClass}          from "../../AbstractWidget";
import {DataProvider}            from "../../../data/DataProvider";

export class Args_WxLabel extends Args_AnyWidget {
   /**
    * String or HTML to define the content of the label
    */
   labelHTML: StringArg;
}

export class WxLabel extends AnyWidgetStandard {

   protected constructor() {
      super();
   }

   static async create(args: Args_WxLabel) {
      let instance: WxLabel = new WxLabel();
      await instance.initialize_WxLabel(args);
      return instance;
   }

   async initialize_WxLabel(args: Args_WxLabel) {
      if (!args)
         args = new Args_WxLabel();
      if (!args.ej)
         args.ej = {};
      addWidgetClass(args, 'WxLabel')

      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WgtLbl

   async localContentBegin(): Promise<string> {
      let b = await super.localContentBegin();
      if (this.value)
         b += stringArgVal(this.value); // as html
      return b;
   }


   async localRefreshImplementation(): Promise<void> {

      if (this.obj && this.initArgs?.dataProviderName && this.initArgs?.propertyName) {
         let data             = DataProvider.byName(this, this.initArgs.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.initArgs.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.initArgs?.ej?.enabled) {
            // if the general properties allow you to enable, then enable if there's data, disable when there's no data link
            this.obj.enabled = enabled;
         }
      } else {
         let x      = this.value; // triggers the function calculation if any
         this.value = x; // resets the innerHTML
      }
   }


   get value(): StringArg {
      return (this.initArgs as Args_WxLabel).labelHTML;
   }

   set value(val: StringArg) {
      (this.initArgs as Args_WxLabel).labelHTML = val;
      let anchor                                  = this.hget;
      if (anchor) {
         let sval         = stringArgVal(val);
         anchor.innerHTML = sval;
      }
   }
}