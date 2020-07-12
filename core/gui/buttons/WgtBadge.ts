import {AnyWidget}                 from "../AnyWidget";
import {Button}                    from "@syncfusion/ej2-buttons";
import {Args_WgtButton, WgtButton} from "./WgtButton";
import {Args_AnyWidget}          from "../Args_AnyWidget";
import {StringArg, stringArgVal} from "../../CoreUtils";

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


   localContentBegin(): string {
      let b: string = `
<div id="${this.badgeLabelTagId}" class="badge-bar">
    <button id="${this.tagId}" type="button" >
        <span class="e-badge e-badge-info e-badge-notification e-badge-overlap">
`;
      return b;
   }

   localContentEnd(): string {
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

   localLogicImplementation(): void {
      super.localLogicImplementation();
      this.refresh();
   }


   localRefreshImplementation(): void {
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