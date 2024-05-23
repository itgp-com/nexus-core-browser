import {createSpinner, hideSpinner, showSpinner} from '@syncfusion/ej2-popups';
import {isDev} from '../../../../CoreUtils';
import {ItemModel_N2DropDownMenu} from '../../derived/N2DropDownMenu';
import {N2Grid} from '../N2Grid';
import {Args_DoExcelExport, ExcelExportNexus} from './N2Grid_Options';

export interface Args_DropDownMenuItem {
    n2Grid: N2Grid;
}

export class N2Grid_DropDownMenu {
    public static item_refresh(args: Args_DropDownMenuItem): ItemModel_N2DropDownMenu {
        let grid = args?.n2Grid?.obj;

        return {
            id: 'refresh',
            text: 'Refresh',
            iconCss: `fa-solid fa-arrow-rotate-right`,
            select: (_ev) => {
                if (grid)
                    grid.refresh();
            }
        } as ItemModel_N2DropDownMenu;
    } // item_refresh

    public static item_enable_grouping(args: Args_DropDownMenuItem): ItemModel_N2DropDownMenu {
        let grid = args?.n2Grid?.obj;

        return {
            id: 'enable-grouping',
            text: 'Enable Grouping',
            iconCss: `fa-solid fa-bars-staggered`,
            beforeOpen: (args) => {
                let ev = args.args;
                let item = ev.items.find((item) => item.id === 'enable-grouping');
                if (item) {
                    item.disabled = grid.allowGrouping;
                }
            },
            select: (_ev) => {
                try {
                    grid.allowGrouping = true;
                } catch (e) { console.error(e); }
            },

        } as ItemModel_N2DropDownMenu;

    } // item_enable_grouping


    public static item_disable_grouping(args: Args_DropDownMenuItem): ItemModel_N2DropDownMenu {
        let grid = args?.n2Grid?.obj;
        return {
            id: 'disable-grouping',
            text: 'Disable Grouping',
            iconCss: `fa-solid fa-ban`,
            beforeOpen: (args) => {
                let ev = args.args;
                let item = ev.items.find((item) => item.id === 'disable-grouping');
                if (item) {
                    item.disabled = !grid.allowGrouping;
                }
            },
            select: (_ev) => {
                grid.allowGrouping = false;
            },

        } as ItemModel_N2DropDownMenu;

    } // item_disable_grouping


    public static item_excel_export(args: Args_DropDownMenuItem): ItemModel_N2DropDownMenu {
        let grid = args?.n2Grid?.obj;

        return {
            id: 'excel-export',
            text: 'Excel Export',
            iconCss: `fa-solid fa-file-excel`,
            select: async (_ev) => {

                createSpinner({target: grid.element, type: 'Bootstrap'});
                showSpinner(grid.element);
                let args_excel: Args_DoExcelExport = {
                    grid: grid,
                }
                setTimeout(async () => {
                    try {
                        let _result = await ExcelExportNexus.doExcelExport(args_excel);
                        if ( isDev()) {
                            console.log('ExcelExportNexus.doExcelExport(args): result', _result);
                        }

                    } finally {
                        hideSpinner(grid.element);
                    }
                }, 100);

            }, // select
        } as ItemModel_N2DropDownMenu;
    } // item_excel_export


} // N2Grid_DropDownMenu