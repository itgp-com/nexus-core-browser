import {AbstractDropDown, Args_AbstractDropDown} from "../abstract/AbstractDropDown";
import {addWidgetClass}                          from "../../AbstractWidget";

export class Args_WxDropDownObjList<T = any> extends Args_AbstractDropDown {
   data: T[];


   /**
    * The name of the object field to be displayed in the dropdown
    */
   textColumn: string;

   /**
    * The name of the object field to be used as a value
    */
   valueColumn: string;

   enabled ?: boolean;
}

export class WxDropDownObjList extends AbstractDropDown {
   protected constructor() {
      super();
   }

   static async create<T>(args: Args_WxDropDownObjList) {
      let instance = new WxDropDownObjList()
      await instance.initialize_Wej2DropDown_ObjList(args);
      return instance;
   } // create

   protected async initialize_Wej2DropDown_ObjList(args: Args_WxDropDownObjList) {
      if (!args)
         args = new Args_WxDropDownObjList(); // so defaults are in place
      args.ej = args.ej || {};
      addWidgetClass(args, 'WxDropDownObjList')

      if (args.data == null)
         args.data = [];


      args.ej            = args.ej || {};
      args.ej.dataSource = args.data;

      args.ej.fields = {
         text:  args.textColumn,
         value: args.valueColumn,
      };

      if (args.enabled != null)
         args.ej.enabled = args.enabled;


      await this.initialize_AbstractDropDown(args);

   }


}