export class MenuTreeNode {

   id: string; // UUID
   parent_id: string; //UUID
   children: MenuTreeNode[];
   hasChildren: boolean;


   title: string; // HTML
   extra_details: string; // HTML
   icon_webapp_html: string; // HTML
   icon_mobile: string; // HTML

   type: string;  // 'menu' or 'screen'
   class_name: string;

   keepInFilteredTree ?: boolean;

}

export class COL_MenuTreeNode {
   static readonly ID                    = 'id'
   static readonly PARENT_ID             = 'parent_id'
   static readonly CHILDREN              = 'children'
   static readonly HAS_CHILDREN          = 'hasChildren'
   static readonly TITLE                 = 'title'
   static readonly EXTRA_DETAILS         = 'extra_details'
   static readonly ICON_WEBAPP_HTML      = 'icon_webapp_html'
   static readonly ICON_MOBILE           = 'icon_mobile'
   static readonly TYPE                  = 'type'
   static readonly CLASS_NAME            = 'class_name'
   static readonly KEEP_IN_FILTERED_TREE = 'keepInFilteredTree'

}