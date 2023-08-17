import {N2Basic, StateN2Basic, StateN2BasicRef} from '../N2Basic';
import {addN2Class, IHtmlUtils} from '../N2HtmlDecorator';
import {Elem_or_N2} from '../N2Utils';
import {N2Panel, StateN2Panel} from './N2Panel';
import {
    CLASS_N2_PANEL_LAYOUT_CENTER,
    CLASS_N2_PANEL_LAYOUT_LEFT,
    CLASS_N2_PANEL_LAYOUT_RIGHT
} from './N2PanelLayout';


export interface StateN2Panel_LCRRef extends StateN2BasicRef {
    widget ?: N2Panel_LCR<StateN2Panel_LCR>;
}

export interface StateN2Panel_LCR extends StateN2Basic {

    /**
     * State of the internal container that is the parent of any leftContainer element given by the user
     */
    stateLeftContainer?: StateN2Panel;
    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    left?: Elem_or_N2;



    /**
     * State of the internal container that is the parent of any centerContainer element given by the user
     */
    stateCenterContainer?: StateN2Panel;

    /**
     * Center component.
     * Inside the row, and bordered by {@link top}, {@link bottom}, {@link left}, {@link right} components
     */
    center?: Elem_or_N2;


    /**
     * State of the internal container that is the parent of any rightContainer element given by the user
     */
    stateRightContainer?: StateN2Panel;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_N2;


    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateN2Panel_LCRRef;
}
export class N2Panel_LCR<STATE extends StateN2Panel_LCR = StateN2Panel_LCR> extends N2Basic<STATE> {

    _leftContainer: N2Panel;
    _centerContainer:N2Panel;
    _rightContainer:N2Panel;

    constructor(state: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE): void {

        let style = state.deco.style || {};
        style = {
            display: 'flex',
            'flex-direction': 'row',
            'justify-content': 'space-between',
            ...style
        }
        state.deco.style = style;


        let leftState: StateN2Panel = state.stateLeftContainer || {};
        IHtmlUtils.initForN2(leftState);

        leftState.deco.style = {
            'min-width': '0',
        }
        leftState.tagId = state.tagId + '_left';
        addN2Class(leftState.deco, CLASS_N2_PANEL_LAYOUT_LEFT);
        if (state.left)
            leftState.children = [state.left];
        this._leftContainer = new N2Panel(leftState);



        let centerState: StateN2Panel = state.stateCenterContainer || {};
        IHtmlUtils.initForN2(centerState);
        centerState.deco.style = {
            flex: 1, // expand to take all available space
            'min-width': '0',
        }
        centerState.tagId = state.tagId + '_center';
        addN2Class(centerState.deco, CLASS_N2_PANEL_LAYOUT_CENTER);
        if (state.center)
            centerState.children = [state.center];
        this._centerContainer = new N2Panel(centerState);


        let rightState: StateN2Panel = state.stateRightContainer || {};
        IHtmlUtils.initForN2(rightState);
        rightState.deco.style = {
            'min-width' : '0',
        }
        rightState.tagId = state.tagId + '_right';
        addN2Class(rightState.deco, CLASS_N2_PANEL_LAYOUT_RIGHT);
        if (state.right)
            rightState.children = [state.right];
        this._rightContainer = new N2Panel(rightState);
        state.children = [this._leftContainer, this._centerContainer, this._rightContainer];

        super.onStateInitialized(state);
    }
}