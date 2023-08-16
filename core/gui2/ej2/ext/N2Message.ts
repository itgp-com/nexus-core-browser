import {Message, MessageModel} from "@syncfusion/ej2-notifications";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2MessageRef extends StateNx2EjBasicRef {
    widget?: N2Message;
}

export interface StateN2Message<WIDGET_LIBRARY_MODEL extends MessageModel = MessageModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MessageRef;
}

export class N2Message<STATE extends StateN2Message = StateN2Message> extends Nx2EjBasic<STATE, Message> {
    static readonly CLASS_IDENTIFIER: string = 'N2Message';

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Message.CLASS_IDENTIFIER);
    }


    createEjObj(): void {
        this.obj = new Message(this.state.ej);
    }

    get classIdentifier(): string { return N2Message.CLASS_IDENTIFIER; }

}