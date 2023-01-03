import {addWidgetClass}                                                             from "../../AbstractWidget";
import {AbstractTreeMap, Args_AbstractTreeMap}                                      from "../abstract/AbstractTreeMap";
import {TreeMap, TreeMapHighlight, TreeMapLegend, TreeMapSelection, TreeMapTooltip} from "@syncfusion/ej2-treemap";

TreeMap.Inject(TreeMapTooltip,TreeMapHighlight,TreeMapSelection, TreeMapLegend  );
export class Args_WxTreeMap extends Args_AbstractTreeMap {
}

export class WxTreeMap extends AbstractTreeMap {

   protected constructor() {
      super();
   }

   public static async create(args: Args_WxTreeMap) : Promise<WxTreeMap>{
      let instance = new WxTreeMap();
      await instance.initialize_WxTreeMap(args);
      return instance;
   }

   protected async initialize_WxTreeMap(args: Args_WxTreeMap) {
      if (!args)
         args = new Args_WxTreeMap();

      args.ej = args.ej || {};
      addWidgetClass(args, 'WxTreeMap')
      await super.initialize_AbstractTreeMap(args);
   }

   async localDestroyImplementation(): Promise<void> {
      await super.localDestroyImplementation();
      //TODO Remove in future versions if Syncfusion fixes their destroy
      // the treemap leaves a <text id="treeMapMeasureText" ....> tag behind
      let elem = document.getElementById('treeMapMeasureText');
      if ( elem)
         elem.parentNode?.removeChild(elem);
   }
}