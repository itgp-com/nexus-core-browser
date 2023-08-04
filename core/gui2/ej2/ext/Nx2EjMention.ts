import {Mention, MentionModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjMentionRef extends StateNx2EjBasicRef {
    widget?: Nx2EjMention;
}

export interface StateNx2EjMention<WIDGET_LIBRARY_MODEL extends MentionModel = MentionModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjMentionRef;
}

export class Nx2EjMention<STATE extends StateNx2EjMention = StateNx2EjMention> extends Nx2EjBasic<STATE, Mention> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMention');
    }

    createEjObj(): void {
        this.obj = new Mention(this.state.ej);
    }



}