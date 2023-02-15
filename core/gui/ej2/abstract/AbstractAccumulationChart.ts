import {Args_AnyWidget} from "../../AnyWidget";
import {AnyWidgetStandard} from "../../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils} from "../../../BaseUtils";
import {
    AccumulationChart,
    AccumulationChartModel,
    AccumulationDataLabel,
    AccumulationLegend,
    AccumulationSelection,
    AccumulationTooltip,
    PieSeries
} from '@syncfusion/ej2-charts';

AccumulationChart.Inject(
    AccumulationLegend,
    PieSeries,
    AccumulationDataLabel,
    AccumulationTooltip,
    AccumulationSelection,
);

export abstract class Args_AbstractAccumulationChart extends Args_AnyWidget<AccumulationChartModel> {
} // Args_WgtAccumulationChart

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractAccumulationChart extends AnyWidgetStandard<AccumulationChart, Args_AbstractAccumulationChart, any> {

    protected constructor() {
        super();
    }

    get value(): any {
        if (this.obj)
            return this.obj.dataSource;
    }

    set value(value: any) {
        if (this.obj) {
            this.obj.dataSource = value;
            super.value = value;
        }
    }

    protected async _initialize(args: Args_AbstractAccumulationChart) {
        args = IArgs_HtmlTag_Utils.init(args);

        await this.initialize_AnyWidgetStandard(args);

    } // initialize_WgtAccumulationChart

    async localLogicImplementation() {
        let anchor = this.hget;
        this.obj = new AccumulationChart(this.initArgs?.ej);
        this.obj.appendTo(anchor);
    } // localLogicImplementation

    async localClearImplementation() {
        await super.localClearImplementation();
        if (this.obj) {
            this.obj.dataSource = [];
        }
    } // localClearImplementation

    async localDestroyImplementation(): Promise<void> {
        // cleanup any leftover Syncfusion style tags

        let styleTags = document.querySelectorAll('style');
        styleTags.forEach((styleTag) => {
            if (styleTag.id.startsWith(this.tagId)) {
                styleTag.remove();
            }
        });

        // Horrible hack next to ensure no exception thrown by Syncfusion code on destroy
        // The keyboard element must exist
        let hackId = this.obj.element.id + 'Keyboard_accumulationchart_focus';
        let hackElem = document.getElementById(hackId);
        if (!hackElem) {
            hackElem = document.createElement('div');
            hackElem.id = hackId;
            hackElem.style.display = 'none';
            this.obj.element.appendChild(hackElem); // add the keyboard element to the chart
        }

        await super.localDestroyImplementation();

    } // localDestroyImplementation
} // main