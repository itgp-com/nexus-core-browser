import {AbstractDialogWindow, Args_AbstractDialogWindow} from "./AbstractDialogWindow";

export class Args_DialogWindow extends Args_AbstractDialogWindow{

}



/**
 * Generic Dialog Modal Window that takes an AbstractWidget as content
 */
export class DialogWindow extends AbstractDialogWindow {


//------------------------- constructor -------------------
   protected constructor() {
      super();

   } // constructor


   async initialize_DialogWindow(args: Args_DialogWindow) {
      await this.initialize_AbstractDialogWindow(args);
   }

   static async create(args:Args_DialogWindow){
      let instance:DialogWindow = new DialogWindow();
      await instance.initialize_DialogWindow(args);
      return instance;
   }

   static async createAndShow(args:Args_DialogWindow){
      let instance = await DialogWindow.create(args);
       instance.show();
      return instance;
   }

} // DialogWindow
