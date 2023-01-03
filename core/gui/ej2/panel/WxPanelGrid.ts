import {Aggregate, ColumnMenu, ExcelExport, Grid, Page, Resize, Sort, Toolbar} from "@syncfusion/ej2-grids";
import {AbstractWidget, addWidgetClass, CssStyle}        from "../../AbstractWidget";
import {gridDecoratorsHeight}                            from "../abstract/AbstractGrid";
import {Args_WxPanelBase, Evt_PanelResized, WxPanelBase} from "./WxPanelBase";
import {Args_WxGrid1, WxGrid1}                                                 from "../ext/WxGrid1";
import {CSS_FLEX_MAX_XY}                                                       from "../../../CoreCSS";
import {WxPanel}                                                               from "../ext/WxPanel";
import {WxRow}                                                                 from "../ext/WxRow";

Grid.Inject(Toolbar, ExcelExport, Page, Resize, ColumnMenu, Aggregate, Sort);


export class Args_WxPanelGrid<GRID_DATA = any> extends Args_WxPanelBase {

   /**
    * Widgets that will render on top of the Grid
    */
   topWidgets?: AbstractWidget | AbstractWidget[] | Promise<AbstractWidget> | Promise<AbstractWidget[]>;

   /**
    * Custom style for <link>WgtPanel_RowFlex</link> that contains the grid and any left panel
    */
   gridContainerStyle ?: CssStyle;

   /**
    * Custom classes for <link>WgtPanel_RowFlex</link> that contains the grid and any left panel
    */
   gridContainerClasses ?: string;


   /**
    * The component to be inserted to the left of the grid. Obviously, this component can be a panel containing many other components
    */
   leftGridPanel ?: AbstractWidget;
   /**
    * The spacing (in pixels) between the {@link leftGridPanel} and the grid. Defaults to 0 pixels (no spacing)
    */
   leftGridPanelSpacing ?: number;

   leftGridPanelClasses ?: string;

   /**
    * Additional styles to the default "flex-grow:0;margin-right:${leftGridPanelSpacing}px;"
    */
   leftGridPanelStyle ?: CssStyle;

   /**
    * @deprecated - Use {@link args_grid} to pass the Args_WgtGrid and let this class instantiate the Grid.
    * This will allow for common features to be implemented here instead of in each class that extends this.
    * If both {@link grid} and {@link args_grid} exist in this instance, {@link args_grid} will be used and {@link grid} will be ignored
    *
    */
   grid ?: WxGrid1;
   /**
    * The model for the grid. Please use this instead of gridModel
    * If both {@link grid} and {@link args_grid} exist in this instance, {@link args_grid} will be used and {@link grid} will be ignored
    */
   args_grid ?: Args_WxGrid1;
   additionalChildren ?: AbstractWidget[];
   args_WgtScreen_Main_App ?: Args_WxPanelBase;


   /**
    * After calculating what the grid height should be, this padding is added as extra space so the grid is not exactly the height of the dialog window
    * Defaults to 10px if not set specifically here
    */
   gridHeightPadding ?: number;

   /**
    * Defaults to <code>true</code>.
    * If you want the grid height to float based on the contents, then set this value to <code>false</code>
    */
   fixedGridHeight?: boolean;

}

export class WxPanelGrid<GRID_DATA = any, ARGS_TYPE extends Args_WxPanelGrid = Args_WxPanelGrid> extends WxPanelBase<GRID_DATA, ARGS_TYPE> {
   static readonly CLASS_NAME:string = 'WxPanelGrid';
   wxGrid: WxGrid1;
   gridContainer: AbstractWidget;
   topWidgetsResolved: AbstractWidget | AbstractWidget[];

   protected constructor() {
      super();
   }

   protected async _initialize(args: Args_WxPanelGrid<GRID_DATA>) {
      let thisX       = this;
      let defaultArgs = {title: 'n/a', fixedGridHeight: true};
      args            = {...defaultArgs, ...args};
      addWidgetClass(args, WxPanelGrid.CLASS_NAME);
      addWidgetClass(args, CSS_FLEX_MAX_XY); // maximize the grid

      if (args.args_grid) {

         thisX.wxGrid = await WxGrid1.create(args.args_grid);
      } else {
         if (args.grid)
            thisX.wxGrid = args.grid;
      }

      thisX.topWidgetsResolved = []
      if (args.topWidgets) {
         thisX.topWidgetsResolved = await args.topWidgets;
      }

      // ------ Add left side panel to the grid if necessary -------------
      let gridContainerChildren: AbstractWidget[] = []
      if (args.leftGridPanel) {

         let margin: CssStyle = {}
         if (args.leftGridPanelSpacing > 0) {
            margin = {"margin-right": `${args.leftGridPanelSpacing}px`};
         }

         let additionalStyle: CssStyle = {};
         if (args?.leftGridPanelStyle) {
            Object.assign(additionalStyle, args.leftGridPanelStyle);
         }

         let leftPanel = await WxPanel.create({
                                                 htmlTagStyle: {...{"flex-grow": 0}, ...margin, ...additionalStyle}, // flex-grow = 0 means do not grow
                                                 htmlTagClass: args?.leftGridPanelClasses,
                                                 children:     [args.leftGridPanel]
                                              });
         gridContainerChildren.push(leftPanel);
      }
      gridContainerChildren.push(thisX.wxGrid);


      let columnChildren: AbstractWidget[] = []
      if (Array.isArray(thisX.topWidgetsResolved)) {
         columnChildren.push(...thisX.topWidgetsResolved); // widget array
      } else {
         columnChildren.push(thisX.topWidgetsResolved); // single widget
      }


      let children: AbstractWidget[] = [
         ...columnChildren,
         thisX.gridContainer = await WxRow.create({
                                                    htmlTagStyle: args?.gridContainerStyle,
                                                    htmlTagClass: (args?.gridContainerClasses ? args.gridContainerClasses : null),
                                                    children:     gridContainerChildren
                                                 })

      ];

      if (args.additionalChildren && args.additionalChildren.length > 0) {
         children.push(...args.additionalChildren);
      }

      // noinspection UnnecessaryLocalVariableJS
      // let localSuperArgs: Args_WxScreen_Base_App = {
      //    title:    args.title,
      //    children: children,
      // };

      args.children = children;


      let superArgs: Args_WxPanelBase = {...args.args_WgtScreen_Main_App, ...args}; // spread operator handles null/undefined without error
      if (superArgs.showHeaderRefreshButton == null) {
         superArgs.showHeaderRefreshButton = true; // unless purposely disabled, show the refresh button for grid screens
      }
      // @ts-ignore
      await super._initialize(superArgs);

   } // initialize...


   protected calculateGridHeight(): number {
      if (!this.hget)
         return 0;

      let gridDecoratorHeight: number = gridDecoratorsHeight(this.wxGrid);

      let topWidgetsHeight: number = 0;
      if (this.topWidgetsResolved) {
         if (Array.isArray(this.topWidgetsResolved)) {
            this.topWidgetsResolved.map(widget => topWidgetsHeight += widget?.hget?.clientHeight); // widget array
         } else {
            topWidgetsHeight += this.topWidgetsResolved?.hget?.clientHeight; // single widget
         }
      }

      let wholeScreenHeight = this.hget.clientHeight;

      let gridHeightPadding: number = this.args?.gridHeightPadding;
      if (!gridHeightPadding)
         gridHeightPadding = 10;

      return wholeScreenHeight - topWidgetsHeight - gridDecoratorHeight - gridHeightPadding;
   } // setGridHeight



   panelResized(evt: Evt_PanelResized<WxPanelGrid>) {

      let thisX = this;

      super.panelResized(evt);

      if (thisX.wxGrid?.obj) {
         let existingHeight = thisX.wxGrid.obj.height;
         let gridHeight = thisX.calculateGridHeight();
         if ( gridHeight > 0 &&  gridHeight != existingHeight) {
            thisX.wxGrid.obj.height = gridHeight;
         }
      }
   }



   async localClearImplementation() {
      try {
         await this.wxGrid?.clear();
      } catch (ex) {
         this.handleError(ex);
      }
      try {
         await this.gridContainer?.clear();
      } catch (ex) {
         this.handleError(ex);
      }
      await super.localClearImplementation();
   }

   async localDestroyImplementation() {
      try {
         await this.wxGrid?.destroy();
      } catch (ex) {
         this.handleError(ex);
      }
      try {
         await this.gridContainer?.destroy();
      } catch (ex) {
         this.handleError(ex);
      }
      await super.localDestroyImplementation();
   }

} // main class