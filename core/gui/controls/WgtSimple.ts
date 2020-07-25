import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag}                                         from "../Args_AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {WgtForm}                                                               from "../panels/WgtForm";
import {DataProvider, DataProviderChangeEvent, IDataProviderSimple}            from "../../data/DataProvider";
import {classArgInstanceVal}                                                   from "../../CoreUtils";

export interface ISimpleValue<T> {
   value: T;
   previousValue: T;
   propertyName: string;
}

export class Args_WgtSimple<CONTROLMODEL = any> {
   dataProviderName  ?: string;
   propertyName      ?: string;
   id                ?: string;

   /**
    * Syncfusion style validation
    */
   validation      ?: any;

   /**
    * If this is present,  a new wrapper div is created around the actual input element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej                ?: CONTROLMODEL
}

export abstract class WgtSimple<EJCONTROL, WIDGET_DESCRIPTOR_TYPE extends Args_AnyWidget = Args_AnyWidget, DATA_CLASS = any>
   extends AnyWidget<EJCONTROL, WIDGET_DESCRIPTOR_TYPE, any>
   implements ISimpleValue<DATA_CLASS> {

   abstract value: DATA_CLASS; // findForm

   // abstract getDataProviderSimple(): IDataProviderSimple;

   private _propertyName: string        = null;
   private _previousValue: DATA_CLASS;
   private _stayFocusedOnError: boolean = false;
   argsWgtSimple: Args_WgtSimple;

   wrapperTagID: string;
   labelTagID: string;
   errorTagID: string;

   protected constructor() {
      super();
   }


   initialize_WgtSimple(argsWgtSimple: Args_WgtSimple, argsAnyWidget ?: WIDGET_DESCRIPTOR_TYPE) {
      let thisX = this;
      this.argsWgtSimple = argsWgtSimple;

      //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      this.args_AnyWidgetinitializedListeners.add(
         new class extends Args_AnyWidget_Initialized_Listener {
            argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {

               // initialize the tags so they available in initContentBegin/End
               thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;
               thisX.labelTagID   = `label_${evt.widget.tagId}`;
               thisX.errorTagID   = `error_${evt.widget.tagId}`;

            }
         }
      );

      if (!argsAnyWidget)
         argsAnyWidget = {} as any;

      if ( argsWgtSimple.validation){
         argsAnyWidget.validation = argsWgtSimple.validation;
      }

      if (!argsAnyWidget.colName)
         if (argsWgtSimple.propertyName)
            argsAnyWidget.colName = argsWgtSimple.propertyName;

      if (argsAnyWidget.colName)
         this.propertyName = argsAnyWidget.colName;


      if (!argsAnyWidget.id)
         if (argsWgtSimple.id)
            argsAnyWidget.id = argsWgtSimple.id;

      this.initialize_AnyWidget(argsAnyWidget);

   }

   /**
    * Find the nearest ancestor WgtForm that contains this simple component
    */
   findForm(): WgtForm {
      return this.findAncestor<WgtForm>(
         (instance => {
            return WgtForm.isWgtForm(instance);
         })
      );
   }


   validate(): boolean {
      let form: WgtForm = this.findForm();
      if (form) {
         let formValidator = form.formValidator;
         if (formValidator) {
            if ( this.argsWgtSimple.validation){
               formValidator.addRules( this.name, this.argsWgtSimple.validation);
            }


            if (formValidator.rules) {
               if (formValidator.rules[this.name]) {
                  return formValidator.validate(this.name); // validate this textfield alone
               }
            }
         }
      } // if form
      return true; // validated
   }

   onBlur() {
      let thisX     = this;
      let validated = this.validate();
      if (!validated) {
         if (this.stayFocusedOnError) {
            if (this.hgetInput) {
               this.hgetInput.focus(); // just stay in this field
            }
         }
         return;  // if not validated , don't execute any of the blur code
      } // if (!validated)

      let currentValue = this.value; // get the actual value from the TextBox EJ2 object
      if (currentValue != this.previousValue) {


         // let dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
         let dataProvider = this.getDataProviderSimple();
         if (!dataProvider) {
            this.value = this.previousValue;
            return;
         }


         let record = dataProvider.dataValue;


         if (record) {
            let previousDataValue = record[this.propertyName];

            // make the change
            //TODO: Formatting and validation needed here!!!
            // validation: {email: [true, 'Please enter a valid email!']}
            record[this.propertyName] = currentValue;

            // trigger the change event
            let evt: DataProviderChangeEvent<any> = {
               propertyName:  this.propertyName,
               value:         currentValue,
               previousValue: previousDataValue,
               changeFailed:  (changeFailedFinished) => {
                  // the context of this function could be anything, so we use thisX to be sure
                  record[thisX.propertyName] = previousDataValue;

                  try {
                     if (dataProvider instanceof DataProvider) {
                        dataProvider.refresh();
                     } else {
                        thisX.refresh();
                     }
                  } catch (ex) {
                     thisX.handleError(ex);
                  }

                  if (changeFailedFinished) {
                     try {
                        changeFailedFinished();
                     } catch (ex) {
                        thisX.handleError(ex);
                     }
                  }

               }
            };

            dataProvider.fireChange(evt);
         } // if record

      } // if (currentValue != this.previousValue)
   } // onBlur


   getRecord(): any {
      let dataProvider: IDataProviderSimple = this.getDataProviderSimple()
      if (dataProvider != null) {
         return classArgInstanceVal(dataProvider.dataValue);
      }
      return null;
   }


   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.argsWgtSimple.dataProviderName != null) {
         dataProvider = DataProvider.dataProviderByName(this, this.argsWgtSimple.dataProviderName);
      }
      return dataProvider;
   }

   get previousValue(): DATA_CLASS {
      return this._previousValue;
   }

   set previousValue(value: DATA_CLASS) {
      this._previousValue = value;
   }


   get propertyName(): string {
      return this._propertyName;
   }

   set propertyName(value: string) {
      this._propertyName = value;
   }

   get stayFocusedOnError(): boolean {
      return this._stayFocusedOnError;
   }

   set stayFocusedOnError(value: boolean) {
      this._stayFocusedOnError = value;
   }

} // WgtSimple