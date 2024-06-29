nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(ComboBox.prototype);
}); // normal priority

export interface StateN2ComboBoxRef extends StateN2EjBasicRef {
    widget?: N2ComboBox;
}

export interface StateN2ComboBox<WIDGET_LIBRARY_MODEL extends ComboBoxModel = ComboBoxModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ComboBoxRef;
}

export class N2ComboBox<STATE extends StateN2ComboBox = StateN2ComboBox> extends N2EjBasic<STATE, ComboBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2ComboBox'

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2ComboBox.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ComboBox(this.state.ej);
    }

    get classIdentifier() {
        return N2ComboBox.CLASS_IDENTIFIER;
    }


} // N2ComboBox


import {ComboBox, ComboBoxModel} from '@syncfusion/ej2-dropdowns';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';