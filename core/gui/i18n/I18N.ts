export const DEFAULT_SYSTEM_I18N: string = 'en_us';

/**
 * Return the default  Orca1 language ('en_us')
 * @param value 'en_us
 */
export function getLocaleDefault(): string {
   return DEFAULT_SYSTEM_I18N;
}


/**
 * Return the current locale of the browser or 'en_us' if not found
 * @return {string} current locale of the browser
 */
export function getLocale(): string {
   // Fallback for older browsers that might use navigator.userLanguage
   const locale = navigator.language || (navigator as any).userLanguage || 'en-US';
   // Convert to lower case and replace hyphen with underscore (e.g., "en-US" to "en_us")
   return locale.toLowerCase().replace('-', '_');
}



//-------------- fields/variables
/**
 * Default language for the system
 */
let  _system_i18n: string = DEFAULT_SYSTEM_I18N;
export interface StringMap {
   [key: string]: string;
}

let m: { [key: string]: StringMap } = {};

//-------------------------------------------------------------
export class I18NGlobalData {
   static readonly LBL_SAVE_CHANGES      = 'LBL_SAVE_CHANGES';
   static readonly LBL_EXIT_WITHOUT_SAVE = 'LBL_EXIT_WITHOUT_SAVE';
   static readonly LBL_OK                = 'LBL_OK';
   static readonly LBL_CANCEL            = 'LBL_CANCEL';
}

export class I18NData {

   private static _instance: I18NData;

   protected constructor() {
   }

   static instance(): I18NData {

      if (!I18NData._instance) {
         I18NData._instance = new I18NData();
         I18NData._instance._createData();
      }

      return I18NData._instance;
   }


   get m(): { [key: string]: StringMap } {
      return m;
   }


   //------------------------ Pure data from here down -------------------
   private _createData() {

      let x: StringMap;

      //-------------------------
      setI18Label(I18NGlobalData.LBL_SAVE_CHANGES, 'Do you want to save your changes?');
      setI18Label(I18NGlobalData.LBL_EXIT_WITHOUT_SAVE, 'Exit without saving your changes?');
      setI18Label(I18NGlobalData.LBL_OK, 'OK');
      setI18Label(I18NGlobalData.LBL_CANCEL, 'Cancel');


      //-------------------------
      // also filled in from onLogin(async()=>{}) in different screen modules

   } // _createData

} // I18NData



//----------------------------------------

function getSystem_i18n(): string {
   return _system_i18n;
} // getSystem_i18n

function  setSystem_i18n(value: string) {
   if (!value)
      value = DEFAULT_SYSTEM_I18N;

   let s = value;
   s     = s.replace(/ /g, '_');
   s     = s.replace(/-/g, '_');
   s     = s.toLowerCase();

   _system_i18n = value;
} // setSystem_i18n

//------------------------------------

/**
 * Defines an I18n label using the DEFAULT system locale
 * @param key label key
 * @param val label text
 */
export function setI18Label(key: string, val: string) {
   return setI18nLabel_Locale(DEFAULT_SYSTEM_I18N, key, val);
}

/**
 *  Defines an I18n label using a specific locale
 * @param locale specific label locale
 * @param key label key
 * @param val label text
 */
function setI18nLabel_Locale(locale: string, key: string, val: string) {
   if (!key)
      throw(`No key in I18Data call to forLocale(${locale}, ${key}, ${val})`);

   if (!locale) {
      locale = DEFAULT_SYSTEM_I18N;
   }
   let x = I18NData.instance().m[key];
   if (!x)
      x = {};
   x[locale] = val;
   m[key]    = x;
}
//-------------------------------------------------------------

export function lbl(field_or_class_id: string, optional_field_id ?: string): string {

   if (!field_or_class_id)
      return 'Err:LabelFieldID null!';

   let id: string = field_or_class_id;
   if (optional_field_id)
      id = `${field_or_class_id}/${optional_field_id}`;


   let i18n_id     = getSystem_i18n();


   let fieldLabels:StringMap = I18NData.instance().m[id];
   if (!fieldLabels)
      return `Err:No i18n entries '${id}'!`;

   let text: string = fieldLabels[i18n_id];

   if (!text) {
      console.error(`No i18n translation for field '${id}' / language_code '${i18n_id}'.`);
      text = fieldLabels[DEFAULT_SYSTEM_I18N];
   }

   if (!text){
      console.error(`No i18n translation for field '${id}' default language code.`);
      text = 'Err: n/a';
   }

   return text;
} // lbl