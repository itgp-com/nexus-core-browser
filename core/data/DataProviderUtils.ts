import {DataByStringId, DataProvider} from "./DataProvider";


export class Args_SimpleDataProvider<T> {
   record:T;
   providerName: string;
}
export function singleRecordDataProvider<T=any>(args:Args_SimpleDataProvider<T>){
   let provider: DataProvider<T> = DataProvider.create({
                                                                         value: {
                                                                                   key: args.providerName,
                                                                                   instance: args.record
                                                                                } as DataByStringId<T>,
                                                                      });
   return provider;
}