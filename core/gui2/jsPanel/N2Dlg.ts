import {N2} from '../N2';
import {N2Basic, StateN2Basic} from '../N2Basic';
import {addN2Class} from '../N2HtmlDecorator';
import {StateN2Ref} from '../StateN2';

interface N2DlgStateRef extends StateN2Ref {
    widget?: N2Dlg;
}

interface N2DlgState<DATA_TYPE = any> extends StateN2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: N2DlgStateRef;

    // options?: JsPanelOptions;
    n2content: N2;

} // N2ListPopupState

class N2Dlg<STATE extends N2DlgState = N2DlgState> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Dlg';

    constructor(state: STATE) {
        super(state);
    }
    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Dlg.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

}