import {AdaptorOptions, DataManager, DataOptions, Query} from "@syncfusion/ej2-data";
import {Ajax}                                from "@syncfusion/ej2-base";
import {applyGlobalHttpHeadersToHttpRequest} from "../HttpUtils";

function customizeUrlAdaptor(dataSource: DataOptions | JSON[] | Object[]): (DataOptions | JSON[] | Object[]) {
   if (dataSource && !Array.isArray(dataSource)) {
      let adaptor = (dataSource as DataOptions).adaptor;
      if (adaptor) {
         if (!(adaptor['__beforeSendNexus'])) {
            let originalBeforeSend       = adaptor.beforeSend;
            adaptor.beforeSend           = (dm: DataManager, request: XMLHttpRequest, settings?: Ajax): void => {

               applyGlobalHttpHeadersToHttpRequest(request);

               if (originalBeforeSend) {
                  originalBeforeSend.call(this, [dm, request, settings]);
               }
            };
            adaptor['__beforeSendNexus'] = true; // mark it as customized already
         }
      } // if adaptor
   } // if datasource is DataOptions
   return dataSource;
}

export class DataManagerNexus extends DataManager {
   constructor(dataSource?: DataOptions | JSON[] | Object[], query?: Query, adaptor?: AdaptorOptions | string) {
      super(customizeUrlAdaptor(dataSource), query, adaptor);
   }
}