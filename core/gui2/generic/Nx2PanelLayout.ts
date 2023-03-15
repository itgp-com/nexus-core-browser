import {Nx2Basic, StateNx2Basic} from "../Nx2Basic";
import {Nx2} from "../Nx2";
import {Nx2Row} from "./Nx2Row";
import {Nx2Column} from "./Nx2Column";
import {Elem_or_Nx2_or_StateNx2, isNx2} from "../Nx2Utils";
import {CSS_FLEX_MAX_XY} from "../../CoreCSS";

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

    outerTop?: Elem_or_Nx2_or_StateNx2;
    outerBottom?: Elem_or_Nx2_or_StateNx2;
    /**
     * Inside the row, and directly above the Grid.
     * The {@link left} component top is the same as this component's top
     */
    top?: Elem_or_Nx2_or_StateNx2;

    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    left?: Elem_or_Nx2_or_StateNx2;


    /**
     * Inside the row, and spans the {@link top}, {@link center}, and {@link bottom} components
     * The {@link outerTop} and {@link outerBottom} components are fully above and below it.
     */
    right?: Elem_or_Nx2_or_StateNx2;

    /**
     * Inside the row and directly under the Grid.
     *
     * The {@link left} component bottom is the same as this component's bottom
     */
    bottom?: Elem_or_Nx2_or_StateNx2;

    /**
     * Center component.
     * Inside the row, and bordered by {@link top}, {@link bottom}, {@link left}, {@link right} components
     */
    center?: Elem_or_Nx2_or_StateNx2;
}


export class Nx2PanelLayout<STATE extends StateNx2PanelLayout = StateNx2PanelLayout> extends Nx2Basic<STATE> {


    outerTopElem: HTMLElement;
    outerBottomElem: HTMLElement;
    topElem: HTMLElement;
    leftElem: HTMLElement;
    rightElem: HTMLElement;
    bottomElem: HTMLElement;
    centerElem: HTMLElement;


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
                deco:{
                    classes :[CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
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
                deco:{
                    classes :[CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
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

    private _row: Nx2;

    /**
     * Defaults to an instance of Nx2Row.
     * Can be overwritten by extending class in its _initialSetup(state) by setting this.innerRow before calling super
     */
    get row(): Nx2 {
        if (!this._row)
            this._row = new Nx2Row({
                deco:{
                    classes :[CSS_FLEX_MAX_XY], // crucial so it can take up the whole panel
                }
            }); // can be overwritten by extending class in its _initialSetup(state) by setting row before calling super
        return this._row;
    }

    /**
     * Sets the inner row component to use.
     * Best set in <code>protected _initialSetup(state: STATE)</code> before calling <code>super._initialSetup(state);</code>
     * If set at any other time, please be careful to transfer the content of the existing component
     * @param value
     */
    set row(value: Nx2) {
        this._row = value;
    }

    protected _initialState(state: STATE) {


        let innerColumn = this.column;
        let columnElem: HTMLElement = innerColumn.htmlElement;

        if (state.top)
            columnElem.appendChild(this.createElement(state.top, EnumPanelLayout.top));

        if (state.center)
            columnElem.appendChild(this.createElement(state.center, EnumPanelLayout.center))

        if (state.bottom)
            columnElem.appendChild(this.createElement(state.bottom, EnumPanelLayout.bottom));


        let row = this.row;
        let rowElem: HTMLElement = row.htmlElement;

        if (state.left)
            rowElem.appendChild(this.createElement(state.left, EnumPanelLayout.left))

        rowElem.appendChild(columnElem);

        if (state.right)
            rowElem.appendChild(this.createElement(state.right, EnumPanelLayout.right))


        let outerColumn = this.outerColumn;
        let outerColumnElem: HTMLElement = outerColumn.htmlElement;

        if (state.outerTop)
            outerColumnElem.appendChild(this.createElement(state.outerTop, EnumPanelLayout.outerTop));

        outerColumnElem.appendChild(rowElem);

        if (state.outerBottom)
            outerColumnElem.appendChild(this.createElement(state.outerBottom, EnumPanelLayout.outerBottom));

        state.children = [outerColumn];

        super._initialState(state);

    }

    createElement (mix: Elem_or_Nx2_or_StateNx2, position: EnumPanelLayout): HTMLElement {
        if (!mix)
            return null;
        let x = mix;
        let elem: HTMLElement;
        if (x instanceof HTMLElement) {
            elem = x
        } else if (isNx2(x)){
            // Nx2
            x.initLogic();
            elem = x.htmlElement;
        } else {
            // StateNx2
            elem = this.stateToHTMLElement(position); // it has the state from this, so it just needs to know which position it is
        }

        switch (position) {
            case EnumPanelLayout.top:
                this.topElem = elem;
                break;
            case EnumPanelLayout.left:
                this.leftElem = elem;
                break;
            case EnumPanelLayout.right:
                this.rightElem = elem;
                break;
            case EnumPanelLayout.bottom:
                this.bottomElem = elem;
                break;
            case EnumPanelLayout.center:
                this.centerElem = elem;
                break;
            case EnumPanelLayout.outerTop:
                this.outerTopElem = elem;
                break;
            case EnumPanelLayout.outerBottom:
                this.outerBottomElem = elem;
                break;
        }
        return elem;
    }

    stateToHTMLElement(position:EnumPanelLayout):HTMLElement {
        console.error("There is no implementation for stateToHTMLElement in Nx2PanelLayout for position: " + position);
        return null;
    }

} // main class