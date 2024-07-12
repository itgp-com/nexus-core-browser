import {Query} from '@syncfusion/ej2-data';
import {NexusAdaptor} from './NexusAdaptor';
import {NexusDataManager} from './NexusDataManager';

/**
 * Converts the Syncfsion Typescript Query object to a nice transmissible Query that the Nexus Server can decode.
 * @param {Query} query front end query from new Query()
 * @return {Query} clean, transmissible query object
 */
export function queryForServer(query: Query): Query {
    let clear_query: Query = null;

    try {
        let adaptor = new NexusAdaptor();
        let dm = new NexusDataManager({
            url: null,
            adaptor: (adaptor ? adaptor : new NexusAdaptor()),
            crossDomain: true,
        });
        let retVal: any = adaptor.processQuery(dm, query);
        clear_query = JSON.parse(retVal.data as string);
    } catch (e) {
        console.error(e);
    }
    return clear_query;
} // queryForServer