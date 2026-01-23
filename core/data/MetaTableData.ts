import {ColumnModel}        from "@syncfusion/ej2-grids";
import {MetaTableData_Base} from "./MetaTableData_Base";

type GridColsMap = { [key: string]: ColumnModel_Meta };

export type ColumnModel_Meta = ColumnModel & {
   meta ?: MetaTableData;
};

/**
 * MetaTableData manages metadata for table columns, including labels and grid column models.
 * It provides a mechanism to automatically "stamp" column models with a reference back to this meta instance.
 */
export class MetaTableData extends MetaTableData_Base {

   /**
    * Map of column names to their display labels.
    * Used for quick lookup and synchronization with grid column headers.
    */
   LABELS ?: { [key: string]: string }       = {};

   // noinspection JSUnusedGlobalSymbols
   /**
    * Flat list of column models for the grid.
    */
   GRID_COLUMNS ?: ColumnModel[]             = [];


   /**
    * Internal storage for grid columns, wrapped in an object to allow O(1) swapping
    * of the entire dataset without re-creating the Proxy.
    */
   private readonly _gridColsRef: { data: GridColsMap } = { data: {} };

   /**
    * Proxy that intercepts property access and assignment on the grid columns map.
    * This ensures that any column added via this[columnName] = ... is automatically
    * stamped with metadata.
    */
   private readonly _gridColsProxy: GridColsMap;

   constructor() {
      super();

      // The Proxy allows us to maintain a stable reference (GRIDCOLS) while
      // intercepting assignments to 'stamp' incoming ColumnModels with a 'meta' property.
      this._gridColsProxy = new Proxy({} as GridColsMap, {
         get: (_t, prop) => (this._gridColsRef.data as any)[prop],
         has: (_t, prop) => prop in this._gridColsRef.data,
         ownKeys: () => Reflect.ownKeys(this._gridColsRef.data),
         getOwnPropertyDescriptor: (_t, prop) =>
             Object.getOwnPropertyDescriptor(this._gridColsRef.data, prop),
         deleteProperty: (_t, prop) => Reflect.deleteProperty(this._gridColsRef.data, prop),
         set: (_t, prop, value) => {
            if (typeof prop === "string") {
               // Intercept assignment to automatically inject 'meta' into the ColumnModel.
               this._gridColsRef.data[prop] = this._stampWithMeta(prop, value as ColumnModel);
               return true;
            }
            // @ts-expect-error - proxy typing nuance
            this._gridColsRef.data[prop] = value;
            return true;
         },
      });
   }

   /**
    * Accessor for the proxied grid columns map.
    * Assignments to individual keys are intercepted by the Proxy's 'set' trap.
    */
   public get GRIDCOLS(): GridColsMap {
      return this._gridColsProxy;
   }

   /**
    * Replaces the entire grid columns map.
    * Uses an O(1) swap of the internal reference to avoid expensive loops or proxy re-instantiation.
    */
   public set GRIDCOLS(value: GridColsMap | undefined) {
      // By swapping the '.data' property of _gridColsRef, the existing _gridColsProxy
      // immediately starts pointing to the new data without losing its identity.
      const next: GridColsMap = value ? { ...value } : {};
      this._gridColsRef.data = next;

      // Since we bypassed the per-key 'set' trap by swapping the whole object,
      // we must manually stamp all existing entries in the new map.
      for (const [k, v] of Object.entries(this._gridColsRef.data)) {
         this._gridColsRef.data[k] = this._stampWithMeta(k, v);
      }
   } // GRIDCOLS


   /**
    * Injects a non-enumerable 'meta' property into the ColumnModel pointing back to this instance.
    * This allows components receiving the ColumnModel to easily find its associated metadata
    * without needing a global registry.
    *
    * @param colName The unique name of the column.
    * @param col The ColumnModel to be stamped.
    * @returns The same ColumnModel instance, now with metadata attached.
    */
   private _stampWithMeta(colName: string, col: ColumnModel): ColumnModel {
      if (!col) return col;

      const stamped = col as ColumnModel_Meta;

      // Use Object.defineProperty to make 'meta' non-enumerable.
      // This prevents it from being serialized or showing up in 'for...in' loops,
      // avoiding circular reference issues and keeping the object 'clean'.
      if (!Object.prototype.hasOwnProperty.call(stamped, "meta")) {
         Object.defineProperty(stamped, "meta", {
            value: this,
            enumerable: false, // this prevents lodash cloneDeep from including 'meta' in deep copies
            configurable: false, // do not allow 'meta' to be reconfigured/overwritten once it's set
            writable: false,  // read only once it's set here
         });
      }

      return stamped;
   } // _stampWithMeta


   // noinspection JSUnusedGlobalSymbols
   /**
    * Updates the display label for a column and synchronizes it with the grid's header text.
    * @param colName Unique column identifier.
    * @param newLabel The text to display in the header.
    */
   changeLabel(colName:string, newLabel:string){
      this.LABELS[colName] = newLabel;
      // Triggers the Proxy set trap (if GRIDCOLS[colName] is being replaced)
      // or simply updates the existing reference's property.
      this.GRIDCOLS[colName].headerText = this.LABELS[colName];
   }

   /**
    * Merges changes into an existing column model and keeps labels in sync.
    * @param colName Unique column identifier.
    * @param changes Partial or full ColumnModel changes to apply.
    */
   changeColumn(colName:string, changes:ColumnModel){
      if ( ! changes)
         return;

      if ( changes.hasOwnProperty('headerText')){
         // Maintain synchronization between LABELS map and the ColumnModel's headerText.
         let newLabel = changes.headerText;
         this.LABELS[colName] = newLabel;
      }

      let currentColModel = this.GRIDCOLS[colName];
      if ( currentColModel){
         // Object.assign updates the existing object; Proxy set trap is triggered
         // for the column key, re-stamping it if necessary.
         this.GRIDCOLS[colName] = Object.assign(currentColModel, changes);
      }

   } // changeColumn
}