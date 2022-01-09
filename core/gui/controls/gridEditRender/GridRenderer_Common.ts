import {QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";

export class Args_GridRenderer_Common <WIDGET = any, WIDGET_MODEL = any, DATA=any, EVT=any, HTMLELEMENT=HTMLElement> {
   args: QueryCellInfoEventArgs;
   initialValue?:DATA;
   callback?: (widget:WIDGET, ev: EVT)=>void;
   editable ?: boolean;
   htmlClassName ?: string;
   htmlTemplate ?: string;
   getHtmlElement ?: (args: QueryCellInfoEventArgs)=>HTMLELEMENT;
   exceptionHandler ?:(exception:any)=>void;
   widgetModel ?: WIDGET_MODEL;
}