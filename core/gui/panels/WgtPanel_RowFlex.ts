import {Args_WgtPanel, Args_WgtPanel_SpecificClass, WgtPanel_SpecificClass} from "./WgtPanel_SpecificClass";


export class WgtPanel_RowFlex extends WgtPanel_SpecificClass {

   protected constructor() {
      super();
   }

   static create(args ?: Args_WgtPanel): WgtPanel_RowFlex {
      let instance = new WgtPanel_RowFlex();
      instance.initialize_WgtPanel_RowFlex(args);
      return instance;
   }

   initialize_WgtPanel_RowFlex(args: Args_WgtPanel) {
      let argsSuper: Args_WgtPanel_SpecificClass = {mandatoryClass: 'flex-container-row'};
      argsSuper =  {...argsSuper, ...args, }; // combine the properties, with args overwriting same properties defined in default args
      this.initialize_WgtPanel_SpecificClass(argsSuper);
   }

}