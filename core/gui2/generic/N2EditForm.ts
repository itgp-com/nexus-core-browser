export interface StateEditForm<T extends any = any> extends StateN2PanelLayout {
    record?: T;
    /**
     * If true, pressing the Enter key will trigger the save button if it is enabled.
     * The keydown event is attached to the EditForm's main element, so it should not interfere with other panels.
     */
    enterToSave?: boolean;
} // StateEditForm


export abstract class EditForm<REC extends any = any, STATE extends StateEditForm<REC> = StateEditForm<REC>> extends N2PanelLayout<STATE> implements N2Interface_Dialog<N2Dialog | N2Dlg, EditForm<REC>> {
    protected record_clone: REC;
    protected dialog: N2Dialog | N2Dlg;
    closeAfterSave: boolean = true;
    protected btnSave: N2;
    protected btnCancel: N2;
    protected _isNewlyCreatedRecord: boolean = false;

    public allowForceClose: boolean = false;

    // New status tracking
    private _status: EditFormStatus = EditFormStatus.EDITING;
    private _saveError: Error | null = null;
    private _wasForceClosedWithChanges: boolean = false;
    private _saveInProgress: boolean = false;

    //---------- start abstact methods ---------------

    /**
     * Creates a new record instance with default values.
     * This method is called when no record is provided in the state (state.record == null) during construction.
     * Override this method to return a new instance of your record type with appropriate default values.
     * @returns {REC} A new record instance with default values
     * @protected
     */
    protected abstract createNewRecord(): REC ;

    /**
     * Validates the current form state and returns whether the form is valid.
     * This method should check all form fields and business rules to determine if the record can be saved.
     * It's typically called before attempting to save the record and may display validation messages to the user.
     * @returns {boolean} true if the form is valid and can be saved, false otherwise
     * @protected
     */
    protected abstract isValid(): boolean;

    /**
     * Override this method to implement the actual save logic for your form.
     * This method should only be called from within doSave() - never call this directly.
     * The doSave() method provides proper status tracking and error handling.
     * @protected
     */
    protected abstract save_implementation(): Promise<void>;

    //---------- end abstract methods ----------------

    constructor(state ?: STATE) {
        super(state);

        if (state.record == null) {
            state.record = this.createNewRecord();
            this._isNewlyCreatedRecord = true;
        } // if

        try {
            this.record_clone = this.cloneRecord();
        } catch (e) {
            console.error(e);
        } // try-catch

    } // constructor

    isNewlyCreatedRecord(): boolean {
        return this._isNewlyCreatedRecord;
    } // isNewlyCreatedRecord

    protected onStateInitialized(state: STATE): void {
        this.btnSave = this.createBtnSave();
        this.btnCancel = this.createBtnCancel();
        state.center = state.center || this.center_panel();
        state.top = state.top || this.top_panel();
        state.stateTopContainer = state.stateTopContainer || {
            deco: {
                // classes: [CSS_CLASS_orca_green_accent_bar_very_light],
                style: {
                    // 'background-color': `var(--app-color-gray-700)`, // very light green
                    // 'color': 'white',
                    'background-color': `var(--app-color-panel-background)`,
                    'color': `var(--app-color-text)`,
                }
            }
        };
        state.bottom = state.bottom || this.bottom_panel();
        state.left = state.left || this.left_panel();
        state.right = state.right || this.right_panel();
        super.onStateInitialized(state);

        if (state.enterToSave) {
            this.htmlElement.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    // prevent default action (like form submission if it was a real form)
                    e.preventDefault();
                    // check if save button is enabled
                    if (this.btnSave && this.btnSave.obj && !this.btnSave.obj.disabled) {
                        this.doSave();
                    }
                }
            });
        }
    } // onStateInitialized

    protected dialog_title(): string | HTMLElement | N2 {
        return this.title();
    } // dialog_title

    /**
     * Override this method to provide a custom title for the dialog, leave null or undefined to not have a title
     * @return {string}
     * @protected
     */
    protected title(): string | HTMLElement | N2 {
        return undefined;
    } // title

    /**
     * Override this method to clone the record in a custom fashion.
     * The default implementation uses lodash's cloneDeep
     * @protected
     */
    protected cloneRecord(): REC {
        return _.cloneDeep(this.state?.record) as REC;
    } // cloneRecord

    /**
     * Returns the cloned contents of the original record. This record is used to determine if the current record has changed.
     * @return {REC} a copy of the original record
     * @protected
     */
    originalRecordByValue(): REC {
        return this.cloneRecord()
    } // originalRecordByValue

    /**
     * Override this method to provide custom logic to determine if the record has changed.
     * The default implementation uses lodash's isEqual
     * @return {boolean}
     * @protected
     */
    public isChanged(): boolean {
        return !_.isEqual(this.state.record, this.record_clone);
    } // isChanged

    /**
     * Override this method to provide custom logic to merge the updated record into the original record.
     * The default implementation uses lodash's merge
     * @param updated_record
     * @protected
     */
    protected mergeRecord(updated_record: REC): void {
        try {
            _.merge(this.state.record, updated_record);
        } catch (e) {
            console.error(e);
        } // try-catch
    } // mergeRecord

    public onDialogBeforeClose(evt: N2Evt_Dialog_Cancellable<N2Dialog | N2Dlg, EditForm<REC>>): void {
        if (this.allowForceClose)
            return; // no more checking (after confirming save without change for example)
        if (this.isChanged()) {
            this.confirmSaveChanges(evt);
        } else {
            if (this.status == EditFormStatus.EDITING) {
                // If we're still in the original editing state and no changes were made,
                this._status = EditFormStatus.CLOSED_NO_CHANGES;
            }
        } // if
    } // onDialogBeforeClose

    public onDialogBeforeOpen(evt?: N2Evt_Dialog_Cancellable<N2Dialog | N2Dlg, EditForm<REC>>): void {
    } // onDialogBeforeOpen

    public onDialogClose(evt?: N2Evt_Dialog<N2Dialog | N2Dlg, EditForm<REC>>): void {
    } // onDialogClose

    public onDialogOpen(evt?: N2Evt_Dialog<N2Dialog | N2Dlg, EditForm<REC>>): void {
        let thisX: EditForm<any> = evt.widget; // this is the actual EditForm
        thisX.dialog = evt.dialog;
        thisX.allowForceClose = false; // just in case we're reusing a form in a dialog

        let title = thisX.dialog_title();
        if (evt.dialog instanceof N2Dialog) {
            addClassesToElement(evt.dialog.htmlElementAnchor, 'no-padding');
            evt.dialog.state.header = title;
            (evt.dialog).headerRefresh();

            (evt.dialog.obj.element.querySelector('.e-dlg-content') as HTMLElement).style.padding = '0px';
        } else {
            if (_.isString(title)) {
                ((evt.dialog as N2Dlg).obj as JsPanel).setHeaderTitle(title);
            } else if (_.isElement(title)) {
                ((evt.dialog as N2Dlg).obj as JsPanel).setHeaderTitle(title as HTMLElement);
            } else if (isN2(title)) {
                title.initLogic(); // initialize HTML and JS
                ((evt.dialog as N2Dlg).obj as JsPanel).setHeaderTitle(title.htmlElement);
            } else {
                // do nothing, title is undefined
            } // if-else
        } // if-else
    } // onDialogOpen

    protected center_panel(): N2 | HTMLElement {
        return undefined;
    } // center_panel

    protected top_panel(): N2 | HTMLElement {

        let children: Elem_or_N2[] = [];
        let title = this.title();
        if (_.isString(title)) {
            children.push(new N2Html({
                deco: {
                    style: {
                        'font-size': 'var(--app-font-size-section-title)',
                        'font-weight': 'bold',
                    }
                },
                value: title
            }));
        } else if (_.isElement(title)) {
            children.push(title as HTMLElement);
        } else if (_.isArray(title)) {
            let titleRow = new N2Row({
                deco: {
                    style: {
                        'gap': '2px',
                        'justify-content': 'left',
                    }
                },
                children: title as N2[],
            });
            children.push(titleRow);
        } else if (isN2(title)) {
            children.push(title);
        } else {
            // do nothing, title is undefined
        } // if-else

        return new N2Row({
            deco: {
                style: {
                    padding: '4px 10px 0 10px',
                },
            },
            children: children,
        });
    } // top_panel

    protected bottom_panel(): N2 | HTMLElement {
        return this.panelSaveCancel();
        // return undefined;
    } // bottom_panel

    protected left_panel(): N2 | HTMLElement {
        return undefined;
    } // left_panel

    protected right_panel(): N2 | HTMLElement {
        return undefined;
    } // right_panel

    protected confirmSaveChanges(evt: N2Evt_Dialog_Cancellable) {
        let thisX = this;
        try {
            let yes_clicked = false;
            let confirmation_dialog = DialogUtility.confirm({
                title: 'Exit without saving?',
                content: 'Are you sure you want to exit without saving?',
                okButton: {
                    text: 'Yes',
                    click: async () => {
                        thisX.allowForceClose = true;
                        thisX._status = EditFormStatus.CANCELLED_WITH_CHANGES;
                        thisX._wasForceClosedWithChanges = true;
                        yes_clicked = true;
                        confirmation_dialog.close();
                        if (thisX.dialog instanceof N2Dialog) {
                            (thisX.dialog as N2Dialog).obj.hide();
                        } else {
                            (thisX.dialog as N2Dlg).jsPanel.close()
                        } // if-else
                    }, // click
                },
                cancelButton: {
                    text: 'No',
                },
                closeOnEscape: true,
                showCloseIcon: true,
                animationSettings: {effect: 'FadeZoom'},
                isModal: true,
                close: () => {
                    if (!yes_clicked) {
                        thisX._status = EditFormStatus.EDITING; // Reset to editing state
                    } // if
                }, // close
            });

            confirmation_dialog.show()
        } catch (e) {
            console.error(e);
        } finally {
            evt.cancel = true;
        } // try-catch-finally
    } // confirmSaveChanges

    protected showChangeFeedback(ev ?: { callIsValid?: boolean }): void {
        try {
            ev = ev || {};
            if (ev.callIsValid === undefined || ev.callIsValid === null)
                ev.callIsValid = true;

            if (ev.callIsValid) {
                let valid = this.isValid();
                if (!valid) {
                    this.btnSave.obj.disabled = true; // disable save if not valid
                    return;
                } // if (!this.isValid())
            } // if ev.callIsValid

            if (this.btnSave instanceof N2Button && this.btnSave.obj)
                this.btnSave.obj.disabled = !this.isChanged(); // disabled if no change, enabled if changed
        } catch (e) {
            console.error('EditForm.showChangeFeedback', e);
        } // try-catch
    } // showChangeFeedback

    // Getter for current status
    public get status(): EditFormStatus {
        return this._status;
    } // get status

    // Getter for save error details
    public get saveError(): Error | null {
        return this._saveError;
    } // get saveError

    // Check if form was closed without saving
    public wasClosedWithoutSaving(): boolean {
        return this._status === EditFormStatus.CANCELLED_NO_CHANGES ||
            this._status === EditFormStatus.CANCELLED_WITH_CHANGES ||
            this._status === EditFormStatus.CLOSED_NO_CHANGES;
    } // wasClosedWithoutSaving

    // Check if save was successful
    public wasSaveSuccessful(): boolean {
        return this._status === EditFormStatus.SAVED;
    } // wasSaveSuccessful

    /**
     * Check if the form was force closed with unsaved changes
     * @returns {boolean} true if user confirmed closing despite having unsaved changes
     */
    public wasForceClosedWithChanges(): boolean {
        return this._wasForceClosedWithChanges;
    } // wasForceClosedWithChanges

    /**
     * Check if the form was cancelled by user action (not programmatic)
     * @returns {boolean} true if user explicitly cancelled the form
     */
    public wasCancelledByUser(): boolean {
        return this._status === EditFormStatus.CANCELLED_NO_CHANGES ||
            this._status === EditFormStatus.CANCELLED_WITH_CHANGES;
    } // wasCancelledByUser

    protected createBtnSave(): N2 {
        let thisX = this;

        return new N2Button({
            deco: {
                style: {
                    'border-radius': '20px',
                }
            },
            ej: {
                isPrimary: true,
                disabled: !this.isChanged(),
            },
            label: '<span><i class="fa-solid fa-floppy-disk"></i>&nbsp;Save</span>',
            onclick: async (_evt: any) => {
                await thisX.doSave();
            }, // onclick
        });
    } // createBtnSave

    protected createBtnCancel(): N2 {
        let thisX = this;
        return new N2Button({
            deco: {
                style: {
                    'border-radius': '20px',
                }
            },
            label: '<span><i class="fa-regular fa-circle-xmark"></i>&nbsp;Cancel</span>',
            onclick: async (_evt: any) => {
                thisX.doCancel();
            }, // onclick
        });
    } // createBtnCancel

    /**
     * Call this method to programmatically save the form.
     * This method provides proper status tracking, validation, and error handling,
     * and wraps the protected save() implementation method.
     * @public
     */
    public async doSave(): Promise<void> {
        if (!this.allowForceClose) {
            if (!this.isValid())
                return;
        } // if

        try {
            this.saveInProgress = true;
            await this.save_implementation();
            this._status = EditFormStatus.SAVED;
            this._saveError = null;

            try {
                this.record_clone = this.cloneRecord();
            } catch (e) {
                console.error(e);
            }

            if (this.closeAfterSave) {
                this.closeDialog();
            } // if closeAfterSave

        } catch (e) {
            this._status = EditFormStatus.SAVE_FAILED;
            this._saveError = e as Error;
            console.error(e);
            alert("There was a problem with the save. Please check the browser console output for details.");
        } // try-catch
        finally {
            this.saveInProgress = false;
        }
    } // doSave

    /**
     * Call this method to programmatically cancel the form and close surrounding dialog.
     * This method respects the change confirmation flow - if there are unsaved changes,
     * it will show the confirmation dialog. Use forceCancel() to bypass confirmation.
     * @public
     */
    public doCancel(): void {
        if (this.isChanged()) {
            // Simulate the dialog close event to trigger confirmation
            const mockEvent: N2Evt_Dialog_Cancellable<N2Dialog | N2Dlg, EditForm<REC>> = {
                cancel: false,
                dialog: this.dialog,
                widget: this,
                native_event: undefined
            };
            this.confirmSaveChanges(mockEvent);
        } else {
            this._status = EditFormStatus.CANCELLED_NO_CHANGES;
            this.closeDialog();
        } // if-else
    } // doCancel

    /**
     * Call this method to programmatically force close the form without any confirmation,
     * regardless of whether there are unsaved changes.
     * @public
     */
    public forceCancel(): void {
        this.allowForceClose = true;
        if (this.isChanged()) {
            this._status = EditFormStatus.CANCELLED_WITH_CHANGES;
            this._wasForceClosedWithChanges = true;
        } else {
            this._status = EditFormStatus.CANCELLED_NO_CHANGES;
        } // if-else
        this.closeDialog();
    } // forceCancel

    /**
     * Call this method to programmatically close the form only if there are no changes.
     * If there are changes, this method does nothing and returns false.
     * @returns {boolean} true if the form was closed, false if there were unsaved changes
     * @public
     */
    public closeIfNoChanges(): boolean {
        if (!this.isChanged()) {
            this._status = EditFormStatus.CLOSED_NO_CHANGES;
            this.closeDialog();
            return true;
        } // if
        return false;
    } // closeIfNoChanges

    protected closeDialog(): void {
        if (this.dialog instanceof N2Dialog) {
            this.dialog.hide();
        } else {
            (this.dialog as N2Dlg).close();
        } // if-else
    } // closeDialog

    protected panelSaveCancel(): N2 {
        return new N2Row({
            deco: {
                style: {
                    'padding-top': '20px',
                    'padding-bottom': '5px',
                    'gap': '20%',
                    'justify-content': 'center',
                }
            },
            children: [
                this.btnSave,
                this.btnCancel,
            ]
        });
    } // panelSaveCancel

    public get cancelled(): boolean {
        return this._status === EditFormStatus.CANCELLED_NO_CHANGES ||
            this._status === EditFormStatus.CANCELLED_WITH_CHANGES;
    } // get cancelled


    get saveInProgress(): boolean {
        return this._saveInProgress;
    }

    set saveInProgress(value: boolean) {
        this._saveInProgress = value;
    }
} // EditForm

export enum EditFormStatus {
    /** Form is currently being edited */
    EDITING = 'editing',
    /** Form was successfully saved */
    SAVED = 'saved',
    /** Save operation failed */
    SAVE_FAILED = 'save_failed',
    /** Form was cancelled/closed without changes */
    CANCELLED_NO_CHANGES = 'cancelled_no_changes',
    /** Form was cancelled/closed with unsaved changes (user confirmed) */
    CANCELLED_WITH_CHANGES = 'cancelled_with_changes',
    /** Form was closed programmatically without changes */
    CLOSED_NO_CHANGES = 'closed_no_changes'
} // EditFormStatus


import {DialogUtility} from '@syncfusion/ej2-popups';
import _ from 'lodash';
import * as console from "node:console";
import {N2Button} from '../ej2/ext/N2Button';
import {N2Dialog} from '../ej2/ext/N2Dialog';
import {N2Dlg} from '../jsPanel/N2Dlg';
import {N2} from '../N2';
import {addClassesToElement} from '../N2HtmlDecorator';
import {Elem_or_N2, isN2} from '../N2Utils';
import {N2Html} from './N2Html';
import {N2Evt_Dialog, N2Evt_Dialog_Cancellable, N2Interface_Dialog} from './N2Interface_Dialog';
import {N2PanelLayout, StateN2PanelLayout} from './N2PanelLayout';
import {N2Row} from './N2Row';