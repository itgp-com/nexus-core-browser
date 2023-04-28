import {Query} from '@syncfusion/ej2-data';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {Grid, GridModel} from "@syncfusion/ej2-grids";
import {Data} from '@syncfusion/ej2-grids/src/grid/actions/data';


export interface StateNx2EjGridRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjGrid;
}

export interface StateNx2EjGrid<WIDGET_LIBRARY_MODEL extends GridModel = GridModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjGridRef;
}

export class Nx2EjGrid<STATE extends StateNx2EjGrid = StateNx2EjGrid> extends Nx2EjBasic<STATE,Grid> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjGrid');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Grid(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

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
}