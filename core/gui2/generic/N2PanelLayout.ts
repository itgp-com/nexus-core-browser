import {cssAddClass} from '../../CoreUtils';
import {CssStyle} from '../../gui/AbstractWidget';
import {nexusMain} from '../../NexusMain';
import {N2Basic, StateN2Basic} from '../N2Basic';
import {addN2Class, decoToCssStyle, IHtmlUtils} from '../N2HtmlDecorator';
import {Elem_or_N2} from '../N2Utils';
import {N2Panel, StateN2Panel} from './N2Panel';



export interface StateN2PanelLayout extends StateN2Basic {

    /**
     * State of the internal container that is the parent of any topContainer element given by the user
     */
    stateTopContainer?: StateN2Panel;

    /**
     * Inside the row, and directly above the Grid.
     * The {@link left} component topContainer is the same as this component's topContainer
     */
    top?: Elem_or_N2;

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
     * State of the internal container that is the parent of any rightContainer element given by the user
     */
    stateRightContainer?: StateN2Panel;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_N2;

    /**
     * State of the internal container that is the parent of any bottomContainer element given by the user
     */
    stateBottomContainer?: StateN2Panel;

    /**
     * Inside the row and directly under the Grid.
     *
     * The {@link left} component bottomContainer is the same as this component's bottomContainer
     */
    bottom?: Elem_or_N2;

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
     * If true, the centerContainer component will have <code>overflow='auto'</code>.
     * <p>
     * The CSS property <code>overflow</code> is used to control what happens to content that overflows an element's box.
     * The <code>auto</code> value for the <code>overflow</code> property means that the browser will automatically manage
     * the overflow based on the content and the size of the containing box.
     * </p>
     * <p>
     * Here's what happens with <code>overflow: auto;</code>:
     * <ul>
     *   <li><strong>Content Fits</strong>: If the content fits inside the container, no scrollbars are added, and the content is displayed normally.</li>
     *   <li><strong>Content Overflows</strong>: If the content overflows the container's bounds, scrollbars are added to allow the user to scroll to see the overflowed content.
     *     <ul>
     *       <li><strong>Horizontal Overflow</strong>: If the content overflows horizontally, a horizontal scrollbar is added.</li>
     *       <li><strong>Vertical Overflow</strong>: If the content overflows vertically, a vertical scrollbar is added.</li>
     *     </ul>
     *   </li>
     *   <li><strong>Scrollbars</strong>: The scrollbars themselves may be either visible all the time or only when the user hovers over the content, depending on the browser and operating system settings.</li>
     * </ul>
     * </p>
     * <p>Defaults to true.</p>
     */
    center_overflow_auto?: boolean;
}

export class N2PanelLayout<STATE extends StateN2PanelLayout = StateN2PanelLayout> extends N2Basic<STATE> {

    static readonly CLASS_IDENTIFIER:string = "N2PanelLayout"

    constructor(state ?: STATE) {
        super(state);
    }


    private _topContainer: N2Panel;
    private _leftContainer: N2Panel;
    private _centerContainer: N2Panel;
    private _rightContainer: N2Panel;
    private _bottomContainer: N2Panel;

    get classIdentifier() {
        return N2PanelLayout.CLASS_IDENTIFIER;
    }
    protected onStateInitialized(state: STATE): void {
        addN2Class(state.deco, N2PanelLayout.CLASS_IDENTIFIER);

        if (state.center_overflow_auto == null) {
            state.center_overflow_auto = true;
        }

        let userStyle:CssStyle|string;


        let topState: StateN2Panel = state.stateTopContainer || {};
        IHtmlUtils.initForN2(topState);
        topState.tagId = state.tagId + '_top';
        userStyle = topState?.deco?.style || {};
        topState.deco.style = {
            'background-color': 'transparent',
            ...decoToCssStyle(userStyle),
        };
        addN2Class(topState.deco, CLASS_N2_PANEL_LAYOUT_TOP);
        if (state.top)
            topState.children = [state.top];
        this._topContainer = new N2Panel(topState);


        let leftState: StateN2Panel = state.stateLeftContainer || {};
        IHtmlUtils.initForN2(leftState);
        leftState.tagId = state.tagId + '_left';
        userStyle = leftState?.deco?.style || {};
        leftState.deco.style = {
            'background-color': 'transparent',
            ...decoToCssStyle(userStyle),
        };
        addN2Class(leftState.deco, CLASS_N2_PANEL_LAYOUT_LEFT);
        if (state.left)
            leftState.children = [state.left];
        this._leftContainer = new N2Panel(leftState);

        let centerState: StateN2Panel = state.stateCenterContainer || {};
        IHtmlUtils.initForN2(centerState);
        centerState.tagId = state.tagId + '_center';
        userStyle = centerState?.deco?.style || {};
        centerState.deco.style = {
            'background-color': 'transparent',
            ...decoToCssStyle(userStyle),
        };
        addN2Class(centerState.deco, CLASS_N2_PANEL_LAYOUT_CENTER);
        if (state.center_overflow_auto) {
            centerState.deco.style.overflow = 'auto'; // make it scrollable
        }

        if (state.center)
            centerState.children = [state.center];
        this._centerContainer = new N2Panel(centerState);


        let rightState: StateN2Panel = state.stateRightContainer || {};
        IHtmlUtils.initForN2(rightState);
        rightState.tagId = state.tagId + '_right';
        userStyle = rightState?.deco?.style || {};
        rightState.deco.style = {
            'background-color': 'transparent',
            ...decoToCssStyle(userStyle),
        };
        addN2Class(rightState.deco, CLASS_N2_PANEL_LAYOUT_RIGHT);
        if (state.right)
            rightState.children = [state.right];
        this._rightContainer = new N2Panel(rightState);


        let bottomState: StateN2Panel = state.stateBottomContainer || {};
        IHtmlUtils.initForN2(bottomState);
        bottomState.tagId = state.tagId + '_bottom';
        userStyle = bottomState?.deco?.style || {};
        bottomState.deco.style = {
            'background-color': 'transparent',
            ...decoToCssStyle(userStyle),
        };
        addN2Class(bottomState.deco, CLASS_N2_PANEL_LAYOUT_BOTTOM);
        if (state.bottom)
            bottomState.children = [state.bottom];
        this._bottomContainer = new N2Panel(bottomState);

        state.children = [
            this.topContainer,
            this.leftContainer,
            this.centerContainer,
            this.rightContainer,
            this.bottomContainer,
        ];

        super.onStateInitialized(state);
    }

    public get topContainer(): N2Panel {
        return this._topContainer;
    }

    public get leftContainer(): N2Panel {
        return this._leftContainer;
    }

    public get centerContainer(): N2Panel {
        return this._centerContainer;
    }

    public get rightContainer(): N2Panel {
        return this._rightContainer;
    }

    public get bottomContainer(): N2Panel {
        return this._bottomContainer;
    }
}


export const CLASS_N2_PANEL_LAYOUT_TOP = N2PanelLayout.CLASS_IDENTIFIER + '_top';
export const CLASS_N2_PANEL_LAYOUT_LEFT = N2PanelLayout.CLASS_IDENTIFIER + '_left';
export const CLASS_N2_PANEL_LAYOUT_CENTER = N2PanelLayout.CLASS_IDENTIFIER + '_center';
export const CLASS_N2_PANEL_LAYOUT_RIGHT = N2PanelLayout.CLASS_IDENTIFIER + '_right';
export const CLASS_N2_PANEL_LAYOUT_BOTTOM = N2PanelLayout.CLASS_IDENTIFIER + '_bottom';

nexusMain.UIStartedListeners.add(async () => {
    cssAddClass(N2PanelLayout.CLASS_IDENTIFIER, {
        display: 'grid',
        'grid-template-rows': 'auto 1fr auto',
        'grid-template-columns': 'auto 1fr auto',
        height: '100%',
        width: '100%',
    });


    cssAddClass(CLASS_N2_PANEL_LAYOUT_TOP, {
        'grid-row': '1',
        'grid-column': '1 / span 3',
    });


    cssAddClass(CLASS_N2_PANEL_LAYOUT_LEFT, {
        'grid-row': 2,
        'grid-column': 1,
    });


    cssAddClass(CLASS_N2_PANEL_LAYOUT_CENTER, {
        'grid-row': 2,
        'grid-column': 2,
        // overflow: 'auto',
    });


    cssAddClass(CLASS_N2_PANEL_LAYOUT_RIGHT, {
        'grid-row': 2,
        'grid-column': 3,
    });

    cssAddClass(CLASS_N2_PANEL_LAYOUT_BOTTOM, {
        'grid-row': '3',
        'grid-column': '1 / span 3',
    });

});