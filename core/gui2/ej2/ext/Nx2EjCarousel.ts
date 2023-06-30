import {Carousel, CarouselModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjCarouselRef extends StateNx2EjBasicRef {
    widget?: Nx2EjCarousel;
}

export interface StateNx2EjCarousel<WIDGET_LIBRARY_MODEL extends CarouselModel = CarouselModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjCarouselRef;
}

export class Nx2EjCarousel<STATE extends StateNx2EjCarousel = StateNx2EjCarousel> extends Nx2EjBasic<STATE, Carousel> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjCarousel');
    }

    protected createEjObj(): void {
        this.obj = new Carousel(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}