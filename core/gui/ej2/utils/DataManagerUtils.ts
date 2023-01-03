import {DataManager, UrlAdaptor}                    from "@syncfusion/ej2-data";
import {urlTableEj2, urlTableEj2Crud, urlTableList} from "../../../AppPathUtils";
import {EditUrlAdaptor, JsonEventActions}           from "../../../data/EditUrlAdaptor";

/**
 * Creates the default DataManager for most App screens. It's equivalent to
 * <code>
 *    dataManager = new DataManager({
                                        url:         urlTableEj2(tablename),
                                        adaptor:     new UrlAdaptor(),
                                        crossDomain: true
                                     });
 * </code>
 * @param tablename
 */
export function dataManager_App(tablename: string, adaptor ?: UrlAdaptor): DataManager {
   return new DataManager({
                             url:         urlTableEj2(tablename),
                             adaptor:     (adaptor ? adaptor : new UrlAdaptor()),
                             crossDomain: true
                          });
}

export function dataManagerCRUD_App(tablename: string, editAdaptor: EditUrlAdaptor): DataManager {
   return new DataManager({
                             url:         urlTableEj2(tablename),
                             crudUrl:     urlTableEj2Crud(tablename),
                             adaptor:     editAdaptor,
                             crossDomain: true
                          });
}

/**
 * Creates a default editable DataManager for most App screens.
 * It uses the built-in crud URL, unless we pass it in separately
 *
 * It's equivalent to
 * <code>
 dataManager = new DataManager({
                                        url:         urlTableEj2(tablename),
                                        crudUrl:     urlTableEj2Crud(tablename),
                                        adaptor:      new EditUrlAdaptor();
                                        crossDomain: true
                                     });
 * </code>
 * @param tablename
 * @param pkColumn
 * @param crudURL
 * @param pkColumn
 * @param crudURL
 */
export function dataManagerEditable_App(tablename: string, pkColumn: string, crudURL ?: string): DataManager {
   if (crudURL == null)
      crudURL = urlTableEj2Crud(tablename);

   let editAdaptor: EditUrlAdaptor = new EditUrlAdaptor();
   editAdaptor.addJsonListener((obj) => {
      if (obj.action == JsonEventActions.insert || obj.action == JsonEventActions.update) {
         // Add the key column as part of the outer envelope INSERT HTTP POST object so that the server knows what column to use to retrieve the newly inserted object with the generated primary key
         obj.data['keyColumn'] = pkColumn;
      }
   });

   return new DataManager({
                             url:         urlTableEj2(tablename),
                             crudUrl:     crudURL,
                             adaptor:     editAdaptor,
                             crossDomain: true
                          });
}

/**
 * Creates the default DataManager for most App DROPDOWNS (direct JSON list, no EJList). It's equivalent to
 * <code>
 *    dataManager = new DataManager({
                                        url:         urlTableList(tablename),
                                        adaptor:     new UrlAdaptor(),
                                        crossDomain: true
                                     });
 * </code>
 * @param tablename
 */
export function dataManagerList_App(tablename: string): DataManager {
   return new DataManager({
                             url:         urlTableList(tablename),
                             adaptor:     new UrlAdaptor(),
                             crossDomain: true
                          });
}