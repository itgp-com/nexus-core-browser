import {Ribbon, RibbonModel} from "@syncfusion/ej2-ribbon";
import {
    RibbonButton,
    RibbonCheckBox,
    RibbonColorPicker,
    RibbonComboBox,
    RibbonDropDown,
    RibbonSplitButton
} from '@syncfusion/ej2-ribbon/src/ribbon/items';
import {RibbonFileMenu} from '@syncfusion/ej2-ribbon/src/ribbon/modules';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Ribbon.Inject(
    RibbonButton,
    RibbonCheckBox,
    RibbonColorPicker,
    RibbonComboBox,
    RibbonDropDown,
    RibbonFileMenu,
    RibbonSplitButton,
)


export interface StateNx2EjRibbonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjRibbon;
}

export interface StateNx2EjRibbon<WIDGET_LIBRARY_MODEL extends RibbonModel = RibbonModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjRibbonRef;
}

export class Nx2EjRibbon<STATE extends StateNx2EjRibbon = StateNx2EjRibbon> extends Nx2EjBasic<STATE, Ribbon> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjRibbon');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Ribbon(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}