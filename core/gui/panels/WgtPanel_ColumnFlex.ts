import {Args_WgtPanel, Args_WgtPanel_SpecificClass, WgtPanel_SpecificClass} from "./WgtPanel_SpecificClass";


export class WgtPanel_ColumnFlex extends WgtPanel_SpecificClass {

   protected constructor() {
      super();
   }


   static create(args ?: Args_WgtPanel): WgtPanel_ColumnFlex {
      let instance = new WgtPanel_ColumnFlex();
      instance.initialize_WgtPanel_ColumnFlex(args);
      return instance;
   }

   initialize_WgtPanel_ColumnFlex(args: Args_WgtPanel) {
      let argsSuper: Args_WgtPanel_SpecificClass = {mandatoryClass: 'flex-container-column'};
      argsSuper =  {...argsSuper, ...args, }; // combine the properties, with args overwriting same properties defined in default args
      this.initialize_WgtPanel_SpecificClass(argsSuper);
   }

}