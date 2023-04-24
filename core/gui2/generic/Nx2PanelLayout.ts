import {DialogUtility} from '@syncfusion/ej2-popups';
import {CSS_FLEX_MAX_XY} from "../../CoreCSS";
import {cssAddClass, isDev} from '../../CoreUtils';
import {Nx2} from "../Nx2";
import {Nx2Basic, StateNx2Basic} from "../Nx2Basic";
import {addClassesToElement, addNx2Class, removeClassesFromElement, removeNx2Class} from '../Nx2HtmlDecorator';
import {Elem_or_Nx2, isNx2} from "../Nx2Utils";
import {Nx2Column} from "./Nx2Column";
import {Nx2Panel} from './Nx2Panel';
import {Nx2Row} from "./Nx2Row";

export enum EnumPanelLayout {
    outerTop = 'outerTop',
    outerBottom = 'outerBottom',
    top = 'top',
    left = 'left',
    right = 'right',
    bottom = 'bottom',
    center = 'center',
}

const NX2PANELLAYOUT_FLEX_COLUMN_FULL: string = 'nx2PanelLayout_flex_column_full'
cssAddClass(NX2PANELLAYOUT_FLEX_COLUMN_FULL, {
    display: 'flex',
    'flex-direction': 'column',
    height: '100%',
});

const NX2PANELLAYOUT_REMAIN_FIXED: string = 'nx2PanelLayout_remain_fixed'
cssAddClass(NX2PANELLAYOUT_REMAIN_FIXED, {
    flex: '0 0 auto',
});
const NX2PANELLAYOUT_GROW_XY: string = 'nx2PanelLayout_grow_xy'
cssAddClass(NX2PANELLAYOUT_GROW_XY, {
    flex: '1 1 auto',
});

const NX2PANELLAYOUT_OVERFLOW: string = 'nx2PanelLayout_overflow'
cssAddClass(NX2PANELLAYOUT_GROW_XY, {
    overflow: 'auto'
});


export interface StateNx2PanelLayout extends StateNx2Basic {

    outerTop?: Elem_or_Nx2;
    outerBottom?: Elem_or_Nx2;
    /**
     * Inside the row, and directly above the Grid.
     * The {@link left} component top is the same as this component's top
     */
    top?: Elem_or_Nx2;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    left?: Elem_or_Nx2;


    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_Nx2;

    /**
     * Inside the row and directly under the Grid.
     *
     * The {@link left} component bottom is the same as this component's bottom
     */
    bottom?: Elem_or_Nx2;

    /**
     * Center component.
     * Inside the row, and bordered by {@link top}, {@link bottom}, {@link left}, {@link right} components
     */
    center?: Elem_or_Nx2;
}


export class Nx2PanelLayout<STATE extends StateNx2PanelLayout = StateNx2PanelLayout> extends Nx2Basic<STATE> {


    protected _outerTopElem: HTMLElement;
    protected _outerBottomElem: HTMLElement;
    protected _topElem: HTMLElement;
    protected _leftElem: HTMLElement;
    protected _rightElem: HTMLElement;
    protected _bottomElem: HTMLElement;
    protected _centerElem: HTMLElement;


    constructor(state: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2PanelLayout');
    }

    private _innerColumn: Nx2;

    /**
     * Defaults to an instance of Nx2Column.
     *
     * Contains ${top}, ${center} and ${bottom} components
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.column before calling super
     */
    get innerColumn(): Nx2 {
        if (!this._innerColumn)
            this._innerColumn = new Nx2Column({
                deco: {
                    classes: [CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
                }
            }) // can be overwritten by extending class in its _initialSetup(state) by setting column before calling super

        return this._innerColumn;
    }

    /**
     * Be very careful if overwriting this component so you don't loose access to its original children.
     *
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.column before calling super
     */
    set innerColumn(value: Nx2) {
        this._innerColumn = value;
    }

    private _outerColumn: Nx2;

    /**
     * Defaults to an instance of Nx2Column.
     *
     * Composed of ${outerTop}, ${outerCenter} and ${outerBottom}
     *
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.outerColumn before calling super
     */
    get outerColumn(): Nx2 {
        if (!this._outerColumn)
            this._outerColumn = new Nx2Column({
                deco: {
                    classes: [CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
                }
            }) // can be overwritten by extending class in its _initialSetup(state) by setting outerColumn before calling super
        return this._outerColumn;
    }

    /**
     * Be very careful if overwriting this component so you don't loose access to its original children.
     *
     * Best set in <code>protected _initialSetup(state: STATE)</code> before calling <code>super._initialSetup(state);</code>
     * If set at any other time, please be careful to transfer the content of the existing component
     * @param value
     */
    set outerColumn(value: Nx2) {
        this._outerColumn = value;
    }

    private _outerCenter: Nx2;

    /**
     * Defaults to an instance of Nx2Row.
     *
     * Contains ${left}, ${innerColumn} (composed of ${top}, ${center} and ${bottom}), and ${right} components
     *
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.innerRow before calling super
     */
    get outerCenter(): Nx2 {
        if (!this._outerCenter)
            this._outerCenter = new Nx2Row({
                deco: {
                    classes: [CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
                }
            }); // can be overwritten by extending class in its _initialSetup(state) by setting row before calling super
        return this._outerCenter;
    }

    /**
     * Sets the inner row component to use.
     * Best set in <code>protected _initialSetup(state: STATE)</code> before calling <code>super._initialSetup(state);</code>
     * If set at any other time, please be careful to transfer the content of the existing component
     * @param value
     */
    set outerCenter(value: Nx2) {
        this._outerCenter = value;
    }


    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get top(): Elem_or_Nx2 {
        return this.state.top;
    }

    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get left(): Elem_or_Nx2 {
        return this.state.left;
    }

    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get right(): Elem_or_Nx2 {
        return this.state.right;
    }

    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get bottom(): Elem_or_Nx2 {
        return this.state.bottom;
    }

    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get center(): Elem_or_Nx2 {
        return this.state.center;
    }

    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get outerTop(): Elem_or_Nx2 {
        return this.state.outerTop;
    }

    /**
     * Return HtmlElem or Nx2 component
     * @return {Elem_or_Nx2}  HtmlElem or Nx2
     */
    get outerBottom(): Elem_or_Nx2 {
        return this.state.outerBottom;
    }


    //----------------------

    private _isDevCircularReferenceShown = false;

    private _checkCreateMissingNx2(nx2: Nx2): Nx2 {
        let f = (nx2 as any).isNx2PanelLayout

        if (f && (typeof f === 'function')) {
            // this function exists
            let isNx2PanelLayout = false;
            try {
                let _x = (nx2 as any).isNx2PanelLayout();
                if (typeof _x === 'boolean' && _x === true)
                    isNx2PanelLayout = true;

                if (isNx2PanelLayout) {
                    console.error("Nx2PanelLayout: Circular reference detected. Overwriting with a new instance of a basic panel. Overwritten instance :", nx2)
                    if (isDev() && !this._isDevCircularReferenceShown) {

                        this._isDevCircularReferenceShown = true;
                        setTimeout(() => {
                                DialogUtility.alert({
                                    title: 'Nx2PanelLayout: Circular reference detected.',
                                    content: '<p>Nx2PanelLayout: Circular reference detected. Overwriting with a new instance of a basic panel!!!<p>See console for details.<p>',
                                    width: 'min(80%, 500px)',
                                    height: 'min(80%, 300px)',
                                    isModal: true,
                                });
                            },
                            500);
                    }

                    return new Nx2Panel(); // overwrite with a new instance of a basic panel so we don't get a circular reference
                }
                // if it did not return true, than it could be something completely diffferent, so we just return the same instance
            } catch (_e) {
                // ignore
            }
        } // if (f && (typeof f === 'function'))
        return nx2; // all good, return the same instance
    } // _checkCreateMissingNx2

    protected onStateInitialized(state: STATE) {


        let innerColumn = this.innerColumn;
        let innerColumnElem: HTMLElement = innerColumn.htmlElement;


        if (!state.top)
            state.top = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.top));
        innerColumnElem.appendChild(this.createElement(state.top, EnumPanelLayout.top));


        if (!state.center)
            state.center = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.center));
        innerColumnElem.appendChild(this.createElement(state.center, EnumPanelLayout.center))


        if (!state.bottom)
            state.bottom = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.bottom));
        innerColumnElem.appendChild(this.createElement(state.bottom, EnumPanelLayout.bottom));


        let outerCenterRow = this.outerCenter;
        let outerCenterRowElem: HTMLElement = outerCenterRow.htmlElement;

        if (!state.left)
            state.left = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.left));
        outerCenterRowElem.appendChild(this.createElement(state.left, EnumPanelLayout.left))

        outerCenterRowElem.appendChild(innerColumnElem);

        if (!state.right)
            state.right = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.right));
        outerCenterRowElem.appendChild(this.createElement(state.right, EnumPanelLayout.right))


        let outerColumn = this.outerColumn;
        let outerColumnElem: HTMLElement = outerColumn.htmlElement;

        if (!state.outerTop)
            state.outerTop = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.outerTop));
        outerColumnElem.appendChild(this.createElement(state.outerTop, EnumPanelLayout.outerTop));

        outerColumnElem.appendChild(outerCenterRowElem);

        if (!state.outerBottom)
            state.outerBottom = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.outerBottom));
        outerColumnElem.appendChild(this.createElement(state.outerBottom, EnumPanelLayout.outerBottom));


        if (isDev()) {
            if (state.children) {

                console.error('Nx2PanelLayout state.children has been set, but will be overwritten. Value to be overwritten is: ', state.children);

                setTimeout(() => {
                        DialogUtility.alert({
                            title: 'Nx2PanelLayout state children set and overwritten',
                            content: '<p>State.children has been set but will be overwritten!!!<p>See console for details.<p>',
                            width: 'min(80%, 500px)',
                            height: 'min(80%, 300px)',
                            isModal: true,
                        });
                    },
                    500);

            } // if state.children
        } // if isDev()

        state.children = [outerColumn];

        super.onStateInitialized(state);

    }

    /**
     * Override this to create a different Nx2 for a missing position
     * PLEASE ENSURE THAT THE RETURNED COMPONENT IS NOT ONE THAT EXTENDS Nx2PanelLayout or you will have an infinite loop
     * @param {EnumPanelLayout} position
     * @return {Nx2}
     */
    createPlaceholderPanel(position: EnumPanelLayout): Nx2 {
        return new Nx2Panel({
            tagId: this.state.tagId + '_' + position,
        });
    }

    createElement(mix: Elem_or_Nx2, position: EnumPanelLayout): HTMLElement {
        if (!mix)
            return null;
        let x = mix;
        let elem: HTMLElement;
        if (x instanceof HTMLElement) {
            elem = x
        } else if (isNx2(x)) {
            // Nx2
            x.initLogic();
            elem = x.htmlElement;
        }

        switch (position) {
            case EnumPanelLayout.top:
                this._topElem = elem;
                break;
            case EnumPanelLayout.left:
                this._leftElem = elem;
                break;
            case EnumPanelLayout.right:
                this._rightElem = elem;
                break;
            case EnumPanelLayout.bottom:
                this._bottomElem = elem;
                break;
            case EnumPanelLayout.center:
                this._centerElem = elem;
                break;
            case EnumPanelLayout.outerTop:
                this._outerTopElem = elem;
                break;
            case EnumPanelLayout.outerBottom:
                this._outerBottomElem = elem;
                break;
        }
        return elem;
    }

    stateToHTMLElement(position: EnumPanelLayout): HTMLElement {
        console.error("There is no implementation for stateToHTMLElement in Nx2PanelLayout for position: " + position);
        return null;
    }

    /**
     * Confirms that this component is a Nx2PanelLayout
     * @return {boolean} true
     */
    isNx2PanelLayout(): boolean {
        return true;
    }


    //------------------- behavior_centerScrollsAndExpands -------------------

    private _behavior_centerScrollsAndExpands: boolean;

    /**
     * Gets a boolean value indicating whether the center panel should scroll and expand to fill remaining space.
     * @returns {boolean} The value indicating whether the center panel should scroll and expand.
     */
    public get behavior_centerScrollsAndExpands(): boolean {
        return this._behavior_centerScrollsAndExpands;
    }

    /**
     * Sets a boolean value indicating whether the center panel should scroll and expand to fill remaining space.
     * If the value is true, the top, bottom, left, and right panels will have a fixed size and the center panel will scroll and expand.
     * If the value is false, the top, bottom, left, and right panels will be flexible and the center panel will not scroll or expand.
     * @param {boolean} enable - The value indicating whether the center panel should scroll and expand.
     * @returns {void}
     */
    public set behavior_centerScrollsAndExpands(enable: boolean) {

        if ( enable === this._behavior_centerScrollsAndExpands)
            return; // nothing to change

        if (enable) {
            addNx2Class(this.outerCenter.state.deco, NX2PANELLAYOUT_FLEX_COLUMN_FULL);

            if (isNx2(this.top))
                addNx2Class(this.top.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                addClassesToElement(this.top, NX2PANELLAYOUT_REMAIN_FIXED);


            if (isNx2(this.left))
                addNx2Class(this.left.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                addClassesToElement(this.left, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.right))
                addNx2Class(this.right.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                addClassesToElement(this.right, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.bottom))
                addNx2Class(this.bottom.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                addClassesToElement(this.bottom, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.outerTop))
                addNx2Class(this.outerTop.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                addClassesToElement(this.outerTop, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.outerBottom))
                addNx2Class(this.outerBottom.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                addClassesToElement(this.outerBottom, NX2PANELLAYOUT_REMAIN_FIXED);

        } else {
            removeNx2Class(this.outerCenter.state.deco, NX2PANELLAYOUT_FLEX_COLUMN_FULL);

            if (isNx2(this.top))
                removeNx2Class(this.top.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                removeClassesFromElement(this.top, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.left))
                removeNx2Class(this.left.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                removeClassesFromElement(this.left, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.right))
                removeNx2Class(this.right.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                removeClassesFromElement(this.right, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.bottom))
                removeNx2Class(this.bottom.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                removeClassesFromElement(this.bottom, NX2PANELLAYOUT_REMAIN_FIXED);

            if (isNx2(this.outerTop))
                removeNx2Class(this.outerTop.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                removeClassesFromElement(this.outerTop, NX2PANELLAYOUT_REMAIN_FIXED);


            if (isNx2(this.outerBottom))
                removeNx2Class(this.outerBottom.state.deco, NX2PANELLAYOUT_REMAIN_FIXED);
            else
                removeClassesFromElement(this.outerBottom, NX2PANELLAYOUT_REMAIN_FIXED);

        }


        this._behavior_centerScrollsAndExpands = enable;


    }
} // main class