import {QueryBuilder, QueryBuilderModel} from "@syncfusion/ej2-querybuilder";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjQueryBuilderRef extends StateNx2EjBasicRef {
    widget?: Nx2EjQueryBuilder;
}

export interface StateNx2EjQueryBuilder<WIDGET_LIBRARY_MODEL extends QueryBuilderModel = QueryBuilderModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjQueryBuilderRef;
}

export class Nx2EjQueryBuilder<STATE extends StateNx2EjQueryBuilder = StateNx2EjQueryBuilder> extends Nx2EjBasic<STATE, QueryBuilder> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjQueryBuilder');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new QueryBuilder(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}