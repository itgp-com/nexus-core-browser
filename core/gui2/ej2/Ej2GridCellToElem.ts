
import {doesImplementInterface} from '@syncfusion/ej2-grids/src/grid/base/util';
import {isNullOrUndefined} from '@syncfusion/ej2-base';
import {ColumnModel, Grid, CellRenderer} from '@syncfusion/ej2-grids';
import {QueryCellInfoEventArgs, RowDataBoundEventArgs} from '@syncfusion/ej2-grids/src/grid/base/interface';
import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import {isFunction, isNumber, isString, template} from 'lodash';
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
import {CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS, highlight_record_column_values} from '../highlight/N2Highlight';
import {N2, N2Evt_AfterLogic} from '../N2';
import {addClassesToElement, addN2Class} from '../N2HtmlDecorator';
import {isN2} from '../N2Utils';


const _cellAttributesToRemove = ['tabindex', 'aria-label', 'aria-expanded', 'aria-selected']

export class Args_detailElemsFromGridRow {

    grid: Grid;

    rowIndex: number;

    /**
     * If present, it will be used instead of the grid row at rowIndex (it will probably contain highlights)
     */
    rec ?:any;

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

    // if args.rec is present, use that record instead of the one in the grid
    let rec = (args.rec ? args.rec :  grid.getCurrentViewRecords()[args.rowIndex]);
    args.rec = rec; // fill in the args so we have it later when we create the panel

    let colList: Column[] | ColumnModel[] = args.specific_columns;
    if (!colList) {
        colList = args.grid.getColumns();
    }


    let highlighted_fields :string[] = (args?.rec['___highlights___']  || [] ) as string[]
    let is_highlighted_record:boolean = highlighted_fields.length > 0;

    // loop through columns
    for (let colIndex = 0; colIndex < colList.length; colIndex++) {
        let col_raw = colList[colIndex];

        let col: Column = grid.getColumnByField(col_raw.field); // actual Column class with active functions and methods (if needed)

        // Get the cell element. It's ok to do that even if we might have a different row than the one in the grid, because we only keep the cell shell
        let gridCell = grid.getMovableCellFromIndex(args.rowIndex, colIndex) as HTMLElement;

        let gridRowElement = gridCell.parentElement;

        let rowElem = document.createElement('tr');
        // Copy all attributes from the old element to the new one
        Array.from(gridRowElement.attributes).forEach(attr => {
            rowElem.setAttribute(attr.name, attr.value);
        });

        gridCell = gridCell.cloneNode(true) as HTMLElement;
        // don't give the cell by reference, give it by value
        let cell = document.createElement('div');
        // Copy all attributes from the old element to the new one
        Array.from(gridCell.attributes).forEach(attr => {
            cell.setAttribute(attr.name, attr.value);
        });


        if ( is_highlighted_record) {
            // Create new record for overwriting the highlighted fields with marked up value instead of the original value
            let rec_highlighted = Object.assign({}, rec);

            // copy from fields in rec[highlight_record_column_values] to fields in rec
            if (rec[highlight_record_column_values]) {
                let highlight_values = rec[highlight_record_column_values]; // the highlighted text values
                for (let key in highlight_values) {
                    rec_highlighted[key] = highlight_values[key];
                } // for key
            } // if rec[highlight_record_column_values]

            // create the HTML cell using the highlighted value of the fields
            if (col.template ) {
                let templateHTML:string;

                if (  isFunction(col.template)){
                    try {
                      templateHTML = col.template.call(grid, rec_highlighted); // call the template passing in the record (row data)
                    } catch(e) {
                        templateHTML = '';
                        console.error(e);}
                } else {
                    // if template is string
                    let template = col.template as string;
                    if (template.startsWith('#')) {
                        // get template from the document
                        templateHTML = document.querySelector(template).outerHTML;
                    } else {
                        templateHTML = template;
                    } // if template is function
                }// if template is function
                cell.innerHTML = templateHTML;
            } else {
                renderCell(cell, grid, col, rec_highlighted);
            } //    if (col.template )

        } else {
            // Move all children from the old element to the new one
            while (gridCell.firstChild) {
                cell.appendChild(gridCell.firstChild);
            }
        } // if is_highlighted_record

        addClassesToElement(cell, CSS_CLASS_grid_cell_detail);


        // At this point we have a div with the same content as the grid cell
        // Do the queryCellInfo and rowDataBound events using the non-highlighted (real) record

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
                // grid.queryCellInfo(qev);
                grid.trigger('queryCellInfo', qev);

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

            // now Call the RowDataBound event
            let rowDataBound: RowDataBoundEventArgs = {
                /** Defines the current row data.
                 *
                 * @isGenericType true
                 */
                data : rec,
                /** Defines the row element.
                 *
                 * @blazorType CellDOM
                 */
                row : rowElem,
                /** Defines the row height */
                rowHeight : grid.getRowHeight(),
                /** Defines whether the row should be select or not */
                isSelectable: false,
            } // RowDataBoundEventArgs
            grid.trigger('rowDataBound', rowDataBound);





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

} // detailElemsFromGridRow


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
    let highlighted_fields :string[] = (args?.rec['___highlights___']  || [] ) as string[]


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


            let is_highlighted :boolean = highlighted_fields.includes(col.field);




            let isCollapsibleLongText: boolean = detail_elem.classList.contains(CSS_CLASS_detail_long_text);

            if (isCollapsibleLongText) {

                let toggle_row = ` <i class="${CSS_CLASS_o_detail_icon_solid} ${CSS_CLASS_o_detail_icon_down} ${CSS_CLASS_o_detail_toggle} ${CSS_CLASS_o_detail_toggle} ${CSS_CLASS_o_detail_absolute}"></i>`;
                let elem_toggle_row = htmlToElement(toggle_row);

                let classes:string[] = ['col-8', CSS_CLASS_grid_cell_detail_value, CSS_CLASS_o_detail_text_collapsible, CSS_CLASS_o_detail_collapsed];//collapsible outer
                if (is_highlighted) {
                    classes.push(CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS); // highlight the whole cell
                }
                widget2 = new N2Panel({
                    deco: {
                        classes: classes,
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

                let classes:string[] =  ['col-8', CSS_CLASS_grid_cell_detail_value];
                if (is_highlighted) {
                    classes.push(CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS); // highlight the whole cell
                }
                widget2 = new N2Panel({
                    deco: {
                        classes: classes
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

} // detailPanelFromGrid_2Columns_Style01

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




//---------------------------------------
function renderCell(cell: HTMLElement, grid: Grid, column: Column, data: any): void {
    // from cell-renderer.js


    let localizer: any = grid.serviceLocator.getService('localization');

    var innerHtml = '';
    var value = data[column.field];
    if (column.valueAccessor && !isString(column.valueAccessor))
        value = column.valueAccessor(column.field, data, column);
    if ((column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly') && !isNullOrUndefined(value)) {
        value = new Date(value as string);
    }

    value = _format(column, grid, value, data);
    innerHtml = value.toString();
    if (column.type === 'boolean' && !column.displayAsCheckBox) {
        var localeStr = (value !== 'true' && value !== 'false') ? null : value === 'true' ? 'True' : 'False';

        innerHtml = localeStr ? localizer.getConstant(localeStr) : innerHtml;
    }
    let fromFormatter = _invokeFormatter(column, value, data);
    innerHtml = !isNullOrUndefined(column.formatter) ? isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
    cell.setAttribute('aria-label', innerHtml + localizer.getConstant('ColumnHeader') + column.headerText);

    // cell.innerHTML = _grid.sanitize(innerHtml);


    cell.innerHTML = innerHtml;

    // if (this.evaluate(node, cell, data, attributes, fData, isEdit) && column.type !== 'checkbox') {
    //     this.appendHtml(node, this.parent.sanitize(innerHtml), column.getDomSetter ? column.getDomSetter() : 'innerHTML');
    // }
    // else if (column.type === 'checkbox') {
    //     node.classList.add(literals.gridChkBox);
    //     node.setAttribute('aria-label', this.localizer.getConstant('CheckBoxLabel'));
    //     if (this.parent.selectionSettings.persistSelection) {
    //         value = value === 'true';
    //     }
    //     else {
    //         value = false;
    //     }
    //     var checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
    //     if (this.parent.cssClass) {
    //         addClass([checkWrap], [this.parent.cssClass]);
    //     }
    //     this.rowChkBox.id = 'checkbox-' + cell.rowID;
    //     checkWrap.insertBefore(this.rowChkBox.cloneNode(), checkWrap.firstChild);
    //     node.appendChild(checkWrap);
    // }
    // if (this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
    //     cell.isSelected = true;
    // }
    // this.setAttributes(node, cell, attributes);
    // if (column.type === 'boolean' && column.displayAsCheckBox) {
    //     var checked = isNaN(parseInt(value.toString(), 10)) ? value === 'true' : parseInt(value.toString(), 10) > 0;
    //     var checkWrap = createCheckBox(this.parent.createElement, false, { checked: checked, label: ' ' });
    //     node.innerHTML = '';
    //     node.classList.add('e-gridchkbox-cell');
    //     checkWrap.classList.add('e-checkbox-disabled');
    //     if (this.parent.cssClass) {
    //         addClass([checkWrap], [this.parent.cssClass]);
    //     }
    //     node.appendChild(checkWrap);
    //     node.setAttribute('aria-label', checked + this.localizer.getConstant('ColumnHeader') + cell.column.headerText);
    // }
    // if (node.classList.contains('e-summarycell') && !data.key) {
    //     var uid = node.getAttribute('e-mappinguid');
    //     column = this.parent.getColumnByUid(uid);
    // }
    // if (this.parent.isFrozenGrid() && (!data || (data && !data.key))) {
    //     addStickyColumnPosition(this.parent, column, node);
    // }
    // return node;

} //renderCell

function _format(column: Column, grid: Grid, value: any, data: any): string {
    if (!isNullOrUndefined(column.format)) {
        if (column.type === 'number' && isNaN(parseInt(value, 10))) {
            value = null;
        }


        let formatter: any = grid.serviceLocator.getService('valueFormatter');
        value = formatter.toView(value, column.getFormatter());
    }
    return isNullOrUndefined(value) ? '' : value.toString();
}

function _invokeFormatter(column: Column, value: any, data: any) {
    if (!isNullOrUndefined(column.formatter)) {
        if (doesImplementInterface(column.formatter, 'getValue')) {
            let formatter = column.formatter as any;
            value = new formatter().getValue(column, data);
        } else if (typeof column.formatter === 'function') {
            value = (column.formatter as Function)(column, data);
        } else {
            value = column.formatter.getValue(column as Column, data);
        }
    }
    return value;
}