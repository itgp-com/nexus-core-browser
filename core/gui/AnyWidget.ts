import {BaseListener}                                                                                                    from "../BaseListener";
import {classArgInstanceVal, getRandomString, IArgs_HtmlTag, IArgs_HtmlTag_Utils, StringArg, stringArgVal, voidFunction} from "../BaseUtils";
import {DataProvider, DataProviderChangeEvent, IDataProviderSimple}                                                      from "../data/DataProvider";
import {ListenerHandler}                                                                                                 from "../ListenerHandler";
import {AbstractWidget, AbstractWidgetVoidFunction, addWidgetClass, Args_AbstractWidget, findForm}  from "./AbstractWidget";
import {BeforeInitLogicEvent, BeforeInitLogicListener}                                                                   from "./BeforeInitLogicListener";
import {Component}                                                                                                       from "@syncfusion/ej2-base";
import * as _                                                                                                            from "lodash";
import {isFunction}                                                                                                      from "lodash";
import {resolveWidgetArray}                          from "./WidgetUtils";
import {AfterInitLogicEvent, AfterInitLogicListener} from "./AfterInitLogicListener";

export class Args_AnyWidget<CONTROLMODEL = any> extends Args_AbstractWidget {

   id?: string;
   title ?: string;
   dataProviderName  ?: string;
   propertyName      ?: string;
   readonly ?: boolean = false;
   required?: boolean  = true;
   formGroup_id ?: string;
   /**
    * The id of the div that will be used for the error message in validation
    */
   error_id ?: string;

   /*
    Example:
    validation: {date: [true, 'Enter valid format']}

    or

    validation:{email: [true, 'Enter valid Email']}

    */
   validation ?: any;

   /**
    * The {@link AbstractWidget} that contains this instance
    */
   parent ?: AbstractWidget;

   children ?: (AbstractWidget | Promise<AbstractWidget>)[];

   /**
    * Returns the HTML to be inserted before the children's HTML.
    * It is a function so the string is evaluated after the initialization is done. If it was a mere string, the string instantiation would happen at the time the descriptor was created, which is before the widget is instantiated
    */
   localContentBegin ?: StringArg; // ()=>string;

   /**
    * Returns the HTML to be inserted after the children's HTML
    * It is a function so the string is evaluated after the initialization is done. If it was a mere string, the string instantiation would happen at the time the descriptor was created, which is before the widget is instantiated*
    */
   localContentEnd ?: StringArg; // ()=>string;

   /**
    * Called during the localLogicImplementation phase of the component's initialization.
    * It is called if the component's localLogicImplementation method is not overridden or if the overridden method calls super.localLogicImplementation
    * Timing of the call depends on the implementation of the override. Normally it should be the first call in the override.
    */
   localLogicImplementation ?: AbstractWidgetVoidFunction;
   localRefreshImplementation ?: AbstractWidgetVoidFunction;
   localClearImplementation ?: AbstractWidgetVoidFunction;
   localDestroyImplementation ?: AbstractWidgetVoidFunction;

   extraTagIdCount ?: number = 0;


   /**
    * If this is present,  a new wrapper div is created around the actual input element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej                ?: CONTROLMODEL


   onBeforeValueChange ?: (ev: Args_onBeforeValueChange) => void;

   onAfterValueChange ?: (ev: Args_onAfterValueChange) => void;
} // Args_AnyWidget

export class Args_onBeforeValueChange {
   /**
    * Value to be set
    */
   newValue: any;
   /**
    * Value before setting the new value
    */
   previousValue: any;
   /**
    * Actual widget instance
    */
   widget: AnyWidget;
} // Args_onBeforeValueChange

export class Args_onAfterValueChange {
   /**
    * Value to be set
    */
   newValue: any;
   /**
    * Value before setting the new value
    */
   previousValue: any;
   /**
    * Actual widget instance
    */
   widget: AnyWidget;

} // Args_onAfterValueChange


export function initializeWrapperTagID(widget: AnyWidget) {
   if (!widget)
      return;

   if (!widget.wrapperTagID) {
      let tagId = widget.tagId;
      if (tagId)
         widget.wrapperTagID = `wrapper_${tagId}`;
   }
} // initializeWrapperTagID

export function initialize_Args_AnyWidget(descriptor: Args_AnyWidget, widget: AnyWidget): void {

   if (!descriptor.id)
      descriptor.id = getRandomString((widget ? widget.thisClassName : 'widget')); // generate an id regardless

   if (!descriptor.required)
      descriptor.required = false;

   if (!descriptor.readonly)
      descriptor.readonly = false;

   if (!descriptor.error_id)
      descriptor.error_id = `${descriptor.id}ErrorMsg`;

   if (!descriptor.formGroup_id)
      descriptor.formGroup_id = `${descriptor.id}FormGroup`;

   IArgs_HtmlTag_Utils.init(descriptor);

   if (descriptor.wrapper) {
      initializeWrapperTagID(widget);
      IArgs_HtmlTag_Utils.init(descriptor.wrapper);
   } // if (descriptor.wrapper)

} // initialize_Args_AnyWidget


export class Args_AnyWidget_Initialized_Event {
   widget: AnyWidget;
   args: Args_AnyWidget
}

/**
 * Fired when the Args_AnyWidget instance is completely initialized, but before the Args_AnyWidget functions
 * line initContentBegin, initContentEnd, etc are invoked
 */
export abstract class Args_AnyWidget_Initialized_Listener extends BaseListener<Args_AnyWidget_Initialized_Event> {
   eventFired(ev: Args_AnyWidget_Initialized_Event): void {
      this.argsAnyWidgetInitialized(ev);
   }

   abstract argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void;
} //Args_AnyWidget_Initialized_Listener
export interface ISimpleValue<T> {
   value: T;
   previousValue: T;
   propertyName: string;
}

/**
 * The generic root component of all the widgets.
 *
 * @author David Pociu - InsiTech
 * @since 0.1
 */
export abstract class AnyWidget<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any, ARGS_ANY_WIDGET extends Args_AnyWidget = Args_AnyWidget, DATA_TYPE = any>
   extends AbstractWidget<DATA_TYPE> implements ISimpleValue<DATA_TYPE> {

   // noinspection SpellCheckingInspection
   // private _descriptor: ARGS_ANY_WIDGET;
   private _args_AnyWidgetInitializedListeners: ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener> = new ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener>();

   wrapperTagID: string;

   private _value: DATA_TYPE;
   private _previousValue: DATA_TYPE;
   private _stayFocusedOnError: boolean = false;
   labelTagID: string;
   errorTagID: string;

   protected constructor() {
      super();
   }

   /**
    * Called either from the constructor if the descriptor is not null, or explicitly by the extending components once they
    * initialize the descriptor and widgetContainer based on their own constructor parameters (which might not extend the current descriptor).
    *
    * The extending classes may want to have a different descriptor that does not extend the one here so that only the relevant properties to the
    * respective component are available on initialization - reducing the possibility of error in using properties that
    * should not be available or used for that particular extending component.
    *
    * The separate initialization gives the extending component room to craft the parameters being passed to properly initialize this instance
    * without having to resort to some artificial function that operates on the parameters passed to super - as would be the case if the initialization
    * was done in the constructor.
    *
    * @param args
    * @author David Pociu - InsiTech
    */
   protected async initialize_AnyWidget(args?: ARGS_ANY_WIDGET) {
      let thisX = this;
      // If the descriptor does not exist, create a default one
      if (args == null)
         args = <ARGS_ANY_WIDGET>new Args_AnyWidget();
      addWidgetClass(args, 'AnyWidget');

      args          = IArgs_HtmlTag_Utils.init(args) as ARGS_ANY_WIDGET;
      this.initArgs = args;

      initialize_Args_AnyWidget(args, this);

      if (!this.tagId)
         this.tagId = getRandomString(args.id);
      args.id = this.tagId;

      if (args.propertyName != null)
         this.propertyName = args.propertyName;

      if (args.title != null)
         this.title = args.title;

      // descriptor.initLogic() handled inside _initLogic()
      if (args.children) {
         let resolvedChildren: AbstractWidget[] = await resolveWidgetArray(args.children);
         this.children                          = resolvedChildren;
         args.children                          = resolvedChildren; // synchronize the arguments with the widget contents
      }


      // initialize the tags so they available in initContentBegin/End
      thisX.wrapperTagID = `wrapper_${thisX.tagId}`;

      // initialize the tags so they available in initContentBegin/End
      this.labelTagID = `label_${this.tagId}`;
      this.errorTagID = `error_${this.tagId}`;

      /** fire the listener for anyone interested  **/
      if (this.args_AnyWidgetInitializedListeners.countListeners() > 0) {
         this.args_AnyWidgetInitializedListeners.fire({
                                                         event: {
                                                            widget: thisX,
                                                            args:   args
                                                         }
                                                      }
         );

      } // listeners


      if (args.localContentBegin)
         this.contentBeginFromExtendingClass = stringArgVal(args.localContentBegin);

      if (args.localContentEnd)
         this.contentEndFromExtendingClass = stringArgVal(args.localContentEnd);

      //----------------------- Listener Implementations ---------------------
      if (args.beforeInitLogicListener) {
         this.beforeInitLogicListeners.addListener(new class extends BeforeInitLogicListener {
            beforeInitLogic(ev: BeforeInitLogicEvent): void {
               args.beforeInitLogicListener(ev);
            }
         });
      }

      if (args.afterInitLogicListener) {
         this.afterInitLogicListeners.addListener(new class extends AfterInitLogicListener {
            afterInitLogic(ev: AfterInitLogicEvent): void {
               args.afterInitLogicListener(ev);
            }
         });
      }


      this.initArgs = args;
      await super.initialize_AbstractWidget(args);
   } // initAnyWidget


   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localLogicImplementation(): Promise<void> {
      if (this.initArgs && this.initArgs.localLogicImplementation)
         this.initArgs.localLogicImplementation.call(this, this);
   } // _initLogic

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localClearImplementation(): Promise<void> {
      if (this.initArgs && this.initArgs.localClearImplementation)
         this.initArgs.localClearImplementation.call(this, this);
   } // _clear

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localRefreshImplementation(): Promise<void> {
      if (this.initArgs && this.initArgs.localRefreshImplementation)
         this.initArgs.localRefreshImplementation.call(this, this);
   } // _refresh


   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localDestroyImplementation(): Promise<void> {
      // by this time children are already destroyed
      try {
         if (this.initArgs && this.initArgs.localDestroyImplementation)
            this.initArgs.localDestroyImplementation.call(this, this);
      } catch (e) {
         console.error(e);
      }

      this._value         = null; // release memory
      this._previousValue = null;


      // just in case
      if (this.obj && !(this.obj as any).isDestroyed && (this.obj as any).destroy != null) {
         // Destroy this object itself
         try {
            await (this.obj as any).destroy();
         } catch (e) {
            console.error(e);
         }
      }

      this.obj                                 = null;
      this._initArgs                           = null;
      this._args_AnyWidgetInitializedListeners = null;
      this.wrapperTagID                        = null;
      this.labelTagID                          = null;
      this.errorTagID                          = null;
      this.contentBeginFromExtendingClass      = null;
      this.contentEndFromExtendingClass        = null;
      this.children                            = null;
      this.initialized                         = false;
      this.tagId                               = null;
      this.title                               = null;
      this.parent                              = null;
      this.dialogWindowContainer               = null;
      this.beforeInitLogicListeners.clear();
      this.afterInitLogicListeners.clear();
      this.beforeRepaintWidgetListeners.clear();
      this.afterRepaintWidgetListeners.clear();
      this.parentAddedListeners.clear();
      this.widgetErrorHandler = null;


   } // _destroy



   //--------------- simple getters and setters ------------

   get obj(): EJ2COMPONENT {
      return <EJ2COMPONENT> super.obj;
   }

   // noinspection JSUnusedGlobalSymbols
   set obj(value: EJ2COMPONENT) {
      super.obj = value;
   }

   get initArgs(): ARGS_ANY_WIDGET {
      return this._initArgs as ARGS_ANY_WIDGET;
   }

   set initArgs(value: ARGS_ANY_WIDGET) {
      this._initArgs = value;
   }


   get args_AnyWidgetInitializedListeners(): ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener> {
      return this._args_AnyWidgetInitializedListeners;
   }

   set args_AnyWidgetInitializedListeners(value: ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener>) {
      this._args_AnyWidgetInitializedListeners = value;
   }

   protected updateDataProvider(val: DATA_TYPE) {
      let thisX = this;

      if (!thisX.initArgs?.propertyName)
         return;
      if (!thisX.initArgs?.dataProviderName)
         return;

      let currentValue = val; // get the actual value from the TextBox EJ2 object
      if (currentValue != this.previousValue) {
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
               changeFailed:  async (changeFailedFinished) => {
                  // the context of this function could be anything, so we use thisX to be sure
                  record[thisX.propertyName] = previousDataValue;

                  try {
                     if (dataProvider instanceof DataProvider) {
                        await dataProvider.refresh();
                     } else {
                        await thisX.refresh();
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

            //dataProvider.fireChange(evt);
            thisX.fireDataProviderChangeEvent(dataProvider, evt);
         } // if record
      } // if (currentValue != this.previousValue)
   } // onBlur


   /**
    * This method can be customized/overwritten by extending widgets
    * @param dataProvider
    * @param evt
    */
   protected fireDataProviderChangeEvent(dataProvider: IDataProviderSimple, evt: DataProviderChangeEvent<any>) {
      // by default fire it after 200ms to give focus components a chance to tansfer focus
      setTimeout(() => {
         dataProvider.fireChange(evt); // async function but it doesn't matter
      }, 200);
   }


   /**
    * Validation rules are found using the 'name' attribute which is the 'propertyName' value of the descriptor (if any)
    */
   async validateForm(widget: AbstractWidget): Promise<boolean> {
      try {
         let form: any = findForm(widget);
         if (form) {
            let formValidator = form.formValidator;
            if (formValidator && this?.initArgs?.propertyName) {
               if (this?.initArgs?.validation) {
                  formValidator.addRules(this.initArgs.propertyName, this.initArgs.validation);
               }


               if (formValidator.rules) {
                  if (formValidator.rules[this.initArgs.propertyName]) {
                     return formValidator.validate(this.initArgs.propertyName); // validate this textfield alone
                  }
               }
            }
         } // if form
         return true; // valid
      } catch (ex) {
         this.handleError(ex);
         return false; // not validated if exception
      }
   }

   getRecord(): any {
      let dataProvider: IDataProviderSimple = this.getDataProviderSimple()
      if (dataProvider != null) {
         return classArgInstanceVal(dataProvider.dataValue);
      }
      return null;
   }


   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.initArgs.dataProviderName != null) {
         dataProvider = DataProvider.dataProviderByName(this, this.initArgs.dataProviderName);
      }
      return dataProvider;
   }

   get previousValue(): DATA_TYPE {
      return this._previousValue;
   }

   set previousValue(value: DATA_TYPE) {
      this._previousValue = value;
   }


   /**
    * The column name in the dataProvider record
    * This property actually comes from initArgs.propertyName
    */
   get propertyName(): string {
      return this.initArgs?.propertyName;
   }

   set propertyName(value: string) {
      try {
         this.initArgs.propertyName = value;
      } catch (e) {
         console.error(e);
      }
   }

   get stayFocusedOnError(): boolean {
      return this._stayFocusedOnError;
   }

   set stayFocusedOnError(value: boolean) {
      this._stayFocusedOnError = value;
   }


   get value(): DATA_TYPE {
      return this._value;
   }

   /**
    * Sets the _value field and calls the {@link updateDataProvider} method
    * @param val
    */
   set value(val: DATA_TYPE) {
      let previousValue = this.previousValue;

      try {
         if (_.isEqual(previousValue, val))
            return; // nothing to do
      } catch (e) {
         console.error(e)
      }

      if (this.initArgs?.onBeforeValueChange) {
         // do not catch exception in case it's triggered on purpose to avoid the set
         this.initArgs.onBeforeValueChange({
                                              newValue:      val,
                                              previousValue: previousValue,
                                              widget:        this
                                           });
      } // if ( this.initArgs?.onBeforeValueChange)


      this._value = val;

      // Only update if refresh or repaint is NOT in progress
      if ( !(this.refreshInProgress || this.repaintInProgress) )
         this.updateDataProvider(val);


      this.previousValue = val; // at this point, everything is set in stone, and this is now the previous value


      if (this.initArgs?.onAfterValueChange) {
         try {
            this.initArgs.onAfterValueChange({
                                                newValue:      val,
                                                previousValue: previousValue,
                                                widget:        this
                                             });
         } catch (e) {
            console.error(e); // catch exception here since the set already happened
         }
      } // if ( this.initArgs?.onBeforeValueChange)
   }

   set valueNoDataProvider(val: DATA_TYPE) {
      this._value        = val;
      this.previousValue = val;
   }

   /**
    * Method that is usually called during set value to perform any necessary conversion.
    * The default {@link set value} implementation in AnyWidget does not call this method, since it's the job of the overriding {@link set value} methods to do so as needed
    * @param val
    */
   convertValueBeforeSet(val: any): any {
      return val;
   }

} // AnyWidget


export async function localContentBeginStandard(widget: AnyWidget): Promise<string> {

   let args: Args_AnyWidget = widget.initArgs;

   args = IArgs_HtmlTag_Utils.init(args);

   let x: string = "";
   if (args?.wrapper) {
      args.wrapper = IArgs_HtmlTag_Utils.init(args.wrapper);
      x += `<${args.wrapper.htmlTagType} id="${widget.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(args.wrapper)}>`;
   }

   x += `<${args.htmlTagType} id="${widget.tagId}" ${IArgs_HtmlTag_Utils.all(args)}>`; // NEVER use <div />

   return x; // no call to super
} // localContentBeginStandard

export async function localContentEndStandard(widget: AnyWidget): Promise<string> {
   let args: Args_AnyWidget = widget.initArgs;
   args                     = IArgs_HtmlTag_Utils.init(args);

   let x: string = "";
   if (args.htmlTagType.toLowerCase() != 'input') // there is no separate end tag for 'input
      x += `</${args.htmlTagType}>`;

   if (args?.wrapper) {
      x += `</${args.wrapper.htmlTagType}>`; // <!-- id="${wrapperTagID}" -->
   }
   return x; // no call to super
} // localContentEndStandard

export async function localRefreshImplementationStandard(widget: AnyWidget) {
   try {
      let objAny: any = widget.obj as any;
      if (objAny && objAny.refresh && isFunction(objAny.refresh)) {
         objAny.refresh();
      }
   } catch (ex) {
      widget.handleError(ex);
   }
}