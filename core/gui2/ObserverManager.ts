import {nexusMain} from '../NexusMain';

/**
 *
 * // Usage
 * // Adding a callback for a specific ID
 * ObserverManager.add({
 *     identifier: 'yourInputId',
 *     callback: (element) => {
 *
 *     },
 *     autoRemove: true, // optional, defaults to true
 * });
 *
 * // Adding a callback for an actual HTMLElement
 * const myElement = document.getElementById('myElementId');
 * if (myElement) {
 *     ObserverManager.add(
 *     {
 *          identifier: myElement,
 *          callback: (element) => {
 *                 // Handle the specific HTMLElement
 *          },
 *          autoRemove: true
 *     });
 * }
 *
 * // To remove a callback
 * ObserverManager.removeObservable('yourInputId');
 */
export class ObserverManager {

    private static callbacks = new Map<string, Args_Observable>();
    private static observer: MutationObserver | null = null;
    private static uniqueIdCounter = 0;

    /**
     * Initialize the Mutation observer singleton
     * If called multiple times it has no effect.
     *
     * If you want to reset the observer and create a new one, call ObserverManager.reset() instead. ObserverManager.reset() will not remove the existing Args_Observable list.
     */
    static initialize() {
        if (!this.observer) {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                            if (node instanceof HTMLElement) {

                                // node is the main HTMLElement that is inserted in the DOM

                                //1. Lets see if the node itself has a callback present
                                const callbackEntry = this.callbacks.get(node.id);
                                if (callbackEntry) {
                                    try {
                                        callbackEntry.callback(node);
                                    } catch (e) {
                                        console.error('ObserverManager: error calling callback', e);
                                    }

                                    if (callbackEntry.autoRemove) {
                                        try {
                                            this.remove(node.id);
                                        } catch (e) {
                                            console.error('ObserverManager: error removing callback', e);
                                        }
                                    } // if autoRemove
                                } // if callbackEntry

                                //2. For each callback, see if its identifier is found as a child of node at some level
                                this.callbacks.forEach((args, key) => {
                                    let containedElem = node.querySelector(`#${key}`) as HTMLElement;
                                    if (args.callback) {
                                        try {
                                            args.callback(containedElem);
                                        }catch(e){
                                            console.error('ObserverManager: error calling callback', e);
                                        }

                                        if (args.autoRemove) {
                                            try {
                                                this.remove(key);
                                            } catch (e) {
                                                console.error('ObserverManager: error removing callback', e);
                                            }
                                        } // if autoRemove
                                    } // if args.callback
                                });


                            } // if node instanceof HTMLElement
                        }); // mutation.addedNodes.forEach
                    } // if mutation.addedNodes
                }); // mutations.forEach
            }); // new MutationObserver

            this.observer.observe(document.body, { childList: true, subtree: true });
        } // if !this.observer
    }

    /**
     * Reset the Mutation observer and create a new singleton
     */
    static reset (){
        try {
            this.observer.disconnect();
        } catch (e) {
            console.error('ObserverManager: error disconnecting observer', e);
        }

        this.observer = null;
        this.initialize(); // initialize a new observer
    }

    /**
     * Get the list of observable ids that have been added and not removed yet
     * @return {string[]} list of observable ids
     */
    static observable_ids(): string[] {
        return Array.from(this.callbacks.keys());
    }

    /**
     * Get the list of Args_Observable that have been added and not removed yet
     * @return {Args_Observable[]} list of observable args
     */
    static list():Args_Observable[] {
        return Array.from(this.callbacks.values());
    }

    static add(args: Args_Observable) {
        if (args == null)
            return;

        let identifier = args.identifier;
        if (identifier == null)
            return;

        if (args.callback == null)
            return;
        //default autoRemove to true
        args.autoRemove = args.autoRemove ?? true;

        if (identifier instanceof HTMLElement) {
            if (!identifier.id) {
                identifier.id = `observer-manager-id-${this.uniqueIdCounter++}`;
            }
            this.callbacks.set(identifier.id, args);
        } else {
            this.callbacks.set(identifier,args);
        }
    }

    static remove(identifier: string | HTMLElement) {
        const key = typeof identifier === 'string' ? identifier : identifier.id;
        if (key !=null)
            this.callbacks.delete(key);
    }
} // ObserverManager

export class Args_Observable {

    /**
     * **Required**
     * @type {string | HTMLElement}
     */
    identifier: string | HTMLElement;
    /**
     * **Required**
     * Function called when the element is added to the DOM
     * @type {(element: HTMLElement) => void}
     * @required
     */
    callback : (element: HTMLElement) => void;

    /**
     * Defaults to **true**
     * @type {boolean} if true, remove the element and its callback after the first time it is called. If false, the callback will be called every time the element is added to the DOM
     */
    autoRemove?: boolean
}

nexusMain.UIStartedListeners.add(() => {
    ObserverManager.initialize();
}, 10); // not 1 but before the default of 100