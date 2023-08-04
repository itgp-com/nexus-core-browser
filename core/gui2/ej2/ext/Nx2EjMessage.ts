import {Message, MessageModel} from "@syncfusion/ej2-notifications";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjMessageRef extends StateNx2EjBasicRef {
    widget?: Nx2EjMessage;
}

export interface StateNx2EjMessage<WIDGET_LIBRARY_MODEL extends MessageModel = MessageModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjMessageRef;
}

export class Nx2EjMessage<STATE extends StateNx2EjMessage = StateNx2EjMessage> extends Nx2EjBasic<STATE, Message> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMessage');
    }


    createEjObj(): void {
        this.obj = new Message(this.state.ej);
    }



}