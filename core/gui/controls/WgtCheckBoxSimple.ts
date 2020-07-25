import {Args_WgtCheckBox, WgtCheckBox} from "./WgtCheckBox";

export class Args_WgtCheckBoxSimple extends Args_WgtCheckBox {

}

export class WgtCheckBoxSimple extends WgtCheckBox {

   protected constructor() {
      super();
   }

   static create<T>(args:Args_WgtCheckBoxSimple){
      let instance = new WgtCheckBoxSimple();
      instance.initialize_WgtCheckBoxSimple(args);
      return instance;
   }

   initialize_WgtCheckBoxSimple(args: Args_WgtCheckBox) {
      if (! args)
         args = new Args_WgtCheckBoxSimple(); // initialize with defaults

      if ( args.modelTrueValue == undefined)
         args.modelTrueValue = 'Yes';

      if (args.modelFalseValue == undefined)
         args.modelFalseValue = 'No';

      this.initialize_WgtCheckBox(args);
   }
}