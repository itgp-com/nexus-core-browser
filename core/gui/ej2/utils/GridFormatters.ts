export const DATE_FORMAT:string = 'yyyy-MM-dd';
export const DATE_FORMAT_US:string = 'MM/dd/yyyy';
export const DATETIME_FORMAT:string = 'yyyy-MM-dd hh:mm a';
export const DATE_WITH_WEEKDAY:string = "yyyy-MM-dd' 'E";

// /**
//  * Represents a formatter function type that takes a `Column` and a record object, then returns a formatted string or any other type.
//  * @callback EJ2_FORMATTER
//  * @param {Column} column - The column definition that contains the field to format.
//  * @param {Record<string, any>} rec - The record object containing the data to format.
//  * @returns {string | any} - The formatted data as a string or any other type.
//  */
// type EJ2_FORMATTER = (column: Column, rec: Record<string, any>) => string | any;
//
// export const DATE_FORMATTER_LOCALE:EJ2_FORMATTER = (column: Column, rec: Object):string|any => {
//    let data = (rec as any)[column.field];
//    if ( !data ) return '';
//    let date:Date = null;
//    if ( isDate(data)){
//       date = data as Date;
//    } else {
//       try {
//          if ( isNumber(data)) {
//             // number to date
//             date = new Date(data);
//          } else if (isString(data)) {
//
//             if (data.indexOf('T') > 0) {
//                data = data.substring(0, data.indexOf('T')); // extract date part
//             }
//             let parts = data.split('-');
//             if (parts.length === 3) {
//                const [year, month, day] = parts.map(Number);
//                date = new Date(year, month - 1, day);
//             }
//          } else {
//             console.error('Unknown date for value:', data);
//             date = null; // unknown type
//          }
//       } catch (e) {
//          console.error('DATE_FORMATTER_LOCALE', e);
//       }
//    }
//     if ( date ) {
//       return date.toLocaleDateString();
//    } else {
//        return (data ? data.toString(): '');
//     }
// }
//
// export const DATETIME_FORMATTER_LOCALE: EJ2_FORMATTER = (column: Column, rec: Record<string, any>): string | any => {
//    let data = rec[column.field];
//    if (!data) return '';
//    let dateTime: Date = null;
//
//    try {
//       if (isDate(data)) {
//          // Direct Date object
//          dateTime = data as Date;
//       } else if (isNumber(data)) {
//          // Numeric timestamp to Date
//          dateTime = new Date(data);
//       } else if (isString(data)) {
//          // String to Date
//          dateTime = new Date(data);
//       } else {
//          console.error('Unknown datetime for value:', data);
//          dateTime = null; // unknown type
//       }
//    } catch (e) {
//       console.error('DATETIME_FORMATTER_LOCALE', e);
//    }
//
//    if (dateTime) {
//       // Format to locale-specific date and time
//       return dateTime.toLocaleString();
//    } else {
//       return (data ? data.toString() : '');
//    }
// };
//
//
//
// export const NUMBER_FORMAT_DECIMAL3:EJ2_FORMATTER = (column: Column, rec: Object) :string|any => {
//    let data = (rec as any)[column.field];
//    if ( !data ) return '';
//    return data.toFixed(3);
// }
//
//
// export const INTEGER_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'N0',
//    useGrouping: true,
//    maximumFractionDigits: 0
// };
//
// export const DECIMAL2_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'N2',
//    useGrouping: true,
//    minimumFractionDigits:2,
//    maximumFractionDigits: 2,
// };
//
// export const DECIMAL4_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'N4',
//    useGrouping: true,
//    minimumFractionDigits:4,
//    maximumFractionDigits: 4,
// };
//
// export const DOLLAR0_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'C0',
//    useGrouping: true,
//    minimumFractionDigits:0,
//    maximumFractionDigits: 0,
//    currency:'$'
// };
//
// export const DOLLAR2_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'C2',
//    useGrouping: true,
//    minimumFractionDigits:2,
//    maximumFractionDigits: 2,
//    currency:'$',
// };
//
// export const DOLLAR4_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'C4',
//    useGrouping: true,
//    minimumFractionDigits:4,
//    maximumFractionDigits: 4,
//    currency:'$'
// };
//
// export const PERCENT0_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'P0',
//    useGrouping: true,
//    maximumFractionDigits: 0
// };
// export const PERCENT1_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'P1',
//    useGrouping: true,
//    maximumFractionDigits: 0
// };
// export const PERCENT2_NUMBER_FORMAT:NumberFormatOptions = {
//    format:'P2',
//    useGrouping: true,
//    maximumFractionDigits: 0
// };