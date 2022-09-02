import {AbstractWidget}          from "../AbstractWidget";
import {Splitter, SplitterModel} from '@syncfusion/ej2-layouts';
import {Args_AnyWidget}          from "../AnyWidget";
import {PanePropertiesModel}     from "@syncfusion/ej2-layouts/src/splitter/splitter-model";
import {AnyWidgetStandard}       from "../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}     from "../../BaseUtils";

export class Args_AbstractSplitter extends Args_AnyWidget<SplitterModel> {
   /**
    * These widgets will be inserted as paneSettings components
    */
   panes?: AbstractWidget[];
}

export abstract class AbstractSplitter extends AnyWidgetStandard<Splitter, Args_AbstractSplitter, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractSplitter(args: Args_AbstractSplitter) {

      args          = IArgs_HtmlTag_Utils.init(args)
      this.initArgs = args;

      if (!args.ej)
         args.ej = {};
      if (!args.children)
         args.children = [];


      await this.initialize_AnyWidgetStandard(args);
   }


   async localRefreshImplementation(): Promise<void> {
      // absolutely no super.refresh here because a refresh triggered on the splitter
      // will reset the html and eliminate any initLogic JS from the splitter pane elements

      for (let i = 0; i < this.initArgs.panes.length; i++) {
         const pane = this.initArgs.panes[i];
         try {
            await pane.refresh();
         } catch(e){
            this.handleError(e)
         }
      } // for

   }

   async localLogicImplementation() {
      let anchor = this.hget;
      let thisX  = this;

      if (thisX.initArgs.ej == null)
         thisX.initArgs.ej = {};

      if (thisX.initArgs?.panes) {
         let panesOriginal: PanePropertiesModel[] = thisX.initArgs.ej.paneSettings;
         if (panesOriginal == null)
            panesOriginal = []
         let paneCount = panesOriginal.length;

         let panes: PanePropertiesModel[] = [];
         for (let i = 0; i < thisX.initArgs.panes.length; i++) {
            const pane = thisX.initArgs.panes[i];

            let paneModel: PanePropertiesModel;

            if (i < paneCount)
               paneModel = panesOriginal[i]; // existing settings
            else
               paneModel = {};
            paneModel.content = await pane.initContent();
            panes.push(paneModel);
         } // for

         thisX.initArgs.ej.paneSettings = panes;
      } // if panes

      thisX.obj = new Splitter(this.initArgs?.ej);
      thisX.obj.appendTo(anchor); // doing this in separate line because of EJ2 bug as of 2022-01-03


      if (thisX.initArgs?.panes) {
         for (let i = 0; i < thisX.initArgs.panes.length; i++) {
            const pane = thisX.initArgs.panes[i];
            await pane.initLogic();
         }
      }


   } // localLogicImplementation

} // main class