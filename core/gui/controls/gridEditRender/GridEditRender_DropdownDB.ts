import {IEditCell}                            from "@syncfusion/ej2/grids";
import {DropDownList}                         from '@syncfusion/ej2-dropdowns';
import {Query}                                from '@syncfusion/ej2-data';
import {Column, Grid, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {WgtGrid}                              from "../WgtGrid";
import {getRandomString}                      from "../../../CoreUtils";
import {ChangeEventArgs}                      from "@syncfusion/ej2-dropdowns/src/drop-down-list/drop-down-list";
import {WgtDropDownDB}                        from "../WgtDropDownDB";
import {Args_WgtDropDownDB}                   from "../WgtDropDownDB_Abstract";
import {singleRecordDataProvider}             from "../../../data/DataProviderUtils";
import {DropDownSortOrder}                    from "../WgtDropDown";
import {ej}                                   from "@syncfusion/ej2/dist/ej2";

export class Args_GridEditRender_DropdownDB {
   grid_value_column_name: string;

   dropdown_table_name: string;
   dropdown_value_column_name: string;
   dropdown_text_column_name: string;
   actionComplete ?: (arg: any) => void;
   change ?: (evt: ChangeEventArgs, args: QueryCellInfoEventArgs) => void;
   sortOrder ?: DropDownSortOrder
   /**
    * Any query that needs to be run to filter/sort the list data returned from the database
    */
   query ?: Query
   enabled ?: boolean;
}

export class GridEditRender_DropdownDB {

   static readonly CLASS_GRID_DROPDOWN: string = getRandomString('gridDropDown');

   args: Args_GridEditRender_DropdownDB;

   last_parentWgtGrid: WgtGrid;
   dropDownInstance: DropDownList;

   cachedRendererData: [] = null;
   private dataRetrievalPromise: Promise<[]>;


   constructor(args: Args_GridEditRender_DropdownDB) {
      this.args = args;
   }

   get dropdown_tablename(): string {
      return this.args.dropdown_table_name;
   }


   get dropdown_value_column_name(): string {
      return this.args.dropdown_value_column_name;
   }

   get dropdown_text_column_name(): string {
      return this.args.dropdown_text_column_name;
   }

   get grid_value_column_name(): string {
      return this.args.grid_value_column_name;
   }

   get template(): HTMLElement {
      let template: HTMLElement = document.createElement('input');
      template.classList.add(GridEditRender_DropdownDB.CLASS_GRID_DROPDOWN);
      return template;
   }

   // noinspection JSUnusedGlobalSymbols
   createRenderer(args: QueryCellInfoEventArgs, parentWgtGrid: WgtGrid): void {

      //------------- make sure we tag the parent component of this renderer/editor --------------
      if (this.last_parentWgtGrid == null) {
         this.last_parentWgtGrid = parentWgtGrid;
      } else {
         if (parentWgtGrid != null && this.last_parentWgtGrid != parentWgtGrid) {
            this.last_parentWgtGrid = parentWgtGrid;

            this.clearCachedData();
         }
      }

      this.createRendererRawEjGrid(args, parentWgtGrid.obj);

   } // createRenderer

   createRendererRawEjGrid(args: QueryCellInfoEventArgs, grid: Grid): void {

      let anchor: HTMLInputElement = <HTMLInputElement>args.cell.getElementsByClassName(GridEditRender_DropdownDB.CLASS_GRID_DROPDOWN).item(0);
      this.createDD(anchor, args.data);
   }

   createDD(anchor: HTMLElement, record:any) {
      let thisX = this;
      if (anchor) {

         let dataProvider               = singleRecordDataProvider({providerName: '___', record: record});
         let ddArgs: Args_WgtDropDownDB = {
            propertyName:     thisX.args.grid_value_column_name,
            listDataDBTable:  thisX.args.dropdown_table_name,
            textColumn:       thisX.args.dropdown_text_column_name,
            valueColumn:      thisX.args.dropdown_value_column_name,
            query:            thisX.args.query,
            dataProviderName: '___',
            enabled:          (thisX.args.enabled == null ? true : thisX.args.enabled),
            sortOrder:        (thisX.args.sortOrder == null ? undefined : thisX.args.sortOrder),

         };


         let valueTemplate = thisX.valueTemplate();
         if (valueTemplate != null && valueTemplate.length > 0)
            ddArgs.ej.valueTemplate = valueTemplate;

         let itemTemplate = this.itemTemplate();
         if (itemTemplate != null && itemTemplate.length > 0)
            ddArgs.ej.itemTemplate = itemTemplate;

         let wgtDD: WgtDropDownDB = WgtDropDownDB.create(ddArgs);
         dataProvider.children    = [wgtDD];

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
            // (async () => {
            //    let records: [] = await this.getDropdownData();
            //
            //    this.dropDownInstance       = new DropDownList({
            //                                                      dataSource:     records,
            //                                                      query:          new Query().sortBy(this.dropdown_text_column_name),
            //                                                      fields:         {value: this.dropdown_value_column_name, text: this.dropdown_text_column_name},
            //                                                      floatLabelType: 'Never'
            //                                                   });
            //    this.dropDownInstance.value = args.rowData[this.grid_value_column_name]; // set the initial value in the dropdown to whatever is in the record
            //    this.dropDownInstance.appendTo(editorTemplateInstance);
            //
            // })(); // iife

            this.createDD(editorTemplateInstance, args.rowData);

         }
      } // instance
      return instance;
   } // editor


} // Decorator_Dropdown_ControlledRepro