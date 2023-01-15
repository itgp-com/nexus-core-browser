import {AfterInitLogicEvent}  from "../gui/AfterInitLogicListener";
import {BeforeInitLogicEvent} from "../gui/BeforeInitLogicListener";
import {WidgetErrorHandler}   from "../gui/WidgetErrorHandler";
import {Ax2Widget}            from "./Ax2Widget";
import {Ix2HtmlDecorator}     from "./Ix2HtmlDecorator";

export interface Ix2State<WIDGET_TYPE extends Ax2Widget = Ax2Widget> {


   afterInitLogic?: (evt: AfterInitLogicEvent) => void;


   beforeInitLogic?: (evt: BeforeInitLogicEvent<WIDGET_TYPE>) => void;
   /**
    * The HTML decoration for the HTML element that of the widget
    */
   deco?: Ix2HtmlDecorator;


   /**
    * Contains all the fields that are generated by the widget initialization code
    */
   gen ?:Ix2StateGenerated<WIDGET_TYPE>

   /**
    * The current children this widget contains
    * @see initialChildren
    */
   children?: WIDGET_TYPE[]


   /**
    * If this is true, the widget will be rendered without using the <link>tagId</link> value as the id of the HTML element.
    * @see tagId
    */
   noTagIdInHtml?: boolean;

   /**
    * Set to true if the existing HTMLElement needs to be destroyed and recreated when refreshing
    */
   repaintOnRefresh?: boolean


   /**
    *  Called after initLogic has been completed for this component AND for ALL the child components
    *  Use the <link>onInitialized</link> event if you need the component initialized but not the child components
    */
   onChildrenInitialized?: (widget: any) => void;

   /**
    *  Called after initLogic has been completed for this component but NOT for any child components
    *  Use the <link>onChildrenInstantiated</link> event if you need all child components to also have been initialized
    */
   onInit?: (widget: any) => void;

   /**
    * Set to true if the widget is completely static and no refresh should take place
    */
   staticWidget?: boolean;

   /**
    * The unique id of the widget (also used as the id of the HTML element if <link>noTagIdInHtml</link> is false)
    * @see noTagIdInHtml
    */
   tagId?: string;

   onClear?: () =>  (void | Promise<void>);

   onDestroy?: () =>  (void | Promise<void>);

   onHtml?: () =>HTMLElement;

   onLogic?: () =>  (void | Promise<void>);

   onRefresh?: () =>  (void | Promise<void>);

   widgetErrorHandler?: WidgetErrorHandler;
}

export interface Ix2StateGenerated<WIDGET_TYPE extends Ax2Widget = any>{



   /**
    * the htmlElement (usually generated by <link>onHtml</link>) that underpins the widget. This is a generated property (usually)
    */
   htmlElement ?: HTMLElement;

   widget?: WIDGET_TYPE;



}

//
// /**
//  * Return true if the default logic should be executed, false if logic should return immediately
//  */
// export type functionCancellableWx2Event = (widget: Ax2Widget<any>) => Promise<boolean>;
//