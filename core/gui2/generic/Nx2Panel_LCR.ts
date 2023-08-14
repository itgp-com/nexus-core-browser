import {Nx2Basic, StateNx2Basic, StateNx2BasicRef} from '../Nx2Basic';
import {addNx2Class, IHtmlUtils} from '../Nx2HtmlDecorator';
import {Elem_or_Nx2} from '../Nx2Utils';
import {Nx2Panel, StateNx2Panel} from './Nx2Panel';
import {
    CLASS_NX2_PANEL_LAYOUT_CENTER,
    CLASS_NX2_PANEL_LAYOUT_LEFT,
    CLASS_NX2_PANEL_LAYOUT_RIGHT
} from './N2PanelLayout';


export interface StateNx2Panel_LCRRef extends StateNx2BasicRef {
    widget ?: Nx2Panel_LCR<StateNx2Panel_LCR>;
}

export interface StateNx2Panel_LCR extends StateNx2Basic {

    /**
     * State of the internal container that is the parent of any leftContainer element given by the user
     */
    stateLeftContainer?: StateNx2Panel;
    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    left?: Elem_or_Nx2;



    /**
     * State of the internal container that is the parent of any centerContainer element given by the user
     */
    stateCenterContainer?: StateNx2Panel;

    /**
     * Center component.
     * Inside the row, and bordered by {@link top}, {@link bottom}, {@link left}, {@link right} components
     */
    center?: Elem_or_Nx2;


    /**
     * State of the internal container that is the parent of any rightContainer element given by the user
     */
    stateRightContainer?: StateNx2Panel;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_Nx2;


    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2Panel_LCRRef;
}
export class Nx2Panel_LCR<STATE extends StateNx2Panel_LCR = StateNx2Panel_LCR> extends Nx2Basic<STATE> {

    _leftContainer: Nx2Panel;
    _centerContainer:Nx2Panel;
    _rightContainer:Nx2Panel;

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


        let leftState: StateNx2Panel = state.stateLeftContainer || {};
        IHtmlUtils.initForNx2(leftState);

        leftState.deco.style = {
            'min-width': '0',
        }
        leftState.tagId = state.tagId + '_left';
        addNx2Class(leftState.deco, CLASS_NX2_PANEL_LAYOUT_LEFT);
        if (state.left)
            leftState.children = [state.left];
        this._leftContainer = new Nx2Panel(leftState);



        let centerState: StateNx2Panel = state.stateCenterContainer || {};
        IHtmlUtils.initForNx2(centerState);
        centerState.deco.style = {
            flex: 1, // expand to take all available space
            'min-width': '0',
        }
        centerState.tagId = state.tagId + '_center';
        addNx2Class(centerState.deco, CLASS_NX2_PANEL_LAYOUT_CENTER);
        if (state.center)
            centerState.children = [state.center];
        this._centerContainer = new Nx2Panel(centerState);


        let rightState: StateNx2Panel = state.stateRightContainer || {};
        IHtmlUtils.initForNx2(rightState);
        rightState.deco.style = {
            'min-width' : '0',
        }
        rightState.tagId = state.tagId + '_right';
        addNx2Class(rightState.deco, CLASS_NX2_PANEL_LAYOUT_RIGHT);
        if (state.right)
            rightState.children = [state.right];
        this._rightContainer = new Nx2Panel(rightState);
        state.children = [this._leftContainer, this._centerContainer, this._rightContainer];

        super.onStateInitialized(state);
    }
}