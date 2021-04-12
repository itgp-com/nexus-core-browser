import {DropDownList}                 from '@syncfusion/ej2-dropdowns';
import {Grid, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {ChangeEventArgs}              from "@syncfusion/ej2-dropdowns/src/drop-down-list/drop-down-list";
import {getRandomString}              from "../../../CoreUtils";
import {WgtGrid}                      from "../WgtGrid";
import {getErrorHandler}              from "../../../CoreErrorHandling";
import {DropDownSortOrder}            from "../WgtDropDown";

export class Args_GridEditRender_Dropdown_Abstract {
   grid_value_column_name: string;

   dropdown_table_name ?: string;
   dropdown_value_column_name ?: string;
   dropdown_text_column_name ?: string;


   actionComplete ?: (arg: any) => void;
   change ?: (thisX: GridEditRender_Dropdown_Abstract, evt: ChangeEventArgs, args: QueryCellInfoEventArgs) => void;
   sortOrder ?: DropDownSortOrder
   decorateCell ?: (id: string, cell: HTMLElement, anchor: HTMLElement) => void;
   createRenderer ?: (args: QueryCellInfoEventArgs, grid: Grid) => void;
}

export abstract class GridEditRender_Dropdown_Abstract {

   static readonly CLASS_GRID_DROPDOWN: string = getRandomString('gridDropDown');

   args: Args_GridEditRender_Dropdown_Abstract;
   record: any; // the grid record

   last_parentWgtGrid: WgtGrid;
   dropDownInstance: DropDownList;

   cachedRendererData: [] = null;

   public changeListener: (evt: ChangeEventArgs, args: QueryCellInfoEventArgs, id: string, cell: HTMLElement, anchor: HTMLElement) => void;

   // args_logic: (thisX: GridEditRender_Dropdown_Abstract, evt: ChangeEventArgs, args: QueryCellInfoEventArgs) => void;


   protected constructor(args: Args_GridEditRender_Dropdown_Abstract) {
      this.args = args;

      let prevArgsChange = args?.change
      args.change        = (abstract_instance: GridEditRender_Dropdown_Abstract, evt: ChangeEventArgs, queryCellInfoEventArgs: QueryCellInfoEventArgs) => {
         this.changeLogic(this, evt, queryCellInfoEventArgs);
         try {
            if (prevArgsChange) {
               prevArgsChange(this, evt, queryCellInfoEventArgs);
            }
         } catch (ex) {
            console.log(ex);
            getErrorHandler().displayExceptionToUser(ex);
         }
      }

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
      template.classList.add(GridEditRender_Dropdown_Abstract.CLASS_GRID_DROPDOWN);
      return template;
   }

   /**
    * Sets this.dropDownInstanceActual (WgtXXX if any)and this.dropDownInstance (EJ2 component instance)
    * @param queryCellInfoEventArgs
    * @param parentWgtGrid
    */
   // noinspection JSUnusedGlobalSymbols
   createRenderer(queryCellInfoEventArgs: QueryCellInfoEventArgs, parentWgtGrid: WgtGrid): void {

      //------------- make sure we tag the parent component of this renderer/editor --------------
      if (this.last_parentWgtGrid == null) {
         this.last_parentWgtGrid = parentWgtGrid;
      } else {
         if (parentWgtGrid != null && this.last_parentWgtGrid != parentWgtGrid) {
            this.last_parentWgtGrid = parentWgtGrid;

            this.clearCachedData();
         }
      }

      this.createRendererRawEjGrid(queryCellInfoEventArgs, parentWgtGrid.obj);

   } // createRenderer

   createRendererRawEjGrid(queryCellInfoEventArgs: QueryCellInfoEventArgs, grid: Grid) {

      let anchor: HTMLInputElement = <HTMLInputElement>queryCellInfoEventArgs.cell.getElementsByClassName(GridEditRender_Dropdown_Abstract.CLASS_GRID_DROPDOWN).item(0);
      if (anchor) {
         (async ()=>{
            await this.createDropDown(anchor, queryCellInfoEventArgs, grid)
         })(); // iife
      } // if (anchor)
   }

   abstract createDropDown(anchor: HTMLElement, queryCellInfoEventArgs: QueryCellInfoEventArgs, grid: Grid):Promise<void> ;

   decorateCell(id: string, cell: HTMLElement, anchor: HTMLElement): void {
      // if there's a function in the args, call it
      if (this.args.decorateCell) {
         this.args.decorateCell(id, cell, anchor)
      }
   }


   changeLogic(thisX: GridEditRender_Dropdown_Abstract, evt: ChangeEventArgs, args: QueryCellInfoEventArgs) {
      let cell = evt.element.closest(".e-rowcell"); // find first parent that's a row cell
      let id   = evt.itemData[thisX.args.grid_value_column_name];
      thisX.decorateCell(id, cell as HTMLElement, evt.element);
      try {
         if (thisX.changeListener)
            thisX.changeListener(evt, args, id, cell as HTMLElement, evt.element);
      } catch (ex) {
         console.log(ex);
         getErrorHandler().displayExceptionToUser(ex);
      }
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

   // /**
   //  * This method is used by everyone to get the data for the Dropdown.
   //  * The method itself will block if it's already been called and has not returned - this prevents the same method from doing hundreds of HTTP GETs
   //  * The moment the first instance has returned, all the other instances piggyback on the data that first instance has return and return the local copy also.
   //  */
   // abstract getDropdownData(): Promise<{ [key: string]: Object }[] | DataManager | string[] | number[] | boolean[]>;
   //

   // // noinspection JSUnusedGlobalSymbols
   // createEditor(queryCellInfoEventArgs: QueryCellInfoEventArgs, grid: Grid): IEditCell {
   //    let thisX = this;
   //    let editorTemplateInstance = this.template;
   //    let instance: IEditCell    = {
   //       create:  () => {
   //          return editorTemplateInstance;
   //       },
   //       read:    () => {
   //          return this.dropDownInstance.value;
   //       },
   //       destroy: () => {
   //          this.dropDownInstance.destroy();
   //       },
   //       write:   (args: { rowData: Object, column: Column }) => {
   //            thisX.createDropDown(editorTemplateInstance, queryCellInfoEventArgs, grid);
   //       }
   //    } // instance
   //    return instance;
   // } // editor


} // Decorator_Dropdown_ControlledRepro