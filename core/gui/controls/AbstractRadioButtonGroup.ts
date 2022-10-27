import {RadioButtonModel}                              from '@syncfusion/ej2-buttons';
import {IArgs_HtmlTag_Utils, StringArg, stringArgVal}  from "../../BaseUtils";
import {Args_AnyWidget}                                from "../AnyWidget";
import {AnyWidgetStandard}                             from "../AnyWidgetStandard";
import {AbstractRadioButton, Args_AbstractRadioButton} from "./AbstractRadioButton";
import {DataProvider}                                  from "../../data/DataProvider";
import {resolveWidgetArray}                  from "../WidgetUtils";
import {addWidgetClass, AfterInitLogicEvent} from "../AbstractWidget";

export class Args_AbstractRadioButtonGroup extends Args_AnyWidget<RadioButtonModel> {
   declare children:(AbstractRadioButton|Promise<AbstractRadioButton>)[];

   initialCheckedValue?:StringArg

   horizontalLayout ?: boolean;

   /**
    * Individual radio button class(es) set as ej.cssClass on every button in the group if layout is vertical
    */
   verticalButtonClass?: string;

   /**
    * Individual radio button class(es) set as ej.cssClass on every button in the group if layout is horizontal
    */
   horizontalButtonClass?: string;

}

/**
 * Abstract implementation of a group of Syncfusion radio buttons
 */
export abstract class AbstractRadioButtonGroup<ARG_CLASS extends Args_AbstractRadioButtonGroup = Args_AbstractRadioButtonGroup>   extends AnyWidgetStandard<any, Args_AnyWidget, string> {

   verticalButtonClass:string = `w_radiobutton_vertical`
   horizontalButtonClass:string = `w_radiobutton_horizontal`

   protected constructor() {
      super();
   }


   protected async initialize_AbstractRadioButtonGroup(args: ARG_CLASS) {
      args          = IArgs_HtmlTag_Utils.init(args) as ARG_CLASS;
      args.ej       = args.ej || {};

      if ( args.verticalButtonClass)
         this.verticalButtonClass = args.verticalButtonClass;
      if ( args.horizontalButtonClass)
         this.horizontalButtonClass = args.horizontalButtonClass;

      let vertical:boolean = ! args.horizontalLayout;
      if (vertical)
         addWidgetClass(args, 'flex-container-column'); // the button wrapper becomes a line

      let name:string = args.propertyName;
      if (!name)
         name = this.tagId; // tagId is one of the few properties initialized by the constructor

      // args children are resolved during call to {@link initialize_AnyWidget)
      let resolvedChildren:AbstractRadioButton[] = await resolveWidgetArray(args.children) as AbstractRadioButton[];
      args.children = resolvedChildren;

      // fill in or overwrite the properties of the child buttons
      for (let i = 0; i < resolvedChildren.length; i++) {
         const wRadioButton: AbstractRadioButton = resolvedChildren[i] as AbstractRadioButton;
         let argRadioButton: Args_AbstractRadioButton = wRadioButton.initArgs;

         // argRadioButton.propertyName = args.propertyName; // same property name for all buttons in the group
         // argRadioButton.dataProviderName = args.dataProviderName; // same dataprovider for all buttons in the group
         argRadioButton.ej.name = name; // make sure they belong to the same radio button group

         argRadioButton.ej.cssClass = (vertical? this.verticalButtonClass : this.horizontalButtonClass);

      } // for

      await this.initialize_AnyWidget(args); // resolves children
   }

   // async localLogicImplementation(): Promise<void> {
   //   await super.localLogicImplementation();
   // } // localLogicImplementation


   async afterInitLogic(evt: AfterInitLogicEvent): Promise<void> {
      await super.afterInitLogic(evt);

      let args: Args_AbstractRadioButtonGroup = this.initArgs as Args_AbstractRadioButtonGroup;
      if ( args.initialCheckedValue === undefined){
         // do nothing
      } else {
         this.value = stringArgVal(args.initialCheckedValue);
      }
   }

   async localRefreshImplementation(): Promise<void> {
      // refresh only makes sense if there's a dataProvider to refresh from
      if (this.initArgs?.dataProviderName && this.initArgs.propertyName) {
         let data             = DataProvider.byName(this, this.initArgs.dataProviderName);
         let value: string    = '';
         if (data)
            value   = data[this.initArgs.propertyName];

         this.value         = value;
         this.previousValue = value;

      }
   }

   async localClearImplementation(): Promise<void> {
      this.value = stringArgVal((this.initArgs as Args_AbstractRadioButtonGroup).initialCheckedValue);
      return await super.localClearImplementation();
   }


   get value():string {
      return super.value;
   }

   /**
    * Set the internal value of the group to the value that should show as checked
    * @param value
    */
   set value(value: string) {

      for (let i = 0; i < this.children.length; i++) {
         const wRadioButton:AbstractRadioButton = this.children[i] as AbstractRadioButton;
         let radioButtonValue:string = wRadioButton.initArgs?.ej?.value
         let origRefreshState = wRadioButton.refreshInProgress
         try {
            wRadioButton.refreshInProgress = this.refreshInProgress; // status should be the same for update data Provider purposes
            if (value == radioButtonValue) {
               wRadioButton.value             = true; // sets the checked value and updates the undelying dataProvider record if any
               break; // we're done here, since only one button in the group can be checked (the other ones are automatically unchecked)
            } else {
               wRadioButton.value = false; // do this for every button that does not match. If none match, all will be unchecked
            }
         } finally {
            wRadioButton.refreshInProgress = origRefreshState;
         }
         
      } // for

      super.value = value;
   }


} // WgtRadioButton