import * as _                           from "lodash";
import {COL_MenuTreeNode, MenuTreeNode} from "./MenuTreeNode";





export class MenuStructures<DATATYPE extends MenuTreeNode> {
   root: MenuTreeNode;

   records: MenuTreeNode[] = [];

   recordMap: Map<string, MenuTreeNode> = new Map<string, MenuTreeNode>();
   /**
    *  mdr_id for record to record of parent
    * key is the mdr_id of a record, value is the actual parent record (based on the original record's mdr_parent_id)
    */
   parentMap: Map<string, MenuTreeNode> = new Map<string, MenuTreeNode>();

   /**
    * mdr_id of record with array of child records as value
    */
   childMap: Map<string, MenuTreeNode[]> = new Map<string, MenuTreeNode[]>();

   // static async create(records: MenuTreeNode[]): Promise<MenuStructures<MenuTreeNode>> {
   //
   //    let instance = new MenuStructures();
   //
   //    instance.records = records;
   //
   //    return instance;
   // } // create



} // main class


export function createMenuStructures(records:MenuTreeNode[]): MenuStructures<MenuTreeNode> {
   let mst:MenuStructures<MenuTreeNode> = new MenuStructures<MenuTreeNode>()

   mst.records.length = 0;
   mst.recordMap.clear();
   mst.parentMap.clear();
   mst.childMap.clear();


   mst.records = records;
   for (const record of records) {
      mst.recordMap.set(record.id, record);

      record.hasChildren = false;
      record.children = [] // initialize chilren array


      if (record.parent_id) {
         let values = mst.childMap.get(record.parent_id) || []; // transform null to empty array
         let i      = values.findIndex((rec) => rec.id == record.id);
         if (i < 0) {
            values.push(record);
            mst.childMap.set(record.parent_id, values);
         } // if (i < 0)
      } else {   // if (record.mdr_id_parent)
         // no parent id
         if (!mst.root)
            mst.root = record;

      } // if (record.mdr_id_parent)
   }// for


   for (let i = 0; i < records.length; i++) {
      const record = records[i];

      if (record.parent_id) {
         let parentRecord = mst.recordMap.get(record.parent_id);
         if (parentRecord) {
            mst.parentMap.set(record.id, parentRecord);

            parentRecord.children.push(record); // add child
            parentRecord.hasChildren = true;
         } // if (parentRecord)
      } // if (record.mdr_id_parent)

   } // for records

   return mst;
} // createMenuStructures

export function filterByString(mstOrig:MenuStructures<MenuTreeNode>, searchString:string):MenuStructures<MenuTreeNode>{

   let recordsOrig:MenuTreeNode[] = mstOrig.records;
   let records:MenuTreeNode[] = [];
   for (let i = 0; i < recordsOrig.length; i++) {
      const recordOrig = recordsOrig[i];
      // make a copy by value but omit the listed columns
      let r =  _.omit(recordOrig,[
         COL_MenuTreeNode.CHILDREN,
         COL_MenuTreeNode.HAS_CHILDREN,
         COL_MenuTreeNode.KEEP_IN_FILTERED_TREE,
         ]
      );

      records.push(r as any);
   } // for

   let mst:MenuStructures<MenuTreeNode> = createMenuStructures(records);


   let filterRoot:MenuTreeNode = null;
   if ( !searchString)
      return mst; // nothing to find


   searchString = searchString.toLowerCase();

   // filter for ORIGINAL nodes that match
   let matchingNodes:MenuTreeNode[] = records.filter((value, index, array)=>{
      // filter implementation
      if(!value) return false;

      if (value?.title?.toLowerCase().indexOf(searchString) >= 0 )
         return true;

      if (value?.extra_details?.toLowerCase().indexOf(searchString) >= 0 )
         return true;

      return false;
   });

   // We have a list of matching nodes.
   // Mark all parent nodes as nodes to keep

   for (let i = 0; i < matchingNodes.length; i++) {
      const menuTreeNode = matchingNodes[i];
      menuTreeNode.keepInFilteredTree = true;

      let node:MenuTreeNode = menuTreeNode;
      while( node.parent_id){
         node = mst.recordMap.get(node.parent_id)
         node.keepInFilteredTree = true; // keep all the parents of a matching node
      } // while
   } // for matchingNodes


   // Go through the tree and eliminate any nodes not marked

   for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (!record.keepInFilteredTree){
         // find the parent and take itself out
         if(record.parent_id) {
            let parentNode = mst.recordMap.get(record.parent_id);
            let ix = parentNode.children.indexOf(record);
            parentNode.children.splice(ix, 1);
            parentNode.hasChildren = parentNode?.children?.length > 0;
         }
      } // if (!record.keepInFilteredTree)
   } // for records

    return mst;
} // filterByString