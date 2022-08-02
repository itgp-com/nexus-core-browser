import {Component}                                                                        from "@syncfusion/ej2-base";
import {getRandomString, IArgs_HtmlTag, StringArg, stringArgVal, voidFunction}            from "../BaseUtils";
import {AbstractWidget, AfterInitLogicEvent, AfterInitLogicListener, Args_AbstractWidget} from "./AbstractWidget";
import {BeforeInitLogicEvent, BeforeInitLogicListener}                                    from "./BeforeInitLogicListener";
import {ListenerHandler}                                                                  from "../ListenerHandler";
import {BaseListener}                                                                     from "../BaseListener";
import {FormValidator, FormValidatorModel}                                                from "@syncfusion/ej2-inputs";

export class Args_AnyWidget<CONTROLMODEL = any> extends Args_AbstractWidget {

   id?: string;
   title ?: string;
   colName?: string;
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
    * @deprecated use localContentEnd()
    * This is a static method because a class method would be required to be instantiated when  {@link htmlTextBoxFloating} is called with {colName:'aaa',...}
    * See: https://stackoverflow.com/questions/47239507/property-getreadableschedule-is-missing-in-type
    * @param options
    */

   parent ?: AbstractWidget;

   children ?: AbstractWidget[];

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

   extraTagIdCount ?: number = 0;

   initLogic ?: voidFunction;
   refresh ?: voidFunction;
   clear ?: voidFunction;
   destroy ?: voidFunction;


   /**
    * If this is present,  a new wrapper div is created around the actual input element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej                ?: CONTROLMODEL


   static initialize(descriptor: Args_AnyWidget, widget: AnyWidget): void {

      if (descriptor.colName) {
         if (!descriptor.id)
            descriptor.id = descriptor.colName;
      } else {
         if (descriptor.id)
            descriptor.colName = descriptor.id;
      }

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

      if (!descriptor.cssClasses)
         descriptor.cssClasses = [];

   } // initialize

}

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
/**
 * The generic root component of all the widgets.
 *
 * @author David Pociu - InsiTech
 * @since 0.1
 */
export abstract class AnyWidget<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any, ARGS_ANY_WIDGET extends Args_AnyWidget = Args_AnyWidget, DATA_TYPE = any>
   extends AbstractWidget<DATA_TYPE> {

   private _name: string;
   private _obj: EJ2COMPONENT;
   // noinspection SpellCheckingInspection
   private _descriptor: ARGS_ANY_WIDGET;
   private _args_AnyWidgetInitializedListeners: ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener> = new ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener>();


   wrapperTagID: string;

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
    * @param argsAnyWidget
    * @author David Pociu - InsiTech
    */
   initialize_AnyWidget(argsAnyWidget?: ARGS_ANY_WIDGET): void {
      let thisX = this;

      // If the descriptor does not exist, create a default one
      if (argsAnyWidget == null)
         argsAnyWidget = <ARGS_ANY_WIDGET>new Args_AnyWidget();

      Args_AnyWidget.initialize(argsAnyWidget, this);

      if (!this.tagId)
         this.tagId       = getRandomString(argsAnyWidget.id);
      argsAnyWidget.id = this.tagId;
      this.name        = argsAnyWidget.colName;

      if ( argsAnyWidget.title != null)
         this.title = argsAnyWidget.title;

      // descriptor.initLogic() handled inside _initLogic()
      if (argsAnyWidget.children)
         this.children = argsAnyWidget.children;


      // initialize the tags so they available in initContentBegin/End
      thisX.wrapperTagID = `wrapper_${thisX.tagId}`;
      /** fire the listener for anyone interested  **/
      if (this.args_AnyWidgetInitializedListeners.countListeners() > 0) {
         this.args_AnyWidgetInitializedListeners.fire({
                                                         event: {
                                                            widget: thisX,
                                                            args:   argsAnyWidget
                                                         }
                                                      }
         );

      } // listeners


      if (argsAnyWidget.localContentBegin)
         this.contentBeginFromExtendingClass = stringArgVal(argsAnyWidget.localContentBegin);

      if (argsAnyWidget.localContentEnd)
         this.contentEndFromExtendingClass = stringArgVal(argsAnyWidget.localContentEnd);

      //----------------------- Listener Implementations ---------------------
      if (argsAnyWidget.beforeInitLogicListener) {
         this.beforeInitLogicListeners.addListener(new class extends BeforeInitLogicListener {
            beforeInitLogic(ev: BeforeInitLogicEvent): void {
               argsAnyWidget.beforeInitLogicListener(ev);
            }
         });
      }

      if (argsAnyWidget.afterInitLogicListener) {
         this.afterInitLogicListeners.addListener(new class extends AfterInitLogicListener {
            afterInitLogic(ev: AfterInitLogicEvent): void {
               argsAnyWidget.afterInitLogicListener(ev);
            }
         });
      }


      this.descriptor = argsAnyWidget;
      super.initialize_AbstractWidget(argsAnyWidget);
   } // initAnyWidget


   // async initLogic(): Promise<void> {
   //    if (!this.initialized) {
   //       await super.initLogic();
   //    }
   // } // initLogic

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localLogicImplementation() :Promise<void> {
      if (this.descriptor && this.descriptor.initLogic)
         this.descriptor.initLogic();
   } // _initLogic

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localClearImplementation() :Promise<void> {
      if (this.descriptor && this.descriptor.clear)
         this.descriptor.clear();
   } // _clear

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localRefreshImplementation() :Promise<void>{
      if (this.descriptor && this.descriptor.refresh)
         this.descriptor.refresh();
   } // _refresh


   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localDestroyImplementation() :Promise<void>{

      if (this.descriptor && this.descriptor.destroy)
         this.descriptor.destroy();

      // just in case
      if (this.obj && !(this.obj as any).isDestroyed && (this.obj as any).destroy != null) {
         // Destroy this object itself
         try {
            await (this.obj as any).destroy();
         } catch (ex) {
            console.log(ex);
         }
      }

   } // _destroy


   //--------------- simple getters and setters ------------
   get name(): string {
      return this._name;
   }

   set name(value: string) {
      this._name = value;
   }

   get obj(): EJ2COMPONENT {
      return this._obj;
   }

   // noinspection JSUnusedGlobalSymbols
   set obj(value: EJ2COMPONENT) {
      this._obj = value;
   }

   get descriptor(): ARGS_ANY_WIDGET {
      return this._descriptor;
   }

   set descriptor(value: ARGS_ANY_WIDGET) {
      this._descriptor = value;
   }


   get args_AnyWidgetInitializedListeners(): ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener> {
      return this._args_AnyWidgetInitializedListeners;
   }

   set args_AnyWidgetInitializedListeners(value: ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener>) {
      this._args_AnyWidgetInitializedListeners = value;
   }
} // AnyWidget



export function formValidator(htmlFormElement: HTMLFormElement, widgetList: AnyWidget[]): FormValidator {
   //----------- Create Validation Rules -------------
   let rules: any = {};
   for (let ejwidget of widgetList) {

      let wd                = ejwidget.descriptor;
      let v: any            = {};
      let modified: boolean = false;

      if (wd.required) {
         v.required = true;
         modified   = true;
      }

      if (wd.validation) {
         // copy all the properties and values from inside the validation object to the rules
         for (let prop in wd.validation) {
            v[prop] = wd.validation[prop];
         }
         modified = true;
      }

      if (modified)
         rules[wd.colName] = v;
   } //for

   let option: FormValidatorModel   = {
      rules: rules
   };
   let formValidator: FormValidator = new FormValidator(htmlFormElement, option);
   return formValidator;
} // formValidator