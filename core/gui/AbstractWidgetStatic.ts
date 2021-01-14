/**
 * This  class is extended by classes that are static in the sense that they just initially render the contend,
 * but there's no need for refresh or clear.
 */
import {AbstractWidget} from "./AbstractWidget";

export abstract class AbstractWidgetStatic<T=any> extends AbstractWidget<T>{

    // was AbstractWidgetStatic

// noinspection JSUnusedGlobalSymbols
    async localRefreshImplementation(): Promise<void> {}

// noinspection JSUnusedGlobalSymbols
    async localClearImplementation(): Promise<void> {}
}