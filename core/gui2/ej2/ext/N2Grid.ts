import {KeyboardEvents} from '@syncfusion/ej2-base';
import {Query} from '@syncfusion/ej2-data';
import {Grid, GridModel, Sort} from '@syncfusion/ej2-grids';
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
import {cssAddSelector, fontColor} from '../../../CoreUtils';
import {addN2Class} from '../../N2HtmlDecorator';
import {VARS_EJ2_COMMON} from '../../scss/vars-ej2-common';
import {CORE_MATERIAL} from '../../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

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
  widget ?: N2_GRID;
}

export interface StateN2Grid<WIDGET_LIBRARY_MODEL extends GridModel = GridModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateN2GridRef<N2Grid>;
}

export class N2Grid<STATE extends StateN2Grid = StateN2Grid> extends N2EjBasic<STATE,Grid> {
    static readonly CLASS_IDENTIFIER:string = 'N2Grid';
    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Grid.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new Grid(this.state.ej);
    }

    get classIdentifier(): string { return N2Grid.CLASS_IDENTIFIER; }




    /**
     * The function is used to generate updated Query from Grid model.
     *
     * @param {boolean} skipPage - specifies the boolean to skip the page
     * @param {boolean} isAutoCompleteCall - specifies for auto complete call
     * @returns {Query} returns the Query or null if not initialized
     */
    generateQuery(skipPage?: boolean, isAutoCompleteCall?: boolean): Query {
        if ( !this.obj)
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
export function cssForN2Grid(n2GridClass:string, eGridClass:string){


    let accent = CORE_MATERIAL.material_accent_color;
    let accentContrastColor = fontColor(accent); // dynamically calculated based on theme color

    const rootStyle = getComputedStyle(document.documentElement);


    let gridHoverBgColor = VARS_EJ2_COMMON.grid_hover_bg_color;
    let gridHoverFontColor = fontColor(gridHoverBgColor); // the contrast color to the current background


    // Removes blue background from grid editable checkbox and restores border and font color
    cssAddSelector(`.${n2GridClass} .e-checkbox-wrapper .e-frame.e-check, .${n2GridClass} .e-css.e-checkbox-wrapper .e-frame.e-check`,
`
    background-color: transparent;
    border-color: unset;
    color: black;`        );

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
        `font-family: ${CORE_MATERIAL.app_font_family};
font-size: ${CORE_MATERIAL.app_font_size_regular};`
    );

    //Make tops of grid filters change colors for enabled filters
    cssAddSelector(`.${n2GridClass} .e-filtertext:not(.e-disable) `, `
     background-color: ${CORE_MATERIAL.app_filter_text_background_color} !important;
  padding-left: 1ch !important;
    `);

    // start Grid lines color
//         cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell, .e-control.${eGridClass} .e-groupcaption, .e-control.${eGridClass} .e-indentcell, .e-control.${eGridClass} .e-recordplusexpand, .e-control.${eGridClass} .e-recordpluscollapse, .e-control.${eGridClass} .e-detailrowcollapse, .e-control.${eGridClass} .e-detailrowexpand, .e-control.${eGridClass} .e-detailindentcell, .e-control.${eGridClass} .e-detailcell,
// .${n2GridClass}.e-control.${eGridClass} .e-toolbar, .e-control.e-pager, .e-control.${eGridClass}, .e-control.${eGridClass} .e-headercell, .e-control.${eGridClass} .e-detailheadercell, e-columnheader,
// .${n2GridClass}.e-control.${eGridClass}.e-resize-lines .e-headercell .e-rhandler, .e-control.${eGridClass}.e-resize-lines .e-headercell .e-rsuppress `, `
//  border-color: ${CORE_MATERIAL.app_grid_line_color} !important;
// `);

    //       cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-gridheader, .e-columnheader`, `
    // border-bottom-color: ${CORE_MATERIAL.app_grid_line_color} !important;
    // border-top-color: ${CORE_MATERIAL.app_grid_line_color} !important;
    //   `);

    //
    //     // This is the default color of the grid lines
    //     cssAddSelector(`.${n2GridClass} tr, .${n2GridClass} th`, `
    //     border-color: ${CORE_MATERIAL.app_grid_line_color} !important;
    // `);

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
  font-family: ${CORE_MATERIAL.app_font_family};
  font-size: ${CORE_MATERIAL.app_font_size_regular};    
    `);


    // left divider color for row cell, header and filter cells
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell, .${n2GridClass}.e-control.${eGridClass} .e-filterbarcell, .${n2GridClass}.e-control.${eGridClass} .e-headercell`, `
  border-left: 1px solid ${VARS_EJ2_COMMON.grid_header_border_color};
    `);

    // eliminate resize handler cell visible border
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-headercell .e-rhandler`, `
  border-right-width: 0px !important;
  border-right-style: solid !important;
  border-right-color: ${VARS_EJ2_COMMON.grid_table_background_color} !important;    
    `);

    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-tableborder `, `
      border-right-color: ${CORE_MATERIAL.app_grid_line_color} !important;
    `);

    // Controls the left/right padding in grid cells
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rowcell, .${eGridClass} .e-filterbarcell, .${eGridClass} .e-filterbarcelldisabled, .${eGridClass} .e-headercell, .${eGridClass} .e-detailheadercell`, `
      padding-left: 5px !important;
      padding-right: 5px !important;
    `);

    // this selector is used to denote a disabled row in the grid
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rowcell.screen-grid-col-disabled `, `
      background-color: ${CORE_MATERIAL.app_row_disabled_background_color_lightgray};
    `);
    // this selector is used to denote a disabled row in the grid
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-headercell.screen-grid-col-disabled `, `
   background-color: ${CORE_MATERIAL.app_row_disabled_background_color_lightgray} !important;   
    `);

    // Ej2 defaults the width to 57px for some strange reason
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-grouptext`, `
    width: unset;
    `);

    // group area background color
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-groupdroparea.e-grouped`, `
  background-color: ${CORE_MATERIAL.app_color_panel_background};    
    `);
// This is here for the grid cell to not wrap on <br>
    cssAddSelector(`.${n2GridClass} td.e-rowcell br`, `
     display: none;
    `);
} // cssForN2Grid

themeChangeListeners().add((ev: ThemeChangeEvent) => {
    cssForN2Grid(N2Grid.CLASS_IDENTIFIER, 'e-grid');
}); // normal priority