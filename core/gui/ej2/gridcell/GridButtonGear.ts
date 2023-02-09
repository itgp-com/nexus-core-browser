import {AbstractGridButton} from "../abstract/AbstractGridButton";
import {ColumnModel, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {GridWidgetCallBack} from "../../WidgetUtils";


export class GridButtonGear extends AbstractGridButton {
    static readonly CLASS_NAME: string = 'GridButtonGear';

    constructor() {
        super({
            buttonClass: GridButtonGear.CLASS_NAME,
            fa_classes: 'fa-solid fa-gear'
        });
    }
}

//----------------------
const GRID_BUTTON_GEAR: GridButtonGear = new GridButtonGear();

/**
 * Get the column model for the gear Grid Button
 * @param override a ColumnModel object that will override the default values
 */
export function gridButtonGearColumnModel(override ?: ColumnModel): ColumnModel {
    override = override || {};
    let columnModel: ColumnModel = GRID_BUTTON_GEAR.columnModel();
    columnModel.field = '_GridButtonGear_'
    columnModel = Object.assign(columnModel, override);
    return columnModel;
}

export function gridButtonGearInstantiate(args: QueryCellInfoEventArgs, callback ?: GridWidgetCallBack, toolTip ?: string) {
    return GRID_BUTTON_GEAR.instantiate(
        {
            args: args,
            callback: callback,
            toolTip: toolTip,
        });
}