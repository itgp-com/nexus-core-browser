// noinspection JSUnusedGlobalSymbols,GrazieInspection,SpellCheckingInspection

declare global {

    interface Window {
        jsPanel: JsPanelSingleton; // Declare jsPanel as a property of the Window (scripts in html page only work with window global variable, not direct module export)
    }

    // export const jsPanel: JsPanelSingleton; // will not work if extensions needed. Use window.jsPanel instead

    export interface JsPanelAjaxOptions {
        /**
         * A DOMString representing the URL to send the request to. See XMLHttpRequest.open()
         * @type {string}
         * @required
         */
        url: string;

        /**
         * The HTTP request method to use, such as "GET", "POST", "PUT", "DELETE", etc. Ignored for non-HTTP(S) URLs. See XMLHttpRequest.open()
         * @type {string}
         * @default "GET"
         */
        method?: string;

        /**
         * An optional Boolean parameter indicating whether or not to perform the operation asynchronously. See XMLHttpRequest.open()
         * @type {boolean}
         * @default true
         */
        async?: boolean;

        /**
         * A body of data to be sent in the XHR request. See XMLHttpRequest.send()
         * @type {any}
         */
        data?: any;

        /**
         * Optional user name to use for authentication purposes. See XMLHttpRequest.open()
         * @type {string | null}
         * @default null
         */
        user?: string | null;

        /**
         * Optional password to use for authentication purposes. See XMLHttpRequest.open()
         * @type {string | null}
         * @default null
         */
        pwd?: string | null;

        /**
         * The number of milliseconds a request can take before automatically being terminated. See XMLHttpRequest/timeout
         * @type {number}
         * @default 0
         */
        timeout?: number;

        /**
         * Boolean that indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies or authorization headers. See XMLHttpRequest/withCredentials
         * @type {boolean}
         * @default false
         */
        withCredentials?: boolean;

        /**
         * Enumerated value that defines the response type. See XMLHttpRequest/responseType
         *
         * (e.g., "json", "text", "blob").
         *
         * @type {string}
         */
        responseType?: string;

        /**
         * Callback function executed when the request completes successfully.
         *
         * This function is called when the request completes with a status code of 200.
         *
         * The function receives the XMLHttpRequest object as argument and the keyword this inside the function also refers to the XMLHttpRequest object.
         *
         * @type {(xhr: XMLHttpRequest) => void}
         */
        done?: (xhr: XMLHttpRequest) => void;

        /**
         * Callback function executed when the request fails.
         *
         * This function is called when the request fails with a status code other than 200.
         *
         * The function receives the XMLHttpRequest object as argument and the keyword this inside the function refers to the XMLHttpRequest object
         *
         *
         * @type {(xhr: XMLHttpRequest) => void}
         */
        fail?: (xhr: XMLHttpRequest) => void;

        /**
         * Callback function executed always after request completion, irrespective of success or failure.
         *
         * This function is called always (after the fail callback), no matter whether the request succeeded or failed.
         *
         * The function receives the XMLHttpRequest object as argument and the keyword this inside the function refers to the XMLHttpRequest object.
         *
         * @type {(xhr: XMLHttpRequest) => void}
         */
        always?: (xhr: XMLHttpRequest) => void;

        /**
         * Callback function executed just before sending the request. Useful for setting request headers.
         *
         * This function is executed just before the request is sent and could be used to set request headers for example.
         *
         * The function receives the XMLHttpRequest object as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         *
         * @type {(xhr: XMLHttpRequest) => void}
         */
        beforeSend?: (xhr: XMLHttpRequest) => void;
    } // JsPanelAjaxOptions


    /**
     * Configuration options for making fetch requests with jsPanel.
     * @link https://jspanel.de/#global/fetch
     */
    export interface JsPanelFetchOptions {
        /**
         * The URL pointing to the resource to fetch. A DOMString representing the URL pointing to the resource.
         * @type {string}
         * @required
         */
        resource: string;

        /**
         * A fetch request will eventually return a response. To extract the content from this response you have to use a content specific method set by this parameter. For more details see the Body Web API
         * @type {string}
         * @default 'text'
         */
        bodyMethod?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';

        /**
         * Additional options to configure the fetch request.
         * For more details, see the Fetch API's init parameter.
         * @type {RequestInit}
         */
        fetchInit?: RequestInit;

        /**
         * Callback function executed when the fetch request completes successfully. The function receives the response as argument and the keyword this inside the function refers to the response .
         * The function context (`this`) refers to the response object.
         * @type {(response: Response) => void}
         */
        done?: (response: Response) => void;

        /**
         * Callback function executed before sending the fetch request.
         * The function context (`this`) refers to the JsPanelFetchOptions configuration.The function receives the fetchConfig as argument and the keyword this inside the function refers to the fetchConfig .
         * @type {(fetchConfig: JsPanelFetchOptions) => void}
         */
        beforeSend?: (fetchConfig: JsPanelFetchOptions) => void;
    } // JsPanelFetchOptions


    export interface JsPanelSingleton {
        /**
         * **Returns:**
         *
         * - a number setting the separation (in pixels) of panels that use option position with the parameter autoposition
         *
         * **Type:**
         *
         * - Integer
         *
         * **Default:**
         *
         * - 4
         *
         * If needed set another value with:
         * ``` javascript
         * jsPanel.autopositionSpacing = value;
         * ```
         *
         * @link https://jspanel.de/#global/autopositionSpacing
         */
        autopositionSpacing: number;

        /**
         * **Returns:**
         * - a number in the range 0 - 1
         * **Type:**
         * - Number, Range: 0 - 1
         * **Default:**
         * - 0
         *
         * Whenever you create a panel with the theme modifier **'filled'** the background color of the content section is calculated from the theme color.
         *
         * **jsPanel.colorFilled** sets the percentage value by which the theme color is darkened.
         *
         * If needed set another value with:
         * ``` javascript
         * jsPanel.colorFlled = 0.25; // darkens theme color by 25%
         * ```
         *
         * @link https://jspanel.de/#global/colorFilled
         */
        colorFilled: number;

        /**
         * **Returns:**
         * - a number in the range 0 - 1
         * **Type:**
         * - Number, Range: 0 - 1
         * **Default:**
         * - 0
         *
         * Whenever you create a panel with the theme modifier **'filleddark'** the background color of the content section is calculated from the theme color.
         *
         * **jsPanel.colorFilledDark** sets the percentage value by which the theme color is darkened.
         *
         * If needed set another value with:
         * ``` javascript
         * jsPanel.colorFlled = 0.25; // darkens theme color by 25%
         * ```
         *
         * @link https://jspanel.de/#global/colorFilledDark
         */
        colorFilledDark: number;

        /**
         * **Returns:**
         * - a number in the range 0 - 1
         * **Type:**
         * - Number, Range: 0 - 1
         * **Default:**
         * - 0
         *
         * Whenever you create a panel with the theme modifier **'filledlight'** the background color of the content section is calculated from the theme color.
         *
         * **jsPanel.colorFilledLight** sets the percentage value by which the theme color is lightened.
         *
         * If needed set another value with:
         * ``` javascript
         * jsPanel.colorFlled = 0.25; // lightens theme color by 25%
         * ```
         * @link https://jspanel.de/#global/colorFilledLight
         */
        colorFilledLight: number;

        /**
         * **Returns:**
         * - An array with all built-in color names supported by option theme
         * **Type:**
         * - Object
         * **Default:**
         * - see listing at the bottom of this page
         *
         * **jsPanel.colorNames** includes all colors according to the CSS Color Module Level 3/4 and color names derived from the Material Design Color System
         *
         * **Adding custom color names**
         *
         * You can easily extend the named colors with your own color names if needed. Simply add the desired name: value pair to **jsPanel.colorNames**. Just make sure that:
         *
         * - the color name is all lowercase,
         * - the color value is either HEX, RGB or HSL,
         * - the color name does NOT include whitespace
         * - jsPanel.colorNames.myred = '#8f0000'; // # symbol is optional
         * - jsPanel.colorNames.myblue = 'rgb(0,100,255)';
         * - jsPanel.colorNames.brightgreen = 'hsl(120,75%,75%)';
         * - After adding a color you can use it with option theme including the theme modifiers.
         *
         * ``` javascript
         * jsPanel.create({
         *     theme: 'myblue filled'
         * });
         * ```
         *
         *
         * Color names included by default:
         * ``` javascript
         * {
         *     aliceblue: 'f0f8ff',
         *     antiquewhite: 'faebd7',
         *     aqua: '0ff',
         *     aquamarine: '7fffd4',
         *     azure: 'f0ffff',
         *     beige: 'f5f5dc',
         *     bisque: 'ffe4c4',
         *     black: '000',
         *     blanchedalmond: 'ffebcd',
         *     blue: '00f',
         *     blueviolet: '8a2be2',
         *     brown: 'a52a2a',
         *     burlywood: 'deb887',
         *     cadetblue: '5f9ea0',
         *     chartreuse: '7fff00',
         *     chocolate: 'd2691e',
         *     coral: 'ff7f50',
         *     cornflowerblue: '6495ed',
         *     cornsilk: 'fff8dc',
         *     crimson: 'dc143c',
         *     cyan: '0ff',
         *     darkblue: '00008b',
         *     darkcyan: '008b8b',
         *     darkgoldenrod: 'b8860b',
         *     darkgray: 'a9a9a9',
         *     darkgrey: 'a9a9a9',
         *     darkgreen: '006400',
         *     darkkhaki: 'bdb76b',
         *     darkmagenta: '8b008b',
         *     darkolivegreen: '556b2f',
         *     darkorange: 'ff8c00',
         *     darkorchid: '9932cc',
         *     darkred: '8b0000',
         *     darksalmon: 'e9967a',
         *     darkseagreen: '8fbc8f',
         *     darkslateblue: '483d8b',
         *     darkslategray: '2f4f4f',
         *     darkslategrey: '2f4f4f',
         *     darkturquoise: '00ced1',
         *     darkviolet: '9400d3',
         *     deeppink: 'ff1493',
         *     deepskyblue: '00bfff',
         *     dimgray: '696969',
         *     dimgrey: '696969',
         *     dodgerblue: '1e90ff',
         *     firebrick: 'b22222',
         *     floralwhite: 'fffaf0',
         *     forestgreen: '228b22',
         *     fuchsia: 'f0f',
         *     gainsboro: 'dcdcdc',
         *     ghostwhite: 'f8f8ff',
         *     gold: 'ffd700',
         *     goldenrod: 'daa520',
         *     gray: '808080',
         *     grey: '808080',
         *     green: '008000',
         *     greenyellow: 'adff2f',
         *     honeydew: 'f0fff0',
         *     hotpink: 'ff69b4',
         *     indianred: 'cd5c5c',
         *     indigo: '4b0082',
         *     ivory: 'fffff0',
         *     khaki: 'f0e68c',
         *     lavender: 'e6e6fa',
         *     lavenderblush: 'fff0f5',
         *     lawngreen: '7cfc00',
         *     lemonchiffon: 'fffacd',
         *     lightblue: 'add8e6',
         *     lightcoral: 'f08080',
         *     lightcyan: 'e0ffff',
         *     lightgoldenrodyellow: 'fafad2',
         *     lightgray: 'd3d3d3',
         *     lightgrey: 'd3d3d3',
         *     lightgreen: '90ee90',
         *     lightpink: 'ffb6c1',
         *     lightsalmon: 'ffa07a',
         *     lightseagreen: '20b2aa',
         *     lightskyblue: '87cefa',
         *     lightslategray: '789',
         *     lightslategrey: '789',
         *     lightsteelblue: 'b0c4de',
         *     lightyellow: 'ffffe0',
         *     lime: '0f0',
         *     limegreen: '32cd32',
         *     linen: 'faf0e6',
         *     magenta: 'f0f',
         *     maroon: '800000',
         *     mediumaquamarine: '66cdaa',
         *     mediumblue: '0000cd',
         *     mediumorchid: 'ba55d3',
         *     mediumpurple: '9370d8',
         *     mediumseagreen: '3cb371',
         *     mediumslateblue: '7b68ee',
         *     mediumspringgreen: '00fa9a',
         *     mediumturquoise: '48d1cc',
         *     mediumvioletred: 'c71585',
         *     midnightblue: '191970',
         *     mintcream: 'f5fffa',
         *     mistyrose: 'ffe4e1',
         *     moccasin: 'ffe4b5',
         *     navajowhite: 'ffdead',
         *     navy: '000080',
         *     oldlace: 'fdf5e6',
         *     olive: '808000',
         *     olivedrab: '6b8e23',
         *     orange: 'ffa500',
         *     orangered: 'ff4500',
         *     orchid: 'da70d6',
         *     palegoldenrod: 'eee8aa',
         *     palegreen: '98fb98',
         *     paleturquoise: 'afeeee',
         *     palevioletred: 'd87093',
         *     papayawhip: 'ffefd5',
         *     peachpuff: 'ffdab9',
         *     peru: 'cd853f',
         *     pink: 'ffc0cb',
         *     plum: 'dda0dd',
         *     powderblue: 'b0e0e6',
         *     purple: '800080',
         *     rebeccapurple: '639',
         *     red: 'f00',
         *     rosybrown: 'bc8f8f',
         *     royalblue: '4169e1',
         *     saddlebrown: '8b4513',
         *     salmon: 'fa8072',
         *     sandybrown: 'f4a460',
         *     seagreen: '2e8b57',
         *     seashell: 'fff5ee',
         *     sienna: 'a0522d',
         *     silver: 'c0c0c0',
         *     skyblue: '87ceeb',
         *     slateblue: '6a5acd',
         *     slategray: '708090',
         *     slategrey: '708090',
         *     snow: 'fffafa',
         *     springgreen: '00ff7f',
         *     steelblue: '4682b4',
         *     tan: 'd2b48c',
         *     teal: '008080',
         *     thistle: 'd8bfd8',
         *     tomato: 'ff6347',
         *     turquoise: '40e0d0',
         *     violet: 'ee82ee',
         *     wheat: 'f5deb3',
         *     white: 'fff',
         *     whitesmoke: 'f5f5f5',
         *     yellow: 'ff0',
         *     yellowgreen: '9acd32',
         *
         *
         *     // Material Design Colors https://material.io/design/color/the-color-system.html#tools-for-picking-colors
         *
         *      grey50: 'fafafa',
         *      grey100: 'f5f5f5',
         *      grey200: 'eee',
         *      grey300: 'e0e0e0',
         *      grey400: 'bdbdbd',
         *      grey500: '9e9e9e',
         *      grey600: '757575',
         *      grey700: '616161',
         *      grey800: '424242',
         *      grey900: '212121',
         *
         *      gray50: 'fafafa',
         *      gray100: 'f5f5f5',
         *      gray200: 'eee',
         *      gray300: 'e0e0e0',
         *      gray400: 'bdbdbd',
         *      gray500: '9e9e9e',
         *      gray600: '757575',
         *      gray700: '616161',
         *      gray800: '424242',
         *      gray900: '212121',
         *
         *      bluegrey50: 'eceff1',
         *      bluegrey100: 'CFD8DC',
         *      bluegrey200: 'B0BEC5',
         *      bluegrey300: '90A4AE',
         *      bluegrey400: '78909C',
         *      bluegrey500: '607D8B',
         *      bluegrey600: '546E7A',
         *      bluegrey700: '455A64',
         *      bluegrey800: '37474F',
         *      bluegrey900: '263238',
         *
         *      bluegray50: 'eceff1',
         *      bluegray100: 'CFD8DC',
         *      bluegray200: 'B0BEC5',
         *      bluegray300: '90A4AE',
         *      bluegray400: '78909C',
         *      bluegray500: '607D8B',
         *      bluegray600: '546E7A',
         *      bluegray700: '455A64',
         *      bluegray800: '37474F',
         *      bluegray900: '263238',
         *
         *      red50: 'FFEBEE',
         *      red100: 'FFCDD2',
         *      red200: 'EF9A9A',
         *      red300: 'E57373',
         *      red400: 'EF5350',
         *      red500: 'F44336',
         *      red600: 'E53935',
         *      red700: 'D32F2F',
         *      red800: 'C62828',
         *      red900: 'B71C1C',
         *      reda100: 'FF8A80',
         *      reda200: 'FF5252',
         *      reda400: 'FF1744',
         *      reda700: 'D50000',
         *
         *      pink50: 'FCE4EC',
         *      pink100: 'F8BBD0',
         *      pink200: 'F48FB1',
         *      pink300: 'F06292',
         *      pink400: 'EC407A',
         *      pink500: 'E91E63',
         *      pink600: 'D81B60',
         *      pink700: 'C2185B',
         *      pink800: 'AD1457',
         *      pink900: '880E4F',
         *      pinka100: 'FF80AB',
         *      pinka200: 'FF4081',
         *      pinka400: 'F50057',
         *      pinka700: 'C51162',
         *
         *      purple50: 'F3E5F5',
         *      purple100: 'E1BEE7',
         *      purple200: 'CE93D8',
         *      purple300: 'BA68C8',
         *      purple400: 'AB47BC',
         *      purple500: '9C27B0',
         *      purple600: '8E24AA',
         *      purple700: '7B1FA2',
         *      purple800: '6A1B9A',
         *      purple900: '4A148C',
         *      purplea100: 'EA80FC',
         *      purplea200: 'E040FB',
         *      purplea400: 'D500F9',
         *      purplea700: 'AA00FF',
         *
         *      deeppurple50: 'EDE7F6',
         *      deeppurple100: 'D1C4E9',
         *      deeppurple200: 'B39DDB',
         *      deeppurple300: '9575CD',
         *      deeppurple400: '7E57C2',
         *      deeppurple500: '673AB7',
         *      deeppurple600: '5E35B1',
         *      deeppurple700: '512DA8',
         *      deeppurple800: '4527A0',
         *      deeppurple900: '311B92',
         *      deeppurplea100: 'B388FF',
         *      deeppurplea200: '7C4DFF',
         *      deeppurplea400: '651FFF',
         *      deeppurplea700: '6200EA',
         *
         *      indigo50: 'E8EAF6',
         *      indigo100: 'C5CAE9',
         *      indigo200: '9FA8DA',
         *      indigo300: '7986CB',
         *      indigo400: '5C6BC0',
         *      indigo500: '3F51B5',
         *      indigo600: '3949AB',
         *      indigo700: '303F9F',
         *      indigo800: '283593',
         *      indigo900: '1A237E',
         *      indigoa100: '8C9EFF',
         *      indigoa200: '536DFE',
         *      indigoa400: '3D5AFE',
         *      indigoa700: '304FFE',
         *
         *      blue50: 'E3F2FD',
         *      blue100: 'BBDEFB',
         *      blue200: '90CAF9',
         *      blue300: '64B5F6',
         *      blue400: '42A5F5',
         *      blue500: '2196F3',
         *      blue600: '1E88E5',
         *      blue700: '1976D2',
         *      blue800: '1565C0',
         *      blue900: '0D47A1',
         *      bluea100: '82B1FF',
         *      bluea200: '448AFF',
         *      bluea400: '2979FF',
         *      bluea700: '2962FF',
         *
         *      lightblue50: 'E1F5FE',
         *      lightblue100: 'B3E5FC',
         *      lightblue200: '81D4FA',
         *      lightblue300: '4FC3F7',
         *      lightblue400: '29B6F6',
         *      lightblue500: '03A9F4',
         *      lightblue600: '039BE5',
         *      lightblue700: '0288D1',
         *      lightblue800: '0277BD',
         *      lightblue900: '01579B',
         *      lightbluea100: '80D8FF',
         *      lightbluea200: '40C4FF',
         *      lightbluea400: '00B0FF',
         *      lightbluea700: '0091EA',
         *
         *      cyan50: 'E0F7FA',
         *      cyan100: 'B2EBF2',
         *      cyan200: '80DEEA',
         *      cyan300: '4DD0E1',
         *      cyan400: '26C6DA',
         *      cyan500: '00BCD4',
         *      cyan600: '00ACC1',
         *      cyan700: '0097A7',
         *      cyan800: '00838F',
         *      cyan900: '006064',
         *      cyana100: '84FFFF',
         *      cyana200: '18FFFF',
         *      cyana400: '00E5FF',
         *      cyana700: '00B8D4',
         *
         *      teal50: 'E0F2F1',
         *      teal100: 'B2DFDB',
         *      teal200: '80CBC4',
         *      teal300: '4DB6AC',
         *      teal400: '26A69A',
         *      teal500: '009688',
         *      teal600: '00897B',
         *      teal700: '00796B',
         *      teal800: '00695C',
         *      teal900: '004D40',
         *      teala100: 'A7FFEB',
         *      teala200: '64FFDA',
         *      teala400: '1DE9B6',
         *      teala700: '00BFA5',
         *
         *      green50: 'E8F5E9',
         *      green100: 'C8E6C9',
         *      green200: 'A5D6A7',
         *      green300: '81C784',
         *      green400: '66BB6A',
         *      green500: '4CAF50',
         *      green600: '43A047',
         *      green700: '388E3C',
         *      green800: '2E7D32',
         *      green900: '1B5E20',
         *      greena100: 'B9F6CA',
         *      greena200: '69F0AE',
         *      greena400: '00E676',
         *      greena700: '00C853',
         *
         *      lightgreen50: 'F1F8E9',
         *      lightgreen100: 'DCEDC8',
         *      lightgreen200: 'C5E1A5',
         *      lightgreen300: 'AED581',
         *      lightgreen400: '9CCC65',
         *      lightgreen500: '8BC34A',
         *      lightgreen600: '7CB342',
         *      lightgreen700: '689F38',
         *      lightgreen800: '558B2F',
         *      lightgreen900: '33691E',
         *      lightgreena100: 'CCFF90',
         *      lightgreena200: 'B2FF59',
         *      lightgreena400: '76FF03',
         *      lightgreena700: '64DD17',
         *
         *      lime50: 'F9FBE7',
         *      lime100: 'F0F4C3',
         *      lime200: 'E6EE9C',
         *      lime300: 'DCE775',
         *      lime400: 'D4E157',
         *      lime500: 'CDDC39',
         *      lime600: 'C0CA33',
         *      lime700: 'AFB42B',
         *      lime800: '9E9D24',
         *      lime900: '827717',
         *      limea100: 'F4FF81',
         *      limea200: 'EEFF41',
         *      limea400: 'C6FF00',
         *      limea700: 'AEEA00',
         *
         *      yellow50: 'FFFDE7',
         *      yellow100: 'FFF9C4',
         *      yellow200: 'FFF59D',
         *      yellow300: 'FFF176',
         *      yellow400: 'FFEE58',
         *      yellow500: 'FFEB3B',
         *      yellow600: 'FDD835',
         *      yellow700: 'FBC02D',
         *      yellow800: 'F9A825',
         *      yellow900: 'F57F17',
         *      yellowa100: 'FFFF8D',
         *      yellowa200: 'FFFF00',
         *      yellowa400: 'FFEA00',
         *      yellowa700: 'FFD600',
         *
         *      amber50: 'FFF8E1',
         *      amber100: 'FFECB3',
         *      amber200: 'FFE082',
         *      amber300: 'FFD54F',
         *      amber400: 'FFCA28',
         *      amber500: 'FFC107',
         *      amber600: 'FFB300',
         *      amber700: 'FFA000',
         *      amber800: 'FF8F00',
         *      amber900: 'FF6F00',
         *      ambera100: 'FFE57F',
         *      ambera200: 'FFD740',
         *      ambera400: 'FFC400',
         *      ambera700: 'FFAB00',
         *
         *      orange50: 'FFF3E0',
         *      orange100: 'FFE0B2',
         *      orange200: 'FFCC80',
         *      orange300: 'FFB74D',
         *      orange400: 'FFA726',
         *      orange500: 'FF9800',
         *      orange600: 'FB8C00',
         *      orange700: 'F57C00',
         *      orange800: 'EF6C00',
         *      orange900: 'E65100',
         *      orangea100: 'FFD180',
         *      orangea200: 'FFAB40',
         *      orangea400: 'FF9100',
         *      orangea700: 'FF6D00',
         *
         *      deeporange50: 'FBE9E7',
         *      deeporange100: 'FFCCBC',
         *      deeporange200: 'FFAB91',
         *      deeporange300: 'FF8A65',
         *      deeporange400: 'FF7043',
         *      deeporange500: 'FF5722',
         *      deeporange600: 'F4511E',
         *      deeporange700: 'E64A19',
         *      deeporange800: 'D84315',
         *      deeporange900: 'BF360C',
         *      deeporangea100: 'FF9E80',
         *      deeporangea200: 'FF6E40',
         *      deeporangea400: 'FF3D00',
         *      deeporangea700: 'DD2C00',
         *
         *      brown50: 'EFEBE9',
         *      brown100: 'D7CCC8',
         *      brown200: 'BCAAA4',
         *      brown300: 'A1887F',
         *      brown400: '8D6E63',
         *      brown500: '795548',
         *      brown600: '6D4C41',
         *      brown700: '5D4037',
         *      brown800: '4E342E',
         *      brown900: '3E2723'
         *   }
         *   ```
         * @link https://jspanel.de/#global/colorNames
         */
        colorNames: string[];

        /**
         * **Returns:**
         * - a {@link JsPanelOptions} object with all default options applied to a panel
         * **Type:**
         *  {@link JsPanelOptions} Object
         * Default:
         * ``` javascript
         * {
         *     boxShadow: 3,
         *     container: 'window',
         *     contentSize: {width: '400px', height: '200px'}, // must be object
         *     dragit: {
         *         cursor:  'move',
         *         handles: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr', // do not use .jsPanel-headerbar
         *         opacity: 0.8,
         *         disableOnMaximized: true
         *     },
         *     header: true,
         *     headerTitle: 'jsPanel',
         *     headerControls: {size: 'md'}, // must be object
         *     iconfont: undefined,
         *     maximizedMargin: 0,
         *     minimizeTo: 'default',
         *     paneltype: 'standard',
         *     position: {my:'center', at:'center'},  // default position.of MUST NOT be set with new positioning engine as of v4.7.0
         *     resizeit: {
         *         handles: 'n, e, s, w, ne, se, sw, nw',
         *         minWidth: 128,
         *         minHeight: 38
         *     },
         *     theme: 'default'
         * }
         * ```
         *
         * **Changing defaults**
         * - You can set or change a default simply by setting its value:
         *``` javascript
         * jsPanel.defaults.iconfont = 'fad';
         * ```
         *
         * To change more than one default set each one separately
         *``` javascript
         * jsPanel.defaults.iconfont = 'fad';
         * jsPanel.defaults.theme = 'primary';
         * ```
         *
         * or use Object.assign();
         *``` javascript
         * Object.assign(jsPanel.defaults, {
         *     iconfont: 'far',
         *     theme: 'primary'
         * });
         * ```
         *
         * @link https://jspanel.de/#global/defaults
         */
        defaults: JsPanelOptions;

        /**
         * **Returns:**
         * - a number indicating whether jsPanel's error reporting is on or off
         * **Type:**
         * - Integer, either 0 or 1
         * **Default:**
         * - 1 (error reporting is on)
         *
         * By default jsPanel has a built-in error handling for a few issues and shows text messages for occurring errors in an error panel.
         *
         * Currently implemented errors are shown when
         *
         * - you try to create a panel with an ID attribute value that already exists in the document
         *
         * **Error handling:** no panel is created and a corresponding error panel is shown.
         *
         * - you try to append a panel to a container that does not exist
         *
         * **Error handling:** no panel is created and a corresponding error panel is shown.
         * - parameter url is missing when you use either jsPanel.ajax() or option contentAjax
         *
         * **Error handling:** the XMLHttpRequest is not sent and a corresponding error panel is shown.
         *
         * - parameter resource is missing when you either jsPanel.fetch() or option contentFetch
         * **Error handling:** the Fetch request is not sent and a corresponding error panel is shown.
         *
         * Turn off error panels with:
         *
         * ``` javascript
         * jsPanel.errorReporting = 0;
         * ```
         *
         * **Note that only error panels are turned off, not the rest of the error handling.**
         *
         * @link https://jspanel.de/#global/errorReporting
         */
        errorReporting: 0 | 1;

        /**
         * **Returns:**
         * - a function or array of functions
         * **Type:**
         * - Function or array of Functions
         * **Default:**
         * - undefined
         *
         * In some situations it might be useful to set a specific callback function for all panels you create. Instead of adding this callback to each panel separately you can add it to jsPanel.globalCallbacks and it will be called whenever a new panel is created.
         *
         * Each function you add to jsPanel.globalCallbacks receives the panel as argument and the keyword this inside the function also refers to the panel.
         *
         * **Example**
         *
         * This example adds a dblclick handler to the titlebar of all standard panels. A dblclick on the titlebar toggles the panel's status between maximized and normalized.
         *``` javascript
         * jsPanel.globalCallbacks = panel => {
         *     if (panel.options.paneltype === 'standard') {
         *         panel.titlebar.addEventListener('dblclick', () => {
         *             panel.status !== 'maximized'
         *                 ? panel.maximize()
         *                 : panel.normalize();
         *         });
         *     }
         * };
         *
         * jsPanel.create();
         * ```
         * @link https://jspanel.de/#global/globalCallbacks
         */
        globalCallbacks: ((panel: JsPanel) => void) | ((panel: JsPanel) => void)[];

        /**
         * **Returns:**
         * - an object with the default SVG icons used for the panel's controls (close button, maximize button, etc.)
         * **Type:**
         * - Object
         * **Default:**
         * ``` javascript
         * {
         *     close:     '<svg> ... </svg>' ,
         *     maximize:  '<svg> ... </svg>' ,
         *     normalize: '<svg> ... </svg>' ,
         *     minimize:  '<svg> ... </svg>' ,
         *     smallify:  '<svg> ... </svg>'
         * }
         * ```
         *
         * **Example**
         *
         * This example creates a panel without header section and adds a footer toolbar with a close button taken from jsPanel.icons.
         *
         * ``` javascript
         * jsPanel.create({
         *     header: false,
         *     border: '1px dimgrey',
         *     panelSize: '300 200',
         *     footerToolbar: '<span id="btn-close1" class="jsPanel-ftr-btn">' + jsPanel.icons.close + '</span>',
         *     callback: panel => {
         *         let btnClose = panel.footer.querySelector('#btn-close1');
         *         jsPanel.setStyle(btnClose.querySelector('svg'), {height: '18px', cursor: 'pointer'});
         *         btnClose.addEventListener('click', () => {
         *             panel.close();
         *         });
         *     }
         * });
         * ```
         * @link https://jspanel.de/#global/icons
         */
        icons: Record<string, string>;


        /**
         * **Returns:**
         * - an array with event types used for the panel controls
         *
         * **Type:**
         * - Array
         *
         * **Default:**
         * Depends on supported Event API
         *
         * - **['pointerdown']** if the Pointer Event API is supported
         * - **['touchstart', 'mousedown']** if the TouchEvent API is supported but not the Pointer Event API
         * - **['mousedown']** fallback if only the MouseEvent API is supported
         *
         * This property returns an array of one or more strings with the names of event types depending on which event APIs are supported by the browser. Internally the handlers for the panel controls listen to the event(s) according to this array.
         *
         * **Example**
         *``` javascript
         * jsPanel.pointerdown.forEach( event => {
         *     Element.addEventListener(event, e => {
         *         // do something
         *     });
         * });
         * ```
         *
         * @link https://jspanel.de/#global/pointerdown
         */
        pointerdown: ['pointerdown'] | ['touchstart', 'mousedown'] | ['mousedown'];


        /**
         * **Returns:**
         * - an array with event types used for the panel controls
         *
         * **Type:**
         * - Array
         *
         * **Default:**
         * Depends on supported Event API
         *
         * - **['pointermove']** if the Pointer Event API is supported
         * - **['touchmove', 'mousemove']** if the TouchEvent API is supported but not the Pointer Event API
         * - **['mousemove']** fallback if only the MouseEvent API is supported
         *
         * This property returns an array of one or more strings with the names of event types depending on which event APIs are supported by the browser. Internally the handlers for the panel controls listen to the event(s) according to this array.
         *
         * **Example**
         *
         * ``` javascript
         * jsPanel.pointermove.forEach( event => {
         *     Element.addEventListener(event, e => {
         *         // do something
         *     });
         * });
         * ```
         * @link https://jspanel.de/#global/pointermove
         */
        pointermove: ['pointermove'] | ['touchmove', 'mousemove'] | ['mousemove'];


        /**
         * **Returns:**
         * - an array with event types used for the panel controls
         * **Type:**
         * - Array
         *
         * **Default:**
         * Depends on supported Event API
         *
         * - **['pointerup']** if the Pointer Event API is supported
         * - **['touchend', 'mouseup']** if the TouchEvent API is supported but not the Pointer Event API
         * - **['mouseup']** fallback if only the MouseEvent API is supported
         *
         * This property returns an array of one or more strings with the names of event types depending on which event APIs are supported by the browser. Internally the handlers for the panel controls listen to the event(s) according to this array.
         *
         * **Example**
         * ``` javascript
         * jsPanel.pointerup.forEach( event => {
         *    Element.addEventListener(event, e => {
         *    // do something
         *    });
         *  });
         * ```
         * @link https://jspanel.de/#global/pointerup
         */
        pointerup: ['pointerup'] | ['touchend', 'mouseup'] | ['mouseup'];

        /**
         *  returns a string with the exact date/time the main jsPanel javascript file was created like 2022-11-03 09:18
         *  @link https://jspanel.de/#global/version
         */
        readonly date: string;
        /**
         *  returns a string with the jsPanel version like 4.16.1
         *  @link https://jspanel.de/#global/version
         */
        readonly version: string;

        /**
         * @see {ziBase}
         */
        zi?: boolean;
        /**
         * **Returns:**
         * a number with the lowest possible z-index value for the panels in the document
         *
         * **Type:**
         * Integer
         *
         * **Default:**
         * 100
         *
         * Internally **jsPanel** uses a method to calculate **z-index** values based on **jsPanel.ziBase**.
         *
         * If needed you can change this value by setting **jsPanel.ziBase** to the desired value before the first panel is created.
         *
         * ``` javascript
         * jsPanel.ziBase = 500;
         * ```
         *
         * If you for some reason need to do this after a panel was already created you first have to reset the z-index generator:
         *
         * ``` javascript
         * jsPanel.zi = false;
         * jsPanel.ziBase = 500;
         * ```
         *
         * @linkhttps://jspanel.de/#global/ziBase
         */
        ziBase: number;

        //----------------- Methods section -----------------//

        /**
         * This method appends a script to the head of a document and executes it unless a <script> element with exactly the same src attribute value as passed to the method is found within the document.
         *
         * **RETURN VALUE:**
         * - This method has no return value.
         *
         * **ARGUMENTS:**
         *
         * - src String - required - URL with the path pointing to the script to load
         * - type String - required - String with the Internet media type like 'application/javascript' of the script to load
         * - callback Function - optional - callback function triggered by the onload event of the added script
         *
         * **Example**
         *``` javascript
         * jsPanel.addScript('./docs/sample-content/testscript.js', 'application/javascript', () => {
         *   console.log('Testproperty = ' + window.testproperty);
         * });
         * ```
         * @param {string} src required - URL with the path pointing to the script to load
         * @param {string} type required - String with the Internet media type like 'application/javascript' of the script to load
         * @param {() => void} callback optional - callback function triggered by the onload event of the added script
         *
         * @link https://jspanel.de/#global/addScript
         */
        addScript: (src: string, type: string, callback ?: () => void) => void;


        /**
         * **Example 1**
         *
         * Example 1 requests an HTML file and after a successful request the content of this <div> is replaced with the responseText.
         *
         * ``` javascript
         * jsPanel.ajax({
         *     url: 'docs/sample-content/sampleContent.html',
         *     done: function() {
         *         let container = document.querySelector('.sample-content-container');
         *         container.innerHTML = this.responseText;
         *     }
         * });
         * ```
         *
         *
         * **Example 2**
         *
         * Example 2 first requests an HTML file. Then, after the request completes successfully a panel is created and the responseText is used as content.
         *
         * ``` javascript
         * jsPanel.ajax({
         *     url: 'docs/sample-content/sampleContent.html',
         *     done: (xhr) => {
         *         jsPanel.create({
         *             content: xhr.responseText,
         *             panelSize: '700 auto'
         *         });
         *     }
         * });
         * ```
         *
         * @param {JsPanelAjaxOptions} options
         * @link https://jspanel.de/#global/ajax
         */
        ajax: (options: JsPanelAjaxOptions) => void;

        /**
         * Internally this method is used to calculate background and font colors based on color.
         *
         * **RETURN VALUE:**
         *
         * Array with the following values:
         *
         * - [0] HSL value of color
         * - [1] HSL value of color lightened by the amount stored in jsPanel.colorFilledLight. This color is used as background color of a panel's content section when the theme modifier 'filledlight' is used.
         * - [2] HSL value of color darkened by the amount stored in jsPanel.colorFilled. This color is used as background color of a panel's content section when the theme modifier 'filled' is used.
         * - [3] HEX color value '#000000' or '#ffffff' used as font color if background color is index[0]. Which value is used depends on the perceived brightness of the corresponding background color
         * - [4] HEX color value '#000000' or '#ffffff' used as font color if background color is index[1]. Which value is used depends on the perceived brightness of the corresponding background color
         * - [5] HEX color value '#000000' or '#ffffff' used as font color if background color is index[2]. Which value is used depends on the perceived brightness of the corresponding background color
         * - [6] HSL value of color lightened by the amount stored in jsPanel.colorFilledDark. This color is used as background color of a panel's content section when the theme modifier 'filleddark' is used.
         * - [7] HEX color value '#000000' or '#ffffff' used as font color if background color is index[6]
         *
         *
         * **ARGUMENT:**
         *
         * ** color** - String - may have one of the following values:
         * - A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
         * - RGB color value like rgb(120,200,17)
         * - RGBA values can be used but the alpha channel is ignored
         * - HEX color value like #d5e863 or #ddd; (# is optional)
         * - HSL color value like hsl(90,100%,25%)
         * - HSLA values can be used but the alpha channel is ignored
         * - RGB and HSL color values must use the comma as separator and must not have empty spaces.
         *
         * **Example**
         * ``` javascript
         * let colors = jsPanel.calcColors('#981265');
         * console.log(colors);
         * ```
         *
         * ``` text
         * [0] hsl(323,79%,33%),
         * [1] hsl(323,79%,87%),
         * [2] hsl(323,79%,33%),
         * [3] #ffffff,
         * [4] #000000,
         * [5] #ffffff,
         * [6] hsl(323,79%,38%),
         * [7] #ffffff
         * ```
         * @link https://jspanel.de/#global/calcColors
         *
         * @param {string} color
         * @return {string}
         */
        calcColors: (color: string) => string;


        /**
         * Internally this method is used to provide various color formats based on color.
         *
         * **RETURN VALUE:**
         *
         * Object with color represented in various HEX, RGB, HSL and CSS usable formats
         *
         * **ARGUMENT:**
         *
         * **color**
         * - String - may have one of the following values:
         * - A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
         * - RGB color value like rgb(120,200,17)
         * - RGBA values can be used but the alpha channel is ignored
         * - HEX color value like #d5e863 or #ddd; (# is optional)
         * - HSL color value like hsl(90,100%,25%)
         * - HSLA values can be used but the alpha channel is ignored
         * - RGB and HSL color values must use the comma as separator and must not have empty spaces.
         *
         * @param string
         * @return {{rgb: {css: string, r: string, g: string, b: string}, hex: string, hsl: {css: string, h: string, s: string, l: string}}}
         * @link https://jspanel.de/#global/color
         */
        color: (val: string) => {
            rgb:
                {
                    css: string,
                    r: string,
                    g: string,
                    b: string
                },
            hex: string,
            hsl: {
                css: string,
                h: string,
                s: string,
                l: string
            }
        }; // color


        create: (options?: JsPanelOptions, callback?: JsPanelCallback) => JsPanel;


        /**
         * Calculates a color value darkened by amount based on color.
         *
         * **RETURN VALUE:**
         *
         * String with an HSL color value
         *
         * **ARGUMENTS:**
         *
         * color - String - may have one of the following values:
         * A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
         * - RGB color value like rgb(120,200,17)
         * - RGBA values can be used but the alpha channel is ignored
         * - HEX color value like #d5e863 or #ddd; (# is optional)
         * - HSL color value like hsl(90,100%,25%)
         * - HSLA values can be used but the alpha channel is ignored
         * - RGB and HSL color values must use the comma as separator and must not have empty spaces.
         *
         * **amount**
         * - Number in the range 0 to 1.
         *
         * A value of 0.6 for example darkens color by 60%
         *
         * A value of 1 will always return black, a value of 0 returns the same color
         *
         *
         * **Example**
         * ``` javascript
         * darken('hsl(90,100%,25%)', 0.5) // returns 'hsl(90,100%,13%)'
         * ```
         *
         * @param {string} color
         * @param {number} amount
         * @return {string}
         * @link https://jspanel.de/#global/darken
         */
        darken: (color: string, amount: number) => string;

        /**
         * This method removes all content from node.
         *
         * **RETURN VALUE:**
         *
         * node
         *
         * **ARGUMENT:**
         *
         * node -  Node object
         *
         *
         * **Example**
         *``` javascript
         * jsPanel.create({
         *     content: '<h5>Heading ...</h5><p>Lorem ipsum dolor ...</p>',
         *     callback: panel => {
         *         window.setTimeout(() => {
         *             jsPanel.emptyNode(panel.content);
         *         }, 2000);
         *     }
         * });
         * ```
         *
         * @param {Node} node
         * @link https://jspanel.de/#global/emptyNode
         */
        emptyNode: (node: Node) => void;


        /**
         * With this method you can extend panels with your own custom properties and/or methods.
         *
         * **RETURN VALUE:**
         *
         * This method has no return value
         *
         * **ARGUMENT:**
         *
         * object - a plain object with a key:value pair for each property/method you want to add to the panels
         *
         * **Usage**
         *``` javascript
         * jsPanel.extend({
         *     one: function() {
         *         // do something ...
         *     },
         *     two: function() {
         *         // do something ...
         *     },
         * });
         *
         * // now you can call the new methods on all your panel
         * let panel = jsPanel.create();
         * panel.one();
         * ```
         *
         * @param {Record<string, Function>} extendFunctions
         * @link https://jspanel.de/#global/extend
         */
        extend: (extendFunctions: Record<string, Function>) => void;

        /**
         *
         * **Example 1**
         *
         *``` javascript
         * jsPanel.fetch({
         *     resource: 'docs/sample-content/sampleContent.html',
         *     done: function(response) {
         *         let container = document.querySelector('.sample-content-container');
         *         jsPanel.emptyNode(container);
         *         container.innerHTML = response;
         *     }
         * });
         * ```
         *
         * @link https://jspanel.de/#global/fetch
         * @param {JsPanelFetchOptions} options
         */
        fetch: (options: JsPanelFetchOptions) => void;


        /**
         * This method searches the document for panels and returns an array with the panels matching condition.
         *
         * **RETURN VALUE:**
         *
         * Array with all panels matching condition sorted by z-index highest first.
         *
         * **ARGUMENT:**
         *
         * - condition - function(panel)
         *
         * The function receives the current panel to test as argument and the keyword this inside the function also refers to the current panel to test.
         *
         * If omitted condition defaults to function  **()=> {return this.classList.contains('jsPanel-standard');}.**
         *
         * **Example 1**
         *
         * This example uses the default condition getting all standard panels (panels with the class 'jsPanel-standard') in the document.
         *``` javascript
         * // create a few panels
         * jsPanel.create();
         * jsPanel.create({position: 'center 50 50', theme: 'primary'});
         * jsPanel.create({position: 'center 100 100', theme: 'success'});
         *
         * // get all standard panels and log result to console
         * console.log(jsPanel.getPanels());
         * ```
         *
         * **Example 2**
         *
         * This example gets all standard panels that are NOT minimized, extracts the panel ID's and returns an array with only the ID values.
         *
         * ``` javascript
         * // create a few panels
         * jsPanel.create({setStatus: 'minimized', theme: 'danger'}); // minimized panel
         * jsPanel.create({position: 'center 50 50', theme: 'primary'});
         * jsPanel.create({position: 'center 100 100', theme: 'success'});
         *
         * // get all standard panels that are not minimized, extract ID values and return array with ID's only
         * let panelIDs = jsPanel.getPanels(function() {
         *     return this.classList.contains('jsPanel-standard') && this.status !== 'minimized';
         * }).map(panel => panel.id);
         * console.log(panelIDs);
         * ```
         *
         * @link https://jspanel.de/#global/getPanels
         *
         * @param {JsPanel} panel
         * @return {JsPanel[]}
         */
        getPanels: (panel: JsPanel) => JsPanel[];

        /**
         * This method returns the value stored in a css custom property/variable.
         *
         * **RETURN VALUE:**
         *
         * String with value stored in a css custom property/variable.
         *
         * **ARGUMENT:**
         *
         * - variable - String - A css custom property like '--myColor' or a css variable like 'var(--myColor)'
         * **
         * **Example 1**
         *``` javascript
         * console.log(jsPanel.getCssVariableValue('--myColor'));
         * console.log(jsPanel.getCssVariableValue('var(--myColor)'));
         * ```
         * @link https://jspanel.de/#global/getCssVariableValue
         * @param {string} variable
         * @return {string}
         */
        getCssVariableValue: (variable: string) => string;


        /**
         * Calculates a color value lightened by amount based on color.
         *
         * **RETURN VALUE:**
         *
         * String with an HSL color value
         *
         * **ARGUMENTS:**
         *
         * - color - String - may have one of the following values:
         *          - A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
         *          - RGB color value like rgb(120,200,17)
         *          - RGBA values can be used but the alpha channel is ignored
         *          - HEX color value like #d5e863 or #ddd; (# is optional)
         *          - HSL color value like hsl(90,100%,25%)
         *          - HSLA values can be used but the alpha channel is ignored
         *          - RGB and HSL color values must use the comma as separator and must not have empty spaces.
         *
         * - amount - Number  - in the range 0 to 1.
         *          - A value of 0.6 for example lightens color by 60%
         *          - A value of 1 will always return white, a value of 0 returns the same color
         *
         * **Example**
         *
         * ``` javascript
         * jsPanel.lighten('#d5e863', 0.75) // returns 'hsl(69,74%,91%)'
         * ```
         *
         * @param {string} color
         * @param {number} amount
         * @return {string} - HSL color value
         *
         * @link https://jspanel.de/#global/lighten
         */
        lighten: (color: string, amount: number) => string;

        /**
         * Calculates perceived brightness based on color.
         *
         * By default a panel's font color for header and content sections are either black or white. This method is internally used to determine which font color the used background color requires.
         *
         * jsPanel uses a white font color for background colors with a perceived brightness of <= 0.55, otherwise black.
         *
         * **RETURN VALUE:**
         *
         * Number in the range 0 to 1
         *
         * A color with a perceived brightness of 0 is always black and a color with a perceived brightness of 1 is always white.
         *
         * **ARGUMENT:**
         *
         * - color - String - may have one of the following values:
         *      - A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
         *      - RGB color value like rgb(120,200,17)
         *      - RGBA values can be used but the alpha channel is ignored
         *      - HEX color value like #d5e863 or #ddd; (# is optional)
         *      - HSL color value like hsl(90,100%,25%)
         *      - HSLA values can be used but the alpha channel is ignored
         *      - RGB and HSL color values must use the comma as separator and must not have empty spaces.
         *
         *
         * **Example**
         *
         * ``` javascript
         * jsPanel.perceivedBrightness('#d5e863'); // returns 0.8563058823529411
         * jsPanel.perceivedBrightness('forestgreen'); // return 0.4278274509803921
         * ```
         *
         * @param {string} color
         * @return {number} number between 0 and 1. if <= 0.55 font color should be white, otherwise black
         *
         * @link https://jspanel.de/#global/perceivedBrightness
         */
        perceivedBrightness: (color: string) => number;

        /**
         * This method positions element according to position and does all the work behind option position.
         *
         * It can be used to position other elements as well, although it's not very comfortable.
         *
         * **RETURN VALUE:**
         *
         * The positioned element
         *
         * **ARGUMENTS:**
         * - element - node Node or HTMLElement - required
         *      - element must have a property options of type object that in turn has a key container set with a value as within a jsPanel configuration object.
         *      - element must have a property getScaleFactor of type function returning an object like {x: 1, y: 1} with the scale factors of the element to position.
         *
         * - position - boolean| string |JSPanelPosition - required - The same kind of positioning object as used with option position (@link https://jspanel.de/#options/position).
         *
         * **Example**
         *
         *``` javascript
         * // create element to position
         * let elmt = document.createElement('div');
         * jsPanel.setStyles(elmt, {
         *     position: 'absolute',
         *     width: '300px',
         *     height: '185px',
         *     border: '3px solid crimson',
         *     backgroundColor: 'rgba(220,20,60,0.2)',
         *     zIndex: 100
         * });
         * elmt.innerHTML = '<p>Click to remove!</p>';
         * elmt.options = {container: 'window'};
         * elmt.getScaleFactor = () => {return {x:1, y:1};};
         * document.body.appendChild(elmt);
         * elmt.querySelector('p').addEventListener('click', () => document.body.removeChild(elmt));
         *
         * // finally position element
         * jsPanel.position(elmt, 'center');
         * ```
         *
         * @link https://jspanel.de/#global/position
         *
         * @param {Node | HTMLElement} element
         * @param {JSPanelPosition} position
         */

        position: (element: Node | HTMLElement, position: boolean | string | JSPanelPosition) => void;


        /**
         *
         * This method removes one or more CSS classnames from element.
         *
         * **RETURN VALUE:**
         *
         * - element
         *
         * **ARGUMENTS:**
         *
         * - element node object - required - The element to remove the classname/s from.
         *
         * - classnames - string - required - Either a single classname or a space separated list of classnames to remove.
         *
         * **Example**
         *
         * THIS EXAMPLE REMOVES 2 CLASSNAMES FROM THIS PARAGRAPH.
         *``` javascript
         * jsPanel.remClass(document.querySelector('#infotext'), 'font-bold uppercase');
         * ```
         *
         * @param {Node | HTMLElement} element
         * @param {string} className
         * @link https://jspanel.de/#global/remClass
         */
        remClass(element: Node | HTMLElement, className: string): Node | HTMLElement;

        /**
         *
         * This method adds one or more CSS classnames to element.
         *
         * **RETURN VALUE:**
         *
         * - element
         *
         * **ARGUMENTS:**
         *
         * - element node object - required - The element to add the classname/s to.
         *
         * - classnames - string - required - Either a single classname or a space separated list of classnames to add.
         *
         * **Example**
         *
         * This example adds 2 classnames to this paragraph.
         *``` javascript
         * jsPanel.setClass(document.querySelector('#infotext'), 'font-bold uppercase');
         * ```
         *
         * @param {Node | HTMLElement} element
         * @param {string} className
         * @link https://jspanel.de/#global/setClass
         */
        setClass(element: Node | HTMLElement, className: string): Node | HTMLElement;


        /**
         * This method sets one or more CSS styles of element defined in 'styles' object.
         *
         * **RETURN VALUE:**
         *
         * - element
         *
         * **ARGUMENTS:**
         *
         * - element node object - required - The element to style.
         *
         * - styles - object - required  - A plain object with css property:value pairs of the styles to set.
         *
         * CSS property names can be lowerCamelCase or strings with hyphens (eg: backgroundColor or 'background-color').
         *
         * **Example**
         *
         * Styles for this paragraph are set via the code sample below.
         *``` javascript
         * jsPanel.setStyles(document.querySelector('#infotext'), {
         *     fontWeight: 'bold',
         *     color: 'red',
         *     'text-align': 'center'
         * });
         * ```
         *
         * @param {Node | HTMLElement} element
         * @param {Record<string, string>} styles
         * @return {Node | HTMLElement}
         *
         * @link https://jspanel.de/#global/setStyles
         *
         */
        setStyles: (element: Node | HTMLElement, styles: Record<string, string>) => Node | HTMLElement;


        /**
         * This utility method returns a DocumentFragment based on string.
         *
         * Return values from **jsPanel.ajax()** and **jsPanel.fetch()** as well as a response from options **contentAjax** and **contentFetch**
         * you need to process in a done callback are just strings. Depending on how you add these strings to your page they might
         * not be rendered as HTML.
         *
         * **jsPanel.strToHtml()** converts a string to a **DocumentFragment** that will be rendered as HTML and can even be searched with querySelector() and similar methods.
         *
         *
         * **RETURN VALUE:**
         *
         * - DocumentFragment
         *
         * **ARGUMENT:**
         *
         * - str - String - required - A string value with tags and text to convert to a DocumentFragment.
         *
         * **Example**
         *
         * This simple example shows differences when using **ParentNode.append()** to add content to the page.
         *``` javascript
         * let str = '<p>DOMString to convert to <strong>DocumentFragment</strong></p>';
         * let container = document.querySelector('#test-container');
         * jsPanel.emptyNode(container);
         *
         * container.append(str);
         * container.append(jsPanel.strToHtml(str));
         * container.append(jsPanel.strToHtml(str).querySelector('strong'));
         *```
         *
         * @param {string} str - A string value with tags and text to convert to a DocumentFragment.
         * @return {DocumentFragment} - DocumentFragment
         *
         * @link https://jspanel.de/#global/strToHtml
         */
        strToHtml: (str: string) => DocumentFragment;

        /**
         * This method toggles one or more CSS classnames of element.
         *
         * **RETURN VALUE:**
         *
         * - element
         *
         * **ARGUMENTS:**
         *
         * - element - node object - required - The element to toggle classname/s of.
         * - classnames - string - required - Either a single classname or a space separated list of classnames to toggle.
         *
         * **Example**
         *
         * This example toggles 2 classnames of this paragraph.
         *``` javascript
         * jsPanel.toggleClass(document.querySelector('#infotext'), 'font-bold uppercase');
         * ```
         *
         * @link https://jspanel.de/#global/toggleClass
         *
         * @param {Node | HTMLElement} element
         * @param {string} className
         * @return {Node | HTMLElement}
         */
        toggleClass: (element: Node | HTMLElement, className: string) => Node | HTMLElement;

        /**
         * As of v4.13.0 jsPanel uses the PointerEvent API by default.
         *
         * You can use this method to switch between the use of MOUSE/TOUCH events and POINTER events. This applies basically to the controls of a panel and the resizeit/dragit interactions.
         *
         * The method sets the values of the properties **jsPanel.pointerdown**, **jsPanel.pointermove** and **jsPanel.pointerup**.
         *
         * RETURN VALUE:
         *
         * This method has no return value
         *
         * ARGUMENTS:
         *
         * boolean default: true
         *
         *
         * **Example**
         *``` javascript
         * console.log(jsPanel.pointerdown);
         * jsPanel.usePointerEvents(false);
         * console.log(jsPanel.pointerdown);
         * jsPanel.usePointerEvents(); // param use defaults to boolean true
         * console.log(jsPanel.pointerdown);
         * ```
         * @param {boolean} use - default: true
         * @link https://jspanel.de/#global/usePointerEvents
         */
        usePointerEvents: boolean;


        //------------------- EXTENSIONS -------------------//
        modal: JsPanelModal;

    } // JsPanelSingleton

    export interface JsPanelModal {

        /**
         * The modal extension version
         */
        version: string;

        /**
         * The release date/time of the modal extension
         */
        date: string;

        /**
         * {@link JsPanelOptionsModal} with options applied to a modal. These defaults deviate from those applied to a standard panel.
         * The default options (if nothing specified are)
         * ```javascript
         * {
         *     dragit: false,
         *     resizeit: false',
         *     closeOnBackdrop: true, // see notes below
         *     closeOnEscape: true
         *     headerControls: 'closeonly'
         * }
         * ```
         */
        defaults: JsPanelOptionsModal;
        ziModal: number;

        /**
         * Adds a backdrop to the document.
         *
         * The backdrop is a div element with a z-index value of
         * ```javascript
         * zIndex = this.ziModal.next();
         * ```
         *
         * an id of
         * ```javascript
         *    'jsPanel-modal-backdrop-' + id
         * ```
         * and a class of
         * ``` textContent
         * jsPanel-modal-backdrop
         * ```
         *
         * If this is a second modal on top of the first modal the class list is *
         *
         * ``` textContent
         * jsPanel-modal-backdrop jsPanel-modal-backdrop-multi
         * ```
         *
         * @param {string} id
         * @return {HTMLDivElement}
         */
        addBackdrop: (id: string)=>HTMLDivElement;


        /**
         * This creates a **modal** version of JsPanel.
         *
         * The paneltype is set to 'modal' in options
         * ```javascript
         * panel.options.paneltype == 'modal'
         * ```
         *
         * The container is ALWAYS 'window'
         *
         * The z-index starts at 10000. The internal ziModal is:
         * ```javascript
         * jsPanel.modal.ziModal = function () {
         *     var val = jsPanel.ziBase + 10000;
         *     return {
         *       next: function next() {
         *         return val++;
         *       }
         *     };
         *   }
         *```
         *
         * @param {JsPanelOptionsModal} modal_config same as JsPanelOptions plus 'closeOnBackdrop' property
         * @return {JsPanelSingleton}
         */
        create: (modal_config: JsPanelOptionsModal)=>JsPanelSingleton;

        /**
         * Removes a modal backdrop from the document.
         *
         * It starts by finding
         * ```javascript
         *  document.getElementById("jsPanel-modal-backdrop-".concat(id))
         *  ```
         *  It then adds class **'jsPanel-modal-backdrop-out'** to the element for the removal animation.
         *
         *  After a delay specified in css by:
         *  ```javascript
         *  var delay = parseFloat(getComputedStyle(mb).animationDuration) * 1000;
         *  ```
         *  the element is removed from the document on setTimeout with the delay above.
         * @param {string} id
         */
        removeBackdrop:(id: string)=>void;
    }

    export interface JsPanelOptionsModal extends JsPanelOptions {
        closeOnBackdrop?: boolean;
    } // JsPanelOptionsModal

    export interface JsPanel {

        //----------------- Methods section -----------------//

        /**
         * Adds a control to an already existing panel within its controlbar.
         *
         * @param {AddPanel} options - Configuration object for the control to be added.
         * @returns {void} - Returns the panel on which the method was called.
         *
         * @property {string} html - HTML string with the markup of the control. Required.
         * @property {string} [name] - Optional name for the control, used as a class name for the button element wrapping the HTML and as an identifier for `setControlStatus()`.
         * @property {string} [ariaLabel] - Optional `aria-label` attribute value. Defaults to the value of `name`, if set.
         * @property {function} [handler] - Function to set up a handler for the control. Receives the panel and the control as arguments.
         * @property {number} [position=1] - Optional position of the control within the controlbar, based on the source order.
         * @property {function} [afterInsert] - Function to call after the control is added. Receives the control as an argument.
         *
         * @example
         * jsPanel.create().addControl({
         *     html: '<span class="fad fa-bars"></span>',
         *     name: 'menu',
         *     ariaLabel: 'panel menu',
         *     handler: (panel, control) => {
         *         panel.content.innerHTML = '<p>You clicked the "menu" control</p>';
         *     },
         *     position: 6,
         *     afterInsert: (control) => {
         *         control.style.background = '#fff';
         *      }
         * });
         */
        addControl(options: AddPanel): JsPanel;

        /**
         * Adds either a header toolbar or a footer toolbar to an already existing panel.
         *
         * @param {string} location - Sets where in the panel to add the toolbar.
         *   Supported values are 'header' for the header section and 'footer' for the footer.
         * @param {(string | Node | string[] | Node[] | ((panel: JsPanel) => string | Node | string[] | Node[]))} toolbar - The toolbar content.
         *   - String: Used as toolbar content as provided.
         *   - Node: A Node used as toolbar content.
         *   - Array: An array of Strings or Nodes, added to the toolbar sequentially.
         *   - Function: A function returning a String, Node, or an array of these. Receives the panel as an argument.
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the toolbar is inserted.
         *   Receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * var toolbar = [
         *     '<span id="btn-bus"><i class="fad fa-bus"></i></span>',
         *     '<span id="btn-train"><i class="fad fa-train"></i></span>',
         *     '<span id="btn-car"><i class="fad fa-car"></i></span>'
         * ];
         * jsPanel.create().addToolbar('header', toolbar, (panel) => {
         *     // Callback to add handlers, for example
         * });
         */
        addToolbar: Type_AddToolbar;

        /**
         * Closes a panel, removing its markup from the DOM. This does not remove other references to the panel.
         *
         * @param {Function} [callback] - Optional callback function to execute after the close method is called.
         *   Arguments:
         *      - id  - the panel's ID attribute value when the panel was closed successfully. In this case the keyword this inside the function refers to the ID.
         *      - panel - the panel only when the panel was not closed successfully. In this case the keyword this inside the function refers to the panel.
         *
         * @returns {string|false} - RThe panel's ID attribute value when the panel was removed successfully, otherwise false.
         * @link https://jspanel.de/#methods/close
         */
        close(callback?: (id: string) => any | boolean): (string | false);

        /**
         * Closes child panels of a parent panel. Child panels are those that are part of the content of the parent panel.
         *
         * @param {Function} [callback] - Optional callback function to execute after the closeChildpanels method is called.
         *   - `panel`: The parent panel on which the method is called. Inside the callback, the keyword `this` also refers to this panel.
         * @returns {void} - The method returns the parent panel on which it was called.
         *
         * @example
         * var panel = jsPanel.create({contentSize: '600 400'});
         * jsPanel.create({container: panel.content, theme: 'success'});
         * jsPanel.create({container: panel.content, theme: 'primary', position: 'center 40 40'});
         *
         * window.setTimeout(() => {
         *     panel.closeChildpanels();
         * }, 2000);
         */
        closeChildpanels(callback ?: JsPanelCallback): JsPanel;

        /**
         * Removes all content from the content section of the panel on which this method is called.
         *
         * @param {Function} [callback] - Optional callback function to execute after the contentRemove method is called.
         *   - `panel`: The panel on which the method is called. Inside the callback, the keyword `this` also refers to this panel.
         * @returns {void} - The method returns the panel on which it was called.
         *
         * @example
         * var panel = jsPanel.create({
         *     content: '<p class="p-1">Text content ...</p><p class="px-1"> Some more text content ...</p>'
         * });
         *
         * window.setTimeout(() => {
         *     panel.contentRemove(function () {
         *         this.setTheme('info');
         *     });
         * }, 2000);
         */
        contentRemove(callback ?: JsPanelCallback): JsPanel;

        /**
         * Disables or enables the dragit interaction of an existing panel.
         *
         * @param {string} action - The action to perform on the dragit interaction. Supported values:
         *   - 'enable': Enables the dragit interaction of the panel.
         *   - 'disable': Disables the dragit interaction of the panel.
         * @returns {void} - The method returns the panel on which it was called.
         *
         * @example
         * // Create a panel
         * jsPanel.create({
         *     id: 'dragit-panel',
         *     footerToolbar: "footer text ...",
         *     theme: '#38a169'
         * });
         *
         * // Disable the dragit interaction
         * document.querySelector('#dragit-panel')
         *         .dragit('disable')
         *         .setTheme('#dd6b20');
         *
         * // Enable the dragit interaction
         * document.querySelector('#dragit-panel')
         *         .dragit('enable')
         *         .setTheme('#38a169');
         */
        dragit(action: string): JsPanel;


        /**
         * Moves the panel to the foreground by assigning the highest z-index relative to all other panels in the document.
         *
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the front method is called.
         *   The function receives the panel (on which the method is called) as an argument.
         *   Inside the callback, the keyword `this` refers to the panel.
         * @returns {void} - The method returns the panel on which it was called.
         *
         * @example
         * var panel  = jsPanel.create({theme: 'purple'});
         * jsPanel.create({position: 'center 50 50'});
         *
         * window.setTimeout(() => {
         *     panel.front(panel => panel.setTheme('purple filleddark'));
         * }, 2000);
         *
         * @note
         * A panel also comes to the front when clicked. However, this might not work when clicking content within an <iframe>
         * in the panel, as the click occurs in a different browsing context. Refer to the <a href="https://jspanel.de/#faq/iframe">FAQ on iframes</a> for a solution
         * involving a <a href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel">Broadcast Channel</a>.
         */
        front(callback ?: JsPanelCallback): JsPanel;

        /**
         * Retrieves all child panels of a parent panel and optionally executes a callback for each child panel.
         *
         * @param {function} callback - Function to execute once for each panel in the returned NodeList.
         *   - `panel`: The panel currently being processed.
         *   - `index`: The index in the NodeList of the currently processed panel.
         *   - `list`: The NodeList containing all child panels.
         *   - Inside the callback, the keyword `this` refers to the panel currently being processed.
         * @returns {NodeList<Element>} A NodeList containing all child panels of the panel on which this method was called.
         *
         * @example
         * var panel = jsPanel.create({contentSize: '600 400'});
         * jsPanel.create({
         *     container: panel.content,
         *     theme: 'success',
         *     position: 'left-top 5 5'
         * });
         * jsPanel.create({
         *     container: panel.content,
         *     theme: 'primary',
         *     position: 'left-top 50 50'
         * });
         *
         * console.log(panel.getChildpanels((panel, index, list) => {
         *     console.log(panel, index, list.length);
         * }));
         */
        getChildpanels(callback ?: (panel: JsPanel, index: number, list: NodeList) => void): NodeList;

        /**
         * Determines if the panel on which this method is called is a child panel, and optionally executes a callback.
         *
         * @param {function} [callback] - Optional callback function to execute after the isChildpanel method is called.
         *   - `panel`: The panel on which the method is called.
         *   - `parentPanel`: The corresponding parent panel if the panel is a child panel; otherwise, null.
         *   - Inside the callback, the keyword `this` refers to the panel on which the method is called.
         * @returns {(boolean|JsPanel)} Returns the corresponding parent panel if the panel is a child panel; otherwise, returns false.
         *
         * @example
         * var panel = jsPanel.create({contentSize: '600 400'});
         * var child = jsPanel.create({
         *     container: panel.content,
         *     theme: 'success'
         * });
         *
         * console.log(panel.isChildpanel()); // returns false
         * console.log(child.isChildpanel()); // returns the parent panel
         */
        isChildpanel(callback ?: (panel: JsPanel, parentPanel: JsPanel) => void): (boolean | JsPanel);

        /**
         * Maximizes the panel the method is called on. The panel is maximized within the browser viewport if its
         * 'container' option is set to 'window' (default), or within its parent element in all other cases.
         *
         * @param {function} [callback] - Optional callback function to execute after the maximize method is called.
         *   - `panel`: The panel on which the method is called.
         *   - `status`: The panel's status before it's maximized (e.g., 'normalized', 'minimized').
         *   - Inside the callback, the keyword `this` refers to the panel on which the method is called.
         * @returns {void} - The method returns the panel on which it was called.
         *
         * @example
         * jsPanel.create().maximize((panel, status) => {
         *     console.log(panel, status);
         * });
         */
        maximize(callback ?: (panel: JsPanel, status: string) => void): JsPanel;


        /**
         * Minimizes the panel to the bottom left corner of the viewport.
         *
         * @param {function} [callback] - Optional callback function to execute after the minimize method is called.
         *   - `panel`: The panel on which the method is called.
         *   - `status`: The panel's status before it's minimized (e.g., 'normalized', 'maximized').
         *   - Inside the callback, the keyword `this` refers to the panel on which the method is called.
         * @returns {void} - The method returns the panel on which it was called.
         *
         * @example
         * jsPanel.create().minimize((panel, status) => {
         *     console.log(panel, status);
         * });
         */
        minimize(callback ?: (panel: JsPanel, status: string) => void): JsPanel;


        /**
         * Normalizes the panel to its position and size before it was maximized, minimized, or smallified.
         *
         * @param {function} [callback] - Optional callback function to execute after the normalize method is called.
         *   - `panel`: The panel on which the method is called.
         *   - `status`: The panel's status before it's normalized (e.g., 'minimized', 'maximized').
         *   - Inside the callback, the keyword `this` refers to the panel on which the method is called.
         * @returns {void} - The method returns the panel on which it was called.
         *
         * @example
         * let panel = jsPanel.create({
         *     setStatus: 'maximized'
         * });
         *
         * window.setTimeout(() => {
         *     panel.normalize();
         * }, 2000);
         */
        normalize(callback ?: (panel: JsPanel, status: string) => void): JsPanel;


        /**
         * Checks the position of a panel relative to a reference element and returns an `Overlap` object.
         *
         * @param {('window'|'parent'|string)} reference - The element against which the panel is measured. Supported values:
         *   - 'window': Data is relative to the browser viewport.
         *   - 'parent': Data is relative to the panel's parent element.
         *   - Selector string: Data is relative to the specified element.
         * @param {('paddingbox'|string)} [elmtBox] - Determines if the panel's position is measured against the padding box or content box of the reference.
         *   - 'paddingbox': Overlaps are measured against the padding box of the reference. Other values measure against the border box.
         * @param {Event} [event] - Optional event object, if overlaps() is called within an event handler.
         * @returns {Overlap} An object containing overlap information and various measurements.
         *
         * @property {number} clientX - clientX as returned by the event object.
         * @property {number} clientY - clientY as returned by the event object.
         * @property {number} left - Horizontal distance from left parent (window or container) boundary to pointer.
         * @property {number} top - Vertical distance from top parent (window or container) boundary to pointer.
         * @property {number} right - Horizontal distance from right parent (window or container) boundary to pointer.
         * @property {number} bottom - Vertical distance from bottom parent (window or container) boundary to pointer.
         *
         * @property {boolean} overlaps - True if any part of the panel overlaps the reference.
         * @property {number} top - Distance between top of panel and top of reference.
         * @property {number} right - Distance between right of panel and right of reference.
         * @property {number} bottom - Distance between bottom of panel and bottom of reference.
         * @property {number} left - Distance between left of panel and left of reference.
         * @property {DOMRect} parentBorderWidth - Border-width values of the parent element if 'paddingbox' is used.
         * @property {DOMRect} referenceRect - Object returned by reference.getBoundingClientRect().
         * @property {DOMRect} panelRect - Object returned by panel.getBoundingClientRect().
         * @property {Pointer} pointer - Pointer information, updated only if an event object is passed.
         *
         * @example
         * jsPanel.create({
         *     headerTitle: 'overlaps() results',
         *     container: '#testcontainer',
         *     contentSize: '540 280',
         *     content: '<p>Start dragging the panel to see results</p>',
         *     theme: 'primary filledlight',
         *     dragit: {
         *         drag: function(panel, pos, event) {
         *             // the call of overlaps() while the panel is dragged
         *             var overlaps = this.overlaps('#testcontainer', 'paddingbox', event);
         *             // code to show results in panel
         *             this.content.innerHTML = `<pre style="padding:10px;"><code class="language-javascript">overlaps: ${overlaps.overlaps},
         *                 top:    ${Math.round(overlaps.top)},
         *                 right:  ${Math.round(overlaps.right)},
         *                 bottom: ${Math.round(overlaps.bottom)},
         *                 left:   ${Math.round(overlaps.left)},
         *                 parentBorderWidth: {top:${overlaps.parentBorderWidth.top}, right:${overlaps.parentBorderWidth.right}, bottom:${overlaps.parentBorderWidth.bottom}, left:${overlaps.parentBorderWidth.left}},
         *                 referenceRect: {left:${Math.round(overlaps.referenceRect.left)}, top:${Math.round(overlaps.referenceRect.top)}, width:${Math.round(overlaps.referenceRect.width)}, height:${Math.round(overlaps.referenceRect.height)}, ...},
         *                 panelRect: {left:${Math.round(overlaps.panelRect.left)}, top:${Math.round(overlaps.panelRect.top)}, width:${Math.round(overlaps.panelRect.width)}, height:${Math.round(overlaps.panelRect.height)}, ...},
         *                 pointer: {clientX:${overlaps.pointer.clientX}, clientY:${overlaps.pointer.clientY}, left:${Math.round(overlaps.pointer.left)}, top:${Math.round(overlaps.pointer.top)}, right:${Math.round(overlaps.pointer.right)}, bottom:${Math.round(overlaps.pointer.bottom)}}
         *                 </code></pre>`;
         *             Prism.highlightAll();
         *         },
         *         opacity: 1
         *     }
         * });
         */
        overlaps(reference: ('window' | 'parent' | string), elmtBox ?: ('paddingbox' | string), event ?: any): Overlap;

        /**
         * Repositions an already existing panel.
         *
         * @param {Position|boolean|string} [position] - The new position for the panel. This can be a `Position` object, a boolean, or a string.
         *   Defaults to the panel's current position setting.
         *   - When `false`, positioning is turned off and must be handled manually.
         *   - String values offer shorthand options, internally converted to an object.
         *   - Object provides detailed positioning options as defined in the `Position` interface.
         * @param {boolean} [updateCache=true] - Whether to update the cached panel position values.
         *   These values are used to restore panel position after it has been maximized or minimized.
         * @param {JsPanelCallback} [callback] - Callback function executed after the panel is repositioned.
         *   The function receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {void} - Returns the panel on which the method was called.
         *
         * @example
         * let panel = jsPanel.create();
         * window.setTimeout(function () {
         *     panel.reposition({
         *         my: 'left-top',
         *         at: 'left-bottom',
         *         of: 'header',
         *         offsetX: 5,
         *         offsetY: 5
         *     });
         * }, 1000);
         *
         * @see https://jspanel.de/#methods/reposition
         * @see https://jspanel.de/#options/position
         */
        reposition(position ?: Position | boolean | string, updateCache?: boolean, callback ?: JsPanelCallback): JsPanel;

        /**
         * Resizes an already existing panel.
         *
         * @param {ContentSize} [size] - The new size for the panel. It can be a `ContentSize` object or a string.
         *   Defaults to the panel's current content size setting.
         *   - Object notation: Should have 'width' and/or 'height' properties. Each property can be a number (pixels), a string with any CSS length unit, or a function returning a number or string. If only one property is provided, the other retains its current value.
         *   - String notation: Should contain two values separated by a space (first for width, second for height). A single value is used for both width and height. Unit-less values are assumed to be in pixels.
         * @param {boolean} [updateCache=true] - Whether to update the cached panel size values. These values are used to restore panel size after it has been maximized or minimized. Setting to false prevents the cached panel size from being updated for this resize operation.
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the panel is resized. The function receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {void} - Returns the panel on which the method was called.
         *
         * @example
         * let panel = jsPanel.create();
         * window.setTimeout(() => {
         *     panel.resize({
         *         width: window.innerWidth / 2,
         *         height: 300
         *     }).reposition(); // Reposition panel to maintain centered position
         * }, 1000);
         *
         * Note:
         * - All arguments are optional and their sequence does not matter.
         * - If you want to change only one value (either width or height), use an object with only the value you want to change.
         */
        resize(size ?: ContentSize, updateCache ?: boolean, callback ?: JsPanelCallback): JsPanel

        /**
         * Disables or enables the resizeit interaction of an existing panel.
         *
         * @param {string} action - The action to perform on the resizeit interaction.
         *   Supported values:
         *   - 'enable': Enables the resizeit interaction of the panel.
         *   - 'disable': Disables the resizeit interaction of the panel.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * // Create a panel
         * jsPanel.create({
         *     id: 'resizeit-panel',
         *     footerToolbar: "footer text ...",
         *     theme: '#38a169'
         * });
         *
         * // Disable the resizeit interaction
         * document.querySelector('#resizeit-panel')
         *         .resizeit('disable')
         *         .setTheme('#dd6b20');
         *
         * // Enable the resizeit interaction
         * document.querySelector('#resizeit-panel')
         *         .resizeit('enable')
         *         .setTheme('#38a169');
         */
        resizeit(action: string): JsPanel;


        /**
         * Applies a CSS border to an existing panel.
         *
         * @param {string} [border] - The CSS border value to apply. Supports any valid CSS border shorthand.
         *   - If border-style is omitted, it defaults to 'solid' instead of 'none'.
         *   - If border-color is omitted, it defaults to the primary theme color instead of 'currentcolor'.
         *     Allowed values for border-color include all color names usable as jsPanel themes.
         *   - If border-width is omitted, it defaults to 'medium' as standardized.
         *   - Starting from v4.16.0, all three values can be set using a CSS custom property/variable.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create({
         *   theme: 'primary'
         * }).setBorder('dashed orange');
         */
        setBorder(border?: string): JsPanel;

        /**
         * Applies a CSS border-radius to an existing panel.
         *
         * @param {string|number} [radius] - The border-radius value to apply.
         *   Can be a number (used as pixel value) or a string representing any valid CSS border-radius shorthand value.
         *   As of v4.16.0, the string can also be a CSS custom property/variable.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create({
         *   theme: 'primary filleddark'
         * }).setBorderRadius('.5rem');
         */
        setBorderRadius(radius ?: string | number): JsPanel;

        /**
         * Disables, enables, removes, hides, or shows a control from an existing panel.
         *
         * @param {string} control - A string to identify the control. Supported values are 'close', 'maximize', 'minimize', 'normalize', and 'smallify'.
         * @param {string} action - A string specifying the action to perform on the control.
         *   Supported actions are 'disable', 'enable', 'show', 'hide', and 'remove'.
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the control status is set.
         *   The function receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create()
         *   .setControlStatus('minimize', 'disable')
         *   .setControlStatus('smallify', 'remove');
         */
        setControlStatus(control: string, action: string, callback?: JsPanelCallback): JsPanel;

        /**
         * Adds a logo to the top left corner (left of the title) of an existing panel.
         *
         * @param {string | Node} logo - The logo to add.
         *   - If a string does not start with '<', it is assumed to be a URL pointing to an image resource.
         *   - Strings starting with '<' are inserted using Element.innerHTML.
         *   - A Node object is inserted using ParentElement.append().
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the logo is set.
         *   The function receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create().setHeaderLogo('img/flyer53.jpg');
         *
         * @example
         * jsPanel.create({position: 'center 50 50'}).setHeaderLogo('<i class="fad fa-spinner fa-spin"></i>', (panel) => {
         *   panel.headerlogo.querySelector('.fa-spinner').style.marginLeft = '8px';
         * });
         */
        setHeaderLogo(logo: string | Node, callback ?: JsPanelCallback): JsPanel;

        /**
         * Replaces the header title of an existing panel.
         *
         * @param {string | Node | (() => string | Node)} title - The new title for the panel.
         *   - If a string, it is inserted as title using Element.innerHTML.
         *   - If a Node, it is inserted using ParentElement.append().
         *   - If a function, its return value is inserted as title (using Element.innerHTML if it's a string or ParentElement.append() if it's a Node).
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the title is set.
         *   The function receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create().setHeaderTitle('a new title ...');
         *
         * @example
         * jsPanel.create({position: 'center 50 50'}).setHeaderTitle(() => {
         *   return 'Panel No. ' + jsPanel.getPanels().length;
         * });
         */
        setHeaderTitle(title: string | Node | (() => string | Node), callback ?: JsPanelCallback): JsPanel;

        /**
         * Sets the theme of an existing panel. The theme determines the panel's appearance including colors, background, and border.
         *
         * @param {Theme} theme - The theme to apply. Can be a string, an object, or a CSS custom property/variable.
         *   - String: Can be a built-in theme (e.g., 'primary', 'success'), Bootstrap theme ('bootstrap-primary'), Material Design for Bootstrap theme ('mdb-primary'), HEX/RGB/HSL color values, CSS color names, and Material Design Color System names. Modifiers like 'filled', 'filledlight', 'filleddark', or 'fillcolor' can be added.
         *   - Object: Allows detailed customization including 'bgPanel', 'bgContent', 'colorHeader', 'colorContent', 'border', and 'borderRadius'. Accepts CSS values, including images and gradients.
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the theme is set. Receives the panel as an argument.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * Theme usage:
         * - 'default', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark', 'none'
         * - Bootstrap themes with prefix, e.g., 'bootstrap-primary'
         * - Material Design for Bootstrap with prefix, e.g., 'mdb-primary'
         * - HEX, RGB, HSL color values and standardized color names
         * - CSS custom properties/variables for colors (as of v4.16.0)
         * - Object notation allows using images or CSS gradients as backgrounds and customizing font colors.
         *
         * @example
         * jsPanel.create().setTheme('primary');
         *
         * @example
         * jsPanel.create().setTheme({
         *     bgPanel: 'linear-gradient(120deg,#155799,#159957)',
         *     bgContent: 'rgba(255, 255, 255, 0.15)',
         *     colorHeader: '#fff',
         *     colorContent: '#fff',
         *     border: 'medium solid #157B75'
         * });
         *
         * Note: 'bgFooter', 'colorFooter', and 'borderRadius' are new properties as of v4.16.0. All values, including those for new properties, may be set using CSS custom properties/variables.
         *
         * @see https://jspanel.de/#options/theme
         * @see https://jspanel.de/#methods/setTheme
         */
        setTheme(theme: Theme, callback ?: JsPanelCallback): JsPanel;

        /**
         * Minimizes the panel to its header, showing only the header bar.
         *
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the panel is smallified.
         *   The function receives the panel as an argument, and `this` inside the function refers to the panel.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create().smallify();
         *
         * @example
         * jsPanel.create().smallify((panel) => {
         *   console.log('Panel is smallified:', panel);
         * });
         */
        smallify(callback ?: JsPanelCallback): JsPanel;

        /**
         * Unsmallifies the panel the method is called on, restoring it to its previous size before being smallified.
         *
         * @param {JsPanelCallback} [callback] - Optional callback function to execute after the panel is unsmallified.
         *   - `panel`: The panel on which the method is called.
         *   - `status`: The panel's status before it's unsmallified (e.g., 'smallified', 'smallifiedmax').
         *   - Inside the callback, the keyword `this` refers to the panel on which the method is called.
         * @returns {JsPanel} - Returns the panel on which the method was called.
         *
         * @example
         * jsPanel.create().smallify((panel) => {
         *     window.setTimeout(() => {
         *         panel.unsmallify();
         *     }, 1500);
         * });
         */
        unsmallify(callback ?: JsPanelCallback): JsPanel;


        //----------------------- Properties Section -----------------------//
        /**
         * Returns the <div class="jsPanel-content"> element containing the panel content.
         *
         * @returns {HTMLDivElement} - The HTMLDivElement that represents the content area of the panel.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>',
         *     footerToolbar: 'footer toolbar ..'
         * }).content.style.border = '2px solid red';
         */
        readonly  content?: HTMLDivElement;

        /**
         * Returns the <div class="jsPanel-controlbar"> element containing the panel controls.
         *
         * @returns {HTMLDivElement} - The HTMLDivElement that represents the control bar area of the panel.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).controlbar.style.border = '2px solid red';
         */
        readonly controlbar?: HTMLDivElement;
        /**
         * Returns the element the panel can be dropped into when using the dragit.drop feature, or `false` if no such element is intersected.
         *
         * @returns {HTMLElement|boolean} - The HTMLElement representing the drop zone if the dragit.drop feature is enabled and
         *                                  the pointing device intersects one of the drop zones. Otherwise, returns `false`.
         *
         * @example
         * jsPanel.create({
         *     container: '#two',
         *     setStatus: 'maximized',
         *     dragit: {
         *         drop: {
         *             dropZones: ['.drop-target'],
         *             callback: function(panel, target, source) {
         *                 this.content.innerHTML = '<p>#' + target.id + '</p>';
         *                 this.maximize();
         *                 console.log(target, source);
         *             }
         *         },
         *         drag: function() {
         *             this.content.innerHTML = '<p>#' + this.droppableTo.id + '</p>';
         *         },
         *         disableOnMaximized: false
         *     },
         *     theme: 'info filledlight'
         * });
         *
         * Note: For a detailed explanation of the drop feature, refer to the documentation on the 'dragit' option.
         */
        readonly droppableTo?: HTMLElement | boolean;

        /**
         * Returns the <div class="jsPanel-footer"> element containing the footer toolbar items.
         *
         * @returns {HTMLDivElement} - The HTMLDivElement that represents the footer area of the panel.
         *
         * @example
         * jsPanel.create({
         *     footerToolbar: '<span>footer toolbar ...</span>'
         * }).footer.style.border = '2px solid red';
         */
        readonly footer?: HTMLDivElement;
        /**
         * Returns the <div class="jsPanel-footer"> element containing the footer toolbar items.
         * @returns {HTMLElement} The footer element.
         *
         * @example
         * jsPanel.create({
         *     footerToolbar: '<span>footer toolbar ...</span>'
         * }).footer.style.border = '2px solid red';
         */
        readonly footerToolbar?: HTMLElement;
        /**
         * Returns the <div class="jsPanel-hdr"> element containing the complete header section including headerbar (logo, title, and controls) and header toolbar.
         * Header includes headerbar / header toolbar
         * @returns {HTMLElement} The header element.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).header.style.border = '2px solid red';
         */
        readonly header?: HTMLElement;

        /**
         * Returns the <div class="jsPanel-headerbar"> element containing logo, title, and controls (excluding the header toolbar).
         * Included in header - the top line containing all the controls and title
         * @returns {HTMLElement} The headerbar element.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).headerbar.style.border = '2px solid red';
         */
        readonly headerbar?: HTMLElement;
        /**
         * Returns the <div class="jsPanel-headerlogo"> element containing the logo.
         * @returns {HTMLElement} The headerlogo element.
         *
         * @example
         * jsPanel.create({
         *     headerLogo: "<span class='fad fa-spinner fa-spin'></span>",
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).headerlogo.style.border = '2px solid red';
         */
        readonly headerlogo?: HTMLElement;

        /**
         * Returns the <span class="jsPanel-title"> element containing the title text.
         * @returns {HTMLElement} The headertitle element.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).headertitle.style.border = '2px solid red';
         */
        readonly headertitle?: HTMLElement;

        /**
         * Returns the <div class="jsPanel-hdr-toolbar"> element containing the header toolbar items.
         * @returns {HTMLElement} The headertoolbar element.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).headertoolbar.style.border = '2px solid red';
         */
        readonly headertoolbar?: HTMLElement;

        /**
         * Returns the configuration object of a panel after merging panel defaults with the configuration passed to jsPanel.create().
         *
         * @example
         * jsPanel.create({
         *     content: "<pre class='text-sm'></pre>",
         *     contentSize: {width: 680, height: 500},
         *     contentOverflow: 'hidden scroll',
         *     theme: 'dark',
         *     border: 'medium',
         *     callback: (panel) => {
         *         var jsonViewer = new JSONViewer();
         *         panel.content.querySelector('pre').appendChild(jsonViewer.getContainer());
         *         jsonViewer.showJSON(panel.options);
         *     }
         * });
         */
        readonly options?: JsPanelOptions;

        /**
         * Returns the <div class="jsPanel-progressbar"> element used by the autoclose option.
         * @returns {HTMLElement} The progressbar element.
         *
         * &nbsp;<br>
         * The progressbar is internally used by option autoclose and gives a visual indication of the time remaining until a panel closes.<br>
         * &nbsp;<br>
         * However, you can make use of the built-in progressbar in other situations as described below.<br>
         * &nbsp;<br>
         * The markup of the progressbar is always there, regardless of whether you use option autoclose or not. So using the progressbar is a simple 3-step process:
         *
         * 1. show the progressbar by adding the class active
         * 2. set a background color for the progressbar
         * 3. set width of the slider hiding a part of the progressbar
         *
         * @note For compatibility, the property name autocloseProgressbar remains usable for now but will be removed in the future.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).progressbar.style.border = '1px solid red';
         *
         * @example
         * jsPanel.create({
         *     callback: panel => {
         *         panel.progressbar.classList.add('active');
         *         panel.progressbar.style.background = 'crimson';
         *         panel.progressbar.querySelector('.jsPanel-progressbar-slider').style.width = '40%';
         *     }
         * });
         */
        readonly progressbar?: HTMLElement;

        /**
         * Returns a position like 'left-top' that the panel can snap to if:
         * - the dragit.snap feature is enabled
         * - the panel intersects one of the snapsensitive areas
         * Otherwise, it returns false.
         *
         * @info For a detailed explanation of the snap feature, please refer to the option dragit docs.
         *
         * @returns {(string|boolean)} The snap position or false.
         *
         * @example
         * jsPanel.create({
         *     dragit: {
         *         snap: true,
         *         drag: function() {
         *             this.content.innerHTML = `<p>panel.snappableTo is: ${this.snappableTo}</p>`;
         *         },
         *         stop: function() {
         *             this.content.innerHTML = `<p>panel.snapped is: ${this.snapped}</p>`;
         *         }
         *     }
         * });
         */
        readonly snappableTo?: string | boolean;

        /**
         * Returns the position like 'left-top' that the panel has snapped to if:
         * - the dragit.snap feature is enabled
         * - the panel is currently snapped
         * Otherwise, it returns false.
         *
         * @info For a detailed explanation of the snap feature, please refer to the option dragit docs.
         *
         * @returns {(string|boolean)} The snapped position or false.
         *
         * @example
         * jsPanel.create({
         *     dragit: {
         *         snap: true,
         *         drag: function() {
         *             this.content.innerHTML = `<p>panel.snapped is: ${this.snapped}</p>`;
         *         },
         *         stop: function() {
         *             this.content.innerHTML = `<p>panel.snapped is: ${this.snapped}</p>`;
         *         }
         *     }
         * });
         */
        readonly snapped?: string | boolean;

        /**
         * Returns a string with the current status of a panel, which can be one of:
         * - "normalized"
         * - "maximized"
         * - "minimized"
         * - "smallified"
         * - "smallifiedmax"
         * - "closed" (see notes below)
         *
         * @note Since a panel is removed from the DOM when closed, the "closed" status can only be queried if you saved a reference to the panel.
         * @note The jspanelstatuschange event is not fired when a panel is closed.
         *
         * @returns {string} The current status of the panel.
         *
         * @example
         * jsPanel.create({
         *   onstatuschange: function() {
         *     this.setHeaderTitle(this.status);
         *   }
         * });
         */
        readonly status?: string;

        /**
         * Returns the <div class="jsPanel-titlebar"> element containing the <span> element with the title text.
         * @returns {HTMLElement} The titlebar element.
         *
         * @example
         * jsPanel.create({
         *     headerToolbar: '<span>header toolbar ...</span>'
         * }).titlebar.style.border = '2px solid red';
         */
        readonly titlebar?: HTMLElement;

    } // interface JsPanel

    /**
     * Represents the configuration object for adding a control to an already existing panel within its controlbar (header bar).
     * @example
     * jsPanel.create().addControl({
     *     html: '<span class="fad fa-bars"></span>',
     *     name: 'menu',
     *     ariaLabel: 'panel menu',
     *     handler: (panel, control) => {
     *         panel.content.innerHTML = '<p>You clicked the "menu" control</p>';
     *     },
     *     position: 6,
     *     afterInsert: (control) => {
     *         control.style.background = '#fff';
     *     }
     * });
     */
    interface AddPanel {
        /**
         * HTML string with the markup of the control. This HTML is wrapped in additional HTML needed for all controls.
         * Required. Example: `<span class="fad fa-bars"></span>` or `<i class="material-icons">clear</i>`.
         */
        html?: string;

        /**
         * Optional name for the control. Used as a class name for the button element wrapping the HTML.
         * It also serves as an identifier for `setControlStatus()` and sets the `aria-label` attribute,
         * if `ariaLabel` is not provided.
         */
        name?: string;

        /**
         * Optional `aria-label` attribute value for the control. Defaults to the value of `name`, if set.
         * If not provided, no `aria-label` attribute is added.
         */
        ariaLabel?: string;

        /**
         * Function to setup a handler for the control. Receives the panel and the control as arguments.
         * `this` inside the function refers to the panel.
         */
        handler?: (panel ?: JsPanel, control ?: any) => void;

        /**
         * Optional position of the control within the controlbar. The number corresponds to the control's
         * source order: 1 for first from left, 6 for last on the right, etc. Defaults to 1.
         */
        position?: number;

        /**
         * Function to call after the control is added. Receives the control as an argument.
         * `this` inside the function refers to the control.
         */
        afterInsert?: (control?: any) => void;

    } // interface AddPanel

    /**
     * Represents the configuration object for adding a toolbar to a panel (required).
     *
     *  @param {string} location - Sets where in the panel to add the toolbar. Supported values are:
     *    - 'header': Adds the toolbar to the header section.
     *    - 'footer': Adds the toolbar to the footer.
     *  @param {string|Node|string[]|Node[]|function} toolbar - The content of the toolbar. Supported types:
     *    - String: A string value is directly used as the toolbar content.
     *    - Node: A Node is directly used as the toolbar content.
     *    - Array: An array of Strings and/or Nodes, added to the toolbar sequentially.
     *    - Function: A function that returns a String, Node, or an array of these. The function receives
     *      the panel as an argument, and `this` inside the function refers to the panel. The return value is used as the toolbar content.
     *  @param {function} [callback] - Optional callback function to execute after the toolbar is inserted.
     *    The function receives the panel as an argument, and `this` inside the function refers to the panel.
     *  @returns {void}
     *   */
    type Type_AddToolbar = (
        location: string,
        toolbar: string | Node | string[] | Node[] | ((panel: JsPanel) => string | Node | string[] | Node[]),
        callback ?: JsPanelCallback
    ) => JsPanel;


    interface Pointer {
        /**
         * clientX as returned by the event object
         */
        clientX?: number;
        /**
         *  clientY as returned by the event object
         */
        clientY?: number;
        /**
         * horizontal distance from left parent (window or container) boundary to pointer
         */
        left?: number;

        /**
         * vertical distance from top parent (window or container) boundary to pointer
         */
        top?: number;
        /**
         * horizontal distance from right parent (window or container) boundary to pointer
         */
        right?: number;
        /**
         * vertical distance from bottom parent (window or container) boundary to pointer
         */
        bottom?: number;
    } // interface Pointer

    interface Overlap {
        /**
         * true as long as a part of the panel overlaps reference, otherwise false.
         */
        overlaps?: boolean;

        /**
         *  distance in pixels between top of panel and top of reference.
         */
        top?: number;

        /**
         *  distance in pixels between right of panel and right of reference.
         */
        right?: number;

        /**
         * distance in pixels between bottom of panel and bottom of reference.
         */
        bottom?: number;

        /**
         *   distance in pixels between left of panel and left of reference.
         */
        left?: number;

        /**
         *  - border-width values of the panel's parent element if elmtBox is 'paddingbox'.
         */
        parentBorderWidth?: DOMRect;

        /**
         * the object returned by reference.getBoundingClientRect().
         */
        referenceRect?: DOMRect;

        /**
         * the object returned by panel.getBoundingClientRect().
         */
        panelRect?: DOMRect;

        /**
         * Represents the pointer information, typically used in the context of an event.
         * This object is populated only if an event object is passed to the overlaps() function.
         *
         * @property {number} clientX - The clientX value as returned by the event object.
         * @property {number} clientY - The clientY value as returned by the event object.
         * @property {number} left - The horizontal distance from the left boundary (of the window or container) to the pointer.
         * @property {number} top - The vertical distance from the top boundary (of the window or container) to the pointer.
         * @property {number} right - The horizontal distance from the right boundary (of the window or container) to the pointer.
         * @property {number} bottom - The vertical distance from the bottom boundary (of the window or container) to the pointer.
         *
         */
        pointer?: Pointer;

    } // interface Overlap


    type MyPositionType =
        'center'
        | 'left-top'
        | 'center-top'
        | 'right-top'
        | 'right-center'
        | 'right-bottom'
        | 'center-bottom'
        | 'left-bottom'
        | 'left-center';
    type AtPositionType =
        'center'
        | 'left-top'
        | 'center-top'
        | 'right-top'
        | 'right-center'
        | 'right-bottom'
        | 'center-bottom'
        | 'left-bottom'
        | 'left-center';


    interface Position {

        /**
         * The point of the panel that is positioned against some other element.
         *
         * Supported string values:
         *          'center'
         *          'left-top'
         *          'center-top'
         *          'right-top'
         *          'right-center'
         *          'right-bottom'
         *          'center-bottom'
         *          'left-bottom'
         *          'left-center'
         *
         * Function
         *          A function has to return one of the supported string values named above.
         *          The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         *
         * Default: 'center'
         */
        my?: MyPositionType | ((panel: JsPanel) => string);

        /**
         * The point of the element the panel is positioned against.
         *
         * Supported string values:
         *          'center'
         *          'left-top'
         *          'center-top'
         *          'right-top'
         *          'right-center'
         *          'right-bottom'
         *          'center-bottom'
         *          'left-bottom'
         *          'left-center'
         *
         * Function
         *          A function has to return one of the supported string values named above.
         *          The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         *
         * Default: 'center'
         */
        at?: AtPositionType | ((panel: JsPanel) => string);

        /**
         * The element the panel is positioned against.
         *
         * Supported string values:
         *       Any selector string that can be passed to Element.querySelector()
         *
         * Node
         *       Any node element suitable to position a panel against.
         *
         * Function
         *       Any function returning either a selector string or an node element.
         *       The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         *
         * Default values:
         *
         *          Option position of defaults to the setting of option container.
         *          That means a panel using container: 'window' (which is the default for option container) positions the panel fixed
         *          against the browser viewport. Any other option container setting causes the panel to be positioned against
         *          the element specified in option container.
         */
        of?: 'window' | string | Node | ((panel: JsPanel) => string | Node);

        /**
         * This parameter can be used to automatically arrange a number of panels either horizontally or vertically.
         *
         * Supported string values:
         *
         * - 'down' : for panels positioned using either 'left-top', 'center-top' or 'right-top' for both my: and at: setting autoposition to 'down' will automatically add a vertical offset downwards to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         * - 'up' : for panels positioned using either 'left-bottom', 'center-bottom' or 'right-bottom' for both my: and at: setting autoposition to 'up' will automatically add a vertical offset upwards to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         * - 'right' :  for panels positioned using either 'left-top' or 'left-bottom' for both my: and at: setting autoposition to 'right' will automatically add a horizontal right offset to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         * - 'left' : for panels positioned using either 'right-top' or 'right-bottom' for both my: and at: setting autoposition to 'left' will automatically add a horizontal left offset to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         *
         * autoposition notes:
         *
         * 1. Basically nothing prevents you from using one of the autoposition values for any panel having the same value for my: and at:. But it simply might not make any sense if you use autoposition: 'down' for panels positioned 'left-bottom' for example.
         *
         * 2. The default spacing between autopositioned panels is '4px' and set in global jsPanel.autopositionSpacing.
         *
         * 3. offsetX/offsetY: If you apply either one of the offsets to a number of panels using autoposition the offset refers to the complete stack of panels.
         *
         * 4. Each autopositioned panel gets an additional class name composed of the basic position (e.g. left-top) and the autoposition direction concatenated with a hyphen. So all panels that are positioned left-top and autopositioned downwards have the class left-top-down for example.
         *
         * 5. Autopositioned panels reposition automatically if one panel of the same stack is closed. But only if panels are autopositioned
         *          - left-top down/right
         *          - center-top down
         *          - right-top down/left
         *          - right-bottom up/left
         *          - center-bottom up
         *          - left-bottom up/right
         *
         *Accepted values are 'down', 'up', 'right', and 'left'.
         */
        autoposition?: 'down' | 'up' | 'right' | 'left';

        /**
         * A horizontal offset to apply to the panel position.<br>
         * &nbsp;<br>
         * Number
         * - A number value is used as offset in pixels.
         *
         * CSS length value
         *  - Any valid CSS length value is directly used as offset.
         *
         * Function(pos, position)
         *       - A function returning either a number or a valid CSS length value.
         *       - Arguments:
         *          - pos object with the keys left and top with the calculated CSS left/top values before the offset is applied
         *          - position option position as object
         */
        offsetX?: number | string | ((pos: PositionProperties, position: Position) => number | string);

        /**
         * A vertical offset to apply to the panel position.<br>
         * &nbsp;<br>
         * Number
         * - A number value is used as offset in pixels.
         *
         * CSS length value
         *  - Any valid CSS length value is directly used as offset.
         *
         * Function(pos, position)
         *       - A function returning either a number or a valid CSS length value.
         *       - Arguments:
         *          - pos object with the keys left and top with the calculated CSS left/top values before the offset is applied
         *          - position option position as object
         */
        offsetY?: number | string | ((pos: PositionProperties, position: Position) => number | string);

        /**
         * The minimum CSS left the panel has to maintain.<br>
         * &nbsp;<br>
         * Number
         * - A number value is used as offset in pixels.
         *
         * CSS length value
         *  - Any valid CSS length value is directly used as offset.
         *
         * Function(pos, position)
         *       - A function returning either a number or a valid CSS length value.
         *       - Arguments:
         *          - pos object with the keys left and top with the calculated CSS left/top values before the offset is applied
         *          - position option position as object
         */
        minLeft?: number | string | ((pos: PositionProperties, position: Position) => number | string);

        /**
         * The maximum CSS left the panel has to maintain.<br>
         * &nbsp;<br>
         * Number
         * - A number value is used as offset in pixels.
         *
         * CSS length value
         *  - Any valid CSS length value is directly used as offset.
         *
         * Function(pos, position)
         *       - A function returning either a number or a valid CSS length value.
         *       - Arguments:
         *          - pos object with the keys left and top with the calculated CSS left/top values before the offset is applied
         *          - position option position as object
         */
        maxLeft?: number | string | ((pos: PositionProperties, position: Position) => number | string);

        /**
         * The maximum CSS top the panel has to maintain.<br>
         * &nbsp;<br>
         * Number
         * - A number value is used as offset in pixels.
         *
         * CSS length value
         *  - Any valid CSS length value is directly used as offset.
         *
         * Function(pos, position)
         *       - A function returning either a number or a valid CSS length value.
         *       - Arguments:
         *          - pos object with the keys left and top with the calculated CSS left/top values before the offset is applied
         *          - position option position as object
         */
        maxTop?: number | string | ((pos: PositionProperties, position: Position) => number | string);

        /**
         * The minimum CSS top the panel has to maintain.<br>
         * &nbsp;<br>
         * Number
         * - A number value is used as offset in pixels.
         *
         * CSS length value
         *  - Any valid CSS length value is directly used as offset.
         *
         * Function(pos, position)
         *       - A function returning either a number or a valid CSS length value.
         *       - Arguments:
         *          - pos object with the keys left and top with the calculated CSS left/top values before the offset is applied
         *          - position option position as object
         */
        minTop?: number | string | ((pos: PositionProperties, position: Position) => number | string);

        /**
         * Function to further modify the CSS left and top values calculated so far.<br>
         * &nbsp;<br>
         * This function can be used to further modify the CSS left and top values calculated so far.
         * &nbsp;<br>
         * Arguments:
         *      - pos object with the keys left and top with the calculated CSS left/top values that are calculated so far. Those values include the corrections possibly made by the parameters offsetX, offsetY, minLeft, maxLeft, maxTop and minTop.
         *      - position option position as object
         *
         * @return an object with keys 'left' and 'top', each set with a valid CSS length value.
         */
        modify?: (pos: PositionProperties, position: Position) => { left: string, top: string };
    } // interface Position

    interface PositionProperties {
        left?: number | string;
        top?: number | string;
    }

    /**
     * Sets the dimensions of the content section of the panel whereas option.panelSize sets the dimensions of the complete panel.
     *
     * ``` text
     *Info:  To resize an existing panel use the panel method resize()
     *```
     *
     * **Type:**
     *  - Object or String
     * *Default:*
     *  - {width: '99%', height: '99%'}
     * Supported values:
     *
     *  **Object**
     *  - a plain object should have the 2 properties width and height. Each property may have a Number, String or Function as value where:
     *  - a Number is assumed to be a pixel value.
     *  - a String may be unit-less or with one of the css length units.
     *  - a Function has to return a Number or String according to the rules above. The function receives the panel as argument and the keyword this inside the function also refers to the panel.
     *
     * If the object supplies only one property (width or height) the missing one is used with the same value as the one provided
     *
     * **String**
     *-  a string should contain 2 values separated by a single space. The first value for width and the second value for height.
     * - if only one value is set it's used for both width and height.
     * - values may have all css length units.
     * - a unit-less value is assumed to be in pixels.
     *
     * ``` text
     *  1. option panelSize overrides a setting of option contentSize.
     *  2. css calc() works in object only
     *  ```
     * Example
     *``` javascript
     * jsPanel.create({
     *     contentSize: '450 300'
     * });
     * jsPanel.create({
     *     contentSize: {
     *         width: () => window.innerWidth * 0.3,
     *         height: '30vh'
     *     },
     *     position: 'center 0 80'
     * });
     * ```
     */
    type ContentSize = string | IContentSize;

    interface IContentSize {
        width ?: number | string | ((panel: JsPanel) => number | string);
        height ?: number | string | ((panel: JsPanel) => number | string);
    }


    type Theme = string | IThemeAsObject;

    /**
     * Represents the theme settings for a panel. This interface allows for the customization of various
     * aspects of a panel's appearance using CSS properties.
     *
     * @interface IThemeAsObject
     * @since v4.16.0
     * @property {string} [bgPanel='#ffffff'] - Sets the panel's background. Can be any valid value
     * that can be applied to the CSS background shorthand property including images, gradients, and CSS
     * custom properties/variables.
     * @property {string} [bgContent='#ffffff'] - Sets the content section's background. Similar to `bgPanel`,
     * it accepts any valid CSS background property value.
     * @property {string} [bgFooter='#f5f5f5'] - Sets the footer section's background. Accepts any valid CSS
     * background property value. Introduced in v4.16.0.
     * @property {string} [colorHeader='#000000'] - Sets the font color for the header section. Can be any
     * valid value that can be applied to the CSS color property.
     * @property {string} [colorContent='#000000'] - Sets the font color for the content section, accepting
     * any valid CSS color value.
     * @property {string} [colorFooter='#000000'] - Sets the font color for the footer section. Accepts any
     * valid CSS color value. Introduced in v4.16.0.
     * @property {string} [border=undefined] - Sets the CSS border shorthand property. Must include
     * values for border-width, border-style, and border-color (e.g., '2px solid black'). Any value of
     * panel option `border` is ignored.
     * @property {string} [borderRadius=undefined] - Sets the CSS border-radius shorthand property.
     * Introduced in v4.16.0.
     *
     * @example
     * jsPanel.create({
     *     theme: {
     *         bgPanel: 'url("img/trianglify-warning.svg") right bottom no-repeat',
     *         bgContent: '#fff',
     *         colorHeader: '#fff',
     *         colorContent: `#${jsPanel.colorNames.gray700}`,
     *         border: 'thin solid #b24406',
     *         borderRadius: '.33rem'
     *     },
     *     headerToolbar: 'header toolbar ...',
     *     footerToolbar: 'footer toolbar ...',
     *     content: '<p>Lorem ipsum dolor sit amet ...</p>',
     *     contentSize: '400 170'
     * });
     */
    interface IThemeAsObject {
        bgPanel?: string;       // Sets the panel's background. Default: '#ffffff'
        bgContent?: string;     // Sets the content section's background. Default: '#ffffff'
        bgFooter?: string;      // Sets the footer section's background. Default: '#f5f5f5'
        colorHeader?: string;   // Sets the font color for the header section. Default: '#000000'
        colorContent?: string;  // Sets the font color for the content section. Default: '#000000'
        colorFooter?: string;   // Sets the font color for the footer section. Default: '#000000'
        border?: string;       // Sets the CSS border shorthand property. Default: undefined
        borderRadius?: string; // Sets the CSS border-radius shorthand property. Default: undefined
    } // interface IThemeAsObject

    export type JsPanelCallback = (panel: JsPanel) => void;

    class contentAjaxOptions {
        /**
         * A DOMString representing the URL to send the request to. See XMLHttpRequest.open()
         * @type {string} string, default: undefined, required
         */
        url ?: string;

        /**
         * @type: string, default: 'GET'
         *
         * The HTTP request method to use, such as "GET", "POST", "PUT", "DELETE", etc. Ignored for non-HTTP(S) URLs. See XMLHttpRequest.open()
         */
        method ?: string;

        /**
         * @type: boolean, default: true
         *
         * An optional Boolean parameter indicating whether or not to perform the operation asynchronously. See XMLHttpRequest.open()
         */
        async ?: boolean;

        /**
         * @type: anything, default: undefined
         *
         * A body of data to be sent in the XHR request. See XMLHttpRequest.send()
         */
        data ?: any;

        /**
         * @type: string, default: null
         *
         * Optional user name to use for authentication purposes. See XMLHttpRequest.open()
         */
        user ?: string;

        /**
         * @type: string, default: null
         *
         * Optional password to use for authentication purposes. See XMLHttpRequest.open()
         */
        pwd ?: string;

        /**
         * @type: integer (number in milliseconds), default: 0
         *
         * The number of milliseconds a request can take before automatically being terminated. See XMLHttpRequest/timeout
         */
        timeout ?: number;

        /**
         * @type: boolean, default: false
         *
         * Boolean that indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies or authorization headers. See XMLHttpRequest/withCredentials
         */
        withCredentials ?: boolean;

        /**
         * @type: string, default: undefined
         *
         * Enumerated value that defines the response type. See XMLHttpRequest/responseType
         */
        responseType ?: string;

        /**
         * @type: function(xhr, panel), default: as described below
         *
         * Default:
         *
         * if you do not provide a done callback it defaults to a function trying to use the server response as content of the panel.
         * if a done callback is provided server response is handled according to your function
         * The function receives the XMLHttpRequest object and the panel as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         */
        done ?: (xhr: XMLHttpRequest, panel: JsPanel) => void;

        /**
         * @type: function(xhr, panel), default: undefined
         *
         * This function is called when the request fails with a status code other than 200.
         *
         * The function receives the XMLHttpRequest object and the panel as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         */
        fail ?: (xhr: XMLHttpRequest, panel: JsPanel) => void;

        /**
         * @type: function(xhr, panel), default: undefined
         *
         * This function is called always (after the fail callback), no matter whether the request succeeded or failed.
         *
         * The function receives the XMLHttpRequest object and the panel as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         */
        always ?: (xhr: XMLHttpRequest, panel: JsPanel) => void;

        /**
         * @type: function(xhr, panel), default: undefined
         *
         * This function is executed just before the request is sent and could be used to set request headers for example.
         *
         * The function receives the XMLHttpRequest object and the panel as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         */
        beforeSend ?: (xhr: XMLHttpRequest, panel: JsPanel) => void;


        /**
         * @type: Boolean, default: true
         *
         * Unless this parameter is set to false the panel will automatically resize if:
         *
         * the ajax request has completed and
         * option.contentSize.width and/or option.contentSize.height are set to 'auto'
         */
        autoresize ?: boolean;

        /**
         * @type: Boolean, default: true
         *
         * Unless this parameter is set to false the panel will automatically reposition if:
         *
         * the ajax request has completed and
         * option.contentSize.width and/or option.contentSize.height are set to 'auto'
         */
        autoposition ?: boolean;


    } // contentAjaxOptions

    class contentFetchOptions {
        /**
         * @type: string, default: undefined, required
         *
         * A DOMString representing the URL pointing to the resource.
         */
        resource ?: string;

        /**
         * @type: string, default: 'text'
         *
         * A fetch request will eventually return a response. To extract the content from this response you have to use a content specific method set by this parameter. For more details see the Body Web API
         *
         * Must be a string with either 'arrayBuffer', 'blob', 'formData', 'json' or 'text'.
         */
        bodyMethod ?: string;

        /**
         * @type: object, default: undefined
         *
         * Passes additional request options. For details see Supplying (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options) request options
         */
        fetchInit ?: string | RequestInit;

        /**
         * @type: function(xhr, panel), default: as described below
         *
         * Default:
         *
         * if you do not provide a done callback it defaults to a function trying to use the server response as content of the panel.
         * if a done callback is provided server response is handled according to your function
         * The function receives the XMLHttpRequest object and the panel as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         */
        done ?: (xhr: XMLHttpRequest, panel: JsPanel) => void;

        /**
         * @type: function(xhr, panel), default: undefined
         *
         * This function is executed just before the request is sent and could be used to set request headers for example.
         *
         * The function receives the XMLHttpRequest object and the panel as arguments and the keyword this inside the function refers to the XMLHttpRequest object.
         */
        beforeSend ?: (xhr: XMLHttpRequest, panel: JsPanel) => void;

        /**
         * @type: Boolean, default: true
         *
         * Unless this parameter is set to false the panel will automatically resize if:
         *
         * the ajax request has completed and
         * option.contentSize.width and/or option.contentSize.height are set to 'auto'
         */
        autoresize ?: boolean;

        /**
         * @type: Boolean, default: true
         *
         * Unless this parameter is set to false the panel will automatically reposition if:
         *
         * the ajax request has completed and
         * option.contentSize.width and/or option.contentSize.height are set to 'auto'
         */
        autoposition ?: boolean;


    } // contentFetchOptions


    class JsPanelOptions_Dragit_Snap {
        /**
         * callback Function undefined'
         *
         * A callback function to execute after the panel snapped. This callback applies to all snap positions.
         *
         * The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         *
         * Note:
         *
         * This callback is executed regardless of whether there is another callback for an individual snap position.
         *
         * @example
         * ```javascript
         * jsPanel.create({
         *     dragit: {
         *         snap: {
         *             callback: (panel) => {
         *                 panel.setHeaderTitle(panel.snapped);
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * This snap option is editable for existing panels:
         *
         *
         * @example
         * ```javascript
         * panel.options.dragit.snap.callback = function(panel) {};
         * ```
         *
         * @type {(panel: JsPanel) => void}
         */
        callback ?: (panel: JsPanel) => void;


        /**
         * snapLeftTop
         *
         * snapCenterTop
         *
         * snapRightTop
         *
         * snapRightCenter
         *
         * snapRightBottom
         *
         * snapCenterBottom
         *
         * snapLeftBottom
         *
         * snapLeftCenter
         *
         * Function or Boolean undefined
         *
         * Callback functions for individual snap positions to execute after the panel snapped.
         *
         * The functions receives the panel as argument and the keyword this inside the functions also refers to the panel.
         *
         * A setting of Boolean false will turn off the snap feature for this particular snap position.
         *
         * Note:
         *
         * When using an individual snap callback the panel does not snap automatically for this snap position unless parameter repositionOnSnap is set to true as shown in the example below.
         *
         * ```javascript
         * jsPanel.create({
         *     dragit: {
         *         snap: {
         *             callback: panel => {
         *                 panel.setHeaderTitle(panel.snapped);
         *             },
         *             snapRightTop: panel => {
         *                 panel.resize('50% 50%');
         *             },
         *             snapLeftBottom: false,
         *             repositionOnSnap: true
         *         }
         *     }
         * });
         * ```
         *
         * This snap options are editable for existing panels:
         * ```javascript
         * panel.options.dragit.snap.snapLeftTop = function(panel) {};
         * ```
         *
         */
        snapLeftTop ?: boolean | ((panel: JsPanel) => void);

        /**
         * @see snapLeftTop
         */
        snapCenterTop ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */
        snapRightTop ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */
        snapRightCenter ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */
        snapRightBottom ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */
        snapCenterBottom ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */
        snapLeftBottom ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */
        snapLeftCenter ?: boolean | ((panel: JsPanel) => void);
        /**
         * @see snapLeftTop
         */

        /**
         * containment Boolean undefined
         *
         * If set to true and the dragit.containment parameter is set the panel will snap according to the dragit.containment settings.
         *
         * ```javascript
         * jsPanel.create({
         *     dragit: {
         *         containment: 10,
         *         snap: {
         *             containment: true,
         *             snapRightTop: panel => {
         *                 panel.resize('50% 50%');
         *             },
         *             repositionOnSnap: true
         *         }
         *     }
         * });
         * ```
         *
         * This snap option is editable for existing panels:
         *
         * ```javascript
         * panel.options.dragit.snap.containment = true;
         * ```
         *
         * @type {boolean}
         */
        containment ?: boolean;


        /**
         * repositionOnSnap Boolean undefined
         *
         * If set to true a panel will automatically reposition after all snap callbacks. This might be useful in case a snap callback resizes a panel.
         *
         * You most probably should use this parameter whenever you define a callback for an individual snap position.
         *
         * See the two examples above where this parameter is used.
         *
         * This snap option is editable for existing panels:
         *
         * ```javascript
         * panel.options.dragit.snap.repositionOnSnap = true;
         * ```
         *
         * @type {boolean}
         */
        repositionOnSnap ?: boolean;


        /**
         * resizeToPreSnap Boolean undefined
         *
         * If set to true a snapped panel will
         *
         * resize to the width/height values it had before it snapped
         *
         * reposition so that the header section roughly centers under the pointer as soon as you start dragging it away from a snapped position.
         *
         * ```javascript
         * jsPanel.create({
         *     dragit: {
         *         snap: {
         *             snapCenterTop: panel => {
         *                 panel.resize('100%');
         *             },
         *             snapRightCenter: panel => {
         *                 panel.resize('50vw 100vh');
         *             },
         *             repositionOnSnap: true,
         *             resizeToPreSnap: true
         *         }
         *     }
         * });
         * ```
         *
         * This snap option is editable for existing panels:
         *
         * ```javascript
         * panel.options.dragit.snap.resizeToPreSnap = true;
         * ```
         *
         *
         * @type {boolean}
         */
        resizeToPreSnap ?: boolean;

        /**
         * sensitivity Integer 70
         *
         * Roughly translates to
         *  - the diameter of the corner snap-sensitive areas
         *  - the height of the snap-sensitive areas at center-top and center-bottom (width is 1/4 of parent element width)
         *  - the width of the snap-sensitive areas at left-center and right-center (height is 1/4 of parent element height)
         *
         * It might be useful to set a smaller value when the panel's parent element is rather small.
         *
         *
         * This snap option is editable for existing panels:
         *
         * ```javascript
         * panel.options.dragit.snap.sensitivity = 40;
         * ```
         *
         * @type {number}
         * @see {trigger} for an example using sensitivity.
         */
        sensitivity ?: number;

        /**
         * trigger String 'panel' (default)
         *
         * Panel snapping is triggered when a certain reference point of the panel itself enters a snap-sensitive area.
         * Setting parameter trigger to 'pointer' will use the pointer position instead as triggering factor.
         *
         * ```javascript
         * jsPanel.create({
         *     container: '#trigger',
         *     panelSize: '250 150',
         *     dragit: {
         *         snap: {
         *             sensitivity: 35,
         *             trigger: 'pointer',
         *             active: 'inside'
         *         }
         *     }
         * });
         * ```
         *
         * This snap option is editable for existing panels:
         *
         * ```javascript
         * panel.options.dragit.snap.trigger = 'pointer';
         * ```
         *
         * @type {string}
         */
        trigger ?: 'panel' | 'pointer';

        /**
         * active String 'both' (default)
         *
         * By default a panel can snap when a specific panel side/corner or the pointer comes close to the corresponding snap-sensitive area.
         * It doesn't matter whether the panel side/corner or the pointer closes in from inside or outside the panel's parent container.
         * Setting parameter active to 'inside' will snap a panel only if the pointer is inside the panel's parent container.
         *
         *
         *
         * This snap option is editable for existing panels:
         *
         * ```javascript
         * panel.options.dragit.snap.active = 'inside';
         * ```
         *
         * @type {string}
         * @see {trigger} for an example using active.
         */
        active ?: 'both' | 'inside';
    } //  JsPanelDragitSnap


    /**
     * dragit property options
     */
    export class JsPanelOptions_Dragit {
        /**
         * Limits dragging of the panel either along the x-axis or along the y-axis.
         *
         * Values: 'x' or 'y'
         *
         * Example:
         *
         * jsPanel.create({
         *     dragit: {
         *         axis: 'x'
         *     }
         * });.
         */
        axis ?: 'x' | 'y';

        /**
         * Limits dragging of the panel to the confines of its parent element or the browser viewport.
         *
         * Values:
         *
         * Integer
         *      An integer is just a shorthand for an array with 4 equal values
         * Array
         *      Array of 1 through 4 integers like [50, 50, 50, 50] where each number sets the distance in pixels the panel has to maintain to the [top, right, bottom, left] boundaries of the parent element (the browser viewport in case the panel is appended to the body element).
         *
         * Array of 1 number like [50] is just a shortcut for [50, 50, 50, 50].
         * Array of 2 numbers like [50, 100] is just a shortcut for [50, 100, 50, 100].
         * Array of 3 numbers like [50, 100, 20] is just a shortcut for [50, 100, 20, 100].
         *
         *
         * Example
         *<pre>
         * jsPanel.create({
         *     dragit: {
         *         containment: [65, 20, 20]
         *     }
         * });
         *</pre>
         *
         * This option is editable for existing panels:
         *          panel.options.dragit.containment = value;
         *
         * Info
         *      If option syncMargins is used this containment setting is be replaced by the setting of option maximizedMargin.
         *
         * Info
         *      If you change the containment setting of an existing panel options maximizedMargin and resizeit.containment are not updated automatically, regardless of the setting of option syncMargins.
         */
        containment ?: number | number[];

        /**
         * Sets the CSS cursor property when hovering a drag handle.
         * Values: any string value according to developer.mozilla.org/en-US/docs/Web/CSS/cursor
         *
         * Example:
         *
         * jsPanel.create({
         *     dragit: {
         *         cursor: 'grab'
         *     }
         * });
         *
         */
        cursor ?: string | 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out';


        /**
         * If set to true the panel's dragit interaction is initialized according to the passed configuration and then temporarily disabled.
         *
         * A dragit interaction disabled this way can be re-enabled with the panel method dragit().
         *
         * jsPanel.create({
         *     dragit: {
         *         disable: true
         *     }
         * });
         *
         * Info
         *       To disable/enable the dragit interaction for existing panels use the panel method dragit().
         */
        disable ?: boolean;

        /**
         * If set to true a panel can not be dragged while its status is maximized which is the default behaviour.
         *
         * jsPanel.create({
         *     dragit: {
         *         disableOnMaximized: false
         *     }
         * });
         *
         * This option is editable for existing panels:
         * panel.options.dragit.disableOnMaximized = value;
         */
        disableOnMaximized ?: boolean;


        /**
         * This parameter allows to drop a panel into another container. Meaning the panel is removed from its current parent element and appended to another element/container.
         *
         *      - the panel can be dropped when the mouse pointer moves over an element defined as a drop zone
         *      - the panel is removed from its current and then appended to its new container on pointerup
         *      - the panel's option container is set to the new parent element
         * Object properties are:
         *
         *      dropZones (Array|undefined) - required
         *          Defines the elements a panel can be dropped into. The array may contain:
         *              - a selector string selecting a single or multiple container or
         *              - a node object pointing to a single container
         * callback (Function |undefined)
         *      Callback function executed after the panel was dropped. The function receives the following arguments:
         *          - panel the dropped panel
         *          - target the container the panel was dropped into
         *          - source the container the panel originated from
         *
         * The keyword this inside the function also refers to the dropped panel.
         *
         * Example:
         *
         * jsPanel.create({
         *     dragit: {
         *         drop: {
         *             dropZones: ['.drop-target'],
         *             callback: (panel, target, source) => {}
         *         }
         *     }
         * });
         *
         * Info
         * For a working demo please refer to the docs of property 'droppableTo'.
         * @see droppableTo
         */
        drop ?: {
            dropZones?: string[] | Node[],
            callback?: (panel: JsPanel, target: HTMLElement, source: HTMLElement) => void
        }

        /**
         * Snaps the panel to a grid every x and y pixels.
         *
         * Value: array of two Number values where the first one snaps the panel along the x-axis and the second one along the y-axis. A single Number value may be used if both settings are supposed to be equal.
         *
         * jsPanel.create({
         *     dragit: {
         *         grid: [50, 50]
         *     }
         * });
         *
         * This option is editable for existing panels:
         *
         * panel.options.dragit.grid = value;
         */
        grid ?: [number, number];

        /**
         * handles String '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr'
         * Sets the panel's element(s) serving as drag handle.
         *
         * Value: String with a comma separated list of selectors.
         *
         * jsPanel.create({
         *     dragit: {
         *         // adds the header toolbar as drag handle
         *         handles: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr, .jsPanel-hdr-toolbar'
         *     }
         * });
         * Info
         *
         * Note that setting dragit handles overwrites the default value.
         *
         * Make sure you don't remove drag handles inadvertently.
         * @type {string}
         */
        handles ?: string;

        /**
         * opacity Number 0.8
         * Sets the opacity of the panel while being dragged.
         *
         * Values: Number in the range 0 through 1
         *
         * jsPanel.create({
         *     dragit: {
         *         opacity: 0.6
         *     }
         * });
         *
         *
         * This option is editable for existing panels:
         * <code>
         * panel.options.dragit.opacity = value;
         * </code>
         */
        opacity ?: number;


        /**
         * @property {number} left - Left position of the panel in pixels at the moment dragging started.
         * @property {number} top - Top position of the panel in pixels at the moment dragging started.
         * @property {number} width - Width of the panel in pixels at the moment dragging started.
         * @property {number} height - Height of the panel in pixels at the moment dragging started.
         */

        /**
         * Callback function executed when dragging starts.
         *
         * @param {HTMLElement} panel - The panel being dragged.
         * @param {any} paneldata - a plain object with key:value pairs for CSS left, top, width and height pixel values as unit-less numbers at the moment the dragging started.
         * @param {Event} event - the event object
         *
         * The keyword this inside the function refers to the panel.
         *
         * @this {HTMLElement} - The panel being dragged.
         *
         * @example
         * javascript
         * jsPanel.create({
         *     dragit: {
         *         start: (panel, paneldata, event) => {
         *             panel.content.innerHTML = `<p>dragstart at: left ${paneldata.left}, top ${paneldata.top}</p>
         *                                        <p>event.type: ${event.type}</p>`;
         *         }
         *     }
         * });
         *
         *
         * This option is editable for existing panels:
         *
         * Info
         *
         * Internally the value of dragit.start always ends up as array. So make sure you add an additional callback via panel.options.dragit.start.push().
         *
         */
        start ?: JsPanelOptions_Resizeit_Function


        /**
         * drag Function undefined
         * A callback function or array of functions to execute continuously while the panel is dragged.
         *
         * Values: Function or Array of functions
         *
         * Function parameters:
         *
         * panel:      the panel being dragged<p>
         * paneldata :  a plain object with key:value pairs for CSS left, top, width and height pixel values as unit-less numbers at the moment the dragging started.<p>
         * event:    the event object<p>
         *
         * The keyword this inside the function refers to the panel.
         *
         * @example
         * ```javascript
         * jsPanel.create({
         *     dragit: {
         *         drag: (panel, paneldata, event) => {
         *             panel.content.innerHTML = `<p>left ${paneldata.left}, top ${paneldata.top}
         *                                        <p>event.type: ${event.type}</p>`
         *         }
         *     }
         * });
         *```
         *
         * This option is editable for existing panels:
         *
         * Info:
         * Internally the value of dragit.drag always ends up as array. So make sure you add an additional callback via panel.options.dragit.drag.push().
         * @type {(panel, paneldata, event) => void}
         */
        drag ?: JsPanelOptions_Resizeit_Function;

        /**
         * stop Function undefined
         * A callback function or array of functions to execute once when the dragging operation stopped.
         *
         * Values: Function or Array of functions
         *
         * Function parameters:
         *
         * panel: the panel being dragged
         *
         * paneldata: a plain object with key:value pairs for CSS left, top, width and height pixel values as unit-less numbers at the moment the dragging stopped.
         *
         * event: the event object
         * The keyword this inside the function refers to the panel.
         *
         *  @example
         * javascript
         * jsPanel.create({
         *     dragit: {
         *         stop: (panel, paneldata, event) => {
         *             panel.content.innerHTML = `<p>dragstop at: left ${paneldata.left}, top ${paneldata.top}
         *                                        <p>event.type: ${event.type}</p>`
         *         }
         *     }
         * });
         *
         * This option is editable for existing panels:
         *
         * Info:
         *
         * Internally the value of dragit.stop always ends up as array. So make sure you add an additional callback via panel.options.dragit.stop.push().
         * @type {(panel, paneldata, event) => void}
         */
        stop ?: JsPanelOptions_Resizeit_Function;

        /**
         * snap Boolean or Object undefined
         *
         * Lets a panel snap to the corners and centers of the sides of either the viewport or the panel's parent element depending on configuration.
         *
         * Values: Boolean or Object
         *
         * Boolean:
         *
         * If set to true the panel will snap to one of the positions left-top, center-top, right-top, right-center, right-bottom, center-bottom, left-bottom or left-center if the panel or the mouse cursor (depending on configuration) intercepts one of the corresponding "snap-sensitive" areas.
         *
         * Object:
         * Using an Object allows a much more detailed snap configuration.
         *
         * The default configuration of the snap feature - when enabled - always is:
         *
         * @example
         *  ```javascript
         *  {
         *      sensitivity: 70,
         *      trigger: 'panel',
         *      active: 'both',
         *  }
         *  ```
         * <p>
         * <p>
         * Detailed snap configuration options are described here: https://jspanel.de/#options/dragitsnap  There you also find some more dragit.snap examples.<p>
         *
         *  @example
         *  javascript
         * jsPanel.create({
         *     dragit: {
         *         snap: true
         *     }
         * });
         *
         * This option is editable for existing panels:
         *
         * If the panel was created without the snap feature enabled you first have to enable it with the default configuration:
         *
         * panel.options.dragit.snap = jsPanel.defaultSnapConfig;
         *
         * Once the snap feature is enabled you can edit individual snap options as described in the individual snap options.
         *
         * @type {boolean | JsPanelOptions_Dragit_Snap}
         */
        snap ?: boolean | JsPanelOptions_Dragit_Snap;

    } // JsPanelDragit

    export type JsPanelHeaderControlsValues = 'remove' | 'disable' | 'hide' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    export class JsPanelHeaderControlsAdd {
        html?: string;
        name?: string;
        handler ?: ((panel: JsPanel, control: any) => void);
        position ?: number;
        afterInsert?: ((control: any) => void);
    }


    type OnBeforeClose = (panel: JsPanel, status: string, closedByUser ?: boolean) =>  boolean| undefined;
    type OnBeforeMaximize = (panel: JsPanel, status: string) =>  boolean| undefined;
    type OnBeforeMinimize = (panel: JsPanel, status: string) =>  boolean| undefined;
    type OnBeforeNormalize = (panel: JsPanel, status: string) =>  boolean| undefined;
    type OnBeforeSmallify = (panel: JsPanel, status: string) =>  boolean| undefined;
    type OnBeforeUnsmallify = (panel: JsPanel, status: string) => boolean| undefined;
    type OnClosed = (panel: JsPanel, closedByUser: boolean) => boolean | undefined;
    type OnFronted = (panel: JsPanel, status: string) => boolean | undefined;
    type OnMaximized = (panel: JsPanel, status: string) => boolean | undefined;
    type OnMinimized = (panel: JsPanel, status: string) => boolean | undefined;
    type OnNormalized = (panel: JsPanel, status: string) => boolean | undefined;
    type OnSmallified = (panel: JsPanel, status: string) =>  boolean | undefined;
    type OnUnsmallified = (panel: JsPanel, status: string) => boolean | undefined;
    type OnStatusChange = (panel: JsPanel, status: string) => boolean | undefined;
    type OnParentResize = (parent: JsPanel, parentsize: { width: number; height: number }) => void
    type OnWindowResize = (event: any, panel: JsPanel) => void;

    type PositionValues = 'center' | 'left-top' | 'center-top' | 'right-top' | 'right-center' | 'right-bottom' | 'center-bottom' | 'left-bottom' | 'left-center';

    /**
     * @link https://jspanel.de/#options/position
     */
    export interface JSPanelPosition {
        /**
         * The point of the panel that is positioned against some other element.
         *
         * - String - Supported string values:
         *
         *          - center'
         *          - left-top'
         *          - center-top'
         *          - right-top'
         *          - right-center'
         *          - right-bottom'
         *          - center-bottom'
         *          - left-bottom'
         *          - left-center'
         *
         * - Function - A function has to return one of the supported string values named above. The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         */
        my?: PositionValues | ((panel: JsPanel) => PositionValues);

        /**
         * The point of the element the panel is positioned against.
         *
         * - String - Supported string values:
         *
         *          - center'
         *          - left-top'
         *          - center-top'
         *          - right-top'
         *          - right-center'
         *          - right-bottom'
         *          - center-bottom'
         *          - left-bottom'
         *          - left-center'
         *
         * - Function - A function has to return one of the supported string values named above. The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         */
        at?: PositionValues | ((panel: JsPanel) => PositionValues);

        /**
         *
         * The element the panel is positioned against.
         *
         * - String  - Any selector string that can be passed to Element.querySelector()
         *
         * - Node - Any node element suitable to position a panel against.
         *
         * - Function - Any function returning either a selector string or an node element. The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         *
         * **Default values:**
         *
         * Option position of defaults to the setting of option container.
         *
         * That means a panel using container: 'window' (which is the default for option container) positions the panel fixed against the browser viewport. Any other option container setting causes the panel to be positioned against the element specified in option container.
         */
        of?: string | HTMLElement | ((panel: JsPanel) => string | Node);


        /**
         *
         * This parameter can be used to automatically arrange a number of panels either horizontally or vertically.
         *
         * Supported string values:
         *
         * 'down' - for panels positioned using either 'left-top', 'center-top' or 'right-top' for both my: and at: setting autoposition to 'down' will automatically add a vertical offset downwards to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         *
         * 'up' - for panels positioned using either 'left-bottom', 'center-bottom' or 'right-bottom' for both my: and at: setting autoposition to 'up' will automatically add a vertical offset upwards to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         *
         * 'right' - for panels positioned using either 'left-top' or 'left-bottom' for both my: and at: setting autoposition to 'right' will automatically add a horizontal right offset to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         *
         * 'left' - for panels positioned using either 'right-top' or 'right-bottom' for both my: and at: setting autoposition to 'left' will automatically add a horizontal left offset to each panel in order to prevent them from piling up on each other. Removing a panel will automatically reposition the remaining panels in the same stack.
         *
         *
         * **autoposition notes:**
         *
         * - Basically nothing prevents you from using one of the autoposition values for any panel having the same value for my: and at:. But it simply might not make any sense if you use autoposition: 'down' for panels positioned 'left-bottom' for example.
         *
         * - The default spacing between autopositioned panels is '4px' and set in global jsPanel.autopositionSpacing.
         * offsetX/offsetY: If you apply either one of the offsets to a number of panels using autoposition the offset refers to the complete stack of panels.
         *
         * - Each autopositioned panel gets an additional class name composed of the basic position (e.g. left-top) and the autoposition direction concatenated with a hyphen. So all panels that are positioned left-top and autopositioned downwards have the class left-top-down for example.
         *
         * - Autopositioned panels reposition automatically if one panel of the same stack is closed. But only if panels are autopositioned
         *      - left-top down/right
         *      - center-top down
         *      - right-top down/left
         *      - right-bottom up/left
         *      - center-bottom up
         *      - left-bottom up/right
         *
         */
        // noinspection SpellCheckingInspection
        autoposition?: string;

        /**
         * A horizontal offset to apply to the panel position.
         *
         * - Number - A number value is used as offset in pixels.
         *
         * - String (CSS length value) - Any valid CSS length value is directly used as offset.
         *
         * - Function(pos, position) - A function returning either a number or a valid CSS length value.
         *
         * **Arguments:**
         *
         * - pos  - object with the keys left and top with the calculated CSS left/top values before the offset is applied
         * - position - option position as object
         * The keyword this inside the function refers to pos.
         *
         */
        offsetX?: number | string | ((pos ?: { left?: string | number, top?: string | number }, position ?: any) => string | number);

        /**
         * A vertical offset to apply to the panel position.
         *
         * - Number - A number value is used as offset in pixels.
         *
         * - String (CSS length value) - Any valid CSS length value is directly used as offset.
         *
         * - Function(pos, position) - A function returning either a number or a valid CSS length value.
         *
         * **Arguments:**
         *
         * - pos  - object with the keys left and top with the calculated CSS left/top values before the offset is applied
         * - position - option position as object
         * The keyword this inside the function refers to pos.
         *
         */
        offsetY?: number | string | ((pos ?: { left?: string | number, top?: string | number }, position ?: any) => string | number);

        /**
         * The minimum CSS left the panel has to maintain.
         *
         * Number
         *
         * A number value is used as pixels.
         *
         * CSS length value
         *
         * Any valid CSS length value is directly used.
         *
         * Function(pos, position)
         *
         * A function returning either a number or a valid CSS length value.
         *
         * Arguments:
         *
         * pos object with the keys left and top with the calculated CSS left/top values before minLeft is applied (offsetX is already included in this value)
         * position option position as object
         * The keyword this inside the function refers to pos.
         *
         */
        minLeft?: number | string | ((pos ?: { left?: string | number, top?: string | number }, position ?: any) => string | number);

        /**
         * The maximum CSS left the panel has to maintain.
         *
         * Number
         *
         * A number value is used as pixels.
         *
         * CSS length value
         *
         * Any valid CSS length value is directly used.
         *
         * Function(pos, position)
         *
         * A function returning either a number or a valid CSS length value.
         *
         * Arguments:
         *
         * pos object with the keys left and top with the calculated CSS left/top values before maxLeft is applied (offsetX is already included in this value)
         * position option position as object
         * The keyword this inside the function refers to pos.
         *
         *
         */
        maxLeft?: number | string | ((pos ?: { left?: string | number, top?: string | number }, position ?: any) => string | number);

        /**
         * maxTop Number, CSS length value or Function undefined
         * The maximum CSS top the panel has to maintain.
         *
         * Number
         *
         * A number value is used as pixels.
         *
         * CSS length value
         *
         * Any valid CSS length value is directly used.
         *
         * Function(pos, position)
         *
         * A function returning either a number or a valid CSS length value.
         *
         * Arguments:
         *
         * pos object with the keys left and top with the calculated CSS left/top values before maxTop is applied (offsetYis already included in this value)
         * position option position as object
         * The keyword this inside the function refers to pos.
         */
        maxTop?: number | string | ((pos ?: { left?: string | number, top?: string | number }, position ?: any) => string | number);


        /**
         * minTop Number, CSS length value or Function undefined
         * The minimum CSS top the panel has to maintain.
         *
         * Number
         *
         * A number value is used as pixels.
         *
         * CSS length value
         *
         * Any valid CSS length value is directly used.
         *
         * Function(pos, position)
         *
         * A function returning either a number or a valid CSS length value.
         *
         * Arguments:
         *
         * pos object with the keys left and top with the calculated CSS left/top values before minTop is applied (offsetY is already included in this value)
         * position option position as object
         * The keyword this inside the function refers to pos.
         */
        minTop?: number | string | ((pos ?: { left?: string | number, top?: string | number }, position ?: any) => string | number);


        /**
         * This function can be used to further modify the CSS left and top values calculated so far.
         *
         * **Arguments:**
         *
         * - pos object with the keys left and top with the calculated CSS left/top values that are calculated so far. Those values include the corrections possibly made by the parameters offsetX, offsetY, minLeft, maxLeft, maxTop and minTop.
         *
         * - position option position as object
         *
         * The keyword this inside the function refers to pos.
         *
         * **Return value:**
         *
         * The function must return an object with the keys left and top each set with a valid CSS length value.
         */
        modify?: ((pos: { left: string, top: string }, position: any) => { left: number | string, top: number | string });

    } // JSPanelPosition

    export type JsPanelOptions_Resizeit_Function = (panel: JsPanel, paneldata: JsPanelOptions_PanelData, event: any) => void;

    export interface JsPanelOptions_Resizeit {

        /**
         * Using this parameter the panel maintains its aspect ration while it's resized. Two modes are available as described below.
         *
         * **Supported string values:**
         *
         * - 'panel' - the complete panel being resized with the mouse will maintain its aspect ratio
         * - 'content' - the content section of the panel being resized with the mouse will maintain its aspect ratio
         *
         * **Boolean values are deprecated**
         *
         * -  true is the same as using the string 'panel'
         * -  false disables aspectRatio
         *
         * **Example**
         *
         * ```javascript
         * jsPanel.create({
         *     resizeit: {
         *         aspectRatio: 'content'
         *     },
         *     content: '<img src="img/WALLIS-169.jpg" style="width:100%">',
         *     contentSize: 'auto 296',
         *     callback: function(panel){
         *         this.content.style.padding = 0;
         *         // reposition panel after image loaded
         *         var img = new Image();
         *         img.src = this.content.querySelector('img').src;
         *         img.onload = function() {
         *             panel.reposition();
         *         }
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *
         *``` javascript
         * panel.options.resizeit.aspectRatio = value;
         * ```
         */
        aspectRatio?: 'panel' | 'content' | true | false;


        /**
         * Limits resizing of the panel to the confines of its parent element or the browser viewport.
         *
         * **Values:**
         *
         *  - Integer - An integer is just a shorthand for an array with 4 equal values
         *  - Array - Array of 1 through 4 integers like [50, 50, 50, 50] where each number sets the distance in pixels the panel has to maintain to the [top, right, bottom, left] boundaries of the parent element (the browser viewport in case the panel is appended to the body element).
         *
         *        - Array of 1 number like [50] is just a shortcut for [50, 50, 50, 50].
         *        - Array of 2 numbers like [50, 100] is just a shortcut for [50, 100, 50, 100].
         *        - Array of 3 numbers like [50, 100, 20] is just a shortcut for [50, 100, 20, 100].
         *
         *
         * **Info**
         *
         * If option **syncMargins** is used this containment setting is be replaced by the setting of option **maximizedMargin.**
         *
         * **Example**
         *
         * ```javascript
         * jsPanel.create({
         *     resizeit: {
         *         containment: [65, 20, 20]
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *``` javascript
         * panel.options.resizeit.containment = value;
         *```
         *
         * **Info**
         *
         * If you change the containment setting of an existing panel options **maximizedMargin** and **dragit.containment** are not updated automatically, regardless of the setting of option **syncMargins**.
         */
        containment?: number | [number] | [number, number] | [number, number, number] | [number, number, number, number];

        /**
         * If set to **true** the panel's **resizeit** interaction is initialized according to the passed configuration and then temporarily disabled.
         *
         * A **resizeit** interaction disabled this way can be re-enabled with the panel method **resizeit()**.
         *
         * ```javascript
         * jsPanel.create({
         *     resizeit: {
         *         disable: true
         *     }
         * });
         * ```
         *
         * **Info**
         *
         * To disable/enable the resizeit interaction for existing panels use the panel method **resizeit()** .
         */
        disable?: boolean

        /**
         * Snaps panel width every x and y pixels.
         *
         * **Value:** array of two Number values where the first one snaps the panel width and the second one panel height. A single Number value may be used if both settings are supposed to be equal.
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         grid: [50, 50]
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *``` javascript
         * panel.options.resizeit.grid = value;
         * ```
         */
        grid?: [number, number];

        /**
         * Default if not set:  'n, e, s, w, ne, se, sw, nw'
         *
         * Sets the panel's element(s) serving as resize handle.
         *
         * Value: String with a comma separated list of handles.
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         handles: 'e, se'
         *     }
         * });
         * ```
         *
         * **Info**
         *
         * Note that setting resizeit handles overwrites the default value. Make sure you don't remove resize handles inadvertently.
         */
        handles?: string;

        /**
         * Defaults to  128
         *
         * Sets the minimum width a panel should not fall below.
         *
         * ```javascript
         * jsPanel.create({
         *     resizeit: {
         *         minWidth: 200
         *     }
         * });
         * ```
         * This option is editable for existing panels:
         *``` javascript
         * panel.options.resizeit.minWidth = value;
         * ```
         *
         */
        minWidth?: number; //, default: 128

        /**
         * Defaults to 38
         *
         * Sets the minimum height a panel should not fall below.
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         minHeight: 100
         *     }
         * });
         * ```
         * This option is editable for existing panels:
         *``` javascript
         * panel.options.resizeit.minHeight = value;
         * ```
         */
        minHeight?: number; // , default: 38

        /**
         * Sets the maximum width a panel should not exceed.
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         maxWidth: 1000
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *``` javascript
         * panel.options.resizeit.maxWidth = value;
         * ```
         */
        maxWidth?: number;

        /**
         * Sets the maximum height a panel should not exceed.
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         maxHeight: 600
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *``` javascript
         * panel.options.resizeit.maxHeight = value;
         * ```
         *
         */
        maxHeight?: number;

        /**
         * A callback function or array of functions to execute once when the resizing operation starts.
         *
         * Values: Function or Array of functions
         *
         * Function parameters:
         *
         * - panel -  the panel being resized
         * - paneldata - a plain object with key:value pairs for CSS left, top, width and height pixel values as unit-less numbers at the moment the resizing started.
         * - event - the event object
         *
         * The keyword this inside the function refers to the panel.
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         start: (panel, paneldata, event) => {
         *             panel.content.innerHTML = `<p>resizestart with: width ${paneldata.width}, height ${paneldata.height}
         *                                        <p>event.type: ${event.type}</p>`
         *         }
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *
         * **Info**
         *
         * - Internally the value of **resizeit.start** always ends up as array. So make sure you add an additional callback via **panel.options.resizeit.start.push()**.
         *
         */
        start?: JsPanelOptions_Resizeit_Function | JsPanelOptions_Resizeit_Function[];

        /**
         * A callback function or array of functions to execute continuously while a panel is resized.
         *
         * Values: Function or Array of functions
         *
         * Function parameters:
         *
         * - panel - the panel being resized
         * - paneldata - a plain object with key:value pairs for CSS left, top, width and height pixel values as unit-less numbers while panel is resized.
         * - event  - the event object
         *
         * The keyword this inside the function refers to the panel.
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         resize: (panel, paneldata, event) => {
         *             panel.content.innerHTML = `<p>resizing: width ${paneldata.width}, height ${paneldata.height}
         *                                        <p>event.type: ${event.type}</p>`
         *         }
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *
         * **Info**
         *
         * Internally the value of **resizeit.resize** always ends up as array. So make sure you add an additional callback via **panel.options.resizeit.resize.push()**.
         *
         */
        resize?: JsPanelOptions_Resizeit_Function | JsPanelOptions_Resizeit_Function[];

        /**
         * A callback function or array of functions to execute once after resizing stopped.
         *
         * Values: Function or Array of functions
         *
         * Function parameters:
         *
         * - panel - the panel being resized
         * - paneldata - a plain object with key:value pairs for CSS left, top, width and height pixel values as unit-less numbers while panel is resized.
         * - event  - the event object
         *
         * The keyword this inside the function refers to the panel.
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     resizeit: {
         *         stop: (panel, paneldata, event) => {
         *             panel.content.innerHTML = `<p>resizing stopped with: width ${paneldata.width}, height ${paneldata.height}
         *                                        <p>event.type: ${event.type}</p>`
         *         }
         *     }
         * });
         * ```
         *
         * This option is editable for existing panels:
         *
         * **Info**
         *
         * Internally the value of **resizeit.resize** always ends up as array. So make sure you add an additional callback via **panel.options.resizeit.stop.push()**.
         *
         */
        stop?: JsPanelOptions_Resizeit_Function | JsPanelOptions_Resizeit_Function[];

    } // JsPanelOptionsResizeit

    export interface JsPanelOptionsTheme {

        /**
         *
         * Sets the panel's background.
         *
         * Can be any valid value that can be applied to the CSS background shorthand property including images, gradients and css custom properties/variables.
         *
         * Default: '#ffffff'
         */
        bgPanel?: string; // default: '#ffffff'

        /**
         * Sets the content section's background.
         *
         * Can be any valid value that can be applied to the CSS background shorthand property including images, gradients and css custom properties/variables.
         *
         * Default: '#ffffff'
         */
        bgContent?: string; // default: '#ffffff'


        /**
         * Sets the footer section's background.
         *
         * Can be any valid value that can be applied to the CSS background shorthand property including images, gradients and css custom properties/variables.
         *
         * Default: '#f5f5f5'
         */
        bgFooter?: string; // default: '#f5f5f5'


        /**
         * Sets the font color for the header section.
         *
         * Can be any valid value that can be applied to the CSS color property.
         *
         * Default: '#000000'
         */
        colorHeader: string; // default: '#000000'

        /**
         * Sets the font color for the content section.
         *
         * Can be any valid value that can be applied to the CSS color property.
         *
         * Default: '#000000'
         */
        colorContent: string; // default: '#000000'

        /**
         * Sets the font color for the footer section.
         *
         * Can be any valid value that can be applied to the CSS color property.
         *
         * Default: 000000
         */
        colorFooter: string; // default: '#000000'

        /**
         * Sets the CSS border shorthand property.
         *
         * So this setting must have values for border-width, border-style and border-color like '2px solid black'.
         *
         * **Any value of panel option border is ignored.**
         *
         * Default: undefined
         */
        border: string; // default: undefined

        /**
         * Sets the CSS border-radius shorthand property.
         *
         * Any value of panel option borderRadius is ignored.
         */
        borderRadius: string; // default: undefined


    } // JsPanelOptionsTheme


    export interface JsPanelOptions {
        /**
         * Adds an additional close control to the right top corner of the panel. This might be handy e.g. if the complete header section is removed and therefore all regular controls as well.
         *
         * Type:          Integer
         * Default:           undefined
         * Supported values:        Currently the only supported value is: 1
         *
         * Examples:
         * addCloseControl: 1,
         */
        addCloseControl?: boolean;

        /**
         * Applies a css animation to the panel when inserted into the document.
         *
         * Type:         String
         * Default:           undefined
         * Supported values:   A single classname or a list of space separated classnames Notes:
         *
         * Currently there is only one built-in animation: 'jsPanelFadeIn'
         * You may use third party animation libraries like Animate.css or Magic Animations
         *
         * Examples:
         * animateIn: 'jsPanelFadeIn',
         */
        animateIn?: string;

        /**
         * Applies a css animation to the panel when inserted into the document.
         *
         * Type:         String
         * Default:           undefined
         * Supported values:   A single classname or a list of space separated classnames Notes:
         *
         * Currently there is only one built-in animation: 'jsPanelFadeIn'
         * You may use third party animation libraries like Animate.css or Magic Animations
         *
         * Examples:
         * animateIn: 'jsPanelFadeIn',
         */
        animateOut?: string;

        /**
         *Closes a panel automatically after a specified time.
         *
         *Type:
         *<ul>
         *       <li>Object - see description in Object properties
         *       <li>Integer - sets a time in milliseconds until panel closes and uses defaults for the other properties as described in Object properties
         *       <li>Boolean true - uses the defaults described in Object properties
         *</ul>
         *
         *Default:
         *       undefined
         *
         *Object properties:
         *time - Integer or String; default: '8s'
         *           Integer is interpreted as time in milliseconds until the panel closes
         *           String can be any value that can be assigned to the CSS property animation-duration
         *progressbar - Boolean; default: true
         *            By default the progressbar is shown. false turns it off
         *            If progressbar is set to false any setting of background has no effect
         *background - String; defaults to the primary color of the theme success
         *        Allows to set a custom background for the progressbar. Supported values include:
         *    <ul>
         *        <li>any valid css color value or gradient</li>
         *        <li>any color name (without modifier) that can be applied to option theme</li>
         *        <li>any built-in theme name (without modifier)</li>
         *        <li>Any background setting has no effect when progressbar is set to false</li>
         *    </ul>
         *
         *Example:
         *
         *autoclose: {
         *    time: '6s',
         *    background: 'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,255,17,1) 100%)'
         *}
         */
        autoclose?: number | boolean | {
            time?: number | string,
            progressbar?: boolean,
            background?: string
        };


        /**
         * Applies a CSS border to all four sides of the panel.
         *
         * Info:
         *     To add a border to an existing panel, use the panel method `setBorder()`.
         *
         * Type:
         *     String
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     The string may be any valid string you could use as a CSS border shorthand value, with the following behavior (in parts deviating from the standard):
         *     - `border-width` if omitted defaults to 'medium' as standardized
         *     - `border-style` if omitted defaults to 'solid' instead of 'none'
         *     - `border-color` if omitted defaults to the primary theme color instead of currentcolor
         *     - Allowed values for `border-color` include all color names usable as jsPanel theme
         *     - New as of v4.16.0, all three values can be set with a CSS custom property/variable
         *
         * Example 1:
         * <pre>
         * jsPanel.create({
         *     theme:  "crimson",
         *     border: "thick dashed orange"
         * });
         * </pre>
         *
         * Example 2:
         * <pre>
         * jsPanel.create({
         *     theme:  "yellow",
         *     border: "dotted --myColor" // border-width defaults to 'medium'
         * });
         * </pre>
         */
        border?: string;


        /**
         * Applies a CSS border-radius to all four corners of the panel.
         *
         * Info:
         *     To add a border-radius to an existing panel, use the panel method `setBorderRadius()`.
         *
         * Type:
         *     String or Integer
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     - A string may be any valid string you could use as a CSS border-radius shorthand value. New as of v4.16.0, the string can be a CSS custom property/variable.
         *     - A number will be used as a pixel value.
         *
         * Example 1:
         * <pre>
         * jsPanel.create({
         *     theme: 'crimson filled',
         *     borderRadius: '.5rem'
         * });
         * </pre>
         *
         * Example 2:
         * <pre>
         * jsPanel.create({
         *     theme: 'crimson filled',
         *     borderRadius: '--myBorderRadius'
         * });
         * </pre>
         *
         */
        borderRadius?: string | number;

        /**
         * Applies a CSS box-shadow to the panel.
         *
         * Type:
         *    Integer
         *
         * Default:
         *    3
         *
         * Supported values:
         *      An integer in the range 0 to 5, where 0 applies no shadow at all, and 5 applies the "largest" shadow.
         *
         * Example:
         * <pre>
         * jsPanel.create({
         *     boxShadow: 5
         * });
         * </pre>
         */
        boxShadow?: number;

        /**
         * A callback function to execute after the panel was inserted into the document.
         *
         * Type:
         *     Function or Array of functions
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     A single function or an array of functions. Each function receives the panel as an argument,
         *     and the keyword `this` inside the function also refers to the panel.
         *
         * Example 1 - Simple Function:
         * <pre>
         * jsPanel.create({
         *     callback: function () {
         *         this.content.innerHTML = '<p>Added via option.callback.</p>';
         *     }
         * });
         * </pre>
         *
         * Example 2 - Using an array:
         * <pre>
         * jsPanel.create({
         *     callback: [
         *         panel => {
         *             panel.content.innerHTML = '<p>Added via option.callback.</p>';
         *         },
         *         panel => {
         *             // do something else ...
         *         }
         *     ]
         * });
         * </pre>
         */
        callback?: JsPanelCallback | JsPanelCallback[];

        /**
         * Closes a panel on pressing the Esc key. If more than one panel in the document has this option enabled,
         * each Esc keypress closes the topmost (highest z-index) panel.
         *
         * Type:
         *     Boolean, Function
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     - `true`: Closes a panel on pressing the Esc key. If more than one panel in the document has this option enabled, each Esc keypress closes the topmost (highest z-index) panel.
         *     - `false`: Has no effect at all.
         *     - A function will simply execute and the panel is not closed unless it's closed from within the function. The function receives the panel as an argument, and the keyword `this` inside the function also refers to the panel. Note that:
         *         - A truthy return value will immediately stop processing other panels.
         *         - A falsy return value will close the next panel in sequence where `closeOnEscape` is set.
         *
         * Example 1:
         * <pre>
         * jsPanel.create({
         *     closeOnEscape: true
         * });
         * jsPanel.create({
         *     theme: 'info',
         *     position: 'center 50 50',
         *     content: '<p>This panel will not close on hitting the <kbd>ESC</kbd> key.</p>'
         * });
         * jsPanel.create({
         *     closeOnEscape: true,
         *     position: 'center 100 150',
         *     callback: function () {
         *         let content = this.content;
         *         jsPanel.create({ // note that this is a child panel
         *             container: content,
         *             theme: 'warning',
         *             contentSize: '200 80'
         *         });
         *     }
         * });
         * </pre>
         *
         * Example 2:
         * <pre>
         * jsPanel.create({
         *     closeOnEscape: true
         * });
         * jsPanel.create({
         *     closeOnEscape: () => {
         *         return false;
         *     },
         *     theme: 'info',
         *     position: 'center 50 50',
         *     content: '<p>This panel will not close on hitting the <kbd>ESC</kbd> key...</p>'
         * });
         * </pre>
         */
        closeOnEscape?: boolean | (() => boolean) | ((panel?: JsPanel) => boolean);


        /**
         * `option config` is a predefined configuration object that will be merged with the standard jsPanel configuration object.
         * This can be useful when you have a number of panels sharing the same options.
         *
         * Type:
         *     Object
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     A plain object with a key:value pair for each panel option.
         *
         * Example:
         * <pre>
         * let hintConfig = {
         *     position: 'center-top 0 10 down',
         *     contentSize: '330 auto',
         *     border: 'thin',
         *     header: false,
         *     addCloseControl: 1
         * };
         *
         * jsPanel.ajax({
         *     url: 'docs/sample-content/flexbox/fb-1a.html',
         *     done: function(xhr) {
         *         jsPanel.hint.create({
         *             config: hintConfig,
         *             theme: 'success filledlight',
         *             content: xhr.responseText
         *         });
         *     }
         * });
         *
         * window.setTimeout(function() {
         *     jsPanel.ajax({
         *         url: 'docs/sample-content/flexbox/fb-1b.html',
         *         done: function(xhr) {
         *             jsPanel.hint.create({
         *                 config: hintConfig,
         *                 theme: 'dimgray filledlight',
         *                 content: xhr.responseText
         *             });
         *         }
         *     });
         * }, 1000);
         * </pre>
         */
        config?: JsPanelOptions;

        /**
         * Sets the parent element of the panel.
         *
         * Type:
         *     String or Node object
         *
         * Default:
         *     'window'
         *
         * Supported values:
         *     - String 'window': The panel is appended to the <body> element and positioned fixed within the browser viewport.
         *     - String !== 'window': Interpreted as a selector string, and the first element matching the selector is used as the container for the panel. The panel is positioned absolute within this container.
         *     - Node whose `nodeType` reads 1: The panel is appended to this object.
         *
         * Detailed description:
         *     By default, the `container` option is set with the string 'window', meaning the panel is appended to the <body> element.
         *     If `container` is a selector string (other than 'window'), it's passed to `document.querySelector()`, and the first matching element is used as the container.
         *     If `container` is an Object with a `nodeType` property of 1, the panel is appended to this object. Every DOM element in JavaScript has a nodeType property. The value 1 for nodeType signifies that the object is an HTMLElement or a Node that is an element node (like a <div>, <span>, etc.)
         *     If `container` does not return a valid container, no panel is created, and an error panel is shown.
         *
         * Important note:
         *     If you set the `container` option to an element other than <body>, the container must have a CSS position value of either 'relative', 'absolute', or 'fixed' for correct panel positioning.
         *
         * Example:
         * <pre>
         * jsPanel.create({
         *     container: 'div.main-content'
         * });
         * </pre>
         */
        container?: string | HTMLElement | HTMLElement[];


        /**
         * Adds content to the content section of the panel.
         *
         * Type:
         *     String, Node object, or Function
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     See detailed description below.
         *
         * Detailed description:
         *     - A String: Added to the content section using `Element.innerHTML`. This parses the string as HTML and inserts it into the content section.
         *       Security considerations for String:
         *         - Inline script is executed.
         *         - Content of script tags is not executed.
         *     - A Node: Appended to the content section using `ParentNode.append()`.
         *       Security considerations for Node:
         *         - Inline script is executed.
         *         - Content of script tags is executed.
         *     - A Function: Called with the panel as an argument. The keyword `this` inside the function refers to the panel. Any content generated by the function must be appended by the function itself.
         *       Security considerations for Function:
         *         - Depends on what the function does.
         *
         * Basic examples:
         * <pre>
         * // Using a string
         * jsPanel.create({
         *     content: '<p>Appended with <a href="...">Element.innerHTML</a></p>',
         *     position: '-100 -100'
         * });
         *
         * // Using an element
         * let el = document.createElement('p');
         * el.innerHTML = 'Appended with <a href="...">ParentNode.append()</a>';
         * jsPanel.create({
         *     content: el
         * });
         *
         * // Using a function
         * jsPanel.create({
         *     content: (panel) => {
         *         let el = document.createElement('p');
         *         el.className = 'p-1';
         *         el.textContent = 'The function has to include code adding the content to the panel.';
         *         panel.content.append(el);
         *     },
         *     position: '100 100'
         * });
         * </pre>
         *
         * Example 2 - Displays a video:
         * <pre>
         * jsPanel.create({
         *     content: "<video controls autoplay width='640' height='360'><source src='...' type='video/mp4'></video>",
         *     contentSize: 'auto',
         *     contentOverflow: 'hidden',
         *     headerTitle: "content: HTML5 video",
         *     theme: "#304322 filled"
         * });
         * </pre>
         *
         * Example 3 - Displays a spherical panorama image in an iframe:
         * <pre>
         * jsPanel.create({
         *     theme: '#011842 filled',
         *     headerTitle: 'Spherical Panorama Image',
         *     contentSize: {
         *         width:  window.innerWidth * 0.8,
         *         height: window.innerHeight * 0.8
         *     },
         *     contentOverflow: 'hidden',
         *     content: '<iframe src="img/071203/pano.html" style="width: 100%; height: 100%;"></iframe>'
         * });
         * </pre>
         *
         *
         * Some additional information:
         *       Differences between `ParentNode.append()` and `Node.appendChild()`:
         *         - `ParentNode.append()` allows appending DOMString objects, whereas `Node.appendChild()` only accepts Node objects.
         *         - `ParentNode.append()` has no return value, whereas `Node.appendChild()` returns the appended Node object.
         *         - `ParentNode.append()` can append several nodes and strings, whereas `Node.appendChild()` can only append one Node object.
         *
         *
         * jQuery:
         *     If the content is a jQuery object, insert the item with the index 0.
         *     Example: `var jq = $("<p>jQuery object ...</p>"); jsPanel.create({ content: jq[0] });`
         *
         * Creating a DOM node from a string:
         *     Use the global method `jsPanel.strToHtml()`.
         *     Example:
         *     <pre>
         *     var str = '<p class="I_was_clicked">Clickable</p><p>Not clickable</p>';
         *     var df = document.createRange().createContextualFragment(str);
         *     var p = df.querySelector('p');
         *     p.addEventListener('click', function(e){
         *       alert(e.target.className);
         *     });
         *     jsPanel.create({ content: df });
         *     </pre>
         *
         * Using `content` with `contentAjax`:
         *     To show a loading indicator while waiting for content to load, combine `content` and `contentAjax`.
         *     Example:
         *     <pre>
         *     jsPanel.create({
         *       content: '<div style="display:flex;height:100%"><i style="margin:auto;" class="fad fa-spinner fa-spin fa-2x"></i></div>',
         *       contentAjax: {
         *         url: '../docs/sample-content/delayedContent.php',
         *         done: function (xhr, panel) {
         *           panel.content.innerHTML = xhr.responseText;
         *           panel.resize('auto 300').reposition();
         *         }
         *       }
         *     });
         *     </pre>
         */
        content?: string | HTMLElement | Node | ((panel: JsPanel) => void);

        /**
         * Gets a resource via XMLHttpRequest and optionally loads the response text into the content section of the panel.
         *
         * Type:
         *     String or Object
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     - String: URL pointing to a resource.
         *     - Object: Detailed configuration object.
         *
         * Detailed description:
         *     - A String value is treated as an URL. The responseText from the request is converted to a DocumentFragment and replaces the current content of the panel. This also executes code in script tags contained in the responseText.
         *     - An Object allows for a more detailed request configuration. If 'url' is the only parameter, it acts similarly to a string input.
         *
         * SUPPORTED PROPERTIES OF THE CONFIGURATION OBJECT:
         * - url: String URL to send the request to.
         * - method: HTTP request method, default 'GET'.
         * - async: Perform the operation asynchronously, default true.
         * - data: Body of data for the request.
         * - user: Optional username for authentication.
         * - pwd: Optional password for authentication.
         * - timeout: Milliseconds before request is terminated, default 0.
         * - withCredentials: Use credentials for cross-site requests, default false.
         * - responseType: Defines the response type.
         * - done: Function called after successful completion of the request.
         * - fail: Function called when the request fails.
         * - always: Function called after the request completes, regardless of status.
         * - beforeSend: Function executed before sending the request.
         * - autoresize: Automatically resize the panel after request completion, default true.
         * - autoreposition: Automatically reposition the panel after request completion, default true.
         *
         * Examples:
         *
         * Example 1 - Basic Usage:
         * <pre>
         * // All 3 examples below yield the same result
         * jsPanel.create({
         *     contentAjax: 'docs/sample-content/sampleContent2.html',
         *     position: 'center -50 -50'
         * });
         * // ...
         * </pre>
         *
         * Example 2 - Sending Data to the Server:
         * <pre>
         * jsPanel.create({
         *     contentSize: '350 auto',
         *     contentAjax: {
         *         method: 'POST',
         *         url: 'docs/sample-content/samplePHP.php',
         *         data: "fn=Stefan&ln=Sträßer",
         *         done: function (xhr, panel) {
         *             panel.content.innerHTML = xhr.responseText;
         *         },
         *         beforeSend: function() {
         *             this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
         *         }
         *     }
         * });
         * </pre>
         *
         * Example 3 - Loading Page Fragments (New in v4.11.0):
         * <pre>
         * jsPanel.create({
         *     contentAjax: 'docs/sample-content/sampleContent2.html .container'
         * });
         * // ...
         * </pre>
         *
         * Note: The url string may contain a selector indicating only a part of the loaded document to be inserted.
         * For example, 'docs/sample-content/sampleContent2.html .container' loads only the elements matching '.container' from the response.
         */
        contentAjax?: string | contentAjaxOptions;


        /**
         * Gets a resource via the Fetch API and optionally loads the response into the content section of the panel.
         *
         * Type:
         *     String or Object
         *
         * Default:
         *     undefined
         *
         * Supported values:
         *     - String: URL pointing to a resource.
         *     - Object: Detailed configuration object.
         *
         * Detailed description:
         *     - A String value is treated as an URL. The response from the request is converted to a DocumentFragment and replaces the current content of the panel. This also executes code in script tags contained in the response.
         *     - An Object allows for a more detailed request configuration. If 'resource' is the only parameter, it acts similarly to a string input.
         *
         * SUPPORTED PROPERTIES OF THE CONFIGURATION OBJECT:
         * - resource: String URL pointing to the resource.
         * - bodyMethod: Method to extract content from the response ('arrayBuffer', 'blob', 'formData', 'json', or 'text').
         * - fetchInit: Additional request options (see Fetch API documentation).
         * - done: Function called after successful completion of the request.
         * - beforeSend: Function executed before sending the request.
         * - autoresize: Automatically resize the panel after request completion, default true.
         * - autoreposition: Automatically reposition the panel after request completion, default true.
         *
         * Examples:
         *
         * Example 1 - Basic Usage:
         * <pre>
         * // All 3 examples below yield the same result
         * jsPanel.create({
         *     contentFetch: 'docs/sample-content/sampleContent2.html'
         * });
         * // ...
         * </pre>
         *
         * Example 2 - Loader and Complete Icon:
         * <pre>
         * jsPanel.create({
         *     contentFetch: {
         *         resource: 'docs/sample-content/delayedContent.php',
         *         beforeSend: (fetchConfig, panel) => {
         *             panel.headerlogo.innerHTML = "<span class='fad fa-spinner fa-spin ml-2'></span>"
         *         },
         *         fetchInit: {
         *             method: 'POST'
         *         },
         *         done: (response, panel) => {
         *             panel.content.innerHTML = response;
         *             panel.headerlogo.innerHTML = "<span class='fad fa-check ml-2'></span>";
         *             panel.resize('auto 300').reposition();
         *         }
         *     }
         * });
         * </pre>
         *
         * Note: The `fetchInit` property allows for the configuration of various Fetch API request options.
         * The `bodyMethod` parameter determines how the response content is processed.
         */
        contentFetch?: string | contentFetchOptions


        /**
         * Sets CSS overflow properties for the content section of the panel.
         *
         * Type:
         *     String
         *
         * Default:
         *     'hidden auto'
         *
         * Supported values:
         *     - String: Any valid string for the CSS overflow shorthand property. If two keywords are specified, the first applies to overflow-x and the second to overflow-y. Otherwise, both overflow-x and overflow-y are set to the same value.
         *
         * Example:
         * <pre>
         * jsPanel.create({
         *     contentOverflow: 'scroll',
         *     contentAjax: 'docs/sample-content/sampleContent.html'
         * });
         * </pre>
         *
         * Note: The 'contentOverflow' property allows you to control how overflowed content in the panel is handled, similar to the CSS overflow property.
         */
        contentOverflow?: string;


        /**
         * Sets the dimensions of the content section of the panel whereas option.panelSize sets the dimensions of the complete panel.
         * *** NOTE:  To resize an existing panel use the panel method resize() ***
         *
         * Supported values:
         * Object
         *      a plain object should have the 2 properties width and height. Each property may have a Number, String or Function as value where:
         *      a Number is assumed to be a pixel value.
         *      a String may be unit-less or with one of the css length units.
         *      a Function has to return a Number or String according to the rules above. The function receives the panel as argument and the keyword this inside the function also refers to the panel.
         *      if the object supplies only one property (width or height) the missing one is used with the same value as the one provided
         * String
         *      a string should contain 2 values separated by a single space. The first value for width and the second value for height.
         *      if only one value is set it's used for both width and height.
         *      values may have all css length units.
         *      a unit-less value is assumed to be in pixels.
         *      option panelSize overrides a setting of option contentSize.
         *          css calc() works in object only
         *
         * Examples:
         *      contentSize: "600 350"
         *      contentSize: "auto"
         *      contentSize: {
         *          width: '400px',
         *          height: '200px'
         *     }
         */
        contentSize?: string | {
            width: number | string | ((panel: JsPanel) => number | string),
            height: number | string | ((panel: JsPanel) => number | string)
        };

        /**
         * Applies custom CSS classes to selected elements of the panel HTML template.
         *
         * Notes:
         *
         *  - Some default styles defined in jspanel.css have a higher specificity than styles added via option.css. So it's not guarantied that all styles defined in those extra CSS classes actually are applied. That's not a bug. Some styles are simply not meant to be overridden too easily in order to prevent unwanted side effects.
         *  - You might have to use keys containing illegal characters. Just wrap them in quotation marks as in example 1 below.
         *  - Option css is applied before any content is inserted into the panel's content section. That means you can only add css classes to elements that are part of the panel at that time.
         *
         * Type:
         *      Object
         * Default:
         *      undefined
         * Supported values:
         *
         *      Object with key/value pairs according to the rules described below.
         *
         * An example usage might look like:
         * <pre>
         * css: {
         *     content: 'classA classB',   // adds the classes to ".jsPanel-content"
         *     ftr: 'classC',              // adds the classes to ".jsPanel-ftr"
         *     panel: 'classD',            // adds the classes to ".jsPanel"
         *     // more entries as needed ...
         * }
         * </pre>
         *
         * Keys:
         *      All CSS classnames in a panel start with jsPanel- followed by identifying word(s). So the CSS class of the content section is jsPanel-content. The part after jsPanel- is used as key.
         *
         *      So the key to address the element with the CSS class jsPanel-titlebar needs to be titlebar.
         *
         *      And the key to address the element with the CSS class jsPanel-hdr-toolbar needs to be 'hdr-toolbar'.
         *
         *  The only exception is the key for the outermost <div> element which has only the CSS classname jsPanel. To address this <div> you must use the key 'panel'.
         *
         * Values:
         *      The value must be a string with either a single CSS classname, or, a space separated list of CSS classnames.
         */
        css?: Record<string, string>

        /**
         * @property {any} data - Stores optional custom data. This option does not influence the shown panel in any way. It's merely a place to store optional data of any kind. However, when using the layout extension, the data passed to `data` is stored in localStorage/sessionStorage when calling `jsPanel.layout.save()`. Default value is `undefined`. Supported values include anything.
         *
         * @example
         * jsPanel.create({
         *     data: 'foobar',
         *     callback: function() {
         *         this.content.innerHTML = `<p>${this.options.data}</p>`;
         *     }
         * });
         */
        data?: any;

        /**
         * This option configures the dragit interaction.
         *
         * By default a jsPanel is draggable. Default drag handles are the header logo, the titlebar and the footer toolbar (if used). The content section and the header toolbar are not used as drag handle.
         *
         * Type:
         * - Object or false
         *  - boolean false disables the dragit interaction for this panel permanently
         *
         * Default:
         *
         * ```javascript
         * {
         *     cursor: 'move',
         *     handles: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr',
         *     opacity: 0.8,,
         *     disableOnMaximized: true
         * }
         * ```
         *
         *
         * JsPanelDragit properties:
         *  - axis type: string, default: undefined
         *  - containment type: number or array, default: undefined
         *  - cursor type: string, default: 'move'
         *  - disable type: boolean, default: undefined
         *  - disableOnMaximized type: boolean, default: true
         *  - drop type: object, default: undefined
         *  - grid type: array, default: undefined
         *  - handles type: selector string, default: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr'
         *  - opacity type: number, default: 0.8
         *  - start type: function, default: undefined
         *  - drag type: function, default: undefined
         *  - stop type: function, default: undefined
         *  - snap type: boolean or object, default: undefined
         *
         */
        dragit?: boolean | JsPanelOptions_Dragit


        /**
         * This option adds a footer toolbar to the panel which by default will also act as drag handle.
         *
         * Type:
         * - String, Array, Node or Function
         *
         * Default:
         * - undefined
         *
         * Supported values:
         * - A String is simply used as content and added to the footer toolbar using Element.innerHTML
         * - Array items are added to the toolbar one by one using ParentNode.append(). Items may be Strings or Node objects
         * - A Node is used as content and added to the toolbar using ParentNode.append()
         * - A Function is executed and its return value is used as content for the toolbar
         * - A returned String is added using Element.innerHTML
         * - Any other return value is added using ParentNode.append()
         * - The function receives the panel as argument and the keyword this inside the function also refers to the panel
         *
         *
         * Notes:
         *
         * By default the complete footer toolbar including its contents act as drag handle. If you don't want a specific footer element act as drag handle simply add the class 'jsPanel-ftr-btn' to it.
         *
         * To add a toolbar to an existing panel use the panel method addToolbar().
         *
         * The main toolbar element <div class="jsPanel-ftr"></div> is always present, even when you don't configure a toolbar (in this case it's simply hidden).
         *
         * When a toolbar is configured it automatically gets the additional CSS class 'active' in order to show it.
         *
         * So in order to hide/show a configured/existing toolbar you just need to toggle its 'active' class. For example with the global method jsPanel.toggleClass(panel.footer, 'active'); where panel is a reference to the panel and footer references the above mentioned toolbar <div>.
         *
         * @example
         * javascript
         * ``` javascript
         * jsPanel.create({
         *     footerToolbar: [
         *         '<span class="flex-auto">Some text content</span>',
         *         '<span class="jsPanel-ftr-btn bus"><i class="fad fa-bus"></i></span>',
         *         '<span class="jsPanel-ftr-btn train"><i class="fad fa-train"></i></span>',
         *         '<span class="jsPanel-ftr-btn car"><i class="fad fa-car"></i></span>',
         *     ],
         *     callback: (panel) => {
         *         // handler for the icons
         *         for (const btn of panel.footer.querySelectorAll('span')) {
         *             btn.addEventListener('click', (e) => {
         *                 let cl = e.target.closest('span').classList;
         *                 panel.content.innerHTML = `<p>You clicked the ${cl[cl.length - 1]} icon</p>`;
         *             });
         *         }
         *     }
         * });
         * ```
         *
         */
        footerToolbar?: string | (string | Node)[] | Node | ((panel: JsPanel) => string | Node);


        /**
         * This option removes or auto show/hides the complete header section.
         *
         * Type:
         * - Boolean or String
         *
         * Default:
         * - true
         *
         * Supported values:
         * - Boolean
         * - true permanently shows the header section
         * - false permanently removes the header section
         * - String (the only supported string 'auto-show-hide' hides the complete header section until the mouse moves over the area normally occupied by the header. Moving away from the header section again hides the header)
         *
         * Info
         *
         * Remember that removing the header section also removes all default controls. And unless you configure a footer toolbar there's no drag handle either.
         *
         * If you 'auto-show-hide' the header section and want the panel to have a border don't use option border. Apply a border to the content section instead as shown in example 2.
         *
         * Example 1
         * ``` javascript
         * jsPanel.create({
         *     header: false,
         *     border: 'dimgrey',
         *     addCloseControl: 1
         * });
         * ```
         *
         * Example 2
         * ``` javascript
         * jsPanel.create({
         *     header: 'auto-show-hide',
         *     theme: 'red',
         *     callback: panel => {
         *         panel.content.style.border = 'medium solid red';
         *     }
         * });
         * ```
         *
         */
        header?: string | boolean;


        /**
         * With this option you can configure which panel controls are shown, set their size and add additional custom controls.
         *
         * Info
         *
         * To alter a control's status of an existing panel use the panel method setControlStatus()
         *
         * Type:
         * - Object or String
         * Default:
         *  -'md' for every control
         * Supported values:
         * - String (shorthand) or Object described below
         *
         * String
         *  - A string offers a few shorthand values for various standard configurations as described below
         *
         * Detailed description of headerControls configuration options
         * - close
         * - maximize
         * - normalize
         * - minimize
         * - smallify
         * - undefined
         *
         *             Each one of these options may have one of the following three string values:
         *
         *             'remove' removes the control from the DOM
         *             'disable' visibly disables the control until it is enabled again. To enable a disabled control use method setControlStatus()
         *             'hide' sets the controls's css display property to 'none'. To show a hidden control use method setControlStatus()
         *              size String undefined or 'xs'| 'sm'| 'md'| 'lg'| 'xl'
         *             The size option is used to set the size of the controls and the header title.
         *
         *             Supported settings are either one of:
         *
         *              'xs', 'sm', 'md', 'lg', 'xl'
         *
         * - add a new Object or Array of objects undefined
         * This option can be used to add one or more custom controls to the controlbar.
         *
         * Its value is either a single Object with the settings for a single control or an Array of such objects.
         *
         * Each object supports the following properties:
         *
         * - html String undefined required. This property contains the HTML to be inserted into the DOM like:          * <span class="fad fa-bars"></span>          * If this property is missing no control is added.
         * - name String undefined.  Internally the html you set up with parameter html is wrapped in a <div> just like the default controls including a few default CSS classes. An additional class is composed of the string 'jsPanel-btn-' concatenated with the name setting. Assuming the html setting from above and a name setting of 'menu' the complete html added results in:
         * @example
         * ``` html
         * <div class="jsPanel-btn jsPanel-btn-menu jsPanel-btn-md">
         *     <span class="fad fa-bars"></span>
         * </div>
         * ```
         * The name setting can be used to address the the custom control in the panel method setControlStatus()
         *
         * Even directly in option headerControls the new control can be addressed with its name value in order to disable or hide it.
         *
         * - handler Function undefined
         * The handler for the control. By default it uses the same events as the standard controls.
         * The function receives the panel and the control as arguments and the keyword this inside the function refers to the panel.
         *
         * - position Integer 1
         * This parameter is used to select the position where the new control is to appear within the controls already there. The number corresponds to the other control's source order within the controlbar:
         *
         * 1. smallify
         * 2. minimize
         * 3. normalize
         * 4. maximize
         * 5. close
         *
         * position defaults to 1 which means that the new control is added as first control from left in a left-to-right context or as first control from right in a right-to-left context.
         *
         *  - afterInsert Function undefined
         * A function to call once after the control was inserted. The function receives the control as argument and the keyword this inside the function also refers to the control.
         *
         *
         * headerControls shorthand
         * A shorthand string consists of at least one value specifying which controls to show and an optional second value separated by a space setting the size of the controls. The shorthand string can not be used to set the status of an individual control or to add custom controls.
         *
         * The first value can be one of:
         *
         * 'closeonly' - shows only the close control. All other controls are removed from the DOM
         * 'none' - all controls are removed from the DOM
         * The second (optional) value may be one of the size values described above.
         *
         * Example 1
         *``` javascript
         * jsPanel.create({
         *     headerControls: {
         *         minimize: 'disable',
         *         smallify: 'remove'
         *     }
         * });
         *```
         *
         * Example 2
         * ``` javascript
         * jsPanel.create({
         *     headerControls: 'closeonly xs', // shorthand
         *     position: 'center 50 50'
         * });
         * ```
         * <p> </p>
         *
         *
         * Example 3
         *``` javascript
         * jsPanel.create({
         *     headerControls: {
         *         add: {
         *             html: '<span class="fad fa-bars"></span>',
         *             name: 'menu',
         *             position: 6,
         *             handler: (panel, control) => {
         *                 panel.content.innerHTML = '<p>You clicked the "menu" control</p>';
         *             }
         *         },
         *         smallify: 'remove',
         *         // menu: 'disable' // you could disable or hide the new control right here
         *     }
         * });
         * ```
         */
        headerControls?: string | {
            add?: JsPanelHeaderControlsAdd | JsPanelHeaderControlsAdd[];
            close?: JsPanelHeaderControlsValues;
            maximize?: JsPanelHeaderControlsValues;
            minimize?: JsPanelHeaderControlsValues;
            normalize?: JsPanelHeaderControlsValues;
            smallify?: JsPanelHeaderControlsValues;
        };


        /**
         *
         * This option adds a logo to the top left corner of the panel (left of the header title).
         *
         *
         *   **Type:** String
         *
         *  **Default:** undefined
         *
         *  **Supported values:**
         *   - A String not starting with a `<` character is assumed to be an url pointing to a resource which is inserted as logo.
         *   - Any other String value is inserted using Element.innerHTML
         *
         * @example
         *``` javascript
         * jsPanel.create({
         *   headerLogo: "img/flyer53-logo.jpg"
         * });
         *
         * jsPanel.create({
         *   headerLogo: "<span class='fad fa-spinner fa-spin ml-2'></span>",
         *   position: 'center 50 50'
         * });
         * ```
         */
        headerLogo?: string| HTMLElement;

        /**
         * This option sets the header title.
         *
         * To set or change the title of an existing panel use the panel method setHeaderTitle()
         *
         * Type:
         *      - String, Node or Function
         *
         * Default:
         *      - 'jsPanel'
         *
         * Supported values:
         * - A String value is inserted using Element.innerHTML
         * - A Node value is inserted using ParentNode.append()
         * - A Function return value is inserted using Element.innerHTML
         *
         * @example
         * ``` javascript
         * jsPanel.create({
         *   headerTitle: 'just another title'
         * });
         *
         * jsPanel.create({
         *     headerTitle: '<p>panel main title<br><small>smaller subtitle</small></p>',
         *     position: 'center 50 50'
         * });
         *
         * jsPanel.create({
         *   headerTitle: () => {
         *     let count = document.querySelectorAll('.jsPanel').length;
         *     return `Panel No: <mark class="px-1 rounded-full text-base">${count}</mark>`;
         *   },
         *   position: 'center 100 100'
         * });
         * ```
         */
        headerTitle?: string | HTMLElement | (() => string);

        /**
         * This option adds a header toolbar.
         *
         * **Type:**
         * String, Array, Node or Function
         *
         * ** Default:**
         * undefined
         *
         * **Supported values:**
         * ```
         * A String is simply used as content and added to the header toolbar using Element.innerHTML
         * Array items are added to the toolbar one by one using ParentNode.append(). Items may be Strings or Node objects
         * A Node is used as content and added to the toolbar using ParentNode.append()
         * A Function is executed and its return value is used as content for the toolbar
         * A returned String is added using Element.innerHTML
         * Any other return value is added using ParentNode.append()
         * The function receives the panel as argument and the keyword this inside the function also refers to the panel
         * ```
         *
         * **Notes**
         * ```
         * To add a toolbar to an existing panel use the panel method addToolbar().
         * The main toolbar element <div class="jsPanel-hdr-toolbar"></div> is always present, even when you don't configure a toolbar (in this case it's simply hidden).
         * When a toolbar is configured it automatically gets the additional CSS class 'active' in order to show it.
         * So in order to hide/show a configured/existing toolbar you just need to toggle its 'active' class. For example with the global method jsPanel.toggleClass(panel.headertoolbar, 'active'); where panel is a reference to the panel and headertoolbar references the above mentioned toolbar <div>.
         * ```
         *
         * @example
         * ``` javascript
         * jsPanel.create({
         *     headerToolbar: [
         *         '<span class="flex-auto">Some text content</span>',
         *         '<span class="jsPanel-ftr-btn bus"><i class="fad fa-bus"></i></span>',
         *         '<span class="jsPanel-ftr-btn train"><i class="fad fa-train"></i></span>',
         *         '<span class="jsPanel-ftr-btn car"><i class="fad fa-car"></i></span>'
         *     ],
         *     callback: (panel) => {
         *         // handler for the icons
         *         for (const btn of panel.headertoolbar.querySelectorAll('span')) {
         *             btn.addEventListener('click', (e) => {
         *                 let cl = e.target.closest('span').classList;
         *                 panel.content.innerHTML = '<p>You clicked the ${cl[cl.length - 1]} icon</p>';
         *             });
         *         }
         *     }
         * });
         * ```
         * @link https://jspanel.de/#options/headerToolbar
         */
        headerToolbar?: string | (string | Node)[] | Node | ((panel: JsPanel) => string | Node);


        /**
         * By default jsPanel uses a set of built-in SVG icons for the controls. If you prefer to use another set of icons you can configure it with this option.
         *
         * Supported are Font Awesome icons, Material Icons and Glyphicons (Bootstrap 3).
         *
         * **Type:**
         * String or Array
         *
         * **Default:**
         * undefined
         *
         * **Supported values:**
         * String
         *
         * 'fa' will use Font Awesome icons     and requires at least Font Awesome v4.7.0.
         *
         * 'fas' will use Font Awesome 5 Pro solid icons     and requires Font Awesome 5 Pro Solid.
         *
         * 'far' will use Font Awesome 5 Pro regular icons     and requires Font Awesome 5 Pro Regular.
         *
         * 'fal' will use Font Awesome 5 Pro light icons     and requires Font Awesome 5 Pro Light.
         *
         * 'fad' will use Font Awesome 5 Pro duotone icons     and requires Font Awesome 5 Pro Duotone.
         *
         * 'material-icons' will use Material Design icons expand_less call_received fullscreen close
         *
         * 'bootstrap' or 'glyphicon' will use Glyphicons. Remember that only Bootstrap 3.x comes with a limited set of Glyphicons. Bootstrap 4 does not include icons anymore.
         *
         * **Array**
         * With an array you can fully customize which icons to use.
         *
         *
         *
         * **Font Awesome**
         *
         * This website uses Font Awesome 5 Pro SVG with JS Subset
         * Font Awesome 5 icons should work with the Web Fonts and the SVG Framework. SVG Sprites are not supported
         * If you intend to use Font Awesome 5 light, regular, strong or duotone variants you need Font Awesome 5 Pro
         *
         *
         *``` javascript
         * jsPanel.create({
         *     iconfont: 'material-icons',
         *     headerTitle: 'Material icons',
         *     position: 'center -50 -50'
         * });
         * jsPanel.create({
         *     iconfont: 'fal',
         *     headerTitle: 'Font-Awesome 5 light',
         *     theme: 'success'
         * });
         * jsPanel.create({
         *     iconfont:  'fad',
         *     headerTitle: 'Font-Awesome 5 duotone',
         *     position: 'center 50 50',
         *     theme: 'danger'
         * });
         * jsPanel.create({
         *     headerTitle: 'Built-in SVGs',
         *     position: 'center 100 100',
         *     theme: 'primary'
         * });
         * ```
         *
         * **Using an Array**
         *
         * Using an array you can completely customize which icons to use. The array has to contain 5 class names defining the icons to use for the respective control. Each control will get the class 'custom-control-icon' plus one of the class names from the array.
         *
         * At first you need some CSS defining the icons:
         * ``` javascript
         *
         * .custom-control-icon.custom-smallify::before{
         *     content: "\025B4";
         *     / * content: url(../../images/close16x16.png);* /
         *     }
         * .custom-control-icon.custom-minimize::before { content: "\0268A"; }
         * .custom-control-icon.custom-normalize::before{ content: "\02750"; }
         * .custom-control-icon.custom-maximize::before{ content: "\02610"; }
         * .custom-control-icon.custom-close::before{ content: "\02715"; }
         * ```
         *
         * Then you can use the custom icons
         *
         * ``` javascript
         * jsPanel.create({
         *     // it's important to maintain the proper sequence of class names in the array
         *     iconfont: ['custom-smallify', 'custom-minimize', 'custom-normalize', 'custom-maximize', 'custom-close']
         * });
         * ```
         *
         *
         * @link https://jspanel.de/#options/iconfont
         */
        iconfont?: string | string[];

        /**
         * By default every panel gets an ID attribute value composed of the string jsPanel- followed by a number (starting with 1) which is increased by 1 with each new panel and only reset on page reload.
         *
         * However, you can assign a specific ID value with this option.
         *
         * @link https://jspanel.de/#options/id
         */
        id?: string | (() => string);


        /**
         * This option limits the width and height of a maximized panel in order to keep a specified distance from the top, right, bottom and left boundaries of either the browser viewport (if option container is set to 'window' which is the default) or the panel's parent element.
         *
         * **Type:**
         *
         * Array or Integer
         *
         * **Default:**
         *
         * 0
         *
         * **Supported values:**
         *
         * Array may contain 1 through 4 numbers where
         *
         * - [a] maps to [a, a, a, a]
         * - [a, b] maps to [a, b, a, b]
         * - [a, b, c] maps to [a, b, c, b]
         *
         * Array indices 0 through 3 correspond to top, right, bottom and left distances
         *
         * **Integer**
         *
         * is simply a shorthand for an array with 4 numbers of the same value
         *
         *
         * **Info**
         *
         * Option maximizedMargin is editable for existing panels with:
         *
         * ``` javascript
         * panel.options.maximizedMargin = value;
         *```
         *
         * However, options dragit.containment and resizeit.containment are not updated automatically when option maximizedMargin is changed for an existing panel.
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     maximizedMargin: [69, 5, 5, 5]
         * }).maximize();
         * ```
         *
         * @link https://jspanel.de/#options/maximizedMargin
         */
        maximizedMargin?: number | [number] | [number, number] | [number, number, number, number];


        /**
         * By default a minimized panel is simply moved off-screen and a replacement element is positioned at bottom left of the browser viewport. You can setup a different behaviour with this option.
         *
         * **Type:**
         * String or Boolean
         * **Default:**
         * 'default'
         * **Supported values:**
         *
         * **String**
         *
         * - 'default' minimizes a panel to bottom left of browser viewport
         * - 'parent' minimizes a panel to bottom left of its parent element (but don't use this value for panels appended to other panels)
         * - 'parentpanel' use this value to minimize a child panel (a panel appended to the content section of another panel) to bottom left of its parent panel
         * - any other string is assumed to be a selector string matching a single element to minimize the panel to. This option will most likely require some css to achieve the expected result.
         *
         * **Boolean** false
         *
         * will not generate a replacement element for the panel. However, it's still moved off-screen and you have to implement your own code to get it back in view.
         * #testcontainer serves as parent for one of the demo panels
         *
         *
         *
         * **Example creating 2 panels**
         *
         * The first panel is appended to '#testcontainer' where it minimizes to. Further its dragit interaction is confined to its parent also.
         *
         * The second panel is appended to the content section of the first panel where it minimizes to and its dragit interaction is aso confined to its parent.
         *
         * @example
         * ``` javascript
         * // this panel minimizes to its parent element (div#testcontainer)
         * jsPanel.create({
         *     container: '#testcontainer',
         *     minimizeTo: 'parent',
         *     contentOverflow: 'hidden',
         *     dragit: {containment: 0},
         *     callback: (panel) => {
         *         // this panel minimizes to the content section of its parent panel
         *         jsPanel.create({
         *             container: panel.content,
         *             minimizeTo: 'parentpanel',
         *             headerControls: 'xs',
         *             maximizedMargin: 5,
         *             syncMargins: true,
         *             panelSize: '250 150',
         *             theme: 'orange'
         *         }).minimize();
         *     }
         * });
         * ```
         *
         * @link https://jspanel.de/#options/minimizeTo
         */
        minimizeTo?: string | 'default' | 'parent' | 'parentpanel' | boolean;


        /**
         * A function or an array of functions to be executed immediately before a panel closes.
         * This is invoked regardless of whether the panel is closed by a user or programmatically.
         * It can be used to cancel the closing of a panel.
         *
         *
         * **Important details on how onbeforeclose works**
         *
         * Internally option onbeforeclose always ends up as array. Regardless of whether you pass a single function, an array of functions, or nothing at all (an empty array in this case).
         *
         * This array is passed to Array.prototype.some() when the panel's close method is called. That means that the final outcome of onbeforeclose is determined by what Array.prototype.some() returns, not the individual function.
         *
         * Array.prototype.some() executes a callback function once for each element present in the array until it finds the one where callback returns a truthy value (a value that becomes true when converted to a Boolean). If such an element is found, Array.prototype.some() immediately returns true. Otherwise, Array.prototype.some() returns false.
         *
         * So when you use option onbeforeclose the panel closes only if the final return value of Array.prototype.some() is true.
         *
         * **Here's a simple example:**
         *
         * ``` javascript
         * jsPanel.create({
         *     onbeforeclose: function(panel) {
         *         confirm('Close panel?');
         *     }
         * });
         * ```
         * **What happens:**
         *
         * The onbeforeclose callback shown above is a single function.
         *
         * Nevertheless it ends up as an array containing this function as single item.
         *
         * Now when the close button is clicked the function is called from Array.prototype.some().
         *
         * The confirmation dialog pops up. But no matter what answer you click ... since the function doesn't return anything explicitly its return value is undefined which is a falsy value. So Array.prototype.some() also returns false and the panel doesn't close.
         *
         * So in order to be able to close the panel the function body must explicitly return the result from the confirmation dialog return confirm('Close panel?');.
         *
         *
         * **Lets add two more callbacks**
         *
         * ``` javascript
         * jsPanel.create({
         *     onbeforeclose: [
         *         function() {
         *             this.content.innerHTML = "<p>1st callback doesn't return anything. Don't mind!</p>"
         *         },
         *         function() {
         *             this.content.innerHTML += "<p>2nd callback executed, opens dialog ...</p>"
         *             return confirm('Close panel?');
         *         },
         *         function() {
         *             this.setTheme('danger');
         *             this.content.innerHTML += "<p>3rd callback executed only because 2nd callback returned <code>false</code></p>"
         *         }
         *     ],
         *     position: 'center-top 0 80'
         * });
         * ```
         *
         * **What happens:**
         *
         * 1st callback doesn't have a return value. So it's undefined which is falsy. Array.prototype.some() keeps on processing callbacks.
         *
         * 2nd callback opens a confirmation dialog and returns its result.
         *
         * When you click OK the confirmation dialog returns true. So does the 2nd callback. Now with this first truthy return value Array.prototype.some() immediately returns true and stops further processing of callbacks. The 3rd callback doesn't execute.
         *
         * When you click Cancel the confirmation dialog returns false. So does the 2nd callback. Array.prototype.some() continues to process callbacks and goes on with the 3rd callback.
         *
         * 3rd callback executes only when the previous two and thus Array.prototype.some() did not return true.
         *
         * How to edit onbeforeclose callbacks of existing panels
         *
         * Since option onbeforeclose always ends up as array internally you can use regular array methods to add or remove items from it.
         *          *
         * To add an onbeforeclose callback to an existing panel you could for example use:
         *
         * ``` javascript
         * let panel = jsPanel.create();
         *
         * panel.options.onbeforeclose.push(function() {
         *     return confirm('Close panel?');
         * });
         * ```
         *
         *
         * @type {OnBeforeClose | OnBeforeClose[]}
         * @default undefined
         * @param {JsPanel} panel - The panel that is about to be closed.
         * @param {string} status - The current status of the panel (e.g., 'normalized', 'maximized').
         * @param {boolean} [closedByUser] - True if the panel's close control was clicked to close the panel. Undefined (falsy) if close() method was called programmatically.
         *   - Inside the callback, the keyword `this` refers to the panel.
         * @returns {boolean} - Return false or a Typescript falsy from all the functions to allow the close to occur, true from AT LEAST ONE function to prevent the close.
         * @link https://jspanel.de/#options/onbeforeclose
         */
        onbeforeclose?: OnBeforeClose | OnBeforeClose[];

        /**
         * Function or array of function to execute immediately before a panel maximizes, regardless of whether the panel is closed by a user or programmatically. It may also be used to cancel maximizing of a panel.
         *
         * **Type:**
         *
         * Function or Array of functions
         *
         * **Default:**
         *
         * undefined
         *
         * ** Function arguments:**
         *
         * - panel the panel to maximize
         * - status the panel's current status (normalized, maximized, etc.)
         *
         * The keyword **this** inside the function refers to the panel.
         *
         * **Important details on how onbeforemaximize works**
         *
         * Internally option onbeforemaximize always ends up as array. Regardless of whether you pass a single function, an array of functions, or nothing at all (an empty array in this case).
         *
         * This array is passed to Array.prototype.some() when the panel's maximize method is called.
         *
         * That means that the final outcome of onbeforemaximize is determined by what Array.prototype.some() returns, not the individual function.
         *
         * Array.prototype.some() executes a callback function once for each element present in the array until it finds the one where callback returns a truthy value (a value that becomes true when converted to a Boolean).
         *
         * If such an element is found, Array.prototype.some() immediately returns true. Otherwise, Array.prototype.some() returns false.
         *
         * So when you use option onbeforemaximize the panel maximizes only if the final return value of Array.prototype.some() is true.
         *
         *
         * Here's a simple example:
         *``` javascript
         * jsPanel.create({
         *     onbeforemaximize: function(panel) {
         *         confirm('Maximize panel?');
         *     }
         * });
         * ```
         * **What happens:**
         *
         * The onbeforemaximize callback shown above is a single function.
         *
         * Nevertheless it ends up as an array containing this function as single item. Now when the maximize button is clicked the function is called from Array.prototype.some(). The confirmation dialog pops up. But no matter what answer you click ... since the function doesn't return anything explicitly its return value is undefined which is a falsy value. So Array.prototype.some() also returns false and the panel doesn't maximize. So in order to be able to maximize the panel the function body must explicitly return the result from the confirmation dialog return confirm('Maximize panel?');.
         *
         * **Lets add two more callbacks**
         *
         * ``` javascript
         * jsPanel.create({
         *     onbeforemaximize: [
         *         function() {
         *             this.content.innerHTML = "<p>1st callback doesn't return anything. Don't mind!</p>"
         *         },
         *         function() {
         *             this.setTheme('warning');
         *             this.content.innerHTML += "<p>2nd callback executed, opens dialog ...</p>"
         *             return confirm('Maximize panel?');
         *         },
         *         function() {
         *             this.setTheme('danger');
         *             this.content.innerHTML += "<p>3rd callback executed only because 2nd callback returned <code>false</code></p>"
         *         }
         *     ],
         *     position: '0 100'
         * });
         * ```
         *
         * ***What happens:***
         *
         * - 1st callback doesn't have a return value. So it's undefined which is falsy. Array.prototype.some() keeps on processing callbacks.
         * - 2nd callback opens a confirmation dialog and returns its result.
         * - When you click OK the confirmation dialog returns true. So does the 2nd callback. Now with this first truthy return value Array.prototype.some() immediately returns true and stops further processing of callbacks. The 3rd callback doesn't execute.
         * - When you click Cancel the confirmation dialog returns false. So does the 2nd callback. Array.prototype.some() continues to process callbacks and goes on with the 3rd callback.
         * - 3rd callback executes only when the previous two and thus Array.prototype.some() did not return true.
         *
         *
         * **How to edit onbeforemaximize callbacks of existing panels**
         *
         * Since option onbeforemaximize always ends up as array internally you can use regular array methods to add or remove items from it.
         *
         * To add an onbeforemaximize callback to an existing panel you could for example use:
         *
         *``` javascript
         *  let panel = jsPanel.create();
         *
         * panel.options.onbeforemaximize.push(function() {
         *     return confirm('Maximize panel?');
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onbeforemaximize
         */
        onbeforemaximize?: OnBeforeMaximize | OnBeforeMaximize[];

        /**
         * Function or array of function to execute immediately before a panel minimizes, regardless of whether the panel is minimized by a user or programmatically. It may also be used to cancel minimizing of a panel.
         *
         * **Type:**
         *
         * Function or Array of functions
         *
         * **Default:**
         *
         * undefined
         * **Function arguments:**
         *
         * - panel the panel to minimize
         * - status the panel's current status (normalized, maximized, etc.)
         *
         * The keyword **this** inside the function refers to the panel.
         *
         * **Important details on how onbeforeminimize works**
         *
         * Internally option onbeforeminimize always ends up as array.
         *
         * Regardless of whether you pass a single function, an array of functions, or nothing at all (an empty array in this case).
         *
         *
         * This array is passed to Array.prototype.some() when the panel's minimize method is called.
         *
         * That means that the final outcome of onbeforeminimize is determined by what Array.prototype.some() returns, not the individual function.
         *
         *
         * Array.prototype.some() executes a callback function once for each element present in the array until it finds the one where callback returns a truthy value (a value that becomes true when converted to a Boolean). If such an element is found, Array.prototype.some() immediately returns true.
         *
         * Otherwise, Array.prototype.some() returns false.
         *
         * So when you use option onbeforeminimize the panel minimizes only if the final return value of Array.prototype.some() is true.
         *
         *
         * Here's a simple example:
         *``` javascript
         * jsPanel.create({
         *     onbeforeminimize: function(panel) {
         *         confirm('Minimize panel?');
         *     }
         * });
         * ```
         *
         * **What happens:**
         *
         * The onbeforeminimize callback shown above is a single function.
         *
         * Nevertheless it ends up as an array containing this function as single item.
         *
         * Now when the minimize button is clicked the function is called from Array.prototype.some().
         *
         * The confirmation dialog pops up. But no matter what answer you click ... since the function doesn't return anything explicitly its return value is undefined which is a falsy value. So Array.prototype.some() also returns false and the panel doesn't minimize. So in order to be able to minimize the panel the function body must explicitly return the result from the confirmation dialog return confirm('Minimize panel?');.
         *
         * Lets add two more callbacks
         *
         * ``` javascript
         * jsPanel.create({
         *     onbeforeminimize: [
         *         function() {
         *             this.content.innerHTML = "<p>1st callback doesn't return anything. Don't mind!</p>"
         *         },
         *         function() {
         *             this.setTheme('warning');
         *             this.content.innerHTML += "<p>2nd callback executed, opens dialog ...</p>"
         *             return confirm('Minimize panel?');
         *         },
         *         function() {
         *             this.setTheme('danger');
         *             this.content.innerHTML += "<p>3rd callback executed only because 2nd callback returned <code>false</code></p>"
         *         }
         *     ],
         *     position: '0 100'
         * });
         * ```
         *
         * **What happens:**
         *
         * 1st callback doesn't have a return value. So it's undefined which is falsy. Array.prototype.some() keeps on processing callbacks.
         *
         * 2nd callback opens a confirmation dialog and returns its result.
         *
         * When you click OK the confirmation dialog returns true. So does the 2nd callback. Now with this first truthy return value Array.prototype.some() immediately returns true and stops further processing of callbacks. The 3rd callback doesn't execute.
         *
         * When you click Cancel the confirmation dialog returns false. So does the 2nd callback. Array.prototype.some() continues to process callbacks and goes on with the 3rd callback.
         *
         * 3rd callback executes only when the previous two and thus Array.prototype.some() did not return true.
         *
         * **How to edit onbeforeminimize callbacks of existing panels**
         *
         * Since option onbeforeminimize always ends up as array internally you can use regular array methods to add or remove items from it.
         *
         * To add an onbeforeminimize callback to an existing panel you could for example use:
         *
         * let panel = jsPanel.create();
         *
         * panel.options.onbeforeminimize.push(function() {
         *     return confirm('Minimize panel?');
         * });
         *
         * @link https://jspanel.de/#options/onbeforeminimize
         */
        onbeforeminimize?: OnBeforeMinimize | OnBeforeMinimize[];


        /**
         * Function or array of function to execute immediately before a panel normalizes, regardless of whether the panel is minimized by a user or programmatically. It may also be used to cancel minimizing of a panel.
         *
         * ``` javascript
         * jsPanel.create({
         *     onbeforenormalize: [
         *         function() {
         *             this.content.innerHTML = "<p>1st callback doesn't return anything. Don't mind!</p>"
         *         },
         *         function() {
         *             this.setTheme('warning');
         *             this.content.innerHTML += "<p>2nd callback executed, opens dialog ...</p>"
         *             return confirm('Normalize panel?');
         *         },
         *         function() {
         *             this.setTheme('danger');
         *             this.content.innerHTML += "<p>3rd callback executed only because 2nd callback returned <code>false</code></p>"
         *         }
         *     ],
         *     position: '0 100'
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onbeforenormalize
         */
        onbeforenormalize?: OnBeforeNormalize | OnBeforeNormalize[];


        /**
         * Function or array of function to execute immediately before a panel smallifies, regardless of whether the panel is minimized by a user or programmatically. It may also be used to cancel minimizing of a panel.
         *
         * ``` javascript
         * jsPanel.create({
         *     onbeforesmallify: [
         *         function() {
         *             this.content.innerHTML = "<p>1st callback doesn't return anything. Don't mind!</p>"
         *         },
         *         function() {
         *             this.setTheme('warning');
         *             this.content.innerHTML += "<p>2nd callback executed, opens dialog ...</p>"
         *             return confirm('Smallify panel?');
         *         },
         *         function() {
         *             this.setTheme('danger');
         *             this.content.innerHTML += "<p>3rd callback executed only because 2nd callback returned <code>false</code></p>"
         *         }
         *     ],
         *     position: '0 100'
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onbeforesmallify
         */
        onbeforesmallify?: OnBeforeSmallify | OnBeforeSmallify[];


        /**
         * Function or array of function to execute after a panel closed, regardless of whether the panel was closed by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onclosed: [
         *         function() {
         *             alert('1st callback');
         *             return true;
         *         },
         *         function(panel, closedByUser) {
         *             // now this callback is executed as well
         *             alert(`Panel with id: ${panel.id} closed!\nclosedByUser: ${closedByUser}`);
         *         }
         *     ]
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onclosed
         */
        onbeforeunsmallify?: OnBeforeUnsmallify | OnBeforeUnsmallify[];

        /**
         * Function or array of function to execute after a panel closed, regardless of whether the panel was closed by a user or programmatically.
         *
         * - Internally option onclosed always ends up as array. Regardless of whether you pass a single function, an array of functions, or nothing at all (an empty array in this case).
         *
         *      **The first function in the above array that returns a 'falsy' value stops the processing of the subsequent functions**
         *
         * - This array is passed to **Array.prototype.every()** when the panel was closed. That means that the final outcome of **onclosed** is determined by what **Array.prototype.every()** returns, not the individual function.
         *
         * - Array.prototype.every() executes a callback function once for each element present in the array until it finds the one where callback returns a falsy value (a value that becomes false when converted to a Boolean). If such an element is found, Array.prototype.every() immediately returns false. Otherwise, Array.prototype.every() returns true.
         *
         *
         * Here's a simple example:
         *``` javascript
         * jsPanel.create({
         *     onclosed: function(panel, closedByUser) {
         *         alert(`Panel with id: ${panel.id} closed!\nclosedByUser: ${closedByUser}`);
         *     }
         * });
         * ```
         *
         * Lets add one more callback
         *``` javascript
         * jsPanel.create({
         *     onclosed: [
         *         function() {
         *             alert('1st callback');
         *         },
         *         function(panel, closedByUser) {
         *             // this function doesn't execute because the 1st has no return value -> falsy
         *             alert(`Panel with id: ${panel.id} closed!\nclosedByUser: ${closedByUser}`);
         *         }
         *     ]
         * });
         * ```
         *
         * What happens:
         *
         * - 1st callback doesn't have a return value. So it's undefined which is falsy. Thus Array.prototype.every() immediately returns false and stops processing callbacks and the 2nd callback is not executed.
         * - 2nd callback doesn't execute because the 1st callback was falsy.
         *
         *
         * Let's add return true; to the 1st callback
         *``` javascript
         * jsPanel.create({
         *     onclosed: [
         *         function() {
         *             alert('1st callback');
         *             return true;
         *         },
         *         function(panel, closedByUser) {
         *             // now this callback is executed as well
         *             alert(`Panel with id: ${panel.id} closed!\nclosedByUser: ${closedByUser}`);
         *         }
         *     ]
         * });
         * ```
         *
         * What happens:
         *
         * - 1st callback returns true and Array.prototype.every() continues to process callbacks and the 2nd callback is executed as well.
         * - 2nd callback executes because the 1st callback was truthy.
         *
         * **How to edit onclosed callbacks of existing panels**
         *
         * Since option onclosed always ends up as array internally you can use regular array methods to add or remove items from it.
         *
         * To add an onclosed callback to an existing panel you could for example use:
         *
         * ``` javascript
         * let panel = jsPanel.create();
         *
         * panel.options.onclosed.push(function(panel, closedByUser) {
         *     // do whatever needs to be done ...
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onclosed
         */
        onclosed?: OnClosed | OnClosed[];


        /**
         * Function or array of function to execute after a panel fronted (panel was clicked in order to get it to the foreground), regardless of whether the panel was fronted by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onfronted: function(panel, status) {
         *         let theme = randomColor();
         *         panel.setTheme(theme);
         *     }
         * });
         * jsPanel.create({
         *     onfronted: function(panel, status) {
         *         let theme = randomColor();
         *         panel.setTheme(theme);
         *     },
         *     position: 'center 60 60'
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onfronted
         */
        onfronted?: OnFronted | OnFronted[];

        /**
         * Function or array of function to execute after a panel fronted (panel was clicked in order to get it to the foreground), regardless of whether the panel was fronted by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onfronted: function(panel, status) {
         *         let theme = randomColor();
         *         panel.setTheme(theme);
         *     }
         * });
         * jsPanel.create({
         *     onfronted: function(panel, status) {
         *         let theme = randomColor();
         *         panel.setTheme(theme);
         *     },
         *     position: 'center 60 60'
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onfronted
         */
        onmaximized?: OnMaximized | OnMaximized[];


        /**
         * Function or array of function to execute after a panel minimized, regardless of whether the panel was minimized by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onminimized: function(panel, status) {
         *         alert(`panel with id ${panel.id} is minimized`);
         *     }
         * }).minimize();
         * ```
         *
         * @link https://jspanel.de/#options/onminimized
         */
        onminimized?: OnMinimized | OnMinimized[];


        /**
         * Function or array of function to execute after a panel normalized, regardless of whether the panel was normalized by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onnormalized: function(panel, status) {
         *         alert(`panel with id ${panel.id} is normalized`);
         *     }
         * }).maximize();
         * ```
         *
         * @link https://jspanel.de/#options/onnormalized
         */
        onnormalized?: OnNormalized | OnNormalized[];


        /**
         * Function or array of function to execute after a panel smallified, regardless of whether the panel was smallified by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onsmallified: function(panel, status) {
         *         alert(`panel with id ${panel.id} is smallified`);
         *     }
         * }).smallify();
         * ```
         *
         * @link https://jspanel.de/#options/onsmallified
         */
        onsmallified?: OnSmallified | OnSmallified[];


        /**
         * Function or array of function to execute after a panel unsmallified, regardless of whether the panel was unsmallified by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onunsmallified: function(panel, status) {
         *         alert(`panel with id ${panel.id} is unsmallified`);
         *     }
         * }).smallify();
         * ```
         *
         * @link https://jspanel.de/#options/onunsmallified
         */
        onunsmallified?: OnUnsmallified | OnUnsmallified[];


        /**
         *   Function or array of function to execute after a panel changed its status, regardless of whether the panel's status change was initiated by a user or programmatically.
         *
         * ``` javascript
         * jsPanel.create({
         *     onstatuschange: function(panel, status) {
         *         panel.setHeaderTitle(`Panel status: ${panel.status}`);
         *     }
         * });
         * ```
         *
         * @link https://jspanel.de/#options/onstatuschange
         */
        onstatuschange?: OnStatusChange | OnStatusChange[];


        /**
         * If this option is used a child panel shifts within its parent panel's content section in order to maintain its relative position while the parent panel is resized with the mouse.
         *
         * ``` javascript
         * jsPanel.create({
         *     container: panel.content,
         *     panelSize: '250 140',
         *     theme: 'success',
         *     position: 'center-top 0 5',
         *     minimizeTo: 'parent',
         *     maximizedMargin: 5,
         *     syncMargins: true,
         *     onparentresize: true,
         *     dragit: {snap: true}
         * });
         * ```
         *
         *
         * @link https://jspanel.de/#options/onparentresize
         */
        onparentresize?: boolean | OnParentResize | { callback: OnParentResize, preset: boolean };


        /**
         * **Info **
         * **This option applies only to panels using option container: 'window' which is the default for option container.**
         *
         * Makes a panel responsive to a window resize event.
         *
         * Type:
         * Boolean or Function
         * Default:
         * undefined
         * Supported values:
         * Boolean true
         * The panel will show the following behaviour depending on its status:
         * 'maximized':
         * Whenever you resize the browser window the panel will also resize to remain properly maximized within the browser viewport. If your panel config used option maximizedMargin these values will be considered.
         *
         * either 'normalized' or 'smallified' and panel is centered:
         * Whenever you resize the browser window the panel will reposition to remain properly centered within the browser viewport.
         *
         * either 'normalized' or 'smallified' and panel is not centered:
         * Whenever you resize the browser window the panel will gradually reposition in order to remain fully visible until window width/height decreases below panel width/height. The panel's css left/top values will not decrease below zero.
         *
         * 'snapped':
         * Whenever you resize the browser window the panel will reposition to maintain its snapped position.
         *
         * Function
         * When using a function the panel's behaviour is determined by the function.
         * Function arguments:
         * event the event object
         * panel the panel itself
         * The keyword this inside the function refers to the panel.
         * Object
         * An object must have the two properties:
         * callback
         * A function to execute on the window resize event. The function receives the event object and the panel as arguments and the keyword this inside the function also refers to the panel.
         * preset
         * If set to boolean true the preset behaviour as described above is executed and then additionally the function set with parameter callback.
         * If set to boolean false only the function set with parameter callback is executed.
         * Example 1
         *
         * jsPanel.create({
         *     onwindowresize: true,
         *     maximizedMargin: 10,
         *     syncMargins: true,
         *     dragit: {snap: true}
         * });
         *
         *
         * @link https://jspanel.de/#options/onwindowresize
         */
        onwindowresize?: true | OnWindowResize | { callback: OnWindowResize, preset: boolean };

        /**
         * By default a newly created panel has a CSS opacity of 0. Only after most of the panel options are applied and the panel is positioned in the document CSS opacity is set to 1.
         *
         * There might be use cases where you don't want the panel to be visible until a certain action is done (e.g. repositioning a tooltip). If you set option opacity the panel maintains the set value until you explicitly change it.
         *
         * **Type:**
         *
         * Number
         *
         * **Default:**
         *
         * undefined
         *
         * **Supported values:**
         *
         * Number in the range 0.0 to 1.0
         *
         * @link https://jspanel.de/#options/opacity
         */
        opacity?: number;

        /**
         * ``` javascript
         * jsPanel.create({
         *     panelSize: {
         *         width: () => window.innerWidth * 0.3,
         *         height: '30vh'
         *     }
         * });
         * jsPanel.create({
         *     panelSize: '450 300',
         *     position: 'center 0 80'
         * });
         * ```
         * @link https://jspanel.de/#options/panelSize
         */
        panelSize?: string |
            {
                width: number | string | ((panel: JsPanel) => number | string),
                height: number | string | ((panel: JsPanel) => number | string)
            };

        /**
         * By default all standard panels get a class name composed of'jsPanel-' concatenated with the setting of this option.
         *
         * **Info**
         *
         * Normally you should not use option paneltype at all since it might lead to unexpected behaviour of panels.
         *
         * An exception to this general rule could be when you create your own jsPanel extension for a special type of panel.
         *
         *
         * @link https://jspanel.de/#options/paneltype
         */
        paneltype?: string | 'standard' | 'contextmenu' | 'error' | 'hint' | 'modal' | 'tooltip';


        /**
         * Somehow a panel needs to be positioned. By default a panel is centered. Either in the center of the browser viewport or in the center of its parent element depending on the setting of option container.
         *
         * **Info**
         *
         * To reposition an existing panel use the panel method reposition()
         *
         * **Type:**
         *
         * Boolean, Object or String
         *
         * **Default:**
         *
         * JSPanelPosition {my:'center', at:'center'}
         *
         * **Supported values:**
         *
         * - Boolean false - turns off positioning completely and you have to take care of positioning yourself
         * - String - offers a few shorthand options which are transferred to an object internally and is described in detail further down
         * - JSPanelPosition - offers the most detailed positioning options and is described in detail below
         *
         *
         * **Position shorthand strings**
         *
         * Position shorthand strings provide an easy way to quickly set the most common positioning options.
         *
         * A shorthand string may be composed of values for 'my at offsetX offsetY autoposition of'. Each "substring" is separated from the next with a space and you should stick to this sequence in order to prevent problems. Values for minLeft, maxLeft, maxTop, minTop and modify are not supported in shorthand strings.
         *
         * Example:
         *
         * Assuming the following positioning object ...
         *
         * ``` javascript
         * position: {
         *     my: 'right-top',
         *     at: 'right-top',
         *     offsetX: '-0.5rem',
         *     offsetY: 65,
         *     autoposition: 'down'
         * }
         * ```
         *
         * ... as shorthand string would be: position: 'right-top -0.5rem 65 down'.
         *
         * **Shorthand notes:**
         *
         * - Position shorthand strings do have their limitations and rely on using supported values for each parameter.
         *
         * - All "substrings" are optional.
         *
         * - If only one value for my or at is found it's used for both.
         *
         * - If values for my and at are missing they default to 'center'.
         *
         * - If only one offset value is found it's used for both offsetX and offsetY.
         *
         * - In case your shorthand string needs a value for of always put it at the end to avoid problems.
         *
         *
         * **Example 1**
         *``` javascript
         * jsPanel.create({
         *     position: {
         *         my: 'left-top',
         *         at: 'left-top',
         *         offsetX: 5,
         *         offsetY: 69
         *     }
         * });
         * // shorthand for this example:
         * // position: 'left-top 5 69'
         * ```
         *
         * **Example 2 using autoposition**
         *
         * This example additionally uses option config and the hint extension. Further jsPanel.ajax() is used to get the panel content before the panel is created.
         *
         * ``` javascript
         * let config = {
         *     position:    'center-top 0 15 down',
         *     contentSize: '330 auto',
         *     border:      'thin',
         *     header:      false,
         *     animateIn:   'animate__animated animate__bounceInUp',
         *     animateOut:  'animate__animated animate__bounceOutUp'
         * };
         * jsPanel.ajax({
         *     url: 'docs/sample-content/flexbox/fb-1b.html',
         *     done: function(xhr) {
         *         jsPanel.hint.create({
         *             config: config,
         *             autoclose: {background: 'dimgray'},
         *             theme: 'dimgray filledlight',
         *             content: xhr.responseText
         *         });
         *     }
         * });
         * // similar code for two more panels ...
         * ```
         *
         * **Example 3**
         *
         * Uses modify and of in order to position the panel at the right top of the first text node of the heading for this example.
         *
         * ``` javascript
         * jsPanel.create({
         *     container: '.main-content',
         *     position: {
         *         my: "left-top",
         *         at: "left-center",
         *         of: '#example-3',
         *         modify: (pos) => {
         *             // calc jsPanel css left to match the right center of the first childNode of position.of
         *             let range = document.createRange();
         *             let el = document.querySelector('#example-3').childNodes[0];
         *             range.selectNodeContents(el);
         *             let rects = range.getClientRects();
         *             pos.left = `calc(${pos.left} + ${Math.ceil(rects[0].width)}px`;
         *             return pos;
         *         }
         *     }
         * });
         * ```
         *
         *
         * @link https://jspanel.de/#options/position
         */
        position?: boolean | string | JSPanelPosition;

        /**
         *
         * This option configures the resizeit interaction.
         *
         * By default a jsPanel is resizable. Default resize handles are all corners (which resize width and height) and all sides (which resize width or height).
         *
         * Type:
         *
         *  - {@link JsPanelOptions_Resizeit} Object
         *
         *
         * -  Boolean false disables the resizeit interaction for this panel permanently
         *
         * **Default:**
         * ``` javascript
         * {
         *     handles: 'n, e, s, w, ne, se, sw, nw',
         *     minWidth: 128,
         *     minHeight: 38
         * }
         * ```
         * SUPPORTED CONFIGURATION OPTIONS:
         *
         *  - aspectRatio type: string
         *  - containment type: number or array
         *  - disable type: boolean
         *  - grid type: array
         *  - handles type: string
         *  - minWidth type: number
         *  - minHeight type: number
         *  - maxWidth type: number
         *  - maxHeight type: number
         *  - start type: function
         *  - resize type: function
         *  - stop type: function
         *
         *
         * **Modifier Keys while resizing a panel**
         *
         * - Holding down the **Ctrl** key while resizing the panel will maintain the aspect ratio of the panel as a whole, regardless of the setting of aspectRatio. This equals aspectRatio: 'panel'. Releasing the modifier key resets aspectRatio to its previous value and takes effect after the resizing operation stopped.
         *
         * - Holding down the **Alt** key while resizing the panel will maintain the aspect ratio of the panel's content section, regardless of the setting of aspectRatio. This equals aspectRatio: 'content'.  Releasing the modifier key resets aspectRatio to its previous value and takes effect after the resizing operation stopped.
         *
         * - **Shift** key while resizing the panel adjusts panel size in all directions (depending on which resize handle is used and regardless of the setting of aspectRatio). If you for example use the east resize handle to increase panel size to the right the same amount of additional panel size is added to the left of the panel.
         *
         * **Info**
         *
         * - Modifier keys are effective as long as a resizing operation lasts. On pointerup parameter aspectRatio is reset to its original value (the one passed in the option resizeit configuration).
         *
         * - Not all resizeit parameters work perfectly well when a modifier key is used while resizing.
         *
         * @link https://jspanel.de/#options/resizeit
         */
        resizeit?: boolean | JsPanelOptions_Resizeit;

        /**
         * Switches a panel's default left-to right text direction to right-to-left text direction.
         *
         * Type:
         * Object {rtl ?: boolean, lang ?: string} :
         * - rtl boolean - Must be true to activate right-to-left text-direction
         * - lang string - optional language code according to ISO 639-1 : {@link https://www.w3schools.com/tags/ref_language_codes.asp}
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     rtl: {
         *         rtl: true,
         *         lang: 'he'
         *     },
         *     headerTitle: 'כותרת פנל',
         *     headerToolbar: 'סרגל הכלים כותרת',
         *     footerToolbar: 'סרגל הכלים התחתונה',
         *     content: '<p>שורה של טקסט לדוגמה ...</p>',
         *     contentSize: '400 140'
         * });
         * ```
         */
        rtl?: { rtl?: boolean, lang?: string };

        /**
         * By default a panel is created in a normalized status. This option allows to create a panel already maximized, minimized, smallified or smallifiedmax.
         *
         * **Supported string values:**
         * 'maximized', 'minimized', 'smallified' or 'smallifiedmax'
         *
         * Example
         * ``` javascript
         * jsPanel.create({
         *     setStatus: 'maximized'
         * });
         * ```
         *
         */
        setStatus?: 'maximized' | 'minimized' | 'smallified' | 'smallifiedmax';

        /**
         * Panel options **maximizedMargin**, **dragit**, **resizeit** and the **dragit.snap** feature can set some sort of **containment**. Option **syncMargins** synchronizes those settings to a common value set by option **maximizedMargin**.
         *
         * **Supported values:**
         *
         * If set to the only supported value boolean true the setting of option maximizedMargin (which defaults to 0) is used to also set:
         * - option dragit.containment to the value of option maximizedMargin
         * - option resizeit.containment to the value of option maximizedMargin
         * - option dragit.snap.containment (if the snap feature is used) to true
         *
         * **syncMargins**: **true** overrides individual settings of the three configuration options noted above.
         *
         * **Example**
         *
         * So instead of writing:
         *``` javascript
         * jsPanel.create({
         *     maximizedMargin: 5,
         *     dragit: {
         *         containment: 5,
         *         snap: {
         *             containment: true
         *         }
         *     },
         *     resizeit: {
         *         containment: 5
         *     }
         * });
         * ```
         *
         * You simply write:
         *``` javascript
         * jsPanel.create({
         *     maximizedMargin: 5,
         *     dragit: { snap: true },
         *     syncMargins: true
         * });
         * ```
         */
        syncMargins?: boolean;

        /**
         * Replaces the default jsPanel HTML template with a customized one of your own.
         *
         * Assume you need to make a change to the panel that applies to variety of your panels. Instead of applying this change each time you create a panel you could create a custom panel template incorporating this change and use that template for your panels.
         *
         * Example
         *
         * The following example creates a custom panel template with an additional control to the right of the regular close control and then uses the custom template to create a panel.
         * ``` javascript
         * // create a copy of the panel template
         * tpl = jsPanel.createPanelTemplate();
         * // create container for your extra control ...
         * btn = document.createElement('button');
         * // ... and add necessary class names
         * btn.className = 'jsPanel-btn jsPanel-btn-menu';
         * // set type attribute
         * btn.setAttribute('type', 'button');
         * // add button icon
         * btn.innerHTML = '<span class="fad fa-bars"></span>';
         * // append new control to controlbar of copied panel template
         * tpl.querySelector('.jsPanel-controlbar').append(btn);
         * // add a handler to the extra control
         * btn.addEventListener('click', (e) => {
         *     e.target.closest('.jsPanel').content.innerHTML = '<p>Click on menu control ...</p>';
         * });
         *
         * // use template for new panel
         * jsPanel.create({
         *     template: tpl
         * });
         * ```
         *
         * Below you can see the HTML returned by the method jsPanel.createPanelTemplate()
         *``` html
         * <div class="jsPanel" style="left: 0px; top: 0px;" data-btnclose="enabled" data-btnmaximize="enabled" data-btnnormalize="enabled" data-btnminimize="enabled" data-btnsmallify="enabled">
         *     <div class="jsPanel-hdr">
         *         <div class="jsPanel-headerbar">
         *             <div class="jsPanel-headerlogo"></div>
         *             <div class="jsPanel-titlebar">
         *                 <div class="jsPanel-title"></div>
         *             </div>
         *             <div class="jsPanel-controlbar">
         *                 <!--
         *                     the innerHTML of the button elements depends on option.iconfont
         *                     and defaults to the svg code stored in jsPanel.icons
         *                 -->
         *                 <button type="button" class="jsPanel-btn jsPanel-btn-smallify"  aria-label="Smallify">${this.icons.smallify}</button>
         *                 <button type="button" class="jsPanel-btn jsPanel-btn-minimize"  aria-label="Minimize">${this.icons.minimize}</button>
         *                 <button type="button" class="jsPanel-btn jsPanel-btn-normalize" aria-label="Normalize">${this.icons.normalize}</button>
         *                 <button type="button" class="jsPanel-btn jsPanel-btn-maximize"  aria-label="Maximize">${this.icons.maximize}</button>
         *                 <button type="button" class="jsPanel-btn jsPanel-btn-close"     aria-label="Close">${this.icons.close}</button>
         *             </div>
         *         </div>
         *         <div class="jsPanel-hdr-toolbar"></div>
         *     </div>
         *     <div class="jsPanel-progressbar">
         *         <div class="jsPanel-progressbar-slider"></div>
         *     </div>
         *     <div class="jsPanel-content"></div>
         *     <div class="jsPanel-minimized-box"></div>
         *     <div class="jsPanel-ftr"></div>
         * </div>
         * ```
         */
        template?: Element;


        /**
         * This option applies a color theme to a panel. You can use a number of built-in themes, bootstrap themes, material design for bootstrap themes, arbitrary color themes and even configure an image to use as theme background.
         *
         * The theme color is applied as background color to the outermost <div> element of the panel. But a footer toolbar, if present, has the background color **#f5f5f5** for all themes. The panel's content section always has a white background color unless a theme modifier is used.
         *
         * **Type:**  String or Object
         * **Default:** 'default'
         *
         * **Supported values:**
         * String
         *      - built-in themes include: 'default', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark' and 'none'
         *
         *      - Bootstrap color themes using a prefix like 'bootstrap-primary'
         *
         *      - Material Design for Bootstrap color themes using a prefix like 'mdb-primary'
         *
         *      - HEX, RGB and HSL color values like '#123456'
         *
         *      - New as of v4.16.0 A css variable storing a HEX, RGB and HSL color value
         *
         *      - Any standardized color name like 'forestgreen' and color names from the Material Design Color System like 'purple900'
         *
         *      - Additionally a theme string may include one of the modifiers 'filled', 'filledlight', 'filleddark' or 'fillcolor' separated from the theme color by a space like 'primary filled'
         *
         *      - Object {@link JsPanelOptionsTheme} with detailed configuration as described further down
         *
         * **Info**
         *
         * To change the theme of an existing panel use the panel method **setTheme()**
         *
         * Built-in themes
         * Built-in are the themes:
         *  - default,
         *  - primary,
         *  - secondary,
         *  - info,
         *  - success,
         *  - warning,
         *  - danger,
         *  - light,
         *  - dark
         *  - none.
         *
         * **Example**
         *
         * Actually this example creates a panel for each theme including header and footer toolbars.
         *``` javascript
         * jsPanel.create({
         *     theme: 'primary',
         *     // more config ...
         * });
         * ```
         *
         * **Using color names and arbitrary colors:**
         *
         * The following color names may be used as theme:
         *
         *  - A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
         *
         *  - You may extend the usable named colors with your own colors. See jsPanel.colorNames
         *
         *  - RGB color value like rgb(120,200,17) - rgba values can be used but the alpha channel is ignored
         *
         *  - HEX color value like #d5e863 or #ddd, (# is optional)
         *
         *  - HSL color value like hsl(120,75%,75%) - hsla values can be used but the alpha channel is ignored
         *
         *  - New as of v4.16.0 A css variable storing a HEX, RGB or HSL color value
         *
         *  - A color name derived from the Material Design Color System like bluegray600, purple900, and so on ...
         *
         *
         *
         * **Bootstrap themes**
         *
         * If you use jsPanel in a Bootstrap 3/4/5 environment you can use the bootstrap colors as panel theme by simply adding a prefix bootstrap- to the theme color.
         *
         *
         * Theme modifiers are also supported for bootstrap themes.
         *
         * Demo panels with Bootstrap v4.5.0. https://jspanel.de/docs/demos/bootstrap4.5/
         *
         * Demo panels with Bootstrap v5.0.2. https://jspanel.de/docs/demos/bootstrap5/
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     theme: 'bootstrap-primary'
         * });
         * ```
         *
         * **Material Design for Bootstrap themes**
         *
         * Material Design for bootstrap colors are used the same way as regular bootstrap colors. Just use **mdb-** as prefix.
         *
         * Theme modifiers are also supported for Material Design for Bootstrap themes.
         *
         * <a href="https://jspanel.de/docs/demos/mdb/">Follow this link to see a few demo panels.</a>
         *
         * Example
         *``` javascript
         * jsPanel.create({
         *     theme: 'mdb-unique-color'
         * });
         * ```
         *
         * **Theme modifiers**
         *
         * To **all** themes you can add a modifier string separated from the theme name by a space.
         *
         * Supported modifiers are:
         *
         * - 'filled' sets the primary theme color as background color of the panel's content section
         *
         * Example: theme: 'info filled'
         *
         * - 'filledlight' sets a lighter version of the primary theme color as background color of the panel's content section
         *
         * Example: theme: 'success filledlight'
         *
         * - 'filleddark' sets a slightly lighter version of the primary theme color as background color of the panel's content section
         *
         * Example: theme: 'success filleddark'
         *
         * - 'fillcolor' followed by a HEX, RGB, HSL or named color value where the color value is space separated from the modifier uses the given color as background color of panel's content section
         *
         * Example: theme: 'warning fillcolor orange400'
         *
         * **New as of v4.16.0** A css variable storing a HEX, RGB or HSL color value can be used to set 'fillcolor'.
         *
         *
         *
         * **Using a  JsPanelOptionsTheme object**
         *
         * - Finally you can use an object as value for option theme.
         *
         * - It gives you some more variations like using an image or a CSS gradient as panel background.
         *
         * - Font colors which are either black or white with regular themes can also be customized.
         *
         *
         * **New as of v4.16.0**
         *
         * - Properties bgFooter, colorFooter and borderRadius are new
         * - All values may be set with a css custom property/variable
         *
         *
         * **Example**
         *``` javascript
         * jsPanel.create({
         *     theme: {
         *         bgPanel: 'url("img/trianglify-warning.svg") right bottom no-repeat',
         *         bgContent: '#fff',
         *         colorHeader: '#fff',
         *         colorContent: `#${jsPanel.colorNames.gray700}`,
         *         border: 'thin solid #b24406',
         *         borderRadius: '.33rem'
         *     },
         *     headerToolbar: 'header toolbar ...',
         *     footerToolbar: 'footer toolbar ...',
         *     content: '<p>Lorem ipsum dolor sit amet ...</p>',
         *     contentSize: '400 170'
         * });
         * ```
         * @link https://jspanel.de/#options/theme
         *
         */
        theme?: string | JsPanelOptionsTheme;

    } // jsPanelOptions

    export interface JsPanelOptions_PanelData { left: number, top: number, width: number, height: number }

    /**
     * - **panel** returns the panel triggering the event
     * - **detail**  returns the ID attribute value of the panel triggering the event
     * - **cancelable** returns a boolean value indicating whether the event is cancelable or not
     */
    export interface JsPanel_DocumentEvent {
        panel: JsPanel;
        detail: string;
        cancelable: boolean;
    } // JsPanel_DocumentEvent

}


// This line is necessary to make TypeScript treat this file as a module
export {};