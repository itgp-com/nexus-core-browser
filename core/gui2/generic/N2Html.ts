import {escape, isFunction, isString} from "lodash";
import {N2Evt_OnHtml} from "../N2";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class, applyCssToElement} from '../N2HtmlDecorator';
import {createN2HtmlBasic} from "../N2Utils";

export interface StateN2HtmlRef extends StateN2BasicRef {
    widget?: N2Html;
}

export interface StateN2Html extends StateN2Basic {
    value?: (string | HTMLElement | (() => string | HTMLElement));
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


    onHtml(_args: N2Evt_OnHtml): HTMLElement {
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


        if (isString(val)) {
            this.state.deco.text = (this.state.deco.escapeText ? escape(val) : val);

            return createN2HtmlBasic(this.state);
        } else {
            let elem: HTMLElement = this.state.value as HTMLElement;

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


            return elem as HTMLElement;
        } // if isString
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