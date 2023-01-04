import {CoreWidget2}   from "./CoreWidget2";
import {IPanel2}       from "./IPanel2";
import {IStateWidget2} from "./IStateWidget2";

export class CorePanel2<STATE extends IStateWidget2> extends CoreWidget2<STATE> implements IPanel2 {

  protected constructor() {
    super();
  }

}