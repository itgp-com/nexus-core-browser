import {Skeleton, SkeletonModel} from '@syncfusion/ej2-notifications';

import {AnyWidgetStandard}   from "../../AnyWidgetStandard";
import {Args_AnyWidget}      from "../../AnyWidget";
import {addWidgetClass}      from "../../AbstractWidget";
import {IArgs_HtmlTag_Utils} from "../../../BaseUtils";

export class Args_WxSkeleton extends Args_AnyWidget<SkeletonModel> {
}


export class WxSkeleton extends AnyWidgetStandard<Skeleton, Args_WxSkeleton, any> {
   static readonly CLASS_NAME: string = 'WxSkeleton';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxSkeleton): Promise<WxSkeleton> {
      let wx = new WxSkeleton();
      await wx._initialize(args);
      return wx;
   }

   protected async _initialize(args: Args_WxSkeleton) {
      args          = IArgs_HtmlTag_Utils.init(args);
      this.initArgs = args;
      addWidgetClass(args, WxSkeleton.CLASS_NAME);
      await this.initialize_AnyWidgetStandard(args);
   } //  initialize_WxSkeleton_Orca01

   async localLogicImplementation() {
      let widgetModel = this.initArgs?.ej;
      if (widgetModel == null)
         widgetModel = {};

      let thisX = this;

      thisX.obj = new Skeleton(widgetModel);
      thisX.obj.appendTo(thisX.hget);

   } // localLogicImplementation

} // WxDiagram