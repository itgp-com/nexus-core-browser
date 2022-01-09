import {DropDownList, DropDownListModel}       from '@syncfusion/ej2-dropdowns';
import {Args_AnyWidget, IArgs_HtmlTag_Utils}   from "../Args_AnyWidget";
import {Args_WgtSimple, WgtSimple}             from "./WgtSimple";
import {DataProvider, DataProviderChangeEvent} from "../../data/DataProvider";

export abstract class Args_WgtDropDown extends Args_WgtSimple<DropDownListModel> {

   /**
    * Control label. Overwrites the placeholder in the ej.placeholder in places
    */
   label?: string;

   /**
    * placeholder inside the DropDownList (same as ej.placeholder which is the DropDownListModel.placeholder), not to be confused with the label which would be a separate HTML Element
    */
   placeholder ?: string;

   sortOrder ?: DropDownSortOrder
}

export enum DropDownSortOrder {
   None       = 'None',
   Ascending  = 'Ascending',
   Descending = 'Descending'
}

export type WgtDropDownDataType = number | string | boolean;

export abstract class WgtDropDown<ARG_CLASS extends Args_WgtDropDown = Args_WgtDropDown> extends WgtSimple<DropDownList, Args_AnyWidget, WgtDropDownDataType> {
   args: Args_WgtDropDown;

   protected constructor() {
      super();
   }

   initialize_WgtDropDown(args: ARG_CLASS) {
      if (!args)
         throw "There are no args in call to initialize_WgtDropDown(args) !";

      if (!args.ej)
         args.ej = {};

      this.args = args;


      if (args.sortOrder) {
         args.ej.sortOrder = args.sortOrder;
      }

      this.initialize_WgtSimple(args)
   } //initialize_WgtDropDown

   async localContentBegin(): Promise<string> {

      let x: string = "";

      x += `<div id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;

      if (this.args.label) {
         x += `    <div id="${this.labelTagID}" class="e-float-text e-label-top">${this.args.label.escapeHTML()}</div>`;
      }

      x += `<input type="text" id="${this.tagId}" name="${this.args.propertyName}"/>`;
      x += "</div>";

      return x;
   }


   async localLogicImplementation() {
      let args = this.args;
      args.ej  = args.ej || {};
      let ej   = args.ej;

      let argsChange = ej.change;


      //TODO - fix this hardcoded code
      ej.change = (ev) => {
         if (argsChange) {
            argsChange(ev); // invoke the args-defined change first
         }

         if (ev.isInteracted) {
            // only trigger if the change was made by a user
            // https://ej2.syncfusion.com/documentation/drop-down-list/how-to/value-change/

            let currentValue = ev.value;
            if (this.args.dataProviderName != null) {
               let dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
               if (dataProvider != null) {
                  let record = dataProvider.dataValue;

                  if (record != null) {
                     let previousDataValue = record[this.args.propertyName];

                     // make the change
                     record[this.args.propertyName] = currentValue;

                     if (currentValue != previousDataValue) {
                        // trigger the change event
                        let evt: DataProviderChangeEvent<any> = {
                           propertyName:  this.args.propertyName,
                           value:         currentValue,
                           previousValue: previousDataValue,
                        };

                        dataProvider.fireChange(evt);
                     } // if (currentValue != previousDataValue)
                  } // if record
               }// if (dataProvider != null)
            } // if (this.args.dataProviderName)
         }
      }; // change event


      this.obj = new DropDownList(ej);
      this.obj.appendTo(this.hgetInput);

   } // doInitLogic


   async localClearImplementation(): Promise<void> {
      if (this.obj)
         this.obj.clear();
   }// doClear

   async localRefreshImplementation(): Promise<void> {
      if (this.obj) {
         let data             = DataProvider.byName(this, this.args.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.args.ej.enabled) {
            // if the general properties allow you to enable, the enable if there's data, disable when there's no data link
            this.obj.enabled = enabled;
         }
      }

   } // doClear

   get value(): WgtDropDownDataType {
      if (this.obj)
         return this.obj.value;
      return null;
   }

   set value(val: WgtDropDownDataType) {
      try {
         if (this.obj) {
            if (val == null) {
               this.obj.clear();
            } else {
               this.obj.value = val;
            }
         }
      } catch (ex) {
         this.handleError(ex);
      }
   }

} // abstract WgtDropDown