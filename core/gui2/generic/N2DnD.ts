export class N2DnD {

    static readonly CLASS_IDENTIFIER: string = 'N2DnD';
    static readonly DATA_TRANSFER_JSON = 'application/json';

    public static dragData: any;
    public static evtDragStart: DragEvent;
    public static evtDragOverTarget: HTMLElement;
    public static customDragImage: HTMLElement | null = null;     // To store custom drag image element if any
    public static dropIndicator: HTMLElement | null = null;

    static dragEnteredMap: Map<string, HTMLElement> = new Map();

    public static readonly CSS_CLASSES = {
        DRAGGING: 'n2dnd-dragging',
        DRAGOVER: 'n2dnd-dragover',

    }

    public static cleanup() {
        N2DnD.dragData = null;
        N2DnD.evtDragStart = null;
        N2DnD.evtDragOverTarget = null;
        N2DnD.customDragImage = null;
        N2DnD.dropIndicator = null;
        N2DnD.dragEnteredMap.clear();
    }


    public static handleDragStart<STATE, RECORD_DATA>(ev: N2DnD_OnDragStart<STATE, RECORD_DATA>): any {
        try {

            N2DnD.cleanup(); // just in case
            document.addEventListener('dragend', N2DnD.handleGlobalDragEnd); // Ensure dragend is always handled

            N2DnD.evtDragStart = ev.event;
            N2DnD.dragData = ev.data;
            ev.event.dataTransfer.setData(N2DnD.DATA_TRANSFER_JSON, JSON.stringify(ev.data));

            let state = ev.state as any;
            if (state?.onDragStart && typeof state.onDragStart === 'function')
                state.onDragStart.call(this, ev as any);
        } catch (e) {
            console.error('handleDragStart error', e);
            return e;
        }
        return null;
    } // handleDragStart


    public static handleDrag<STATE>(ev: N2DnD_OnDrag<STATE>): any {
        try {
            let state = ev.state as any;
            if (state?.onDrag && typeof state.onDrag === 'function')
                state.onDrag.call(this, ev as any);
        } catch (e) {
            console.error('handleDrag error', e);
            return e;
        }
        return null;
    } // handleDragStart


    public static handleDragEnd<STATE, RECORD_DATA>(ev: N2DnD_OnDragEnd<STATE, RECORD_DATA>): any {
        try {

            // Remove dragging class from all rows
            const draggingElements = document.querySelectorAll(`.${N2DnD.CSS_CLASSES.DRAGGING}`);
            draggingElements.forEach(el => el.classList.remove(N2DnD.CSS_CLASSES.DRAGGING));


            N2DnD.removeCustomDragImage();
            N2DnD.removeDropIndicator();


            let state = ev.state as any;
            if (state?.onDragEnd && typeof state.onDragEnd === 'function')
                state.onDragEnd.call(this, ev as any);

        } catch (e) {
            console.error('handleDragEnd error', e);
            return e;
        } finally {
            N2DnD.cleanup();
        }
        return null;
    } // handleDragEnd


    public static removeCustomDragImage() {

        // Remove custom drag image if any
        if (N2DnD.customDragImage) {
            N2DnD.customDragImage.remove();
            N2DnD.customDragImage = null;
        }
    }

    public static removeDropIndicator() {
        if (N2DnD.dropIndicator) {
            N2DnD.dropIndicator.remove();
            N2DnD.dropIndicator = null;
        }
    }


    static getUniqueKey(target: HTMLElement): string {
        if (!target)
            return null;

        let mapKey: string = target.id;

        if (!mapKey)
            mapKey = target.dataset.n2dndKey;

        if (!mapKey) {
            mapKey = getRandomString();
            target.dataset.n2dndKey = mapKey;
        }

        return mapKey;
    }


    public static handleDragEnter<STATE extends StateN2DnD<RECORD_TYPE, DRAGGED_DATA_TYPE>, RECORD_TYPE, DRAGGED_DATA_TYPE extends N2DnD_DraggedData<RECORD_TYPE>>(param: N2DnD_OnDragEnter<STATE, DRAGGED_DATA_TYPE>): any {
        let event: DragEvent = param.event;
        event.preventDefault(); // Necessary to allow drop

        let target: HTMLElement = event.currentTarget as HTMLElement;
        let target_key = (target? N2DnD.getUniqueKey(target): null);

        // first do the workaround and clear any previous dragover targets (fire leave on all leftover components, then delete them)
        if (N2DnD.dragEnteredMap.size > 0) {
            N2DnD.dragEnteredMap.forEach((value, key) => {
                if (key != target_key) {
                    try {
                        N2DnD.handleDragLeave({
                            state: param.state,
                            data: param.data,
                            event: null,
                            event_dragstart: param.event_dragstart,
                            current_target: value,
                            is_leave_not_fired_workaround: true
                        });

                    } catch (e) {
                        console.error('handleDragEnter error', e);
                    }
                } // if (key != target_key)
            });

            // there should be nothing left because handleDragLeave should have removed them all, but just in case
            N2DnD.dragEnteredMap.clear();
        } // if (N2DnD.dragEnteredMap.size > 0)


        if (target) {
            target.classList.remove(N2DnD.CSS_CLASSES.DRAGOVER);
            target.classList.add(N2DnD.CSS_CLASSES.DRAGOVER);
        }


        try {

            let state: STATE = param.state;
            if (state?.onDragEnter)
                state.onDragEnter.call(this, param as any);

        } catch (e) {
            console.error('handleDragEnter error', e);
            return e;
        } finally {
            // add this component to work around the dragover target not being removed
            if (target)
                N2DnD.dragEnteredMap.set(N2DnD.getUniqueKey(target), target);
        }
        return null;
    } // handleDragEnter


    public static handleDragOver<STATE extends StateN2DnD<RECORD_TYPE, DRAGGED_DATA_TYPE>, RECORD_TYPE, DRAGGED_DATA_TYPE extends N2DnD_DraggedData<RECORD_TYPE>>(param: N2DnD_OnDragOver<STATE, DRAGGED_DATA_TYPE>): any {
        let event: DragEvent = param.event_dragover_current;
        try {

            event.preventDefault();
            event.dataTransfer!.dropEffect = 'move';

            const current_target = event.currentTarget as HTMLElement;

            // Check if the mouse is actually over the target element
            const rect = current_target.getBoundingClientRect();
            if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            ) {
                // Mouse is not over the target element, do not show drop indicator
                return;
            }

            // Prevent showing the drop indicator when dragging over the item(s) being dragged
            if (current_target.classList.contains(N2DnD.CSS_CLASSES.DRAGGING)) {
                return;
            }

            // let previous_target = N2DnD.evtDragOverTarget;

            // N2DnD.evtDragOver = event;
            N2DnD.evtDragOverTarget = event.currentTarget as HTMLElement;

            let state: STATE = param.state;

            // Trigger drag over callback
            if (state.onDragOver)
                state.onDragOver.call(this, param as any);

        } catch (e) {
            console.error('handleDragOver error', e);
            return e;
        } finally {
        }

        return null;
    } /// handleDragOver


    public static handleDragLeave<STATE extends StateN2DnD<RECORD_TYPE, DRAGGED_DATA_TYPE>, RECORD_TYPE, DRAGGED_DATA_TYPE extends N2DnD_DraggedData<RECORD_TYPE>>(param: N2DnD_OnDragLeave<STATE, DRAGGED_DATA_TYPE>): any {
        let event: DragEvent = param.event;
        if (event)
            event.preventDefault(); // Necessary to allow drop

        let target: HTMLElement = (param.current_target ? param.current_target : event?.currentTarget as HTMLElement);
        if (target)
            target.classList.remove(N2DnD.CSS_CLASSES.DRAGOVER);

        try {

            let state: STATE = param.state;
            if (state?.onDragLeave)
                state.onDragLeave.call(this, param as any);

        } catch (e) {
            console.error('handleDragLeave error', e);
            return e;
        } finally {
            if (target)
                N2DnD.dragEnteredMap.delete(N2DnD.getUniqueKey(target));
        }
        return null;
    } // handleDragLeave


    public static handleOnDrop<STATE, DND_DRAGGED_DATA>(ev: N2DnD_OnDrop<STATE, DND_DRAGGED_DATA>): any {
        try {

            ev.event.preventDefault();

            let state = ev.state as any;
            if (state?.onDrop && typeof state.onDrop === 'function')
                state.onDrop.call(this, ev as any);

            let target = ev.current_target as HTMLElement;
            if (target != null) {
                target.classList.remove(N2DnD.CSS_CLASSES.DRAGOVER); // ensure dragover class is removed
            } // if ( target != null)
            // console.log('handleOnDrop', target?.outerHTML);
        } catch (e) {
            console.error('handleOnDrop error', e);
            return e;
        } finally {
            N2DnD.removeDropIndicator();
        }

        return null;
    } // handleOnDrop


    static handleGlobalDragEnd = () => {
        try {

            // Remove custom drag image if any
            if (N2DnD.customDragImage) {
                N2DnD.customDragImage.remove();
                N2DnD.customDragImage = null;
            }
        } catch (error) {
            console.error('Error handling global drag end:', error);
        } finally {
            document.removeEventListener('dragend', N2DnD.handleGlobalDragEnd);
        }
    };


}


export interface StateN2DnD<
    RECORD_TYPE = any,
    DRAGGED_DATA_TYPE extends N2DnD_DraggedData<RECORD_TYPE> = N2DnD_DraggedData<RECORD_TYPE>
> {

    //-------------  These 3 events fire on the SOURCE element ----------------

    onDragStart?: (params: N2DnD_OnDragStart<any, DRAGGED_DATA_TYPE>) => void;

    onDrag?: (params: N2DnD_OnDrag<any>) => void;

    onDragEnd?: (params: N2DnD_OnDragEnd<any, DRAGGED_DATA_TYPE>) => void;

    //-------------  The rest of the events fire on the TARGET element ----------------

    onDragEnter?: (params: N2DnD_OnDragEnter<any, DRAGGED_DATA_TYPE>) => void;

    /**
     * Fires while the dragging continues over the target (including the times when onDragOver_onEntry and onDragOver_onExit are also fired)
     * @param {N2DnD_OnDragOver<any, RECORD_TYPE, DRAGGED_DATA_TYPE>} params
     */
    onDragOver?: (params: N2DnD_OnDragOver<any, DRAGGED_DATA_TYPE>) => void;

    onDragLeave?: (params: N2DnD_OnDragLeave<any, DRAGGED_DATA_TYPE>) => void;

    /**
     * Fires when the dragged item(s) is dropped on the target
     * @param {N2DnD_OnDrop<any, DRAGGED_DATA_TYPE>} params
     */
    onDrop?: (params: N2DnD_OnDrop<any, DRAGGED_DATA_TYPE>) => void;

    // /**
    //  * Fires only when the dragover target changes, but not while the dragging continues over the target
    //  * @param {N2DnD_OnDragOver<any, RECORD_TYPE, DRAGGED_DATA_TYPE>} params
    //  */
    // onDragOver_OnEntry?: (params: N2DnD_OnDragOver<any, RECORD_TYPE, DRAGGED_DATA_TYPE>) => void;
    //
    // /**
    //  * Fires only when the dragover target changes (the previous target is exited), but not while the dragging continues over the target
    //  * @param {N2DnD_OnDragOver<any, RECORD_TYPE, DRAGGED_DATA_TYPE>} params
    //  */
    // onDragOver_OnExit?: (params: N2DnD_OnDragOver<any, RECORD_TYPE, DRAGGED_DATA_TYPE>) => void;
}

// interface StateN2Dnd


export interface N2DnD_DraggedData<RECORD_TYPE> {

    /**
     * class name of the object
     */
    obj_class: string;
    /**
     * The version of the object class. Optional.  Defaults to 0.
     */
    obj_ver?: number;

    /**
     * Array of the records behind the visual item(s) being dragged
     */
    items: RECORD_TYPE[];

} // interface N2DnD_DraggedData

//---------- Events on Drag Source ----------------

export interface N2DnD_OnDragStart<STATE, DRAGGED_DATA_TYPE> {
    state: STATE;
    data: DRAGGED_DATA_TYPE;
    event: DragEvent;
}

export interface N2DnD_OnDrag<STATE> {
    state: STATE;
    event: DragEvent;
} // interface N2DnD_OnDrag

export interface N2DnD_OnDragEnd<STATE, DRAGGED_DATA_TYPE> {
    state: STATE;
    data: DRAGGED_DATA_TYPE;
    event: DragEvent;
} // interface N2DnD_OnDragEnd


//---------- Events on Drag Target ----------------


export interface N2DnD_OnDragEnter<STATE, N2_DRAGGED_DATA> {
    state: STATE;
    data: N2_DRAGGED_DATA;
    event: DragEvent;
    event_dragstart: DragEvent;
    current_target: HTMLElement;
}

export interface N2DnD_OnDragOver<STATE, N2_DRAGGED_DATA> {
    state: STATE;
    data: N2_DRAGGED_DATA;
    event_dragover_current: DragEvent;
    event_dragstart: DragEvent;
    current_target: HTMLElement;
    previous_target: HTMLElement;
}

export interface N2DnD_OnDragLeave<STATE, N2_DRAGGED_DATA> {
    state: STATE;
    data: N2_DRAGGED_DATA;
    /**
     * The actual DragEvent fired for dragLeave by the browser.
     *
     * **CAUTION**: this can by null if `is_leave_not_fired_workaround`  is true  (this event was synthetically generated as a workaround and there is no real DragEvent from the browser)
     *
     */
    event: DragEvent;
    event_dragstart: DragEvent;
    current_target: HTMLElement;
    /**
     * Exists only when this event is synthetically generated as a workaround (dragLeave did not fire properly).
     * When it's set to true, the 'event' property will be null (since there is no browser event)
     */
    is_leave_not_fired_workaround?: boolean;
}

export interface N2DnD_OnDrop<STATE, DND_DRAGGED_DATA> {
    state: STATE;
    data: DND_DRAGGED_DATA;
    event: DragEvent;
    current_target: HTMLElement;
}

import {getRandomString} from "../../BaseUtils";