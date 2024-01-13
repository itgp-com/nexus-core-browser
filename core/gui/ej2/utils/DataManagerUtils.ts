import {DataManager, UrlAdaptor} from "@syncfusion/ej2-data";
import {urlTableEj2, urlTableEj2Crud, urlTableList} from "../../../AppPathUtils";
import {NexusEditUrlAdaptor, JsonEventActions} from "../../../data/NexusEditUrlAdaptor";
import {NexusAdaptor} from "../../../data/NexusAdaptor";
import {NexusDataManager} from "../../../data/NexusDataManager";


export class DataManager_App_Options {
    /**
     *
     * @type {boolean} false if tablename needs to be wrapped in a URL, true if it's already a URL
     */
    tablename_is_url ?: boolean;

    adaptor ?: NexusAdaptor

}

/**
 * Creates the default DataManager for most App screens. It's equivalent to
 * <code>
 *    dataManager = new DataManager({
                                        url:         urlTableEj2(tablename),
                                        adaptor:     options?.adaptor || new NexusAdaptor(),
                                        crossDomain: true
                                     });
 * </code>
 * @param tablename
 */
export function dataManager_App(tablename: string, options ?:DataManager_App_Options): DataManager {
    options = options || {};
    let adaptor = options.adaptor;

    return new NexusDataManager({
        url: (options.tablename_is_url ? tablename : urlTableEj2(tablename)),
        adaptor: (adaptor ? adaptor : new NexusAdaptor()),
        crossDomain: true,
    });
}

/**
 * Creates a DataManager instance for use with a controller endpoint.
 *
 * @param {string} relativeURL - The relative URL path to the controller endpoint.
 * @param {NexusAdaptor} [adaptor] - Optional custom adaptor instance.
 *
 * @returns {DataManager} - The configured DataManager instance.
 *
 * The DataManager is configured with the given relative URL, and the default
 * NexusAdaptor unless a custom one is provided. Cross-domain requests are enabled.
 *
 * Example usage:
 * ```ts
 * const dataManager = dataManager_Controller('myController');
 * ```
*/
export function dataManager_Controller(relativeURL: string, adaptor ?: NexusAdaptor): DataManager {
    return new NexusDataManager({
        url: relativeURL,
        adaptor: (adaptor ? adaptor : new NexusAdaptor()),
        crossDomain: true,
    });
}

export class DataManager_CRUDApp_Options {
    /**
     *
     * @type {boolean} false if tablename needs to be wrapped in a URL, true if it's already a URL
     */
    tablename_is_url ?: boolean;

    adaptor ?: NexusEditUrlAdaptor

}
export function dataManagerCRUD_App(tablename: string, options ?:DataManager_CRUDApp_Options): DataManager {
    options = options || {};
    let adaptor = options.adaptor;

    return new NexusDataManager({
        url: (options.tablename_is_url ? tablename : urlTableEj2(tablename)),
        crudUrl: (options.tablename_is_url ? tablename : urlTableEj2Crud(tablename)),
        adaptor: (adaptor ? adaptor : new NexusEditUrlAdaptor()),
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

    let editAdaptor: NexusEditUrlAdaptor = new NexusEditUrlAdaptor();
    editAdaptor.addJsonListener((obj) => {
        if (obj.action == JsonEventActions.insert || obj.action == JsonEventActions.update) {
            // Add the key column as part of the outer envelope INSERT HTTP POST object so that the server knows what column to use to retrieve the newly inserted object with the generated primary key
            obj.data['keyColumn'] = pkColumn;
        }
    });

    return new NexusDataManager({
        url: urlTableEj2(tablename),
        crudUrl: crudURL,
        adaptor: editAdaptor,
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
    return new NexusDataManager({
        url: urlTableList(tablename),
        adaptor: new UrlAdaptor(),
        crossDomain: true
    });
}