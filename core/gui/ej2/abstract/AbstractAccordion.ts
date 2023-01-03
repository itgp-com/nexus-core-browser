import {IArgs_HtmlTag_Utils}                 from "../../../BaseUtils";
import {AbstractWidget, Args_AbstractWidget} from "../../AbstractWidget";
import {Args_AnyWidget}                      from "../../AnyWidget";
import {AnyWidgetStandard}                   from "../../AnyWidgetStandard";
import {ExpandedEventArgs, ExpandEventArgs}  from "@syncfusion/ej2-navigations/src/accordion/accordion";
import {Accordion, AccordionItemModel, AccordionModel} from '@syncfusion/ej2-navigations';


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

export abstract class Args_AbstractAccordion extends Args_AnyWidget<AccordionModel> {
   childItems ?: AccordionChild[]
}

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractAccordion extends AnyWidgetStandard<Accordion, Args_AbstractWidget, any> {
   lastExpandingArgs: ExpandEventArgs;
   lastExpandedArgs: ExpandedEventArgs;

   protected constructor() {
      super();
   }

   async initialize_AbstractAccordion(args: Args_AbstractAccordion) {
      let thisX = this;

      args          = IArgs_HtmlTag_Utils.init(args) as Args_AbstractAccordion;
      this.initArgs = args;
      if (!args.ej)
         args.ej = {};
      if (!args.childItems)
         args.childItems = [];


      // first create items according to EJ2 model
      let items: AccordionItemModel[] = args.ej.items;
      if (!items)
         items = [];


      for (const accordionChild of args.childItems) {
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
      args.ej.items = items;

      await this.initialize_AnyWidgetStandard(args);
   } // initialize


   async localLogicImplementation() {
      let anchor = this.hget;
      let thisX  = this;


      let model: AccordionModel = (this.initArgs as Args_AbstractAccordion)?.ej;
      if (!model) model = {};

      //----------- Handle Expanding event ----------
      let expandingFromArgs = model.expanding;
      model.expanding       = (ev: ExpandEventArgs) => {
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


      for (const accordionChild of (this.initArgs as Args_AbstractAccordion).childItems) {
         await (accordionChild.widget as AbstractWidget).initLogic();
      }
      await super.localLogicImplementation();
   }

   async localDestroyImplementation() {
      // destroy the children then this object
      for (let tabObj of (this.initArgs as Args_AbstractAccordion).childItems) {
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
      for (let tabObj of (this.initArgs as Args_AbstractAccordion).childItems) {
         await tabObj.widget.clear();
      }
   }

   async localRefreshImplementation() {
      for (let childItem of (this.initArgs as Args_AbstractAccordion).childItems) {
         await childItem.widget.refresh();
      }
   }

   //--------------

   initializePanel(): void {
      let thisX = this;
      if (!thisX.lastExpandingArgs)
         return;

      let expandingArgs = thisX.lastExpandingArgs; // so it doesn't get overwritten if someone clicks fast while setTimeout is executed

      // no delay on timeout
      setTimeout(async () => {
         // Fixed 2020-04-27 D. Pociu
         // this is ABSOLUTELY necessary in order to give the HTML in the tab control
         // a chance to be inserted. Without this, you get very weird Syncfusion EJ2
         // error about parts of the widgets being undefined during refresh

         let accordionChild: AccordionChild = (this.initArgs as Args_AbstractAccordion)?.childItems[expandingArgs.index];
         let panelObj: AbstractWidget       = accordionChild.widget;
         if (panelObj) {
            if (!panelObj.initialized) {
               try {
                  await panelObj.initLogic(); // this includes a refresh
                  await panelObj.initLogicAsTab({
                                                   initialized: panelObj.initialized,
                                                   index:       expandingArgs.index,
                                                   instance:    thisX
                                                }); // trigger this on the component inside the tab
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
               await panelObj.activatedAsInnerWidget({
                                                        parentWidget: thisX,
                                                        parentInfo:   {
                                                           'expanding': thisX.lastExpandingArgs,
                                                           'expanded':  thisX.lastExpandedArgs,
                                                           'index':     expandingArgs.index,
                                                        }
                                                     });
            } catch (error) {
               console.log(error);
               // this.handleError(error);
            }

         } // if panelObj
      }); // setTimeout no delay

   }


} //main