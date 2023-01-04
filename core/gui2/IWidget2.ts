

export interface IWidget2 {


   createHtmlElement(): Promise<HTMLElement>;

   refresh(f ?:(VoidFunction| Promise<VoidFunction>)):Promise<void>;
}