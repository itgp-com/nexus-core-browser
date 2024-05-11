import {ColumnModel, Grid} from '@syncfusion/ej2-grids';
import {QueryCellInfoEventArgs} from '@syncfusion/ej2-grids/src/grid/base/interface';
import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import {isNumber} from 'lodash';
import {htmlToElement} from '../../BaseUtils';
import {
    CSS_ATTR_data_col_field,
    CSS_CLASS_detail_long_text,
    CSS_CLASS_grid_cell_detail,
    CSS_CLASS_grid_cell_detail_container,
    CSS_CLASS_grid_cell_detail_header,
    CSS_CLASS_grid_cell_detail_value,
    CSS_CLASS_o_detail_absolute,
    CSS_CLASS_o_detail_collapsed,
    CSS_CLASS_o_detail_content,
    CSS_CLASS_o_detail_icon_down,
    CSS_CLASS_o_detail_icon_solid,
    CSS_CLASS_o_detail_icon_up,
    CSS_CLASS_o_detail_text_collapsible,
    CSS_CLASS_o_detail_toggle
} from '../../Constants';
import {isHTMLElement} from '../../CoreUtils';
import {ObserverManager} from '../../ObserverManager';
import {N2Column} from '../generic/N2Column';
import {N2Html} from '../generic/N2Html';
import {N2Panel} from '../generic/N2Panel';
import {N2Row} from '../generic/N2Row';
import {N2, N2Evt_AfterLogic} from '../N2';
import {addClassesToElement, addN2Class} from '../N2HtmlDecorator';
import {isN2} from '../N2Utils';


const _cellAttributesToRemove = ['tabindex', 'aria-label', 'aria-expanded', 'aria-selected']

export class Args_detailElemsFromGridRow {
    grid: Grid;
    rowIndex: number;
    specific_columns ?: Column[] | ColumnModel[];

    /**
     * Optional callback that allows for the customization of the detail elements
     * initially created from the grid.
     *
     * If you want to change the order of the columns at this point,
     * remove all the elements of the detailMap and re-insert them in the new order
     * @type {(detailMap: Record<string, GridCellDetail>) => void}
     */
    onGridCellDetail?: (detailMap: Record<string, GridCellDetail>) => void;

} //  Args_detailElemsFromGridRow

export class Args_detailPanelFromGrid_2Columns_Style01 extends Args_detailElemsFromGridRow {
    /**
     * Optional: ability to overwrite the default header callback that simply uses the col.headerText
     *
     * @type {(args: {gridCellDetail: GridCellDetail}) => (HTMLElement | N2 | undefined)}
     * @returns {HTMLElement | N2 | undefined} if null returned, it will use the default.
     */
    onHeader ?: (args: {

        n2_header: N2;
        header_elem: HTMLElement;

        gridCellDetail: GridCellDetail }) => HTMLElement | N2 | void;

    onValue ?: (args: {n2_container: N2, detail_elem: HTMLElement, gridCellDetail: GridCellDetail}) => N2 | void;


    onRow ?:(args: {n2_row: N2Row, gridCellDetail: GridCellDetail}) => N2Row | void;

} // Args_detailPanelFromGrid_2Columns_Style01


interface IGridCellDetail {
    grid: Grid;
    elem: HTMLElement;
    column: Column; // Ensure that Column is also defined or imported
}

export class GridCellDetail implements IGridCellDetail {
    grid: Grid;
    elem: HTMLElement;
    column: Column;

    constructor(data: IGridCellDetail) {
        this.grid = data.grid;
        this.elem = data.elem;
        this.column = data.column;
    }
}

export function detailElemsFromGridRow(args: Args_detailElemsFromGridRow): Record<string, GridCellDetail> {

    let result: Record<string, GridCellDetail> = {};

    let grid: Grid = args.grid;

    args.rowIndex = args.rowIndex || 0;
    let gridRecords = grid.getCurrentViewRecords();
    if (args.rowIndex >= gridRecords.length) {
        return result;
    }
    let rec = grid.getCurrentViewRecords()[args.rowIndex];

    let colList: Column[] | ColumnModel[] = args.specific_columns;
    if (!colList) {
        colList = args.grid.getColumns();
    }

    // loop through columns
    for (let colIndex = 0; colIndex < colList.length; colIndex++) {
        let col_raw = colList[colIndex];

        let col: Column = grid.getColumnByField(col_raw.field); // actual Column class with active functions and methods (if needed)

        // Hardcoded row number
        let gridCell = grid.getMovableCellFromIndex(args.rowIndex, colIndex) as HTMLElement;

        gridCell = gridCell.cloneNode(true) as HTMLElement;
        // don't give the cell by reference, give it by value
        let cell = document.createElement('div');
        // Copy all attributes from the old element to the new one
        Array.from(gridCell.attributes).forEach(attr => {
            cell.setAttribute(attr.name, attr.value);
        });

        // Move all children from the old element to the new one
        while (gridCell.firstChild) {
            cell.appendChild(gridCell.firstChild);
        }

        addClassesToElement(cell, CSS_CLASS_grid_cell_detail);


        // At this point we have a div with the same content as the grid cell

        try {
            if (grid && col && rec) {
                let qev: QueryCellInfoEventArgs = {
                    cell: cell,
                    column: col,
                    colSpan: 1,
                    data: rec,
                    foreignKeyData: false,
                    name: 'queryCellInfo',
                    requestType: undefined,
                    rowSpan: 1,
                } as QueryCellInfoEventArgs;


                // modify the cell
                grid.queryCellInfo(qev);

            } // if


            if (!cell.classList.contains(CSS_CLASS_detail_long_text)) {
                let width = col.width;
                if (width) {
                    if (isNumber(width)) {
                        cell.style.width = `${width}px`;
                    } else {
                        cell.style.width = width;
                    }
                }
                let minWidth = col.minWidth;
                if (minWidth) {
                    if (isNumber(minWidth)) {
                        cell.style.minWidth = `${minWidth}px`;
                    } else {
                        cell.style.minWidth = minWidth;
                    }
                }
                let maxWidth = col.maxWidth;
                if (maxWidth) {
                    if (isNumber(maxWidth)) {
                        cell.style.maxWidth = `${maxWidth}px`;
                    } else {
                        cell.style.maxWidth = maxWidth;
                    }
                }
            } // if not long text
            let textAlign = col.textAlign;
            if (textAlign) {
                cell.style.textAlign = textAlign;
            }


            //--------------- Clean up the cell of all unnecessary classes and attributes ----------------

            // remove all classes starting with 'e-' (e-rowcell e-unfreeze e-selectionbackground e-active)
            Array.from(cell.classList).forEach(className => {
                if (className.startsWith('e-')) {
                    cell.classList.remove(className);
                }
            });

            // remove unnecessary attributes
            _cellAttributesToRemove.forEach(attr => {
                if (cell.hasAttribute(attr)) {
                    cell.removeAttribute(attr);
                }
            });

            if (!cell.hasAttribute(CSS_ATTR_data_col_field))
                cell.setAttribute(CSS_ATTR_data_col_field, col.field);

            result[col.field] = new GridCellDetail({grid:grid, elem: cell, column: col});
        } catch (e) {
            console.error(e);
        }

    } // for col


    return result;

} // gridCellsForDetail


export function detailPanelFromGrid_2Columns_Style01(args: Args_detailPanelFromGrid_2Columns_Style01): N2 {
    let gridCellDetailsMap: Record<string, GridCellDetail> = detailElemsFromGridRow(args);
    if (args.onGridCellDetail) {
        args.onGridCellDetail.call(args.grid, gridCellDetailsMap);
    }

    let gridCellDetails: GridCellDetail[] = [];
    for (let key in gridCellDetailsMap) {
        let gridCellDetail = gridCellDetailsMap[key];
        gridCellDetails.push(gridCellDetail);
    }

    //------------------ from here on we make a custom UI for the widgets returned for the grid columns -----------

    let grid:Grid = args.grid;
    let columnWidgets: any[] = [];
    //for widgets create N2Rows with the column headerText and N2HTML label and widget as value
    for (let i = 0; i < gridCellDetails.length; i++) {
        let detail: GridCellDetail = gridCellDetails[i];

        let col = detail.column;
        let detail_elem = detail.elem;

        if (detail_elem.innerHTML == '') {
            detail_elem.style.minHeight = 'max(1em, 100%)';
        }

        let wstyle = detail_elem.style;

        wstyle.width = 'undefined';
        wstyle.textAlign = 'left';

        addClassesToElement(detail_elem, [CSS_CLASS_o_detail_content]); //collapsible content

        let n2Header: N2;
        let header_elem :HTMLElement;
        try {
            let headerByField: Element = grid.getColumnHeaderByField(col.field);
            if ( headerByField != null && headerByField instanceof HTMLElement) {
                let original_headercelldiv = headerByField.querySelector('.e-headercelldiv');
                header_elem = original_headercelldiv.cloneNode(true) as HTMLElement;
                header_elem.classList.remove('e-headercelldiv');
                header_elem.style.textAlign = 'left'; // default to this for detail
            }
        } catch (e) {
            console.error('Error in grid.getColumnHeaderByField(col.field)', e, col, grid);
        }
        if ( header_elem == null) {
            header_elem = document.createElement('div');
            header_elem.innerHTML = col.headerText;
        }
        n2Header = new N2Html({
            value: header_elem,
            // onDOMAdded: (ev:N2Evt_DomAdded) => {
            //     console.log('onDOMAdded', 'onAdded count:' , ObserverManager.listOnAdded().length, ev.element.outerHTML);
            // },
            // onDOMRemoved: (ev:N2Evt_DomAdded) => {
            //     console.log('onDOMRemoved', 'onRemoved count:' , ObserverManager.listOnRemoved().length, ev.element.outerHTML);
            // }
        });
        addN2Class(n2Header.state.deco, 'col-4', CSS_CLASS_grid_cell_detail_header);


        if (args.onHeader) {
            try {
                let callback_header_elem = args.onHeader({n2_header: n2Header, header_elem: header_elem, gridCellDetail: detail});
                if ( callback_header_elem) {
                    if (callback_header_elem instanceof HTMLElement) {
                        n2Header = new N2Html({value: callback_header_elem});
                    } else {
                        n2Header = callback_header_elem as N2;
                    }
                } // if header_elem
            } catch (e) {
                console.error(e, detail, args);
            }
        } // if callbackHeader
        try {
            n2Header.state.deco.otherAttr[CSS_ATTR_data_col_field] = col.field;
        } catch (e) {
            console.error(e. n2_header.deco, col.field);
        }

        let widget2: N2|HTMLElement;
        if (isHTMLElement(detail_elem)) {


            let isCollapsibleLongText: boolean = detail_elem.classList.contains(CSS_CLASS_detail_long_text);

            if (isCollapsibleLongText) {

                let toggle_row = ` <i class="${CSS_CLASS_o_detail_icon_solid} ${CSS_CLASS_o_detail_icon_down} ${CSS_CLASS_o_detail_toggle} ${CSS_CLASS_o_detail_toggle} ${CSS_CLASS_o_detail_absolute}"></i>`;
                let elem_toggle_row = htmlToElement(toggle_row);

                widget2 = new N2Panel({
                    deco: {
                        classes: ['col-8', CSS_CLASS_grid_cell_detail_value, CSS_CLASS_o_detail_text_collapsible, CSS_CLASS_o_detail_collapsed], //collapsible outer
                    },
                    children: [
                        detail_elem,
                        elem_toggle_row,
                    ],
                });


                // Adding Manually since there is no need for an N2 component to be created for this
                ObserverManager.addOnAdded({
                    identifier: detail_elem,
                    onAdded: (_element: HTMLElement) => {
                        let hasOverflow = detail_elem.scrollHeight > detail_elem.clientHeight;
                        if (!hasOverflow) {
                            elem_toggle_row.style.display = 'none';
                        } else {
                            // insert space at the bottom for the chevron
                            let toggle_height: number = elem_toggle_row.getBoundingClientRect().height;
                            detail_elem.parentElement.style.paddingBottom = `${toggle_height}px`;
                        }
                    }
                }); //ObserverManager.addOnAdded


            } else {
                // regular field
                widget2 = new N2Panel({
                    deco: {
                        classes: ['col-8', CSS_CLASS_grid_cell_detail_value], //collapsible outer
                    },
                    children: [
                        detail_elem,
                    ],
                });
            }

        } else {
            widget2 = detail_elem;
        }

        if (args.onValue){
            try {
                let response = args.onValue({
                    n2_container: (isN2(widget2) ? widget2 : null),
                    detail_elem: detail_elem,
                    gridCellDetail: detail
                });

                if (response)
                    widget2 = response;
            } catch (e) {
                console.error(e, detail, args);
            }
        } // if onCol2Widget

        let rowForCell = new N2Row({
            children: [
                n2Header,
                widget2,
            ]
        });


        if (args.onRow){
            try {
                let row =  args.onRow({
                    n2_row: rowForCell,
                    gridCellDetail: detail
                });

                if (row)
                    rowForCell = row;

            } catch (e) {
                console.error(e, detail, args);
            }
        } // if onCol2Widget

        columnWidgets.push(rowForCell);
    } //  for i


    //----------------------- collapsible text logic ----------------------


    function f_container_onAfterInitLogic(_ev: N2Evt_AfterLogic) {
        let container = n2Container.htmlElement;

        // Using event delegation for dynamically added elements
        container.addEventListener('click', (event:Event) => {
            if ((event.target as Element)?.classList?.contains(CSS_CLASS_o_detail_toggle)) {
                const collapsible = (event.target as Element).closest(`.${CSS_CLASS_o_detail_text_collapsible}`);
                const content = collapsible.querySelector(`.${CSS_CLASS_o_detail_content}`) as HTMLElement;
                const toggle = event.target as HTMLElement;
                const isCollapsed = collapsible.classList.contains(CSS_CLASS_o_detail_collapsed);

                const saved_max_height_attribute_name = 'local-style-max-height';
                collapsible.classList.toggle(CSS_CLASS_o_detail_collapsed, !isCollapsed);
                if (isCollapsed) {
                    toggle.classList.remove(CSS_CLASS_o_detail_icon_down); // 'fa-chevron-down'
                    toggle.classList.add(CSS_CLASS_o_detail_icon_up); // 'fa-chevron-up', 'fixed'

                    // save local max height if set
                    if (content.style.maxHeight != null) {
                        content.setAttribute(saved_max_height_attribute_name, content.style.maxHeight);
                    }
                    content.style.maxHeight = 'none';
                } else {
                    toggle.classList.remove(CSS_CLASS_o_detail_icon_up); //'fa-chevron-up'
                    toggle.classList.add(CSS_CLASS_o_detail_icon_down); // 'fa-chevron-down', 'absolute'
                    toggle.style.bottom = '0'; // when collapsing, reset the bottom

                    if (content.hasAttribute(saved_max_height_attribute_name)) {
                        content.style.maxHeight = content.getAttribute(saved_max_height_attribute_name);
                        content.removeAttribute(saved_max_height_attribute_name);
                    } else {
                        content.style.maxHeight = null; // clear it so the css selector can set the max-height (controlled by CSS classes )
                    }
                }
                collapsibleLongTextUpdateTogglePosition(toggle, content, container);
            }
        });

        // Handle scrolling within any collapsible
        container.addEventListener('scroll', (event:Event) => {
            let target = event.target as HTMLElement;

            target.querySelectorAll(`.${CSS_CLASS_o_detail_text_collapsible}`).forEach(collapsible => {
                const content = collapsible.querySelector(`.${CSS_CLASS_o_detail_content}`);
                const toggle = collapsible.querySelector(`.${CSS_CLASS_o_detail_toggle}`);

                const isCollapsed = collapsible.classList.contains(CSS_CLASS_o_detail_collapsed);

                if (!isCollapsed) {
                    // console.log('scroll', toggle.classList, content.classList);
                    collapsibleLongTextUpdateTogglePosition(toggle, content, container);
                }
            });
        }, true);


    } // f_container_onAfterInitLogic

    //----------------------- end collapsible text logic ---------------------

    let n2Container: N2Column = new N2Column({
        deco: {
            classes: [CSS_CLASS_grid_cell_detail_container],
        },
        children: columnWidgets,
        onAfterInitLogic: f_container_onAfterInitLogic,
    });

    return n2Container;

} // gridCellDetailPanel_Style01

export function collapsibleLongTextUpdateTogglePosition(toggle: Element, content: Element, container: Element) {

    const collapsible = toggle.closest(`.${CSS_CLASS_o_detail_text_collapsible}`);
    const isCollapsed = collapsible.classList.contains(CSS_CLASS_o_detail_collapsed);
    if (isCollapsed)
        return; // no need to update position if it's collapsed

    let grandparent = container as HTMLElement;
    let parent: HTMLElement = content as HTMLElement;
    let child: HTMLElement = toggle as HTMLElement;

    // Calculate how far the bottom of the parent is from the bottom of the grandparent's content area
    // let difference = grandparent.scrollHeight - grandparent.scrollTop - (parent.offsetTop + parent.offsetHeight);

    let grandparentRect = grandparent.getBoundingClientRect();
    let parentRect = parent.getBoundingClientRect();
    let toggleRect = toggle.getBoundingClientRect();

    let difference = grandparentRect.bottom - parentRect.bottom;

    if (difference >= 0) {
        // Parent's bottom is within or above the grandparent's bottom
        child.style.position = 'absolute';
        child.style.bottom = '0';
    } else {
        // Parent's bottom is below the grandparent's bottom
        child.style.position = 'absolute';
        child.style.bottom = `${(0 - difference) + toggleRect.height}px`;
    }


    // const bottomEdge = contentRect.bottom - containerRect.bottom;
    //
    // console.log( 'bottomEdge', bottomEdge, contentRect.bottom, containerRect.bottom)

    // if (bottomEdge > 0) {
    //     // Bottom of the content is below the container's view
    //     toggle.classList.remove(CSS_CLASS_o_detail_fixed);
    //     toggle.classList.add(CSS_CLASS_o_detail_absolute);
    // } else {
    //     // Bottom of the content is within the container's view
    //     toggle.classList.add(CSS_CLASS_o_detail_fixed);
    //     toggle.classList.remove(CSS_CLASS_o_detail_absolute);
    // }


    // // const contentRect = content.getBoundingClientRect();
    // if (contentRect.bottom < window.innerHeight) {
    //     toggle.classList.remove(CSS_CLASS_o_detail_fixed);
    //     toggle.classList.add(CSS_CLASS_o_detail_absolute);
    // } else {
    //     toggle.classList.add(CSS_CLASS_o_detail_fixed);
    //     toggle.classList.remove(CSS_CLASS_o_detail_absolute);
    // }
} //