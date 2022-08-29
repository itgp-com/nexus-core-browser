import {IEditCell}                                                               from "@syncfusion/ej2/grids";
import {Query}                                                                   from '@syncfusion/ej2-data';
import {Column, QueryCellInfoEventArgs}                                          from "@syncfusion/ej2-grids";
import {ChangeEventArgs}    from "@syncfusion/ej2-dropdowns/src/drop-down-list/drop-down-list";
import {CoreWgtDropDownDB}        from "../../coreonly/CoreWgtDropDownDB";
import {Args_AbstractDropDownDB}  from "../AbstractDropDownDB";
import {singleRecordDataProvider} from "../../../data/DataProviderUtils";
import {Args_GridEditRender_Dropdown_Abstract, GridEditRender_Dropdown_Abstract} from "./GridEditRender_Dropdown_Abstract";

export class Args_GridEditRender_Dropdown_DB extends Args_GridEditRender_Dropdown_Abstract {

   dropdown_table_name: string;
   dropdown_value_column_name: string;
   dropdown_text_column_name: string;
   /**
    * Any query that needs to be run to filter/sort the list data returned from the database
    */
   query ?: Query
   enabled ?: boolean;
}

export class GridEditRender_Dropdown_DB extends GridEditRender_Dropdown_Abstract {

   protected constructor(args: Args_GridEditRender_Dropdown_DB) {
      super(args);
   }

   static create(argsDB: Args_GridEditRender_Dropdown_DB): GridEditRender_Dropdown_DB {
      let instance: GridEditRender_Dropdown_DB = new GridEditRender_Dropdown_DB(argsDB);
      return instance;
   }


   async createDropDown(anchor: HTMLElement, record: any): Promise<void> {
      let thisX = this;

      if (anchor) {

         let dataProvider                    = singleRecordDataProvider({providerName: '___', record: record});
         let ddArgs: Args_AbstractDropDownDB = {
            propertyName:     thisX.args.grid_value_column_name,
            listDataDBTable:  thisX.args.dropdown_table_name,
            textColumn:       thisX.args.dropdown_text_column_name,
            valueColumn:      thisX.args.dropdown_value_column_name,
            query:            (thisX.args as Args_GridEditRender_Dropdown_DB)?.query,
            dataProviderName: '___',
            enabled:          ((thisX.args as Args_GridEditRender_Dropdown_DB).enabled == null ? true : (thisX.args as Args_GridEditRender_Dropdown_DB).enabled),
            sortOrder:        (thisX.args?.sortOrder == null ? undefined : thisX.args.sortOrder),

         };


         let valueTemplate = thisX.valueTemplate();
         if (valueTemplate != null && valueTemplate.length > 0)
            ddArgs.ej.valueTemplate = valueTemplate;

         let itemTemplate = this.itemTemplate();
         if (itemTemplate != null && itemTemplate.length > 0)
            ddArgs.ej.itemTemplate = itemTemplate;

         let wgtDD: CoreWgtDropDownDB = await CoreWgtDropDownDB.create(ddArgs);
         await wgtDD.initLogic();
         wgtDD.obj.change = (evt: ChangeEventArgs) => {
            let queryCellInfoEventArgs: QueryCellInfoEventArgs = {
               data: record,
               cell: anchor,
            }
            thisX.args.change(thisX, evt, queryCellInfoEventArgs);
         };

         dataProvider.children = [wgtDD];

         this.dropDownInstance       = wgtDD.obj; //new DropDownList(dropdown_options);
         let currentValue            = record[this.grid_value_column_name];
         this.dropDownInstance.value = currentValue; // set the initial value in the dropdown to whatever is in the record

         this.dropDownInstance.appendTo(anchor);

      } // if (anchor)
   }

   valueTemplate(): string {
      return null;
   }

   itemTemplate(): string {
      return null;
   }

   protected clearCachedData() {
      this.cachedRendererData = null;
   }

   // noinspection JSUnusedGlobalSymbols
   createEditor(): IEditCell {
      let editorTemplateInstance = this.template;
      let instance: IEditCell    = {
         create:  () => {
            return editorTemplateInstance;
         },
         read:    () => {
            return this.dropDownInstance.value;
         },
         destroy: () => {
            this.dropDownInstance.destroy();
         },
         write:   (args: { rowData: Object, column: Column }) => {
            this.createDropDown(editorTemplateInstance, args.rowData);
         }
      } // instance
      return instance;
   } // editor


} // Decorator_Dropdown_ControlledRepro