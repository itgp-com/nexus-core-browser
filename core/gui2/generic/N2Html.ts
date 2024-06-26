import {escape, isFunction, isString} from "lodash";
import {htmlToElement} from '../../BaseUtils';
import {N2Evt_OnHtml} from "../N2";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class, applyCssToElement} from '../N2HtmlDecorator';
import {createN2HtmlBasic} from "../N2Utils";

export interface StateN2HtmlRef extends StateN2BasicRef {
    widget?: N2Html;
}

export interface StateN2Html<T extends N2Html = any> extends StateN2Basic {
    value?: (string | HTMLElement | (() => string | HTMLElement));

    /**
     * If true, first creates an element from the text passed in (surrounded by div if not html already)
     * and then proceeds as if the value was an HTMLElement to start with
     */
    noStringWrapper?: boolean;

    /**
     * If this is declared, this event will be triggered when the element is clicked
     * If both this and the 'onClick' method in the class are declared, this will take precedence.
     * If you also want to execute the onClick method, you have to specifically call it yourself from this method implementation.
     * @param {{mouse_event: MouseEvent, widget: T}} ev
     */
    onClick?: (ev: { mouse_event: MouseEvent, widget: T }) => void;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2HtmlRef;
} // state

export class N2Html<STATE extends StateN2Html = StateN2Html> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Html'

    constructor(state: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Html.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    // noinspection JSUnusedLocalSymbols
    /**
     * If this is declared, this event will be triggered when the element is clicked
     *
     * The state.onClick method will take precedence over the class onClick method. This method will not fire in that case unless the code in stete.onClick specifically calls this.
     * @param ev {mouse_event:MouseEvent, widget:N2Html}
     */
    onClick(ev: { mouse_event: MouseEvent, widget: N2Html }) {}

    onHtml(_args: N2Evt_OnHtml): HTMLElement {
        let thisX = this;

        if (this.state.value == null)
            this.state.value = '';

        let val0: (string | HTMLElement | (() => string | HTMLElement)) = this.state.value;
        if (val0 == null)
            return null;

        let val: (String | HTMLElement);
        if (isFunction(val0)) {
            try {
                val = val0.call(this);
            } catch (e) { console.error(e); }
        } else {
            val = val0;
        }// if isFunction
        if (val == null)
            return null;


        if (isString(val) && this.state.noStringWrapper) {
            // make sure we have an HTMLElement
            let test = htmlToElement(val); // test if we can actually make an element from the string
            if (test == null) {
                // not HTML so we need to wrap it in a div
                test = document.createElement('div');
                test.innerHTML = val;
            }
            val = test;
        } // if isString

        let elem: HTMLElement;

        if (isString(val)) {
            this.state.deco.text = (this.state.deco.escapeText ? escape(val) : val);

            elem = createN2HtmlBasic(this.state);
        } else {
            elem = val as HTMLElement;

            // synchronize the tagId with the id of the HTML element
            if (elem.id) {
                this.state.tagId = elem.id; // this becomes the tagId for the N2HTML widget also
            } else {
                elem.id = this.state.tagId; // make sure the id is set
            }

            // merge classes
            if (this.state.deco.classes != null) {
                mergeClasses(elem, this.state.deco.classes);
            }
            // merge styles
            if (this.state.deco.style != null)
                applyCssToElement(elem, this.state.deco.style); //  was: Object.assign(elem.style, this.state.deco.style);

            //merge attributes
            let otherAttr = this.state.deco.otherAttr;
            for (const key in otherAttr) {
                if (otherAttr.hasOwnProperty(key)) {
                    elem.setAttribute(key, otherAttr[key]);
                } // if hasOwnProperty
            } // for


        } // if isString

        if (thisX.state.onClick) {
            elem.addEventListener('click', (ev) => {
                try {
                    thisX.state.onClick({mouse_event: ev, widget: thisX});
                } catch (e) { console.error(e); }
            });
            elem.style.cursor = 'pointer';
        } else if (this.onClick) {// if thisX.state.onClick
            // is it the method from N2Html (empty method) or the one implemented in an extension of the class?
            let f_empty_implementation = N2Html.prototype.onClick;
            let f_current_implementation = this.onClick;
            if (f_current_implementation !== f_empty_implementation) {
                elem.addEventListener('click', (ev) => {
                    try {
                        this.onClick({mouse_event: ev, widget: thisX});
                    } catch (e) { console.error(e); }
                });
                elem.style.cursor = 'pointer';
            } // if f_current_implementation

        }
        return elem;
    } //onHtml
} //N2Html

function mergeClasses(element1: HTMLElement, classList2: string | string[]) {
    let classList1 = element1.classList;

    let classArray2 = (classList2 ? (Array.isArray(classList2) ? classList2 : [classList2]) : []);

    for (let i = 0; i < classArray2.length; i++) {
        if (!classList1.contains(classArray2[i])) {
            classList1.add(classArray2[i]);
        }
    }
}