import {WidgetErrorHandler} from "../gui/WidgetErrorHandler";
import {N2Validator} from './ej2/StateN2Validator';
import {
    N2,
    N2Evt,
    N2Evt_AfterLogic,
    N2Evt_BeforeLogic,
    N2Evt_Destroy, N2Evt_DomAdded, N2Evt_DomRemoved, N2Evt_OnAsyncDlgShow,
    N2Evt_OnHtml,
    N2Evt_OnLogic,
    N2Evt_Resized
} from "./N2";
import {N2HtmlDecorator} from "./N2HtmlDecorator";
import {Elem_or_N2} from './N2Utils';

export interface StateN2 {

    onAsyncDlgShow?:(ev:N2Evt_OnAsyncDlgShow) => Promise<void>;

   /**
    * This method assumes that the state is completely initialized and ready to be used.
    *
    * Useful when overriding in order to customize the state object before calling super.
    *
    * If this is specified, the widget's method (if any) will not be called.
    * Should you need to call the corresponding widget method, you can call it manually from this method
    * by using the widget instance in the parameter.
    *
    *
    */
   onStateInitialized?:(ev:N2Evt) => void;

   /**
    *  Called after initLogic has been completed for this component AND for ALL the child components
    */
   onAfterChildrenInit?: () => void;

   /**
    *  Called after initLogic has been completed for this component but NOT for any child components
    *  Use the <link>onChildrenInstantiated</link> event if you need all child components to also have been initialized
    */
   onAfterInitWidgetOnly?: (ev:N2Evt_AfterLogic) => void;

   /**
    * If this is specified, the widget's method (if any) will not be called.
    * Should you need to call the corresponding widget method, you can call it manually from this method
    * by using the widget instance in the parameter
    */
   onAfterInitLogic ?: (ev : N2Evt_AfterLogic) => void;

   /**
    * If this is specified, the widget's method (if any) will not be called.
    * Should you need to call the corresponding widget method, you can call it manually from this method
    * by using the widget instance in the parameter
    */
   onBeforeInitLogic?: (ev ?: N2Evt_BeforeLogic) => (void|Promise<void>);

   /**
    * If this is specified, it will be called when the html element for this N2 widget is added to the DOM
    * @param {N2Evt_DomAdded} ev
    */
   onDOMAdded ?: (ev: N2Evt_DomAdded) => void | Promise<void>;

   /**
    * If this is specified, it will be called when the html element for this N2 widget is removed from the DOM
    * @param {N2Evt_DomRemoved} ev
    */
   onDOMRemoved ?: (ev: N2Evt_DomRemoved) => void | Promise<void>;

   /**
    * The HTML decoration for the HTML element that of the widget
    */
   deco?: N2HtmlDecorator;

   /**
    * A wrapper element around the HTML element of the widget
    */
   wrapper ?: N2HtmlDecorator;

   /**
    * Contains all the fields that have references to this instance and are usually created by the widget initialization code
    */
   ref ?:StateN2Ref;

   /**
    * Sibling(s) of the main anchor that will be rendered before the main anchor
    */
   prefixSiblings?:Elem_or_N2[];

   /**
    * Sibling(s) of the main anchor that will be rendered after the main anchor
    */
   siblings ?:Elem_or_N2[];

   /**
    * The current children this widget contains
    */
   children?: Elem_or_N2[];


   /**
    * If this is true, the widget will be rendered without using the <link>tagId</link> value as the id of the HTML element.
    * @see tagId
    */
   noTagIdInHtml?: boolean;

   // /**
   //  * Set to true if the existing HTMLElement needs to be destroyed and recreated when refreshing
   //  */
   // resetUIOnRefresh?: boolean;

   /**
    * If true, the resize is tracked for the HTML element of the widget
    */
   resizeTracked?: boolean;


   // /**
   //  * Set to true if the widget is completely static and no refresh should take place
   //  */
   // staticWidget?: boolean;

   /**
    * The unique id of the widget (also used as the id of the HTML element if <link>noTagIdInHtml</link> is false)
    * @see noTagIdInHtml
    */
   tagId?: string;

   /**
    * The id of the wrapper element around the HTML element of the widget
    * Defined as `${tagId}_wrapper` by default
    */
   wrapperTagId ?: string;

   // onClear?: (args:N2Evt_OnClear) =>  void ;

   onDestroy?: (ev: N2Evt_Destroy) =>  void ;

   onHtml?: (ev:N2Evt_OnHtml) =>HTMLElement;

   onLogic?: (ev : N2Evt_OnLogic) =>  void;

   // onRefresh?: (args ?: N2Evt_Refresh) =>  void;
   /**
    * Called when the widget is resized (assuming <link>widget.resizeTracked</link> is true)
    * @param evt
    */
   onResized ?: (ev?:N2Evt_Resized) => void;

   widgetErrorHandler?: WidgetErrorHandler;

   onBeforeInitHtml ?: (ev: N2Evt_OnHtml) => void;

   /**
    * This optional propery exists to allow the developers to store dynamic data in the state object without
    * the Typescript compiler complaining about using an unknown property otherwise.
    *
    * This property will be initialized to {} in the initialization of widget/state
    */
   other ?: any;

   /**
    * Represents a validator function for this N2 widget.
    * @param ev - The validation event object.
    * @returns void
    *
    * @description
    * The validator function should:
    * - Set `ev.error` to a non-null/non-empty error message string if there is an error (depending on the N2 control, the value might be in  `ev.value`).
    * - Do absolutely nothing if the value is valid.
    *
    * @example
    * const myValidator: N2Validator<N2TextField, string> = (ev) => {
    *   if (ev.value.length < 3) {
    *     ev.error = "Input must be at least 3 characters long";
    *   }
    * };
    */
   validationRule?: N2Validator<N2, any>;



    /**
     * Optional key that will be used when saving user settings for this grid.
     *
     * If not provided, no user settings will can saved.
     *
     * Whether this is used depends on the developer code, it is not populated by Nexus.
     */
    user_settings_key?: string;

    /**
     * Optional container element for this element.
     *
     * Whether this is used depends on the developer code, it is not populated by Nexus.
     */
    container ?: Elem_or_N2;


} // StateN2

export interface StateN2Ref {

   /**
    * the htmlElement (usually generated by <link>onHtml</link>) that underpins the widget. This is a generated property (usually)
    */
   htmlElement ?: HTMLElement;

   widget?: N2;

}