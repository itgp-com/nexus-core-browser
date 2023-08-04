import {Skeleton, SkeletonModel} from "@syncfusion/ej2-notifications";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSkeletonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSkeleton;
}

export interface StateNx2EjSkeleton<WIDGET_LIBRARY_MODEL extends SkeletonModel = SkeletonModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSkeletonRef;
}

export class Nx2EjSkeleton<STATE extends StateNx2EjSkeleton = StateNx2EjSkeleton> extends Nx2EjBasic<STATE, Skeleton> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSkeleton');
    }

    createEjObj(): void {
        this.obj = new Skeleton(this.state.ej);
    }



}