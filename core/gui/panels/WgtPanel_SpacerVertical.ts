import {AnyWidget, Args_AnyWidget} from "../AnyWidget";
import {StringArg, stringArgVal}   from "../../BaseUtils";
import {css_vertical_spacer}     from "../controls/WgtCSS";

export class Args_WgtPanel_SpacerVertical { // does not extend Args_AnyWidget on purpose, it's too simple
   pixels ?: number;
   style ?: StringArg;
   extraClasses ?: StringArg;
}

export class WgtPanel_SpacerVertical extends AnyWidget {

   args: Args_WgtPanel_SpacerVertical;

   protected constructor(args?: Args_WgtPanel_SpacerVertical) {
      super();
      args =  args || {} ; // make sure it's something (if args exists, the or stops. If it doesn't the result is {}
      this.args = args;

      let descriptor: Args_AnyWidget = new Args_AnyWidget();

      descriptor.id = 'WgtPanel_SpacerVertical';
      this.initialize_AnyWidget(descriptor);
   }

   static create(args?:Args_WgtPanel_SpacerVertical):WgtPanel_SpacerVertical{
      return new WgtPanel_SpacerVertical(args);
   }
   async localContentBegin(): Promise<string> {
      let args = this.args;
      let classes:string = (args.pixels ? ''  : `${css_vertical_spacer} `);
      if ( args.extraClasses)
         classes += args.extraClasses;

      let style = '';
      if (args.style || args.pixels) {
         let pixels = '';
         if (args.pixels)
            pixels = `padding-bottom:${args.pixels}px;`;

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