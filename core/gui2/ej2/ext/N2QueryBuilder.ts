import {QueryBuilder, QueryBuilderModel} from '@syncfusion/ej2-querybuilder';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2QueryBuilderRef extends StateN2EjBasicRef {
    widget?: N2QueryBuilder;
}

export interface StateN2QueryBuilder<WIDGET_LIBRARY_MODEL extends QueryBuilderModel = QueryBuilderModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2QueryBuilderRef;
}

export class N2QueryBuilder<STATE extends StateN2QueryBuilder = StateN2QueryBuilder> extends N2EjBasic<STATE, QueryBuilder> {
    static readonly CLASS_IDENTIFIER: string = 'N2QueryBuilder';
    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2QueryBuilder.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new QueryBuilder(this.state.ej);
    }

    get classIdentifier(): string { return N2QueryBuilder.CLASS_IDENTIFIER; }

}