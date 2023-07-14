import {ClickEventArgs}                                                                                                           from "@syncfusion/ej2-navigations";
import {ExcelExportProperties, GridModel, QueryCellInfoEventArgs}                                                                 from "@syncfusion/ej2-grids";
import {DialogInfo}                                                                                                               from "../abstract/DialogInfo";
import {AbstractGrid}                                                                                                             from "../abstract/AbstractGrid";
import {appendDivToPage, htmlElement_html_link, htmlElement_link_clickFunction, skinnyHtmlElementTooltip} from "../../utils/HtmlUtils";
import {HeaderCellInfoEventArgs}                                                                                                  from "@syncfusion/ej2-grids/src/grid/base/interface";
import {TooltipModel}                                                                                                             from "@syncfusion/ej2-popups/src/tooltip/tooltip-model";
import {Cell}                                                                                                                     from "@syncfusion/ej2-grids/src/grid/models/cell";
import {Column}                                                                                                                   from "@syncfusion/ej2-grids/src/grid/models/column";
import {isString}                                                                                                                 from "lodash";
import {getErrorHandler}                                                                                                          from "../../../CoreErrorHandling";
import {htmlElement_addTooltip_CoreOnly} from "../../../CoreUtils";

export class Args_EnableExcelToolbar {
   /**
    * The grid to which we add the Excel export button
    */
   grid: AbstractGrid;
   /**
    * Name of the spreadsheet (XLSX) file to be downloaded
    */
   spreadsheet_name: string;
   /**
    * Optional. defaults to spreadsheet_name
    */
   window_title?: string;
}

export function enableExcelToolbarEvent(args: Args_EnableExcelToolbar) {
   if (!args || !args.grid || !args.spreadsheet_name)
      return;

   if (!args.window_title)
      args.window_title = args.spreadsheet_name;

   let wgtGrid: AbstractGrid = args.grid;


   let existingToolbarClickFunction = wgtGrid.obj.toolbarClick;
   if (!existingToolbarClickFunction) {

      // if Excel Export enabled
      wgtGrid.obj.toolbarClick = (ev: ClickEventArgs) => {
         if (ev['item'].id === `${wgtGrid.tagId}_excelexport`) {
            let recordCount: number = 0;
            let pagingSettings      = wgtGrid.obj.pageSettings
            if (pagingSettings.totalRecordsCount != null) {
               recordCount = wgtGrid.obj.pageSettings.totalRecordsCount;
            } else {
               recordCount = wgtGrid.obj.getRowsObject().length; // if not paged, get the number of loaded rows
            }

            if (recordCount < 10000) {
               let excelExportProperties: ExcelExportProperties = {
                  fileName: `${args.spreadsheet_name}.xlsx`,
                  // header:   {
                  //    headerRows: 4,
                  //    rows:       [
                  //       {
                  //          cells: [
                  //             {value: ' '},
                  //             {value: ' '},
                  //             {
                  //                value: 'Window Title:'
                  //             },
                  //             {
                  //                style: {
                  //                   bold: true
                  //                },
                  //                value: args.window_title
                  //             },
                  //          ]
                  //       },
                  //       {
                  //          cells: [
                  //             {value: ' '},
                  //             {value: ' '},
                  //             {
                  //                value: 'Window Class Name:'
                  //             },
                  //             {
                  //                style: {
                  //                   bold: true
                  //                },
                  //                value: args.spreadsheet_name
                  //             }
                  //          ]
                  //       }
                  //    ]
                  // },
               }; //excelExportProperties
               // noinspection JSIgnoredPromiseFromCall
               wgtGrid.obj.excelExport(excelExportProperties);
            } else {
               let infoDialog: DialogInfo = new DialogInfo({
                                                              header:  'Export cannot be completed',
                                                              content: `There are currently ${recordCount.toLocaleString('en-US')} rows to be exported. The maximum export size is 10,000 rows.`,
                                                              element: document.getElementById(appendDivToPage()),
                                                              width:   '600px',
                                                              height:  '150px',

                                                           });
               infoDialog.call();
            }
         } else {
            // any other item id
            if (existingToolbarClickFunction) {
               existingToolbarClickFunction(ev);
            }
         }

      };
   } // if (!existingToolbarClickFunction)


} // enableExcelToolbar


export function excelToolbarInGridModel(disableExcelExport: boolean, gridModel: GridModel) {
   if (disableExcelExport) {
      // no export
      gridModel.allowExcelExport = false;
      if (gridModel.toolbar) {
         let index = gridModel.toolbar.indexOf('ExcelExport');
         if (index > -1)
            gridModel.toolbar.splice(index, 1);  // if it exists, delete it
      }
      if (gridModel.toolbar && gridModel.toolbar.length == 0)
         delete gridModel['toolbar']; // delete the toolbar if it's empty
   } else {
      // Add Excel Export
      gridModel.allowExcelExport = true;
      if (gridModel?.toolbar) {
         let index = gridModel?.toolbar.indexOf('ExcelExport');
         if (index < 0)
            gridModel.toolbar.insert(0, 'ExcelExport');
      } else {
         gridModel.toolbar = ['ExcelExport'];
      }
   }
}

export let renderer_html_link = (args: QueryCellInfoEventArgs, cellValue: string, linkValue: string) => {
   if (cellValue)
      // args.cell.innerHTML = `<a href="${linkValue}" target="_blank" >${cellValue}</a>`;
      htmlElement_html_link(args.cell as HTMLElement, cellValue, linkValue);
};

export let renderer_html_link_clickFunction = (args: QueryCellInfoEventArgs, clickFunction: (evt: any) => (void | Promise<void>)) => {
// Example of an href the takes no action:<a href="#" onclick="return false;">
   htmlElement_link_clickFunction(args.cell as HTMLElement, clickFunction);

   // let original = args.cell.innerHTML
   // if (original) {
   //    args.cell.innerHTML = `<a href="#" onclick="return false;">${original}</a>`;
   //    args.cell.addEventListener('click', clickFunction);
   // }
}
export let htmlElement_html_links           = (elem: HTMLElement, cellValue: string, linkValues: string) => {
   if (elem) {
      let linkValuesTokens = linkValues.split('\n');
      let anchors          = [];
      let counter          = 1;
      for (let linkValue of linkValuesTokens) {
         anchors.push(`<a href="${linkValue}" target="_blank" >${counter}</a>`);
         counter += 1;
      }
      let span       = `<span>` + anchors.join(', ') + `</span>`;
      elem.innerHTML = span;
   }
}

export class Args_Header_AppendLinkButton {
   argsHeaderCellInfo: HeaderCellInfoEventArgs;
   clickFunction: (evt: any) => (void | Promise<void>);
   buttonTooltipModel?: TooltipModel;
}

export function header_AppendLinkButton(params: Args_Header_AppendLinkButton) {
   if (!params)
      return;

   try {
      let cell: Cell<Column> = params.argsHeaderCellInfo.cell;
      let node: Element      = params.argsHeaderCellInfo.node;

      let headerNode: HTMLElement = node.getElementsByClassName('e-headertext')[0] as HTMLElement;
      let existing_html           = headerNode.innerHTML;
      let buttonLabel             = ''
      let buttonClass             = `${cell.column.field}_hdr`;
      let iconHTML                = `<i class="fa-solid fa-link"></i>`;
      let buttonHtml              = `<span class="${buttonClass} grid-btn-font-awesome">${iconHTML}${buttonLabel}</span>`

      let new_html         = `${existing_html}${buttonHtml}`;
      headerNode.innerHTML = new_html;

      let buttonNode: HTMLElement = node.getElementsByClassName(buttonClass)[0] as HTMLElement;
      if (params.clickFunction) {
         htmlElement_link_clickFunction(buttonNode, async evt => {
            try {
               evt.stopPropagation(); // don't allow click to propagate to header (it would trigger a sort if it does)
            } catch (ex) {
               console.error(ex);
            }

            await params.clickFunction({});
         });

      }

      if (params.buttonTooltipModel)
         htmlElement_addTooltip_CoreOnly(buttonNode, {content: params?.buttonTooltipModel?.content as any});
   } catch (error) {
      console.error(error);
      getErrorHandler().displayExceptionToUser(error);
   }
} // header_AppendLinkButton
/**
 * Reduce the text displayed in a grid column to a maximum of <code>maxWidth</code> characters
 * @param args the QueryCellInfoEventArgs parameter from the table
 * @param text the text that would normally go in the cell
 * @param maxWidth the max number of characters the cell should display
 * @return the skinny-ed text
 */
export function skinnyCellWithTooltipOverflow(args: QueryCellInfoEventArgs, text: string, maxWidth: number = 40): string {
   return skinnyHtmlElementTooltip({htmlElement: args.cell as HTMLElement, text: text, maxWidth: maxWidth});
} // skinnyCellWithTooltipOverflow
export function emptyToNA(qArgs: QueryCellInfoEventArgs, valueToShowOnEmpty?: string): void {

   if (!valueToShowOnEmpty)
      valueToShowOnEmpty = 'n/a';

   let rec: any = qArgs.data;
   let field    = qArgs.column.field

   let empty: boolean = false;

   let value = rec[field]
   if (value == null)
      empty = true;
   if (isString(value) && value == '')
      empty = true;

   if (empty)
      (qArgs.cell as HTMLElement).innerText = valueToShowOnEmpty;

}