import {Toast, ToastModel} from '@syncfusion/ej2-notifications';
import {addN2Class, decoToHtmlElement, N2HtmlDecorator} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ToastRef extends StateN2EjBasicRef {
    widget?: N2Toast;
}

export interface StateN2Toast<WIDGET_LIBRARY_MODEL extends ToastModel = ToastModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ToastRef;

    /**
     * Decorator for the e-toast element (which will be a child of the original anchor element)
     */
    deco_toast?: N2HtmlDecorator;
    /**
     * Decorator for the e-toast-content element (which will be a child of the e-toast element)
     */
    deco_toast_content?: N2HtmlDecorator;
    /**
     * Decorator for the e-toast-title element (which will be a child of the e-toast element)
     */
    deco_toast_title?: N2HtmlDecorator;

}

export class N2Toast<STATE extends StateN2Toast = StateN2Toast> extends N2EjBasic<STATE, Toast> {
    static readonly CLASS_IDENTIFIER: string = 'N2Toast';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Toast.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new Toast(this.state.ej);

        //-----------------------

        let thisX = this;
        let fShow = this.obj.show;
        this.obj.show = (args) => {
            fShow.call(thisX.obj, args);

            if (this.state.deco_toast) {
                let deco = this.state.deco_toast;
                let toastElem = this.htmlElementAnchor.querySelector('.e-toast-container .e-toast') as HTMLElement;
                if (toastElem) {
                    decoToHtmlElement(deco, toastElem);
                }
            } // if deco_toast

            if (this.state.deco_toast_content) {
                let deco = this.state.deco_toast_content;
                let toastElem = this.htmlElementAnchor.querySelector('.e-toast-container .e-toast .e-toast-message .e-toast-content') as HTMLElement;
                if (toastElem) {
                    decoToHtmlElement(deco, toastElem);
                }
            } // if deco_toast_content

            if (this.state.deco_toast_title) {
                let deco = this.state.deco_toast_title;
                let toastElem = this.htmlElementAnchor.querySelector('.e-toast-container .e-toast .e-toast-message .e-toast-title') as HTMLElement;
                if (toastElem) {
                    decoToHtmlElement(deco, toastElem);
                }
            } // if deco_toast_title
        }// this.obj.show

    }

    get classIdentifier(): string { return N2Toast.CLASS_IDENTIFIER; }

}