import {isFunction} from 'lodash';
import {ClassArg, classArgInstanceVal, hget, IArgs_HtmlTag_Utils} from "../../../BaseUtils";
import {getErrorHandler}                                          from "../../../CoreErrorHandling";
import {
   adjustColumnWidthForCustomExcelFilters,
   stateGrid_CustomExcelFilter
} from '../../../gui2/ej2/ext/util/N2Grid_Options';
import {AbstractWidget, addWidgetClass} from "../../AbstractWidget";
import {Args_AnyWidget}                                           from "../../AnyWidget";
import {AnyWidgetStandard}                                        from "../../AnyWidgetStandard";
import {DataManager}                                              from "@syncfusion/ej2-data";
import {
   Aggregate,
   ColumnMenu,
   ColumnModel,
   DataResult,
   ExcelExport,
   ExcelQueryCellInfoEventArgs,
   Filter,
   Grid,
   GridModel,
   Page,
   Resize,
   Sort,
   SortSettingsModel,
   Toolbar
} from "@syncfusion/ej2-grids";

Grid.Inject(Toolbar, ExcelExport, Page, Resize, ColumnMenu, Aggregate, Sort, Filter);

export class Args_AbstractGrid extends Args_AnyWidget<GridModel> {

   // functions to be called at constructor time
   dataSource ?: ClassArg<Object | DataManager | DataResult>;
   columns?: ClassArg<ColumnModel[]>;
   sortSettings?: ClassArg<SortSettingsModel>;

   beforeGridInstantiated ?: { (wgtGrid: AbstractGrid): void }; // allows model to be changed at the last moment

   /**
    * Optional array of column header template widgets, one for each column that requires a custom header
    */
   columnHeaderTemplates ?: Args_WgtGrid_ColumnHeaderTemplate[];

   /**
    * Defaults to false (apply formatter function from column to excel export)
    * If true, the excelQueryCellInfo event will not call any formatter functions when exporting
    * If false, the excelQueryCellInfo event will call the formatter function and set the value to the result of the formatter
    */
   disableExcelAutoFormater?: boolean;
}

export abstract class AbstractGrid<T = any> extends AnyWidgetStandard<Grid, Args_AnyWidget, T> {
   static readonly CLASS_NAME:string = 'AbstractGrid';

   static readonly COL_TABLE_PROPERTY: string = 'ej2Grid';

   gridModel: GridModel;

   protected constructor() {
      super();
   }

   /**
    * Overload this method to control the behavior od the Grid
    */
   protected async createGridModel() {

      // defaults
      this.gridModel = {

         allowSorting:      true,
         allowMultiSorting: true,
         allowTextWrap:     true,
         allowResizing:     true,
         allowSelection:    true,
         allowKeyboard:     true,
         width:             "100%",
      };
   }

   protected async initialize_AbstractGrid(args: Args_AbstractGrid) {
      args          = IArgs_HtmlTag_Utils.init(args) as Args_AbstractGrid;
      this.initArgs = args;
      addWidgetClass(args, AbstractGrid.CLASS_NAME);

      await this.createGridModel();

      // Properties: actually call the function, since it's a property not an event like the rest
      if (args.sortSettings)
         this.gridModel.sortSettings = classArgInstanceVal(args.sortSettings);

      if (args.columns)
         this.gridModel.columns = classArgInstanceVal(args.columns);

      if (args.dataSource)
         this.gridModel.dataSource = classArgInstanceVal(args.dataSource);

      if (args.disableExcelAutoFormater) {
         // do nothing
      } else {
         try {
            let existingExcelQueryCellInfo = args.ej.excelQueryCellInfo;

            args.ej.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
               try {
                  let formatter: any = args.column.formatter;
                  if (formatter && isFunction(formatter)) {
                     args.value = formatter(args.column, args.data);
                  } // if formatter

                  if (existingExcelQueryCellInfo) {
                     existingExcelQueryCellInfo.call(this, args);
                  } // if existingExcelQueryCellInfo

               } catch (e) { console.error(e); }
            } // excelQueryCellInfo
         } catch (e) { console.error(e); }
      }

      if (args.ej) {
         // if exists, then overwrite default values
         this.gridModel = {...this.gridModel, ...args.ej};

         if (!args.ej.width)
            this.gridModel.width = "100%"; // default to 100%
      } else {
         this.gridModel.width = "100%"; // default to 100%
      }
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WgtGrid


   async localContentEnd(): Promise<string> {
      let x: string = '';
      x += await super.localContentEnd();

      /**
       * Add all the column header templates rightContainer after the end grid div
       */
      if (this.initArgs && (this.initArgs as Args_AbstractGrid).columnHeaderTemplates) {
         for (const value of (this.initArgs as Args_AbstractGrid).columnHeaderTemplates) {
            if (value && value.templateWidget && value.columnId)
               x += await value.templateWidget.initContent();
         }
      }
      return x;
   } // localContentEnd

   async localLogicImplementation(): Promise<void> {
      if (this.initArgs && (this.initArgs as Args_AbstractGrid).beforeGridInstantiated) {
         (this.initArgs as Args_AbstractGrid).beforeGridInstantiated.call(this);
      }

      try {
         this.initArgs.ej = this.gridModel; // MAKE SURE IT'S THE SAME OBJECT!!!!!!
         stateGrid_CustomExcelFilter(this.gridModel); // Every abstract grid gets an Excel filter from now on
         adjustColumnWidthForCustomExcelFilters(this.gridModel.columns as ColumnModel[]);
      } catch(ex){console.error(ex)}
      try {
         this.obj = new Grid(this.gridModel);
         this.obj.appendTo(hget(this.tagId))
      } catch (ex) {
         this.handleError(ex);
      }
      this.tagColumns(); // only tag at initialization time
   }

   async localRefreshImplementation(): Promise<void> {
      if (!this.obj)
         return;
      try {
         await this.obj?.refresh();
      } catch (ex) {
         console.log(ex);
      }
   }


   /**
    * tag all the columns with the instance of this table
    */
   tagColumns(): void {
      try {
         let columns: any[] = this.obj.columns;
         if (columns) {
            let WGT_SCREEN__GRID_NAME = AbstractGrid.name;
            columns.forEach((column => {
               column[WGT_SCREEN__GRID_NAME]           = this;
               column[AbstractGrid.COL_TABLE_PROPERTY] = this.obj;
            }));
         } // if columns
      } catch (ex) {
         console.log(ex);
      }
   }
} // main class


/**
 * Class used in definining the templates for grid column headers
 */
export class Args_WgtGrid_ColumnHeaderTemplate {
   /**
    * The name of the column to which we are adding the header
    */
   columnId: WgtPanel_ColumnHeader;
   /**
    * The body of the template that will be inserted in the HTML stream under an ID unique to this table column so it can then
    * be instantiated using a
    */
   templateWidget: AbstractWidget;
}


export class WgtPanel_ColumnHeader extends AbstractWidget {


   async localContentBegin(): Promise<string> {
      return `<script id="${this.tagId}" type="text/x-template">`
   }

   async localContentEnd(): Promise<string> {
      return `</script>`
   }

   async localClearImplementation(): Promise<void> {
   }

   async localLogicImplementation(): Promise<void> {
   }

   async localDestroyImplementation(): Promise<void> {
   }

   async localRefreshImplementation(): Promise<void> {

   }

}

export function gridWidth(columns: ColumnModel[]): number {
   let width = 0;
   try {
      if (columns) {
         for (let col of columns) {
            let w: number = 0;
            try {
               w = col.width as number;
            } catch (nex) {
               w = 80; // default
            }

            width += w;
         } // for
      } // if columns
   } catch (ex) {
      getErrorHandler().displayExceptionToUser(ex);
   }
   width += 10; // 10 pixels for padding

   if (width == 0) {
      width = 20; // small
   }
   return width;
}


/**
 * Calculate the total height of all the padding that the heading, filters and bottomContainer paging controls take in a grid
 * @param wgtGrid
 */
export function gridDecoratorsHeight(wgtGrid: AbstractGrid): number {
   let gridDecoratorHeightVal: number = 0;

   let gridElem = wgtGrid.hget;
   if (gridElem) {

      let toolbarArray = gridElem.getElementsByClassName('e-toolbar');
      if (toolbarArray.length > 0) {
         let toolBar = toolbarArray[0];
         if (toolBar) {
            gridDecoratorHeightVal += toolBar.clientHeight;
         }
      } // if toolbarArray

      let gridHeaderArray = gridElem.getElementsByClassName('e-gridheader');
      if (gridHeaderArray.length > 0) {
         let gridHeader = gridHeaderArray[0];
         if (gridHeader) {
            gridDecoratorHeightVal += gridHeader.clientHeight;
         }
      } //  if gridHeaderArray

      let gridPagerArray = gridElem.getElementsByClassName('e-gridpager');
      if (gridPagerArray.length > 0) {
         let gridPager = gridPagerArray[0];
         if (gridPager) {
            gridDecoratorHeightVal += gridPager.clientHeight;
         }
      } // if gridPagerArray

      let gridGroupingArray = gridElem.getElementsByClassName('e-groupdroparea');
      if ( gridGroupingArray.length > 0 ) {
         let gridGrouping = gridGroupingArray[0];
         if ( gridGrouping ) {
            gridDecoratorHeightVal += gridGrouping.clientHeight;
         }
      } // if gridGroupingArray

   } // if gridElem
   return gridDecoratorHeightVal;
} // gridDecoratorsHeight