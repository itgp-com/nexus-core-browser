# Nexus Core Browser — AI-Oriented Architecture Reference

## 1. What This Library Is

**nexus-core-browser** is a TypeScript widget abstraction layer that wraps
[Syncfusion Essential JS 2 (EJ2)](https://www.syncfusion.com/ej2) components so that
(1) the HTML element, (2) the Syncfusion JS component instantiation, and (3) the
`appendTo` call are handled **automatically** as part of the widget lifecycle.  The
developer provides a **state object** (containing the Syncfusion model under `ej`)
and the library generates the DOM element, instantiates the EJ2 component, appends
it to the DOM, and wires resize sensing, error handling, and child-widget
initialisation — all without separate HTML-insertion + widget-creation steps.

The library also includes **standalone widgets** (extending `N2` or `N2Basic` but
NOT `N2Ej`) that provide layout primitives, HTML rendering, dialogs, and other
non-Syncfusion UI building blocks.  These share the same state/lifecycle pattern.

> **Deprecated:** Widgets under `gui/` (class names starting with `Wx`) are
> superseded by `gui2/` (class names starting with `N2`). Ignore the `gui/`
> directory for new code.

---

## 2. Class Hierarchy

```
N2<StateN2, JS_COMPONENT>                   (abstract — gui2/N2.ts)
├── N2Basic<StateN2Basic, JS_COMPONENT>     (gui2/N2Basic.ts)
│   ├── N2Row                               (gui2/generic/N2Row.ts)
│   ├── N2Html                              (gui2/generic/N2Html.ts)
│   ├── N2Panel                             (gui2/generic/N2Panel.ts)
│   ├── N2PanelLayout                       (gui2/generic/N2PanelLayout.ts)
│   │   └── N2PanelGrid                     (gui2/ej2/derived/N2PanelGrid.ts)
│   └── … (other standalone layout/display widgets)
│
└── N2Ej<StateN2Ej, EJ2COMPONENT>           (abstract — gui2/ej2/N2Ej.ts)
    └── N2EjBasic<StateN2EjBasic, EJ2C>     (abstract — gui2/ej2/N2EjBasic.ts)
        ├── N2Button                        (gui2/ej2/ext/N2Button.ts)
        ├── N2TextField                     (gui2/ej2/ext/N2TextField.ts)
        ├── N2Grid                          (gui2/ej2/ext/N2Grid.ts)
        ├── N2Dialog                        (gui2/ej2/ext/N2Dialog.ts)
        ├── N2ComboBox                      (gui2/ej2/ext/N2ComboBox.ts)
        ├── N2DropDownMenu                  (gui2/ej2/derived/N2DropDownMenu.ts)
        └── … (~80+ EJ2 wrappers)
```

### Key distinction

| Base class | Purpose |
|---|---|
| `N2` | Root abstract class. Owns state, HTML-element lifecycle, resize sensing, error routing, child management. **Every widget is an N2.** |
| `N2Basic` | Non-EJ2 widgets. Provides default `onHtml` (generates a plain `<div>` from the state's N2HtmlDecorator), a no-op `onLogic`, and child-destroy in `onDestroy`. |
| `N2Ej` | EJ2-wrapping widgets. Adds `createEjObj()` (abstract — you instantiate the Syncfusion component), automatic `appendTo`, and EJ2-instance tagging on the state model. |
| `N2EjBasic` | Convenience layer that combines `N2Ej`'s EJ2 lifecycle with `N2Basic`'s default HTML generation. Most leaf EJ2 widgets extend this. |

---

## 3. The State Pattern (`StateN2` and its extensions)

Every widget carries a **state object** (property `state`) that holds **all**
declarative configuration. The state is typed via a generic parameter so each
widget class gets precise autocompletion.

### Core state fields (`StateN2` — gui2/StateN2.ts)

| Field | Type | Purpose |
|---|---|---|
| `tagId` | `string` | Unique DOM id; auto-generated if not set. Becomes the `id` attribute of the anchor HTML element. |
| `deco` | `N2HtmlDecorator` | The HTML decorator that describes the anchor element's tag, CSS classes, inline style, and other attributes. Automatically initialised to a default `<div>`. |
| `wrapper` | `N2HtmlDecorator` | Optional wrapper element that surrounds the anchor element. |
| `wrapperTagId` | `string` | Id for the wrapper element (defaults to `tagId + '_wrapper'`). |
| `children` | `Array<Elem_or_N2>` | Child widgets or raw HTMLElements that are appended inside the anchor element during `onHtml`. |
| `siblings` / `prefixSiblings` | `Array<Elem_or_N2>` | Elements placed after/before the anchor inside the wrapper. |
| `ref` | `StateN2Ref` | Runtime references back-populated by the widget (e.g. `ref.htmlElement`, `ref.widget`). Each widget subclass narrows `ref` to add its own back-references. |
| `resizeTracked` | `boolean` | If true, a `ResizeSensor` is attached and `onResized` fires on size changes. |
| `noTagIdInHtml` | `boolean` | If true, the `tagId` is NOT written as the DOM `id` attribute. |
| `other` | `any` | Bag for arbitrary developer data (initialised to `{}`). |

### EJ2 state fields (`StateN2Ej` — gui2/ej2/N2Ej.ts)

| Field | Type | Purpose |
|---|---|---|
| `ej` | `WIDGET_LIBRARY_MODEL` | **The Syncfusion model** (e.g. `GridModel`, `ButtonModel`, `DialogModel`). This is passed directly to the Syncfusion component constructor. |
| `skipAppendEjToHtmlElement` | `boolean` | If true, the automatic `appendTo` call is skipped; developer must call it manually. |
| `onEjObj` | `function \| function[]` | Callback(s) fired at the end of `onLogic` after the EJ2 object is created and appended. |

### Lifecycle hook fields on state

Every lifecycle method on the `N2` class has a **corresponding callback on the
state object**.  If the state callback is set, it is called **instead of** the
class method (not in addition to).  This lets developers override behaviour
without subclassing:

| Class method | State callback | When called |
|---|---|---|
| `onStateInitialized` | `state.onStateInitialized` | After `_constructor`, before HTML generation |
| `onBeforeInitHtml` | `state.onBeforeInitHtml` | Just before `onHtml` |
| `onHtml` | `state.onHtml` | To generate the HTMLElement |
| `onLogic` | `state.onLogic` | After HTML is created, to instantiate JS component |
| `onAfterInitWidgetOnly` | `state.onAfterInitWidgetOnly` | After this widget's logic, before children's logic |
| `onAfterChildrenInit` | `state.onAfterChildrenInit` | After all children's `initLogic` have completed |
| `onAfterInitLogic` | `state.onAfterInitLogic` | After this widget AND all children are initialised |
| `onDestroy` | `state.onDestroy` | During destruction |
| `onDOMAdded` | `state.onDOMAdded` | When this widget's HTML element is added to the DOM |
| `onDOMRemoved` | `state.onDOMRemoved` | When this widget's HTML element is removed from the DOM |
| `onResized` | `state.onResized` | When the widget's element changes size (if `resizeTracked`) |

---

## 4. Complete Widget Lifecycle

```
new Widget(state)
  └─ constructor(state)
       └─ _constructor(state)           ← initialise state defaults,
                                           generate tagId,
                                           stamp state.ref.widget = this
       └─ _triggerOnStateInitialized()  ← fires once, lazily (may be
                                           deferred until htmlElement getter
                                           or initLogic is called)
            └─ onStateInitialized(state) ← add CSS class identifiers,
                                           configure ej defaults,
                                           set up event listeners

  … later, when the widget is actually used …

  htmlElement getter  (or initLogic called explicitly)
    └─ _triggerOnStateInitialized()     ← no-op if already called
    └─ initHtml()
         └─ onBeforeInitHtml()
         └─ onHtml()                     ← generates HTMLElement from
                                           state.deco / state.wrapper /
                                           state.children
         └─ registers onDOMAdded /
            onDOMRemoved observers

  initLogic()
    └─ (no-op if already initialised)
    └─ onBeforeInitLogic(args)           ← can set args.cancel = true
    └─ this.initialized = true
    └─ initHtml()                        ← ensure HTML exists
    └─ onLogic(args)
         └─ [N2Ej] createEjObj()         ← new SyncfusionComponent(state.ej)
         └─ [N2Ej] tag obj with N2 ref
         └─ [N2Ej] appendEjToHtmlElement() ← obj.appendTo(htmlElementAnchor)
         └─ [N2Ej] fire state.onEjObj listeners
    └─ onAfterInitWidgetOnly()
    └─ for each child: child.initLogic() ← recurse
    └─ onAfterChildrenInit()
    └─ onAfterInitLogic()
    └─ if resizeTracked: attach ResizeSensor
```

### Key properties during/after lifecycle

| Property | Description |
|---|---|
| `obj` | The underlying JS component. For EJ2 widgets this is the Syncfusion `Component` instance (Grid, Button, Dialog, etc.). For non-EJ2 widgets it can be any value. |
| `htmlElement` | The **outermost** HTML element for this widget. If a wrapper exists, this is the wrapper; otherwise the anchor. Accessing this getter triggers `onStateInitialized` + `initHtml` if not already done. |
| `htmlElementInitialized` | Like `htmlElement` but also triggers `initLogic` if needed. |
| `htmlElementAnchor` | The **inner** HTML element — where the EJ2 component is actually appended. If there is a wrapper with a tagId, this is the inner element matching that tagId. |
| `htmlElementAnchorInitialized` | Like `htmlElementAnchor` but triggers `initLogic` if needed. |
| `initialized` | `true` once `initLogic` has completed. |
| `parent` | Reference to the parent `N2` widget (set when added as a child). |

---

## 5. N2HtmlDecorator — How HTML Is Generated

The `N2HtmlDecorator` interface (gui2/N2HtmlDecorator.ts) describes the HTML
attributes of a DOM element declaratively:

```typescript
interface N2HtmlDecorator {
    tag?: string;                    // default 'div'
    classes?: string | string[];     // CSS classes
    style?: CssStyle | string;       // inline CSS
    otherAttr?: IKeyValueString;     // any other HTML attributes (id, type, name, data-*, etc.)
    text?: string;                   // inner text (escaped unless escapeText is false)
    escapeText?: boolean;            // whether to HTML-escape text (default false)
    state?: StateN2;                 // back-reference to the owning state (set automatically)
}
```

The static helper `IHtmlUtils` serialises a decorator into an HTML attribute
string. `createN2HtmlBasic(state)` in N2Utils.ts uses the decorator(s) plus
`children`, `siblings`, `prefixSiblings`, and `wrapper` to build the complete
DOM subtree.

**Example — what `createN2HtmlBasic` produces for a text field:**

```
<wrapper>                              ← state.wrapper (if present)
  <prefixSibling/>…                    ← state.prefixSiblings
  <anchor id="tagId" class="…" …>     ← state.deco
    <child/>…                          ← state.children
  </anchor>
  <sibling/>…                          ← state.siblings
</wrapper>
```

---

## 6. How to Create an EJ2 (Syncfusion) Widget

Follow this pattern for each Syncfusion component you want to wrap.  Example
uses `N2Button` (gui2/ej2/ext/N2Button.ts):

### Step 1 — Define the State interface

```typescript
import {ButtonModel} from '@syncfusion/ej2-buttons';
import {StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

export interface StateN2ButtonRef extends StateN2EjBasicRef {
    widget?: N2Button;           // narrow ref.widget to this class
}

export interface StateN2Button extends StateN2EjBasic<ButtonModel> {
    // Syncfusion model lives in state.ej (typed as ButtonModel)

    label?: StringArg;           // custom nexus-level property
    onclick?: (ev: MouseEvent) => void;

    ref?: StateN2ButtonRef;      // narrow the ref type
}
```

### Step 2 — Define the Widget class

```typescript
export class N2Button<STATE extends StateN2Button = StateN2Button>
    extends N2EjBasic<STATE, Button> {

    static readonly CLASS_IDENTIFIER: string = 'N2Button';

    constructor(state?: STATE) {
        super(state);
    }

    // onStateInitialized: set up CSS classes, HTML tag, defaults
    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Button.CLASS_IDENTIFIER);
        state.deco.tag = 'button';                     // override from default 'div'
        state.deco.otherAttr['type'] = 'button';
        super.onStateInitialized(state);
    }

    // onLogic: custom logic before EJ2 creation
    onLogic(ev: N2Evt_OnLogic) {
        if (this.state.label)
            state.ej.content = stringArgVal(state.label);
        super.onLogic(ev);  // ← this calls createEjObj() then appendEjToHtmlElement()
        // … attach click handlers
    }

    // createEjObj: the ONE place where you instantiate the Syncfusion component
    createEjObj(): void {
        this.obj = new Button(this.state.ej);
    }

    get classIdentifier() {
        return N2Button.CLASS_IDENTIFIER;
    }
}
```

### The `createEjObj()` method

This is the only method you **must** implement.  Instantiate the Syncfusion
component by passing `this.state.ej` (the Syncfusion model) to its constructor
and assign the result to `this.obj`.

The base class `N2Ej.onLogic` then:
1. Tags the EJ2 instance with a back-reference to the N2 widget: `obj[N2_CLASS] = this`
2. Calls `appendEjToHtmlElement()` which calls `obj.appendTo(this.htmlElementAnchor)`
3. Fires any `state.onEjObj` listeners

### Customising HTML generation

- Override `onHtml(args: N2Evt_OnHtml): HTMLElement` to return a custom DOM
  tree.  The default (`N2EjBasic` / `N2Basic`) uses `createN2HtmlBasic`.
- Set `state.deco.tag`, `state.deco.classes`, `state.deco.style` for simple
  changes without overriding `onHtml`.
- Set `state.wrapper` to add a wrapper element.
- Put child widgets in `state.children` — they are automatically appended.

### Customising append behaviour

- Set `state.skipAppendEjToHtmlElement = true` to prevent the automatic
  `appendTo` call.  Call `this.appendEjToHtmlElement()` manually later.
- Override `appendEjToHtmlElement()` for custom append logic.

---

## 7. How to Create a Standalone (Non-EJ2) Widget

Standalone widgets extend `N2Basic` (or `N2` directly).  They do NOT have
`state.ej` or `createEjObj()`.

### Example — N2Row (gui2/generic/N2Row.ts)

```typescript
export class N2Row<STATE extends StateN2Row = any> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Row';

    constructor(state: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, CSS_FLEX_ROW_DIRECTION, N2Row.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }
}
```

This widget merely adds flex-row CSS classes to the decorator — the default
`onHtml` from `N2Basic` generates the `<div>`.  No `onLogic` override needed.

### Example — N2Html (gui2/generic/N2Html.ts)

A widget that renders a string or HTMLElement.  Overrides `onHtml` to produce
the right DOM and wires click handlers.

### Example — N2PanelGrid (gui2/ej2/derived/N2PanelGrid.ts)

A composite widget that combines `N2PanelLayout` (flex layout) with an `N2Grid`
in the center panel.  This extends `N2PanelLayout` (which extends `N2Basic`)
and is therefore **not** an EJ2 widget itself, but **contains** an EJ2 widget as
a child.  This pattern is common for composite layouts.

---

## 8. Events and Callbacks

### Event interfaces

All events extend `N2Evt<WIDGET>` which provides `widget: WIDGET`:

```typescript
N2Evt_OnHtml<W>        // { widget: W }
N2Evt_OnLogic<W>       // { widget: W }
N2Evt_BeforeLogic<W>   // { widget: W, cancel: boolean }
N2Evt_AfterLogic<W>    // { widget: W }
N2Evt_Destroy<W>       // { widget: W, extras?: any, ref?: N2Evt_Ref }
N2Evt_Resized          // { widget, size, lastSize, lastSizeEmpty, height_diff, width_diff }
N2Evt_DomAdded<W>      // { widget: W, element: HTMLElement }
N2Evt_DomRemoved<W>    // { widget: W, element: HTMLElement }
N2Evt_onEjObj<W>       // { widget: W } — fired after EJ2 creation
```

### Dialog-specific events (for content placed inside N2Dialog)

Any N2 widget (or plain object) implementing these interfaces will have them
called by `N2Dialog`:

```typescript
interface N2Interface_Dialog_Open {
    onDialogOpen(evt?: N2Evt_Dialog): void;
}
interface N2Interface_Dialog_Close {
    onDialogClose(evt?: N2Evt_Dialog): void;
}
interface N2Interface_Dialog_BeforeOpen {
    onDialogBeforeOpen(evt?: N2Evt_Dialog_Cancellable): void;
}
interface N2Interface_Dialog_BeforeClose {
    onDialogBeforeClose(evt?: N2Evt_Dialog_Cancellable): void;
}
```

### Theme change listeners

```typescript
import {themeChangeListeners, ThemeChangeEvent} from './Theming';
themeChangeListeners().add((ev: ThemeChangeEvent) => {
    // ev.newState.theme_type === 'dark' | 'light'
    cssAdd(`… your css …`, 'MyComponentCSS');
});
```

---

## 9. Key Properties Reference

### On every N2 widget

| Property | Type | Description |
|---|---|---|
| `state` | `STATE extends StateN2` | The configuration object; the single source of truth. |
| `obj` | `JS_COMPONENT` | The underlying JS component instance. For EJ2 widgets, this is the Syncfusion Component. |
| `isN2` | `boolean` (readonly `true`) | Used to test if an object is an N2 instance. |
| `className` | `string` | The constructor name (e.g. `'N2Button'`). |
| `classIdentifier` | `string` | The `CLASS_IDENTIFIER` static (e.g. `'N2Button'`). Used as a CSS class and DOM marker. |
| `initialized` | `boolean` | `true` after `initLogic()` completes. |
| `parent` | `N2` | Parent widget, if any. |
| `htmlElement` | `HTMLElement` | The outermost DOM element. Lazily triggers HTML generation. |
| `htmlElementAnchor` | `HTMLElement` | The element the JS component is actually attached to (inside wrapper if present). |
| `resizeAllowed` | `boolean` | Enables/disables resize event firing. |
| `resizeEventMinInterval` | `number` | Debounce interval for resize events (default 400ms). |

### On N2Ej widgets additionally

| Property | Type | Description |
|---|---|---|
| `state.ej` | `WIDGET_LIBRARY_MODEL` | The Syncfusion model object. |
| `isAppendToCalled()` | `boolean` | Whether `appendTo` has been called on the EJ2 component. |

### Static helpers

```typescript
N2.instances(model)    // → N2[] — all N2 instances tagged on an object
N2.instance(model)     // → N2 | null — first N2 instance or null

N2Ej.ejInstances(ejModel)  // → EJ2COMPONENT[] — all EJ2 instances from a model
N2Ej.ejInstance(ejModel)   // → EJ2COMPONENT | null — first EJ2 instance or null
```

---

## 10. Bi-directional Tagging Between State Models and Instances

The library maintains two-way references so you can navigate from model→instance
and instance→model:

```
state.ej  ──→  Syncfusion Component
   ↑                            │
   │ .ejInstances[]             │ [N2_CLASS] = this
   │                            ↓
state.ref.widget  ←──  N2 widget  ──→  state.ej[N2_CLASS][] (array of N2)
                      │
                      └── state.ref.htmlElement
```

- **`state.ref.widget`** — points from the state to the N2 widget that owns it.
- **`state.ej[N2_CLASS]`** — an array of N2 instances that reference this EJ model.
- **`state.ej[EJINSTANCES]`** (`'ejInstances'`) — an array of all EJ2 component
  instances created from this model.
- **`htmlElement[N2_CLASS]`** — the N2 widget attached to a DOM element.
- **`obj[N2_CLASS]`** — the N2 widget attached to an EJ2 component instance.

---

## 11. Error Handling

Each N2 widget has two error handlers:

- **`handleUIError(err)`** — For user-visible errors. Delegates to
  `state.widgetErrorHandler` if set, then bubbles up to `parent.handleUIError()`,
  and finally falls back to `getErrorHandler().displayExceptionToUser(err)`.

- **`handleError(err)`** — For non-UI errors. Logs to `console.error` and (in
  dev mode) displays to the user.

---

## 12. Directory Structure

```
core/
├── gui2/                          ← Current widget library (USE THIS)
│   ├── N2.ts                      ← Root abstract class
│   ├── N2Basic.ts                 ← Base for non-EJ2 widgets
│   ├── StateN2.ts                 ← Base state interface
│   ├── N2HtmlDecorator.ts         ← HTML generation from decorators
│   ├── N2Utils.ts                 ← DOM utilities, isN2(), createN2HtmlBasic()
│   ├── N2Auth.ts                  ← Auth hooks (overridden by apps)
│   ├── N2Formatters.ts            ← Date/number/currency formatters for grids
│   ├── Theming.ts                 ← Theme change event system
│   ├── generic/                   ← Standalone (non-EJ2) widgets
│   │   ├── N2Row.ts, N2Html.ts, N2Panel.ts, N2PanelLayout.ts, …
│   │   └── N2Interface_Dialog.ts  ← Dialog lifecycle interfaces
│   ├── ej2/                       ← EJ2-related base classes and utils
│   │   ├── N2Ej.ts                ← Abstract EJ2 wrapper
│   │   ├── N2EjBasic.ts           ← EJ2 + default HTML generation
│   │   ├── Ej2Utils.ts            ← EJ2 instance lookup helpers
│   │   ├── StateN2Validator.ts    ← Validation interface
│   │   ├── ext/                   ← EJ2 component wrappers
│   │   │   ├── N2Button.ts, N2Grid.ts, N2Dialog.ts, N2TextField.ts, …
│   │   │   └── util/              ← Helper utilities used by ext widgets
│   │   └── derived/               ← Composite widgets containing EJ2 components
│   │       ├── N2PanelGrid.ts     ← Flex panel + Grid
│   │       ├── N2DropDownMenu.ts  ← Dropdown menu
│   │       └── N2ThemeSwitcher.ts
│   ├── jsPanel/                   ← Non-EJ2 dialog/popup system
│   │   ├── N2Dlg.ts, N2Dlg_Modal.ts, N2Dlg_Confirm.ts, N2Popup.ts
│   │   └── OnAsyncDlgShow.ts
│   └── scss/                      ← CSS variable definitions
│       ├── vars-material.ts, vars-ej2-common.ts, core.ts, tippy.ts
├── gui/                           ← DEPRECATED (Wx* classes)
└── … (BaseUtils, CoreUtils, CssUtils, Constants, etc.)
```

---

## 13. Usage Patterns and Recipes

### Creating a simple button

```typescript
const btn = new N2Button({
    tagId: 'my-btn',
    ej: { content: 'Click Me', cssClass: 'e-primary' },
    onclick: (ev) => { console.log('clicked'); },
});
document.body.appendChild(btn.htmlElementInitialized);
```

The `htmlElementInitialized` getter triggers the full lifecycle: HTML generation
→ Syncfusion Button instantiation → `appendTo`.  The button is ready.

### Creating a dialog with content

```typescript
const content = new N2Html({ value: 'Hello World' });
const dlg = new N2Dialog({
    header: 'My Dialog',
    content: content,
    ej: { width: '500px', height: 'auto' },
});
dlg.show();  // triggers initLogic, shows dialog
```

### Creating a grid

```typescript
const grid = new N2Grid({
    ej: {
        columns: [
            { field: 'id', headerText: 'ID', width: 80 },
            { field: 'name', headerText: 'Name', width: 200 },
        ],
        // … dataSource, etc.
    },
});
```

### Adding children to a widget

```typescript
const panel = new N2Panel({ children: [widget1, widget2] });
// or dynamically:
panel.addN2Child(widget3);
```

### Finding N2 widgets from DOM elements

```typescript
import { getN2FromHtmlElement, findN2ChildrenFirstLevel } from './gui2/N2Utils';

const n2 = getN2FromHtmlElement(someElement);     // single
const children = findN2ChildrenFirstLevel(parent); // all children
```

### Finding EJ2 instances from models

```typescript
import { getFirstEj2FromModel } from './gui2/ej2/Ej2Utils';

const grid = getFirstEj2FromModel(someState.ej);  // the Syncfusion Grid instance
```

### Validation

```typescript
const state: StateN2TextField = {
    ej: { placeholder: 'Enter name' },
    validationRule: (ev) => {
        if (!ev.value || ev.value.length < 3) {
            ev.error = 'Must be at least 3 characters';
        }
    },
};
const field = new N2TextField(state);
```

---

## 14. Helper Type: `Elem_or_N2`

Used throughout the library to accept either a raw HTMLElement or an N2 widget:

```typescript
type Elem_or_N2<STATE extends StateN2 = any> = HTMLElement | N2<STATE>;
```

This is the type of `state.children`, `state.siblings`, and arguments to
`addN2Child()` / `removeN2Child()`.

---

## 15. Quick Reference: Creating a New EJ2 Widget Wrapper

1. Create `gui2/ej2/ext/N2YourWidget.ts`
2. Define `StateN2YourWidgetRef extends StateN2EjBasicRef { widget?: N2YourWidget }`
3. Define `StateN2YourWidget extends StateN2EjBasic<SyncfusionModel> { ref?, … }`
4. Create class `N2YourWidget extends N2EjBasic<StateN2YourWidget, SyncfusionComponent>`
5. Set `static readonly CLASS_IDENTIFIER = 'N2YourWidget'`
6. Override `onStateInitialized`: call `addN2Class(state.deco, CLASS_IDENTIFIER)`, set any HTML defaults on `state.deco`, then `super.onStateInitialized(state)`
7. Override `createEjObj()`: `this.obj = new SyncfusionComponent(this.state.ej)`
8. If custom HTML is needed, override `onHtml(args)`
9. If custom logic pre/post EJ2 creation is needed, override `onLogic(args)` (call `super.onLogic(args)` at the appropriate point)
10. If custom cleanup is needed, override `onDestroy(args)` (call `super.onDestroy(args)`)

---

## 16. Quick Reference: Creating a New Standalone Widget

1. Create `gui2/generic/N2YourThing.ts` (or appropriate location)
2. Define `StateN2YourThingRef extends StateN2BasicRef { widget?: N2YourThing }`
3. Define `StateN2YourThing extends StateN2Basic { ref?, … }`
4. Create class `N2YourThing extends N2Basic<StateN2YourThing>`
5. Set `static readonly CLASS_IDENTIFIER = 'N2YourThing'`
6. Override `onStateInitialized`: add CSS classes, then `super.onStateInitialized(state)`
7. If custom HTML is needed, override `onHtml(args)`
8. If custom JS logic is needed, override `onLogic(args)`
9. If custom cleanup is needed, override `onDestroy(args)`

---

## 17. Environment & Dependencies

- **Syncfusion EJ2** — `@syncfusion/ej2-base`, `@syncfusion/ej2-buttons`,
  `@syncfusion/ej2-inputs`, `@syncfusion/ej2-grids`, `@syncfusion/ej2-popups`,
  `@syncfusion/ej2-dropdowns`, `@syncfusion/ej2-data`, etc.
- **lodash** — `throttle`, `debounce`, `isArray`, `isFunction`, `isString`,
  `isNumber`, `isDate`, `escape`, `cloneDeep`.
- **css-element-queries** — `ResizeSensor` for element-level resize detection.
- **dompurify** — HTML sanitisation.
- **dateformat** — Date formatting.
- **axios** — HTTP utilities (used in error handling types).
- **tippy.js** — Tooltip library (used in grid cell tooltips).

---

*Generated for AI-assisted development. Focus on `gui2/`; ignore `gui/` (deprecated).*
