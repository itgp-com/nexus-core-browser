import {Message, MessageModel} from '@syncfusion/ej2-notifications';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2MessageRef extends StateN2EjBasicRef {
    widget?: N2Message;
}

export interface StateN2Message<WIDGET_LIBRARY_MODEL extends MessageModel = MessageModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MessageRef;
}

export class N2Message<STATE extends StateN2Message = StateN2Message> extends N2EjBasic<STATE, Message> {
    static readonly CLASS_IDENTIFIER: string = 'N2Message';

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2Message.CLASS_IDENTIFIER);
    }


    createEjObj(): void {
        this.obj = new Message(this.state.ej);
    }

    get classIdentifier(): string { return N2Message.CLASS_IDENTIFIER; }

}