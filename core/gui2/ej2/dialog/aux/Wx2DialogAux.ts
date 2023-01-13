import {DialogModel, Tooltip}      from "@syncfusion/ej2-popups";
import {isString}                  from "lodash";
import {getErrorHandler}           from "../../../../CoreErrorHandling";
import {AbstractWidget}            from "../../../../gui/AbstractWidget";
import {CoreLabel}                 from "../../../../gui/coreonly/CoreLabel";
import {CoreOnly_RowFlex}          from "../../../../gui/coreonly/CoreOnly_RowFlex";
import {CoreOnly_SpacerHorizontal} from "../../../../gui/coreonly/CoreOnly_SpacerHorizontal";
import {CoreWgtPanel_HTML}         from "../../../../gui/coreonly/CoreWgtPanel_HTML";
import {Ax2Widget}                 from "../../../Ax2Widget";
import {StateWx2Dialog}            from "../Wx2Dialog";

export interface StateWx2DialogHeaderOptions {

   /**
    * Widgets that are placed before the header text from the parameters and before the headerStartWidgets in the parameters
    * @protected
    */
   headerStartWidgets?: (Ax2Widget | Ax2Widget[])

   /**
    * Widgets that are placed after the header text from the parameters but before the headerEndWidgets in the parameters
    * @protected
    */;
   headerEndWidgets ?: (Ax2Widget | Ax2Widget[]);

} //StateWx2DialogHeaderOptions


//--------------------- Start Header methods --------------------


//
// /**
//  * Override this method to create the Widget that represents the header content passed in from the dialog arguments.
//  * This component will then be wrapped along with standard widgets (ex: back arrow, refresh icon, etc.)
//  * @protected
//  */
// function headerMakeWidgetFromArgsHeaderField(state: StateWx2Dialog): Promise<AbstractWidget> {
//    if(!state) state ={}
//    state.ej = state.ej || {}
//
//    if (state.ej.header == null)
//       state.ej.header = ''; // there's always a header so that we always have the top widgets
//
// let arg_header: String | AbstractWidget = await this.initArgs.header
//
// let headerFromInitArgs: AbstractWidget;
// if (isString(arg_header)) {
//    // html
//    headerFromInitArgs = await CoreLabel.create({labelHTML: arg_header as string, htmlTagStyle: {"align-self": "center", "margin-left":"2px"}, htmlTagType: 'span'});
// } else {
//    // AbstractWidget
//    headerFromInitArgs = arg_header as AbstractWidget;
// }
// let wrapper = await CoreOnly_RowFlex.create(
//    {
//       htmlTagStyle:    {"flex-shrink":0, "flex-grow":1,"align-content":"stretch"},
//       children: [headerFromInitArgs],
//    });
// return wrapper;
// }
//

//
// protected async headerFullWidgetList(): Promise<AbstractWidget[]> {
//       let headerFromInitArgs: AbstractWidget = await this.headerMakeWidgetFromArgsHeaderField();
//
//          let list = [];
//
//          try {
//             list.push((this.initArgs?.showHeaderBackArrow ? await this.headerBackArrowWidget() : null));
//          } catch (ex) {
//             getErrorHandler().displayExceptionToUser(ex);
//          }
//
//          try {
//             list.push(...await this.headerStartWidgets());
//          } catch (ex) {
//             getErrorHandler().displayExceptionToUser(ex);
//          }
//
//          try {
//             let startWidgets = await this.initArgs?.headerStartWidgets;
//             list.push(...(startWidgets ? startWidgets : []));
//          } catch (ex) {
//             getErrorHandler().displayExceptionToUser(ex);
//          }
//
//          list.push(headerFromInitArgs);
//
//          try {
//             list.push(...await this.headerEndWidgets());
//          } catch (ex) {
//             getErrorHandler().displayExceptionToUser(ex);
//          }
//
//          try {
//             let endWidgets = await this.initArgs?.headerEndWidgets;
//             list.push(...(endWidgets ? endWidgets : []));
//          } catch (ex) {
//             getErrorHandler().displayExceptionToUser(ex);
//          }
//
//
//          list.push(await CoreOnly_SpacerHorizontal.create({pixels: 20}));
//
//          return list;
// } // headerMakeHeaderMainRowChildren
//
// protected async headerMakeHeaderMainRow(): Promise<AbstractWidget> {
//    let children = await this.headerFullWidgetList();
//
//    return await CoreOnly_RowFlex.create(
//       {
//          // htmlTagStyle:    `flex-shrink:0;flex-grow:1;align-content:stretch;`,
//          htmlTagStyle: {
//             "flex-shrink": 0,
//             "flex-grow":   1,
//             "align-content": "stretch",
//          },
//          children: children
//       });
// } // headerMakeHeaderMainRow
//
//
// /**
//  * Creates the back arrow that is placed in the left-most part of the dialog header and allows an iOS-like "Back" effect
//  * @protected
//  */
// protected async headerBackArrowWidget(): Promise<AbstractWidget> {
//    let thisX = this;
//    return CoreWgtPanel_HTML.create({
//                                       htmlContent:         `<span id="${thisX.headerBackArrowId}"  style="margin-right:5px;"><button type="button" style="background-color: ${thisX.color_header_background}"><i class="fa fa-arrow-circle-left" style="font-weight:900;font-size:20px;color: ${this.color_header_font} !important;"></i></button></span>`,
//                                       logicImplementation: async () => {
//                                          let htmlElement: HTMLElement = document.getElementById(thisX.headerBackArrowId);
//                                          htmlElement.addEventListener('click', (_ev) => {
//                                             thisX.headerBackArrowAction.call(thisX, _ev);
//                                          });
//
//                                          await thisX.headerBackArrowTooltip();
//                                       },
//                                    })
// } // header_backArrowWidget
//
// /**
//  * Override this method to control the action taken when the back arrow widget defined in header_backArrowWidget() is clicked
//  *
//  * Note: if the header_backArrowWidget() method is overridden, then this method might not be called by the new widget.
//  * @param _ev
//  * @protected
//  */
// protected async headerBackArrowAction(_ev: MouseEvent) {
//    this.hide(); // close
// } // header_backArrowAction
//
// function headerBackArrowTooltip() {
//    let htmlElement: HTMLElement = document.getElementById(this.headerBackArrowId);
//    if (htmlElement) {
//       let tooltip = new Tooltip({
//                                    content:   'Close',
//                                    openDelay: 300,
//                                 });
//       tooltip.appendTo(htmlElement);
//    }
// } // headerRefreshTooltip


//-------------------- End Header Methods --------------------