import {getRandomString} from './BaseUtils';
import {isHTMLElement} from './CoreUtils';
import {nexusMain} from './NexusMain';

/**
 *
 * // Usage
 * // Adding a, onAdded callback for a specific ID
 * ObserverManager.addOnAdded({
 *     identifier: 'yourInputId',
 *     onAdded: (element) => {
 *
 *     },
 *     autoRemove: true, // optional, defaults to true
 * });
 *
 * // Adding an onAdded callback for an actual HTMLElement
 * const myElement = document.getElementById('myElementId');
 * if (myElement) {
 *     ObserverManager.addOnAdded(
 *     {
 *          identifier: myElement,
 *          onAdded: (element) => {
 *                 // Handle the specific HTMLElement
 *          },
 *          autoRemove: true
 *     });
 * }
 *
 * // To remove an onAdded callback
 * ObserverManager.removeOnAdded('yourInputId');
 */
export class ObserverManager {

    private static mapOnAdded = new Map<string, Args_OnAdded>();
    private static mapOnRemoved = new Map<string, Args_OnRemoved>();
    private static arrayOnMutation: Args_OnMutation[] = [];
    private static observer: MutationObserver | null = null;
    private static uniqueIdCounter :number = 0;

    /**
     * Initialize the Mutation observer singleton
     * If called multiple times it has no effect.
     *
     * If you want to reset the observer and create a new one, call ObserverManager.reset() instead. ObserverManager.reset() will not remove the existing Args_Observable list.
     */
    static initialize() {
        if (!ObserverManager.observer) {
            ObserverManager.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {

                    if (ObserverManager.arrayOnMutation.length > 0) {
                        ObserverManager.arrayOnMutation.forEach((mutation, key) => {
                            try {
                                mutation.onMutation(mutations);
                            } catch (e) {
                                console.error('ObserverManager: error calling mutation callback', e, mutation);
                            }

                            if (mutation.autoRemove) {
                                try {
                                    ObserverManager.removeOnMutation(mutation);
                                } catch (e) {
                                    console.error('ObserverManager: error removing mutation callback', e, mutation);
                                }
                            } // if autoRemove
                        });
                    } // if ObserverManager.arrayOnMutation.size > 0


                    if (mutation.type === 'childList') {

                        // process Added Nodes
                        if (ObserverManager.mapOnAdded.size > 0 && mutation.addedNodes && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node instanceof HTMLElement) {

                                    // node is the main HTMLElement that is inserted in the DOM

                                    //1. Lets see if the node itself has a callback present
                                    const argOnAdded = ObserverManager.mapOnAdded.get(node.id);
                                    if (argOnAdded) {
                                        try {
                                            argOnAdded.onAdded(node);
                                        } catch (e) {
                                            console.error('ObserverManager: error calling onAdded callback', e, argOnAdded);
                                        }

                                        if (argOnAdded.autoRemove) {
                                            try {
                                                ObserverManager.removeOnAdded(node.id);
                                            } catch (e) {
                                                console.error('ObserverManager: error removing onAdded callback', e, argOnAdded);
                                            }
                                        } // if autoRemove
                                    } // if argsOnAdded

                                    //2. For each callback, see if its identifier is found as a child of node at some level
                                    ObserverManager.mapOnAdded.forEach((argOnAdded, key) => {
                                        let containedElem = node.querySelector(`#${key}`) as Element;
                                        if (containedElem && isHTMLElement(containedElem)) {
                                            if (argOnAdded.onAdded) {
                                                try {
                                                    argOnAdded.onAdded(containedElem as HTMLElement);
                                                } catch (e) {
                                                    console.error('ObserverManager: error calling onAdded callback', e, argOnAdded);
                                                }

                                                if (argOnAdded.autoRemove) {
                                                    try {
                                                        ObserverManager.removeOnAdded(key);
                                                    } catch (e) {
                                                        console.error('ObserverManager: error removing onAdded callback', e, argOnAdded);
                                                    }
                                                } // if autoRemove
                                            } // if fOnAdded.callback
                                        } // if containedElem
                                    });


                                } // if node instanceof HTMLElement
                            }); // mutation.addedNodes.forEach
                        } // if (ObserverManager.mapOnAdded.size > 0 && mutation.addedNodes && mutation.addedNodes.length > 0)


                        //------ Process Removed Nodes -------------
                        if (ObserverManager.mapOnRemoved.size > 0 && mutation.removedNodes && mutation.removedNodes.length > 0) {
                            mutation.removedNodes.forEach((node) => {
                                if (node instanceof HTMLElement) {
                                    // node is the main HTMLElement that was removed from the DOM

                                    //1. Check if the node itself has a callback present for removal
                                    const argOnRemoved = ObserverManager.mapOnRemoved.get(node.id);
                                    if (argOnRemoved) {
                                        try {
                                            argOnRemoved.onRemoved(node);
                                        } catch (e) {
                                            console.error('ObserverManager: error calling onRemoved callback', e, argOnRemoved);
                                        }

                                        if (argOnRemoved.autoRemove) {
                                            try {
                                                ObserverManager.removeOnRemoved(node.id);
                                            } catch (e) {
                                                console.error('ObserverManager: error removing onRemoved callback', e, argOnRemoved);
                                            }
                                        } // if autoRemove
                                    } // if argOnRemoved

                                    //2. For each callback, see if its identifier is found as a child of node at some level
                                    ObserverManager.mapOnRemoved.forEach((argOnRemoved, key) => {
                                        let containedElem = node.querySelector(`#${key}`) as Element;
                                        if (containedElem && containedElem instanceof HTMLElement) {
                                            if (argOnRemoved.onRemoved) {
                                                try {
                                                    argOnRemoved.onRemoved(containedElem);
                                                } catch (e) {
                                                    console.error('ObserverManager: error calling onRemoved callback', e, argOnRemoved);
                                                }

                                                if (argOnRemoved.autoRemove) {
                                                    try {
                                                        ObserverManager.removeOnRemoved(key);
                                                    } catch (e) {
                                                        console.error('ObserverManager: error removing onRemoved callback', e, argOnRemoved);
                                                    }
                                                } // if autoRemove
                                            } // if argOnRemoved.onRemoved
                                        } // if containedElem
                                    });
                                } // if node instanceof HTMLElement
                            }); // mutation.removedNodes.forEach

                        } //if (ObserverManager.mapOnRemoved.size > 0 && mutation.removedNodes && mutation.removedNodes.length > 0)

                    } //  if (mutation.type === 'childList')

                }); // mutations.forEach
            }); // new MutationObserver

            ObserverManager.observer.observe(
                document.body,
                {
                    attributes: true,
                    attributeOldValue: true,
                    characterData: true,
                    characterDataOldValue: true,
                    childList: true,
                    subtree: true,
                }
            );
        } // if !ObserverManager.observer
    }

    /**
     * Reset the Mutation observer and create a new singleton
     */
    static reset() {
        try {
            ObserverManager.observer.disconnect();
        } catch (e) {
            console.error('ObserverManager: error disconnecting observer', e);
        }

        ObserverManager.observer = null;
        ObserverManager.initialize(); // initialize a new observer
    }


    //--------------------------- onAdded section --------------------


    /**
     * Get the list of observable ids that have been added and not removed yet
     * @return {string[]} list of observable ids
     */
    static listOnAddedIds(): string[] {
        return Array.from(ObserverManager.mapOnAdded.keys());
    }

    /**
     * Get the list of Args_Observable that have been added and not removed yet
     * @return {Args_OnAdded[]} list of observable args
     */
    static listOnAdded(): Args_OnAdded[] {
        return Array.from(ObserverManager.mapOnAdded.values());
    }

    static addOnAdded(args: Args_OnAdded) {
        if (args == null)
            return;

        let identifier = args.identifier;
        if (identifier == null)
            return;

        if (args.onAdded == null)
            return;
        //default autoRemove to true
        args.autoRemove = args.autoRemove ?? true;

        if (identifier instanceof HTMLElement) {
            if (!identifier.id) {
                identifier.id = ObserverManager.getUniqueId();
            }
            ObserverManager.mapOnAdded.set(identifier.id, args);
        } else {
            ObserverManager.mapOnAdded.set(identifier, args);
        }
    }

    static removeOnAdded(identifier: string | HTMLElement) {
        const key = typeof identifier === 'string' ? identifier : identifier.id;
        if (key != null)
            ObserverManager.mapOnAdded.delete(key);
    }

    //--------------------------- onRemoved section --------------------


    /**
     * Get the list of observable ids that have been added and not removed yet
     * @return {string[]} list of observable ids
     */
    static listOnRemovedIds(): string[] {
        return Array.from(ObserverManager.mapOnRemoved.keys());
    }

    /**
     * Get the list of Args_Observable that have been added and not removed yet
     * @return {Args_OnRemoved[]} list of observable args
     */
    static listOnRemoved(): Args_OnRemoved[] {
        return Array.from(ObserverManager.mapOnRemoved.values());
    }

    static addOnRemoved(args: Args_OnRemoved) {
        if (args == null)
            return;

        let identifier = args.identifier;
        if (identifier == null)
            return;

        if (args.onRemoved == null)
            return;
        //default autoRemove to true
        args.autoRemove = args.autoRemove ?? true;

        if (identifier instanceof HTMLElement) {
            if (!identifier.id) {
                identifier.id = ObserverManager.getUniqueId();
            }
            ObserverManager.mapOnRemoved.set(identifier.id, args);
        } else {
            ObserverManager.mapOnRemoved.set(identifier, args);
        }
    }

    static removeOnRemoved(identifier: string | HTMLElement) {
        const key = typeof identifier === 'string' ? identifier : identifier.id;
        if (key != null)
            ObserverManager.mapOnRemoved.delete(key);
    }

    //--------------------------- onMutation section --------------------


    /**
     * Get the internal list of Args_ObMutation
     * @return {Args_OnMutation[]} list of observable args
     */
    static listOnMutation(): Args_OnMutation[] {
        return ObserverManager.arrayOnMutation;
    }

    /**
     * Add a callback for ANY mutation. This is a global callback that will be called for any mutation in the DOM (as opposed to the specialized added, removed, etc)
     * @param {Args_OnMutation} args
     */
    static addOnMutation(args: Args_OnMutation) {
        if (args == null)
            return;

        if (args.onMutation == null)
            return;

        //default autoRemove to false
        args.autoRemove = args.autoRemove ?? false;

        // only add if it doesn't exist
        let index = ObserverManager.arrayOnMutation.indexOf(args);
        if (index == -1)
            ObserverManager.arrayOnMutation.push(args);
    } // addOnMutation

    static removeOnMutation(mutation: Args_OnMutation) {
        let index = ObserverManager.arrayOnMutation.indexOf(mutation);
        if (index > -1)
            ObserverManager.arrayOnMutation.splice(index, 1);
    }

    private static getUniqueId(): string {
        let id: string;
        let elem: Element | null;
        const prefix = 'nexus-observed-';

        for (let i = 0; i < 1000; i++) {
            id = `${prefix}${ObserverManager.uniqueIdCounter++}`;
            elem = document.getElementById(id);
            if (!elem) {
                return id; // If no element with this ID exists, return it immediately
            }
        } // for

        // If no unique ID is found after 1,000 attempts, generate a completely random string
        return getRandomString(prefix);
    }

} // ObserverManager



class Args_Common {


    /**
     * Defaults to **true** for onAdded and onRemoved
     * Defaults to **false** for onMutation
     *
     * @type {boolean} if true, remove the element and its callback after the first time it is called. If false, the callback will be called every time the element is added to the DOM
     */
    autoRemove?: boolean;

    /**
     * Optional string that can hold anything to distinguish this callback at runtime
     * @type {string}
     */
    notes ?: string;
}

export class Args_OnAdded extends Args_Common {

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
    onAdded: (element: HTMLElement) => void;

} // Args_OnAdded

export class Args_OnRemoved extends Args_Common {

    /**
     * **Required**
     * @type {string | HTMLElement}
     */
    identifier: string | HTMLElement;
    /**
     * **Required**
     * Function called when the element is removed from the DOM
     * @type {(element: HTMLElement) => void}
     * @required
     */
    onRemoved: (element: HTMLElement) => void;

} // Args_OnRemoved

export class Args_OnMutation extends Args_Common {
    /**
     * **Required**
     * Function called when the element is added to the DOM
     *
     * **For Args_OnMutation, autoRemove defaults to false.**
     *
     * @type {(element: HTMLElement) => void}
     * @required
     */
    onMutation: (mutations: MutationRecord[]) => void;


} // Args_OnMutation

nexusMain.UIStartedListeners.add(() => {
    ObserverManager.initialize();
}, 10); // not 1 but before the default of 100