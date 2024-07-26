import {Carousel, CarouselModel} from '@syncfusion/ej2-navigations';

import {cssAddSelector} from '../../../CssUtils';
import {addN2Class} from '../../N2HtmlDecorator';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
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

} // class N2Carousel


themeChangeListeners().add((ev: ThemeChangeEvent) => {

    cssAddSelector(`.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-navigators .e-previous .e-btn:not(:disabled) .e-btn-icon,
.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-navigators .e-next .e-btn:not(:disabled) .e-btn-icon,
.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-navigators .e-play-pause .e-btn:not(:disabled) .e-btn-icon`,`
  color: black;`);

    cssAddSelector(`.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-navigators .e-previous .e-btn:not(:disabled),
.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-navigators .e-next .e-btn:not(:disabled),
.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-navigators .e-play-pause .e-btn:not(:disabled)`,`
  background-color: rgb(200, 200, 200, 0.30); // 30% opaque by default
`);

    /**
     Non-active round indicators under the carousel
     */
    cssAddSelector(`.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-indicators .e-indicator-bar:not([class*="e-active"]) .e-indicator div`,`
      background-color: rgba(200, 200, 200, 0.90);
      border: 1px solid rgba(0, 0, 0, 0.2);
    `);

    cssAddSelector(`.${N2Carousel.CLASS_IDENTIFIER}.e-carousel .e-carousel-indicators`,`
  min-height: 24px;    
    `);
}); // normal priority