import {AnyWidget, Args_AnyWidget}                  from "../AnyWidget";
import {SelectedEventArgs, Uploader, UploaderModel} from "@syncfusion/ej2-inputs";
import {EmitType}                                   from "@syncfusion/ej2-base";
import {Args_AbstractWidget}                        from "../AbstractWidget";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}         from "../../BaseUtils";

export class Args_WgtUpload extends Args_AnyWidget<UploaderModel> implements IArgs_HtmlTag {
   propertyName: string;
   htmlTagClass?: string;
   htmlTagStyle?: string;
   htmlTagType?: string;
   errorTag             ?: IArgs_HtmlTag;


   /**
    * Triggers after selecting or dropping the files by adding the files in upload queue.
    * @event SelectedEventArgs
    */
   selected ?: EmitType<SelectedEventArgs>;


}

export abstract class AbstractWgtUpload extends AnyWidget<Uploader> {
   argsWgtUpload: Args_WgtUpload;
   protected errorTagId: string;
   protected wrapperTagId: string;

   protected readonly MB         = 1024 * 1024;
   protected readonly GB         = 1024 * this.MB;
   protected maxFileSize: number = this.GB;

   protected constructor() {
      super();
   }

   /**
    * Called from any inheriting class to initialize all the properties during creation
    * @param args
    */
   initialize_AbstractWgtUpload(args ?: Args_WgtUpload) {

      if (!args) {
         args = {propertyName: 'upload'}
      }

      args      = this.customizeArgs(args); // give extending classes a chance to modify
      this.argsWgtUpload = args;

      super.initialize_AnyWidget(args);

   } //initialize_WgtUpload

   /**
    * Override this method to change arguments in extending classes
    * @param args
    */
   customizeArgs(args: Args_WgtUpload): Args_WgtUpload {
      return args;
   }

    async localContentBegin(): Promise<string> {

      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.argsWgtUpload, false);
       IArgs_HtmlTag_Utils.init(this.argsWgtUpload); // htmlTagClass is not null
       if (classString) {
          if (this.argsWgtUpload.htmlTagClass )
             this.argsWgtUpload.htmlTagClass += ' '
          this.argsWgtUpload.htmlTagClass += classString
       } // if classString

      if (!this.errorTagId)
         this.errorTagId = `${this.tagId}_error`
      if (!this.wrapperTagId)
         this.wrapperTagId = `${this.tagId}_wrapper`

      let x: string = '';

      if (this.argsWgtUpload.wrapper) {
         this.argsWgtUpload.wrapper = IArgs_HtmlTag_Utils.init(this.argsWgtUpload.wrapper);
         x += `<${this.argsWgtUpload.wrapper.htmlTagType} id="${this.wrapperTagId}" ${IArgs_HtmlTag_Utils.all(this.argsWgtUpload.wrapper)}>`;
      }

      x += `<input type="file" id="${this.tagId}" name="${this.argsWgtUpload.propertyName}"  data-msg-containerid="${this.errorTagId}" ${IArgs_HtmlTag_Utils.all(this.argsWgtUpload)}>`;

      x += `
            <div ${IArgs_HtmlTag_Utils.all(this.argsWgtUpload.errorTag)} >
                 <div id="${this.errorTagId}"></div> 
            </div>  
    `;

      if (this.argsWgtUpload.wrapper) {
         x += `</${this.argsWgtUpload.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }

      return x;
   }

   async localContentEnd(): Promise<string> {
      return ''
   }

   async localLogicImplementation() {
      let args = this.argsWgtUpload;

      let uploaderModel: UploaderModel = args.ej || {}; // default to args.ej, but ensure it's not null
      if (args.selected) {
         // specifically defined always wins over ej
         uploaderModel.selected = args.selected
      }
      if (!uploaderModel.maxFileSize)
         uploaderModel.maxFileSize = this.maxFileSize;

      this.obj = new Uploader(uploaderModel, this.hgetInput);

   }// localInitLogicImplementation


} // main class