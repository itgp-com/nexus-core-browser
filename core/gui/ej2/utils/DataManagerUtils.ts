import {DataManager} from "@syncfusion/ej2-data";
import {urlTableEj2, urlTableEj2Crud, urlTableList} from "../../../AppPathUtils";
import {NexusAdaptor} from "../../../data/NexusAdaptor";
import {NexusDataManager} from "../../../data/NexusDataManager";
import {JsonEventActions, NexusEditUrlAdaptor} from "../../../data/NexusEditUrlAdaptor";


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
 * @param options
 */
export function dataManager_App(tablename: string, options ?:DataManager_App_Options): NexusDataManager {
    let optionsInternal:DataManager_App_Options = options || {};
    let adaptor = optionsInternal.adaptor;

    let dm = new NexusDataManager({
        url: (optionsInternal.tablename_is_url ? tablename : urlTableEj2(tablename)),
        adaptor: (adaptor ? adaptor : new NexusAdaptor()),
        crossDomain: true,
    });

    dm.nexus_settings.type = 'datamanager_App';
    dm.nexus_settings.tablename = tablename;
    dm.nexus_settings.tablename_is_url = optionsInternal.tablename_is_url;
    dm.nexus_settings.clone_for_excel_export = () => {
        return dataManager_App(tablename, options);
    }
    return dm;
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
export function dataManager_Controller(relativeURL: string, adaptor ?: NexusAdaptor): NexusDataManager {
    let dm = new NexusDataManager({
        url: relativeURL,
        adaptor: (adaptor ? adaptor : new NexusAdaptor()),
        crossDomain: true,
    });

    dm.nexus_settings.type = 'datamanager_Controller';
    dm.nexus_settings.tablename = relativeURL;
    dm.nexus_settings.tablename_is_url = true;
    dm.nexus_settings.clone_for_excel_export = () => {
        return dataManager_Controller(relativeURL , adaptor);
    }
    return dm;
}

export class DataManager_CRUDApp_Options {
    /**
     *
     * @type {boolean} false if tablename needs to be wrapped in a URL, true if it's already a URL
     */
    tablename_is_url ?: boolean;

    adaptor ?: NexusEditUrlAdaptor

}
export function dataManagerCRUD_App(tablename: string, options ?:DataManager_CRUDApp_Options): NexusDataManager {
    options = options || {};
    let adaptor = options.adaptor;

    let dm =  new NexusDataManager({
        url: (options.tablename_is_url ? tablename : urlTableEj2(tablename)),
        crudUrl: (options.tablename_is_url ? tablename : urlTableEj2Crud(tablename)),
        adaptor: (adaptor ? adaptor : new NexusEditUrlAdaptor()),
        crossDomain: true
    });

    dm.nexus_settings.type = 'datamanagerCRUD_App';
    dm.nexus_settings.tablename = tablename;
    dm.nexus_settings.tablename_is_url = options.tablename_is_url;
    dm.nexus_settings.clone_for_excel_export = () => {
        return dataManagerCRUD_App(tablename, options);
    }

    return dm;
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
export function dataManagerEditable_App(tablename: string, pkColumn: string, crudURL ?: string): NexusDataManager {
    let crudURLInternal = crudURL;
    if (crudURLInternal == null)
        crudURLInternal = urlTableEj2Crud(tablename);

    let editAdaptor: NexusEditUrlAdaptor = new NexusEditUrlAdaptor();
    editAdaptor.addJsonListener((obj) => {
        if (obj.action == JsonEventActions.insert || obj.action == JsonEventActions.update) {
            // Add the key column as part of the outer envelope INSERT HTTP POST object so that the server knows what column to use to retrieve the newly inserted object with the generated primary key
            obj.data['keyColumn'] = pkColumn;
        }
    });

    let dm = new NexusDataManager({
        url: urlTableEj2(tablename),
        crudUrl: crudURLInternal,
        adaptor: editAdaptor,
        crossDomain: true
    });

    dm.nexus_settings.type = 'datamanagerEditable_App';
    dm.nexus_settings.tablename = tablename;
    dm.nexus_settings.clone_for_excel_export = () => {
        return dataManagerEditable_App(tablename, pkColumn, crudURL);
    }

    return dm;
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
export function dataManagerList_App(tablename: string): NexusDataManager {
    let dm = new NexusDataManager({
        url: urlTableList(tablename),
        adaptor: new NexusAdaptor(),
        crossDomain: true
    });

    dm.nexus_settings.type = 'datamanagerList_App';
    dm.nexus_settings.tablename = tablename;
    dm.nexus_settings.clone_for_excel_export = () => {
        return dataManagerList_App(tablename);
    }

    return dm;
}