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


export interface StateN2RibbonRef extends StateNx2EjBasicRef {
    widget?: N2Ribbon;
}

export interface StateN2Ribbon<WIDGET_LIBRARY_MODEL extends RibbonModel = RibbonModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2RibbonRef;
}

export class N2Ribbon<STATE extends StateN2Ribbon = StateN2Ribbon> extends Nx2EjBasic<STATE, Ribbon> {
    static readonly CLASS_IDENTIFIER: string = "N2Ribbon";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Ribbon.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Ribbon(this.state.ej);
    }

    get classIdentifier(): string { return N2Ribbon.CLASS_IDENTIFIER; }

}