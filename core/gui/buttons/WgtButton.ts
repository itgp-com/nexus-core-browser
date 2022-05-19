import {AnyWidget}                                          from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {StringArg, stringArgVal, voidFunction}              from "../../CoreUtils";
import {Button, ButtonModel}                                from '@syncfusion/ej2-buttons';
import {enableRipple}                                       from '@syncfusion/ej2-base';
import {AbstractWidget}                                     from "../AbstractWidget";

enableRipple(true);

export enum ButtonIconPosition {
   Left   = "Left",
   Right  = "Right",
   Bottom = "Bottom",
   Top    = "Top"
}

export class Args_WgtButton implements IArgs_HtmlTag{
   /**
    * The name of the html tag used for this button will be prefixed by this string
    */
   id ?: StringArg;

   /**
    * Text or HTML to show in the button
    */
   label ?: StringArg;
   iconPosition ?: ButtonIconPosition;

   onClick ?: (ev: MouseEvent) => void;

   ej ?: ButtonModel;

   refresh ?: voidFunction;

   htmlTagClass?: string;
   htmlTagStyle?: string;
   htmlTagType?: string;
   htmlOtherAttr ?: { string: string };
   children ?: AbstractWidget[];

   /**
    *  Called after initLogic has been completed
    */
   onInitialized ?: (widget:any)=>void;
}


export class WgtButton extends AnyWidget<Button> {
   args: Args_WgtButton;

   protected constructor() {
      super();
   }

   static create(args?: Args_WgtButton): WgtButton {
      let instance =  new WgtButton();
      instance.initialize_WgtButton(args);
      return instance;
   }


   initialize_WgtButton( args ?: Args_WgtButton ){
      args = args ||{};
      args      = this.customizeArgs(args); // give extending classes a chance to modify
      this.args = args;

      if ( ! args.label)
         args.label = '';

      let descriptor: Args_AnyWidget = new Args_AnyWidget();
      if (args.label || args.label == '')
         this.title = stringArgVal(args.label);
      if (args.id) {
         descriptor.id = stringArgVal(args.id);
      }
      if ( args.children)
         descriptor.children = args.children;

      if ( args.onInitialized)
         descriptor.onInitialized = args.onInitialized;
      

      descriptor.refresh = args.refresh;
      this.initialize_AnyWidget(descriptor);

   } // initialize_WgtButton

   async localContentBegin(): Promise<string> {
      let b: string = `<button id="${this.tagId}" type="button" ${IArgs_HtmlTag_Utils.all(this.args)} >${this.title}`;
      return b;
   }

   async localContentEnd(): Promise<string> {
      return '</button>'
   }


   async localLogicImplementation() {
      let args = this.args;

      let model: ButtonModel = args.ej || {}; // default to args.ej, but ensure it's not null

      if (args.label)
         model.content = stringArgVal(args.label);
      if (args.iconPosition)
         model.iconPosition = args.iconPosition;
      this.obj = new Button(model);
      this.obj.appendTo(this.hgetButton);

      if (args.onClick) {
         this.hgetButton.onclick = args.onClick;
      }
   }// localInitLogicImplementation
   /**
    * Override this method to change arguments in extending classes
    * @param args
    */
   customizeArgs(args: Args_WgtButton): Args_WgtButton {
      return args;
   }



} // class WButton