import {ColumnModel, Grid, GridModel} from "@syncfusion/ej2-grids";
import {
    adjustColumnWidthForCustomExcelFilters,
    stateGrid_CustomExcelFilter
} from '../../gui2/ej2/ext/util/N2Grid_Options';
import {AbstractGrid, Args_AbstractGrid} from "../ej2/abstract/AbstractGrid";

export class Args_CoreOnly_Grid_FilterPage extends Args_AbstractGrid {
    pagingDisabled?: boolean;
    filteringDisabled?: boolean;
}

export class CoreOnly_Grid_FilterPage<T = any> extends AbstractGrid {

    protected constructor() {
        super();
    }


    static async create<T = any>(args?: Args_CoreOnly_Grid_FilterPage): Promise<CoreOnly_Grid_FilterPage<T>> {
        let instance = new CoreOnly_Grid_FilterPage<T>();
        await instance.initialize_AbstractGrid(args);
        return instance;
    }


    async createGridModel() {
        let thisX = this;

        let m = this.gridModel as GridModel;
        //defaults
        // defaults
        if (m.allowSorting == null) m.allowSorting = true;
        if (m.allowMultiSorting == null) m.allowMultiSorting = true;
        if (m.allowTextWrap == null) m.allowTextWrap = true;
        if (m.allowResizing == null) m.allowResizing = true;
        if (m.allowSelection == null) m.allowSelection = true;
        if (m.allowKeyboard == null) m.allowKeyboard = true;
        let old_data_bound = m.dataBound;
        m.dataBound = () => {
            // filtering by contains not startswith
            let _gridAll = (thisX.obj as Grid);
            // replace default operator (startsWith with contains)
            // if (_gridAll.filterOperators){
            //    //Optional - doesn't do anything, but really should in the future at some point
            //    Object.assign(_gridAll.filterOperators, {startsWith: 'contains'});
            // }
            if (_gridAll.filterModule) {
                //This is the real deal for operator replacement
                Object.assign(_gridAll.filterModule["filterOperators"], {startsWith: 'contains'});
            }
            if (old_data_bound) old_data_bound.call(thisX.obj);
        }

        // this.gridModel = {
        //
        //
        //     allowSorting: true,
        //     allowMultiSorting: true,
        //     allowTextWrap: true,
        //     allowResizing: true,
        //     allowSelection: true,
        //     allowKeyboard: true,
        //     dataBound: () => {
        //         // filtering by contains not startswith
        //         let _gridAll = (thisX.obj as Grid);
        //         // replace default operator (startsWith with contains)
        //         // if (_gridAll.filterOperators){
        //         //    //Optional - doesn't do anything, but really should in the future at some point
        //         //    Object.assign(_gridAll.filterOperators, {startsWith: 'contains'});
        //         // }
        //         if (_gridAll.filterModule) {
        //             //This is the real deal for operator replacement
        //             Object.assign(_gridAll.filterModule["filterOperators"], {startsWith: 'contains'});
        //         }
        //     },
        // };

        let localArgs: Args_CoreOnly_Grid_FilterPage = this.initArgs as Args_CoreOnly_Grid_FilterPage;

        if (!localArgs.filteringDisabled) {
            stateGrid_CustomExcelFilter(this.gridModel); // Every WxGrid gets an Excel filter from now on
            adjustColumnWidthForCustomExcelFilters(this.gridModel.columns as ColumnModel[]);

        } // if


        if (!localArgs.pagingDisabled) {
            Object.assign(this.gridModel, {
                allowPaging: true,
                pageSettings: {
                    pageSizes: [5, 10, 20, 50, 100],
                    pageSize: 10,
                    pageCount: 6,
                },
            } as GridModel);
        }


    } //createGridModel


} // main class