import {KeyboardEvents} from '@syncfusion/ej2-base';
import {Query} from '@syncfusion/ej2-data';
import {ExcelQueryCellInfoEventArgs, Grid, GridModel, Sort} from '@syncfusion/ej2-grids';
import {Clipboard} from '@syncfusion/ej2-grids/src/grid/actions/clipboard';
import {ColumnChooser} from '@syncfusion/ej2-grids/src/grid/actions/column-chooser';
import {ColumnMenu} from '@syncfusion/ej2-grids/src/grid/actions/column-menu';
import {ContextMenu} from '@syncfusion/ej2-grids/src/grid/actions/context-menu';
import {Data} from '@syncfusion/ej2-grids/src/grid/actions/data';
import {DetailRow} from '@syncfusion/ej2-grids/src/grid/actions/detail-row';
import {Edit} from '@syncfusion/ej2-grids/src/grid/actions/edit';
import {ExcelExport} from '@syncfusion/ej2-grids/src/grid/actions/excel-export';
import {Filter} from '@syncfusion/ej2-grids/src/grid/actions/filter';
import {Group} from '@syncfusion/ej2-grids/src/grid/actions/group';
import {InfiniteScroll} from '@syncfusion/ej2-grids/src/grid/actions/infinite-scroll';
import {Page} from '@syncfusion/ej2-grids/src/grid/actions/page';
import {PdfExport} from '@syncfusion/ej2-grids/src/grid/actions/pdf-export';
import {Print} from '@syncfusion/ej2-grids/src/grid/actions/print';
import {Reorder} from '@syncfusion/ej2-grids/src/grid/actions/reorder';
import {Resize} from '@syncfusion/ej2-grids/src/grid/actions/resize';
import {RowDD} from '@syncfusion/ej2-grids/src/grid/actions/row-reorder';
import {Scroll} from '@syncfusion/ej2-grids/src/grid/actions/scroll';
import {Search} from '@syncfusion/ej2-grids/src/grid/actions/search';
import {Selection} from '@syncfusion/ej2-grids/src/grid/actions/selection';
import {Toolbar} from '@syncfusion/ej2-grids/src/grid/actions/toolbar';
import {isFunction} from 'lodash';
import {cssAddSelector, fontColor} from '../../../CoreUtils';
import {addN2Class} from '../../N2HtmlDecorator';
import {CSS_VARS_EJ2} from '../../scss/vars-ej2-common';
import {CSS_VARS_CORE} from '../../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {stateGrid_CustomExcelFilter} from './util/N2Grid_Options';

Grid.Inject(
    Clipboard,
    ColumnChooser,
    ColumnMenu,
    ContextMenu,
    DetailRow,
    Edit,
    ExcelExport,
    Filter,
    Group,
    InfiniteScroll,
    KeyboardEvents,
    Page,
    PdfExport,
    Print,
    Reorder,
    Resize,
    RowDD,
    Scroll,
    Sort,
    Search,
    Selection,
    Toolbar,
);

export interface StateN2GridRef<N2_GRID extends N2Grid = N2Grid> extends StateN2EjBasicRef {
    widget?: N2_GRID;
}

export interface StateN2Grid<WIDGET_LIBRARY_MODEL extends GridModel = GridModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2GridRef<N2Grid>;

    /**
     * By default this component implements a custom Excel filter on every filterable column.
     * Set this to true to disable this feature.
     */
    disableCustomFilter?: boolean;
    /**
     * Defaults to false (apply formatter function from column to excel export)
     * If true, the excelQueryCellInfo event will not call any formatter functions when exporting
     * If false, the excelQueryCellInfo event will call the formatter function and set the value to the result of the formatter
     */
    disableExcelAutoFormater?: boolean;
}

export class N2Grid<STATE extends StateN2Grid = StateN2Grid> extends N2EjBasic<STATE, Grid> {
    static readonly CLASS_IDENTIFIER: string = 'N2Grid';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Grid.CLASS_IDENTIFIER);

        if (state.disableCustomFilter == undefined || !state.disableCustomFilter) {
            stateGrid_CustomExcelFilter(state.ej); // Every N2Grid gets an Excel filter from now on unless disabled by state.disableCustomFilter
        }

        if (state.disableExcelAutoFormater) {
            // do nothing
        } else {
            try {
                let existingExcelQueryCellInfo = state.ej.excelQueryCellInfo;

                state.ej.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
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

        super.onStateInitialized(state)
    } // onStateInitialized


    createEjObj(): void {
        this.obj = new Grid(this.state.ej);
    } // createEjObj

    get classIdentifier(): string { return N2Grid.CLASS_IDENTIFIER; }


    /**
     * The function is used to generate updated Query from Grid model.
     *
     * @param {boolean} skipPage - specifies the boolean to skip the page
     * @param {boolean} isAutoCompleteCall - specifies for auto complete call
     * @returns {Query} returns the Query or null if not initialized
     */
    generateQuery(skipPage?: boolean, isAutoCompleteCall?: boolean): Query {
        if (!this.obj)
            return null;
        return new Data(this.obj).generateQuery(skipPage, isAutoCompleteCall);
    } // generateQuery
} // N2Grid

/**
 * Apply the CSS styles to the selectors defined by n2GridClass and eGridClass
 * The function applies to N2 Grid and TreeGrid
 *
 * @param {string} n2GridClass one of ['N2Grid', 'N2TreeGrid', ]
 * @param {string} eGridClass one of ['e-grid', 'e-treegrid',]
 */
export function cssForN2Grid(n2GridClass: string, eGridClass: string) {

    let app_custom_excel_filter_width_number: number;
    try {
        app_custom_excel_filter_width_number = Number.parseInt(CSS_VARS_CORE.app_custom_excel_filter_width_number);
    } catch (e) {}
    if (app_custom_excel_filter_width_number == 0)
        app_custom_excel_filter_width_number = 18;


    let accent = CSS_VARS_CORE.material_accent_color;
    let accentContrastColor = 'white'; // fontColor(accent); // dynamically calculated based on theme color

    const rootStyle = getComputedStyle(document.documentElement);


    let gridHoverBgColor = CSS_VARS_EJ2.grid_hover_bg_color;
    let gridHoverFontColor = fontColor(gridHoverBgColor); // the contrast color to the current background


    // Removes blue background from grid editable checkbox and restores border and font color
    cssAddSelector(`.${n2GridClass} .e-checkbox-wrapper .e-frame.e-check, .${n2GridClass} .e-css.e-checkbox-wrapper .e-frame.e-check`,
        `
    background-color: transparent;
    border-color: unset;
    color: black;`);

    // Make tops of grid filters change colors for enabled filters
    cssAddSelector(`.${n2GridClass} .e-filtertext:not(.e-disable)`, `
        background-color: $app-filter-text-background-color !important;
        padding-left: 1ch !important;`);


    cssAddSelector(`.${n2GridClass} .e-tbar-btn, .e-tbtn-txt`,
        `  background-color: ${accent} !important;`
    );


    cssAddSelector(`.${n2GridClass} .e-tbar-btn-text, .${n2GridClass} .e-btn-icon.e-excelexport`,
        `color: ${accentContrastColor} !important;`
    );


    cssAddSelector(`.${n2GridClass}.e-control .e-toolbar .e-tbar-btn .e-tbar-btn-text`,
        `font-family: var(--app-font-family);
font-size: var(--app-font-size-regular);`
    );

    //Make tops of grid filters change colors for enabled filters
    cssAddSelector(`.${n2GridClass} .e-filtertext:not(.e-disable) `, `
     background-color: var(--app-filter-text-background-color) !important;
  padding-left: 1ch !important;
    `);


    //  Grid opacity
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell:not(.e-editedbatchcell), .e-control.${eGridClass} .e-detailrowcollapse:not(.e-editedbatchcell), .e-control.${eGridClass} .e-detailrowexpand:not(.e-editedbatchcell), .e-control.${eGridClass} .e-gridcontent .e-rowdragdrop:not(.e-editedbatchcell), .e-control.${eGridClass} .e-emptyrow:not(.e-editedbatchcell)`, `
     opacity: 1 !important;
    `);

    // Reduce the padding of the header grid cells from 1.8em default
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-headercelldiv, .${eGridClass} .e-gridheader .e-stackedheadercelldiv,
.${n2GridClass}.${eGridClass} .e-gridheader .e-headercell .e-headercelldiv.e-headerchkcelldiv`, `
    padding-right: 0.5em;
    `);

    // Make row hovered over readable by turning the font color to the contrasting color of the background
    cssAddSelector(`.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):not(.e-editedrow):not(.e-detailrow):hover .e-rowcell:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):not(.e-detailrow):hover .e-detailrowcollapse:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):hover .e-rowdragdrop:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-rtl .e-gridhover tr[role=row]:not(.e-disable-gridhover):hover .e-rowdragdrop:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):not(.e-detailrow):hover .e-detailrowexpand:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell)`, `
        color: ${gridHoverFontColor} !important;
    `);

    // Grid cell font type and size
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell`, `
  font-family: var(--app-font-family);
  font-size: var(--app-font-size-regular);    
    `);


    // left divider color for row cell, header and filter cells
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell, .${n2GridClass}.e-control.${eGridClass} .e-filterbarcell, .${n2GridClass}.e-control.${eGridClass} .e-headercell`, `
  border-left: 1px solid var(--grid-header-border-color);
    `);

    // eliminate resize handler cell visible border
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-headercell .e-rhandler`, `
  border-right-width: 0px !important;
  border-right-style: solid !important;
  border-right-color: var(--grid-table-background-color) !important;    
    `);

    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-tableborder `, `
      border-right-color: var(--grid-header-border-color) !important;
    `);

    // Controls the left/right padding in grid cells
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rowcell, .${eGridClass} .e-filterbarcell, .${eGridClass} .e-filterbarcelldisabled, .${eGridClass} .e-headercell, .${eGridClass} .e-detailheadercell`, `
      padding-left: 5px !important;
      padding-right: 5px !important;
    `);

    // this selector is used to denote a disabled row in the grid
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rowcell.screen-grid-col-disabled `, `
      background-color: ${CSS_VARS_CORE.app_row_disabled_background_color_lightgray};
    `);
    // this selector is used to denote a disabled row in the grid
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-headercell.screen-grid-col-disabled `, `
   background-color: ${CSS_VARS_CORE.app_row_disabled_background_color_lightgray} !important;   
    `);

    // Ej2 defaults the width to 57px for some strange reason
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-grouptext`, `
    width: unset;
    `);

    // group area background color
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-groupdroparea.e-grouped`, `
  background-color: var(--app-color-panel-background);     
    `);
// This is here for the grid cell to not wrap on <br>
    cssAddSelector(`.${n2GridClass} td.e-rowcell br`, `
     display: none;
    `);


    //------------------- General sorting - disable color change for sorted columns -------------
    cssAddSelector(`.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=ascending] .e-headertext, 
.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=descending] .e-headertext, 
.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=ascending] .e-sortfilterdiv, 
.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=descending] .e-sortfilterdiv`, `
        color: unset;
        opacity: unset;
    `);

    //--------------- Custom Excel filter --------------------

    const STYLE_CENTER_VERTICAL: string = `
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 2px;
        height: 16px;`;

    // Move the hidden div that the floating dialog opening next to to the left if the menu is on the left side (if text is right justified)
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass}  .e-rightalign .e-filtermenudiv`, `
    float: unset;
    width: 40px;
	`);


    // Reverse the space reservation and reserve 32px to the front of the header cell for the filter and sort icon
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-rightalign.e-fltr-icon .e-headercelldiv`, `
            margin: -7px -7px -7px 32px;
    `);

    /**
     * This is the filter icon that appears in the right of the header of a column that has a filter applied (e-filtered exists).
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-filtermenudiv.e-filtered::before`, `
        color: var(--material-accent-font-color);
        background-color: var(--material-accent-color);
        padding: 3px;
        border: solid 1px var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: 0;
   `);

    /**
     * This is the filter icon that appears on the left of the header of a column that has a filter applied (e-filtered exists) and the header is right justified.
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rightalign .e-filtermenudiv.e-filtered::before`, `
        right: unset;
        left: 0;
    `);


    /**
     * This is the filter icon that appears in the right of the header of a column that has no filter (e-filtered doesn't exist).
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-filtermenudiv:not(.e-filtered)::before`, `
        padding: 3px;
        border: solid 1px var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: 0;
    `);

    /**
     * This is the filter icon that appears on the left of the header of a column that has no filter (e-filtered doesn't exist) and the header is right justified.
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rightalign .e-filtermenudiv:not(.e-filtered)::before`, `
        right: unset;
        left: 0;
    `);

    // when right-align the left padding was 1.8em by default. Now it's 17px, exactly 1px less than the size of the sort bubble so things line up
    cssAddSelector(`.${n2GridClass}.${eGridClass}  .e-gridheader .e-sortfilter .e-rightalign .e-headercelldiv, .${n2GridClass}.${eGridClass} .e-gridheader .e-rightalign .e-stackedheadercelldiv`, `
        padding: 0 0.6em 0 17px;
    `);


    //-------------------- sort icons if there's a filter menu present ---------------------------
    // this has right=36px because there's a filter menu present amd the filtersort icon
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-gridheader .e-sortnumber`, `
        margin: 2px 15px 2px 0;
        ${STYLE_CENTER_VERTICAL}
        width: 16px;
        right: 36px;
        `
    );

    // if the header is right justified and there's a filter menu present, move the sort number to the left, still 36px just like the right above
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-gridheader  .e-rightalign .e-sortnumber`, `
        right: unset;
        left: 36px;
    `);


    // this has right=0 because there's a filter menu present
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-sortfilterdiv.e-descending::before`,
        `
        margin-left: -10px;
        padding: 2px 3px 4px 3px;
        border: solid 1px var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: ${app_custom_excel_filter_width_number}px;
    `);

    // if the header is right justified and there's a filter menu present, move the sort filter icon to the left
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present  .e-rightalign .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-headercelldiv[style*="text-align: right;"] + .e-sortfilterdiv.e-descending::before`,
        `
        right: unset;
        left: ${app_custom_excel_filter_width_number}px;
    `);


    //-------------------- sort icons if there's a filter menu IS NOT PRESENT ---------------------------
    // this has right=18px because there's no filter menu present, but there is the filtersort icon
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-gridheader .e-sortnumber`, `
        margin: 1px ${app_custom_excel_filter_width_number}px 0px 0px;
        ${STYLE_CENTER_VERTICAL}
        width: 16px;
        right: ${app_custom_excel_filter_width_number}px;
        `
    );

    // if the header is right justified, move the sort icon to the left, still 18px just like the right above
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-gridheader .e-rightalign .e-sortnumber`, `
        right: unset;
        left: ${app_custom_excel_filter_width_number}px;
    `);


    // this has right=0 because there's no filter menu present
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-sortfilterdiv.e-descending::before`,
        `
        margin-left: 2px;
        padding: 3px;
        border: 1px solid var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: 0px;
    `);

    // if the header is right justified, move the sort icon to the left
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-rightalign .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-rightalign .e-sortfilterdiv.e-descending::before`,
        `
        right: unset;
        left: 0px;
    `);


    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-frozenheader > .e-table, .${n2GridClass}.${eGridClass} .e-frozencontent > .e-table, .${n2GridClass}.${eGridClass} .e-frozencontent .e-virtualtable > .e-table, .${n2GridClass}.${eGridClass} .e-frozenheader .e-virtualtable > .e-table`, `
        border-right-color: var(--grid-header-border-color);
    `);
    //---------------------

    // align sort and menu vertically
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-columnheader.e-wrap .e-sortfilterdiv, .${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-columnheader .e-sortfilterdiv`, `
        margin: -19px 10px;    
    `);


    // now center the menu character in the menufilter div ::before
    cssAddSelector(`
    .${n2GridClass}.${eGridClass} .e-icon-filter::before, 
    .${n2GridClass}.${eGridClass} .e-icon-filter.e-filtered::before, 
    .${n2GridClass}.${eGridClass} .e-grid-menu .e-icon-filter::before, 
    .${n2GridClass}.${eGridClass} .e-grid-menu .e-icon-filter.e-filtered::before`, `
line-height: 8px;
`);

} // cssForN2Grid

themeChangeListeners().add((ev: ThemeChangeEvent) => {
    cssForN2Grid(N2Grid.CLASS_IDENTIFIER, 'e-grid');
}); // normal priority