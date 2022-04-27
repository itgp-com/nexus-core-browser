import {Args_WgtPanel_Generic_Abstract, WgtPanel_Generic_Abstract} from "./WgtPanel_Generic_Abstract";


export class Args_WgtPanel_Generic extends Args_WgtPanel_Generic_Abstract {
}

export class WgtPanel_Generic extends WgtPanel_Generic_Abstract<Args_WgtPanel_Generic> {

   protected constructor() {
      super();
   }

   static create(args?: (Args_WgtPanel_Generic)):WgtPanel_Generic {
      let t = new WgtPanel_Generic();
      t.initialize_WgtPanel_Generic(args);
      return t;
   }

   initialize_WgtPanel_Generic(args: Args_WgtPanel_Generic) {
      super.initialize_WgtPanel_Generic_Abstract(args);
   }


}