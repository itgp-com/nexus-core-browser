import {Mention, MentionModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2MentionRef extends StateNx2EjBasicRef {
    widget?: N2Mention;
}

export interface StateN2Mention<WIDGET_LIBRARY_MODEL extends MentionModel = MentionModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MentionRef;
}

export class N2Mention<STATE extends StateN2Mention = StateN2Mention> extends Nx2EjBasic<STATE, Mention> {
    static readonly CLASS_IDENTIFIER: string = 'N2Mention';

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Mention.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Mention(this.state.ej);
    }

    get classIdentifier(): string { return N2Mention.CLASS_IDENTIFIER; }

}