import {Button, ButtonModel} from '@syncfusion/ej2-buttons';
import {throttle} from 'lodash';
import {StringArg, stringArgVal} from '../../../BaseUtils';
import {cssAddSelector} from '../../../CoreUtils';
import {N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ButtonRef extends StateN2EjBasicRef {
    widget?: N2Button;
}

export interface StateN2Button extends StateN2EjBasic<ButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the ButtonModel
     */
    label?: StringArg;

    /**
     * implement the onClick behavior of the button
     */
    onclick?: (ev: MouseEvent) => void;

    /**
     * User 'onclick' instead
     */
    onClick?: never;

    /**
     * The time in milliseconds to wait before allowing another click event to be processed
     * Default is 2000 (2000ms=2s)
     */
    click_throttle_wait_ms?: number;

    /**
     * If set to true, the click event will not be throttled
     */
    click_throttle_disable?: boolean;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ButtonRef;
}

export class N2Button<STATE extends StateN2Button = StateN2Button> extends N2EjBasic<STATE, Button> {
    static readonly CLASS_IDENTIFIER: string = 'N2Button'

    constructor(state ?: STATE) {
        super(state);
    }


    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Button.CLASS_IDENTIFIER);
        state.deco.tag = 'button';
        state.deco.otherAttr['type'] = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: N2Evt_OnLogic) {
        let thisX = this;

        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // Button content label/ html

        super.onLogic(ev);

        let wait_ms = this.state.click_throttle_wait_ms || 2000;
        let f_throttled_click = throttle(() => {
                this.state.onclick.call(thisX, ev);
            },
            wait_ms,
            {
                leading: true, // leading: true allows the function to be called immediately on the first trigger within the wait period.
                trailing: false // trailing: false prevents the function from being called at the end of the wait period as a result of calls that occurred during the wait.
            }
        );

        // attach the onclick event to the htmlElementAnchor
        if (this.state.onclick) {
            this.htmlElementAnchor.onclick = (ev) => {
                if (this.state.click_throttle_disable) {
                    this.state.onclick.call(thisX, ev);
                } else {
                    f_throttled_click.call(thisX);
                } // if (this.state.click_throttle_disable)
            } // onclick external function
        } // if onclick
    } // onLogic

    createEjObj(): void {
        this.obj = new Button(this.state.ej);
    }

    get classIdentifier() {
        return N2Button.CLASS_IDENTIFIER;
    }

}


themeChangeListeners().add((ev: ThemeChangeEvent) => {

    cssAddSelector(`.${N2Button.CLASS_IDENTIFIER}.e-btn, .${N2Button.CLASS_IDENTIFIER}.e-css.e-btn,
.N2DropDownButton.e-btn, .N2DropDownButton.e-css.e-btn`, `
  font-size: var(--app-font-size-regular);
  text-transform: unset !important;`);
}); // normal priority