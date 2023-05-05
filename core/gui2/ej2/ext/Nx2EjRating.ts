import {Rating, RatingModel} from "@syncfusion/ej2-inputs";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjRatingRef extends StateNx2EjBasicRef {
    widget?: Nx2EjRating;
}

export interface StateNx2EjRating extends StateNx2EjBasic<RatingModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjRatingRef;
} // state class

export class Nx2EjRating<STATE extends StateNx2EjRating = StateNx2EjRating> extends Nx2EjBasic<STATE, Rating> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjRating');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Rating(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class