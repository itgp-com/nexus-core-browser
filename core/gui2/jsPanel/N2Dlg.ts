// noinspection JSUnusedLocalSymbols,UnnecessaryLocalVariableJS

export interface StateN2DlgRef extends StateN2BasicRef {
    widget?: N2Dlg;
}


export interface StateN2Dlg<DATA_TYPE = any> extends StateN2Basic {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DlgRef;


    /**
     * Original JsPanel options for the dialog.
     *
     * The other matching fields (ex: 'header', 'content') at this level are used to override the options inside here.
     */
    options?: JsPanelOptions;

    /**
     * Optional header for the dialog. If specified,it will override any setting
     * under options.header
     */
    header?: string | HTMLElement | N2 | N2[];

    /**
     * The content of the dialog. It will always override options.content
     */
    content?: N2 | HTMLElement;

    /**
     * Defaults to true;
     *
     * if true, JsPanel front() will be called on the JsPanel in this dialog when created to move the new dialog to the highest z-index order upon opening
     *
     */
    callFront?: boolean;

    /**
     * Defaults to true.
     * if true the content passed to the Dialog will have any {#link N2} component {@link N2.destroy} method called when the dialog is closed
     */
    destroyN2ContentOnClose?: boolean;

    /**
     * Defaults to true.
     * if true the header passed to the Dialog will have any {#link N2} component {@link N2.destroy} method called when the dialog is closed
     */
    destroyN2HeaderOnClose?: boolean;

    /**
     * Defaults to true
     *
     * If true, panel will not be allowed to be 'lost' by dragging too far off the screen.
     *
     * By default :
     *
     *  - top - will stop when the header is at the top,
     *  - bottom - will stop when the header reaches the bottom (header always visible),
     *  - left   - will leave the right-most controlBar width plus 15px visible
     *  - right  - will leave 40px visible
     */
    autoContainment?: boolean;


    /**
     * Called when an N2 dialog is opened (after the content is initialized)
     * The context of the function (variable 'this') is the dialog content
     * @param {N2Evt_Dialog} evt
     */
    onDialogOpen?: (evt ?: N2Evt_Dialog<N2Dlg, N2 | HTMLElement>) => void;

    /**
     * Called when an N2 dialog is closed (after the content is closed).
     * The context of the function (variable 'this') is the dialog content
     *
     * This is called before any user close logic on the Dialog os called, and before the N2 component destroy() method is called.
     *
     * @param {N2Evt_Dialog} evt
     */
    onDialogClose?: (evt ?: N2Evt_Dialog<N2Dlg, N2 | HTMLElement>) => void;

    /**
     * Called when an N2 dialog is opened (after the content is initialized)
     * The context of the function (variable 'this') is the dialog content
     * @param {N2Evt_Dialog} evt
     */
    onDialogBeforeOpen?: (evt ?: N2Evt_Dialog_Cancellable<N2Dlg, N2 | HTMLElement>) => void;

    /**
     * Called when an N2 dialog is closed (after the content is closed).
     *
     * This is called before any user close logic on the Dialog os called
     * The context of the function (variable 'this') is the dialog content
     *
     * @param {N2Evt_Dialog} evt
     */
    onDialogBeforeClose?: (evt ?: N2Evt_Dialog_Cancellable<N2Dlg, N2 | HTMLElement>) => void;

    /**
     * Defaults to false. If set, this dialog will not be included in the open dialogs list
     */
    excludeFromOpenDialogs?: boolean;

    /**
     * Defaults to false. If **true**, the open dialogs icon will be hidden (used by the open dialogs dialog itself for example so you cannot open another oped dialogs window when you're already in one)
     */
    hideOpenDialogsIcon?: boolean;

    /**
     * Defaults to false.
     *
     * If **true**, the dialog will be repositioned when opened
     *
     * Regardless of this flag, the reposition is automatically called when panelSize or contentSize have height/width is set to 'auto'. This is done so because the dialog tries to center itself on the screen without knowing the size of the content - it needs this call
     */
    repositionOnOpen?: boolean;

    /**
     * Defaults to false.
     *
     * If **true**, the dialog cannot be closed by the user. This includes clicking any close icons/buttons
     * or pressing keys like the Escape key. The dialog can only be closed programmatically via the `close()` method.
     * When enabled, both the standard jsPanel close control and the custom `N2DlgCloseIcon` are hidden.
     */
    preventUserClose?: boolean;

} // N2DlgState

// noinspection JSMismatchedCollectionQueryUpdate
export class N2Dlg<STATE extends StateN2Dlg = StateN2Dlg> extends N2Basic<STATE, JsPanel> {
    static readonly CLASS_IDENTIFIER: string = 'N2Dlg';

    static newN2Dlg_Modal(state ?: StateN2Dlg): N2Dlg {
        return null; // will be overridden by the N2Dlg_Modal class
    }

    /**
     * Special constant to indicate a programmatic close for dialogs with preventUserClose enabled.
     * Use this as the argument to .close() to guarantee the dialog will close even if preventUserClose is true.
     *
     * @example
     *   dlg.close(N2Dlg.PROGRAMMATIC_CLOSE_TOKEN);
     */
    static readonly PROGRAMMATIC_CLOSE_TOKEN: symbol = Symbol('N2DlgProgrammaticClose');

    /**
     * True by default but will be set to false if the close needs to be called by the onBeforeOpen event
     * @type {boolean}
     * @private
     */
    private _onDialogBeforeCloseAllowed: boolean = true;

    /**
     * Any original opacity value that was set in the options
     * @type {number}
     * @private
     */
    private _opacity_user_defined: number;

    /**
     * Internal flag to indicate a programmatic close is in progress.
     * @private
     */
    private _programmaticCloseInProgress = false;


    constructor(state ?: STATE) {
        super(state);
    }

    get classIdentifier() {
        return N2Dlg.CLASS_IDENTIFIER;
    }

    protected onStateInitialized(state: STATE): void {
        let thisX = this;
        addN2Class(state.deco, N2Dlg.CLASS_IDENTIFIER);

        // --- 1. Define Defaults & Store User Options ---
        const userOptions: JsPanelOptions = state.options || {};

        const defaultOptions: JsPanelOptions = {
            container: 'window',
            onwindowresize: true,
            onparentresize: true,
            theme: 'var(--app-dialog-header-background-color)',
            borderRadius: CSS_VARS_CORE.app_dialog_border_radius,
            closeOnEscape: true,
            content: '<p>No content to display</p>',
            panelSize: {
                width: '99%',
                height: '99%',
            },
            dragit: {
                cursor: 'move',
                handles: thisX.dragit_handles_string,
                opacity: 0.8,
                disableOnMaximized: true,
            }
        };

        // --- 2. Deep Merge User Options Over Defaults ---
        // A simple deep merge utility to handle nested objects like headerControls, dragit, etc.
        function deepMerge(target: any, source: any) {
            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
                    if (isObject(source[key]) && !isArray(source[key]) && isObject(target[key])) {
                        target[key] = deepMerge(target[key] || {}, source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        }

        state.options = deepMerge(defaultOptions, userOptions);
        let options: JsPanelOptions = state.options;


        // --- 3. Apply N2Dlg-specific logic ---

        //if not set to anything, default to true
        state.destroyN2HeaderOnClose = state.destroyN2HeaderOnClose == null ? true : state.destroyN2HeaderOnClose;
        state.destroyN2ContentOnClose = state.destroyN2ContentOnClose == null ? true : state.destroyN2ContentOnClose;
        state.callFront = state.callFront == null ? true : state.callFront;
        state.autoContainment = state.autoContainment == null ? true : state.autoContainment;


        //---------------- handle preventUserClose configuration ------------------
        if (state.preventUserClose) {
            // Disable ESC key closing, but only if the user did not explicitly set it.
            if (userOptions.closeOnEscape === undefined) {
                options.closeOnEscape = false;
            }

            // Remove the close button, but only if the user did not explicitly configure it.
            if ((userOptions.headerControls as any)?.close === undefined) {
                if (typeof options.headerControls !== 'object' || options.headerControls === null) {
                    options.headerControls = {};
                }
                (options.headerControls as any).close = 'remove';
            }

            // Add onbeforeclose handler to prevent closing by user
            let existingOnBeforeClose = options.onbeforeclose;
            let preventCloseHandler = (panel: JsPanel, status: string, closedByUser?: boolean) => {
                // Only allow close if programmatic flag is set
                if (thisX._programmaticCloseInProgress) {
                    thisX._programmaticCloseInProgress = false;
                    return true;
                }
                return false;
            };

            if (existingOnBeforeClose) {
                if (Array.isArray(existingOnBeforeClose)) {
                    // Prevent adding it multiple times if logic is re-run
                    if (existingOnBeforeClose[0] !== preventCloseHandler) {
                        existingOnBeforeClose.unshift(preventCloseHandler);
                    }
                } else {
                    options.onbeforeclose = [preventCloseHandler, existingOnBeforeClose];
                }
            } else {
                options.onbeforeclose = preventCloseHandler;
            }
        }

        //---------------- add openDialogs header control ------------------

        if (options.headerControls == null)
            options.headerControls = {}; // make sure it exists so we can add add to it
        let headerControls = options.headerControls
        if (!isString(headerControls)) {
            // it;s an object

            if (headerControls.add == null)
                headerControls.add = [];
            let addProperty = headerControls.add;

            let addArray: JsPanelHeaderControlsAdd[] = isArray(addProperty) ? addProperty : [addProperty];
            headerControls.add = addArray;

            if (!state.hideOpenDialogsIcon) {
                // now we add the openDialogs control as the first control (addArray is already added to headerControls so we just modify it here)

                let openDialogsControl: JsPanelHeaderControlsAdd = {
                    //<i class="fa-solid fa-rectangle-list"></i>
                    html: '<i class="fa-regular fa-rectangle-list fa-lg" style="margin: 0 5px;"></i>',
                    name: 'openDialogs',
                    position: 1,
                    handler: (panel: JsPanel, control: HTMLElement) => {

                        let od: N2Dlg;

                        let open_list: OpenN2DlgRow[] = openDialogsList();

                        let rows: any[] = open_list.map((row: OpenN2DlgRow) => {
                            let value = '';
                            let dlg = row.dialog;
                            let jsTitle = dlg.jsPanel.headertitle
                            if (jsTitle) {
                                value = jsTitle.innerHTML;
                            } // if jsTitle

                            let elem = document.createElement('div');
                            elem.innerHTML = value;
                            elem.style.cursor = 'pointer';
                            elem.style.padding = '5px 15px';
                            elem.style.border = `solid 1px var(--app-color-gray-300)`;
                            elem.addEventListener('click', () => {
                                let panel = dlg.jsPanel;
                                if (panel) {
                                    if (panel.status === 'minimized' || panel.status === 'smallified') {
                                        panel.normalize();
                                    }
                                    panel.front();

                                    od.close();
                                } // if panel
                            });
                            return elem;
                        });

                        let content = new N2Column({
                            children: rows,
                        });
                        content.initLogic();


                        setTimeout(async () => {

                            od = N2Dlg.newN2Dlg_Modal({
                                header: 'Open Dialogs',
                                excludeFromOpenDialogs: true, // don't include this dialog in the open dialogs list
                                hideOpenDialogsIcon: true, // don't show the open dialogs icon in this dialog
                                options: {
                                    content: content.htmlElement,
                                    panelSize: {
                                        height: 'auto',
                                        width: 'auto'
                                    },
                                    closeOnEscape: true,
                                    closeOnBackdrop: true,
                                } as any
                            });
                            od.show();
                        });


                    },
                    afterInsert: (control: any) => {
                    },
                };
                addArray.unshift(openDialogsControl); // add first


            } // if !state.hideOpenDialogsIcon

        } // if !isString(headerControls)


        //----------------------- Custom N2Dlg dragit options that include the whole headerbar ---------------
        // This is now handled by the defaultOptions merge logic above. This block can be removed.


        //------------- autoContainment  (one more section under the main callback) ----------------
        let f_autoContainment: JsPanelOptions_Resizeit_Function = (panel2, paneldata, event) => {

            let options2 = panel2.options as JsPanelOptions; // outside options variable is NOT the same as inside panel2 options

            // first thing it does
            let elem_panel = panel2 as any as HTMLElement;
            let total_height = elem_panel.offsetHeight;
            let total_width = elem_panel.offsetWidth;
            let header_height = panel2.headerbar.offsetHeight;

            const left_visible: number = 40;

            // Get the jsPanel controlbar
            const controlBar = elem_panel.querySelector('.jsPanel-controlbar');
            const controlBarRect = controlBar.getBoundingClientRect();

            // Get the jsPanel headerbar
            const headerBar = elem_panel.querySelector('.jsPanel-headerbar');
            const headerBarRect = headerBar.getBoundingClientRect();

            // Calculate width from the left-most pixel of controlbar to the right border of headerbar
            const control_bar_width = headerBarRect.right - controlBarRect.left;

            const right_visible = control_bar_width; // leave 15 px past control bar so we can grab the resize handle of the header

            let containment: number[] = [0, left_visible - total_width, 0 - (total_height - header_height), (15 - (total_width - right_visible))];
            if (options2.dragit != false) {
                options2.dragit = options2.dragit || {};
                (options2.dragit as JsPanelOptions_Dragit).containment = containment; // set the containment
            }

            let panel2Elem = panel2 as any as HTMLElement;
            let rec: DOMRect = panel2Elem?.getBoundingClientRect();
            if (rec && rec.top < 0) {
                panel2Elem.style.top = '0px'; // move window back to top
            }

        } // f_autoContainment

        if (state.autoContainment) {
            if (options.resizeit != false) {
                if (options.resizeit == true)
                    options.resizeit = null; // 'true' not allowed
                options.resizeit = options.resizeit || {}

                let resizeit = options.resizeit as JsPanelOptions_Resizeit;
                let x = resizeit.stop;
                let resizeit_stop_array: JsPanelOptions_Resizeit_Function[];
                if (x) {
                    if (isArray(x)) {
                        resizeit_stop_array = x as JsPanelOptions_Resizeit_Function[];
                    } else {
                        resizeit_stop_array = [x as JsPanelOptions_Resizeit_Function];
                    }
                } else {
                    resizeit_stop_array = [];
                } // if x

                resizeit_stop_array.unshift(f_autoContainment);
                resizeit.stop = resizeit_stop_array;

            } // if options.resizeit

            let onsmallified_functions = (options.onsmallified || []) as OnSmallified[];
            onsmallified_functions.unshift((panel: JsPanel, status: string) => {
                f_autoContainment(panel, null, null);
                return true;
            });
            options.onsmallified = onsmallified_functions;

            let onunsmallified_functions = (options.onunsmallified || []) as OnUnsmallified[];
            onunsmallified_functions.unshift((panel: JsPanel, status: string) => {
                f_autoContainment(panel, null, null);
                return true;
            });
            options.onunsmallified = onunsmallified_functions;


        } // if state.autoContainment


        //--------------- content -----------------
        let n2: N2;
        if (state.content) {
            if (state.content instanceof HTMLElement) {
                state.options.content = state.content;
            } else {
                // only choice is N2
                n2 = (state.content as N2);
                state.options.content = n2.htmlElement;
            } // if content is N2

        } // if state.content

        // convert callback to an array if it's not one already, or leave null if null
        if (options.callback != null) {
            if (isArray(options.callback)) {
                // do nothing
            } else {
                options.callback = [options.callback] as any; // make an array out of it
            }
        } // if state.callback

        let f_callbacks: JsPanelCallback[] = options.callback as any as JsPanelCallback[]; // higher code ensured it would be null or an array
        options.callback = (panel: JsPanel) => {
            // this is the earliest we can get to the panel object
            thisX.obj = panel; // this will execute before the jsPanel.create returns

            if (n2) {
                try {
                    n2.initLogic();
                } catch (e) {
                    console.error(e);
                }
            }

            if (state.autoContainment) {
                if (f_callbacks == null)
                    f_callbacks = [];

                // add at the very beginning
                f_callbacks.unshift((panel2: JsPanel) => {

                    // run auto-containment if there is a header
                    let panelElem = panel2 as any as HTMLElement;
                    const controlBar = panelElem.querySelector(".jsPanel-controlbar");
                    const headerBar = panelElem.querySelector(".jsPanel-headerbar");
                    if (controlBar && headerBar) {
                        let panel_data: JsPanelOptions_PanelData = {
                            height: panel2.content.offsetHeight,
                            width: panel2.content.offsetWidth,
                            left: panel2.content.offsetLeft,
                            top: panel2.content.offsetTop
                        }
                        f_autoContainment(panel2, panel_data, null);
                    } // if (controlBar && headerBar)
                }); // add the autoContainment function as the first callback

            } // if state.autoContainment

            if (f_callbacks) {
                try {
                    f_callbacks.forEach(f => {
                        if (f)
                            f.call(panel, panel)
                    }); // keep JsPanel object as 'this' in the callback and as its argument
                } catch (e) {
                    console.error(e);
                }
            } // if f_callbacks


        } // callback (initial, when dialog opens)


        //------------------ initial visibility -------------------
        thisX._opacity_user_defined = options.opacity; // could be null
        // make the panel invisible until the content is initialized
        options.opacity = 0; // panel is now invisible


        //------------------ close behavior and events ----------------
        let onbeforeclose_user_defined: OnBeforeClose[] = null;
        try {
            let x = options.onbeforeclose;
            if (x) {
                if (isArray(x)) {
                    onbeforeclose_user_defined = x as OnBeforeClose[];
                } else {
                    onbeforeclose_user_defined = [x as OnBeforeClose];
                }
            } // if x
        } catch (e) {
            console.error(e);
        }


        options.onbeforeclose = (panel: JsPanel, status: string) => {
            if (thisX._onDialogBeforeCloseAllowed) {

                //---------------------- try the onDialogBeforeClose event in the content ----------------
                try {
                    if (isN2_Interface_Dialog_BeforeClose(thisX.state.content)) {
                        try {
                            let evt: N2Evt_Dialog_Cancellable<N2Dlg> = {
                                dialog: this,
                                widget: thisX.state.content as any,
                                native_event: null,
                                cancel: false
                            };
                            thisX.state.content.onDialogBeforeClose.call(thisX.state.content, evt);
                            if (evt.cancel) {
                                return false; // do not allow the close
                            }
                        } catch (e) {
                            console.error('N2Dlg.onStateInitialized: error calling onDialogBeforeClose on content', e);
                        }
                    }
                } catch (e) {
                    thisX.handleError(e);
                }

                //--------------- try the onDialogBeforeClose event in the N2Dlg state event itself ----------------
                try {
                    if (thisX.state.onDialogBeforeClose) {
                        let evt: N2Evt_Dialog_Cancellable<N2Dlg> = {
                            dialog: thisX,
                            widget: thisX.state.content as any,
                            native_event: null,
                            cancel: false
                        };
                        thisX.state.onDialogBeforeClose.call(thisX.state.content, evt);
                        if (evt.cancel) {
                            return false; // do not allow the close
                        }
                    }
                } catch (e) {
                    console.error(e);
                }

                // if we got here it means the user did not cancel the close

                if (onbeforeclose_user_defined) {
                    try {

                        // loop over all the user defined functions and if any of them return false, do not allow the close

                        for (let i = 0; i < onbeforeclose_user_defined.length; i++) {
                            let f = onbeforeclose_user_defined[i];
                            if (f(panel, status) === true) {
                                return true; // close it since at least one function allowed it (see JsPanel documentation https://jspanel.de/#options/onbeforeclose : first return true, closes , does not give subsequent functions chance to even execute)
                            }
                        }
                    } catch (e) {
                        console.error('N2Dlg.onStateInitialized: error calling onbeforeclose_user_defined', e);
                    }
                    return false; // do not allow the close since none of the defined functions returned true

                } // if (thisX._onDialogBeforeCloseAllowed)

            } // if (thisX._onDialogBeforeCloseAllowed)

            return true; // allow the close
        }; // onbeforeclose

        let onclose_user_defined: OnClosed[] = [];

        try {
            let x = options.onclosed;
            if (x) {
                // x != null
                if (isArray(x)) {
                    onclose_user_defined = x as OnClosed[];
                } else {
                    onclose_user_defined = [x as OnClosed];
                }
            }// if x
        } catch (e) {
            console.error(e);
        }

        options.onclosed = onclose_user_defined;

        // add the onDialogClose call as the very first function (it's always reached) and return **true** to allow the rest
        // of the function array (if any) to execute
        onclose_user_defined.unshift((panel: JsPanel, closedByUser: boolean) => {

            //------------ Trigger the onDialogClose event in the content ----------------
            try {
                if (isN2_Interface_Dialog_Close(state.options.content)) {
                    try {
                        let evt: N2Evt_Dialog = {
                            dialog: thisX,
                            widget: thisX.state.content as any,
                            native_event: {panel: panel, closedByUser: closedByUser}
                        };
                        state.options.content.onDialogClose.call(state.options.content, evt);
                    } catch (e) {
                        console.error('N2Dlg.options.onclosed: error calling onDialogClose on content', e);
                    }
                }
            } catch (e) {
                console.error(e);
            }

            //------------ Trigger the onDialogClose event in the N2Dlg state event itself ----------------
            try {
                if (thisX.state.onDialogClose) {
                    thisX.state.onDialogClose.call(thisX.state.content, {
                        dialog: thisX,
                        widget: thisX.state.content as any,
                        native_event: {panel: panel, closedByUser: closedByUser}
                    });
                }
            } catch (e) {
                console.error(e);
            }

            openDialogsRemove(thisX); // remove this dialog from the list of open dialogs

            //------------ Trigger the onDialogClose event in the N2Dlg state event itself ----------------
            try {
                thisX.destroy();
            } catch (e) {
                console.error('N2Dialog._headerN2: error destroying N2Dialog', e);
            }

            return true;
        });

        // This is now handled by the defaultOptions merge logic above. This block can be removed.


        super.onStateInitialized(state);
    } // onStateInitialized


    onLogic(args: N2Evt_OnLogic): void {
        let thisX = this;

        let opacity_user_defined = thisX._opacity_user_defined;

        document.addEventListener("jspanelloaded", _ev => {
                let ev: JsPanel_DocumentEvent = _ev as any as JsPanel_DocumentEvent;


// ----- start is reposition call necessary ? ----------
                // Set of CSS keyword values
                const cssKeywordValues = new Set(['auto', 'fit-content', 'max-content', 'min-content', 'inherit', 'initial', 'unset']);

                // Helper function to check if a value is a keyword string
                function isKeywordValue(value: string | number | ((panel: JsPanel) => string | number)): boolean {
                    return typeof value === 'string' && cssKeywordValues.has(value);
                }

                let call_reposition: boolean = thisX?.state?.repositionOnOpen || false;

                if (call_reposition == false) {
                    if (thisX.state?.options?.panelSize) {
                        let panelSize = thisX.state.options.panelSize;
                        if (isObject(panelSize) && (isKeywordValue(panelSize?.width) || isKeywordValue(panelSize?.height))) {
                            call_reposition = true;
                        }
                    } // if thisX.state?.options?.panelSize

                    if (call_reposition == false) {
                        if (thisX.state?.options?.contentSize) {
                            let contentSize = thisX.state.options.contentSize;
                            if (isObject(contentSize) && (isKeywordValue(contentSize?.width) || isKeywordValue(contentSize?.height))) {
                                call_reposition = true;
                            }
                        } // if thisX.state?.options?.contentSize
                    } // if call_reposition == false
                } // if call_reposition

                if (call_reposition) {
                    try {
                        setTimeout(() => {
                            thisX.obj.reposition(); // reposition the dialog (but only after it shows up - so setTimeout)
                        })
                    } catch (e) {
                        console.error(e);
                    }
                }
//----------------- end is reposition call necessary ? ----------------


                let content = thisX.state.content as any;
                if (content == null) {
                    content = thisX.state.options.content as any;
                }

                try {
                    if (content && isN2_Interface_Dialog_Open(content)) {

                        try {
                            let evt: N2Evt_Dialog<N2Dlg> = {
                                dialog: thisX,
                                widget: content as any,
                                native_event: ev
                            };
                            content.onDialogOpen.call(content, evt);
                        } catch (e) {
                            console.error('N2Dlg.onStateInitialized: error calling onDialogOpen on content', e);
                        }
                    } // if (isN2_Interface_Dialog_Open(content))
                } catch (e) {
                    console.error(e);
                }


                if (thisX.state.onDialogOpen) {
                    thisX.state.onDialogOpen.call(content, {dialog: thisX, widget: content as any, native_event: ev});
                }


            }, // listener
            {
                //The listener will handle only the first "jspanelloaded" event and will not respond to subsequent ones. This behavior ensures that jsPanel.processCallbacks is called just once for the first panel loaded, and no duplicate callback executions occur.
                once: true, //  instructs the browser to automatically remove the event listener after it has been triggered once.
            }, //options
        );

        thisX.createJsPanel.call(thisX);
        // at this point thisX.obj is set to jsPanel

        if (thisX.state?.excludeFromOpenDialogs !== true)
            openDialogsAdd(thisX); // add this dialog to the list of open dialogs (if not already there)

        try {
            thisX.refreshHeaderLogo(); // set the header logo
        } catch (e) {
            console.error(e);
        }

        try {
            thisX.refreshHeaderTitle(); // set the header
        } catch (e) {
            console.error(e);
        }


        let state = thisX.state;

        state.options = thisX.obj.options; // update the options with the ACTUAL options used by the JsPanel object
        let options = state.options; // update the options with the ACTUAL options used by the JsPanel object

        let panel: JsPanel = thisX.jsPanel;


        if (state.callFront)
            thisX.obj.front();

        if (thisX.obj) {
            if (thisX.state.deco && thisX.obj instanceof HTMLElement) {
                try {
                    decoToHtmlElement(thisX.state.deco, thisX.obj as HTMLElement); // thisX.obj is HTMLElement because JsPanel is an HTMLElement
                } catch (e) {
                    console.error(e);
                }
            } // if thisX.state.deco && thisX.obj instanceof HTMLElement

            (thisX.obj as any)[N2_CLASS] = thisX; // stamp the N2 object on the jsPanel object
        } // if thisX.obj


        // super.onStateInitialized(state);

        super.onLogic(args);

        //------- First try the onDialogBeforeOpen event in the content ----------------
        try {
            let content: any = thisX.state.content as any;
            if (!content) {
                content = thisX.state.options.content as any;
            }


            if (content && isN2_Interface_Dialog_BeforeOpen(content)) {
                try {
                    let evt: N2Evt_Dialog_Cancellable<N2Dlg, N2 | HTMLElement> = {
                        dialog: thisX,
                        widget: content as any,
                        native_event: {panel: panel},
                        cancel: false
                    };
                    content.onDialogBeforeOpen.call(content, evt);
                    if (evt.cancel) {
                        thisX.state.options.opacity = opacity_user_defined; // restore the original opacity even though it does not matter (in case user reuses that object)
                        thisX._onDialogBeforeCloseAllowed = false;
                        thisX.obj.close(); // immediately close the dialog
                        thisX._onDialogBeforeCloseAllowed = true; // just in case the object is reused
                        return;
                    }
                } catch (e) {
                    console.error('N2Dialog.onStateInitialized: error calling thisX.state.content.onDialogBeforeOpen on this.state.content', e);
                }
            }
        } catch (e) {
            thisX.handleError(e);
        }
        //------------------ try the onDialogBeforeOpen event in the content ----------------
        try {
            if (thisX.state.onDialogBeforeOpen) {
                try {

                    let content: any = thisX.state.content as any;
                    if (!content) {
                        content = thisX.state.options.content as any;
                    }

                    let evt: N2Evt_Dialog_Cancellable<N2Dlg, N2 | HTMLElement> = {
                        dialog: thisX,
                        widget: content as any,
                        native_event: {panel: panel},
                        cancel: false
                    };
                    thisX.state.onDialogBeforeOpen.call(content, evt);
                    if (evt.cancel) {
                        thisX.state.options.opacity = opacity_user_defined; // restore the original opacity even though it does not matter (in case user reuses that object)
                        thisX._onDialogBeforeCloseAllowed = false;
                        thisX.obj.close(); // immediately close the dialog
                        thisX._onDialogBeforeCloseAllowed = true; // just in case the object is reused
                        return;
                    }
                } catch (e) {
                    console.error('N2Dialog.onStateInitialized: error calling thisX.state.onDialogBeforeOpen on content', e);
                }
            }
        } catch (e) {
            thisX.handleError(e);
        }


        thisX.state.options.opacity = opacity_user_defined; // restore the original opacity even though it does not matter (in case user reuses that object)
        // the JsPanel object is really an HTMLElement with extra properties
        (thisX.obj as any as HTMLElement).style.opacity = (opacity_user_defined == null ? '1.0' : '' + opacity_user_defined); // make the panel visible (or whatever the user initially specified)

    } // onLogic


    createJsPanel(): void {
        this.obj = jsPanel.create(this.state.options) as JsPanel;
    }


    public onDestroy(args: N2Evt_Destroy): void {

        try {
            if (this.obj) {
                (this.obj as any)[N2_CLASS] = null; // remove the stamp
                this.obj = null; // remove the reference
            }
        } catch (e) {
            console.error(e);
        }

        super.onDestroy(args);


        try {
            if (this.state.destroyN2ContentOnClose && isN2(this.state.content)) {
                (this.state.content as N2).destroy();
            }
        } catch (e) {
            console.error(e);
        }

        try {
            if (this.state.destroyN2HeaderOnClose && isN2(this.state.header)) {
                (this.state.header as N2).destroy();
            }
        } catch (e) {
            console.error(e);
        }

    } // onDestroy

    get jsPanel(): JsPanel {
        this.initLogic(); // just in case (it doesn't hurt to run repeatedly, it only executes ones, it returns immediately after)
        return this.obj;
    }

    show(callback ?: (panel: JsPanel, status: string) => void): void {
        this.initLogic();
        let jsPanel = this.jsPanel;
        if (jsPanel && jsPanel.status !== 'closed') {

            if (jsPanel.status !== 'normalized')
                jsPanel.normalize(callback);

            jsPanel.front();
        }
    }

    /**
     * Closes the dialog. If preventUserClose is true, only closes if called programmatically.
     * @param token If you pass N2Dlg.PROGRAMMATIC_CLOSE_TOKEN, the dialog will close even if preventUserClose is true.
     * @example
     *   dlg.close(N2Dlg.PROGRAMMATIC_CLOSE_TOKEN); // always closes
     *   dlg.close(); // closes only if preventUserClose is not true
     */
    close(token?: unknown): void {
        if (this.state.preventUserClose) {
            if (token === N2Dlg.PROGRAMMATIC_CLOSE_TOKEN) {
                this._programmaticCloseInProgress = true;
                this.jsPanel?.close();
                return;
            }
            // If preventUserClose is true and no token, do not close
            return;
        }
        this.jsPanel?.close();
    }


    get dragit_handles_string(): string {
        return `.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr, .${CSS_CLASS_N2DLG_HEADERBAR_FRONT_SPACER}, .${CSS_CLASS_N2DLG_HEADERBAR_END_SPACER}`;
    }

    /**
     * Refresh the header of the dialog based on the contents of state.options.headerTitle
     */
    refreshHeaderTitle(): void {
        let state = this.state;

        // -------  state header overrides options.headerTitle ----------------

        let headerArray: Elem_or_N2[] = [];

        if (state.header != null) {
            if (state.header == '') {
                // do nothing
            } else if (typeof state.header === 'string') {
                headerArray.push(new N2Html({value: state.header}));
            } else if (state.header instanceof HTMLElement) {
                headerArray.push(new N2Html({value: state.header}));
            } else if (isArray(state.header)) {
                headerArray.push(...(state.header as N2[]));
            } else {
                // only choice is N2
                let n2: N2 = (state.header as N2);
                headerArray.push(n2);
            } // if header is N2
        } // if state.header != null

        if (state.options.headerTitle) {
            if (isFunction(state.options.headerTitle)) {
                let val = null;
                try {
                    val = state.options.headerTitle.call(this);
                } catch (e) {
                    console.error(e);
                }
                if (val) {
                    headerArray.push(new N2Html({value: val}));
                }
            } else if (isHTMLElement(state.options.headerTitle)) {
                headerArray.push(new N2Html({value: state.options.headerTitle as HTMLElement}));
            } else if (isString(state.options.headerTitle)) {
                headerArray.push(new N2Html({value: state.options.headerTitle as string}));
            }
        } else {
            let filler = document.createElement('div');
            filler.classList.add(CSS_CLASS_N2Dlg_empty_header);
            filler.innerHTML = '&nbsp;'; // space so it has a height when rendered
            headerArray.push(filler);
        } // if state.options.headerTitle

        let headerRow = new N2Row({children: headerArray});
        headerRow.initLogic();
        this.jsPanel.setHeaderTitle(headerRow.htmlElement);
    }// refreshHeaderTitle

    refreshHeaderLogo(): void {
        // ----------------- header logo (close icon) ------------

        let state = this.state;

        let headerElements: HTMLElement[] = [];

        // Only add the close icon if preventUserClose is not enabled
        if (!state.preventUserClose) {
            /*
             The close icon is always the first element in the logo and its cursor is a pointer.
             Any headerLogo specified in the options will be placed after it.
             */
            let n2DlgCloseIcon = new N2DlgCloseIcon({value: null, dialog: this});
            n2DlgCloseIcon.initLogic();
            headerElements.push(n2DlgCloseIcon.htmlElement);
        } // if !state.preventUserClose

        let ohl: string | HTMLElement = state.options.headerLogo;
        let logoElem: HTMLElement = null;
        if (ohl) {
            if (isString(ohl)) {
                if (!ohl.startsWith('<')) {
                    // documentations says that if it starts with '<' it's HTML, otherwise it's a image url
                    let imgElem = document.createElement('img');
                    imgElem.src = ohl;
                    logoElem = imgElem;
                } else {
                    logoElem = htmlToElement(ohl as string)
                }
            } else {
                // HTMLElement
                logoElem = ohl as HTMLElement;
            } // if isString(ohl)
        } // if ohl

        if (logoElem) {
            headerElements.push(logoElem);
        }

        let headerLogoElem: HTMLElement;

        if (headerElements.length > 1) {
            let logoRow = new N2Row({children: headerElements});
            logoRow.initLogic();
            headerLogoElem = logoRow.htmlElement;
        } else if (headerElements.length === 1) {
            headerLogoElem = headerElements[0];
        } else {
            // No elements to display
            headerLogoElem = null;
        }

        if (headerLogoElem) {
            this.jsPanel.setHeaderLogo(headerLogoElem);
        }
    } //    refreshHeaderLogo


} // class N2Dlg

export function isN2Dlg(n2dlg: any): n2dlg is N2Dlg {
    return typeof n2dlg === 'object' && n2dlg !== null &&
        n2dlg?.classIdentifier === N2Dlg.CLASS_IDENTIFIER;
} // isN2Dlg

/**
 * Is this object a JsPanel object?
 *
 * @returns {boolean} false if null or not a JsPanel based on duck typing for functions 'front', 'smallify', 'unsmallify'
 */
export function isJsPanel(obj: any): obj is JsPanel {
    return obj &&
        obj.front && isFunction(obj.front) &&
        obj.smallify && isFunction(obj.smallify) &&
        obj.unsmallify && isFunction(obj.unsmallify);
}


export const CSS_CLASS_N2DLG_HEADERBAR: string = `${N2Dlg.CLASS_IDENTIFIER}_headerbar`;
export const CSS_CLASS_N2DLG_HEADERBAR_FRONT_SPACER: string = `${N2Dlg.CLASS_IDENTIFIER}_headerbar_front_spacer`;
export const CSS_CLASS_N2DLG_HEADERBAR_END_SPACER: string = `${N2Dlg.CLASS_IDENTIFIER}_headerbar_end_spacer`;

themeChangeListeners().add((ev) => {
    // document.documentElement.style.fontSize = 'var(--app-font-size-regular)';
    window.jsPanel.ziBase = 1000; // Syncfusion components start at 1000 so this must match


    let f_createPanelTemplate_default = jsPanel.createPanelTemplate;
    jsPanel.createPanelTemplate = function (args: any) {
        let panel = f_createPanelTemplate_default.call(jsPanel, args);


        let headerbar = panel.querySelector('.jsPanel-headerbar') as HTMLElement;
        if (headerbar) {

            panel.classList.add(CSS_CLASS_N2DLG_HEADERBAR);

            let frontSpacer = htmlToElement(`<div class="${CSS_CLASS_N2DLG_HEADERBAR_FRONT_SPACER}"></div>`);
            headerbar.insertBefore(frontSpacer, headerbar.firstChild);

            let endSpacer = htmlToElement(`<div class="${CSS_CLASS_N2DLG_HEADERBAR_END_SPACER}"></div>`);
            headerbar.appendChild(endSpacer);
        } // if headerbar


        return panel;
    }


    cssAddSelector(`.${N2Dlg.CLASS_IDENTIFIER} .jsPanel-hdr`, `
       font-family: var(--app-font-family);
       font-size: var(--app-font-size-regular);
    `);

    cssAddSelector(`.${N2Dlg.CLASS_IDENTIFIER} .jsPanel-content`, `
       font-family: var(--app-font-family);
       font-size: var(--app-font-size-regular);
    `);


    cssAddSelector(`.${N2Dlg.CLASS_IDENTIFIER} .jsPanel-headerbar`, `
        padding: 0;
        border-bottom: 5px solid var(--material-accent-color);
    `);

    cssAddSelector(`.${N2Dlg.CLASS_IDENTIFIER} .jsPanel-titlebar`, `
        font-size: var(--app-font-size-regular) !important;
    `);

    cssAddSelector(`.${N2Dlg.CLASS_IDENTIFIER} .jsPanel-titlebar .jsPanel-title`, `
        font-variant: unset,
    `);

    // make the back arrow invisible when the dialog is minimized
    cssAddSelector(`.jsPanel-replacement .jsPanel-headerlogo .${N2DlgBackArrow.CLASS_IDENTIFIER}`, `
        display:none
    `);


    cssAddSelector(`.${N2Dlg.CLASS_IDENTIFIER} .jsPanel-controlbar`, `
        margin: 3px 0;
    `);

    cssAddSelector(`.${CSS_CLASS_N2DLG_HEADERBAR_FRONT_SPACER}`, `
        min-width:5px;
        min-height: 20px;
    `);
    cssAddSelector(`.${CSS_CLASS_N2DLG_HEADERBAR_END_SPACER}`, `
        min-width:6px;
        min-height: 20px;
    `);

    // gray border around black header so that when borders overlap we can tell which window is which
    cssAddSelector(`.${CSS_CLASS_N2DLG_HEADERBAR} .jsPanel-hdr-dark`, `
        border: solid 0.1px var(--app-color-gray-600);
    `);

}, 10); // themeChangeListeners().add


//------------------------ OpenDialogs ----------------------------


interface OpenN2DlgRow {
    dialog: N2Dlg;
    timestamp: Date;
}

const openDialogs: OpenN2DlgRow[] = [];


function openDialogsExists(n2Dlg: N2Dlg): boolean {
    return openDialogs.some(row => row?.dialog === n2Dlg);
}

function openDialogsAdd(n2Dlg: N2Dlg): void {
    try {
        if (!openDialogsExists(n2Dlg))
            openDialogs.push({dialog: n2Dlg, timestamp: new Date()});
    } catch (e) {
        console.error(e);
    }
} // add

function openDialogsRemove(n2Dlg: N2Dlg): void {
    try {
        let index = openDialogs.findIndex(row => row.dialog === n2Dlg);
        if (index >= 0)
            openDialogs.splice(index, 1);
    } catch (e) {
        console.error(e);
    }
} // remove

// parameter is optional comparator function that uses OpenN2DlgDialog to sort the openDialogs List
function openDialogsList(comparator?: (a: OpenN2DlgRow, b: OpenN2DlgRow) => number): OpenN2DlgRow[] {

    if (comparator) {
        openDialogs.sort(comparator);
    }
    return openDialogs;
} // openDialogsList

// ------------------ end OpenDialogs ----------------------------


import {isArray, isFunction, isObject, isString} from 'lodash';
import {htmlToElement} from '../../BaseUtils';
import {CSS_CLASS_N2Dlg_empty_header, N2_CLASS} from '../../Constants';
import {isHTMLElement} from '../../CoreUtils';
import {cssAddSelector} from '../../CssUtils';
import {N2Column} from '../generic/N2Column';
import {N2Html} from '../generic/N2Html';
import {
    isN2_Interface_Dialog_BeforeClose,
    isN2_Interface_Dialog_BeforeOpen,
    isN2_Interface_Dialog_Close,
    isN2_Interface_Dialog_Open,
    N2Evt_Dialog,
    N2Evt_Dialog_Cancellable
} from '../generic/N2Interface_Dialog';
import {N2Row} from '../generic/N2Row';
import {N2, N2Evt_Destroy, N2Evt_OnLogic} from '../N2';
import {N2Basic, StateN2Basic, StateN2BasicRef} from '../N2Basic';
import {addN2Class, decoToHtmlElement} from '../N2HtmlDecorator';
import {Elem_or_N2, isN2} from '../N2Utils';
import {CSS_VARS_CORE} from '../scss/vars-material';
import {themeChangeListeners} from '../Theming';
import {jsPanel} from './jsPanelLib';
import {N2DlgBackArrow} from './N2DlgBackArrow';
import {N2DlgCloseIcon} from "./N2DlgCloseIcon";