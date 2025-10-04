import {cssAdd} from '../../CssUtils';
import {addClassesToElement, addN2Class} from '../N2HtmlDecorator';
import {themeChangeListeners} from '../Theming';
import {jsPanel} from './jsPanelLib';
import {N2Dlg, StateN2Dlg, StateN2DlgRef} from './N2Dlg';


export interface StateN2Dlg_ModalRef extends StateN2DlgRef {
    widget?: N2Dlg_Modal;
}

export interface StateN2Dlg_Modal<DATA_TYPE = any> extends StateN2Dlg<DATA_TYPE> {

    /**
     * Original JsPanel **modal** options for the dialog.
     *
     * The other matching fields (ex: 'header', 'content') at this level are used to override the options inside here.
     */
    options?: JsPanelOptionsModal;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2Dlg_ModalRef;
} // StateN2Dlg_Modal

export class N2Dlg_Modal<STATE extends StateN2Dlg_Modal = StateN2Dlg_Modal> extends N2Dlg<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Dlg_Modal';


    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        let thisX = this;

        //------- do thisbefore  super.onStateInitialized(state) and regular N2Dlg get to populate the state -----
        addN2Class(state.deco, N2Dlg_Modal.CLASS_IDENTIFIER);
        if ( state.hideOpenDialogsIcon == null )
            state.hideOpenDialogsIcon = true; // modals should not show the open dialogs list button


        super.onStateInitialized(state);

        //--------------- modal -----------------
        let mo = state.options


        // default to false
        if (mo.closeOnBackdrop == null)
            mo.closeOnBackdrop = false; // set it to false if developer did not define it

        if (mo.dragit == null)
            mo.dragit = {
                cursor: 'move',
                handles: thisX.dragit_handles_string,
                opacity: 0.8,
                disableOnMaximized: true,
            }; // enable dragging by default

        if (mo.headerControls == null)
            mo.headerControls = {
                maximize: 'md',
                smallify: 'md',
                normalize: 'md',
                close: 'md',
                minimize: 'remove',
            }; // no minimize for modal (since it would minimize under the backdrop)

        // if (mo.dragit && !isBoolean(mo.dragit)) {
        //     if (!mo.dragit?.cursor)
        //         mo.dragit.cursor = 'move';
        //
        //     if (!mo.dragit?.disableOnMaximized == null) {
        //         mo.dragit.disableOnMaximized = true;
        //     }
        // } // if mo.dragit
    } // onStateInitialized

    createJsPanel(): void {
        this.obj = jsPanel.modal.create(this.state.options) as JsPanel;
    } // createJsPanel

    get classIdentifier(): string { return N2Dlg_Modal.CLASS_IDENTIFIER; }

} // N2Dlg_Modal

export const CSS_CLASS_N2DLG_MODAL_BACKDROP: string = `${N2Dlg_Modal.CLASS_IDENTIFIER}_backdrop`;

themeChangeListeners().add((ev) => {

    // overwrite the static newN2Dlg_Modal method to eliminate importing this class in the parent. Eliminates cyclical dependency like that
    N2Dlg.newN2Dlg_Modal = (state: StateN2Dlg_Modal): N2Dlg_Modal =>{
        return new N2Dlg_Modal(state);
    }


    const modal_opacity:number = 0.5
    // modify the modal backdrop to be more transparent
    let f_addBackdrop_default = jsPanel.modal.addBackdrop;
    jsPanel.modal.addBackdrop = function (id: string) {
        let backdrop: HTMLDivElement = f_addBackdrop_default.call(jsPanel.modal, id);
        addClassesToElement(backdrop, CSS_CLASS_N2DLG_MODAL_BACKDROP)
        return backdrop;
    }

    cssAdd(`
@keyframes N2DLG_modalBackdropFadeIn {
    from {
        opacity: 0
    }

    to {
        opacity: ${modal_opacity}
    }
 }
 
 .jsPanel-modal-backdrop.${CSS_CLASS_N2DLG_MODAL_BACKDROP} {
        animation:N2DLG_modalBackdropFadeIn ease-in 1;
        animation-fill-mode: forwards;
        animation-duration: 100ms;
 }
 
 @keyframes N2DLG_modalBackdropFadeOut {
          from {
            opacity: ${modal_opacity};
          }
          to {
            opacity: 0;
          }
 }
 
.jsPanel-modal-backdrop-out.${CSS_CLASS_N2DLG_MODAL_BACKDROP} {
          animation: N2DLG_modalBackdropFadeOut ease-in 1;
          animation-fill-mode: forwards;
          animation-duration: 100ms;
}
.jsPanel-modal-backdrop.jsPanel-modal-backdrop-multi.${CSS_CLASS_N2DLG_MODAL_BACKDROP} {
    background: rgba(0,0,0,${modal_opacity});
}   
   
    `); // end cssAdd


}, 20);