import {Button, ButtonModel} from '@syncfusion/ej2-buttons';
import {StringArg, stringArgVal} from '../../../BaseUtils';
import {cssAddSelector} from '../../../CoreUtils';
import {N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {CSS_VARS_CORE} from '../../scss/vars-material';
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
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // Button content label/ html

        super.onLogic(ev);

        // attach the onclick event to the htmlElementAnchor
        if (this.state.onclick)
            this.htmlElementAnchor.onclick = this.state.onclick;

    }

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