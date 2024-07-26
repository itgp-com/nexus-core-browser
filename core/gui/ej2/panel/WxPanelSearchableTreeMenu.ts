import {cssAddClass} from '../../../CssUtils';
import {AnyScreen, Args_AnyScreen}                            from "../../AnyScreen";
import {createMenuStructures, filterByString, MenuStructures} from "../../menu/MenuStructures";
import {MenuTreeNode}                                         from "../../menu/MenuTreeNode";
import {AbstractWidget, addWidgetClass}                       from "../../AbstractWidget";
import {DataProvider}                                         from "../../../data/DataProvider";
import {singleRecordDataProvider}                             from "../../../data/DataProviderUtils";
import {WxText}                                               from "../ext/WxText";
import {WxRow}                       from "../ext/WxRow";
import {Args_WxTreeView, WxTreeView} from "../ext/WxTreeView";
import {WxPanel}                     from "../ext/WxPanel";
import {WxSpacer_Vertical}                                    from "../ext/WxSpacer_Vertical";

const WGT_TREE_MENU_CLASS = 'WGT_TREE_MENU';

cssAddClass(`.${WGT_TREE_MENU_CLASS}.e-treeview .e-icon-collapsible`, {
   float:  "right",
   margin: '3px'
});

cssAddClass(`.${WGT_TREE_MENU_CLASS}.e-treeview .e-icon-expandable`, {
   float:  "right",
   margin: '3px'
});


export class WxPanelSearchableTreeMenu extends AnyScreen<any> {
   static readonly CLASS_NAME:string = 'WxPanelSearchableTreeMenu';

   protected readonly DATAPROVIDER_FILTER: string = '_DATAPROVIDER_FILTER_';
   protected readonly COL_FILTER_VALUE: string    = '_FILTER_VALUE_';

   protected dataProvider: DataProvider = singleRecordDataProvider({
                                                                      providerName: this.DATAPROVIDER_FILTER, record: {},
                                                                   });
   originalMenuStructures: MenuStructures<MenuTreeNode>;

   protected constructor() {
      super();
   }

   static async create(args: Args_WgtTreeMenu): Promise<WxPanelSearchableTreeMenu>{

      if (!args)
         args = new Args_WgtTreeMenu()
      addWidgetClass(args, WxPanelSearchableTreeMenu.CLASS_NAME);

      let instance = new WxPanelSearchableTreeMenu();
      await instance._initialize(args);
      return instance;
   } // create

   protected async _initialize(args: Args_WgtTreeMenu) {
      this.originalMenuStructures            = createMenuStructures(args.records);
      args.treeSettings.ej.fields.dataSource = [this.originalMenuStructures.root as any];
      this.children                          = [await this.createUI(args)];
      await this.initialize_AnyScreen(args);
   } // initialize_Abstract_WgtTreeMenu


   async createUI(args: Args_WgtTreeMenu): Promise<AbstractWidget> {
      let thisX = this;


      let filterTextBox: WxText = await WxText.create({

                                                             dataProviderName: this.DATAPROVIDER_FILTER,
                                                             propertyName:     this.COL_FILTER_VALUE,
                                                             ej:               {
                                                                placeholder:    'Search',
                                                                floatLabelType: "Auto",
                                                                blur:           async (ev) => {
                                                                   let value = filterTextBox.value;
                                                                   if (value) {
                                                                      let filteredMenuStructures     = filterByString(thisX.originalMenuStructures, value);
                                                                      treeMenu.obj.fields.dataSource = [filteredMenuStructures.root as any];
                                                                   } else {
                                                                      treeMenu.obj.fields.dataSource = [thisX.originalMenuStructures.root as any];
                                                                   }

                                                                }, // blur
                                                             },
                                                             wrapper:          {
                                                                htmlTagStyle: {"flex-grow":"1"},
                                                             }
                                                          });

      let filterRow: WxRow = await WxRow.create({
                                                                   children: [
                                                                      filterTextBox,
                                                                   ],
                                                                })
      thisX.dataProvider.children     = [filterRow];

      let treeViewArgs = args.treeSettings;
      addWidgetClass(treeViewArgs, WGT_TREE_MENU_CLASS);
      let treeMenu: WxTreeView = await WxTreeView.create(args.treeSettings);


      let w: AbstractWidget = await WxPanel.create({
                                                         children: [
                                                            await WxSpacer_Vertical.create(),
                                                            thisX.dataProvider,
                                                            await WxSpacer_Vertical.create(),
                                                            treeMenu,
                                                         ]
                                                      });


      return w;
   }


} // main class


export class Args_WgtTreeMenu extends Args_AnyScreen {

   outerPanelClasses ?: string[];
   filterRowClasses ?: string[];
   treeSettings?: Args_WxTreeView;
   records: MenuTreeNode[];

} // Args