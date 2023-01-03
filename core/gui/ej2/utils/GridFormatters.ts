import {NumberFormatOptions} from "@syncfusion/ej2-base";
import {Column}              from "@syncfusion/ej2-grids/src/grid/models/column";
import {isDate}              from "lodash";

export const DATE_FORMAT:string = 'yyyy-MM-dd';
export const DATE_FORMAT_US:string = 'MM/dd/yyyy';
export const DATETIME_FORMAT:string = 'yyyy-MM-dd hh:mm a';
export const DATE_WITH_WEEKDAY:string = "yyyy-MM-dd' 'E";

export const DATE_FORMATTER_LOCALE = (column: Column, rec: Object) => {
   let data = rec[column.field];
   if ( !data ) return '';
   if ( isDate(data)){
      return data.toLocaleDateString();
   }
   return data;
}

export const NUMBER_FORMAT_DECIMAL3 = (column: Column, rec: Object) => {
   let data = rec[column.field];
   if ( !data ) return '';
   return data.toFixed(3);
}


export const INTEGER_NUMBER_FORMAT:NumberFormatOptions = {
   format:'N0',
   useGrouping: true,
   maximumFractionDigits: 0
};

export const DECIMAL2_NUMBER_FORMAT:NumberFormatOptions = {
   format:'N2',
   useGrouping: true,
   minimumFractionDigits:2,
   maximumFractionDigits: 2,
};

export const DECIMAL4_NUMBER_FORMAT:NumberFormatOptions = {
   format:'N4',
   useGrouping: true,
   minimumFractionDigits:4,
   maximumFractionDigits: 4,
};

export const DOLLAR0_NUMBER_FORMAT:NumberFormatOptions = {
   format:'C0',
   useGrouping: true,
   minimumFractionDigits:0,
   maximumFractionDigits: 0,
   currency:'$'
};

export const DOLLAR2_NUMBER_FORMAT:NumberFormatOptions = {
   format:'C2',
   useGrouping: true,
   minimumFractionDigits:2,
   maximumFractionDigits: 2,
   currency:'$',
};

export const DOLLAR4_NUMBER_FORMAT:NumberFormatOptions = {
   format:'C4',
   useGrouping: true,
   minimumFractionDigits:4,
   maximumFractionDigits: 4,
   currency:'$'
};

export const PERCENT0_NUMBER_FORMAT:NumberFormatOptions = {
   format:'P0',
   useGrouping: true,
   maximumFractionDigits: 0
};
export const PERCENT1_NUMBER_FORMAT:NumberFormatOptions = {
   format:'P1',
   useGrouping: true,
   maximumFractionDigits: 0
};
export const PERCENT2_NUMBER_FORMAT:NumberFormatOptions = {
   format:'P2',
   useGrouping: true,
   maximumFractionDigits: 0
};