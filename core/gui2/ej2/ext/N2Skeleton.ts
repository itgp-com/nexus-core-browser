import {Skeleton, SkeletonModel} from '@syncfusion/ej2-notifications';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2SkeletonRef extends StateN2EjBasicRef {
    widget?: N2Skeleton;
}

export interface StateN2Skeleton<WIDGET_LIBRARY_MODEL extends SkeletonModel = SkeletonModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SkeletonRef;
}

export class N2Skeleton<STATE extends StateN2Skeleton = StateN2Skeleton> extends N2EjBasic<STATE, Skeleton> {
    static readonly CLASS_IDENTIFIER: string = 'N2Skeleton';

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2Skeleton.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Skeleton(this.state.ej);
    }

    get classIdentifier(): string { return N2Skeleton.CLASS_IDENTIFIER; }

}