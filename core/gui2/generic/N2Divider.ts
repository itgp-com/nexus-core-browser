import {isNumber} from 'lodash';
import {N2Html, StateN2Html} from './N2Html';

/**
 * Enumeration of divider types.
 */
export enum DividerType {
    Both = 0,
    Horizontal = 1,
    Vertical = 2,

}

/**
 * Arguments for N2Divider class.
 */
export class Args_N2Divider {
    /**
     * Width of the divider.
     */
    width?: number | string;
    /**
     * Height of the divider.
     */
    height?: number | string;
    /**
     * Type of the divider.
     */
    type?: DividerType;
}

/**
 * Represents a divider component.
 */
export class N2Divider extends N2Html {

    private _args: Args_N2Divider;

    constructor(args: Args_N2Divider) {
        super(null);
        this._args = args || {}
    } // constructor()


    protected onStateInitialized(state: StateN2Html): void {
        let type = this._args.type || DividerType.Both;
        let height = this._args.height || '15px';
        if ( isNumber(height) )
            height = height + 'px';
        let width = this._args.width || '15px';
        if ( isNumber(width) )
            width = width + 'px';


        switch (type) {
            case DividerType.Horizontal:
                state.value = `<div style="width: ${width}"></div>`;
                break;
            case DividerType.Vertical:
                state.value = `<div style="height: ${height}"></div>`;
                break;
            default:
                // both
                state.value = `<div style="width: ${width};height: ${height}"></div>`
                break;
        }

        super.onStateInitialized(state);
    } // onStateInitialized
}