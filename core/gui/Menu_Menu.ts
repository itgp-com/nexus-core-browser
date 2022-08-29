/**
 * Menu module - definition of a menu containing other items
 */
import {Menu_Item} from "./Menu_Item";
import {Menu_Base} from "./Menu_Base";

export class Menu_Menu  extends Menu_Base{
   id ?: string;
   items ?: Menu_Item[];
} // main