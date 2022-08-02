import {AnyWidget, Args_AnyWidget} from "../AnyWidget";
import {StringArg, stringArgVal}   from "../../BaseUtils";
import {css_horizontal_spacer}   from "../controls/WgtCSS";

export class Args_WgtPanel_SpacerHorizontal { // does not extend Args_AnyWidget on purpose, it's too simple
   pixels ?: number = 0;
   style ?: StringArg;
   extraClasses ?: StringArg;
}

export class WgtPanel_SpacerHorizontal extends AnyWidget {

   args: Args_WgtPanel_SpacerHorizontal;

   protected constructor(args?: Args_WgtPanel_SpacerHorizontal) {
      super();
      args =  args || {}; // make sure it's something
      this.args = args;

      let descriptor: Args_AnyWidget = new Args_AnyWidget();
      descriptor.id = 'WgtPanel_SpacerHorizontal';
      this.initialize_AnyWidget(descriptor);
   }

   static create(args?:Args_WgtPanel_SpacerHorizontal):WgtPanel_SpacerHorizontal{
      return new WgtPanel_SpacerHorizontal(args);
   }

   async localContentBegin(): Promise<string> {
      let args = this.args;

      let classes:string = (args.pixels ? '' : `${css_horizontal_spacer} `);
      if ( args.extraClasses)
         classes += args.extraClasses;

      let style = '';
      if (args.style || args.pixels) {

         let pixels = '';
         if (args.pixels)
            pixels = `margin-right:${args.pixels}px;`;

         style = `style="${stringArgVal(args.style)} ${pixels}"`
      }
      let b = `<div id="${this.tagId}" `;
      if ( classes)
         b += `class="${classes}" `;
      b += style;
      b += '></div>';
      return b;
   }

}