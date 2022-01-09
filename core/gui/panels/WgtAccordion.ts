import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AbstractWidget}                                                   from "../AbstractWidget";
import {Accordion, AccordionItemModel, AccordionModel}                         from '@syncfusion/ej2-navigations';
import {AbstractWidget}                                                        from "../../";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                                    from "../Args_AnyWidget";
import {ExpandedEventArgs, ExpandEventArgs}                                    from "@syncfusion/ej2-navigations/src/accordion/accordion";
import {AnyScreen}                                                             from "../AnyScreen";

// noinspection JSUnusedGlobalSymbols
export class AccordionChild {
   /**
    * The name of the AbstractWidget containing property
    */
   static readonly WIDGET_KEY: string = 'widget';

   /**
    * The widget to be placed in the accordion item
    */
   widget: AbstractWidget;

   /**
    * Sets the header text to be displayed for the Accordion item.
    * You can set the title of the Accordion item using `header` property.
    * It also supports to include the title as `HTML element`, `string`, or `query selector`.
    * ```typescript
    *   let accordionObj: Accordion = new Accordion( {
    *        items: [
    *          { header: 'Accordion Header', content: 'Accordion Content' },
    *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div' },
    *          { header: '#headerContent', content: '#panelContent' }]
    *        });
    *   accordionObj.appendTo('#accordion');
    * ```
    *
    * @default null
    */
   header?: string;

   /**
    * Defines single/multiple classes (separated by a space) are to be used for Accordion item customization.
    *
    * @default null
    */
   cssClass?: string;

   /**
    * Defines an icon with the given custom CSS class that is to be rendered before the header text.
    * Add the css classes to the `iconCss` property and write the css styles to the defined class to set images/icons.
    * Adding icon is applicable only to the header.
    * ```typescript
    *   let accordionObj: Accordion = new Accordion( {
    *        items: [
    *          { header: 'Accordion Header', iconCss: 'e-app-icon' }]
    *        });
    *   accordionObj.appendTo('#accordion');
    * ```
    * ```css
    * .e-app-icon::before {
    *   content: "\e710";
    * }
    * ```
    *
    * @default null
    */
   iconCss?: string;

   /**
    * Sets the expand (true) or collapse (false) state of the Accordion item. By default, all the items are in a collapsed state.
    *
    * @default false
    */
   expanded?: boolean;

   /**
    * Sets false to hide an accordion item.
    *
    * @default true
    */
   visible?: boolean;

   /**
    * Sets true to disable an accordion item.
    *
    * @default false
    */
   disabled?: boolean;
}

export class Args_WgtAccordion extends Args_AbstractWidget {
   /**
    * If this is present,  a new wrapper div is created around the actual element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej ?: AccordionModel;
   childItems ?: AccordionChild[]
}

// noinspection JSUnusedGlobalSymbols
export class WgtAccordion extends AnyWidget<Accordion, Args_AbstractWidget, any> {
   args: Args_WgtAccordion;
   lastExpandingArgs: ExpandEventArgs;
   lastExpandedArgs: ExpandedEventArgs;

   protected constructor() {
      super();
   }

   async initialize_WgtAccordion(argsAccordion: Args_WgtAccordion) {
      let thisX = this;

      if (!argsAccordion)
         argsAccordion = {};
      if (!argsAccordion.ej)
         argsAccordion.ej = {};
      if (!argsAccordion.childItems)
         argsAccordion.childItems = [];

      thisX.args = argsAccordion;


      // first create items according to EJ2 model
      let items: AccordionItemModel[] = argsAccordion.ej.items;
      if (!items)
         items = [];


      for (const accordionChild of argsAccordion.childItems) {
         let widget: AbstractWidget = accordionChild.widget;
         if (!widget)
            continue; // next in loop

         let content: string = await widget.initContent()
         widget.parent       = thisX;

         let item: AccordionItemModel = {};
         // Get all the properties of the AccordionItemModel item (all except for the widget property)
         for (const key in accordionChild) {
            if (key != AccordionChild.WIDGET_KEY) {
               item[key] = accordionChild[key];
            } // if key
         }// for

         if (item.content == null)
            item.content = ''

         item.content += content; // append widget content
         items.push(item);
      } // for accordionChild
      argsAccordion.ej.items = items;
      //    this.children          = children;

      this.initialize_AnyWidget(argsAccordion);

      //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      this.args_AnyWidgetInitializedListeners.addListener(
         new class extends Args_AnyWidget_Initialized_Listener {
            argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {

               // initialize the tags so they available in initContentBegin/End
               thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;

            }
         }
      );
   } // initialize


   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      x += `<div id="${this.tagId}">`;

      return x; // no call to super
   } // localContentBegin


   async localContentEnd(): Promise<string> {
      let x: string = "";
      x += `</div>`;

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   }

   async localLogicImplementation() {
      let anchor = this.hget;
      let thisX  = this;


      let model: AccordionModel = this.args?.ej;
      if (!model) model = {};

      //----------- Handle Expanding event ----------
      let expandingFromArgs = model.expanding;
      model.expanding                        = (ev: ExpandEventArgs) => {
         // save the event arguments for later
         thisX.lastExpandingArgs = ev;
         // execute any logic that was passed in
         if (expandingFromArgs) {
            try {
               expandingFromArgs.call(thisX, ev);
            } catch (ex) {
               this.handleError(ex);
            }
         }
      }; // expanding
      //----------- Handle Expanded event ----------
      let expandedFromArgs = model.expanded;
      model.expanded       = (ev: ExpandedEventArgs) => {
         thisX.lastExpandedArgs = ev;
         thisX.initializePanel();
         // execute any logic that was passed in
         if (expandedFromArgs) {
            try {
               expandedFromArgs.call(thisX, ev);
            } catch (ex) {
               this.handleError(ex);
            }
         }
      }; // expanding


      thisX.obj = new Accordion(model);
      thisX.obj.appendTo(anchor);


      for (const accordionChild of thisX.args.childItems) {
         await (accordionChild.widget as AbstractWidget).initLogic();
      }
      await super.localLogicImplementation();
   }

   async localDestroyImplementation() {
      // destroy the children then this object
      for (let tabObj of this.args.childItems) {
         try {
            await tabObj.widget.destroy();
         } catch (ex) {
            this.handleError(ex);
         }
      }
      if (this.obj)
         this.obj.destroy();
   }

   async localClearImplementation() {
      for (let tabObj of this.args.childItems) {
         await tabObj.widget.clear();
      }
   }

   async localRefreshImplementation() {
      for (let childItem of this.args.childItems) {
         await childItem.widget.refresh();
      }
   }

   //--------------

   initializePanel(): void {
      let thisX = this;
      if (!thisX.lastExpandingArgs)
         return;

      let expandingArgs = thisX.lastExpandingArgs; // so it doesn't get overwritten if someone clicks fast while setImmediate is executed

      setImmediate(async () => {
         // Fix 2020-04-27 D. Pociu
         // this is ABSOLUTELY necessary in order to give the HTML in the tab control
         // a chance to be inserted. Without this, you get very weird Syncfusion EJ2
         // error about parts of the widgets being undefined during refresh

         let accordionChild: AccordionChild = this.args?.childItems[expandingArgs.index];
         let panelObj: AbstractWidget       = accordionChild.widget;
         if (panelObj) {
            if (!panelObj.initialized) {
               try {
                  await panelObj.initLogic(); // this includes a refresh
                  panelObj.initLogicAsTab(); // trigger this on the component inside the tab
               } catch (error) {
                  console.log(error);
                  // this.handleError(error);
               }
            }

            /**
             * Added 2020-05-14 David Pociu to register the panes in the tab (since initContentAndLogic i
             */
            try {
               if (panelObj.doRegisterInfo) {
                  panelObj.registerInfo(thisX.hget);
               }
            } catch (ex) {
               console.log(ex)
            }

            try {
               // trigger this on the component inside the tab
               panelObj.activatedAsInnerWidget({
                                                  parentWidget: thisX,
                                                  parentInfo:   {
                                                     'expanding': thisX.lastExpandingArgs,
                                                     'expanded':  thisX.lastExpandedArgs,
                                                  }
                                               });
            } catch (error) {
               console.log(error);
               // this.handleError(error);
            }

            try {
               /**
                * Only perform the refresh if the component in the tab is not extending AnyScreen.
                * AnyScreen will already trigger a refresh at the end of it's initLogic implementation
                * and that initalization is also on setImmediate (as of 2020-05-11 Dave) so there's
                * no need for this refresh to fire here.
                */
               if (!(panelObj instanceof AnyScreen)) {
                  await panelObj.refresh(); // all the button enable/disable (the initialized flag prevents re-initialization of EJ2 components)
               }
            } catch (error) {
               console.log(error);
               this.handleError(error);
            }
         } // if panelObj
      }); // setImmediate

   } // initializePanel

} //main