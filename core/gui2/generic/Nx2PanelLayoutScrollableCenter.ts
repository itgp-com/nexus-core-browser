import {cssAddClass} from '../../CoreUtils';
import {nexusMain} from '../../NexusMain';
import {Nx2Basic} from '../Nx2Basic';
import {addNx2Class} from '../Nx2HtmlDecorator';
import {Nx2Panel, StateNx2Panel} from './Nx2Panel';
import {StateNx2PanelLayout} from './Nx2PanelLayout';


export const CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER = 'Nx2PanelLayoutScrollableCenter';
export const CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_TOP = CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER + '_top';
export const CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_LEFT = CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER + '_left';
export const CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_CENTER = CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER + '_center';
export const CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_RIGHT = CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER + '_right';
export const CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_BOTTOM = CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER + '_bottom';

nexusMain.UIStartedListeners.add(async () => {
    cssAddClass(CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER, {
        display: 'grid',
        'grid-template-rows': 'auto 1fr auto',
        'grid-template-columns': 'auto 1fr auto',
        height: '100%',
        width: '100%',
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_TOP, {
        'grid-row': '1',
        'grid-column': '1 / span 3',
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_LEFT, {
        'grid-row': 2,
        'grid-column': 1,
    });

    cssAddClass(CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_CENTER, {
        'grid-row': 2,
        'grid-column': 2,
        overflow: 'auto',
    });


    cssAddClass(CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_RIGHT, {
        'grid-row': 2,
        'grid-column': 3,
    });

    cssAddClass(CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_BOTTOM, {
        'grid-row': '3',
        'grid-column': '1 / span 3',
    });

});


export class Nx2PanelLayoutScrollableCenter<STATE extends StateNx2PanelLayout = StateNx2PanelLayout> extends Nx2Basic<STATE> {
    constructor(state ?: STATE) {
        super(state);
    }


    private _top: Nx2Panel;
    private _left: Nx2Panel;
    private _center: Nx2Panel;
    private _right: Nx2Panel;
    private _bottom: Nx2Panel;


    protected onStateInitialized(state: STATE): void {

        addNx2Class(state.deco, CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER);


        let topState: StateNx2Panel = {
            tagId: state.tagId + '_top',
            deco: {
                classes: [CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_TOP],
            }
        };
        if ( state.top )
            topState.children = [state.top];
        this._top = new Nx2Panel(topState);


        let leftState: StateNx2Panel = {
            tagId: state.tagId + '_left',
            deco: {
                classes: [CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_LEFT],
            }
        }
        if ( state.left )
            leftState.children = [state.left];
        this._left = new Nx2Panel(leftState);


        let centerState: StateNx2Panel = {
            tagId: state.tagId + '_center',
            deco: {
                classes: [CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_CENTER],
            }
        }
        if ( state.center )
            centerState.children = [state.center];
        this._center = new Nx2Panel(centerState);


        let rightState: StateNx2Panel = {
            tagId: state.tagId + '_right',
            deco: {
                classes: [CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_RIGHT],

            }
        }
        if ( state.right )
            rightState.children = [state.right];
        this._right = new Nx2Panel(rightState);

        let bottomState: StateNx2Panel = {
            tagId: state.tagId + '_bottom',
            deco: {
                classes: [CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_BOTTOM],
            }
        }
        if ( state.bottom )
            bottomState.children = [state.bottom];
        this._bottom = new Nx2Panel(bottomState);

        state.children = [
            this.top,
            this.left,
            this.center,
            this.right,
            this.bottom,
        ];

        super.onStateInitialized(state);
    }

    //   public onHtml(args: Nx2Evt_OnHtml): HTMLElement {
    //       let state = this.state;
    //
    //       let x = `
    // <div class="${state.tagId}" class="${CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER}">
    //   <div class="${state.tagId}_top" class="${CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_TOP}"></div>
    //   <div class="${state.tagId}_left" class="${CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_LEFT}"></div>
    //   <div class="${state.tagId}_center" class="${CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_CENTER}"></div>
    //   <div class="${state.tagId}_right" class="${CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_RIGHT}"></div>
    //   <div class="${state.tagId}_bottom" class="${CLASS_NX2_PANEL_LAYOUT_SCROLLABLE_CENTER_BOTTOM}"></div>
    // </div>
    // `;
    //       return htmlToElement(x);
    //   }


    public get top(): Nx2Panel {
        return this._top;
    }

    public get left(): Nx2Panel {
        return this._left;
    }

    public get center(): Nx2Panel {
        return this._center;
    }

    public get right(): Nx2Panel {
        return this._right;
    }

    public get bottom(): Nx2Panel {
        return this._bottom;
    }
}