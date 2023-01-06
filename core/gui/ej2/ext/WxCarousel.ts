import {Args_AnyWidget}                 from "../../AnyWidget";
import {Carousel, CarouselModel}        from "@syncfusion/ej2-navigations";
import {AnyWidgetStandard}              from "../../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}            from "../../../BaseUtils";
import {AbstractWidget, addWidgetClass} from "../../AbstractWidget";
import {CarouselItemModel}              from "@syncfusion/ej2-navigations/src/carousel/carousel-model";
import {SlideChangedEventArgs}          from "@syncfusion/ej2-navigations/src/carousel/carousel";
import {resolveWidgetArray}             from "../../WidgetUtils";
import {AfterInitLogicEvent}            from "../../AfterInitLogicListener";

export class Args_WxCarousel extends Args_AnyWidget<CarouselModel> {

   /**
    * Implement this method to be notified when the carousel is scrolled to a new item (including the initial item).
    * @param ev information about the slide being currently displayed.
    */
   slideDisplayed?: (ev: SlideDisplayed_Event) => void;

   slideChildren: (AbstractWidget | Promise<AbstractWidget>)[];
}


export class WxCarousel extends AnyWidgetStandard<Carousel, Args_WxCarousel, any> {
   static readonly CLASS_NAME: string = 'WxCarousel';

   resolvedSlideChildren: AbstractWidget[];

   protected constructor() {
      super();
   }

   static async create(args: Args_WxCarousel): Promise<WxCarousel> {
      let wx = new WxCarousel();
      await wx._initialize(args);
      return wx;
   }

   protected async _initialize(args: Args_WxCarousel) {
      args               = IArgs_HtmlTag_Utils.init(args) as Args_WxCarousel;
      args.slideChildren = args.slideChildren || []; // make sure there's something there
      this.initArgs      = args;
      addWidgetClass(args, WxCarousel.CLASS_NAME);
      await this.initialize_AnyWidgetStandard(args);
   } //  initialize_WxCarousel_Orca01


   async localLogicImplementation() {
      let widgetModel = this.initArgs?.ej;
      if (widgetModel == null)
         widgetModel = {};

      let thisX = this;

      thisX.resolvedSlideChildren = await resolveWidgetArray(this.initArgs.slideChildren);


      if (thisX.resolvedSlideChildren) {
         let existingItems              = widgetModel.items || [];
         let children: AbstractWidget[] = this.resolvedSlideChildren || [];

         let max = Math.max(existingItems.length, children.length);

         let carouselItems: CarouselItemModel[] = new Array(max);
         for (let i = 0; i < max; i++) {
            carouselItems[i] = (i < existingItems.length ? existingItems[i] : {}) as CarouselItemModel;
         } // for

         for (let i = 0; i < children.length; i++) {
            const child = children[i];

            let htmlContent: string = await child.initContent();
            if (i < carouselItems.length) {
               let carouselItem: CarouselItemModel = carouselItems[i];
               carouselItem.template               = htmlContent
            } else {
               carouselItems.push({template: htmlContent});
            }
         } // for children
         widgetModel.items = carouselItems;
      }// if (thisX.resolvedSlideChildren)


      /**
       * Fires when the carousel is scrolled to a new item.
       */
      let userSlideChanged     = widgetModel.slideChanged; // any user function
      widgetModel.slideChanged = async (ev: SlideChangedEventArgs) => {
         try {
            if (userSlideChanged)
               userSlideChanged(ev);
         } catch (e) {
            console.error(e);
         }

         let index                        = ev.currentIndex || 0;
         let currentChild: AbstractWidget = null;
         if (this?.resolvedSlideChildren?.length > index) {
            currentChild = this.resolvedSlideChildren[index];
         }
         if (currentChild && (!currentChild.initialized)) {
            await currentChild.initLogic();
         }

         if (thisX.initArgs?.slideDisplayed) {
            thisX.initArgs.slideDisplayed({
                                             index:  index,
                                             item:   thisX.getItemHtmlElement(index),
                                             widget: currentChild,
                                          });
         }
      } // slideChanging


      thisX.obj = new Carousel(widgetModel);
      thisX.obj.appendTo(thisX.hget);

   } // localLogicImplementation


   async afterInitLogic(evt: AfterInitLogicEvent): Promise<void> {
      await super.afterInitLogic(evt);


      /**
       * Fires when the carousel is initialized - first item is always displayed.
       */
      let firstChild: AbstractWidget = null;
      if (this?.resolvedSlideChildren?.length > 0) {
         firstChild = this.resolvedSlideChildren[0];
      }
      if (firstChild && (!firstChild.initialized)) {
         await firstChild.initLogic();
      }
      let ev: SlideDisplayed_Event = {
         index:  0,
         item:   this.getItemHtmlElement(0),
         widget: firstChild,
      };
      if (this.initArgs?.slideDisplayed)
         this.initArgs.slideDisplayed(ev);

   } // afterInitLogic


   getItemHtmlElement(index: number): HTMLElement {
      let root: HTMLElement = this.obj.getRootElement();
      return <HTMLElement>root?.querySelector(`[data-index="${index}"`)?.firstElementChild;
   }


} // WxCarousel

export class SlideDisplayed_Event {
   index: number;
   item: HTMLElement;
   widget: AbstractWidget;

} // SlideDisplayed_Event