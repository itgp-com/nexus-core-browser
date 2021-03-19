import {Component}                                                from "@syncfusion/ej2-base";
import {FormValidator, FormValidatorModel}                        from "@syncfusion/ej2-inputs";
import {ColumnModel, QueryCellInfoEventArgs}                      from '@syncfusion/ej2-grids';
import {createSpinner, hideSpinner, showSpinner}                  from "@syncfusion/ej2-popups";
import {AnyWidget}                                                from "../gui/AnyWidget";
import {axios, core, cu}                                          from "../index";
import {AxiosRequestConfig, AxiosResponse}                        from "axios";
import {AbstractWidget, Args_UpdateWidgetInDOM, UpdateStateEvent} from "../gui/AbstractWidget";
import {getErrorHandler}                                          from "../CoreErrorHandling";


export type GridWidgetCallBack = (args?: QueryCellInfoEventArgs, thisX ?: any) => void;


export function getRandomInt(max: number) {
   cu.getRandomInt(max);
}

export function getRandomString(prefix?: string): string {
   return cu.getRandomString(prefix);
}


export function updateWidgetInDOM(args: Args_UpdateWidgetInDOM) {
   try {
      let newWidgetHTML = args.newWidget.initContent();
      if (args.existingWidgetHTMLElement) {
         // replace the child
         let newWidgetHTMLElement = cu.htmlToElement(newWidgetHTML);
         args.parentHTMLElement.replaceChild(newWidgetHTMLElement, args.existingWidgetHTMLElement);
      } else {
         //completely blow away the contents of parent
         args.parentHTMLElement.innerHTML = newWidgetHTML;
      }
      // after giving it time to render, attach the JS logic
      setImmediate(() => {
                      args.newWidget.initLogic();
                      if (args.callback)
                         args.callback();
                   }
      );

   } catch (ex) {
      getErrorHandler().displayExceptionToUser(ex);
   }
} // updateWidgetInDOM

export function triggerWindowResizeEvent(htmlElement ?: HTMLElement): void {
   // https://stackoverflow.com/questions/39237485/how-to-trigger-window-resize-event-using-vanilla-javascript
   let event = document.createEvent('HTMLEvents');
   event.initEvent('resize', true, false);
   document.dispatchEvent(event);
}


export function formValidator(htmlFormElement: HTMLFormElement, widgetList: AnyWidget[]): FormValidator {
   //----------- Create Validation Rules -------------
   let rules: any = {};
   for (let ejwidget of widgetList) {

      let wd                = ejwidget.descriptor;
      let v: any            = {};
      let modified: boolean = false;

      if (wd.required) {
         v.required = true;
         modified   = true;
      }

      if (wd.validation) {
         // copy all the properties and values from inside the validation object to the rules
         for (let prop in wd.validation) {
            v[prop] = wd.validation[prop];
         }
         modified = true;
      }

      if (modified)
         rules[wd.colName] = v;
   } //for

   let option: FormValidatorModel   = {
      rules: rules
   };
   let formValidator: FormValidator = new FormValidator(htmlFormElement, option);
   return formValidator;
}

// Declare the function type for the next callback
type typeClickOutsideCallback = (elem: HTMLElement, ev: MouseEvent) => void;

export function callbackOnClickOutside(component: Component<HTMLElement>, element: HTMLElement, callbackFunction: typeClickOutsideCallback) {

   let elementClickFunction = function (ev: MouseEvent) {
      ev.stopPropagation(); // do not propagate to window
   };
   element.addEventListener('click', elementClickFunction);

   document.addEventListener('click', function (event) {

      // let isOpen = component['isOpen'];
      //
      // if (isOpen) {
      // on click outside the element (click in element dont't register any longer

      // remove the propagation block
      element.removeEventListener('click', elementClickFunction); // remove the mouse click non propagation

      // call the callback function passed in
      callbackFunction(element, event);
      // }
   });

   // More detail at https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element
}


export function updateStateOnBlur(widget: AnyWidget, screen: AbstractWidget) {
   if (widget == null)
      return;

   let inputElement = widget.hgetInput;
   if (inputElement == null)
      return;

   inputElement.onblur = (ev) => {

      if (!screen.hasState()) {
         // no state, no input
         inputElement.value     = '';
         inputElement["_orig_"] = '';
         return
      }

      let orig    = inputElement["_orig_"];
      let current = inputElement.value;
      if (current != orig) {

         let evt: UpdateStateEvent = {
            name: widget.descriptor.colName,
            val:  current
         };

         screen.fireUpdateState(evt);
         if (evt.error) {
            inputElement.value = orig; // restore previous valid value
         }

      }
   };// on blur
} // updateStateOnBlur


export interface ArgsPost<RESPONSE = any> {
   url: string,
   data: any,
   config?: AxiosRequestConfig,
   waitFeedbackTagID?: string;

}

/**
 * Do a POST and either return the exact object or throw an error (and return undefined
 * @param argsPost
 */
export async function asyncPost<T = any>(argsPost: ArgsPost<T>): Promise<T> {
   try {
      let waitElem: HTMLElement;

      if (argsPost.waitFeedbackTagID) {
         waitElem = cu.hget(argsPost.waitFeedbackTagID);
         if (waitElem) {
            createSpinner({target: waitElem});
            showSpinner(waitElem);
         }
      }
      let response: AxiosResponse;
      try {
         response = await axios.post(
            argsPost.url,
            argsPost.data,
            argsPost.config,
         )
      } finally {
         try {

            waitElem = cu.hget(argsPost.waitFeedbackTagID);
            if (waitElem && argsPost.waitFeedbackTagID)
               hideSpinner(waitElem);
         } catch (ignore) {
         } // if close pressed, there's nothing to hide and we get undefined
      }

      // noinspection ExceptionCaughtLocallyJS
      if (response.status >= 200 &&response.status < 400 && response.data) {
         return response.data;
      } else {
         throw response.statusText;
      }
   } catch (error) {
      throw error;
   }

}


export async function asyncPostRetVal<T = any>(argsPost: ArgsPost<T>): Promise<T> {
   try {
      let waitElem: HTMLElement;

      let data:any = await asyncPost(argsPost);

      if (data) {
         let retVal: core.RetVal = cu.cast(data, core.RetVal);
         if (retVal.hasError()) {
            throw retVal.err;
         } else {
            return retVal.value;
         }
      } else {
         throw data;
      }
   } catch (error) {
      throw error;
   }
}

export enum QUERY_OPERATORS {
   GREATER_THAN          = "greaterthan",
   GREATER_THAN_OR_EQUAL = "greaterthanorequal",
   LESS_THAN             = "lessthan",
   LESS_THAN_OR_EQUAL    = "lessthanorequal",
   EQUAL                 = "equal",
   NOT_EQUAL             = "notequal",
   STARTS_WITH           = "startswith",
   ENDS_WITH             = "endswith",
   CONTAINS              = "contains",
}

export function gridWidth(columns: ColumnModel[]): number {
   let width = 0;
   try {
      if (columns) {
         for (let col of columns) {
            let w: number = 0;
            try {
               w = col.width as number;
            } catch (nex) {
               w = 80; // default
            }

            width += w;
         } // for
      } // if columns
   } catch (ex) {
      getErrorHandler().displayExceptionToUser(ex);
   }
   width += 10; // 10 pixels for padding

   if (width == 0) {
      width = 20; // small
   }
   return width;
}


// export const BTN_BADGE_CLASS: string               = `btnBadgeClass`;
//
// export function btnBadgeColumnModel(): ColumnModel {
//    return {
//       width:            30,
//       maxWidth:         40,
//       allowFiltering:   false,
//       allowSorting:     false,
//       allowSearching:   false,
//       customAttributes: {
//          class: "grid-column-buttons"
//       },
//       template:         `
// <div class="badge-bar">
//     <button type="button" class="${BTN_BADGE_CLASS}" >
//         <span class="e-badge e-badge-info e-badge-notification e-badge-overlap"></span>
//     </button>
// </div>
//                `,
//    };
// }
//
// export function btnBadgeInstantiate(args: QueryCellInfoEventArgs, callback ?: GridWidgetCallBack): HTMLElement {
//    let thisX              = this;
//    let badgeClass: string = BTN_BADGE_CLASS;
//
//    let colName = args.column.field;
//
//    let btnLinkElem = <HTMLElement>args.cell.getElementsByClassName(badgeClass).item(0);
//    if (btnLinkElem) {
//
//
//       let btn1 = new Button({
//                                iconCss: `e-icons ${ej2_icon_createlink}`,
//                             });
//       btn1.appendTo(btnLinkElem);
//       btnLinkElem.onclick = () => {
//          // tt.close();
//          if (callback)
//             callback(args); // trigger the callback function passed in
//       };
//
//       // let record: IPT___V_ASSET_WORK.Rec = args.data as IPT___V_ASSET_WORK.Rec;
//       // let badge: WgtBadge                = WgtBadge.create({
//       //                                                         badgeLabel: () => {
//       //                                                            return `${record.reprocessing_count}`;
//       //                                                         },
//       //                                                         label:      'Link',
//       //                                                         onClick:    () => {
//       //                                                            //    tt.close();
//       //                                                            if (callback)
//       //                                                               callback(args); // trigger the callback function passed in
//       //                                                         },
//       //                                                      });
//
//
//       // let btn1 = new Button({
//       //                          iconCss: `e-icons ${ej2_icon_createlink}`,
//       //                       });
//       // btn1.appendTo(btnLinkElem);
//       //
//       // let tt = new Tooltip({
//       //                         content:    'Link this record',
//       //                         openDelay:  500,
//       //                         closeDelay: 10,
//       //                      });
//       // tt.appendTo(btnLinkElem);
//       //
//       //
//       // btnLinkElem.onclick = () => {
//       //    tt.close();
//       //    if (callback)
//       //       callback(args); // trigger the callback function passed in
//       // }
//    }
//    return btnLinkElem;
// } // link

