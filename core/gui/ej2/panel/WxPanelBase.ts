import {AbstractWidget, addWidgetClass} from "../../AbstractWidget";
import {AnyScreen, Args_AnyScreen}      from "../../AnyScreen";
import {resolveWidgetArray}             from "../../WidgetUtils";
import {ResizeSensor}                   from "css-element-queries";
import {ResizeSensorCallback}           from "css-element-queries/src/ResizeSensor";
import {debounce}                       from "lodash";


export class Args_WxPanelBase extends Args_AnyScreen {

   /**
    * Display the refresh button in the header of the WxDialogWindow this screen is contained in.
    */
   showHeaderRefreshButton ?: boolean;

   /**
    * Determines whether the feedback button is displayed in the WxDialogWindow header for this window (assuming this is the top content window obviously)
    *  Defaults to true for this app
    */
   showHeaderFeedbackButton ?: boolean;

   /**
    * The amount of time between resize events that will trigger a resize of the grid. In milliseconds.
    * Defaults to 500ms
    */
   resizeDebounceInterval ?: number;
}

/**
 * Usage: When extending, simply implement create_WgtScreen_AppMain to create the arguments necessary for the window you are making
 */
export class WxPanelBase<DATA_TYPE, ARGS_TYPE extends Args_WxPanelBase = Args_WxPanelBase> extends AnyScreen<DATA_TYPE> {


   private _args: ARGS_TYPE;


   protected constructor() {
      super();
   }

   protected async _initialize(args: ARGS_TYPE) {

      if (!args)
         args = new Args_WxPanelBase() as any;
      addWidgetClass(args, 'WxPanelBase');

      if (this.title == null || this.title == 'n/a')
         args.title = args.title || 'n/a';

      this.args = args;

      if (args.showHeaderFeedbackButton == null) {
         args.showHeaderFeedbackButton = true;
      }


      let localChildren: AbstractWidget[] = [];


      if (args.children) {
         // args.children.push(WxHTML.create({
         //                                     htmlContent: `<div style="display:flex;width: max-content;background-color:yellow">${copyright_notice_html}</div>`
         //                                  }));
         let resolvedChildren: AbstractWidget[] = await resolveWidgetArray(args.children);
         args.children                          = resolvedChildren; // keep the resolved list, so we have the same instances everywhere
         localChildren.push(...resolvedChildren);
      }
      this.children = localChildren; // the setter expects a complete set

      if (!args.extraTagIdCount)
         args.extraTagIdCount = 2;
      if (args.extraTagIdCount < 2)
         args.extraTagIdCount = 2; // at least 2

      await this.initialize_AnyScreen(args);
   }

   async localLogicImplementation() {
      let thisX = this;
      await super.localLogicImplementation();

      let htmlElement = this.hget;

      let debouncedFunction: ResizeSensorCallback = debounce(
         (_size: { width: number; height: number; }) => {
            if ( thisX && thisX.initialized ) {
               thisX.panelResized({
                                     panel: thisX,
                                     size:  _size
                                  });
            } // if (thisX && thisX.obj && thisX.initialized )
         } // function body of debouncedFunction
         , (thisX.args.resizeDebounceInterval ? thisX.args.resizeDebounceInterval : 500)
      );


      new ResizeSensor(
         htmlElement,
         debouncedFunction,
      ); // ResizeSensor
   } // localLogicImplementation

   panelResized(evt: Evt_PanelResized<any>) {
      // console.log(`panelResized: id: ${evt.panel.tagId}, height:${evt.size.height}, width:${evt.size.width}`); //
   }

   /**
    * By convention we have one tag reserved for dialogs that overlap the whole screen.
    */
   get dialogTagId() {
      return this.extraTagId(0);
   }

   /**
    * By convention we have this tag reserved for prompts or informational messages (that do not overlap the whole screen)
    */
   get confirmDialogTagId() {
      return this.extraTagId(1);
   }

   get args(): ARGS_TYPE {
      return this._args;
   }


   set args(value: ARGS_TYPE) {
      this._args = value;
   }
} //main

export class Evt_PanelResized<T> {
   panel: WxPanelBase<T>;
   size: { width: number; height: number; }
}