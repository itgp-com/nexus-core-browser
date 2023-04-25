import {DataManager, Query, UrlAdaptor}          from "@syncfusion/ej2-data";
import {AbstractDropDown, Args_AbstractDropDown} from "./AbstractDropDown";
import {urlTableList}                            from "../../../AppPathUtils";
import {DataManagerNexus}                        from "../../../data/DataManagerNexus";
import {IArgs_HtmlTag_Utils}                     from "../../../BaseUtils";


export class Args_AbstractDropDownDB extends Args_AbstractDropDown {
   /**
    * The full (schema included if necessary) name of the database table that the
    * data in the list comes from
    */
   listDataDBTable: string;
   /**
    * Any query that needs to be run to filter/sort the list data returned from the database
    */
   query ?: Query

   /**
    * The DB table column to be displayed in the dropdown
    */
   textColumn:string;

   /**
    * The DB table column to be used when updating the DataProvider
    */
   valueColumn: string;


   enabled ?: boolean;

}

export abstract class AbstractDropDownDB<ARG_CLASS extends Args_AbstractDropDownDB = Args_AbstractDropDownDB> extends AbstractDropDown<ARG_CLASS> {


   protected constructor() {
      super();
   }

   protected async _initialize(args: ARG_CLASS) {
      args          = IArgs_HtmlTag_Utils.init(args) as ARG_CLASS;
      this.initArgs = args;

      let dm: DataManager = new DataManagerNexus({
                                               url:         urlTableList(args.listDataDBTable),
                                               adaptor:     new UrlAdaptor(),
                                               crossDomain: true
                                            });

      args.ej            = args.ej || {};
      args.ej.dataSource = dm;
      if (args.query)
         args.ej.query = args.query;

      args.ej.fields = {
         text: args.textColumn,
         value: args.valueColumn,
      };

      if (args.enabled != null)
         args.ej.enabled = args.enabled;

      await this.pre_initialize_DropDown(args);
      await super.initialize_AbstractDropDown(args);
      await this.post_initialize_DropDownDB(args);

   }

   /**
    * Allows extending classes to execute code before the super method is called, but after the code in the {@link #_initialize} method has run
    * @param args
    */
   protected async pre_initialize_DropDown(args: ARG_CLASS){

   }
   /**
    * Allows extending classes to execute code rightContainer after the call to <pre>super.initialize_DropDown(args);</pre> in  {@link #_initialize} method has run
    * @param args
    */
   protected async post_initialize_DropDownDB(args: ARG_CLASS){

   }

}