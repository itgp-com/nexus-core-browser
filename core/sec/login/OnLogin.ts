
interface ICallbackFunction {
   (): (void |Promise<void>);
}
let callbackList: ICallbackFunction[] = [];

export function onLogin(callback: ICallbackFunction){
   callbackList.push(callback);
} // onStart

/**
 * The application should fire this method once login is successful.
 *
 * It is not call automatically by the system. Look in UI_App in individual apps for examples
 */
export async function fireOnLogin(){
   if (!callbackList ||  callbackList.length == 0)
      return;


   for (let i = 0; i < callbackList.length; i++) {
      let callback:ICallbackFunction = callbackList[i];
      try {
         await callback();
      } catch(ex) {
         console.error( ex);
      }
   }

}