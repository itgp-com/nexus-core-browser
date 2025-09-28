export interface StateN2TextSwitchRef extends StateN2BasicRef {
    widget?: N2TextSwitch;
}

export interface StateN2TextSwitchOnChangeEvent {
    widget: N2TextSwitch;
    checked: boolean;
}

export interface StateN2TextSwitch extends StateN2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TextSwitchRef;

    /**
     * If true, the switch is checked (on)
     * @default false
     */
    checked?: boolean; // default is false


    /**
     * If true, the switch is disabled and cannot be toggled
     * @default false
     */
    disabled?: boolean; // default is false

    /**
     * The value displayed in the pill, can be a string or an HTMLElement
     * @default ''
     */
    pill_value?: string | HTMLElement;

    /**
     * If true, pill_value is HTML string, else plain text or HTMLElement
     * @default false
     */
    pill_value_is_html?: boolean; // if true, pill_value is HTML string, else plain text or HTMLElement

    /**
     * Callback when the switch is toggled
     * @param ev - The event object containing the widget and checked state
     */
    onChange?: (ev: StateN2TextSwitchOnChangeEvent) => void; // callback when the switch is toggled

    /**
     * The color of the switch when it is on
     * @default 'var(--app-color-blue)'
     */
    onColor?: string;

    /**
     * The color of the switch when it is off
     * @default 'var(--app-row-disabled-background-color-lightgray)'
     */
    offColor?: string;
} // StateN2TextSwitch

const PILL_HEIGHT: number = 20; // default pill height

export class N2TextSwitch<STATE extends StateN2TextSwitch = StateN2TextSwitch> extends N2Basic<STATE, N2TextSwitch> {

    inputElem: HTMLInputElement;
    containerElem: HTMLElement;
    textSwitchElem: HTMLElement;
    textSwitchPillElem: HTMLElement;
    textSwitchLabelElem: HTMLElement;

    changeHandler: voidFunction;
    updateChangeListener: voidFunction;

    constructor(state: STATE) {
        super(new StateN2TextSwitchImpl(state) as any); // switch the object passed in with an actual class instance of StateN2TextSwitchImpl

        try {
            loadCSS();
        } catch (e) {
            console.error(e);
        }

    } //constructor


    onHtml(args: N2Evt_OnHtml): HTMLElement {
        let state: STATE = this.state;
        let deco: N2HtmlDecorator<STATE> = IHtmlUtils.init(this.state.deco) as any;

        deco.classes = 'n2-text-switch-container'
        deco.tag = 'label';
        this.containerElem = createN2HtmlBasic<StateN2TextSwitch>(this.state);

        this.inputElem = htmlToElement(`<input type="checkbox" class="n2-text-switch-input">`) as HTMLInputElement;

        this.textSwitchElem = htmlToElement(`
    <span class="n2-text-switch" style="background-color: ${this.backgroundColor};">
      <span class="n2-text-switch-pill">
        <span class="n2-text-switch-label"></span>
      </span>
    </span>
`) as HTMLElement;

        if (state.disabled) {
            this.textSwitchElem.classList.add('n2-text-switch-disabled');
        } else {
            this.textSwitchElem.classList.remove('n2-text-switch-disabled');
        }

        this.textSwitchPillElem = this.textSwitchElem.querySelector('.n2-text-switch-pill') as HTMLElement;
        this.textSwitchLabelElem = this.textSwitchElem.querySelector('.n2-text-switch-label') as HTMLElement;


        //------- add to containerElem ---
        this.containerElem.appendChild(this.inputElem);
        this.containerElem.appendChild(this.textSwitchElem);

        return this.containerElem;

    } // onHtml

    onLogic(args: N2Evt_OnLogic) {
        //super.onLogic(args);

        let state: STATE = this.state;

        this.obj = this; // set the obj property to the same this instance

        // Initially Calculate sizes and adjust dynamically
        f_adjustSizes({thisX: this});

        state.checked = state.checked ?? false; // trigger the initial checked set function to paint the element correctly

        let input = this.inputElem;

        // Store the event handler so we can add/remove it
        const changeHandler = () => {
            state.checked = input.checked; // the setter will handle the rest
        };
        this.changeHandler = changeHandler;

        // Helper to update event listener based on disabled state
        this.updateChangeListener = () => {
            input.removeEventListener('change', this.changeHandler);
            if (!state.disabled) {
                input.addEventListener('change', this.changeHandler);
            }
        };

        // Initial setup
        this.updateChangeListener();

    } // onLogic

    onDOMAdded(ev: N2Evt_DomAdded) {
        // cannot do this in onHtml because the sizing computed for the pill would be wrong until in the DOM
        f_local_updatePillLabel({thisX: this, value: this.state.pill_value}); // update the pill label with the initial value
        super.onDOMAdded(ev);
    }

    //--------------------- Start facade getter/setter section -- Direct object getters/setters that defer to constructor created custom state getter/setter ---------------------

    get pill_value(): string | HTMLElement {
        // Getter for pill_value
        return this.state.pill_value;
    }

    set pill_value(value: string | HTMLElement) {
        // Setter for pill_value
        this.state.pill_value = value;
    }

    get checked(): boolean {
        // Getter for checked
        return this.state.checked;
    }

    set checked(value: boolean) {
        // Setter for checked
        this.state.checked = value;
    }

    get disabled(): boolean {
        // Getter for disabled
        return this.state.disabled;
    }

    set disabled(value: boolean) {
        // Setter for disabled
        this.state.disabled = value;
    }

    //--------------------------End facade getter/setter section -------------------------------------------------------------------

    protected get backgroundColor(): string {
        let state: STATE = this.state;
        return state.checked ? state.onColor : state.offColor;
    }


} // N2TextSwitch


export class StateN2TextSwitchImpl implements StateN2TextSwitch {

    ref?: StateN2TextSwitchRef; // implement simply for compiler to be happy on state.ref calls

    constructor(state?: StateN2TextSwitch) {
        if (state) {
            if (!(state instanceof StateN2TextSwitchImpl)) { // if the state is not already an instance of StateN2TextSwitchImpl
                // Iterate over the properties of state
                (Object.keys(state) as (keyof StateN2TextSwitch)[]).forEach((key) => {
                    // Skip undefined values to preserve default setter behavior
                    if (state[key] !== undefined) {
                        // Assign using setter (e.g., this.checked = value)
                        (this as any)[key] = state[key];
                    }
                }); // Object.keys(state).forEach
            } // if ( !(state instanceof StateN2TextSwitchImpl))
        } // if (state)
    } // constructor


    // change?: (ev: { widget: N2TextSwitch, checked: boolean }) => void; // callback when the switch is toggled

    // ---------------- checked -----------------
    private _checked?: boolean; // default is false
    get checked() {
        return this._checked;
    }

    set checked(value: boolean) {
        value = !!value; // ensure value is boolean
        let state: StateN2TextSwitchImpl = this;

        let original_value = state._checked;
        state._checked = value;

        let thisX: N2TextSwitch = state.ref?.widget as N2TextSwitch;
        if (!thisX)
            return; // if the widget is not initialized, do nothing

        if (thisX.inputElem) { // if the input element is initialized
            f_repaint_pill({thisX: thisX}); // repaint the pill to update its position and color

            if (original_value != value)
                (state as StateN2TextSwitch).onChange?.({widget: thisX, checked: value}); // call the onChange callback if defined
        } // if ( thisX.inputElem)
    } // set checked


//--------- disabled ----------------
    private _disabled: boolean = false; // default is false
    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value: boolean) {
        value = !!value;
        let state: StateN2TextSwitchImpl = this;
        state._disabled = value;

        let thisX: N2TextSwitch = state.ref?.widget as N2TextSwitch;
        if (!thisX)
            return; // if the widget is not initialized, do nothing

        if (thisX.inputElem && thisX.textSwitchElem) { // if the input and text switch elements are initialized
            thisX.inputElem.disabled = value;
            if (value) {
                thisX.textSwitchElem.classList.add('n2-text-switch-disabled');
            } else {
                thisX.textSwitchElem.classList.remove('n2-text-switch-disabled');
            }
            thisX.updateChangeListener();
        } // if (thisX.inputElem && thisX.textSwitchElem) {
    } // set disabled


    // ---------------- pill_value ---------------
    private _pill_value: string | HTMLElement = '';
    get pill_value(): string | HTMLElement {
        return this._pill_value;
    }

    set pill_value(value: string | HTMLElement) {
        let state: StateN2TextSwitchImpl = this;
        state._pill_value = value ?? '';

        let thisX: N2TextSwitch = state.ref?.widget as N2TextSwitch;
        if (!thisX)
            return; // if the widget is not initialized, do nothing


        f_local_updatePillLabel({thisX: thisX, value: value}); // update the pill label with the new value
    } // pill_value getter/setter


    private _onColor ?: string = DEFAULT_ON_COLOR;
    get onColor(): string {
        return this._onColor;
    }

    set onColor(value: string) {
        let state: StateN2TextSwitchImpl = this;
        state._onColor = value;

        let thisX: N2TextSwitch = state.ref?.widget as N2TextSwitch;
        if (!thisX)
            return; // if the widget is not initialized, do nothing

        if (thisX.textSwitchElem)
            thisX.textSwitchElem.style.backgroundColor = value ?? DEFAULT_ON_COLOR;

    } // onColor getter/setter

    private _offColor ?: string = DEFAULT_OFF_COLOR;
    get offColor(): string {
        return this._offColor;
    }

    set offColor(value: string) {
        let state: StateN2TextSwitchImpl = this;
        state._offColor = value;

        let thisX: N2TextSwitch = state.ref?.widget as N2TextSwitch;
        if (!thisX)
            return; // if the widget is not initialized, do nothing

        if (thisX.textSwitchElem)
            thisX.textSwitchElem.style.backgroundColor = value ?? DEFAULT_OFF_COLOR;
    } // offColor getter/setter

} // StateN2TextSwitchImpl

const DEFAULT_ON_COLOR: string = 'var(--app-color-blue)'; // default on color
const DEFAULT_OFF_COLOR: string = 'var(--app-row-disabled-background-color-lightgray)'; // default off color


/**
 * @param p
 */
function f_adjustSizes(p: { thisX: N2TextSwitch }) {
    let thisX = p.thisX;

    if (!thisX.textSwitchElem)
        return;

    let pillDiv = thisX.textSwitchPillElem;
    let pillLabelDiv = thisX.textSwitchLabelElem;
    let switchDiv = thisX.textSwitchElem;

    // Measure the pill width based on the number
    const labelWidth = pillLabelDiv.offsetWidth;
    const pillPadding = 6; // 3px padding on each side
    let pillWidth = labelWidth + pillPadding;
    if (pillWidth < PILL_HEIGHT) {
        pillWidth = PILL_HEIGHT; //keep the circular pill shape
    }

    // Adjust pill border-radius for larger numbers (pill shape)
    pillDiv.style.width = `${pillWidth}px`;
    pillDiv.style.borderRadius = `${PILL_HEIGHT / 2}px`; // keep the circular pill shape on the edges
    // pill.style.borderRadius = pillWidth > PILL_HEIGHT*2 ? `${PILL_HEIGHT}px` : '${PILL_HEIGHT/2}px'; // Pill shape for larger numbers is oval, else round pill shape

    // Outer switch width is 20px greater than the pill
    const switchExtraWidth = pillWidth < PILL_HEIGHT * 2 ? PILL_HEIGHT : PILL_HEIGHT * 2; // 20px for small numbers, 40px for larger numbers
    const switchWidth = pillWidth + switchExtraWidth; // 20px for small numbers, 40px for larger numbers
    switchDiv.style.width = `${switchWidth}px`;
    (switchDiv as any)._switchWidth = switchWidth; // store the width for later use
}

function f_local_updatePillLabel(p: { thisX: N2TextSwitch, value: string | HTMLElement }) {
    let thisX = p.thisX;
    let value = p.value;

    if (thisX.textSwitchLabelElem) { // if initialized
        let state = thisX.state;

        let pillLabel = thisX.textSwitchLabelElem;
        if (typeof value === 'string') {
            if (state.pill_value_is_html) {
                // @ts-ignore
                pillLabel.innerHTML = DOMPurify.sanitize(value ?? '');
            } else {
                pillLabel.textContent = value ?? '';
            }
        } else if (value instanceof HTMLElement) {
            pillLabel.textContent = '';
            while (pillLabel.firstChild) pillLabel.removeChild(pillLabel.firstChild);
            pillLabel.appendChild(value);
        }

        f_adjustSizes({thisX}); // re-adjust the sizes based on the new label text width

        // Adjust pill position if checked
        f_repaint_pill({thisX}); // repaint the pill to update its position and color
    } // if (thisX.textSwitchLabelElem)
} //f_updatePillLabel


function f_repaint_pill(p: { thisX: N2TextSwitch }) {
    let thisX = p.thisX;
    let value = thisX.checked; // get the current checked state

    if (thisX.inputElem) { // if the input element is initialized
        let input = thisX.inputElem;
        let switchDiv = thisX.textSwitchElem;
        let pillDiv = thisX.textSwitchPillElem;

        input.checked = value;
        switchDiv.style.backgroundColor = value ? thisX.state.onColor : thisX.state.offColor;

        let switchDivWidth = (switchDiv as any)._switchWidth || 0; // cannot use switchDiv.offsetWidth because the browser has not updated yet in the same thread
        let pillDivWidth = pillDiv.offsetWidth;

        let on_value: number = switchDivWidth - pillDivWidth - 4;
        let off_value: number = 0;

        let translateX_value = value ? on_value : off_value;
        if (translateX_value < 0) {
            translateX_value = 0; // ensure we don't translate to a negative position
        }

        pillDiv.style.transform = `translateX(${translateX_value}px)`; // translate the pill to the right if checked, else to the left
    } // if ( thisX.inputElem)

} // f_repaint_pill


let cssLoaded = false;

function loadCSS(): void {
    if (cssLoaded) return;

    try {
        cssAdd(`
.n2-text-switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.n2-text-switch {
  border-radius: 12px;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.3s, width 0.3s;
  height: 24px;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
}
.n2-text-switch-input {
  display: none;
}
.n2-text-switch-pill {
  background-color: #fff;
  border-radius: 10px;
  height: ${PILL_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, border-radius 0.3s;
  position: absolute;
  top: 2px;
  left: 2px;
  padding: 0 8px;
  box-sizing: border-box;
}
.n2-text-switch-label {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
}
.n2-text-switch:hover {
  opacity: 0.8;
}    
.n2-text-switch-disabled {
  opacity: 0.5;
  pointer-events: none;
  background-color: var(--app-row-disabled-background-color-lightgray) !important;
}    
    `,
            'N2TextSwitch'
        ); // cssAdd
    } catch (e) {
        console.error(e);
    }

    cssLoaded = true;

} // loadCSS

import DOMPurify from "dompurify";
import {htmlToElement, voidFunction} from "../../BaseUtils";
import {cssAdd} from "../../CssUtils";
import {N2Evt_DomAdded, N2Evt_OnHtml, N2Evt_OnLogic} from "../N2";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {IHtmlUtils, N2HtmlDecorator} from "../N2HtmlDecorator";
import {createN2HtmlBasic} from "../N2Utils";