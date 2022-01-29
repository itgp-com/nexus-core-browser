import {AbstractGridButton, Args_AbstractGridButton} from "./AbstractGridButton";


/**
 * Creates a grid button with a custom icon and label if necessary.
 * Usage:
 *
 * Define the button first with a unique class name (your choice as long as it does not conflict with other existing class names)
 *
 * <pre>
 *       let uploadButton: GridButton_App = await GridButton_App.create({
 *                                                                         buttonClass: 'upload_custom_class_777',
 *                                                                         fa_classes:  'fas fa-cloud-upload-alt'
 *                                                                      });
 *</pre>
 *
 * Insert the column model in the grid columns:
 *
 * <pre>
 * let columns: ColumnModel[] = [
 *          uploadButton.columnModel(),
 *          ...FILES_TABLE.Meta.GRID_COLUMNS
 *       ];
 * </pre>
 *
 * Instantiate the button in the grid definition:
 *
 * <pre>
 *    queryCellInfo:      async (args) => {
 *
 *      let rec: FILES_TABLE.Rec = args.data as FILES_TABLE.Rec;
 *      let field                = args.column.field
 *
 *      uploadButton.instantiate({
 *                                  args:     args,
 *                                  callback: (_args) => {
 *                                     window.alert('Hello upload!');
 *                                  },
 *                                  toolTip:  'Upload Document'
 *                                });
 *     }
 * </pre>
 *
 *
 */
export class GridButton extends AbstractGridButton {

   protected constructor(param: Args_AbstractGridButton) {
      super(param);
   }

   static async create(param: Args_AbstractGridButton): Promise<GridButton> {
      let instance = new GridButton(param);
      return instance;
   }
}