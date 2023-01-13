import { DataManager, Query } from '@syncfusion/ej2-data';

class CustomDataManager extends DataManager {

    /**
     * Constructor for DataManager class
     * @param  {DataOptions|JSON[]} dataSource?
     * @param  {Query} query?
     * @param  {AdaptorOptions|string} adaptor?
     * @hidden
     */
    constructor(dataSource: any, query: Query, adaptor: any) {
        super(dataSource, query, adaptor);
    }
    /**
     * Overrides DataManager's default query with given query.
     * @param  {Query} query - Defines the new default query.
     */
    setDefaultQuery(query: Query): DataManager {
        // Custom logic to set default query
        console.log("Setting custom default query");
        return super.setDefaultQuery(query);
    }
    /**
     * Executes the given query with local data source.
     * @param  {Query} query - Defines the query to retrieve data.
     */
    executeLocal(query: Query): any {
        // Custom logic to execute local query
        console.log("Executing custom local query");
        return super.executeLocal(query);
    }

    /**
     * Executes the given query with either local or remote data source.
     * It will be executed as asynchronously and returns Promise object which will be resolved or rejected after action completed.
     * @param  {Query|Function} query - Defines the query to retrieve data.
     * @param  {Function} done - Defines the callback function and triggers when the Promise is resolved.
     * @param  {Function} fail - Defines the callback function and triggers when the Promise is rejected.
     * @param  {Function} always - Defines the callback function and triggers when the Promise is resolved or rejected.
     */
    executeQuery(query: Query): any {
        // Custom logic to execute query
        console.log("Executing custom query");
        return super.executeQuery(query);
    }

    /**
     * Save bulk changes to the given table name.
     * User can add a new record, edit an existing record, and delete a record at the same time.
     * If the datasource from remote, then updated in a single post.
     * @param  {Object} changes - Defines the CrudOptions.
     * @param  {string} key - Defines the column field.
     * @param  {string|Query} tableName - Defines the table name.
     * @param  {Query} query - Sets default query for the DataManager.
     */
    saveChanges(options: any, key: any): any {
        // Custom logic to save changes
        console.log("Saving custom changes");
        return super.saveChanges(options, key);
    }

    /**
     * Inserts new record in the given table.
     * @param  {Object} data - Defines the data to insert.
     * @param  {string|Query} tableName - Defines the table name.
     * @param  {Query} query - Sets default query for the DataManager.
     */
    insert(data: any, tableName: any, query: Query): any {
        // Custom logic to insert data
        console.log("Inserting custom data");
        return super.insert(data, tableName, query);
    }
    /**
     * Removes data from the table with the given key.
     * @param  {string} keyField - Defines the column field.
     * @param  {Object} value - Defines the value to find the data in the specified column.
     * @param  {string|Query} tableName - Defines the table name
     * @param  {Query} query - Sets default query for the DataManager.
     */
    remove(keyField: any, value: any, tableName: any): any {
        // Custom logic to remove data
        console.log("Removing custom data");
        return super.remove(keyField, value, tableName);
    }
    
    /**
     * Updates existing record in the given table.
     * @param  {string} keyField - Defines the column field.
     * @param  {Object} value - Defines the value to find the data in the specified column.
     * @param  {string|Query} tableName - Defines the table name
     * @param  {Query} query - Sets default query for the DataManager.
     */
    update(keyField: any, value: any, tableName: any, data: any): any {
        // Custom logic to update data
        console.log("Updating custom data");
        return super.update(keyField, value, tableName, data);
    }
}