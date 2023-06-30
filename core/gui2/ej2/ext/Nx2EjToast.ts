import {Toast, ToastModel} from "@syncfusion/ej2-notifications";
import {addNx2Class, decoToHtmlElement, Nx2HtmlDecorator} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjToastRef extends StateNx2EjBasicRef {
    widget?: Nx2EjToast;
}

export interface StateNx2EjToast<WIDGET_LIBRARY_MODEL extends ToastModel = ToastModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjToastRef;

    /**
     * Decorator for the e-toast element (which will be a child of the original anchor element)
     */
    deco_toast ?: Nx2HtmlDecorator;
    /**
     * Decorator for the e-toast-content element (which will be a child of the e-toast element)
     */
    deco_toast_content ?: Nx2HtmlDecorator;
    /**
     * Decorator for the e-toast-title element (which will be a child of the e-toast element)
     */
    deco_toast_title ?: Nx2HtmlDecorator;

}

export class Nx2EjToast<STATE extends StateNx2EjToast = StateNx2EjToast> extends Nx2EjBasic<STATE, Toast> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjToast');
    }

    protected createEjObj(): void {
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

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}