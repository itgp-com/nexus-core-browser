import {cssAddClass} from '../../CoreUtils';
import {nexusMain} from '../../NexusMain';
import {Nx2Basic, StateNx2Basic} from '../Nx2Basic';
import {addNx2Class, IHtmlUtils} from '../Nx2HtmlDecorator';
import {Elem_or_Nx2} from '../Nx2Utils';
import {Nx2Panel, StateNx2Panel} from './Nx2Panel';



export interface StateN2PanelLayout extends StateNx2Basic {

    /**
     * State of the internal container that is the parent of any topContainer element given by the user
     */
    stateTopContainer?: StateNx2Panel;

    /**
     * Inside the row, and directly above the Grid.
     * The {@link left} component topContainer is the same as this component's topContainer
     */
    top?: Elem_or_Nx2;

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
     * State of the internal container that is the parent of any rightContainer element given by the user
     */
    stateRightContainer?: StateNx2Panel;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_Nx2;

    /**
     * State of the internal container that is the parent of any bottomContainer element given by the user
     */
    stateBottomContainer?: StateNx2Panel;

    /**
     * Inside the row and directly under the Grid.
     *
     * The {@link left} component bottomContainer is the same as this component's bottomContainer
     */
    bottom?: Elem_or_Nx2;

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
     * If true, the centerContainer component will be scrollable
     * Defaults to true
     */
    centerScrollable?: boolean;
}

export class N2PanelLayout<STATE extends StateN2PanelLayout = StateN2PanelLayout> extends Nx2Basic<STATE> {

    static readonly CLASS_IDENTIFIER:string = "N2PanelLayout"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2PanelLayout.CLASS_IDENTIFIER);
    }


    private _topContainer: Nx2Panel;
    private _leftContainer: Nx2Panel;
    private _centerContainer: Nx2Panel;
    private _rightContainer: Nx2Panel;
    private _bottomContainer: Nx2Panel;

    get classIdentifier() {
        return N2PanelLayout.CLASS_IDENTIFIER;
    }
    protected onStateInitialized(state: STATE): void {

        if (state.centerScrollable == null) {
            state.centerScrollable = true;
        }




        let topState: StateNx2Panel = state.stateTopContainer || {};
        IHtmlUtils.initForNx2(topState);
        topState.tagId = state.tagId + '_top';
        addNx2Class(topState.deco, CLASS_NX2_PANEL_LAYOUT_TOP);
        if (state.top)
            topState.children = [state.top];
        this._topContainer = new Nx2Panel(topState);


        let leftState: StateNx2Panel = state.stateLeftContainer || {};
        IHtmlUtils.initForNx2(leftState);
        leftState.tagId = state.tagId + '_left';
        addNx2Class(leftState.deco, CLASS_NX2_PANEL_LAYOUT_LEFT);
        if (state.left)
            leftState.children = [state.left];
        this._leftContainer = new Nx2Panel(leftState);

        let centerState: StateNx2Panel = state.stateCenterContainer || {};
        IHtmlUtils.initForNx2(centerState);
        centerState.tagId = state.tagId + '_center';
        addNx2Class(centerState.deco, CLASS_NX2_PANEL_LAYOUT_CENTER);
        if (state.centerScrollable) {
            centerState.deco.style.overflow = 'auto'; // make it scrollable
        }

        if (state.center)
            centerState.children = [state.center];
        this._centerContainer = new Nx2Panel(centerState);


        let rightState: StateNx2Panel = state.stateRightContainer || {};
        IHtmlUtils.initForNx2(rightState);
        rightState.tagId = state.tagId + '_right';
        addNx2Class(rightState.deco, CLASS_NX2_PANEL_LAYOUT_RIGHT);
        if (state.right)
            rightState.children = [state.right];
        this._rightContainer = new Nx2Panel(rightState);


        let bottomState: StateNx2Panel = state.stateBottomContainer || {};
        IHtmlUtils.initForNx2(bottomState);
        bottomState.tagId = state.tagId + '_bottom';
        addNx2Class(bottomState.deco, CLASS_NX2_PANEL_LAYOUT_BOTTOM);
        if (state.bottom)
            bottomState.children = [state.bottom];
        this._bottomContainer = new Nx2Panel(bottomState);

        state.children = [
            this.topContainer,
            this.leftContainer,
            this.centerContainer,
            this.rightContainer,
            this.bottomContainer,
        ];

        super.onStateInitialized(state);
    }

    public get topContainer(): Nx2Panel {
        return this._topContainer;
    }

    public get leftContainer(): Nx2Panel {
        return this._leftContainer;
    }

    public get centerContainer(): Nx2Panel {
        return this._centerContainer;
    }

    public get rightContainer(): Nx2Panel {
        return this._rightContainer;
    }

    public get bottomContainer(): Nx2Panel {
        return this._bottomContainer;
    }
}


export const CLASS_NX2_PANEL_LAYOUT_TOP = N2PanelLayout.CLASS_IDENTIFIER + '_top';
export const CLASS_NX2_PANEL_LAYOUT_LEFT = N2PanelLayout.CLASS_IDENTIFIER + '_left';
export const CLASS_NX2_PANEL_LAYOUT_CENTER = N2PanelLayout.CLASS_IDENTIFIER + '_center';
export const CLASS_NX2_PANEL_LAYOUT_RIGHT = N2PanelLayout.CLASS_IDENTIFIER + '_right';
export const CLASS_NX2_PANEL_LAYOUT_BOTTOM = N2PanelLayout.CLASS_IDENTIFIER + '_bottom';

nexusMain.UIStartedListeners.add(async () => {
    cssAddClass(N2PanelLayout.CLASS_IDENTIFIER, {
        display: 'grid',
        'grid-template-rows': 'auto 1fr auto',
        'grid-template-columns': 'auto 1fr auto',
        height: '100%',
        width: '100%',
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_TOP, {
        'grid-row': '1',
        'grid-column': '1 / span 3',
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_LEFT, {
        'grid-row': 2,
        'grid-column': 1,
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_CENTER, {
        'grid-row': 2,
        'grid-column': 2,
        // overflow: 'auto',
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_RIGHT, {
        'grid-row': 2,
        'grid-column': 3,
    });

    cssAddClass(CLASS_NX2_PANEL_LAYOUT_BOTTOM, {
        'grid-row': '3',
        'grid-column': '1 / span 3',
    });

});