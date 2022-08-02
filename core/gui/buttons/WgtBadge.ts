import {Args_WgtButton, WgtButton} from "./WgtButton";
import {StringArg, stringArgVal}   from "../../BaseUtils";

export class Args_WgtBadge extends Args_WgtButton{
   badgeLabel: StringArg
} // Args+WgtBadge

export class WgtBadge extends WgtButton{


   protected constructor() {
      super();
   }

   static create(args?: Args_WgtBadge): WgtBadge {
      let instance =  new WgtBadge();
      instance.initialize_WgtBadge(args);

      return instance;
   }


   initialize_WgtBadge(args: Args_WgtBadge){
      args = args || {badgeLabel:'', label:'n/a'};
      this.initialize_WgtButton( args)
   }


   async localContentBegin(): Promise<string> {
      let b: string = `
<div id="${this.badgeLabelTagId}" class="badge-bar">
    <button id="${this.tagId}" type="button" >
        <span class="e-badge e-badge-info e-badge-notification e-badge-overlap">
`;
      return b;
   }

   async localContentEnd(): Promise<string> {
      return `
        </span>
    </button>
</div>`;
   }

   get badgeLabelTagId():string{
      return `${this.tagId}_badgeSpan`
   }
   get badgeBarTagId():string{
      return `${this.tagId}_badgeBar`
   }

   async localLogicImplementation()  {
      await super.localLogicImplementation();
      await this.refresh();
   }


   async localRefreshImplementation() {
      try {
         let newLabel                                            = stringArgVal(this.args.label);
         let newBadgeLabel                                       = stringArgVal((this.args as Args_WgtBadge).badgeLabel);
         document.getElementById(this.tagId).innerText           = newLabel; // Button Label
         document.getElementById(this.badgeLabelTagId).innerText = newBadgeLabel
      } catch (e) {
         console.log(e);
      }
   }


} // WgtBadge