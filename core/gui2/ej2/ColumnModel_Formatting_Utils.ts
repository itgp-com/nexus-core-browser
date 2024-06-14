import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import dateFormat from 'dateformat';
import {isDate} from 'lodash';
import {MetaTableData} from '../../data/MetaTableData';
import {n2_grid_formatter_date} from '../N2Formatters';

/**
 * The interface for formatColumnAsDate function, which includes metadata and date formatting options.
 */
interface I_formatColumnAsDate {
    meta: MetaTableData;
    dateFormat ?: Args_Date_Formatter;
}

/**
 * Check if an object has the same shape as I_formatColumnAsDate
 * @param obj Object to check
 * @returns boolean - whether the object is of I_formatColumnAsDate type
 */
function isI_formatColumnAsDate(obj: any): obj is I_formatColumnAsDate {
    // if 'obj' has the same shape as I_formatColumnAsDate
    return obj && typeof obj === 'object' && 'meta' in obj && ('dateFormat' in obj || obj.dateFormat === undefined);
}

type meta_or_args = MetaTableData | I_formatColumnAsDate;


/**
 * Format a column in a table as a date
 * @param meta_or_settings Metadata or settings for the table
 * @param columnNames Names of the columns to be formatted
 */
export function formatColumnAsDate(meta_or_settings:meta_or_args, ...columnNames: string[]) {

    if ( !meta_or_settings)
        return;

    let meta:MetaTableData;
    let args:Args_Date_Formatter;

    if (isI_formatColumnAsDate(meta_or_settings)) {
        meta = meta_or_settings.meta;
        args = meta_or_settings.dateFormat;
    } else {
        meta = meta_or_settings as MetaTableData;
    }

    if (!meta)
        return;
    if (!columnNames)
        return;
    if ( !args )
        args = {} as Args_Date_Formatter;

    let formatterFunction:Ej2FormatterFunction = n2_grid_formatter_date();
    if ( args.dateMask_dateFormatLib ) {
        formatterFunction = date_Ej2Formatter(args);
    }

    for (let i = 0; i < columnNames.length; i++) {
        let columnName = columnNames[i];
        let column = meta.GRIDCOLS[columnName];
        if (column) {
            Object.assign(column, {
                headerTextAlign: "Center",
                textAlign: "Center",
                width: 120,
                type: 'date',
                formatter: formatterFunction,
            });
        }
    } // for
} //formatColumnAsDate


/**
 * Arguments for date formatting.
 * Uses 'dateFormat' library mask for date portion of the date/time string.
 */
export interface Args_Date_Formatter {

    /**
     * The 'dateFormat' library mask to use for the date portion of the date/time string
     * @see https://www.npmjs.com/package/dateformat
     *
     * If null, defaults to new Intl.DateTimeFormat().format(date);
     *
     */
    dateMask_dateFormatLib ?: string;
}


/**
 * Returns a formatting function for a date, using the provided arguments
 * @param args Optional arguments to use for formatting the date
 * @returns The formatting function
 */
export function date_Ej2Formatter(args ?: Args_DateTime_Formatter): Ej2FormatterFunction {
    if (!args)
        args = {} as Args_DateTime_Formatter;


     // formatterFunction
    return (column: Column, rec: Object) => {
        let data = (rec as any)[column.field];
        if (!data) return '';
        let date: Date = null;
        if (isDate(data)) {
            date = data as Date;
        } else {
            try {
                date = new Date(data); // direct conversion of string in ISO format ("2023-06-29T09:02:12Z")
            } catch (e) {
                console.error('dateTime_Ej2Formatter', e);
            }
        }

        if (date) {
            let localeDateString: string;
            if (args.dateMask_dateFormatLib) {
                localeDateString = dateFormat(date, args.dateMask_dateFormatLib);
            } else {
                // Default. Use Intl.DateTimeFormat to get a date string in the browser's locale
                localeDateString = new Intl.DateTimeFormat().format(date)
            }
            return localeDateString;
        } else {
            return data;
        }


    };
}

/**
 * The interface for formatColumnAsDateTime function, which includes metadata and date-time formatting options.
 */
interface I_formatColumnAsDateTime {
    meta: MetaTableData;
    dateTimeFormat ?: Args_DateTime_Formatter;
}

/**
 * Check if an object has the same shape as I_formatColumnAsDateTime
 * @param obj Object to check
 * @returns boolean - whether the object is of I_formatColumnAsDateTime type
 */
function isI_formatColumnAsDateTime(obj: any): obj is I_formatColumnAsDateTime {
    // More thorough checks can be added here depending on the shape of MetaTableData and Args_DateTime_Formatter
    return obj && typeof obj === 'object' && 'meta' in obj && ('dateTimeFormat' in obj || obj.dateTimeFormat === undefined);
}

/**
 * Format a column in a table as a date-time
 * @param meta_or_settings Metadata or settings for the table
 * @param columnNames Names of the columns to be formatted
 */
export function formatColumnAsDateTime(meta_or_settings:MetaTableData | I_formatColumnAsDateTime, ...columnNames: string[]) {

    if ( !meta_or_settings)
        return;

    let meta:MetaTableData;
    let args:Args_DateTime_Formatter;

    if (isI_formatColumnAsDateTime(meta_or_settings)) {
        meta = meta_or_settings.meta;
        args = meta_or_settings.dateTimeFormat;
    } else {
        meta = meta_or_settings as MetaTableData;
    }

    if (!meta)
        return;
    if (!columnNames)
        return;
    if ( !args )
        args = {} as Args_Date_Formatter;

    for (let i = 0; i < columnNames.length; i++) {
        let columnName = columnNames[i];
        let column = meta.GRIDCOLS[columnName];
        if (column) {
            Object.assign(column, {
                headerTextAlign: "Center",
                textAlign: "Center",
                width: 150,
                type: 'date',
                formatter: dateTime_Ej2Formatter(args),
            });
        }
    } // for
} //formatColumnAsDateTime


type Ej2FormatterFunction = (column: Column, rec: Object) => string | any;
/**
 * Arguments for date and time formatting.
 * Uses 'dateFormat' library mask for date and time portions of the date/time string.
 */
export interface Args_DateTime_Formatter {

    /**
     * The 'dateFormat' library mask to use for the date portion of the date/time string
     * @see https://www.npmjs.com/package/dateformat
     *
     * If null, defaults to new Intl.DateTimeFormat().format(date);
     *
     */
    dateMask_dateFormatLib ?: string;

    /**
     *
     * The 'dateFormat' library mask to use for the time portion of the date/time string
     * @see https://www.npmjs.com/package/dateformat
     *
     * If null,defaults to "hh:MM TT" (e.g. "09:02 AM")
     */
    timeMask_dateFormatLib ?: string;
}

/**
 * Returns a formatting function for a date-time, using the provided arguments
 * @param args Optional arguments to use for formatting the date-time
 * @returns The formatting function
 */
export function dateTime_Ej2Formatter(args ?: Args_DateTime_Formatter): Ej2FormatterFunction {
    if (!args)
        args = {} as Args_DateTime_Formatter;


     // formatterFunction
    return (column: Column, rec: Object) => {
        let data = (rec as any)[column.field];
        if (!data) return '';
        let date: Date = null;
        if (isDate(data)) {
            date = data as Date;
        } else {
            try {
                date = new Date(data); // direct conversion of string in ISO format ("2023-06-29T09:02:12Z")
            } catch (e) {
                console.error('dateTime_Ej2Formatter', e);
            }
        }

        if (date) {
            let localeDateString: string;
            if (args.dateMask_dateFormatLib) {
                localeDateString = dateFormat(date, args.dateMask_dateFormatLib);
            } else {
                // Default. Use Intl.DateTimeFormat to get a date string in the browser's locale
                localeDateString = new Intl.DateTimeFormat().format(date)
            }

            let localeTimeString: string
            if (args.timeMask_dateFormatLib) {
                localeTimeString = dateFormat(date, args.timeMask_dateFormatLib);
            } else {
                // Default. We use dateformat to format the time portion of our Date object
                localeTimeString = dateFormat(date, "hh:MM TT");
            }

            // Combine date and time strings
            return `${localeDateString} ${localeTimeString}`;
        } else {
            return data;
        }


    };
}