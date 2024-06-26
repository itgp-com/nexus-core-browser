import {getRandomString}          from "../../../../BaseUtils";
import {singleRecordDataProvider} from "../../../../data/DataProviderUtils";
import {CoreWgtDropDownDB}        from "../../../coreonly/CoreWgtDropDownDB";
import {AbstractGrid}             from "../AbstractGrid";
import {DropDownSortOrder}        from "../AbstractDropDown";
import {Args_AbstractDropDownDB}  from "../AbstractDropDownDB";
import {ChangeEventArgs}          from "@syncfusion/ej2-dropdowns/src/drop-down-list/drop-down-list";
import {Column, Grid, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {IEditCell}                            from "@syncfusion/ej2/grids";
import {Query}                                from '@syncfusion/ej2-data';
import {DropDownList}                         from '@syncfusion/ej2-dropdowns';


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

   last_parentWgtGrid: AbstractGrid;
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
   async createRenderer(args: QueryCellInfoEventArgs, parentWgtGrid: AbstractGrid): Promise<CoreWgtDropDownDB> {

      //------------- make sure we tag the parent component of this renderer/editor --------------
      if (this.last_parentWgtGrid == null) {
         this.last_parentWgtGrid = parentWgtGrid;
      } else {
         if (parentWgtGrid != null && this.last_parentWgtGrid != parentWgtGrid) {
            this.last_parentWgtGrid = parentWgtGrid;

            this.clearCachedData();
         }
      }

      return await this.createRendererRawEjGrid(args, parentWgtGrid.obj);

   } // createRenderer

   async createRendererRawEjGrid(queryCellInfoEventArgs: QueryCellInfoEventArgs, grid: Grid): Promise<CoreWgtDropDownDB> {

      let anchor: HTMLInputElement = <HTMLInputElement>queryCellInfoEventArgs.cell.getElementsByClassName(GridEditRender_DropdownDB.CLASS_GRID_DROPDOWN).item(0);
      return this.createDD(anchor, queryCellInfoEventArgs);
   }

   private async createDD(anchor: HTMLElement, queryCellInfoEventArgs: QueryCellInfoEventArgs) : Promise<CoreWgtDropDownDB>{
      let thisX = this;
      let record = queryCellInfoEventArgs.data;
      if (anchor) {

         let dataProvider                    = singleRecordDataProvider({providerName: '___', record: record});
         let ddArgs: Args_AbstractDropDownDB = {
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

         let wgtDD: CoreWgtDropDownDB = await CoreWgtDropDownDB.create(ddArgs);
         await wgtDD.initLogic();
         wgtDD.obj.change = (evt:ChangeEventArgs) => {
            if (thisX.args.change)
               thisX.args.change(evt, queryCellInfoEventArgs);
         };

         dataProvider.children    = [wgtDD];

         this.dropDownInstance       = wgtDD.obj; //new DropDownList(dropdown_options);
         this.dropDownInstance.value = (record as any)[this.grid_value_column_name]; // set the initial value in the dropdown to whatever is in the record

         this.dropDownInstance.appendTo(anchor);

         return wgtDD;
      } // if (anchor)
      return null;
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

           // noinspection JSIgnoredPromiseFromCall
            this.createDD(editorTemplateInstance, args.rowData); // async but doesn't matter

         }
      } // instance
      return instance;
   } // editor


} // Decorator_Dropdown_ControlledRepro