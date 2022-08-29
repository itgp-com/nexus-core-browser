import {DropDownList, DropDownListModel}       from '@syncfusion/ej2-dropdowns';
import {DataProvider, DataProviderChangeEvent} from "../../data/DataProvider";
import {IArgs_HtmlTag_Utils}                   from "../../BaseUtils";
import {AnyWidget, Args_AnyWidget}             from "../AnyWidget";

export abstract class Args_AbstractDropDown extends Args_AnyWidget<DropDownListModel> {

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

export abstract class AbstractDropDown<ARG_CLASS extends Args_AbstractDropDown = Args_AbstractDropDown> extends AnyWidget<DropDownList, Args_AnyWidget, WgtDropDownDataType> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractDropDown(args: ARG_CLASS) {
      args            = IArgs_HtmlTag_Utils.init(args) as ARG_CLASS;
      this.descriptor = args;

      if (args.sortOrder) {
         args.ej.sortOrder = args.sortOrder;
      }

      await this.initialize_AnyWidget(args)
   } //initialize_WgtDropDown

   //TODO change to default localContentBegin
   async localContentBegin(): Promise<string> {

      let x: string = "";

      x += `<div id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.descriptor.wrapper)}>`;

      if ((this.descriptor as ARG_CLASS).label) {
         x += `    <div id="${this.labelTagID}" class="e-float-text e-label-top">${(this.descriptor as ARG_CLASS).label.escapeHTML()}</div>`;
      }

      x += `<input type="text" id="${this.tagId}" name="${this.descriptor.propertyName}"/>`;
      x += "</div>";

      return x;
   }


   async localLogicImplementation() {
      let args = this.descriptor;
      args.ej  = args.ej || {};
      let ej   = args.ej;

      let argsChange = ej.change;


      //TODO - fix this hardcoded code
      ej.change = (ev: any) => {
         if (argsChange) {
            argsChange(ev); // invoke the args-defined change first
         }

         if (ev.isInteracted) {
            // only trigger if the change was made by a user
            // https://ej2.syncfusion.com/documentation/drop-down-list/how-to/value-change/

            let currentValue = ev.value;
            if (this.descriptor.dataProviderName != null) {
               let dataProvider = DataProvider.dataProviderByName(this, this.descriptor.dataProviderName);
               if (dataProvider != null) {
                  let record = dataProvider.dataValue;

                  if (record != null) {
                     let previousDataValue = record[this.descriptor.propertyName];

                     // make the change
                     record[this.descriptor.propertyName] = currentValue;

                     if (currentValue != previousDataValue) {
                        // trigger the change event
                        let evt: DataProviderChangeEvent<any> = {
                           propertyName:  this.descriptor.propertyName,
                           value:         currentValue,
                           previousValue: previousDataValue,
                        };

                        dataProvider.fireChange(evt);
                     } // if (currentValue != previousDataValue)
                  } // if record
               }// if (dataProvider != null)
            } // if (dataProviderName)
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
         let data             = DataProvider.byName(this, this.descriptor.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.descriptor.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.descriptor.ej.enabled) {
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