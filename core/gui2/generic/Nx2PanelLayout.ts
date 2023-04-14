import {DialogUtility} from '@syncfusion/ej2-popups';
import {CSS_FLEX_MAX_XY} from "../../CoreCSS";
import {isDev} from '../../CoreUtils';
import {Nx2} from "../Nx2";
import {Nx2Basic, StateNx2Basic} from "../Nx2Basic";
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
    }

    private _column: Nx2;

    /**
     * Defaults to an instance of Nx2Column.
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.column before calling super
     */
    get column(): Nx2 {
        if (!this._column)
            this._column = new Nx2Column({
                deco: {
                    classes: [CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
                }
            }) // can be overwritten by extending class in its _initialSetup(state) by setting column before calling super

        return this._column;
    }

    /**
     * Defaults to an instance of Nx2Column.
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.column before calling super
     */
    set column(value: Nx2) {
        this._column = value;
    }

    private _outerColumn: Nx2;

    /**
     * Defaults to an instance of Nx2Column.
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
     * Sets the outer column component to use.
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


        let innerColumn = this.column;
        let columnElem: HTMLElement = innerColumn.htmlElement;


        if (!state.top)
            state.top = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.top));
        columnElem.appendChild(this.createElement(state.top, EnumPanelLayout.top));


        if (!state.center)
            state.center = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.center));
        columnElem.appendChild(this.createElement(state.center, EnumPanelLayout.center))


        if (!state.bottom)
            state.bottom = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.bottom));
        columnElem.appendChild(this.createElement(state.bottom, EnumPanelLayout.bottom));


        let outerCenterRow = this.outerCenter;
        let outerCenterRowElem: HTMLElement = outerCenterRow.htmlElement;

        if (!state.left)
            state.left = this._checkCreateMissingNx2(this.createPlaceholderPanel(EnumPanelLayout.left));
        outerCenterRowElem.appendChild(this.createElement(state.left, EnumPanelLayout.left))

        outerCenterRowElem.appendChild(columnElem);

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

} // main class