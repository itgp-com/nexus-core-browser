import {AnyWidget}                                                                                                                            from "../AnyWidget";
import {Args_AnyWidget}                                                                                                                       from "../Args_AnyWidget";
import {DataManager}                                                                                                                          from "@syncfusion/ej2-data";
import {Aggregate, ColumnMenu, ColumnModel, DataResult, ExcelExport, Filter, Grid, GridModel, Page, Resize, Sort, SortSettingsModel, Toolbar} from "@syncfusion/ej2-grids";
import {AbstractWidget, Args_AbstractWidget}                                                                                                  from "../AbstractWidget";
import {ClassArg, classArgInstanceVal, hget}                                                                                                  from "../../CoreUtils";
import {AnyScreen}                                                                                                                            from "../AnyScreen";

Grid.Inject(Toolbar, ExcelExport, Page, Resize, ColumnMenu, Aggregate, Sort, Filter );

export class Args_WgtGrid extends Args_AnyWidget<GridModel> {

   // functions to be called at constructor time
   dataSource ?: ClassArg<Object | DataManager | DataResult>;
   columns?: ClassArg<ColumnModel[]>;
   sortSettings?: ClassArg<SortSettingsModel>;

   beforeGridInstantiated ?: { (wgtGrid: WgtGrid): void }; // allows model to be changed at the last moment

   /**
    * Optional array of column header template widgets, one for each column that requires a custom header
    */
   columnHeaderTemplates ?: Args_WgtGrid_ColumnHeaderTemplate[];
}

export class WgtGrid<T = any> extends AnyWidget<Grid, Args_AnyWidget, T> {

   static readonly COL_TABLE_PROPERTY: string = 'ej2Grid';

   args: Args_WgtGrid;
   gridModel: GridModel;


   static create<T = any>(args?: Args_WgtGrid): WgtGrid<T> {
      let instance = new WgtGrid<T>();
      instance.initialize_WgtGrid(args);
      return instance;
   }


   protected constructor() {
      super();
   }


   /**
    * Overload this method to control the behavior od the Grid
    */
   createGridModel() {
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

   initialize_WgtGrid(args: Args_WgtGrid) {
      this.args = args;

      this.createGridModel();

      // Properties: actually call the function, since its a property not a event like the rest
      if (args.sortSettings)
         this.gridModel.sortSettings = classArgInstanceVal(args.sortSettings);

      if (args.columns)
         this.gridModel.columns = classArgInstanceVal(args.columns);

      if (args.dataSource)
         this.gridModel.dataSource = classArgInstanceVal(args.dataSource);

      // if (args.query)
      //    this.gridModel.query = args.query;
      //
      // if (args.aggregates)
      //    this.gridModel.aggregates = args.aggregates;

      //--------------- function / events from here down
      // if (args.created)
      //    this.gridModel.created = args.created;

      // // if default has databound, execute that after the args databound
      // let ejLevel_DataBound = this.gridModel.dataBound;
      // if (ejLevel_DataBound != null || args.dataBound != null) {
      //    this.gridModel.dataBound = (arg) => {
      //       if (ejLevel_DataBound != null)
      //          ejLevel_DataBound(arg);
      //
      //       if (args.dataBound)
      //          args.dataBound();
      //    }
      // }
      //
      // if (args.queryCellInfo)
      //    this.gridModel.queryCellInfo = args.queryCellInfo;

      if (args.ej) {
         // if exists, then overwrite default values
         this.gridModel = {...this.gridModel, ...args.ej};

         if (!args.ej.width)
            this.gridModel.width = "100%"; // default to 100%
      } else {
         this.gridModel.width = "100%"; // default to 100%
      }

      let descriptor: Args_AnyWidget = {
         afterInitLogicListener:  args.afterInitLogicListener,
         beforeInitLogicListener: args.beforeInitLogicListener,
      }; // descriptor

      this.initialize_AnyWidget(descriptor);
   } // initialize_WgtGrid


   async localContentBegin(): Promise<string> {
      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);
      return `<div id="${this.tagId}" ${classString}></div>`; // NEVER use <div />
   } // no children for a Grid, so all HTML can go in the Begin section

   async localContentEnd(): Promise<string> {
      /**
       * Add all the column header templates right after the grid div
       */

      let x: string = '';
      if (this.args && this.args.columnHeaderTemplates) {
         for (const value of this.args.columnHeaderTemplates) {
            if (value && value.templateWidget && value.columnId)
               x += await value.templateWidget.initContent();
         }
      }
      return x;
   }

   async localLogicImplementation(): Promise<void> {
      if (this.args && this.args.beforeGridInstantiated) {
         this.args.beforeGridInstantiated.call(this);
      }
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
         let screenParent: AnyScreen = this.findAncestor<AnyScreen>(instance => instance instanceof AnyScreen);
         if (screenParent) {
            // if it's in a screen, make sure you don't trigger a refresh loop
            if (!screenParent.isInsideRefreshAnyScreen())
               await this.obj?.refresh(); // refresh the grid
         } else {
            // if it's not in a screen, just refresh
            await this.obj?.refresh();
         }
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
            let WGT_SCREEN__GRID_NAME = WgtGrid.name;
            columns.forEach((column => {
               column[WGT_SCREEN__GRID_NAME]      = this;
               column[WgtGrid.COL_TABLE_PROPERTY] = this.obj;
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