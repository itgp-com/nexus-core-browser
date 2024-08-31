import {DialogUtility} from '@syncfusion/ej2-popups';
import {isDev} from '../../CoreUtils';
import {N2} from "../N2";
import {N2Basic, StateN2Basic} from "../N2Basic";
import {addN2Class} from '../N2HtmlDecorator';
import {Elem_or_N2, isN2} from "../N2Utils";
import {CSS_FLEX_MAX_XY} from "../scss/core";
import {N2Column} from "./N2Column";
import {N2Panel} from './N2Panel';
import {EnumPanelLayout} from './N2PanelLayout';
import {N2Row} from "./N2Row";


interface StateN2PanelLayoutFlex extends StateN2Basic {

    outerTop?: Elem_or_N2;
    outerBottom?: Elem_or_N2;
    /**
     * Inside the row, and directly above the Grid.
     * The {@link left} component topContainer is the same as this component's topContainer
     */
    top?: Elem_or_N2;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    left?: Elem_or_N2;


    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_N2;

    /**
     * Inside the row and directly under the Grid.
     *
     * The {@link left} component bottomContainer is the same as this component's bottomContainer
     */
    bottom?: Elem_or_N2;

    /**
     * Center component.
     * Inside the row, and bordered by {@link top}, {@link bottom}, {@link left}, {@link right} components
     */
    center?: Elem_or_N2;
}


class N2PanelLayoutFlex<STATE extends StateN2PanelLayoutFlex = StateN2PanelLayoutFlex> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER:string = "N2PanelLayoutFlex"

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

    protected onStateInitialized(state: STATE) {

        addN2Class(state.deco,  N2PanelLayoutFlex.CLASS_IDENTIFIER);

        let innerColumn = this.innerColumn;
        let innerColumnElem: HTMLElement = innerColumn.htmlElement;


        if (!state.top)
            state.top = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.top));
        innerColumnElem.appendChild(this.createElement(state.top, EnumPanelLayout.top));


        if (!state.center)
            state.center = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.center));
        innerColumnElem.appendChild(this.createElement(state.center, EnumPanelLayout.center))


        if (!state.bottom)
            state.bottom = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.bottom));
        innerColumnElem.appendChild(this.createElement(state.bottom, EnumPanelLayout.bottom));


        let outerCenterRow = this.outerCenter;
        let outerCenterRowElem: HTMLElement = outerCenterRow.htmlElement;

        if (!state.left)
            state.left = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.left));
        outerCenterRowElem.appendChild(this.createElement(state.left, EnumPanelLayout.left))

        outerCenterRowElem.appendChild(innerColumnElem);

        if (!state.right)
            state.right = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.right));
        outerCenterRowElem.appendChild(this.createElement(state.right, EnumPanelLayout.right))


        let outerColumn = this.outerColumn;
        let outerColumnElem: HTMLElement = outerColumn.htmlElement;

        if (!state.outerTop)
            state.outerTop = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.outerTop));
        outerColumnElem.appendChild(this.createElement(state.outerTop, EnumPanelLayout.outerTop));

        outerColumnElem.appendChild(outerCenterRowElem);

        if (!state.outerBottom)
            state.outerBottom = this._checkCreateMissingN2(this.createPlaceholderPanel(EnumPanelLayout.outerBottom));
        outerColumnElem.appendChild(this.createElement(state.outerBottom, EnumPanelLayout.outerBottom));


        if (isDev()) {
            if (state.children) {

                console.error('N2PanelLayoutFlex state.children has been set, but will be overwritten. Value to be overwritten is: ', state.children);

                setTimeout(() => {
                        DialogUtility.alert({
                            title: 'N2PanelLayoutFlex state children set and overwritten',
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

    } // onStateInitialized

    get classIdentifier() {
        return N2PanelLayoutFlex.CLASS_IDENTIFIER;
    }
    private _innerColumn: N2;

    /**
     * Defaults to an instance of N2Column.
     *
     * Contains ${topContainer}, ${centerContainer} and ${bottomContainer} components
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.column before calling super
     */
    get innerColumn(): N2 {
        if (!this._innerColumn)
            this._innerColumn = new N2Column({
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
    set innerColumn(value: N2) {
        this._innerColumn = value;
    }

    private _outerColumn: N2;

    /**
     * Defaults to an instance of N2Column.
     *
     * Composed of ${outerTop}, ${outerCenter} and ${outerBottom}
     *
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.outerColumn before calling super
     */
    get outerColumn(): N2 {
        if (!this._outerColumn)
            this._outerColumn = new N2Column({
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
    set outerColumn(value: N2) {
        this._outerColumn = value;
    }

    private _outerCenter: N2;

    /**
     * Defaults to an instance of N2Row.
     *
     * Contains ${leftContainer}, ${innerColumn} (composed of ${topContainer}, ${centerContainer} and ${bottomContainer}), and ${rightContainer} components
     *
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.innerRow before calling super
     */
    get outerCenter(): N2 {
        if (!this._outerCenter)
            this._outerCenter = new N2Row({
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
    set outerCenter(value: N2) {
        this._outerCenter = value;
    }


    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get top(): Elem_or_N2 {
        return this.state.top;
    }

    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get left(): Elem_or_N2 {
        return this.state.left;
    }

    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get right(): Elem_or_N2 {
        return this.state.right;
    }

    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get bottom(): Elem_or_N2 {
        return this.state.bottom;
    }

    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get center(): Elem_or_N2 {
        return this.state.center;
    }

    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get outerTop(): Elem_or_N2 {
        return this.state.outerTop;
    }

    /**
     * Return HtmlElem or N2 component
     * @return {Elem_or_N2}  HtmlElem or N2
     */
    get outerBottom(): Elem_or_N2 {
        return this.state.outerBottom;
    }


    //----------------------

    private _isDevCircularReferenceShown = false;

    private _checkCreateMissingN2(n2: N2): N2 {
        let f = (n2 as any).isN2PanelLayout

        if (f && (typeof f === 'function')) {
            // this function exists
            let isN2PanelLayout = false;
            try {
                let _x = (n2 as any).isN2PanelLayout();
                if (typeof _x === 'boolean' && _x === true)
                    isN2PanelLayout = true;

                if (isN2PanelLayout) {
                    console.error("N2PanelLayoutFlex: Circular reference detected. Overwriting with a new instance of a basic panel. Overwritten instance :", n2)
                    if (isDev() && !this._isDevCircularReferenceShown) {

                        this._isDevCircularReferenceShown = true;
                        setTimeout(() => {
                                DialogUtility.alert({
                                    title: 'N2PanelLayoutFlex: Circular reference detected.',
                                    content: '<p>N2PanelLayoutFlex: Circular reference detected. Overwriting with a new instance of a basic panel!!!<p>See console for details.<p>',
                                    width: 'min(80%, 500px)',
                                    height: 'min(80%, 300px)',
                                    isModal: true,
                                });
                            },
                            500);
                    }

                    return new N2Panel(); // overwrite with a new instance of a basic panel so we don't get a circular reference
                }
                // if it did not return true, than it could be something completely diffferent, so we just return the same instance
            } catch (_e) {
                // ignore
            }
        } // if (f && (typeof f === 'function'))
        return n2; // all good, return the same instance
    } // _checkCreateMissingN2



    /**
     * Override this to create a different N2 for a missing position
     * PLEASE ENSURE THAT THE RETURNED COMPONENT IS NOT ONE THAT EXTENDS N2PanelLayoutFlex or you will have an infinite loop
     * @param {EnumPanelLayout} position
     * @return {N2}
     */
    createPlaceholderPanel(position: EnumPanelLayout): N2 {
        return new N2Panel({
            tagId: this.state.tagId + '_' + position,
        });
    }

    createElement(mix: Elem_or_N2, position: EnumPanelLayout): HTMLElement {
        if (!mix)
            return null;
        let x = mix;
        let elem: HTMLElement;
        if (x instanceof HTMLElement) {
            elem = x
        } else if (isN2(x)) {
            // N2
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
    //
    // stateToHTMLElement(position: EnumPanelLayout): HTMLElement {
    //     console.error("There is no implementation for stateToHTMLElement in N2PanelLayoutFlex for position: " + position);
    //     return null;
    // }

    /**
     * Confirms that this component is a N2PanelLayoutFlex
     * @return {boolean} true
     */
    readonly isN2PanelLayoutFlex: boolean  = true;

} // main class