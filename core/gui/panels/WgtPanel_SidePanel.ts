import {WgtPanel_Generic}                                          from "./WgtPanel_Generic";
import {Args_WgtPanel_Generic_Abstract, WgtPanel_Generic_Abstract} from "./WgtPanel_Generic_Abstract";

export class Args_WgtPanel_SidePanel extends Args_WgtPanel_Generic_Abstract {
   /**
    * Style defaults to 'flex-grow:0;'
    */
   defaultStyleOverride ?: string;
}

export class WgtPanel_SidePanel extends WgtPanel_Generic_Abstract<Args_WgtPanel_SidePanel> {

   static async create(initArgs: any): Promise<WgtPanel_SidePanel> {
      let defaultStyle: string = `flex-grow:0;`
      if (initArgs?.defaultStyleOverride) {
         defaultStyle = initArgs.defaultStyleOverride
      }

      let instance = WgtPanel_Generic.create({
                                                htmlTagStyle:  defaultStyle + (initArgs.htmlTagStyle ? initArgs.htmlTagStyle : ''),
                                                htmlTagClass:  initArgs.htmlTagClass,
                                                htmlOtherAttr: initArgs.htmlOtherAttr,
                                                htmlTagType:   initArgs.htmlTagType,
                                                children:      initArgs.children,
                                                title:         initArgs.title,
                                             });

      return instance;
   }

}