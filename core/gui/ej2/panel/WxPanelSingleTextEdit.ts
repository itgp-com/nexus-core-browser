import {WxButtonPrimary}               from "../ext/WxButtonPrimary";
import {WxPanel}                       from "../ext/WxPanel";
import {WxRow}                         from "../ext/WxRow";
import {Args_WxPanelBase, WxPanelBase} from "./WxPanelBase";
import {WxSpacer_Horizontal}           from "../ext/WxSpacer_Horizontal";
import {WxSpacer_Vertical}             from "../ext/WxSpacer_Vertical";
import {Args_WxText, WxText}           from "../ext/WxText";
import {DataProvider}                  from "../../../data/DataProvider";
import {singleRecordDataProvider}      from "../../../data/DataProviderUtils";
import {addWidgetClass}                from "../../AbstractWidget";
import {Args_AnyScreen}                from "../../AnyScreen";


export class Args_WxPanelSingleTextEdit extends Args_AnyScreen {
   initialValue ?: string;
   spellcheck ?: boolean; // false by default
   textArgs?: Args_WxText;
}

const COL_VALUE: string = 'value';

export class WxScreen_SingleTextEdit_App_Data {
   value: string;
}

export enum CLOSE_STATE_WxScreen_SingleTextEdit {
   OK,
   CANCEL
}

export class WxPanelSingleTextEdit extends WxPanelBase<any> {
   static readonly CLASS_NAME: string = 'WxPanelSingleTextEdit';


   private screenTitle: string = "";
   private dataProvider: DataProvider;
   record: WxScreen_SingleTextEdit_App_Data;
   close_state: CLOSE_STATE_WxScreen_SingleTextEdit;
   private wgtTxt_value: WxText;

   protected constructor() {
      super();
   }

   static async create(args: Args_WxPanelSingleTextEdit): Promise<WxPanelSingleTextEdit> {
      let instance = new WxPanelSingleTextEdit();
      if (!args)
         args = new Args_WxPanelSingleTextEdit();
      addWidgetClass(args, WxPanelSingleTextEdit.CLASS_NAME);

      instance.record = {value: args.initialValue} as WxScreen_SingleTextEdit_App_Data;

      await instance.makeUI(args);
      return instance;
   }

   async makeUI(args: Args_WxPanelSingleTextEdit) {

      let thisX = this;

      this.dataProvider = singleRecordDataProvider<WxScreen_SingleTextEdit_App_Data>({
                                                                                        providerName: WxScreen_SingleTextEdit_App_Data.constructor.name,
                                                                                        record:       thisX.record,
                                                                                     });


      let textArgs: Args_WxText = args.textArgs;
      if (textArgs == null)
         textArgs = {};
      textArgs = {
         ...textArgs,
         ...{
            propertyName:     COL_VALUE,
            dataProviderName: WxScreen_SingleTextEdit_App_Data.constructor.name,
            wrapper:          {
               htmlOtherAttr: {spellcheck: (args.spellcheck ? 'true' : 'false'),}
            }
         }
      };

      this.dataProvider.children = [await WxPanel.create({
                                                            // we need a panel with white background so that tabs can show against it, not against the background image
                                                            htmlTagClass: thisX.getWindowBackgroundColor(), //localcss.app_background_white,
                                                            children:     [
                                                               await WxSpacer_Vertical.create({pixels: 25}),
                                                               thisX.wgtTxt_value = await WxText.create(textArgs),
                                                               await WxSpacer_Vertical.create({pixels: 25}),
                                                               await WxRow.create({
                                                                                     htmlTagClass: 'flex-mainAxis-center',
                                                                                     children:     [
                                                                                        await WxButtonPrimary.create({
                                                                                                                        label:   'Ok',
                                                                                                                        onClick: ev => {
                                                                                                                           thisX.close_state = CLOSE_STATE_WxScreen_SingleTextEdit.OK;
                                                                                                                           thisX.closeIfDialog();
                                                                                                                        }
                                                                                                                     }),
                                                                                        await WxSpacer_Horizontal.create({pixels: 25}),

                                                                                        await WxButtonPrimary.create({
                                                                                                                        label:   'Cancel',
                                                                                                                        onClick: ev => {
                                                                                                                           thisX.close_state = CLOSE_STATE_WxScreen_SingleTextEdit.CANCEL;
                                                                                                                           thisX.record      = null;
                                                                                                                           thisX.closeIfDialog();
                                                                                                                        }
                                                                                                                     }),
                                                                                     ]
                                                                                  })
                                                            ]
                                                         }),
      ];

      let argsScreen: Args_WxPanelBase = {
         title:    thisX.screenTitle,
         children: [
            thisX.dataProvider
         ]
      };

      await this._initialize(argsScreen) // create the screen whe initializing the super class with correct arguments

   } // makeUI


   async localLogicImplementation() {
      let thisX = this;
      await super.localLogicImplementation();
      setTimeout(() => {
         thisX.wgtTxt_value.obj.focusIn();
      }, 200)
   }


   getWindowBackgroundColor(): string {
      return 'white';
   }


} // class