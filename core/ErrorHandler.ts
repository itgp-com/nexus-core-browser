import {cu} from "./index";

export class ErrorHandler {

   private _errorTemplateTagID: string = cu.getRandomString('errorTemplateID');
   private _errorMessageTagID:string   = cu.getRandomString('errorMessage');


   documentClickAdded:boolean = false;

   public displayExceptionToUser(ex:any) {
      if (ex== null)
         return;

      if ( ex instanceof Error) {
         this.displayErrorMessageToUser(ex.message);
         console.log(ex);
      } else if (typeof ex === 'string' || typeof ex === 'number'){
         this.displayErrorMessageToUser(ex as string);
         console.log(ex);
      } else if ( typeof ex === 'object' && (ex.hasOwnProperty('displayMessage') || ex.hasOwnProperty('logMessage')) ){ //  instanceof Err
         let displayMessage = ex.displayMessage;
         let logMessage = ex.logMessage;
         if ( displayMessage) {
            this.displayErrorMessageToUser(ex.displayMessage);
         } else {
            if (logMessage) {
               this.displayErrorMessageToUser(ex.logMessage);
            } else {
               this.displayErrorMessageToUser("ERROR without any messages. Check network and console in browser.");
            }
         }

         if (ex.logMessage)
            console.log(ex.logMessage);

      } else {
         this.displayErrorMessageToUser(ex.toString());
         console.log(ex.toString())
      }
   }

   public displayErrorMessageToUser(errorText: string){

      setTimeout( ()=> {
                     console.log(`Exception occurred. Message is: ${errorText}`);

                     this._initDisplayExceptionHTML(errorText); // initialize HTML

                     $(`#${this._errorTemplateTagID}`).show();

                     if (!this.documentClickAdded) {
                        $(document).on("click", (_) => {
                           this.dismissVisibleErrorMessage(); // when any part of the document outside the error message is pressed, the error disappears
                        });
                        this.documentClickAdded = true;
                     }
                  },
                  20
      );

   }

   private _initDisplayExceptionHTML(errorText: string) {

      let html: string = `

<div id="${this._errorTemplateTagID}" class="core-alert-bottom alert alert-danger alert-dismissible" >
  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
  <strong>Error!</strong> <div id="${this.errorMessageTagID}"></div>
</div>

        `;



      if (document.getElementById(this._errorTemplateTagID)) {
         // should update template with data from ex
      } else {
         // template not in document
         document.body.insertAdjacentHTML('beforeend', html);
      }
      this.dismissVisibleErrorMessage(); // hide it at first
      $(`#${this.errorMessageTagID}`).first().text(errorText);

   }

   public dismissVisibleErrorMessage(){
      $(`#${this._errorTemplateTagID}`).hide();
   }



   //-------------------------------- getters and setters ------------------
   get errorTemplateTagID(): string {
      return this._errorTemplateTagID;
   }

   set errorTemplateTagID(value: string) {
      this._errorTemplateTagID = value;
   }


   get errorMessageTagID(): string {
      return this._errorMessageTagID;
   }

   set errorMessageTagID(value: string) {
      this._errorMessageTagID = value;
   }
} // class ErrorHandling