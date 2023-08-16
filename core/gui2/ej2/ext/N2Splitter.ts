import {Splitter, SplitterModel} from "@syncfusion/ej2-layouts";
import {Nx2, Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {getNx2FromHtmlElement, isNx2HtmlElement} from '../../Nx2Utils';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2SplitterRef extends StateNx2EjBasicRef {
    widget?: N2Splitter;
}

export interface StateN2Splitter extends StateNx2EjBasic<SplitterModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SplitterRef;

    /**
     * Array of content to be added to the splitter in the same pane position of the paneSettings array under this.ej
     */
    content?: (string | HTMLElement | Nx2)[]; // content of the splitter
} // state class

export class N2Splitter<STATE extends StateN2Splitter = StateN2Splitter> extends Nx2EjBasic<STATE, Splitter> {
    static readonly CLASS_IDENTIFIER: string = "N2Splitter";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Splitter.CLASS_IDENTIFIER);
    }


    public onLogic(args: Nx2Evt_OnLogic): void {

        let fCreated = this.state.ej?.created;

        // since the splitter will take every 'component' passed in paneSettings, convert it to string then recreate it without events
        // the code here will append content from the state.content array to the panes in the same order as the paneSettings array
        // it will also initialize any Nx2 components that are passed in the state.content array
        this.state.ej.created = (ev) => {
            // get all the panes
            let panes = Array.from(this.obj.element.querySelectorAll('.e-pane')) as HTMLElement[] || [];
            let elemCount = panes.length;
            let stateComponents: (string | HTMLElement | Nx2)[] = this.state.content || [];
            let stateComponentsCount: number = stateComponents.length;
            let maxCount = Math.min(elemCount, stateComponentsCount); // only process the minimum of the two (in case there are more panes than paneSettings)
            if (maxCount > 0) {
                for (let i = 0; i < elemCount; i++) {
                    let paneElem = panes[i];
                    let stateComponent: (string | HTMLElement | Nx2) = stateComponents[i];
                    if (stateComponent) {
                        if (typeof stateComponent === 'string') {
                            paneElem.innerHTML += stateComponent; // append the string HTML to the innerHTML of the pane
                        } else if (stateComponent instanceof HTMLElement) {
                            paneElem.appendChild(stateComponent);
                            if (isNx2HtmlElement(stateComponent)) {
                                let nx2 = getNx2FromHtmlElement(stateComponent);
                                if (nx2) {
                                    nx2.initLogic();
                                }
                            } // if ( isNx2HtmlElement(stateComponent)
                        } else if (stateComponent instanceof Nx2) {
                            // append and initialize the Nx2 component
                            paneElem.appendChild(stateComponent.htmlElement);
                            stateComponent.initLogic();
                        } // if
                    } // if
                } // for
            } // if maxCount>0

            if (fCreated)
                fCreated(this, ev);

        }; // this.state.ej.created

        super.onLogic(args);
    }

    createEjObj(): void {
        this.obj = new Splitter(this.state.ej);
    }

    get classIdentifier(): string { return N2Splitter.CLASS_IDENTIFIER; }

} // main class