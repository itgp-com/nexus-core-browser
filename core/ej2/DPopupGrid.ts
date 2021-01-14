// almost the same as RelationshipTabPattern
import {
   Column,
   ColumnModel,
   CommandColumn,
   FailureEventArgs,
   Filter,
   Grid,
   GridModel,
   Page,
   QueryCellInfoEventArgs,
   Resize,
   Selection,
   Sort,
   SortSettingsModel,
   Toolbar,
}                                                   from '@syncfusion/ej2-grids';
import {DataManager, DataResult, Query, UrlAdaptor} from "@syncfusion/ej2-data";
import {Dialog, Tooltip}                            from '@syncfusion/ej2-popups';
import {AbstractWidget}                                           from "../gui/AbstractWidget";
import {getRandomString, hget, IMMEDIATE_MODE_DELAY, urlTableEj2} from "../CoreUtils";
import {getErrorHandler}                                          from "../CoreErrorHandling";


// noinspection JSUnusedGlobalSymbols
export abstract class DPopupGrid<T=any> extends AbstractWidget<T> {
   private _instructionsText     = 'Click any row for details:';
   private _gridModel: GridModel;
   private _grid: Grid;

   protected _dialogObj: Dialog;
   private _query: Query;


   protected _instructionsTagID: string;
   protected _popupTargetTagID: string;
   protected _gridTagID: string;


   protected _innerDialogTagID: string;

   protected _enabled: boolean     = true;

   public state: any;

   // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
   constructor( args:any = null) {
      super();
      this.initBeforeSuper(); // give extenders the option to initialize variables
      this.initBeforeSuperWithArgs(args);

      let thisX = this;

      let dataSource = this.getGridDataManager();
      let columns    = this.getGridColumns();


      // Default Grid options
      this._gridModel = {
         dataSource:        dataSource,
         columns:           columns,
         width:             '100%',

         allowFiltering: true,
         filterSettings: {
            showFilterBarStatus: true,
            mode:                "Immediate",

immediateModeDelay: IMMEDIATE_MODE_DELAY,
         },

         allowPaging:       true,
         pageSettings:      {pageSizes: [5, 10, 20, 50, 100], pageSize: 5, pageCount: 6},

         allowSorting:      true,
         allowMultiSorting: true,

         allowTextWrap:     true,
         allowResizing:     true,
         allowSelection:    true,

         allowKeyboard:     true,

         created:           function () {
            // see https://www.syncfusion.com/support/directtrac/incidents/251508
            this.element.removeAttribute('tabindex')
         },
         actionFailure:     (args) => {
            thisX.gridActionFailure(args);
         },
         queryCellInfo:     (args) => {
            thisX.queryCellInfo(args)
         },

         dataBound:       () => {
            // filtering by contains not startswith
            let _gridAllL = (thisX.grid as Grid);
            // replace default operator (startsWith with containts)
            Object.assign(_gridAllL.filterModule["filterOperators"], {startsWith: 'contains'});
         },


      } as GridModel;
      //
      // if (this.includeSearchToolbar) {
      //    // merge the 2 objects
      //    this._gridModel = {
      //       ...this._gridModel,
      //       ...{
      //          toolbar: ["Search"],
      //          searchSettings:
      //                   {
      //                      operator: 'contains'
      //                   }
      //          ,
      //       }
      //    } as GridModel
      // }

      this.initGridModel(this._gridModel);

      if (this.getInitialSortSettings()) {
         this._gridModel.sortSettings = this.getInitialSortSettings();
      }

      // noinspection UnnecessaryLocalVariableJS
      let queryObj: Query = this.query;
      this.query          = queryObj; // setter modifies DataSource if queryObj is empty


   } // constructor


   initBeforeSuper(): void {

   }

   // noinspection JSUnusedLocalSymbols
   initBeforeSuperWithArgs(args:any){

   }

   /**
    * Called after constructor initializes the grid model to give the developer a chance to further change options
    * @param gridModel
    */
   initGridModel(gridModel: GridModel): void {

   }


   abstract getTablename(): string;

   getTitle(): string {return this.title;}

   abstract getColLabels(): { [key: string]: string };

   abstract getGridColumns(): Column[] | string[] | ColumnModel[];


   getInitialSortSettings(): SortSettingsModel {
      return null;
   }

   getToolTip(): string {
      return this.getTitle()
   };

   protected queryCellInfo(args: QueryCellInfoEventArgs) {
   }
   //------------------------ DPanel methods -----------------


   _initContent(): string {
      let tblID = this.getTablename();
      if (tblID && tblID.indexOf('(' )){
         tblID = tblID.split('(')[0]; // first part only
      }
      tblID = escape(tblID);

      if (!this._popupTargetTagID)
         this._popupTargetTagID = getRandomString(`popupTarget_${tblID}`);

      if (!this._instructionsTagID)
         this._instructionsTagID = getRandomString(`instructions_${tblID}`);

      if (!this._gridTagID)
         this._gridTagID = getRandomString(`grid_${tblID}`);

      if (!this._innerDialogTagID)
         this._innerDialogTagID = getRandomString(`innerDialog_${tblID}`);

      // if (!this._confirmUnlinkDialog)
      //    this._confirmUnlinkDialog = iptu.getRandomString(('confirmUnlinkDialog'));


// evaluates at the time it's called
      let x = `
 <p class="core_vertical_spacer"> </p>
 
 <div class="row no-gutters">
    <div class="col-6">
    <div id="${this.instructionsTagID}" class="app-field-label"  style="padding-bottom: 6px;">${this._instructionsText}</div>
    </div>
`;

//       if (this.includeLinkButtons) {
//          x += `
//      <button type="button" id="${this._btnSearchRelationships}" class="e-lib e-btn e-control col-1 e-primary"  disabled="true" >Search</button>
// </div>
// `
//       }


      x += `
<p class="core_vertical_spacer"> </p>
<div id="${this.gridTagID}"></div>
<div id="${this.innerDialogTagID}"></div>
<div id="${this.popupTargetTagID}"></div>
 `;

      //<div id="${this._confirmUnlinkDialog}"></div>

      return x;
   }



   async localLogicImplementation() {

      // let options = this.getGridOptions();

      let gridDivId = hget(this.gridTagID);
      if ( gridDivId) {
         Grid.Inject(Sort, Resize, Filter, Page, Toolbar, Selection, CommandColumn);
         this._grid = new Grid(this._gridModel);
         this._grid.appendTo(gridDivId);
      }
   }

   async localDestroyImplementation(): Promise<void> {

      if (this._grid)
         await this._grid.destroy();
      if (this._dialogObj)
         await this._dialogObj.destroy();

      // popup div gets pulled out and added to the bottom of the document
      // so delete it

      let popupElement = document.getElementById(`${this._innerDialogTagID}`);
      if (popupElement)
         popupElement.remove()

   }

   async localRefreshImplementation(): Promise<void> {
      if ( this._grid) {
         let queryObj: Query = this.query;
         if (queryObj) {
            this._grid.dataSource = this.getGridDataManager();
            this._grid.query      = queryObj;
            await this.grid.refresh();
         } else {
            this._grid.dataSource = []; // empty
         }
      } // if _grid
   }



   async localClearImplementation(): Promise<void> { }

//---------------------------------------------------------

   getGridDataManagerURL(): string {
      let table: string = this.getTablename();
      // noinspection UnnecessaryLocalVariableJS
      let url: string   =  urlTableEj2(table);
      return url;
   }

   getGridDataManager(): (Object | DataManager | DataResult) {
      let hostUrl: string = this.getGridDataManagerURL();

      // noinspection UnnecessaryLocalVariableJS
      let dm: DataManager = new DataManager({
                                               url:         hostUrl,
                                               adaptor:     new UrlAdaptor(),
                                               crossDomain: true,
                                            });
      return dm;
   }

   gridActionFailure(evt: FailureEventArgs) {
      let errorHandler = getErrorHandler();
      if (errorHandler) {
         errorHandler.displayExceptionToUser(evt.error)
      } else {
         window.alert("Grid Action Failure: " + evt.error.message)
      }
   }



//

   //---------------- complex getters and setters

   get query(): Query {
      return this._query;
   }

   set query(queryObj: Query) {

      this._query = queryObj;
      if (queryObj) {
         let dm                     = this.getGridDataManager();
         this._gridModel.dataSource = dm;
         this._gridModel.query      = queryObj;
         if (this.grid)
            this.grid.dataSource = dm;
      } else {
         // null query
         this._gridModel.dataSource = []; // empty
         if (this.grid) {
            this.grid.dataSource = []; // empty
            this.grid.query      = null;
         }
      }

      (async ()=>{
         await this.refresh();
      })();
   }



   // -----------------------  Basic getters and setters ----------------------
   get instructionsTagID(): string {
      return this._instructionsTagID;
   }

   get popupTargetTagID(): string {
      return this._popupTargetTagID;
   }

   get gridTagID(): string {
      return this._gridTagID;
   }

   get innerDialogTagID(): string {
      return this._innerDialogTagID;
   }

   get instructionsText(): string {
      return this._instructionsText;
   }

   set instructionsText(value: string) {
      this._instructionsText = value;
   }

   get gridModel(): GridModel {
      return this._gridModel;
   }

   set gridModel(value: GridModel) {
      this._gridModel = value;
   }

   get grid(): Grid {
      return this._grid;
   }

   set grid(value: Grid) {
      this._grid = value;
   }


   // noinspection JSUnusedGlobalSymbols
   get enabled(): boolean {
      return this._enabled;
   }

   // noinspection JSUnusedGlobalSymbols
   set enabled(value: boolean) {
      this._enabled = value;
   }



}