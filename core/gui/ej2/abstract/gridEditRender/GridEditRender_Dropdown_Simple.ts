import {Args_GridEditRender_Dropdown_Abstract, GridEditRender_Dropdown_Abstract} from "./GridEditRender_Dropdown_Abstract";
import {DataManager, Query}                                                      from "@syncfusion/ej2-data";
import {Grid, QueryCellInfoEventArgs}                                            from "@syncfusion/ej2-grids";
import {DropDownListModel}                                                       from "@syncfusion/ej2-dropdowns/src/drop-down-list";
import {DropDownList}                                                            from "@syncfusion/ej2-dropdowns";
import {getErrorHandler}                                                         from "../../../../CoreErrorHandling";


const DROPDOWN_TABLE_NAME = "local"
const VIEW_COL_NAME       = "view";
const MODEL_COL_NAME      = "model";

export class Args_GridEditRender_Dropdown_Simple extends Args_GridEditRender_Dropdown_Abstract {
   view_array: string[];
   model_array: string[];
}

export class GridEditRender_Dropdown_Simple extends GridEditRender_Dropdown_Abstract {

   protected constructor(args: Args_GridEditRender_Dropdown_Abstract) {
      super(args);
   }

   static create(argsSimple: Args_GridEditRender_Dropdown_Simple): GridEditRender_Dropdown_Simple {
      argsSimple.dropdown_table_name        = DROPDOWN_TABLE_NAME;
      argsSimple.dropdown_value_column_name = MODEL_COL_NAME;
      argsSimple.dropdown_text_column_name  = VIEW_COL_NAME;

      let instance: GridEditRender_Dropdown_Simple = new GridEditRender_Dropdown_Simple(argsSimple);
      return instance;
   }

   /**
    * @implements getDropdownData
    */
   async getDropdownData(): Promise<{ [key: string]: Object }[] | DataManager | string[] | number[] | boolean[]> {

      let argsSimple: Args_GridEditRender_Dropdown_Simple = this.args as Args_GridEditRender_Dropdown_Simple;
      let data: any[]                                     = [];
      if (argsSimple.view_array) {
         let n = argsSimple.view_array.length;
         for (let i = 0; i < n; i++) {
            let viewValue  = argsSimple.view_array[i];
            let modelValue = argsSimple.model_array[i];

            let row             = {};
            row[VIEW_COL_NAME]  = viewValue;
            row[MODEL_COL_NAME] = modelValue;
            data[i]             = row;
         } // for
      } // if
      return Promise.resolve(data as []);
   }

   async createDropDown(anchor: HTMLElement, queryCellInfoEventArgs: QueryCellInfoEventArgs, grid: Grid) : Promise<void>{
      let thisX = this;
      let dataSource = await this.getDropdownData();

      let dropdown_options: DropDownListModel = {
         dataSource:     dataSource,
         query:          (thisX.args.sortOrder ? new Query() : new Query().sortBy(this.dropdown_text_column_name, thisX.args.sortOrder)),
         fields:         {value: this.dropdown_value_column_name, text: this.dropdown_text_column_name},
         floatLabelType: 'Never',
         actionComplete: this.args.actionComplete,
         change:         evt => {

            if (thisX.args.change) {
               thisX.args.change(thisX, evt, queryCellInfoEventArgs); //execute the args change first (if any)
            }

            this.record                              = queryCellInfoEventArgs.data;
            this.record[this.grid_value_column_name] = evt.value;
            let rowNumber: number                    = Number.parseInt(queryCellInfoEventArgs.cell.getAttribute('index'));
            grid.updateRow(rowNumber, this.record);
         }
      };

      let valueTemplate = this.valueTemplate();
      if (valueTemplate != null && valueTemplate.length > 0)
         dropdown_options.valueTemplate = valueTemplate;

      let itemTemplate = this.itemTemplate();
      if (itemTemplate != null && itemTemplate.length > 0)
         dropdown_options.itemTemplate = itemTemplate;

      this.dropDownInstance       = new DropDownList(dropdown_options);
      let currentValue            = queryCellInfoEventArgs.data[this.grid_value_column_name];
      this.dropDownInstance.value = currentValue; // set the initial value in the dropdown to whatever is in the record
      this.dropDownInstance.appendTo(anchor);


      // If there's a function in the args, call it
      if (this.args.createRenderer) {
         try {
            this.args.createRenderer(queryCellInfoEventArgs, grid);
         } catch (ex) {
            console.log(ex);
            getErrorHandler().displayExceptionToUser(ex);
         }
      }


   }

}