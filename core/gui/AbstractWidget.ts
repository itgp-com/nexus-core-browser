/**
 * This class serves as the base of every data enabled panel
 */
import {ScreenMeta}                                                    from "./ScreenMeta";
import * as _                                                          from 'lodash';
import * as wu                                                         from "../ej2/WidgetUtils";
import {ArgsPost}                                                      from "../ej2/WidgetUtils";
import {Err}                                                           from "../Core";
import {AxiosResponse}                                                 from "axios";
import {getErrorHandler}                                               from "../CoreErrorHandling";
import {getRandomString, hget, htmlToElement, StringArg, stringArgVal} from "../CoreUtils";
import {ListenerHandler}                                               from "../ListenerHandler";
import {BeforeInitLogicEvent, BeforeInitLogicListener}                 from "./BeforeInitLogicListener";
import {AfterInitLogicEvent, AfterInitLogicListener}                   from "./AfterInitLogicListener";
import {ExceptionEvent}                                                from "../ExceptionEvent";
import {AfterRepaintWidgetEvent, AfterRepaintWidgetListener}           from "./AfterRepaintWidgetListener";
import {BeforeRepaintWidgetEvent, BeforeRepaintWidgetListener}         from "./BeforeRepaintWidgetListener";
import {WidgetErrorHandler, WidgetErrorHandlerStatus}                  from "../WidgetErrorHandler";
import {DialogWindow}                                                  from "../ej2/DialogWindow";
import {ParentAddedEvent, ParentAddedListener}                         from "./ParentAddedListener";
import {DialogInfo}                                                    from "../ej2/DialogInfo";
import {Args_WgtTab_SelectedAsTab}                                     from "./panels/WgtTab";

export class Args_AbstractWidget {
   // was AbstractWidget
   beforeInitLogicListener ?: (ev: BeforeInitLogicEvent) => void;
   afterInitLogicListener ?: (ev: AfterInitLogicEvent) => void;
}

export class Args_Repaint {
   callDestroyOnContents: boolean;
}

export abstract class AbstractWidget<DATA_TYPE = any> implements UpdateStateListener {
   initContentBegin: StringArg;
   initContentEnd: StringArg;
   private _initialized: boolean                                                                                          = false;
   private _tagId: string;
   private _title: string                                                                                                 = 'n/a';
   private _meta: ScreenMeta                                                                                              = new ScreenMeta();
   private _doRegisterInfo: boolean                                                                                       = true;
   private _thisClassName: string;
   private _childrenMap: Map<string, AbstractWidget>                                                                      = new Map<string, AbstractWidget>(); // map of child tagID to child instance
   private _children: AbstractWidget[]                                                                                    = []; // ordered list of children
   private _parent: AbstractWidget;
   private _dialogWindowContainer: DialogWindow;
   private readonly _beforeInitLogicListeners: ListenerHandler<BeforeInitLogicEvent, BeforeInitLogicListener>             = new ListenerHandler<BeforeInitLogicEvent, BeforeInitLogicListener>();
   private readonly _afterInitLogicListeners: ListenerHandler<AfterInitLogicEvent, AfterInitLogicListener>                = new ListenerHandler<AfterInitLogicEvent, AfterInitLogicListener>();
   private readonly _beforeRepaintWidgetListeners: ListenerHandler<BeforeRepaintWidgetEvent, BeforeRepaintWidgetListener> = new ListenerHandler<BeforeRepaintWidgetEvent, BeforeRepaintWidgetListener>();
   private readonly _afterRepaintWidgetListeners: ListenerHandler<AfterRepaintWidgetEvent, AfterRepaintWidgetListener>    = new ListenerHandler<AfterRepaintWidgetEvent, AfterRepaintWidgetListener>();
   private readonly _parentAddedListener: ListenerHandler<ParentAddedEvent, ParentAddedListener>                          = new ListenerHandler<ParentAddedEvent, ParentAddedListener>();
   private _widgetErrorHandler: WidgetErrorHandler;


   private _state: DATA_TYPE;
   private _stateOriginal: DATA_TYPE;
   private _updateStateListeners: UpdateStateListener[] = [this];
   private _trackStateChanges: boolean                  = false;


   constructor() {
      this.initialize_AbstractWidget();

   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   // noinspection JSUnusedGlobalSymbols
   get updateStateListeners(): UpdateStateListener[] {
      return this._updateStateListeners;
   }

   //------------------------------------------------------------

   /**
    * @deprecated state should use {@link DataProvider}
    */
// noinspection JSUnusedGlobalSymbols
   get state(): DATA_TYPE {
      return this._state;
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
// noinspection JSUnusedGlobalSymbols
   set state(value: DATA_TYPE) {
      this._state = value;
      if (this.trackStateChanges) {
         if (value == null) {
            this._stateOriginal = null;
         } else {
            // make a full clone
            this._stateOriginal = _.cloneDeep(value);
         }
      }
   }

   get widgetErrorHandler(): WidgetErrorHandler {
      return this._widgetErrorHandler;
   }

   set widgetErrorHandler(value: WidgetErrorHandler) {
      this._widgetErrorHandler = value;
   }

// noinspection JSUnusedGlobalSymbols
   get title(): string {
      return this._title;
   }

// noinspection JSUnusedGlobalSymbols
   set title(value: string) {
      this._title = value;
   }

   get initialized(): boolean {
      return this._initialized;
   }

//-------------------------------------------------------------------

   set initialized(value: boolean) {
      this._initialized = value;
   }

// noinspection JSUnusedGlobalSymbols
   get meta(): ScreenMeta {
      return this._meta;
   }

// noinspection JSUnusedGlobalSymbols
   get thisClassName(): string {
      // screen name is the class name usually
      return this._thisClassName;
   }

// noinspection JSUnusedGlobalSymbols
   set thisClassName(value: string) {
      // Overwrite the default screen name
      this._thisClassName = value;
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   get trackStateChanges(): boolean {
      return this._trackStateChanges;
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   // noinspection JSUnusedGlobalSymbols
   set trackStateChanges(value: boolean) {
      this._trackStateChanges = value;
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   // noinspection JSUnusedGlobalSymbols
   get stateOriginal(): DATA_TYPE {
      return this._stateOriginal;
   }

   get parent(): AbstractWidget {
      return this._parent;
   }

   set parent(value: AbstractWidget) {
      try {
         this._parent = value;
         if (this.parentAddedListeners.count() > 0) {
            this.parentAddedListeners.fire({
                                              event: {
                                                 child:  this,
                                                 parent: value,
                                              }
                                           });
         } // if
      } catch (ex) {
         this.handleError(ex);
      }
   }

   get tagId(): string {
      return this._tagId;
   }

   set tagId(value: string) {
      this._tagId = value;
      //
      // this.widgetWrapperTagId = `wgtwrap_${this.tagId}`;
      // this.childWrapperTagId  = `childwrap_${this.tagId}`;
   }

   /**
    * Direct DialogWindow Container of this component.
    * Use {@link #findDialogWindowContainer} to search up the tree of parent components and find the top component that has (possibly) a DialogWindow as a container
    */
   get dialogWindowContainer(): DialogWindow {
      return this._dialogWindowContainer;
   }

   set dialogWindowContainer(value: DialogWindow) {
      this._dialogWindowContainer = value;
   }


   /**
    * True if this component is allowed to register it's info, false otherwise
    * Defaults to true
    *
    */
   get doRegisterInfo(): boolean {
      return this._doRegisterInfo;
   }

   set doRegisterInfo(value: boolean) {
      this._doRegisterInfo = value;
   }

//--------------------------- start  Child logic ---------------------
   /**
    * Gets a list of children.
    * DO NOT ADD, INSERT or REMOVE children to/from this list as it's just a copy, and as such your action has no effect
    */
   get children(): AbstractWidget[] {
      // return a copy of the actual list
      return Array.from<AbstractWidget>(this._children);
   }

   /**
    * Do not use as an array. Assign all at once or use addChild(child)
    * @param newChildren
    */
   // noinspection JSUnusedGlobalSymbols
   set children(newChildren: AbstractWidget[]) {
      this._childrenMap.forEach((value, key) => {
         this.removeChildByTagId(key);
      });

      if (newChildren) {
         newChildren.forEach(child => {
            if (child)
               this.addChild(child);
         });
      } // if children
   }

   get hget(): HTMLElement {
      return hget(this.tagId);
   }

   //----------------------- Error Handling --------------------------

   // noinspection JSUnusedGlobalSymbols
   get hgetForm(): HTMLFormElement {
      let h: HTMLElement = this.hget;
      if (h instanceof HTMLFormElement)
         return (<HTMLFormElement>h);

      return null;
   }

   // noinspection JSUnusedGlobalSymbols
   get hgetInput(): HTMLInputElement {
      let h: HTMLElement = this.hget;
      if (h instanceof HTMLInputElement)
         return (<HTMLInputElement>h);
      return null;
   }

   // noinspection JSUnusedGlobalSymbols
   get hgetButton(): HTMLButtonElement {
      let h: HTMLElement = this.hget;
      if (h instanceof HTMLButtonElement)
         return (<HTMLButtonElement>h);
      return null;
   }


   initialize_AbstractWidget() {
      this.thisClassName         = this.constructor.name; // the name of the class
      this.tagId                 = getRandomString(this.thisClassName);
      this.meta.currentClassName = this._thisClassName;
   } // initAbstractBase

   /**
    * Replaced by {@link initContentBegin} and {@link initContentEnd}. Will be removed in a future version
    *
    *
    * @deprecated
    * @private
    */
   _initContent(): string {
      return '';
   }

   localContentBegin(): string {
      return '';
   }

   localContentEnd(): string {
      return '';
   }

   abstract localLogicImplementation(): void;

   abstract localDestroyImplementation(): void;

   abstract localRefreshImplementation(): void;

   abstract localClearImplementation(): void;


   /**
    * Empty implementation that gives the component a chance to initialize as Tab.
    *
    * It exists because a tab does not make the HTML available until this point, and only gets called if initialized is false
    */
   initLogicAsTab(): void {
   }

   /**
    * Gets called every time the tab is selected
    */
   selectedAsTab(arg: Args_WgtTab_SelectedAsTab): void {
   }


   repaint(args ?: Args_Repaint) {
      let thisX = this;
      if (args == null)
         args = new Args_Repaint(); // default values

      try {
         if (this.initialized && this.tagId) {
            if (thisX.beforeRepaintWidgetListeners.count() > 0) {

               let beforeEvent: BeforeRepaintWidgetEvent = new BeforeRepaintWidgetEvent();
               beforeEvent.widget                        = thisX;
               beforeEvent.stopEventProcessing           = false;

               thisX.beforeRepaintWidgetListeners.fire({
                                                          event:            beforeEvent,
                                                          exceptionHandler: (exceptionEvent) => {
                                                             console.log(exceptionEvent.exception);
                                                             getErrorHandler().displayErrorMessageToUser(exceptionEvent.description);
                                                          }
                                                       });
               if (beforeEvent.stopEventProcessing)
                  return; // do not continue if flag set
            } //  if (thisX.beforeRepaintWidgetListeners.count() > 0)

            let existingHtmlElement = document.getElementById(this.tagId);
            if (existingHtmlElement) {
               let parentNode = existingHtmlElement.parentElement; // was parentNode
               if (parentNode) {

                  if (args.callDestroyOnContents) {
                     this.destroy(); // first destroy this instance and all children. This removes all JS events/html as each component seems fit to clean up after itself
                  } else {
                     this.resetInitialize();
                  }

                  wu.updateWidgetInDOM({
                                          parentHTMLElement:         parentNode,
                                          newWidget:                 thisX,
                                          existingWidgetHTMLElement: existingHtmlElement,
                                          callback:                  () => {
                                             // execute after repaint if there are any listeners
                                             if (thisX.afterRepaintWidgetListeners.count() > 0) {
                                                let afterEvent: AfterRepaintWidgetEvent = new AfterRepaintWidgetEvent();
                                                afterEvent.widget                       = thisX;

                                                thisX.afterRepaintWidgetListeners.fire({
                                                                                          event:            afterEvent,
                                                                                          exceptionHandler: (exceptionEvent) => {
                                                                                             console.log(exceptionEvent.exception);
                                                                                             getErrorHandler().displayErrorMessageToUser(exceptionEvent.description);
                                                                                          },
                                                                                       });

                                             }   //if count > 0
                                          } // callback
                                       });
               } //if (parentNode)
            } // if ( existingHtmlElement)

         } // if (this.initialized)
      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }
   } // repaintWidget

// noinspection JSUnusedGlobalSymbols
   initContentAndLogic(container: HTMLElement, callback?: Function): void {
      let thisX: AbstractWidget = this;

      wu.updateWidgetInDOM({
                              parentHTMLElement: container,
                              newWidget:         this,
                              callback:          () => {

                                 //attach Ctrl-Alt-double-click on container
                                 if (thisX.doRegisterInfo)
                                    thisX.registerInfo(container);

                                 if (callback)
                                    callback();
                              },
                           });
   } // initContentAndLogic

   registerInfo(container: HTMLElement) {
      if (container) {
         //attach double-click on container
         container.ondblclick = null;
         container.ondblclick = (evt) => {
            if (evt.altKey && evt.ctrlKey) {

               let tablesHtml: string = ''
               this.meta.tableList.forEach(meta => {
                  tablesHtml += `<div class="offset-1 col-11">${escape(meta.TABLENAME)}</div>`;
               });


               let x = `
<div class="flex-full-height">
        <div><b>Screen name:</b> ${this._thisClassName}</div>
        <div style="margin-bottom: 30px"></div>
        <div><b>Tables used:</b></div>
        <div class="row">${tablesHtml}</div>
</div>
`;


               let dialogTagId: string    = getRandomString('registerInfoTag');
               let dialogTag: HTMLElement = htmlToElement(`<div id="${dialogTagId}"></div>`);
               container.appendChild(dialogTag);
               let infoDialog: DialogInfo = new DialogInfo({
                                                              element: dialogTag,
                                                              width:   "50%",
                                                              height:  "90%",
                                                              content: x,
                                                              onClose: () => {
                                                                 container.removeChild(dialogTag);
                                                              }
                                                           });

               infoDialog.call();
            }
            evt.stopPropagation();
         }; // on dblclick

      } // if container
   }

   initContent(): string {
      let b = '';

      let contentBeginOld   = stringArgVal(this.initContentBegin);
      let contentEndOld     = stringArgVal(this.initContentEnd);
      let localContentBegin = this.localContentBegin();
      let localContentEnd   = this.localContentEnd();

      if (contentBeginOld)
         b += contentBeginOld;
      if (localContentBegin)
         b += localContentBegin;


      let overwrittenContent = this._initContent();
      if (overwrittenContent)
         b += overwrittenContent;

      this.children.forEach(child => {
         if (child) {
            let content = child.initContent();
            if (content)
               b += content;
         }
      });

      if (contentEndOld)
         b += contentEndOld;
      if (localContentEnd)
         b += localContentEnd;
      return b;
   };

   initLogic(): void {
      if (!this.initialized) {
         this.initialized = true; // set the flag here, so if we call refresh() from inside the _initLogic implementation, it goes through

         let thisX = this;

         // ------------ Before Init Logic Listeners -----------------------
         if (this.beforeInitLogicListeners.count() > 0) {
            this.beforeInitLogicListeners.fire({
                                                  event:            {
                                                     origin: thisX
                                                  },
                                                  exceptionHandler: (event) => {
                                                     thisX.handleError(event);
                                                  }
                                               }
            );
         }

         if (this.children) {
            this.children.forEach(child => {
               if (child)
                  child.initLogic();
            });
         } // if ( this.children)

         // run this component's logic after the children
         this.localLogicImplementation();

         // ------------ After Init Logic Listeners -----------------------
         if (this.afterInitLogicListeners.count() > 0) {
            this.afterInitLogicListeners.fire({
                                                 event:            {
                                                    origin: thisX
                                                 },
                                                 exceptionHandler: (event) => {
                                                    thisX.handleError(event);
                                                 }
                                              },
            );
         } // if (this.afterInitLogicListeners.count() > 0)

      }
   }

//--------------------------- Find parent instance in different ways ---------------------

// noinspection JSUnusedGlobalSymbols
   destroy(): void {
      this.initialized = false;
      if (this.children) {
         this.children.forEach(child => {
            if (child)
               child.destroy();
         });
      } // if ( this.children)

      this.localDestroyImplementation(); // this will take care of this.obj
   }

   resetInitialize(): void {
      this.initialized = false;
      if (this.children) {
         this.children.forEach(child => {
            if (child)
               child.resetInitialize();
         });
      } // if ( this.children)
   }

// noinspection JSUnusedGlobalSymbols
   refresh(): void {
      if (this.initialized) {


         if (this.children) {
            this.children.forEach(child => {
               if (child)
                  child.refresh();
            });
         } // if ( this.children)

         this.localRefreshImplementation();
      }
   }

// noinspection JSUnusedGlobalSymbols
   clear(): void {
      if (this.children) {
         this.children.forEach(child => {
            if (child)
               child.clear();
         });
      } // if this.children

      this.localClearImplementation();
   }

   //-------------------------- state and state listeners ------------------
   /**
    * @deprecated state should use {@link DataProvider}
    */
   hasState() {
      return this.state != null;
   }

   /**
    * Empty implementation of UpdateStateListener. Override as needed
    * @param updateEvent
    * @deprecated state should use {@link DataProvider}
    */
   updateState(updateEvent: UpdateStateEvent) {
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   // noinspection JSUnusedGlobalSymbols
   addUpdateStateListener(listener: UpdateStateListener) {
      if (listener)
         this._updateStateListeners.push(listener);
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   // noinspection JSUnusedGlobalSymbols
   removeUpdateStateListener(listener: UpdateStateListener) {
      if (listener) {
         let n: number = this._updateStateListeners.length;
         //reverse loop, so that when we remove an item, we don't loose our position and have to do funky math to recover it
         for (let i = n - 1; i >= 0; i--) {
            let internal = this._updateStateListeners[i];
            if (internal && internal == listener)
               this._updateStateListeners.splice(i, 1);
         }
      }
   }

   /**
    * @deprecated state should use {@link DataProvider}
    */
   fireUpdateState(evt: UpdateStateEvent) {
      if (!this._updateStateListeners)
         return;

      let n: number = this._updateStateListeners.length;
      for (let i = 0; i < n; i++) {
         let listener = this._updateStateListeners[i];
         if (listener) {
            try {
               listener.updateState(evt)
            } catch (err) {
               evt.error    = true;
               evt.errorTxt = err.toString();
               if (!evt.extras)
                  evt.extras = new Map();
               evt.extras.set('exception', err);
            }
         } // if listener

         if (evt.error)
            break; // get out of the loop the moment there's an error
      } // for i = 0 to n
   }

   /**
    * Called to handle errors.
    * @param err
    * @return false if error not handled, true if handled
    */
   handleError(err: (AxiosResponse | Err | Error | ExceptionEvent | any)): WidgetErrorHandlerStatus {
      let status: WidgetErrorHandlerStatus;
      if (this.widgetErrorHandler) {
         status = this.widgetErrorHandler.handleWidgetError({err: err});
      }

      if (status && status.isErrorHandled) {
         return status; // we're done here
      }

      status = undefined;

      if (this.parent) {
         status = this.parent.handleError(err);
         if (status && status.isErrorHandled) {
            return status;
         }
      } // if this.parent

      // no parent so do the default error handling
      getErrorHandler().displayExceptionToUser(err);
      return {isErrorHandled: true};
   } // handleError


   /**
    * Performs a 'safe' POST to a controller that returns a RetVal<value> object (no need for try/catch)
    * If successful, the actual value inside the RetVal object is returned
    * On error any returned error/exception is caught and handled either by the optionalErrorHandler passed in, or by the default handleError method of the widget,  and 'undefined' is returned in that case.
    * @param argsPost
    */
   async asyncPostRetVal<T = any>(argsPost: ArgsPost<T>, optionalErrorHandler ?: (err: (AxiosResponse | Err | Error | ExceptionEvent | any)) => void): Promise<T> {
      try {
         return await wu.asyncPostRetVal(argsPost);
      } catch (err) {
         try {
            if (optionalErrorHandler) {
               optionalErrorHandler(err);
            } else {
               this.handleError(err)
            }
         } catch (ex2) {
            // Ironically, the error handler threw an error - we're really grasping at straws here - no one left to handle this, so just dump it to the console
            console.log(ex2);
         }
      }
      return undefined;
   } // asyncPostRetVal

   /**
    * A 'raw' version  of the POST that throws an exception on any error (no default handling of errors)
    * @param argsPost
    */
   async asyncPostRetValRaw<T = any>(argsPost: ArgsPost<T>): Promise<T> {
      return wu.asyncPostRetVal(argsPost);
   } // asyncPostRetVal

   /**
    * Searches the chain of ancestors and returns the DialogWindow (if any) that contains any of the ancestors. (Usually it's the top level ancestor that has the DialogWindow.)
    */
   findDialogWindowContainer(): DialogWindow {

      if (this.dialogWindowContainer)
         return this.dialogWindowContainer; // if this actually has a DialogWindow, great, we're done

      if (this.parent) {
         return this.parent.findDialogWindowContainer();
      } else {
         return null;  // if no parent, we're done
      }

   } // findDialogWindowContainer

   /**
    * Closes this window if it's a Dialog
    */
   closeIfDialog() {
      let dialog = this.findDialogWindowContainer();
      if (dialog)
         dialog.hide();
   }

   /**
    * Find an instance in the parent(ancestor) chain based on a filter function you pass in as the parameter
    * @param filter a function you pass in as the parameter that returns true if the current ancestor meets your criteria
    */
   findAncestor<T = AbstractWidget>(filter: { (instance: any): boolean }): T {
      if (!filter)
         return null;

      if (!this.parent)
         return null;

      if (filter(this.parent)) {
         return (<T>(this.parent as any));
      } else {
         return this.parent.findAncestor(filter);
      }
   }   // findAncestor

   //--------------------------- finish Child logic ---------------------

   /**
    * return the child identified by {@link tagId}
    * @param tagId
    */
   childByTagId(tagId: string): AbstractWidget {
      return this._childrenMap.get(tagId);
   }

   childAt(index: number): AbstractWidget {
      if (index < 0 || index >= this._children.length)
         return null;
      return this._children[index];
   }

   /**
    * Append a child (yes, you can append the same child twice, but parent (if any) gets overwritten here)
    * @param child
    */
   // noinspection JSUnusedGlobalSymbols
   addChild(child: AbstractWidget): void {
      if (child) {
         child.parent = this;
         this._childrenMap.set(child.tagId, child);
         this._children.push(child);
      } // if base && child
   }

   /**
    * Returns the index if successful , or -1 if failed
    * @param index
    * @param child
    */
   addChildAtIndex(index: number, child: AbstractWidget): number {
      if (index < 0 || index > this._children.length || (!child) || (!child.tagId)) {
         return -1;
      }

      child.parent = this;
      this._childrenMap.set(child.tagId, child);
      if (index == this._children.length) {
         this._children.push(child);
      } else {
         this._children.splice(index, 0, child);
      }
      return index;
   }

   //--------------------------- start listeners (getters only, since they never get set - they are fixed ) -----------------------

   /**
    * Remove all children from this component
    */
   removeAllChildren() {
      this._children = [];
      this._childrenMap.clear();
   }

   removeChildByTagId(tagId: string): AbstractWidget {

      let x: AbstractWidget = null;
      if (tagId) {
         let value = this._childrenMap.get(tagId);
         if (value)
            value.parent = null; // untag parent from this
         x = this._childrenMap.get(tagId);
         this._childrenMap.delete(tagId);


         let n: number = this._children.length;

         for (let i = n - 1; i >= 0; i--) {
            let child: AbstractWidget = this._children[i];
            let remove: boolean       = false;

            if (child) {
               if (child.tagId) {
                  if (child.tagId === tagId) {
                     remove = true;
                  }
               } else {
                  remove = true;  // no tagID
               }
            } else {
               remove = true; // remove any blanks
            }
            this._children.splice(i, 1)
         } // for

      } // if tagId

      return x;
   }

   removeChildAtIndex(index: number): AbstractWidget {
      if (index < 0 || index >= this._children.length)
         return null;

      let x      = this._children[index];
      let xTagID = x.tagId;

      this._children.splice(index, 1);

      let n: number      = this._children.length;
      let found: boolean = false;
      for (let i = n - 1; i >= 0; i--) {
         let child: AbstractWidget = this._children[i];
         if (child && child.tagId && child.tagId === xTagID) {
            found = true;
            break; // get out of the loop
         }
      } // for

      if (!found) {
         // if not instances remain
         this._childrenMap.delete(xTagID);
      }
      return x;
   }

   // noinspection JSUnusedGlobalSymbols
   removeChild(child: AbstractWidget) {
      if (child && child.tagId) {
         this.removeChildByTagId(child.tagId);
      }
   }


   //------------------------------- Getter section -------------------------

   get beforeInitLogicListeners(): ListenerHandler<BeforeInitLogicEvent, BeforeInitLogicListener> {
      return this._beforeInitLogicListeners;
   }

   get afterInitLogicListeners(): ListenerHandler<AfterInitLogicEvent, AfterInitLogicListener> {
      return this._afterInitLogicListeners;
   }

   get beforeRepaintWidgetListeners(): ListenerHandler<BeforeRepaintWidgetEvent, BeforeRepaintWidgetListener> {
      return this._beforeRepaintWidgetListeners;
   }

   get afterRepaintWidgetListeners(): ListenerHandler<AfterRepaintWidgetEvent, AfterRepaintWidgetListener> {
      return this._afterRepaintWidgetListeners;
   }

   get parentAddedListeners(): ListenerHandler<ParentAddedEvent, ParentAddedListener> {
      return this._parentAddedListener;
   }

} // main class


//--------------------------------------
/**
 * @deprecated state should use {@link DataProvider}
 */
export interface UpdateStateEvent {
   path?: string;
   name: string;
   val: any;
   error?: boolean; // is there an error after the update ?
   errorTxt?: string; // if there's an error this is the error message
   extras?: Map<string, any>;
}

// -----------------------------
/**
 * @deprecated state should use {@link DataProvider}
 */
export interface UpdateStateListener {
   updateState(updateEvent: UpdateStateEvent): void;
}

export interface Args_UpdateWidgetInDOM {
   parentHTMLElement: HTMLElement;
   newWidget: AbstractWidget;
   existingWidgetHTMLElement?: HTMLElement;
   callback?: Function;
}
