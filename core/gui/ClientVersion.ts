export type ClientVersion = {
   /**
    * "major": 1
    */
   major: number;

   /**
    * "minor": 0,
    */
   minor: number;

   /**
    *  "build": 45,
    */
   build: number;

   /**
    *  "created": "2022-02-17 09:49 EST"
    */
   created: string;

} //-------------------------------


let _clientVersion: ClientVersion = null;

export function getClientVersion() {
   return _clientVersion;
}

export function setClientVersion(newClientVersion: ClientVersion): void {
   _clientVersion = newClientVersion;
}