import {Args_WgtRadioButton, WgtRadioButton} from "./WgtRadioButton";


export class WgtRadioButtonSimple extends WgtRadioButton{

   protected constructor() {
      super();
   }

   static create<T>(args: Args_WgtRadioButton){
      let instance = new WgtRadioButtonSimple()
      instance.initialize_WgtDropDownSimple(args);
      return instance;
   } // create

   initialize_WgtDropDownSimple(args: Args_WgtRadioButton){
      if (!args)
         args = new Args_WgtRadioButton(); // so defaults are in place

      this.initialize_WgtRadioButton(args);
   } //initialize_WgtDropDownSimple



}