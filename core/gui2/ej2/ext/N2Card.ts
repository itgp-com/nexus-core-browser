import {Nx2Panel} from '../../generic/Nx2Panel';
import {Nx2Basic, StateNx2Basic} from '../../Nx2Basic';
import {addNx2Class, Nx2HtmlDecorator} from '../../Nx2HtmlDecorator';


export interface StateN2Card extends StateNx2Basic {
    header_deco ?: Nx2HtmlDecorator;
    header_caption_deco ?: Nx2HtmlDecorator;
    header_title_deco ?: Nx2HtmlDecorator;
    header_title ?: (string | HTMLElement);
    content_deco ?: Nx2HtmlDecorator;
    content ?: (string | HTMLElement);
} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-Card-xxxxx classes
 */
export class N2Card<STATE extends StateN2Card = StateN2Card> extends Nx2Basic<STATE> {
    static readonly CLASS_IDENTIFIER:string = "N2Card"

   private _content :Nx2Panel;
   private _header :Nx2Panel;
   private _header_caption :Nx2Panel;
   private _header_title :Nx2Panel;

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Card.CLASS_IDENTIFIER, 'e-card');
    }



    onStateInitialized(state: STATE) {

        state.header_deco = state.header_deco || {};
        state.header_caption_deco = state.header_caption_deco || {};
        state.header_title_deco = state.header_title_deco || {};
        state.content_deco = state.content_deco || {};


        addNx2Class(state.header_deco, 'e-card-header');
        addNx2Class(state.header_caption_deco, 'e-card-header-caption');
        addNx2Class(state.header_title_deco, 'e-card-header-title');
        addNx2Class(state.content_deco, 'e-card-content');


        this._content = new Nx2Panel({deco:state.content_deco});


        this._header_title = new Nx2Panel({deco:state.header_title_deco});
        this._header_caption = new Nx2Panel({deco:state.header_caption_deco, children:[this._header_title]});
        this._header = new Nx2Panel({deco:state.header_deco, children:[this._header_caption]});


        if (state.header_title) {
            if (typeof state.header_title === 'string') {
                this._header_title.state.deco.text= state.header_title;
            } else {
                this._header_title.state.children = [state.header_title];
            }
        }

        if (state.content) {
            if (typeof state.content === 'string') {
                this._content.state.deco.text= state.content;
            } else {
                this._content.state.children = [state.content];
            }
        }

        state.children = [this._header, this._content];

        super.onStateInitialized(state);
    } // onStateInitialized


    public get content(): Nx2Panel {
        return this._content;
    }

    public get header(): Nx2Panel {
        return this._header;
    }

    public get header_caption(): Nx2Panel {
        return this._header_caption;
    }

    public get header_title(): Nx2Panel {
        return this._header_title;
    }

    get classIdentifier() { return N2Card.CLASS_IDENTIFIER; }
} // main class