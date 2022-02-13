import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}         from "../Args_AnyWidget";
import {AnyWidget}                                  from "../AnyWidget";
import {SelectedEventArgs, Uploader, UploaderModel} from "@syncfusion/ej2-inputs";
import {EmitType}                                   from "@syncfusion/ej2-base";

export class Args_WgtUpload implements IArgs_HtmlTag {
   propertyName: string;
   autoUpload ?: boolean
   allowedExtensions ?: string;
   maxFileSize ?: number;
   htmlTagClass?: string;
   htmlTagStyle?: string;
   htmlTagType?: string;
   /**
    * If this is present,  a new wrapper div is created around the actual input element.
    */
   wrapper           ?: IArgs_HtmlTag;
   errorTag             ?: IArgs_HtmlTag;

   ej                ?: UploaderModel

   /**
    * Triggers after selecting or dropping the files by adding the files in upload queue.
    * @event SelectedEventArgs
    */
   selected ?: EmitType<SelectedEventArgs>;


}

export class WgtUpload extends AnyWidget<Uploader> {
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
   initialize_WgtUpload(args ?: Args_WgtUpload) {

      if (!args) {
         args = {propertyName: 'upload'}
      }

      args      = this.customizeArgs(args); // give extending classes a chance to modify
      this.argsWgtUpload = args;
      if (args.maxFileSize)
         this.maxFileSize = args.maxFileSize

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
      uploaderModel.autoUpload         = args.autoUpload;
      uploaderModel.allowedExtensions  = args.allowedExtensions;
      uploaderModel.maxFileSize        = this.maxFileSize;
      if (args.selected) {
         // specifically defined always wins over ej
         uploaderModel.selected = args.selected
      }

      this.obj = new Uploader(uploaderModel, this.hgetInput);

   }// localInitLogicImplementation


} // main class