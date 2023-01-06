/**
 * This class is used to hold a record so that when the record is replaced by another instance,
 * a widget referencing this RecHolder does not need to be modified to point to the new record.
 */
export class RecHolder<T=any> {
   private _rec:T;


   constructor(rec ?: T) {
      this._rec = rec;
   }

   get rec(): T {
      return this._rec;
   }

   set rec(value: T) {
      this._rec = value;
   }
}