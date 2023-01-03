import {ListenerAfterUpdate, ListenerAfterUpdate_Event}         from "../../events/ListenerAfterUpdate";
import {createSpinner, DialogUtility, hideSpinner, showSpinner}            from "@syncfusion/ej2-popups";
import {AbstractWidget, addWidgetClass, AfterInitLogicEvent}               from "../../AbstractWidget";
import {AnyScreen}                                                         from "../../AnyScreen";
import {AnyWidget}                                                         from "../../AnyWidget";
import {resolveWidgetArray}                                                from "../../WidgetUtils";
import {Args_WxPanelBase, WxPanelBase}                                     from "./WxPanelBase";
import {DataProvider, DataProviderChangeEvent, DataProviderChangeListener} from "../../../data/DataProvider";
import {Args_WxForm, WxForm}                                               from "../ext/WxForm";
import {ListenerHandler}                                                   from "../../../ListenerHandler";
import {singleRecordDataProvider}                                          from "../../../data/DataProviderUtils";
import {getErrorHandler}                                                   from "../../../CoreErrorHandling";
import {classArgInstanceVal}                                               from "../../../BaseUtils";


export class Args_WxPanelEdit<T = any> extends Args_WxPanelBase {


   /**
    * The record that will be edited in the form
    */
   initial_record: T

   /**
    * The method to be called when the record needs to be saved (inserted or updated)
    */
   saveMethod: (screen: AnyScreen, data: T) => Promise<(T | number | any)>; // invoke update and receive updated record back


   /**
    * If localOnly is set then no updates are sent to the appserver, everything stays on the client.
    * No update events will be triggered either
    * This is used for adding records initially, when updating fields does not make sense yet
    */
   manualSaveMode ?: boolean;

   /**
    * Additional data providers that will be added as children of the main data provider and before the actual visual widgets
    */
   additionalDataProviders ?: DataProvider[];

   /**
    * This method determines whether the record is new AT THE CREATION OF THE SCREEN.
    * If no method is provided, it will use the <code>editable_record == null</code> as a test
    */
   isNewRecord ?: (rec: T) => Promise<boolean>;

   /**
    * This method receives the parameters:
    * <ul>
    *    <li>
    *         <code>editable_record</code> passed in,
    *  </li>
    *  <li>
    *          the result of the <code>isInitialRecordNew()</code> function call on that record
    * </li?
    * </ul>
    *  and allows for initializing different fields based on custom business login in the form.
    *
    *  If not implemented, the default implementation returns the same record as the one passed in (or null)
    *
    */
   initializeRecord ?: (rec: T, isNewRecord: boolean) => Promise<T>;

   /**
    * Defaults to <code>true</code>.
    *
    * If true, on close the current record is checked against the original one or the one returned after the last change. A popup dialog then confirms if the close should continue or not
    *
    * If false, ignores any unsaved changes on close.
    *
    */
   checkIfUnsavedChangesBeforeClose ?: boolean;


   /**
    * Custom implementation of a createSpinner. If not provided, a default version will be used
    * In the implementation, the Syncfusion <code>createSpinner(args: SpinnerArgs, internalCreateElement?: createElementParams): void;</code> must be called
    */
   createSpinner ?: (target: HTMLElement) => void;

   /**
    * Optional parameter to pass in a specific instance of WgtForm_App instance used in this class
    */
   wxForm ?: WxForm;

}

export class SaveResult<REC = any> {
   success: boolean;
   record ?: REC;
   rawResult ?: any;
   exception?: any;
}

export class WxPanelEdit<DATA_TYPE, ARGS_TYPE extends Args_WxPanelEdit<DATA_TYPE> = Args_WxPanelEdit<DATA_TYPE>>
   extends WxPanelBase<DATA_TYPE, ARGS_TYPE> implements DataProviderChangeListener<DATA_TYPE> {
   static readonly CLASS_NAME:string = 'WxPanelEdit';


   private readonly _updateListeners: ListenerHandler<ListenerAfterUpdate_Event, ListenerAfterUpdate> = new ListenerHandler<ListenerAfterUpdate_Event, ListenerAfterUpdate>();
   dataProvider: DataProvider<DATA_TYPE>;
   readonly PROVIDER_NAME: string;

   private _topLevelProvider: DataProvider;
   readonly _additionalProviders: DataProvider[] = [];

   protected _original_record_as_json: string;

   private _isNewRecord: boolean;

   public wxForm: WxForm;

   /**
    * if this is not null, upon entering the screen, this control will get focus
    */
   firstInputField: AnyWidget;

   protected initialize_local_variables_executed: boolean;

   protected constructor() {
      super();
      this.PROVIDER_NAME = this.constructor.name; // the name of the class
   }


   /**
    * This method should be called in makeUI in order to initialize the record related fields and functions (ex: isNewRecord, dataProvider, etc)
    * if the result of those methods is needed in creating the UI.
    *
    * Performs all the local variable initialization but does not contimue to super.initialize.... method
    * This method can safely be called multiple times without damage since it only runs once
    * @param args
    */
   async initialize_local_variables_only(args: ARGS_TYPE) {

      let thisX = this;
      if (thisX.initialize_local_variables_executed)
         return;

      if (!args)
         args = new Args_WxPanelEdit() as any;
      addWidgetClass(args, WxPanelEdit.CLASS_NAME);

      try {
         if (args.checkIfUnsavedChangesBeforeClose == null)
            args.checkIfUnsavedChangesBeforeClose = true; // defaults to true

         if (args.isNewRecord == null)
            args.isNewRecord = thisX.defaultIsInitialRecordNew;

         if (args.initializeRecord == null)
            args.initializeRecord = thisX.defaultInitializeRecord;

         let rec: DATA_TYPE = args.initial_record;
         try {
            thisX._isNewRecord = await args.isNewRecord(rec);

            // give developer a chance to initialize either the new record or the existing record according to business logic
            rec = await args.initializeRecord(rec, thisX._isNewRecord);

         } catch (e) {
            thisX.handleError(e);
         }

         if (rec) {
            thisX.dataProvider = singleRecordDataProvider({record: rec, providerName: thisX.PROVIDER_NAME});

            thisX.dataProvider.addChangeListener(thisX);
            thisX._topLevelProvider = thisX.dataProvider; // default to this

            if (args.additionalDataProviders) {
               for (const additionalProvider of args.additionalDataProviders) {
                  thisX._addProviderInternal(additionalProvider);
               }
            }

            let resolvedChildren:AbstractWidget[] = await resolveWidgetArray(args.children);
            args.children = resolvedChildren;
            this._create_provider_chain(resolvedChildren);

         } else {
            // close dialog and show error message
            setTimeout(() => {
               thisX.closeIfDialog();
               thisX.handleError('No editable record is available!');
            }, 50);
         }
         thisX.updateOriginalData();
      } finally {
         thisX.initialize_local_variables_executed = true;
      }
   }

   /**
    *
    *  Override this method if extending
    * @param args
    */
   async initialize_WxScreen_Edit(args: ARGS_TYPE) {
      let thisX = this;


      await thisX.initialize_local_variables_only(args);
      let resolvedChildren:AbstractWidget[] = args.children as AbstractWidget[]; // this is possible because they are resolved inside the call to initialize_local_variables_only(args)

      thisX.afterInitLogicListeners.add((ev: AfterInitLogicEvent) => {

         if (this.firstInputField) {
            try {
               this.firstInputField?.hgetInput?.focus();
            } catch (error) {
               console.log(error);
            } // don't bother the user with this
         }

         thisX.registerCheckIfUnsavedChangesBeforeClose();

      }); // add after InitLogic Listener


      if (args.wxForm) {
         thisX.wxForm = args.wxForm;
      } else {
         // the most basic of instantiations
         thisX.wxForm = await thisX.instantiateInternalForm();
      }

      thisX.wxForm.children = resolvedChildren;

      if (thisX.dataProvider)
         thisX.dataProvider.children = [thisX.wxForm];

      args.children = [thisX.dataProvider]; // pass in the dataProvider as the child array since it contains all additional providers and widgets

      await thisX._initialize(args);

   }// initialize

   /**
    * Override this method to determine how to instantiate the WxForm instance
    * (Note: this only triggers if an instance is not passed in though the <code>wgtForm</code> parameter in the arguments.)
    */
   protected instantiateInternalForm(formArgs?: Args_WxForm): Promise<WxForm> {
      return WxForm.create(formArgs); // return the Promise directly
   }

   addDataProvider(newProvider: DataProvider): void {
      let children = this._topLevelProvider.children; // get the actual UI widget list
      this._addProviderInternal(newProvider);
      this._create_provider_chain(children);
   }

   private _addProviderInternal(newProvider: DataProvider): void {
      if (!newProvider)
         return;

      newProvider.removeChangeListener(this);
      newProvider.addChangeListener(this);

      // delete all instances of newProvider than might already have been in
      let index: number = -1;
      do {
         index = this._additionalProviders.indexOf(newProvider, 0);

         if (index > -1) {
            delete this._additionalProviders[index];
         }

      } while (index > -1);

      this._additionalProviders.push(newProvider);

   } // _addProviderInternal


   private _create_provider_chain(children: AbstractWidget[]) {
      let thisX = this;

      let currentProvider: DataProvider = thisX.dataProvider
      if (thisX._additionalProviders) {
         for (const additionalProvider of thisX._additionalProviders) {
            currentProvider.children = [additionalProvider];
            currentProvider          = additionalProvider;
         }
      }
      thisX._topLevelProvider  = currentProvider;
      currentProvider.children = children;
   } //_create_provider_chain


   /**
    * Saves (insert or update) the current screen content and returns an object containing the result of the save
    */
   async save(): Promise<SaveResult> {
      let thisX = this;

      if (!await thisX.validate())
         return {
            success:   false,
            exception: 'Validation failed',
         };

      let waitElem = thisX.hget;
      try {

         if (thisX.args?.createSpinner) {
            thisX.args.createSpinner(waitElem);
         } else {
            createSpinner({target: waitElem, type: "Material", label: 'Saving. One moment please...'});
         }

         try {
            showSpinner(waitElem);
         } catch (e) {
            thisX.handleError(e);
         }

         return await this._saveCore();

      } finally {
         try {
            hideSpinner(waitElem);
         } catch (e) {
            thisX.handleError(e);
         }
      }
   } // save

   protected async _saveCore(): Promise<SaveResult> {

      let thisX                  = this;
      let saveResult: SaveResult = await thisX._callArgsSaveFunction();
      if (saveResult.success) {
         // refresh gets triggered even though the dialog might close because the close might be stopped by the user
         // on a beforeClose event, and so the record might still be visible.
         if (saveResult?.record) {
            await thisX.refresh();
         }

      } else {
         getErrorHandler().displayExceptionToUser(saveResult?.exception);
      }
      return saveResult;
   } //_saveCore

   /**
    * When the data in the DataProvider changes, do an immediate POST and refresh
    * @param evt
    */
   //------------------- implement DataProviderChangeListener ----------------------
   async dataProviderChanged(evt: DataProviderChangeEvent<DATA_TYPE>): Promise<void> {
      if (this?.args?.manualSaveMode)
         return; // do not continue to the appserver

      // let record = classArgInstanceVal(evt.dataProvider.dataValue);
      let thisX = this;
      // try {

      let saveResult: SaveResult = await this._callArgsSaveFunction();
      if (saveResult.success) {
         if (saveResult?.record) {
            await thisX.refresh();
         }
      } else {
         if (saveResult?.exception) {
            evt.error    = true;
            evt.errorTxt = saveResult.exception.toString();
            evt.changeFailed(async () => {
               await thisX.refresh();
               getErrorHandler().displayExceptionToUser(saveResult.exception);
            });
         }
      }
   } // dataProviderChanged


   private async _callArgsSaveFunction(): Promise<SaveResult<DATA_TYPE>> {
      if (!this.args.saveMethod) {
         return {success: false, exception: 'No save method defined in arguments'}
      }

      let thisX             = this;
      let record: DATA_TYPE = classArgInstanceVal(thisX.dataProvider.dataValue) as DATA_TYPE;

      try {

         await thisX.beforeSave(record);

         /**
          * This class assumes that the return value is either an integer (how many record have been updated), or
          * the actual updated data record(s) coming back to replace the existing client data.
          */
            // let postResult = await thisX.asyncPostRetValRaw(args);
         let postResult: (DATA_TYPE | number) = await this.args.saveMethod(thisX, record);
         this.updateListeners.fire({
                                      event:            {
                                         data:   postResult,
                                         parent: thisX
                                      },
                                      exceptionHandler: (ev) => {
                                         thisX.handleError(ev);
                                      }
                                   });

         if (postResult != null) {
            // we don't care about any returned number
            if (typeof postResult === 'object') {
               thisX.record = <DATA_TYPE>postResult;
               postResult   = thisX.record; // get the instance of the record in the DataProvider

               let sr: SaveResult = {success: true, record: postResult, rawResult: postResult};
               await thisX.afterSave(sr);
               return sr;
            }
         } else {
            // if postResult == null
            thisX.record       = null;
            postResult         = null;
            let sr: SaveResult = {success: true, record: postResult, rawResult: postResult};
            await thisX.afterSave(sr);
            return sr;
         }

         // for any number
         let sr: SaveResult = {success: true, rawResult: postResult}; // no record came back
         await thisX.afterSave(sr);
         return sr

      } catch (ex) {
         let sr: SaveResult = {success: false, exception: ex}
         await thisX.afterSave(sr);
         return sr
      }

   } // _doSave

   /**
    * Called right before the save is instantiated
    * @param record
    */
   async beforeSave(record: DATA_TYPE) {
   }

   /**
    * Called after a save including after save fails.
    *
    * @param saveResult
    */
   async afterSave(saveResult: SaveResult<DATA_TYPE>) {
   }


   get updateListeners(): ListenerHandler<ListenerAfterUpdate_Event, ListenerAfterUpdate> {
      return this._updateListeners;
   }

   get record(): DATA_TYPE {
      return this.dataProvider?.dataAsSingleRecord();
   }

   set record(newRecord: DATA_TYPE) {
      if (this.dataProvider?.dataValue) {
         if (newRecord) {
            Object.assign(this.dataProvider.dataValue, newRecord); // merge newRecord into dataValue without replacing the object (for things that hold it by reference)
         } else {
            this.dataProvider.dataValue = null;
         }
         this.updateOriginalData(); //saved updated record becomes original
      } else {
         throw('DataProvider dataValue is not yet instantiated!')
      }
   }

   /**
    * Read-only property based on the call to <code>isInitialRecordNew</code> function
    */
   get isNewRecord(): boolean {
      return this._isNewRecord;
   }

   /**
    * Default implementation that simply checks if the record passed in is null or not
    * @protected
    */
   protected async defaultIsInitialRecordNew(rec: DATA_TYPE): Promise<boolean> {
      return rec == null;
   } // defaultIsInitialRecordNew


   /**
    * Default implementation that simply returns the currentRecord parameter.
    * @param rec the initial record passed in <code>this.args.editable_record</code>
    * @param isNewRecord the result of the call to <code>isInitialRecordNew ?: () => Promise<boolean></code> or to <code>protected async defaultIsInitialRecordNew():Promise<boolean></code> if a custom implementation is not provided
    * @protected
    */
   protected async defaultInitializeRecord(rec: DATA_TYPE, isNewRecord: boolean): Promise<DATA_TYPE> {
      return rec;
   }

   /**
    * Updates the contents of thisX._original_record_as_json from the current record
    * (In case any calculations change the content on purpose)
    */

   protected async registerCheckIfUnsavedChangesBeforeClose() {
      let thisX  = this;
      let dialog = thisX.findDialogWindowContainer();
      if (dialog) {
         let bc                        = dialog.initArgs.onBeforeClose;
         dialog.initArgs.onBeforeClose = async (dialogInstance: any): Promise<boolean> => {
            let allowClose: boolean = true;

            try {
               // When ESC is pressed, there is no chance for the current textfield (if any) to trigger a blur to update the data in the record structure.
               // we do this artificially here
               await (document.activeElement as HTMLElement)?.blur()
            } catch (ex2) {
            }

            if (bc)
               allowClose = await bc(dialogInstance);
            if (allowClose) {
               if (thisX.args.checkIfUnsavedChangesBeforeClose) {
                  let currentRecord = thisX.record; // thisX.dataProvider.dataAsSingleRecord();
                  let currentJson   = (currentRecord == null ? '' : JSON.stringify(currentRecord));
                  if (thisX._original_record_as_json != currentJson) {
                     // pop up a warning message


                     let process = new Promise<boolean>((resolve, reject) => {
                        let discardChanges: boolean = false;
                        let confirmDialog           = DialogUtility.confirm({
                                                                               content:       'You have unsaved changes. Are you sure you want to exit?',
                                                                               title:         'Discard changes?',
                                                                               isModal:       true,
                                                                               closeOnEscape: true,
                                                                               isDraggable:   true,
                                                                               cancelButton:  {
                                                                                  text:  'No',
                                                                                  click: (arg, rest) => {
                                                                                     confirmDialog.hide();
                                                                                     resolve(discardChanges);
                                                                                  }
                                                                               },
                                                                               okButton:      {
                                                                                  text:  ' Yes, exit and lose changes',
                                                                                  click: (arg, rest) => {
                                                                                     discardChanges = true;
                                                                                     confirmDialog.hide();
                                                                                     resolve(discardChanges);
                                                                                  }
                                                                               },
                                                                            });
                        confirmDialog.show();
                     });

                     let discardChanges = await process; // pause until the process is done

                     if (!discardChanges) {
                        allowClose = false; // form should not close
                     }

                  } // if (thisX._original_record_as_json != currentJson)
               } // if (thisX.args.checkIfUnsavedChangesBeforeClose)
            } // if (allowClose)
            return allowClose;
         }
      } // if dialog
   } // defaultBeforeClose

   /**
    * Update the contents of  this._original_record_as_json based on the current record
    */
   updateOriginalData() {
      let currentRecord             = this.dataProvider?.dataAsSingleRecord(); // dataprovider could be null if exception thrown
      this._original_record_as_json = (currentRecord == null ? '' : JSON.stringify(currentRecord));
   } // updateOriginalData


   performCloseDialog() {
      let thisX = this;
      thisX.findDialogWindowContainer()?.hide(); //triggers the confirmation prompth if original_data # current data
   } // _doCancel

   /**
    * Validate the current form values using defined rules. Returns true when the form is valid otherwise false
    * Params:
    * @param  selected – Optional parameter to validate specified element.
    */
   async validate(selected?: string): Promise<boolean> {
      return this?.wxForm?.formValidator?.validate();
   }

} // main class