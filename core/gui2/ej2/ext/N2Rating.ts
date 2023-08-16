import {Rating, RatingModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2RatingRef extends StateNx2EjBasicRef {
    widget?: N2Rating;
}

export interface StateN2Rating extends StateNx2EjBasic<RatingModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2RatingRef;
} // state class

export class N2Rating<STATE extends StateN2Rating = StateN2Rating> extends Nx2EjBasic<STATE, Rating> {
    static readonly CLASS_IDENTIFIER: string = "N2Rating";
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Rating.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Rating(this.state.ej);
    }

    get classIdentifier(): string { return N2Rating.CLASS_IDENTIFIER; }

} // main class