import {IHtmlDecorator} from "./IHtmlDecorator";

export interface IStateWidget2 {

   tagId ?: string;
   decorator ?: IHtmlDecorator;


   /**
    * Set to true if the existing HTMLElement needs to be destroyed and recreated when refreshing
    */
   repaintOnRefresh ?:boolean

   // /**
   //  * the tagId of the HTMLElement wrapping the current widget
   //  */
   // wrapperTagId ?: string;



}