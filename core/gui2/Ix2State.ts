import {Ix2HtmlDecorator} from "./Ix2HtmlDecorator";
import {Ax2Widget}        from "./Ax2Widget";
import * as ko             from "knockout";
import {BeforeInitLogicEvent} from "../gui/BeforeInitLogicListener";
import {AfterInitLogicEvent}  from "../gui/AfterInitLogicListener";
import {WidgetErrorHandler}   from "../gui/WidgetErrorHandler";

export interface Ix2State {


   afterInitLogic?: (evt: AfterInitLogicEvent) => void;


   beforeInitLogic?: (evt: BeforeInitLogicEvent<Ax2Widget>) => void;

   /**
    * The current children this widget contains as on ObservableArray.
    * If <link>initialChildren</link> is set, this property will initially be set to the resolved value of <link>initialChildren</link>
    * @see initialChildren
    */
   children?: ko.ObservableArray<Ax2Widget<any>>

   /**
    * The HTML decoration for the HTML element that of the widget
    */
   decorator?: Ix2HtmlDecorator;


   /**
    * Initial array of children widgets that is resolved and then turned into the <link>children</link> observableArray property
    *
    * This property is only considered during the initial setup of the widget, and should not be relied on to be up to date past that point.
    * @see children
    */
   initialChildren?: (Ax2Widget<any> | Promise<Ax2Widget<any>>)[];

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
   onInitialized?: (widget: any) => void;

   /**
    * Set to true if the widget is completely static and no refresh should take place
    */
   staticWidget?: boolean;

   /**
    * The unique id of the widget (also used as the id of the HTML element if <link>noTagIdInHtml</link> is false)
    * @see noTagIdInHtml
    */
   tagId?: string;

   widget?: Ax2Widget<this>


   initLogic ?: functionCancellableWx2Event;

   initLogicLast ?: functionWx2Event;

   widgetErrorHandler?: WidgetErrorHandler;
}

/**
 * Return true if the default logic should be executed, false if logic should return immediately
 */
export type functionCancellableWx2Event = (widget: Ax2Widget<any>) => Promise<boolean>;



export type functionWx2Event = (widget: Ax2Widget<any>) => Promise<void>;