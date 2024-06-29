import {isNexusDataManager, NexusDataManager} from '../../../../data/NexusDataManager';
import {N2} from '../../../N2';
import {getN2FromEJ2} from '../../Ej2Utils';


/**
 * Creates a property interceptor for Syncfusion widgets to stamp NexusDataManager instances
 * with the N2 component that triggered the query.
 *
 * @param {any} widgetPrototype - The prototype of the Syncfusion widget (e.g., Grid.prototype)
 * @throws {Error} Logs any errors that occur during the interception process.
 *
 * @example
 * ```ts
 *   link_widget_dataSource_NexusDataManager(Grid.prototype);
 *   link_widget_dataSource_NexusDataManager(Chart.prototype);
 *   // ... and so on for other Syncfusion widgets
 * ```
 */
export function link_widget_dataSource_NexusDataManager(widgetPrototype: any): void {
    try {
        /**
         * Function to set up the property interceptor for the widget's dataSource.
         */
        const setupInterceptor = (): void => {
            // Get the original descriptor of the dataSource property
            const originalDescriptor = Object.getOwnPropertyDescriptor(widgetPrototype, 'dataSource');

            if (!originalDescriptor) {
                console.error('Original dataSource descriptor not found', widgetPrototype);
                return;
            }

            // Intercept the dataSource property
            Object.defineProperty(widgetPrototype, 'dataSource', {
                get: originalDescriptor.get,
                set: function(newValue: any): void {
                    // Call the original setter if it exists
                    if (originalDescriptor.set) {
                        originalDescriptor.set.call(this, newValue);
                    }

                    try {
                        // Check if the new value is a NexusDataManager instance
                        if (newValue && isNexusDataManager(newValue)) {
                            const nexus_dm: NexusDataManager = newValue as NexusDataManager;

                            // Get the N2 component from the current widget instance
                            const n2Component = getN2FromEJ2(this);

                            if (n2Component) {
                                // Stamp the NexusDataManager with the N2 component
                                nexus_dm.nexus_settings.n2 = n2Component as N2;
                                console.log(`dm stamped with N2${this.constructor.name}`, 'nexus_dm', nexus_dm, `n2_${this.constructor.name.toLowerCase()}`, nexus_dm.nexus_settings.n2);
                            } else {
                                console.warn(`N2 component not found for current ${this.constructor.name} instance`);
                            }
                        }
                    } catch (e) {
                        console.error('Error in dataSource setter:', e);
                    }
                },
                configurable: originalDescriptor.configurable,
                enumerable: originalDescriptor.enumerable
            });

            // Mark the prototype to indicate that the interceptor has been set
            (widgetPrototype as any).__n2_prop_interceptor_ = true;
        };

        // Check if the interceptor has already been set
        if (!((widgetPrototype as any)?.__n2_prop_interceptor__)) {
            setupInterceptor();
        }
    } catch (e) {
        console.error('Error setting up dataSource_NexusDataManager_stamper:', e);
    }
} // dataSource_NexusDataManager_stamper

// Usage example:
// dataSource_NexusDataManager_stamper(Grid.prototype);
// dataSource_NexusDataManager_stamper(Chart.prototype);
// ... and so on for other Syncfusion widgets