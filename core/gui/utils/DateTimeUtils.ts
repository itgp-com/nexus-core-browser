export function dateTimeUtils(d: number) {
   d     = Number(d);
   let h = Math.floor(d / 3600);
   let m = Math.floor(d % 3600 / 60);
   let s = Math.floor(d % 3600 % 60);

   let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
   let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
   let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
   return hDisplay + mDisplay + sDisplay;
}

export function convertToLocalDate(record: any, propertyName: string) {
   if (record) {
      if (propertyName) {
         let time = record[propertyName];
         if (time instanceof Date) {
            // convert from GMT to local time
            record[propertyName] = new Date(time.getTime() - 60000 * time.getTimezoneOffset());
         }
      }
   }
} // convertZuluToLocal
export function isSameDay(d1: Date, d2: Date) {
   if (!d1 || !d2)
      return false;
   return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
}

/**
 * Keep the date portion only and set hour, minutes, seconds and millis to 0
 * @param d
 */
export function toDateOnly(d: Date): Date {
   if (d)
      d.setHours(0, 0, 0, 0);
   return d;
}