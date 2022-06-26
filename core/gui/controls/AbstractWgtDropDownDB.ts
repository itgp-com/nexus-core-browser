import {DataManager, Query, UrlAdaptor}        from "@syncfusion/ej2-data";
import {AbstractWgtDropDown, Args_WgtDropDown} from "./AbstractWgtDropDown";
import {urlTableList}                          from "../../CoreUtils";
import {DataManagerNexus}                      from "../../ej2/DataManagerNexus";


export class Args_WgtDropDownDB extends Args_WgtDropDown {
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

export class AbstractWgtDropDownDB<ARG_CLASS extends Args_WgtDropDownDB = Args_WgtDropDownDB> extends AbstractWgtDropDown<ARG_CLASS> {


   protected constructor() {
      super();
   }

   initialize_AbstractWgtDropDownDB(args: ARG_CLASS) {
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

      this.pre_initialize_WgtDropDown(args);
      super.initialize_AbstractWgtDropDown(args);
      this.post_initialize_WgtDropDownDB(args);

   }

   /**
    * Allows extending classes to execute code before the super method is called, but after the code in the {@link #initialize_AbstractWgtDropDownDB} method has run
    * @param args
    */
   pre_initialize_WgtDropDown(args: ARG_CLASS){

   }
   /**
    * Allows extending classes to execute code right after the call to <pre>super.initialize_WgtDropDown(args);</pre> in  {@link #initialize_AbstractWgtDropDownDB} method has run
    * @param args
    */
   post_initialize_WgtDropDownDB(args: ARG_CLASS){

   }

}