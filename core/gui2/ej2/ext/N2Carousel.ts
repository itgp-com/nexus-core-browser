import {Carousel, CarouselModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2CarouselRef extends StateN2EjBasicRef {
    widget?: N2Carousel;
}

export interface StateN2Carousel<WIDGET_LIBRARY_MODEL extends CarouselModel = CarouselModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2CarouselRef;
}

export class N2Carousel<STATE extends StateN2Carousel = StateN2Carousel> extends N2EjBasic<STATE, Carousel> {
    static readonly CLASS_IDENTIFIER: string = 'N2Carousel'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Carousel.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new Carousel(this.state.ej);
    }

    get classIdentifier() {
        return N2Carousel.CLASS_IDENTIFIER;
    }

}