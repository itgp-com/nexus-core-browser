import {CheckBox, CheckBoxModel}            from '@syncfusion/ej2-buttons';
import {DataProviderChangeEvent}            from "../../data/DataProvider";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../../BaseUtils";
import {AnyWidget, Args_AnyWidget}          from "../AnyWidget";
import {addWidgetClass}                     from "../AbstractWidget";

export abstract class Args_WgtCheckBox_Label {
   position ?: "Top" | "Leading" | "Trailing";
   /// Number of pixels for the margin (bottom or side depending on label position)
   margin?: number;
   wrapper           ?: IArgs_HtmlTag; // duplicates Args_AnyWidget field
}

export abstract class Args_AbstractCheckBox extends Args_AnyWidget<CheckBoxModel> {
   /**
    * Control label. Overwrites the placeholder in the ej.placeholder in places
    */
   label?: string;
   labelSettings ?: Args_WgtCheckBox_Label;


   modelTrueValue ?: WgtCheckBoxDataType;

   modelTrueValueAlternates ?: WgtCheckBoxDataType[];

   modelFalseValue ?: WgtCheckBoxDataType;

   modelIndeterminateValue ?: WgtCheckBoxDataType = null;

   enabled ?: boolean;
} // Args class

export type WgtCheckBoxDataType = number | string | boolean;

export abstract class AbstractCheckBox<ARG_CLASS extends Args_AbstractCheckBox = Args_AbstractCheckBox> extends AnyWidget<CheckBox, Args_AnyWidget, WgtCheckBoxDataType> {
   private _indeterminateValue: any                         = null;
   private _modelTrueValue: WgtCheckBoxDataType             = true;
   private _modelFalseValue: WgtCheckBoxDataType            = false;
   private _modelTrueValueAlternates: WgtCheckBoxDataType[] = [];

   protected constructor() {
      super();
   }

   protected async initialize_AbstractCheckBox(args: ARG_CLASS) {
      args            = IArgs_HtmlTag_Utils.init(args) as ARG_CLASS;
      args.ej = args.ej ||{};
      addWidgetClass(args, 'AbstractCheckBox');


      if (args.modelIndeterminateValue != null)
         this._indeterminateValue = args.modelIndeterminateValue;
      if (args.modelTrueValue != null)
         this._modelTrueValue = args.modelTrueValue;
      if (args.modelFalseValue != null)
         this._modelFalseValue = args.modelFalseValue;
      if (args.modelTrueValueAlternates != null)
         this._modelTrueValueAlternates = args.modelTrueValueAlternates;

      if (args.enabled != null)
         args.ej.disabled = !args.enabled;

      if (args.labelSettings == null) {
         args.labelSettings = {
            position: "Top",
            margin:   5, // Vertical
            wrapper:  {},
         }
      }

      args.labelSettings.wrapper = IArgs_HtmlTag_Utils.init(args.labelSettings.wrapper);

      if (!args.labelSettings.position)
         args.labelSettings.position = "Top";

      if (args.labelSettings.margin == null) {

         switch (args.labelSettings.position) {
            case 'Top':
               args.labelSettings.margin = 5; //(vertical)
               break;
            default:
               args.labelSettings.margin = 10; // trailing and leading (horizontal)
         }
      }

      this.previousValue = this.indeterminateValue;

      await this.initialize_AnyWidget(args)
   } //initialize_WgtCheckBox


   async localContentBegin(): Promise<string> {

      let args      = (this.descriptor as ARG_CLASS);
      let x: string = "";

      if(args?.wrapper)
         x += `<${args.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(args.wrapper)}>`;

      let label          = null;
      let padding_suffix = 'bottom';
      switch (args.labelSettings.position) {
         case "Leading":
            padding_suffix = "right";
            break;
         case "Trailing":
            padding_suffix = "left";
      }

      if (args.label)
         label = `    <${args.labelSettings.wrapper.htmlTagType} id="${this.labelTagID}" ${args.labelSettings.wrapper.htmlOtherAttr} class="e-float-text e-label-top ${args.labelSettings.wrapper.htmlTagClass}" style="padding-${padding_suffix}: ${args.labelSettings.margin}px;${args.labelSettings.wrapper.htmlTagStyle}">${args.label.escapeHTML()}</${args.labelSettings.wrapper.htmlTagType}>`;


      if (label != null && (args.labelSettings.position == "Top" || args.labelSettings.position == "Leading"))
         x += label;

      args.htmlTagType           = 'input';
      args.htmlOtherAttr['type'] = 'checkbox';
      args.htmlOtherAttr['name'] = args.propertyName;
      x += `<input  id="${this.tagId}" ${IArgs_HtmlTag_Utils.all(args)}/>`; // hardcoded input because of the ending />

      if (label != null && (args.labelSettings.position == "Trailing"))
         x += label;

      if(args.wrapper)
         x += `</${args.wrapper.htmlTagType}>`;

      return x;
   }


   async localLogicImplementation() {
      let args = (this.descriptor as ARG_CLASS);
      let ej   = args.ej;

      let argsChange = ej.change;
      ej.change      = (ev) => {
         if (argsChange) {
            argsChange(ev); // invoke the args-defined change first
         }

         let currentValue = ev.checked;
         this.toDataProvider(currentValue);
      }; // change event

      this.obj = new CheckBox(ej);
      this.obj.appendTo(this.hgetInput)
   } // doInitLogic


   toDataProvider(currentValue: (boolean | null)): void {
      try {
         let dataProvider = this.getDataProviderSimple();
         let record       = this.getRecord();
         if (dataProvider != null && record != null) {
            let modelPreviousDataValue           = record[this.descriptor.propertyName];
            let modelCurrentValue                = this.convertViewToModel(currentValue);
            // make the change
            record[this.descriptor.propertyName] = modelCurrentValue;


            if (modelCurrentValue != modelPreviousDataValue) {
               // trigger the change event
               let evt: DataProviderChangeEvent<any> = {
                  propertyName:  this.descriptor.propertyName,
                  value:         modelCurrentValue,
                  previousValue: modelPreviousDataValue,
               };

               dataProvider.fireChange(evt);
            } // if (currentValue != previousDataValue)
         } // if ( dataProvider != null && record != null )
      } catch (ex) {
         this.handleError(ex);
      }
   } // toDataProvider

   async localClearImplementation() {
      if (this.obj) {
         this.obj.checked       = false;
         this.obj.indeterminate = true;
      }
   }// doClear

   async localRefreshImplementation() {
      if (this.obj) {
         let value            = this.indeterminateValue;
         let enabled: boolean = false;

         let data = this.getRecord();
         if (data) {
            value   = this.convertModelToView(data[this.descriptor.propertyName]);
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.descriptor.ej.disabled == null) {
            // if the general properties don't specify something
            this.obj.disabled = !enabled;
         }
      }

   } // doClear

   get value(): boolean | null {
      if (this.obj) {
         if (this.obj.indeterminate)
            return this.indeterminateValue

         return this.obj.checked;
      }
      return this.obj.indeterminate;
   }

   set value(val: boolean | null) {
      try {
         if (this.obj) {
            if (val == this.indeterminateValue) {
               // noinspection JSIgnoredPromiseFromCall
               this.localClearImplementation(); // clear on separate thread (async function call)
            } else {
               this.obj.checked = val; // will trigger a change event
            }
         }
      } catch (ex) {
         this.handleError(ex);
      }
   }


   convertViewToModel(currentValue: boolean | null): WgtCheckBoxDataType {
      if (currentValue == null)
         return this.indeterminateValue;

      return (currentValue ? this.modelTrueValue : this.modelFalseValue);
   }

   convertModelToView(modelValue: WgtCheckBoxDataType): (boolean | null) {
      if (modelValue == null)
         return null

      let value: boolean = (modelValue == this.modelTrueValue);
      if (value == false) {
         let length: number = 0;

         if (this.modelTrueValueAlternates != null) {
            length = this.modelTrueValueAlternates.length;
         }

         if (length > 0) {
            for (let i = 0; i < length; i++) {
               let possibleValue = this.modelTrueValueAlternates[i];
               if (modelValue == possibleValue) {
                  return true;
               }
            } // for
         } // length > 0

      } // value == false

      return value;
   }


   get indeterminateValue(): any {
      return this._indeterminateValue;
   }

   set indeterminateValue(value: any) {
      this._indeterminateValue = value;
   }


   get modelTrueValue(): WgtCheckBoxDataType {
      return this._modelTrueValue;
   }

   set modelTrueValue(value: WgtCheckBoxDataType) {
      this._modelTrueValue = value;
   }

   get modelFalseValue(): WgtCheckBoxDataType {
      return this._modelFalseValue;
   }

   set modelFalseValue(value: WgtCheckBoxDataType) {
      this._modelFalseValue = value;
   }


   get modelTrueValueAlternates(): WgtCheckBoxDataType[] {
      return this._modelTrueValueAlternates;
   }

   set modelTrueValueAlternates(value: WgtCheckBoxDataType[]) {
      this._modelTrueValueAlternates = value;
   }

}