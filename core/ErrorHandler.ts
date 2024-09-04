import {isAxiosError} from 'axios';
import {Err, getRetValErr} from './Core';

export class ErrorHandler {

    private _errorTemplateTagID: string = `errorTemplateID_${getRandomInt(1000)}_${getRandomInt(100000)}`;
    private _errorMessageTagID: string = `errorMessage_${getRandomInt(1000)}_${getRandomInt(100000)}`;


    documentClickAdded: boolean = false;

    public displayExceptionToUser(ex: any) {
        if (ex == null)
            return;

        if (isAxiosError(ex)) {
            let err: Err = getRetValErr(ex.response?.data);
            if (err) {
                if (err.displayMessage)
                    this.displayErrorMessageToUser(err.displayMessage);
                if (err.logMessage)
                    console.error(err.logMessage);
                if (err.extra)
                    console.error(err.extra);
            } else {
                this.displayErrorMessageToUser(ex.message); // default Axios error message
            }
        } else if (ex instanceof Error) {
            this.displayErrorMessageToUser(ex.message);
            console.error(ex);
        } else if (typeof ex === 'string' || typeof ex === 'number') {
            this.displayErrorMessageToUser(ex as string);
            console.error(ex);
        } else if (typeof ex === 'object' && (ex.hasOwnProperty('displayMessage') || ex.hasOwnProperty('logMessage'))) { //  instanceof Err
            let displayMessage = ex.displayMessage;
            let logMessage = ex.logMessage;
            if (displayMessage) {
                this.displayErrorMessageToUser(ex.displayMessage);
            } else {
                if (logMessage) {
                    this.displayErrorMessageToUser(ex.logMessage);
                } else {
                    this.displayErrorMessageToUser("ERROR without any messages. Check network and console in browser.");
                }
            }

            if (ex.logMessage)
                console.error(ex.logMessage);

        } else {
            this.displayErrorMessageToUser(ex.toString());
            console.error(ex.toString())
        }
    }

    public displayErrorMessageToUser(errorText: string) {

        setTimeout(() => {
                console.error(`Exception occurred. Message is: ${errorText}`);

                this._initDisplayExceptionHTML(errorText); // initialize HTML

                let errorTemplateElement: HTMLElement = document.getElementById(this._errorTemplateTagID) as HTMLElement
                if (errorTemplateElement)
                    errorTemplateElement.style.display = 'block';

                if (!this.documentClickAdded) {

                    let eventListener: EventListener = (_) => {
                        this.dismissVisibleErrorMessage(); // when any part of the document outside the error message is pressed, the error disappears
                    };
                    document.addEventListener('click', eventListener);

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

        let errorTemplateElement: HTMLElement = document.getElementById(this._errorTemplateTagID) as HTMLElement
        if (errorTemplateElement) {
            errorTemplateElement.style.display = 'block';
            errorTemplateElement.style.zIndex = `${Number.MAX_SAFE_INTEGER - 100}`; // leave some wiggle room for other elements
        }

        let errorMessageTag: HTMLElement = document.getElementById(this.errorMessageTagID) as HTMLElement
        if (errorMessageTag) {
            errorMessageTag.innerText = errorText;
        }

    }

    public dismissVisibleErrorMessage() {
        let errorTemplateElement: HTMLElement = document.getElementById(this._errorTemplateTagID) as HTMLElement
        if (errorTemplateElement) {
            errorTemplateElement.style.zIndex = ''; // remove zindex from style
            errorTemplateElement.style.display = 'none';
         }
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


function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}