import {NumberFormatOptions} from '@syncfusion/ej2-base';
import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import {isDate, isNumber, isString} from 'lodash';

export type EJ2_COLUMN_FORMATTER = (column: Column, rec: Record<string, any>) => string | any;

/**
 * Interface representing the arguments for the date EJ2 grid formatter.
 */
export interface Args_n2_grid_formatter_date {
    /**
     * The locale to use for formatting the date.
     * If not specified, defaults to the browser's default locale.
     */
    locale?: string;
}


/**
 * Function to format date values in an EJ2 grid column.
 *
 * @param {Args_n2_grid_formatter_date} args - Arguments for formatting date values.
 * @returns {EJ2_COLUMN_FORMATTER} A function that formats a column's date value based on the provided options.
 */
export function n2_grid_formatter_date(args?: Args_n2_grid_formatter_date): EJ2_COLUMN_FORMATTER {
    if (!args)
        args = {} as Args_n2_grid_formatter_date
    let locale: string = args.locale || navigator.language;

    return (column: Column, rec: Record<string, any>): string | any => {
        let data = (rec as any)[column.field];
        if (!data) return '';
        let date: Date = null;
        if (isDate(data)) {
            date = data as Date;
        } else {
            try {
                if (isNumber(data)) {
                    // number to date
                    date = new Date(data);
                } else if (isString(data)) {

                    if (data.indexOf('T') > 0) {
                        data = data.substring(0, data.indexOf('T')); // extract date part
                    }
                    let parts = data.split('-');
                    if (parts.length === 3) {
                        const [year, month, day] = parts.map(Number);
                        date = new Date(year, month - 1, day);
                    }
                } else {
                    console.error('Unknown date for value:', data);
                    date = null; // unknown type
                }
            } catch (e) {
                console.error(`n2_grid_formatter_date({locale:${locale})`, e);
            }
        }
        if (date) {
            return date.toLocaleDateString(locale);
        } else {
            return (data ? data.toString() : '');
        }


    } // the EJ2_COLUMN_FORMATTER function

} // n2_grid_formatter_date


export function n2_grid_format_date(): string {
    let format: string = n2_locale_date_formats()?.date;
    if (format == null)
        format = 'yyyy-MM-dd'; // default to ISO format
    return format;
}

//-----------------------------------------


/**
 * Interface representing the arguments for the date EJ2 grid formatter.
 */
export interface Args_n2_grid_formatter_datetime {
    /**
     * The locale to use for formatting the date.
     * If not specified, defaults to the browser's default locale.
     */
    locale?: string;
}

/**
 * Function to format datetime values in an EJ2 grid column.
 *
 * @param {Args_n2_grid_formatter_datetime} args - Arguments for formatting datetime values.
 * @returns {EJ2_COLUMN_FORMATTER} A function that formats a column's datetime value based on the provided options.
 */
export function n2_grid_formatter_datetime(args?: Args_n2_grid_formatter_datetime): EJ2_COLUMN_FORMATTER {
    if (!args)
        args = {} as Args_n2_grid_formatter_datetime

    let locale: string = args.locale || navigator.language;

    return (column: Column, rec: Record<string, any>): string | any => {
        let data = rec[column.field];
        if (!data) return '';
        let dateTime: Date = null;

        try {
            if (isDate(data)) {
                // Direct Date object
                dateTime = data as Date;
            } else if (isNumber(data)) {
                // Numeric timestamp to Date
                dateTime = new Date(data);
            } else if (isString(data)) {
                // String to Date
                dateTime = new Date(data);
            } else {
                console.error('Unknown datetime for value:', data, ' using when calling n2_grid_formatter_datetime({locale:${locale}) ');
            }
        } catch (e) {
            console.error(`n2_grid_formatter_datetime({locale:${locale})`, e);
        }

        if (dateTime) {
            // Format to locale-specific date and time
            return dateTime.toLocaleString(locale);
        } else {
            return (data ? data.toString() : '');
        }
    }

} // n2_grid_formatter_datetime

export function n2_grid_format_datetime(): string {
    let format: string = n2_locale_date_formats()?.dateTime;
    if (format == null)
        format = 'yyyy-MM-dd HH:mm'; // default to ISO format
    return format;
}

//-----------------------------------------
/**
 * The arguments for the numeric EJ2 grid formatter.
 */
export interface Args_n2_grid_formatter_numeric {
    /**
     * Integer number defining the number of decimal places.
     * If not specified, defaults to 0.
     */
    decimals?: number;

    /**
     * True if the empty a zero value should be formatted as an empty string.
     * False if zero should be formatted as '0'.
     * Defaults to true (empty string).
     */
    zero_as_empty_string?: boolean;

    /**
     * The locale to use for formatting the date.
     * If not specified, defaults to the browser's default locale.
     */
    locale?: string;
}

/**
 * Function to format numeric values in an EJ2 grid column.
 *
 * @param {Args_n2_grid_formatter_numeric} [args] - Options for formatting numeric values.
 * @returns {EJ2_COLUMN_FORMATTER} A function that formats a column's value based on the provided options.
 */
export function n2_grid_formatter_numeric(args ?: Args_n2_grid_formatter_numeric): EJ2_COLUMN_FORMATTER {
    if (!args)
        args = {} as Args_n2_grid_formatter_numeric


    let decimals: number = args.decimals;
    if (decimals == null)
        decimals = 0; // this for clarity because a '0' value would be falsy, so using ||  would be confusing

    let zero_as_empty_string: boolean = args.zero_as_empty_string;
    if (zero_as_empty_string == null)
        zero_as_empty_string = true; // defaults to true

    let locale: string = args.locale || navigator.language;

    return (column: Column, rec: Record<string, any>): string | any => {
        let data = rec[column.field];
        let value: number = 0;

        if (isNumber(data)) {
            value = data as number;
        } else if (isString(data)) {
            try {
                value = parseFloat(data);
            } catch (e) {
                console.error('NUMBER_FORMATTER_LOCALE parsing', data, ' Error is ', e);
            }
        }

        if (zero_as_empty_string && value === 0 || value == null)
            return '';

        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    };

} //  n2_grid_formatter_numeric

//-----------------------------------------
//-------- EJ2 format creators ------------


/**
 * Interface representing the arguments for the numeric EJ2 grid formatter.
 */
export interface Args_n2_grid_format_numeric {
    /**
     * Integer number defining the number of decimal places.
     * If not specified, defaults to 0.
     */
    decimals?: number;

    /**
     * Use grouping separator for thousands.
     * Defaults to true.
     */
    use_grouping?: boolean;
}

/**
 * Function to format numeric values in a grid column.
 *
 * @param {Args_n2_grid_format_numeric} args - Arguments for formatting numeric values.
 * @returns {NumberFormatOptions} Options for number formatting.
 */
export function n2_grid_format_numeric(args?: Args_n2_grid_format_numeric): NumberFormatOptions {
    if (!args)
        args = {} as Args_n2_grid_format_numeric;

    let decimals: number = args.decimals;
    if (decimals == null) {
        decimals = 0; // Ensure a default value is set for decimals
    }

    let use_grouping: boolean = args.use_grouping;
    if (use_grouping == null) {
        use_grouping = true; // Ensure a default value is set for use_grouping
    }

    return {
        format: `N${decimals}`,
        useGrouping: use_grouping,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    } as NumberFormatOptions;
} // n2_grid_format_numeric


/**
 * Interface representing the arguments for the numeric EJ2 grid formatter.
 */
export interface Args_n2_grid_format_currency {
    /**
     * Integer number defining the number of decimal places.
     * If not specified, defaults to 2 (dollars and cents by default).
     */
    decimals?: number;

    /**
     * Use grouping separator for thousands.
     * Defaults to true.
     */
    use_grouping?: boolean;

    /**
     * mandatory currency symbol.
     * If not specified, defaults to '$'.
     */
    currency_symbol?: string;
}

/**
 * Function to format numeric values in a grid column.
 *
 * @param {Args_n2_grid_format_numeric} args - Arguments for formatting numeric values.
 * @returns {NumberFormatOptions} Options for number formatting.
 */
export function n2_grid_format_currency(args?: Args_n2_grid_format_currency): NumberFormatOptions {
    if (!args)
        args = {} as Args_n2_grid_format_currency;

    let decimals: number = args.decimals;
    if (decimals == null) {
        decimals = 2; // Ensure a default value is set for decimals
    }

    let use_grouping: boolean = args.use_grouping;
    if (use_grouping == null) {
        use_grouping = true; // Ensure a default value is set for use_grouping
    }

    return {
        format: `C${decimals}`,
        useGrouping: use_grouping,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    } as NumberFormatOptions;
} // n2_grid_format_numeric

//------------ percentages ----------------
/**
 * Interface representing the arguments for the numeric EJ2 grid formatter.
 */
export interface Args_n2_grid_format_percentage {
    /**
     * Integer number defining the number of decimal places.
     * If not specified, defaults to 1.
     */
    decimals?: number;

    /**
     * Use grouping separator for thousands.
     * Defaults to true.
     */
    use_grouping?: boolean;
}

/**
 * Function to format numeric values in a grid column as percentage.
 *
 * @param {Args_n2_grid_format_percentage} args - Arguments for formatting numeric values.
 * @returns {NumberFormatOptions} Options for number formatting.
 */
export function n2_grid_format_percentage(args?: Args_n2_grid_format_percentage): NumberFormatOptions {
    if (!args)
        args = {} as Args_n2_grid_format_percentage;

    let decimals: number = args.decimals;
    if (decimals == null) {
        decimals = 1; // Ensure a default value is set for decimals
    }

    let use_grouping: boolean = args.use_grouping;
    if (use_grouping == null) {
        use_grouping = true; // Ensure a default value is set for use_grouping
    }

    return {
        format: `P${decimals}`,
        useGrouping: use_grouping,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    } as NumberFormatOptions;
} // n2_grid_format_percentage


/**
 * Interface representing the locale date formats.
 */
export interface N2LocaleDateFormats {
    date: string;
    dateTime: string;
}

const _dateFormatCache: { [key: string]: N2LocaleDateFormats } = {};

/**
 * Returns the date and date-time formats for a given locale.
 * If no locale is provided, the browser's default locale is used.
 *
 * @param {string} [locale] - The locale string (e.g., 'en-US', 'de-DE').
 * @returns {N2LocaleDateFormats} The date and date-time formats.
 */
export function n2_locale_date_formats(locale?: string): N2LocaleDateFormats {
    if (!locale) {
        locale = navigator.language; // default to browser locale
    }

    if (_dateFormatCache[locale]) {
        return _dateFormatCache[locale];
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        ...dateOptions,
        hour: '2-digit',
        minute: '2-digit'
    };

    let dateTimeParts, dateParts;
    try {
        const dateTimeFormatter = new Intl.DateTimeFormat(locale, dateTimeOptions);
        dateTimeParts = dateTimeFormatter.formatToParts(new Date());

        const dateFormatter = new Intl.DateTimeFormat(locale, dateOptions);
        dateParts = dateFormatter.formatToParts(new Date());
    } catch (error) {
        console.error(`Error formatting date for locale "${locale}". Reverting to default locale: "${navigator.language}"`, error);
        // Fallback to default locale if an error occurs
        locale = navigator.language;

        const fallbackDateTimeFormatter = new Intl.DateTimeFormat(locale, dateTimeOptions);
        dateTimeParts = fallbackDateTimeFormatter.formatToParts(new Date());

        const fallbackDateFormatter = new Intl.DateTimeFormat(locale, dateOptions);
        dateParts = fallbackDateFormatter.formatToParts(new Date());
    }

    const formatMap: { [key: string]: string } = {
        year: 'yyyy',
        month: 'MM',
        day: 'dd',
        hour: 'hh',
        minute: 'mm',
        dayPeriod: 'a'
    };

    const buildFormatString = (parts: Intl.DateTimeFormatPart[]): string => {
        let formatString = '';
        parts.forEach(part => {
            if (part.type === 'literal') {
                formatString += part.value;
            } else {
                const formatPart = formatMap[part.type];
                if (formatPart) {
                    formatString += formatPart;
                }
            }
        });
        return formatString.trim();
    };

    const dateFormatString = buildFormatString(dateParts);
    const dateTimeFormatString = buildFormatString(dateTimeParts);

    const value: N2LocaleDateFormats = {
        date: dateFormatString,
        dateTime: dateTimeFormatString
    };

    _dateFormatCache[locale] = value;
    return value;
}



console.log('en-US', n2_locale_date_formats('en-US'))
console.log('de-DE', n2_locale_date_formats('de-DE'))
console.log('fr-FR', n2_locale_date_formats('fr-FR'))
console.log('ja-JP', n2_locale_date_formats('ja-JP'))
console.log('zh-CN', n2_locale_date_formats('zh-CN'))
console.log('ar-SA', n2_locale_date_formats('ar-SA'))
console.log('es-ES', n2_locale_date_formats('es-ES'))
console.log('ru-RU', n2_locale_date_formats('ru-RU'))
console.log('hi-IN', n2_locale_date_formats('hi-IN'))
console.log('pt-BR', n2_locale_date_formats('pt-BR'))
console.log('bn-BD', n2_locale_date_formats('bn-BD'))
console.log('pa-IN', n2_locale_date_formats('pa-IN'))
console.log('te-IN', n2_locale_date_formats('te-IN'))
console.log('mr-IN', n2_locale_date_formats('mr-IN'))
console.log('ta-IN', n2_locale_date_formats('ta-IN'))
console.log('ur-PK', n2_locale_date_formats('ur-PK'))
console.log('gu-IN', n2_locale_date_formats('gu-IN'))
console.log('ro-RO', n2_locale_date_formats('ro-RO'))