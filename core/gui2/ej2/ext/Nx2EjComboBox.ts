import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {ComboBox, ComboBoxModel} from "@syncfusion/ej2-dropdowns";


export interface StateNx2EjComboBoxRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjComboBox;
}

export interface StateNx2EjComboBox<WIDGET_LIBRARY_MODEL extends ComboBoxModel = ComboBoxModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjComboBoxRef;
}

export class Nx2EjComboBox<STATE extends StateNx2EjComboBox = StateNx2EjComboBox> extends Nx2EjBasic<STATE,ComboBox> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjComboBox');
    }


    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new ComboBox(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
        // this.htmlElement.classList.add( 'Nx2EjComboBox');
    }
}