/// <reference path="./global.d.ts" />


import * as core from "./Core";

export {core};

import * as cu from "./CoreUtils";
export {cu};

import * as wu from "./ej2/WidgetUtils";
export  {wu};

import {hget, hgetInput, cleanUpHtml} from "./CoreUtils";
export {hget, hgetInput, cleanUpHtml};


import * as moduleRegistry from "./ModuleRegistry";

export {moduleRegistry};

import * as ej2Comm from "./ej2/Ej2Comm";
export {ej2Comm};


import {InterceptorDataManager, OnSuccessExecuteQuery, OnFailExecuteQuery, ErrorResponse,SuccessResponse, OnAlwaysExecuteQuery} from "./ej2/InterceptorDataManager";
export {InterceptorDataManager, OnSuccessExecuteQuery, OnFailExecuteQuery, ErrorResponse,SuccessResponse, OnAlwaysExecuteQuery};

import {AbstractWidgetStatic} from "./gui/AbstractWidgetStatic";
import {AbstractWidget}       from "./gui/AbstractWidget";
import {MetaTableData_Base}   from "./gui/MetaTableData_Base";
import {ScreenMeta}                        from "./gui/ScreenMeta";
import {MetaTableData}                     from "./ej2/MetaTableData";


export {AbstractWidgetStatic,
   AbstractWidget,
   MetaTableData_Base,
   MetaTableData,
   ScreenMeta,
};
import {DialogYesNo, DialogYesNoModel}     from "./ej2/DialogYesNo";
export {DialogYesNo, DialogYesNoModel};

import "./index.css";

// Defined in index.css

// Defined in index.css
export const ej2_icon_menu_hamburger = 'ej2-icon-menu-hamburger';
export const ej2_icon_close          = 'ej2-icon-close';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_add            = 'ej2-icon-add';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_search         = 'ej2-icon-search';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_feedback        = 'ej2-icon-feedback';


// noinspection JSUnusedGlobalSymbols
export const ej2_icon_save        = 'ej2-icon-save';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_clearall       = 'ej2-icon-mt-clearall';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_delete        = 'ej2-icon-delete';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_info        = 'ej2-icon-info';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_update       = 'ej2-icon-update';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_createlink        = 'ej2-icon-createlink';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_ok        = 'ej2-icon-ok';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_close2          = 'ej2-icon-close2';
// noinspection JSUnusedGlobalSymbols
export const ej2_icon_excel_export     = 'ej2-icon-excel-export';

//---------------- Axios ------------
import axios  from 'axios';
export {axios};


