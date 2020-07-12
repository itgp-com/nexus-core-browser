import {IEditCell}                           from "@syncfusion/ej2/grids";
import {DropDownList}                        from '@syncfusion/ej2-dropdowns';
import {Query}                               from '@syncfusion/ej2-data';
import {Column,Grid, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {AxiosResponse}                       from "axios";
import {WgtGrid}                             from "../WgtGrid";
import {getRandomString, urlTableList}       from "../../../CoreUtils";
import {axios}                               from "../../../index";
import {DropDownListModel}                   from "@syncfusion/ej2-dropdowns/src/drop-down-list";
import {ChangeEventArgs}                     from "@syncfusion/ej2-dropdowns/src/drop-down-list/drop-down-list";

export class Args_GridEditRender_DropdownDB {
   grid_value_column_name:string;

   dropdown_table_name: string;
   dropdown_value_column_name: string;
   dropdown_text_column_name: string;
   actionComplete ?: (arg:any)=>void;
   change ?: (evt:ChangeEventArgs, args: QueryCellInfoEventArgs)=>void;
}

export class GridEditRender_DropdownDB {

   static readonly CLASS_GRID_DROPDOWN: string = getRandomString('gridDropDown');

   args:Args_GridEditRender_DropdownDB;

   last_parentWgtGrid: WgtGrid;
   dropDownInstance: DropDownList;

   cachedRendererData: [] = null;
   private dataRetrievalPromise: Promise<[]>;


   constructor(args:Args_GridEditRender_DropdownDB) {
      this.args = args;
   }

   get dropdown_tablename():string{
      return this.args.dropdown_table_name;
   }


   get dropdown_value_column_name(): string{
      return this.args.dropdown_value_column_name;
   }

   get dropdown_text_column_name(): string{
      return this.args.dropdown_text_column_name;
   }

   get grid_value_column_name(): string{
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
      let thisX = this;

      let anchor: HTMLInputElement = <HTMLInputElement>args.cell.getElementsByClassName(GridEditRender_DropdownDB.CLASS_GRID_DROPDOWN).item(0);
      if (anchor) {

         (async () => {
            let records: [] = await this.getDropdownData();

            let dropdown_options: DropDownListModel = {
               dataSource:     records,
               query:          new Query().sortBy(this.dropdown_text_column_name),
               fields:         {value: this.dropdown_value_column_name, text: this.dropdown_text_column_name},
               floatLabelType: 'Never',
               actionComplete :  this.args.actionComplete,
               change:         evt => {

                  if (thisX.args.change){
                     thisX.args.change(evt, args); //execute the args change first (if any)
                  }

                  let record                              = args.data;
                  record[this.grid_value_column_name] = evt.value;
                  let rowNumber: number                   = Number.parseInt(args.cell.getAttribute('index'));
                  grid.updateRow(rowNumber, record);
               }
            };

            let valueTemplate = this.valueTemplate();
            if (valueTemplate !=null && valueTemplate.length > 0)
               dropdown_options.valueTemplate = valueTemplate;

            let itemTemplate = this.itemTemplate();
            if (itemTemplate != null && itemTemplate.length > 0)
               dropdown_options.itemTemplate = itemTemplate;


            this.dropDownInstance       = new DropDownList(dropdown_options);
            let currentValue = args.data[this.grid_value_column_name];
            this.dropDownInstance.value = currentValue; // set the initial value in the dropdown to whatever is in the record
            this.dropDownInstance.appendTo(anchor);

         })(); // iife

      } // if (anchor)
   }

   valueTemplate():string{
      return null;
   }

   itemTemplate():string{
      return null;
   }

   protected clearCachedData() {
      this.cachedRendererData = null;
   }

   /**
    * This method is used by everyone to get the data for the Dropdown.
    * The method itself will block if it's already been called and has not returned - this prevents the same method from doing hundreds of HTTP GETs
    * The moment the first instance has returned, all the other instances piggyback on the data that first instance has return and return the local copy also.
    */
   protected async getDropdownData(): Promise<[]> {
      let thisX = this;
      if (this.cachedRendererData)
         return this.cachedRendererData; // immediate return

      if (this.dataRetrievalPromise) {
         return await this.dataRetrievalPromise
      }


      this.dataRetrievalPromise = new Promise((resolve, reject) => {
         (async () => {
            try {
               let axiosResponse: AxiosResponse = await axios.get(urlTableList(this.dropdown_tablename));

               thisX.cachedRendererData = axiosResponse.data as [];
               resolve(this.cachedRendererData);
            } catch (exception) {
               thisX.cachedRendererData = [];
               reject(exception);
            } finally {
               this.dataRetrievalPromise = null;
            }
         })(); // iife inside promise
      }); // Promise((resolve, reject)

      return this.dataRetrievalPromise;
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
            (async () => {
               let records: [] = await this.getDropdownData();

               this.dropDownInstance       = new DropDownList({
                                                                 dataSource:     records,
                                                                 query:          new Query().sortBy(this.dropdown_text_column_name),
                                                                 fields:         {value: this.dropdown_value_column_name, text: this.dropdown_text_column_name},
                                                                 floatLabelType: 'Never'
                                                              });
               this.dropDownInstance.value = args.rowData[this.grid_value_column_name]; // set the initial value in the dropdown to whatever is in the record
               this.dropDownInstance.appendTo(editorTemplateInstance);

            })(); // iife

         }
      } // instance
      return instance;
   } // editor


} // Decorator_Dropdown_ControlledRepro