import {getOrInitialize, getAtWindowPath} from "./CoreUtils";
import {getErrorHandler}                  from "./CoreErrorHandling";

const moduleRegistry: string = 'moduleRegistry';
const registeredModules: string = 'registeredModules';




// noinspection JSUnusedGlobalSymbols
export function createInstance<T>(constructorInstance: new () => T, props: Partial<T>): T {
    return Object.assign(new constructorInstance(), props);
}

/**
 * ModuleInitFunctionType type definition as a function that receives a ModuleInfo instance and returns nothing.
 */
export type ModuleInitFunctionType = (moduleInit: ModuleInit) => Promise<void> ;
export type ModuleExitFunctionType = (currentModuleInfo:ModuleInfo, nextModuleInfo: ModuleInfo, params: any) => Promise<void>;

/**
 * Async function that resolves to <code>true</code> to allow open privilege, <code>false</code> otherwise
 */
export type ModuleAllowOpenPrivilegeFunctionType = ()=>Promise<boolean>;

export class ModuleInfo {
    id: string; // the unique id of this module
    name: string; // the name to be displayed in the user interface (ex: in the tree module tree)
    moduleInitFunction: ModuleInitFunctionType; // the function that will be called when this module is selected in the user interface
    moduleExitFunction: ModuleExitFunctionType; // called when another module is selected
    showInMenu: boolean = true; // show in the main menu as a module
    allowOpenPrivilege ?:ModuleAllowOpenPrivilegeFunctionType; // is open allowed

    constructor(partial: Partial<ModuleInfo>) {
        Object.assign(this, partial);
    }
}


// noinspection JSUnusedGlobalSymbols
export function addModule(module: ModuleInfo): void {
    if (module.id == null){
        getErrorHandler().displayErrorMessageToUser("ModuleRegistry.addModule received a non-module parameter:\n\n" + JSON.stringify(module, null, 2));
        return
    }


    let moduleRoot = getModules();
    if ( moduleRoot)
        moduleRoot.set(module.id, module)
}

// noinspection JSUnusedGlobalSymbols
export function removeModule(id: string): void {
    if (id) {
        let moduleRoot = getModules();
        moduleRoot.delete(id);
    }
}

export function existsModule( module:ModuleInfo): boolean{
    let list = getModules();
    if (list){
        let mod = list.get(module.id);
        if (mod)
            return true;
    }
    return false;
}



export function getModules(): Map<string, ModuleInfo> {
    let rootObj  = getAtWindowPath(moduleRegistry);
    // noinspection UnnecessaryLocalVariableJS
    let val :Map<string, ModuleInfo> = getOrInitialize(rootObj, registeredModules, () =>{
        return new Map<string, ModuleInfo>();
    });

    return val;
}


export class ModuleInit {
    currentDocument: Document;
    currentWindow: Window;
    moduleContainerTagID: string;
    initialParams:{};

    constructor(partial: Partial<ModuleInit>) {
        Object.assign(this, partial);
    }

    public getModuleDisplayContainer(): HTMLElement {
        // noinspection UnnecessaryLocalVariableJS
        let moduleContainer = document.getElementById(this.moduleContainerTagID);
        return moduleContainer;
    }
}
