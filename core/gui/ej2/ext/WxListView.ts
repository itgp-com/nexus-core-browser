import {ListView, ListViewModel, Virtualization} from '@syncfusion/ej2-lists';
import {addWidgetClass}                          from "../../AbstractWidget";
import {Args_AnyWidget}                          from "../../AnyWidget";
import {AnyWidgetStandard}                       from "../../AnyWidgetStandard";


ListView.Inject(Virtualization);

export class Args_WxListView extends Args_AnyWidget<ListViewModel> {

}

export class WxListView extends AnyWidgetStandard {
   static readonly CLASS_NAME:string = 'WxListView';
   protected constructor() {
      super();
   }

   static async create(args?: Args_WxListView): Promise<WxListView> {
      let instance = new WxListView();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args:Args_WxListView){
      if(!args)
         args = new Args_WxListView();
      args.ej = args.ej ||{};
      addWidgetClass(args, WxListView.CLASS_NAME);
      await super.initialize_AnyWidgetStandard(args);
   } // initialize_WxListView_Type01

   async localLogicImplementation(): Promise<void> {
    let args:Args_WxListView = this.initArgs as Args_WxListView;

      try {
         this.obj = new ListView(args.ej);
         this.obj.appendTo(this.hget)
      } catch (ex) {
         this.handleError(ex);
      }
   } // localLogicImplementation

}