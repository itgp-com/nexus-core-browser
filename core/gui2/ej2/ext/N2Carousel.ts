import {Carousel, CarouselModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2CarouselRef extends StateNx2EjBasicRef {
    widget?: N2Carousel;
}

export interface StateN2Carousel<WIDGET_LIBRARY_MODEL extends CarouselModel = CarouselModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2CarouselRef;
}

export class N2Carousel<STATE extends StateN2Carousel = StateN2Carousel> extends Nx2EjBasic<STATE, Carousel> {
    static readonly CLASS_IDENTIFIER: string = "N2Carousel"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Carousel.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Carousel(this.state.ej);
    }

    get classIdentifier() {
        return N2Carousel.CLASS_IDENTIFIER;
    }

}