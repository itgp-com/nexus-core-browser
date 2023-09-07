import {ChangeEventArgs} from '@syncfusion/ej2-buttons/src/common/common';
import {cssAddClass} from '../../../CoreUtils';
import {ChartTheme, switchTheme, themeChangeListeners} from '../../../gui2/Theming';
import {nexusMain} from '../../../NexusMain';
import {N2Html} from '../../generic/N2Html';
import {N2Panel, StateN2Panel} from '../../generic/N2Panel';
import {N2Switch} from '../ext/N2Switch';

const CLASS_N2ThemeSwitcher_cssClass = 'N2ThemeSwitcher_cssClass';

/**
 * On start add a custom class used in the cssClass
 */
nexusMain.UIStartedListeners.add((ev) => {
    // group area background color
    cssAddClass(CLASS_N2ThemeSwitcher_cssClass, {
        'align-self': 'stretch',
        display: 'flex',
        'align-items': 'center',
    });
});


export class N2ThemeSwitcher extends N2Panel {
    themeSwitch: N2Switch;
    labelThemeLight: N2Html;
    labelThemeDark: N2Html;

    constructor() {
        super();
    }


    protected onStateInitialized(state: StateN2Panel): void {
        this.initialize();

        state.deco.style = {
            display: 'flex',
            'flex-direction': 'row',  /* This ensures that the children are listed horizontally */
            'align-items': 'center',
            margin: '5px 5px'
        }

        themeChangeListeners().add((ev) => {
            // simply update the state of the UI component if the theme state has changed somewhere else
            let themeState = ev.newState;
            let currentState = (this?.themeSwitch?.obj?.checked ? 'dark' : 'light');

            if (currentState && currentState !== themeState.theme_type) {
                this.themeSwitch.obj.checked = themeState.theme_type === 'dark'; // light = false, dark = true
            }
        });

        state.children = [
            this.labelThemeLight,
            this.themeSwitch,
            this.labelThemeDark,
        ];

        super.onStateInitialized(state);
    } // onStateInitialized

    initialize() {

        let themeSwitch: N2Switch = new N2Switch({
                deco: {
                    tag: 'input',
                    otherAttr: {
                        type: 'checkbox',
                    }
                },
                wrapper: {
                    style: {
                        display: 'flex',
                        'align-items': 'center',
                        'flex-grow': 1,
                        'height': '100%',

                    },
                },
                ej: {
                    cssClass: CLASS_N2ThemeSwitcher_cssClass,
                    change: (ev: ChangeEventArgs) => {
                        let themeType: 'light' | 'dark' = (ev.checked) ? 'dark' : 'light';
                        let themeName: ChartTheme = (themeType === 'dark') ? 'MaterialDark' : 'Material';
                        switchTheme({
                            style_class_name: 'app-material-theme',
                            theme_type: themeType,
                            ej2ThemeName: themeName,
                        });
                    }, //  change
                }, // ej
            })
        ; // themeSwitch


        let labelThemeLight: N2Html = new N2Html({
            deco: {
                tag: 'label',
                style: {
                    border: '1px solid lightgray',
                    'border-radius': '1em',
                    'margin-right': '5px',
                }
            },
            value: '<span style="padding: 0 3px;"><span style="padding:0 3px;font-size: x-small;">Light</span><i style="color:orange" class="fa-regular fa-sun"></i></span>',
        });
        labelThemeLight.htmlElementAnchor.onclick = () => {
            // this only happens on human interaction
            themeSwitch.obj.checked = false;
            themeSwitch.obj.change({checked: false, name: 'change'});
        }

        let labelThemeDark: N2Html = new N2Html({
            deco: {
                tag: 'label',
                style: {
                    border: '1px solid lightgray',
                    'border-radius': '1em',
                    'margin-left': '5px',
                }
            },
            value: `<span style="padding: 0 3px;"><i class="fa-solid fa-moon"></i><span style="padding:0px 3px;font-size: x-small;">Dark</span></span>`,
        });

        labelThemeDark.htmlElementAnchor.onclick = () => {
            // this only happens on human interaction
            themeSwitch.obj.checked = true;
            themeSwitch.obj.change({checked: true, name: 'change'});
        }

        this.themeSwitch = themeSwitch;
        this.labelThemeLight = labelThemeLight;
        this.labelThemeDark = labelThemeDark;


    } // initialize


} // N2ThemeSwitcher