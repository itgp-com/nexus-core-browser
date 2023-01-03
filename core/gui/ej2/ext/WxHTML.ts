//How to dynamically create CSS class in JavaScript and apply?
// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply


import {AbstractHTML, Args_AbstractHTML} from "../abstract/AbstractHTML";

export class Args_WxHTML extends Args_AbstractHTML {
}

export class WxHTML extends AbstractHTML {
   protected constructor() {
      super();
   }

   static async create(args?: Args_WxHTML): Promise<WxHTML> {
      let instance = new WxHTML();
      await instance.initialize_WxHTML(args);
      return instance;
   }

   protected async initialize_WxHTML(args: Args_WxHTML){
      if(!args)
         args = new Args_WxHTML();
      await super.initialize_AbstractHTML(args);
   }
}