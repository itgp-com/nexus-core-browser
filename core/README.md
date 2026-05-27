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
NOT `N2Ej`) that provide layout primitives (Row, Panel, PanelLayout), HTML rendering
(N2Html), dialogs (N2Dlg/jsPanel), and other non-Syncfusion UI building blocks.
These share the same state/lifecycle pattern.

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
│   ├── N2Panel_LCR                         (gui2/generic/N2Panel_LCR.ts)
│   │   └── N2PanelGrid                     (gui2/ej2/derived/N2PanelGrid.ts)
│   ├── N2EditForm                          (gui2/generic/N2EditForm.ts)
│   ├── N2Column, N2Divider, N2TextSwitch   (gui2/generic/)
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
        ├── N2ThemeSwitcher                 (gui2/ej2/derived/N2ThemeSwitcher.ts)
        └── … (~80+ EJ2 wrappers in gui2/ej2/ext/)
```

### Key distinction

| Base class | Purpose |
|---|---|
| `N2` | Root abstract class. Owns state, HTML-element lifecycle, resize sensing, error routing, child management. **Every widget is an N2.** |
| `N2Basic` | Non-EJ2 widgets. Provides default `onHtml` (generates DOM from `N2HtmlDecorator`), a no-op `onLogic`, and child-destroy in `onDestroy`. |
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
| `validationRule` | `N2Validator<N2, any>` | Optional validator function. |
| `container` | `Elem_or_N2` | Optional outer container element (app-defined, not library-managed). |
| `user_settings_key` | `string` | Optional key for persisting user settings (app-defined). |

### EJ2 state fields (`StateN2Ej` — gui2/ej2/N2Ej.ts)

| Field | Type | Purpose |
|---|---|---|
| `ej` | `WIDGET_LIBRARY_MODEL` | **The Syncfusion model** (e.g. `GridModel`, `ButtonModel`, `DialogModel`). This is passed directly to the Syncfusion component constructor. |
| `skipAppendEjToHtmlElement` | `boolean` | If true, the automatic `appendTo` call is skipped; developer must call it manually. |
| `onEjObj` | `function \| function[]` | Callback(s) fired at the end of `onLogic` after the EJ2 object is created and appended. |
| `addOnEjObjListener` | `(fn) => void` | Helper to register additional `onEjObj` listeners at runtime. Auto-initialised by `_constructor`. |

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
       └─ _constructor(state)           ← initialise state defaults (deco, ej, ref),
                                           generate tagId,
                                           stamp state.ref.widget = this
       └─ _triggerOnStateInitialized()  ← fires once, lazily (may be
                                           deferred until htmlElement getter
                                           or initLogic is called)
            └─ onStateInitialized(state) ← add CSS class identifiers (addN2Class),
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
         └─ [N2Ej] tag obj with N2 ref   ← obj[N2_CLASS] = this
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
| `htmlElementInitialized` | Like `htmlElement` but also triggers `initLogic` if needed. **Use this when passing an N2 widget to an EJ2 container** (e.g. Tab content). |
| `htmlElementAnchor` | The **inner** HTML element — where the EJ2 component is actually appended. If there is a wrapper with a tagId, this is the inner element matching that tagId. |
| `htmlElementAnchorInitialized` | Like `htmlElementAnchor` but triggers `initLogic` if needed. |
| `initialized` | `true` once `initLogic` has completed. |
| `parent` | Reference to the parent `N2` widget (set when added as a child). |

### htmlElement vs htmlElementAnchor visualisation

When a widget has no wrapper:
```
htmlElement == htmlElementAnchor == <div id="tagId" class="N2Button e-btn">Click</div>
```

When a widget has a wrapper (e.g. N2TextField always has one):
```
htmlElement → <div id="tagId_wrapper" class="e-input-group N2TextField">
                <input id="tagId" class="e-input" type="text">  ← htmlElementAnchor
                <span class="e-float-line"></span>
                <label class="e-float-text">…</label>
              </div>
```

---

## 5. DOM Added / Removed Events (`onDOMAdded`, `onDOMRemoved`)

These events fire automatically when the widget's HTML element is **inserted into**
or **removed from** the live DOM. They are powered by `ObserverManager` which uses
`MutationObserver` under the hood to watch for the element with `state.tagId`.

### How registration works

During `initHtml()`, two private methods run:

- **`_registerOnDOMAdded()`** — checks if `state.onDOMAdded` is set OR if the class
  has overridden `onDOMAdded()`. If so, calls `ObserverManager.addOnAdded()` to
  watch for the element appearing in the DOM.
- **`_registerOnDOMRemoved()`** — same logic for `onDOMRemoved`.

The default no-op implementations on `N2.prototype` are **not** registered — the
observer is only created when there's actual work to do.

### Event payload

```typescript
interface N2Evt_DomAdded<W extends N2 = N2> {
    widget: W;           // the N2 widget instance
    element: HTMLElement; // the HTMLElement that was added
}

interface N2Evt_DomRemoved<W extends N2 = N2> {
    widget: W;
    element: HTMLElement; // the HTMLElement that was removed
}
```

Both are called with `this` bound to the N2 widget. Both support `async`/`Promise<void>`.

### Pattern: Post-attach setup (class override)

The most common pattern — do work that requires the element to be in the document.
Used by `N2Grid` to create its dropdown menu after the grid DOM is live:

```typescript
// Inside N2Grid (gui2/ej2/ext/N2Grid.ts):
public onDOMAdded(ev: N2Evt_DomAdded): void {
    if (!this.state.disableDropDownMenu) {
        if (this.obj) {
            this.createDropDownMenu();  // needs live DOM for positioning
        }
    }
    super.onDOMAdded(ev);  // always call super
}
```

### Pattern: Post-attach setup (state callback)

Same idea, but without subclassing:

```typescript
const state: StateN2Grid = {
    ej: { columns: [...], ... },
    onDOMAdded: (ev: N2Evt_DomAdded) => {
        // widget is now in the DOM, safe to do layout-sensitive work
        let grid: N2Grid = ev.widget;
        // ... setup that needs live DOM
    },
};
```

### Pattern: Trigger initLogic on DOM attach (lazy initialisation)

When you add a widget's HTML to the DOM but want to defer its `initLogic()` until
it's actually visible:

```typescript
// The chaining pattern: wrap existing onDOMAdded to add initLogic call
let previousHandler = childWidget.state.onDOMAdded;
childWidget.state.onDOMAdded = async (ev: N2Evt_DomAdded) => {
    await previousHandler?.call(childWidget, ev);  // preserve original
    childWidget.initLogic();                         // your added step
};
container.htmlElement.appendChild(childWidget.htmlElement);
// → when the child appears in DOM, initLogic fires automatically
```

This pattern is used extensively in `N2CtxMenu` to lazily initialise icon/label
widgets only when their menu items are rendered.

### Pattern: Widget initialisation on DOM attach (state callback direct)

Used in real apps (Search_Base, App_Main_Scribe) to couple DOM insertion with
logic initialisation:

```typescript
const grid = new N2Grid({
    ej: { columns: [...], ... },
    onDOMAdded: (ev: N2Evt_DomAdded) => {
        // Grid element is now in the document
        // Safe to call methods that need the DOM
    },
});
```

### Pattern: Cleanup on DOM removal

```typescript
const leafletMap = new N2Html({
    value: '<div id="map-container"></div>',
    onDOMAdded: async (ev) => {
        // Initialise leaflet map once the container is in the DOM
        L.map(ev.element.querySelector('#map-container'));
    },
    onDOMRemoved: async (ev) => {
        // Tear down when removed
        // e.g. disconnect observers, stop timers, release resources
    },
});
```

### Pattern: Override onDOMAdded in a derived widget class

```typescript
export class MyCustomWidget extends N2Panel {
    public onDOMAdded(ev: N2Evt_DomAdded): void {
        // Your pre-processing
        super.onDOMAdded(ev);  // always call super to preserve chain
        // Your post-processing (element is in DOM)
    }
}
```

### Key points

- **Always call `super.onDOMAdded(ev)` / `super.onDOMRemoved(ev)`** when
  overriding in a class, unless you explicitly want to break the chain.
- **State callbacks take precedence** — if `state.onDOMAdded` is set, the
  class method is NOT called (same override rule as all lifecycle hooks).
- **`autoRemove: true`** is passed to ObserverManager by default, so the
  observer fires once then unregisters. If the element is removed and
  re-added, it will NOT fire again unless re-registered.
- **Both support async** — the caller via ObserverManager awaits the callback.

---

## 6. N2HtmlDecorator — How HTML Is Generated

The `N2HtmlDecorator` interface (gui2/N2HtmlDecorator.ts) describes the HTML
attributes of a DOM element declaratively. Instead of writing HTML strings or
DOM API calls, you configure the decorator and the library builds the element.

```typescript
interface N2HtmlDecorator {
    tag?: string;                    // default 'div'
    classes?: string | string[];     // CSS classes
    style?: CssStyle | string;       // inline CSS (camelCase or kebab-case string)
    otherAttr?: IKeyValueString;     // any other HTML attributes (id, type, name, data-*, etc.)
    text?: string;                   // inner text
    escapeText?: boolean;            // whether to HTML-escape text (default false)
    state?: StateN2;                 // back-reference to the owning state (set automatically)
}
```

### Default values (applied by `IHtmlUtils.init()`)

- `tag` defaults to `'div'`
- `classes` defaults to `[]`
- `style` defaults to `{}`
- `otherAttr` defaults to `{}`

### DOM tree produced by `createN2HtmlBasic(state)`

```
<wrapper id="tagId_wrapper">            ← state.wrapper (if present)
  <prefixSibling/>…                     ← state.prefixSiblings
  <anchor id="tagId" class="…" style="…" otherAttrs…>  ← state.deco
    <child/>…                           ← state.children
  </anchor>
  <sibling/>…                           ← state.siblings
</wrapper>
```

### Key helper: `addN2Class(deco, ...classNames)`

Adds CSS classes to a decorator's `classes` array AND synchronises them to the
live HTML element if the widget is already initialised. **Always use this instead
of manually pushing to `deco.classes`.**

```typescript
import { addN2Class } from './N2HtmlDecorator';
addN2Class(state.deco, 'my-custom-class', 'another-class');
```

### Key helper: `removeN2Class(deco, ...classNames)`

Removes CSS classes from both the decorator and the live element.

```typescript
import { removeN2Class } from './N2HtmlDecorator';
removeN2Class(state.deco, 'my-custom-class');
```

---

## 7. How to Create an EJ2 (Syncfusion) Widget

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
            this.state.ej.content = stringArgVal(this.state.label);
        super.onLogic(ev);  // ← this calls createEjObj() then appendEjToHtmlElement()
        // … attach click handlers after EJ2 is alive
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
1. Tags the EJ2 instance: `this.obj[N2_CLASS] = this`
2. Calls `appendEjToHtmlElement()` which calls `this.obj.appendTo(this.htmlElementAnchor)`
3. Fires any `state.onEjObj` listeners

### Customising HTML generation

- **Override `onHtml(args: N2Evt_OnHtml): HTMLElement`** to return a custom DOM
  tree.  The default (`N2EjBasic` / `N2Basic`) uses `createN2HtmlBasic`.
- **Set `state.deco.tag`**, `state.deco.classes`, `state.deco.style`,
  `state.deco.otherAttr` for simple changes without overriding `onHtml`.
- **Set `state.wrapper`** to add a wrapper element.
- **Put child widgets in `state.children`** — they are automatically appended
  into the anchor element during `onHtml`.
- **Put sibling elements in `state.siblings` / `state.prefixSiblings`** —
  they are placed after/before the anchor inside the wrapper.

### Customising append behaviour

- Set `state.skipAppendEjToHtmlElement = true` to prevent the automatic
  `appendTo` call.  Call `this.appendEjToHtmlElement()` manually later.
  Used when the EJ2 component needs custom append logic or the target element
  isn't ready yet at standard `onLogic` time.
- Override `appendEjToHtmlElement()` for custom append logic.

---

## 8. How to Create a Standalone (Non-EJ2) Widget

Standalone widgets extend `N2Basic` (or `N2` directly).  They do NOT have
`state.ej` or `createEjObj()`.

### Example — N2Row (gui2/generic/N2Row.ts)

A minimal widget that just adds flex-row CSS classes:

```typescript
export class N2Row<STATE extends StateN2Row = any> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Row';

    constructor(state: STATE) { super(state); }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, CSS_FLEX_ROW_DIRECTION, N2Row.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }
}
```

The default `onHtml` from `N2Basic` generates a `<div>` from the decorator.
No `onLogic` override needed — there's no JS component.

### Example — N2Html (gui2/generic/N2Html.ts)

Renders a string or HTMLElement. Accepts `value` (string, HTMLElement, or
function returning either) and optional `onClick` handler. Overrides `onHtml`
to handle all three value types.

### Example — N2PanelGrid (gui2/ej2/derived/N2PanelGrid.ts)

A composite widget that combines `N2PanelLayout` (flex layout) with an `N2Grid`
in the center panel.  This extends `N2PanelLayout` (which extends `N2Basic`)
and is therefore **not** an EJ2 widget itself, but **contains** an EJ2 widget as
a child.  This is the standard pattern for composite layouts.

---

## 9. Events and Callbacks

### Core event interfaces

All events extend `N2Evt<WIDGET>` which provides `widget: WIDGET`:

```typescript
N2Evt_OnHtml<W>        // { widget: W }
N2Evt_OnLogic<W>       // { widget: W }
N2Evt_BeforeLogic<W>   // { widget: W, cancel: boolean }  ← set cancel=true to abort
N2Evt_AfterLogic<W>    // { widget: W }
N2Evt_Destroy<W>       // { widget: W, extras?: any, ref?: N2Evt_Ref }
N2Evt_Resized          // { widget, size, lastSize, lastSizeEmpty, height_diff, width_diff }
N2Evt_DomAdded<W>      // { widget: W, element: HTMLElement }
N2Evt_DomRemoved<W>    // { widget: W, element: HTMLElement }
N2Evt_onEjObj<W>       // { widget: W } — fired after EJ2 creation
```

### Dialog lifecycle events (for content inside N2Dialog)

Any N2 widget (or plain object) implementing these interfaces will have them
called by `N2Dialog` during open/close:

```typescript
// Put these on your content widget's state or class:
interface N2Interface_Dialog_Open {
    onDialogOpen(evt?: N2Evt_Dialog): void;
}
interface N2Interface_Dialog_Close {
    onDialogClose(evt?: N2Evt_Dialog): void;
}
interface N2Interface_Dialog_BeforeOpen {
    onDialogBeforeOpen(evt?: N2Evt_Dialog_Cancellable): void;  // evt.cancel = true to prevent open
}
interface N2Interface_Dialog_BeforeClose {
    onDialogBeforeClose(evt?: N2Evt_Dialog_Cancellable): void; // evt.cancel = true to prevent close
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

## 10. Key Properties Reference

### On every N2 widget

| Property | Type | Description |
|---|---|---|
| `state` | `STATE extends StateN2` | The configuration object; the single source of truth. |
| `obj` | `JS_COMPONENT` | The underlying JS component instance. For EJ2 widgets, this is the Syncfusion Component. For N2Basic widgets, typically undefined unless manually set. |
| `isN2` | `boolean` (readonly `true`) | Used to test if an object is an N2 instance. See `isN2()` utility. |
| `className` | `string` | The constructor name (e.g. `'N2Button'`). |
| `classIdentifier` | `string` | Returns the `CLASS_IDENTIFIER` static. Used as a CSS class and DOM marker. |
| `initialized` | `boolean` | `true` after `initLogic()` completes. |
| `parent` | `N2` | Parent widget, if any. |
| `htmlElement` | `HTMLElement` | The outermost DOM element. Lazily triggers HTML generation + onStateInitialized. |
| `htmlElementInitialized` | `HTMLElement` | Same as `htmlElement` but also triggers `initLogic()`. **Preferred when passing to EJ2 containers.** |
| `htmlElementAnchor` | `HTMLElement` | The element the JS component is actually attached to (inside wrapper if present). Use for layout calculations or direct DOM queries. |
| `htmlElementAnchorInitialized` | `HTMLElement` | Same as `htmlElementAnchor` but also triggers `initLogic()`. |
| `resizeAllowed` | `boolean` | Enables/disables resize event firing. Default `true`. |
| `resizeEventMinInterval` | `number` | Debounce interval for resize events (default 400ms). |

### On N2Ej widgets additionally

| Property | Type | Description |
|---|---|---|
| `state.ej` | `WIDGET_LIBRARY_MODEL` | The Syncfusion model object. Modify before `initLogic()` to affect the created component. After creation, use `this.obj` directly. |
| `isAppendToCalled()` | `boolean` | Whether `appendTo` has been called on the EJ2 component. |

### Static helpers

```typescript
import { N2_CLASS } from './Constants';  // constant = '_n2_'

N2.instances(model)          // → N2[] — all N2 instances tagged on an object
N2.instance(model)           // → N2 | null — first N2 instance or null

N2Ej.ejInstances(ejModel)   // → EJ2COMPONENT[] — all EJ2 instances from a model
N2Ej.ejInstance(ejModel)    // → EJ2COMPONENT | null — first EJ2 instance or null
```

**ALWAYS use the `N2_CLASS` constant in code**, never the raw string `'_n2_'`:

```typescript
import { N2_CLASS } from 'nexus-core-browser/core/Constants';

// ✅ CORRECT — use the constant
let n2Grid: N2Grid = (gridModel as any)[N2_CLASS][0] as N2Grid;
let n2Widget = (someElement as any)[N2_CLASS];

// ❌ WRONG — never use raw string
let n2Grid = (gridModel as any)['_n2_'][0];
```

---

## 11. Bi-directional Tagging — Navigating Model ↔ Instance

The library maintains two-way references so you can navigate between the state
model, the EJ2 component, the N2 widget, and the DOM element:

```
state.ej  ──→  Syncfusion Component  ←── getFirstEj2FromModel(state.ej)
   ↑                │                       getEj2FromModel(state.ej)
   │ .ejInstances[] │ [N2_CLASS] = this
   │                ↓
state.ref.widget  ←──  N2 widget  ──→  state.ej[N2_CLASS][] (array of N2)
                      │
                      ├── state.ref.htmlElement
                      │
                      └── htmlElement[N2_CLASS]  (getN2FromHtmlElement)

Additional lookup paths:
  htmlElement['ej2_instances']  → EJ2 component array (isEj2HtmlElement, getFirstEj2FromHtmlElement)
  ej2Instance[N2_CLASS]         → N2 widget (getN2FromEJ2)
  state.ej[N2_CLASS]            → N2 widget array (N2.instances)
  state.ej['ejInstances']       → EJ2 component array (N2Ej.ejInstances)
```

### Real-world navigation patterns (from production code)

```typescript
import { N2_CLASS } from 'nexus-core-browser/core/Constants';
import { getFirstEj2FromModel, getN2FromEJ2, getFirstN2FromModel } from 'nexus-core-browser/core/gui2/ej2/Ej2Utils';
import { getN2FromHtmlElement } from 'nexus-core-browser/core/gui2/N2Utils';

// Pattern A: From EJ model → N2 widget (used in grid models to access N2Grid from inside rowSelected etc.)
let n2Grid: N2Grid = (gridModel as any)[N2_CLASS][0] as N2Grid;

// Pattern B: From EJ model → raw Syncfusion instance (used when you need to call Syncfusion API directly)
let grid: Grid = getFirstEj2FromModel(gridModel);

// Pattern C: From Syncfusion instance → N2 widget (used in global hooks like Nexus_Overwrites)
let n2Grid: N2Grid = getN2FromEJ2(grid) as N2Grid;

// Pattern D: From DOM element → N2 widget (used in event handlers)
let n2: N2CtxMenu = getN2FromHtmlElement(menuContainer);

// Pattern E: Full chain: model → EJ2 instance → N2 widget (used in grid event callbacks)
let n2Grid: N2 = (gridModel as any).ejInstances[0][N2_CLASS];
```

### Key constants (from Constants.ts)

```typescript
import { N2_CLASS, EJINSTANCES } from 'nexus-core-browser/core/Constants';
// N2_CLASS = '_n2_'          ← marker for N2↔DOM/EJ2 back-references
// EJINSTANCES = 'ejInstances' ← marker for EJ model→EJ2 component back-references
```

---

## 12. Error Handling

Each N2 widget has two error handlers:

- **`handleUIError(err)`** — For user-visible errors. Delegates to
  `state.widgetErrorHandler` if set, then bubbles up to `parent.handleUIError()`,
  and finally falls back to `getErrorHandler().displayExceptionToUser(err)`.

- **`handleError(err)`** — For non-UI errors. Logs to `console.error` and (in
  dev mode) displays to the user.

---

## 13. Theming

The library supports light/dark theme switching via `gui2/Theming.ts`:

```typescript
import { switchTheme, themeChangeListeners, ThemeChangeEvent, ChartTheme } from './Theming';

// Switch to dark theme
switchTheme('dark');

// Switch to light theme
switchTheme('light');

// Listen for theme changes (used by widgets to inject dynamic CSS)
themeChangeListeners().add((ev: ThemeChangeEvent) => {
    // ev.newState.theme_type === 'dark' | 'light'
    // ev.newState.chartTheme  — the corresponding ChartTheme
});
```

CSS variables are defined in `gui2/scss/vars-material.ts` (app-level theme vars)
and `gui2/scss/vars-ej2-common.ts` (EJ2-specific vars). Use `cssAdd()` and
`cssRemove()` from CssUtils to inject/remove dynamic stylesheets.

---

## 14. Directory Structure

```
core/
├── Constants.ts                    ← N2_CLASS, EJINSTANCES, CSS class constants
├── BaseUtils.ts                    ← htmlToElement, getRandomString, IKeyValueString, etc.
├── CoreUtils.ts                    ← isDev, fontColor, findElementWithTippyTooltip, etc.
├── CssUtils.ts                     ← cssAdd, cssRemove, cssStyleToString, CssStyle
├── gui2/                           ← CURRENT widget library (USE THIS)
│   ├── N2.ts                       ← Root abstract class + all event interfaces
│   ├── N2Basic.ts                  ← Base for non-EJ2 widgets
│   ├── StateN2.ts                  ← Base state interface (StateN2, StateN2Ref)
│   ├── N2HtmlDecorator.ts          ← Declarative HTML: IHtmlUtils, addN2Class, removeN2Class
│   ├── N2Utils.ts                  ← isN2(), createN2HtmlBasic(), addN2Child(), removeN2Child(),
│   │                                  findN2ChildrenFirstLevel(), getN2FromHtmlElement(),
│   │                                  findParentN2Dialog(), Elem_or_N2, etc.
│   ├── N2Auth.ts                   ← N2Auth, N2GridAuth (overridden by apps)
│   ├── N2Formatters.ts             ← Date/number/currency/percentage formatters for EJ2 grids
│   ├── Theming.ts                  ← switchTheme, themeChangeListeners, ThemeChangeEvent
│   ├── generic/                    ← Standalone (non-EJ2) widgets
│   │   ├── N2Row.ts                ← Flex row container
│   │   ├── N2Html.ts               ← Renders string|HTMLElement|function
│   │   ├── N2Panel.ts              ← Basic panel container
│   │   ├── N2PanelLayout.ts        ← Flex column layout (top/center/bottom)
│   │   ├── N2Panel_LCR.ts          ← Left-Center-Right layout
│   │   ├── N2Column.ts             ← Flex column
│   │   ├── N2Divider.ts            ← Visual divider
│   │   ├── N2TextSwitch.ts         ← Text toggle switch
│   │   ├── N2EditForm.ts           ← Form layout
│   │   ├── N2Interface_Dialog.ts   ← Dialog lifecycle interfaces
│   │   └── StateN2PropertyName.ts  ← Mixin: adds 'name' field to state
│   ├── ej2/                        ← EJ2-related base classes and utils
│   │   ├── N2Ej.ts                 ← Abstract EJ2 wrapper (onLogic, createEjObj, tagging)
│   │   ├── N2EjBasic.ts            ← EJ2 + default HTML generation
│   │   ├── Ej2Utils.ts             ← EJ2 instance lookup: getFirstEj2FromModel, getN2FromEJ2,
│   │   │                              getN2FromModel, addN2Child, addN2BeforeAnchor, etc.
│   │   ├── StateN2Validator.ts     ← N2Validator type + N2ValidatorEvent interface
│   │   ├── ext/                    ← ~80+ EJ2 component wrappers
│   │   │   ├── N2Button.ts         ← Wraps Syncfusion Button
│   │   │   ├── N2TextField.ts      ← Wraps Syncfusion TextBox (with floating label, error line)
│   │   │   ├── N2Grid.ts           ← Wraps Syncfusion Grid (with Excel filtering, column menus, etc.)
│   │   │   ├── N2Dialog.ts         ← Wraps Syncfusion Dialog
│   │   │   ├── N2ComboBox.ts       ← Wraps Syncfusion ComboBox
│   │   │   ├── N2CheckBox.ts       ← Wraps Syncfusion CheckBox
│   │   │   ├── N2Calendar.ts       ← Wraps Syncfusion Calendar
│   │   │   ├── N2DatePicker.ts     ← Wraps Syncfusion DatePicker
│   │   │   ├── N2Tab.ts            ← Wraps Syncfusion Tab
│   │   │   ├── N2TreeView.ts       ← Wraps Syncfusion TreeView
│   │   │   ├── N2Toolbar.ts        ← Wraps Syncfusion Toolbar
│   │   │   ├── N2Splitter.ts       ← Wraps Syncfusion Splitter
│   │   │   ├── N2Chart.ts          ← Wraps Syncfusion Chart
│   │   │   └── … (Accordion, AutoComplete, Badge, Barcode, Breadcrumb, Card,
│   │   │         Carousel, ChipList, ColorPicker, ContextMenu, DashboardLayout,
│   │   │         Diagram, DocumentEditor, DropDownButton, DropDownList, DropDownTree,
│   │   │         Fab, FileManager, Form, Gantt, HeatMap, InPlaceEditor, Kanban,
│   │   │         LinearGauge, ListBox, ListView, Maps, MaskedTextBox, Mention,
│   │   │         Menu, Message, MultiColumnComboBox, MultiSelect, NumericTextBox,
│   │   │         OtpInput, Pager, PdfViewer, PivotView, ProgressBar, ProgressButton,
│   │   │         QRCode, QueryBuilder, RadioButton, RangeNavigator, Rating, Ribbon,
│   │   │         RichTextEditor, Schedule, Sidebar, Signature, Skeleton, Slider,
│   │   │         Smithchart, Sparkline, SpeedDial, SplitButton, Spreadsheet, Stepper,
│   │   │         StockChart, Switch, TextArea, Timeline, TimePicker, Toast, Tooltip,
│   │   │         TreeGrid, TreeMap, Uploader, CircularGauge, CircularChart3D,
│   │   │         Chart3D, DateRangePicker, AccumulationChart, BulletChart, DataMatrix,
│   │   │         AppBar, ButtonGroup)
│   │   │   └── util/               ← Shared helpers for ext widgets
│   │   │       ├── N2Grid_Options.ts       ← Excel filter logic for N2Grid
│   │   │       ├── N2Grid_DropDownMenu.ts  ← Dropdown menu items for N2Grid
│   │   │       ├── N2Wrapper_dataSource.ts ← NexusDataManager linking
│   │   │       ├── N2InputPlaceholder.ts   ← Placeholder utility
│   │   │       ├── N2DialogBackArrow.ts    ← Dialog header back arrow
│   │   │       └── N2DialogCloseIcon.ts    ← Dialog header close icon
│   │   └── derived/               ← Composite widgets containing EJ2 components
│   │       ├── N2PanelGrid.ts     ← Flex panel layout with Grid auto-resize
│   │       ├── N2DropDownMenu.ts  ← Dropdown menu component
│   │       └── N2ThemeSwitcher.ts ← Light/dark theme toggle
│   ├── jsPanel/                   ← Non-EJ2 dialog/popup system (jsPanel based)
│   │   ├── N2Dlg.ts, N2Dlg_Modal.ts, N2Dlg_Confirm.ts, N2Popup.ts
│   │   └── OnAsyncDlgShow.ts
│   └── scss/                      ← CSS variable definitions
│       ├── vars-material.ts       ← Material theme variables
│       ├── vars-ej2-common.ts     ← EJ2-specific CSS variables
│       ├── core.ts                ← Core flex layout CSS classes
│       └── tippy.ts               ← Tippy.js tooltip variables
├── gui/                           ← DEPRECATED (Wx* classes)
└── … (other core utilities)
```

---

## 15. Usage Patterns and Recipes

### Pattern A: Simple button with click handler

```typescript
const btn = new N2Button({
    tagId: 'my-btn',
    ej: { content: 'Click Me', cssClass: 'e-primary', isPrimary: true },
    onclick: (ev) => { console.log('clicked', ev); },
});
document.body.appendChild(btn.htmlElementInitialized);
```

### Pattern B: Dialog with N2 content

```typescript
const content = new N2Panel({ children: [new N2Html({ value: 'Hello World' })] });
const dlg = new N2Dialog({
    header: 'My Dialog',
    content: content,
    ej: { width: '500px', height: 'auto' },
});
dlg.show();  // triggers initLogic, shows dialog
```

### Pattern C: TextField with floating label, error line, and validation

```typescript
const field = new N2TextField({
    tagId: 'name-input',
    ej: {
        floatLabelType: 'Auto',
        placeholder: 'Enter your name',
        value: '',
    },
    labelDecorator: { classes: ['my-label'] },
    wrapper: { classes: ['my-wrapper'] },
    errorDecorator: { classes: ['my-error'] },
    validationRule: (ev) => {
        if (!ev.value || ev.value.length < 3) {
            ev.error = 'Must be at least 3 characters';
        }
    },
    onAfterInitLogic: (args) => {
        // widget and all children are fully initialised
    },
});
```

### Pattern D: Grid with columns, dataSource, and custom event hooks

```typescript
const grid = new N2Grid({
    ej: {
        columns: [
            { field: 'id', headerText: 'ID', width: 80, isPrimaryKey: true },
            { field: 'name', headerText: 'Name', width: 200 },
            { field: 'date', headerText: 'Date', width: 120, type: 'date',
              format: n2_grid_format_date() },
        ],
        allowSorting: true,
        allowFiltering: true,
        allowExcelExport: true,
    },
    onFilterBegin: (args) => { /* pre-filter logic */ },
    onFilterEnd: (args) => { /* post-filter logic */ },
});
```

**IMPORTANT:** `state.ej` modifications made before `initLogic()` runs will take
effect on the created component.  After the component is created, use `this.obj`
directly to call Syncfusion APIs.

### Pattern E: Accessing and manipulating the underlying Syncfusion object

```typescript
// Read/write values through obj (the Syncfusion component)
txtSearch.obj.value = 'new search query';
let currentValue = txtSearch.obj.value;

// Call Syncfusion methods directly through obj
n2Grid.obj.refresh();
dialog.obj.hide();
dialog.obj.show();

// Navigate from model to EJ2 instance
let grid: Grid = getFirstEj2FromModel(gridModel);
grid.refresh();
```

### Pattern F: Dynamic child management with addN2Child

```typescript
import { addN2Child } from 'nexus-core-browser/core/gui2/N2Utils';

// Add a child to a container
addN2Child(containerPanel, newWidget);

// Or use the instance method
containerPanel.addN2Child(newWidget);

// Remove a child
containerPanel.removeN2Child(oldWidget);
```

### Pattern G: Layout composition with PanelLayout + LCR

```typescript
import { N2PanelLayout } from 'nexus-core-browser/core/gui2/generic/N2PanelLayout';
import { N2Panel_LCR } from 'nexus-core-browser/core/gui2/generic/N2Panel_LCR';

const mainLayout = new N2PanelLayout({
    top: new N2Panel_LCR({
        left: new N2Row({ children: [logo, title] }),
        right: new N2Row({ children: [themeSwitch, userMenu] }),
    }),
    center: new N2PanelGrid({ center: myGrid }),  // grid with auto-resize
    bottom: statusBar,
});
```

### Pattern H: Tab content — use htmlElementInitialized

```typescript
import { N2Tab } from 'nexus-core-browser/core/gui2/ej2/ext/N2Tab';

const tabs = new N2Tab({
    ej: {
        items: [
            { header: { text: 'Search' }, content: searchPanel.htmlElementInitialized },
            { header: { text: 'Settings' }, content: settingsPanel.htmlElementInitialized },
        ],
    },
});
```

Always use `htmlElementInitialized` (not `htmlElement`) when passing N2 widgets
as EJ2 tab content — it ensures `initLogic()` has been called.

### Pattern I: Direct DOM access through htmlElementAnchor

```typescript
// Query within the widget's anchor element
let gridHeight = n2Grid.htmlElementAnchor.querySelector('.e-gridcontent').clientHeight;

// Use anchor for layout calculations
let width = this.htmlElementAnchor.clientWidth / 2;
let height = this.htmlElementAnchor.clientHeight / 3;

// Clear and rebuild inner content
container.htmlElementAnchor.innerHTML = '';
container.addN2Child(newContent);
```

### Pattern J: Chaining state callbacks (wrapping existing handlers)

Use this pattern when you need to add logic around an existing callback without
losing the original handler. Commonly used with `onDOMAdded`, `onResized`, and
`onDestroy`.

```typescript
// Preserve user's existing callback while adding your own logic
let userOnDomAdded = state.onDOMAdded;
state.onDOMAdded = (ev: N2Evt_DomAdded) => {
    // Your pre-processing here
    if (userOnDomAdded) {
        userOnDomAdded.call(this, ev);  // call the original
    }
    // Your post-processing here (element is in DOM)
};
```

### Pattern K: Reacting to DOM insertion (onDOMAdded / onDOMRemoved)

See **Section 5** for the full reference. Quick summary:

```typescript
// Via state callback
const widget = new N2Grid({
    ej: { columns: [...] },
    onDOMAdded: (ev: N2Evt_DomAdded) => {
        // widget's element is now in the live DOM
        // Safe to do layout-sensitive work
    },
    onDOMRemoved: (ev: N2Evt_DomRemoved) => {
        // widget's element was removed from DOM
        // Clean up observers, timers, etc.
    },
});

// Via class override
class MyWidget extends N2Panel {
    onDOMAdded(ev: N2Evt_DomAdded): void {
        super.onDOMAdded(ev);  // always call super
        // custom logic after DOM insertion
    }
}
```

---

## 16. ReqMap Pattern — TypeScript-to-Spring API Calls (Codegen)

The `ReqMap_xxxx.ts` + `dm/DM_xxxx.ts` pattern is the **standard way to call
Spring controller endpoints** from TypeScript. It is auto-generated via codegen
but an AI can produce it manually following the same conventions.

### Architecture overview

```
Groovy (Spring)                              TypeScript (Browser)
─────────────────                            ─────────────────────
OpDef_notifications.groovy                   ReqMap_notifications.ts
  ├─ Op(save, DM_notifications_save)  ──→     ├─ notifications_save(data)
  ├─ Op(delete, DM_notifications_delete) →    ├─ notifications_delete(data)
  └─ Op(label, DM_notifications_label) →      └─ notifications_label(data)

DM_notifications_save.groovy                 dm/DM_notifications_save.ts
  (Groovy data class)                         (TypeScript mirror class)
```

### File locations

```
mods/<module_name>/
├── ReqMap_<module_name>.ts       ← async API functions
├── dm/                            ← data model classes (request params)
│   ├── DM_<module>_<op1>.ts
│   ├── DM_<module>_<op2>.ts
│   └── ...
└── <Module>_<Screen>.ts          ← UI code that calls ReqMap functions
```

The Spring-side Groovy is under:
```
src/main/groovy/com/.../mods/<module_name>/
├── OpDef_<module_name>.groovy     ← operation definitions + codegen settings
└── dm/
    ├── DM_<module>_<op1>.groovy   ← Groovy data classes
    └── ...
```

### ReqMap file structure

Every `ReqMap_xxxx.ts` follows this exact template:

```typescript
import {url} from "nexus-core-browser/core/AppPathUtils";
import {asyncPostRetVal} from 'nexus-core-browser/core/HttpUtils';
import {DM_xxxx_op1} from "./dm/DM_xxxx_op1";
import {DM_xxxx_op2} from "./dm/DM_xxxx_op2";
// ... one import per DM class

// --codegen-start-const--
export const MOD_NAME_xxxx = "api/xxxx";
export const OP1 = "op1";
export const OP2 = "op2";
// --codegen-end-const--

// --codegen-start-op-op1--
export async function xxxx_op1(data: DM_xxxx_op1): Promise<any> {
   return await asyncPostRetVal({
       url:  url(MOD_NAME_xxxx, OP1),
       data: data,
   });
} //xxxx_op1
// --codegen-end-op-op1--

// --codegen-start-op-op2--
export async function xxxx_op2(data: DM_xxxx_op2): Promise<any> {
   return await asyncPostRetVal({
       url:  url(MOD_NAME_xxxx, OP2),
       data: data,
   });
} //xxxx_op2
// --codegen-end-op-op2--
```

### Naming conventions

| Element | Convention | Example |
|---|---|---|
| Module constant | `MOD_NAME_<module>` | `MOD_NAME_notifications = "api/notifications"` |
| Endpoint constant | `SCREAMING_SNAKE_CASE` | `SAVE = "save"`, `NLS_GROUP_LIST = "nls_group_list"` |
| Function name | `<module>_<operation>` | `notifications_save`, `search_nls_group_delete` |
| DM class name | `DM_<module>_<operation>` | `DM_notifications_save` |
| DM file name | `DM_<module>_<operation>.ts` | `DM_notifications_save.ts` |

### DM (Data Model) class structure

Each DM class is a plain TypeScript class with public properties matching the
Spring-side Groovy DM class fields:

```typescript
//This class will be regenerated every time the appserver is restarted
//at development time if codegen is on

export class DM_notifications_save {
   notification_id : string;
   notification_type : string;
   label : string;
   query_json : Query;
   id: string;
}
```

Key rules:
- **No constructor** — just property declarations with types.
- **Properties match the Groovy DM class exactly** (same names, same types).
- Can include optional `static toServer(data)` and `static fromServer(data)`
  methods for serialisation/deserialisation transforms (added manually
  outside codegen markers).
- The comment header marks it as auto-generated — it will be overwritten on
  appserver restart if codegen is on.

### HTTP transport layer

All operations use `asyncPostRetVal<T>()` from `HttpUtils.ts`:

```typescript
export async function asyncPostRetVal<T = any>(argsPost: ArgsPost<T>): Promise<T>
```

This function:
1. Calls `asyncPost()` which POSTs via **axios** to the URL, optionally showing
   a spinner on a target element (`waitFeedbackTagID`).
2. The Spring controller returns a `RetVal` envelope: `{ value: ..., err: ... }`.
3. `asyncPostRetVal` unwraps the envelope — if `err` is present, throws it;
   otherwise returns `value` directly.

The URL is constructed by `url(modName, endpoint)` from `AppPathUtils.ts`:
```
encodeURI(`${appPath}${modName}/${endpoint}`)
// e.g.: /orcaweb/api/notifications/save
```

### Codegen markers

The `// --codegen-start-xxx--` / `// --codegen-end-xxx--` markers define regions
that the code generator owns. Everything **outside** these markers is preserved
across regenerations.

| Marker | Contains |
|---|---|
| `--codegen-start-const--` | Module name + endpoint constants |
| `--codegen-end-op-get_list--` | Reserved for future GET list endpoints |
| `--codegen-start-op-<name>--` | One async function per operation |
| `--codegen-end-op-<name>--` | End of that operation's function |

### Auto-generation flow

1. Developer adds a new `Op` entry to `OpDef_xxxx.groovy` on the Spring side.
2. Developer creates the Groovy DM class under `dm/`.
3. Appserver is restarted at development time.
4. Codegen reads `OpDef_xxxx.groovy`:
   - For each `Op`, generates an empty Spring controller endpoint.
   - If `generateTypescript = true`, generates/updates `ReqMap_xxxx.ts` and
     `dm/DM_xxxx.ts` on the TypeScript side.
5. Developer fills in the Spring controller endpoint logic and the UI code.

### Calling a ReqMap function from UI code

```typescript
import { notifications_save } from './ReqMap_notifications';
import { DM_notifications_save } from './dm/DM_notifications_save';

async function saveNotification() {
    const dm: DM_notifications_save = {
        label: 'Watch this device',
        notification_id: null,  // null = new record
        notification_type: 'info',
        query_json: currentGridQuery,
        id: null,
    };
    try {
        const result = await notifications_save(dm);
        // result is the unwrapped RetVal.value
        refreshGrid();
    } catch (err) {
        console.error('Save failed', err);
    }
}
```

### Pattern for operations with no request data

```typescript
export async function active_surveillance_list(): Promise<Rec[]> {
    let rec_array = await asyncPostRetVal({
        url:  url(MOD_NAME_active_surveillance, LIST),
        data: null,                         // ← no request body
    });
    return rec_array;
}
```

### Pattern for operations that return typed domain objects

```typescript
import * as REPORTS2___V_PMS_CONFIG from '../../dbm/prod/REPORTS2___V_PMS_CONFIG';

export async function active_surveillance_update(
    data: REPORTS2___V_PMS_CONFIG.Rec
): Promise<REPORTS2___V_PMS_CONFIG.Rec> {
    let rec = await asyncPostRetVal({
        url:  url(MOD_NAME_active_surveillance, UPDATE),
        data: data,
    });
    return rec;
}
```

### Creating a new ReqMap manually (AI should follow this)

1. Create `mods/<module>/dm/DM_<module>_<operation>.ts` for each operation:
   ```typescript
   export class DM_<module>_<operation> {
       field1: string;
       field2: number;
       // ... properties matching the request payload
   }
   ```

2. Create `mods/<module>/ReqMap_<module>.ts`:
   ```typescript
   import {url} from "nexus-core-browser/core/AppPathUtils";
   import {asyncPostRetVal} from 'nexus-core-browser/core/HttpUtils';
   import {DM_<module>_<op1>} from "./dm/DM_<module>_<op1>";
   // ... one import per DM class

   export const MOD_NAME_<module> = "api/<module>";
   export const <OP1> = "<op1>";
   export const <OP2> = "<op2>";

   export async function <module>_<op1>(data: DM_<module>_<op1>): Promise<any> {
       return await asyncPostRetVal({
           url:  url(MOD_NAME_<module>, <OP1>),
           data: data,
       });
   }

   export async function <module>_<op2>(data: DM_<module>_<op2>): Promise<any> {
       return await asyncPostRetVal({
           url:  url(MOD_NAME_<module>, <OP2>),
           data: data,
       });
   }
   ```

3. The Spring controller is expected at `api/<module>/<operation>` (POST).
   The request body is the DM object serialised as JSON.
   The response is a `RetVal` envelope: `{ value: <result>, err: null }` or
   `{ value: null, err: { message: "...", ... } }`.

---

## 17. Helper Type: `Elem_or_N2`

Used throughout the library to accept either a raw HTMLElement or an N2 widget:

```typescript
type Elem_or_N2<STATE extends StateN2 = any> = HTMLElement | N2<STATE>;
```

This is the type of `state.children`, `state.siblings`, `state.prefixSiblings`,
`state.container`, and arguments to `addN2Child()` / `removeN2Child()`.

---

## 18. Quick Reference: Creating a New EJ2 Widget Wrapper

1. Create `gui2/ej2/ext/N2YourWidget.ts`
2. Define `StateN2YourWidgetRef extends StateN2EjBasicRef { widget?: N2YourWidget }`
3. Define `StateN2YourWidget extends StateN2EjBasic<SyncfusionModel> { ref?, customProps… }`
4. Create class `N2YourWidget extends N2EjBasic<StateN2YourWidget, SyncfusionComponent>`
5. Set `static readonly CLASS_IDENTIFIER = 'N2YourWidget'`
6. Override `onStateInitialized(state)`:
   - Call `addN2Class(state.deco, CLASS_IDENTIFIER)`
   - Set HTML defaults on `state.deco` (tag, otherAttr, etc.)
   - Configure `state.ej` defaults if needed
   - Call `super.onStateInitialized(state)`
7. Override `createEjObj()`: `this.obj = new SyncfusionComponent(this.state.ej)`
8. If custom HTML is needed, override `onHtml(args)` (call `super.onHtml(args)` or build from scratch)
9. If custom logic pre/post EJ2 creation is needed, override `onLogic(args)` (call `super.onLogic(args)` at the appropriate point)
10. If custom cleanup is needed, override `onDestroy(args)` (call `super.onDestroy(args)`)
11. Optional: add CSS via `themeChangeListeners().add(…)` with `cssAdd(…)` scoped to `CLASS_IDENTIFIER`

---

## 19. Quick Reference: Creating a New Standalone Widget

1. Create `gui2/generic/N2YourThing.ts` (or appropriate location)
2. Define `StateN2YourThingRef extends StateN2BasicRef { widget?: N2YourThing }`
3. Define `StateN2YourThing extends StateN2Basic { ref?, customProps… }`
4. Create class `N2YourThing extends N2Basic<StateN2YourThing>`
5. Set `static readonly CLASS_IDENTIFIER = 'N2YourThing'`
6. Override `onStateInitialized(state)`:
   - Call `addN2Class(state.deco, CLASS_IDENTIFIER)`
   - Add layout/flex CSS classes as needed
   - Call `super.onStateInitialized(state)`
7. If custom HTML is needed, override `onHtml(args)`
8. If custom JS logic is needed, override `onLogic(args)`
9. If custom cleanup is needed, override `onDestroy(args)`

---

## 20. Environment & Dependencies

- **Syncfusion EJ2** — `@syncfusion/ej2-base`, `@syncfusion/ej2-buttons`,
  `@syncfusion/ej2-inputs`, `@syncfusion/ej2-grids`, `@syncfusion/ej2-popups`,
  `@syncfusion/ej2-dropdowns`, `@syncfusion/ej2-data`, `@syncfusion/ej2-navigations`,
  `@syncfusion/ej2-layouts`, `@syncfusion/ej2-calendars`, `@syncfusion/ej2-charts`,
  `@syncfusion/ej2-diagrams`, `@syncfusion/ej2-documenteditor`, `@syncfusion/ej2-gantt`,
  `@syncfusion/ej2-maps`, `@syncfusion/ej2-pdfviewer`, `@syncfusion/ej2-pivotview`,
  `@syncfusion/ej2-querybuilder`, `@syncfusion/ej2-richtexteditor`,
  `@syncfusion/ej2-schedule`, `@syncfusion/ej2-spreadsheet`, etc.
- **lodash** — `throttle`, `debounce`, `isArray`, `isFunction`, `isString`,
  `isNumber`, `isDate`, `escape`, `cloneDeep`.
- **css-element-queries** — `ResizeSensor` for element-level resize detection.
- **dompurify** — HTML sanitisation (via `DOMPurifyNexus` wrapper).
- **dateformat** — Date formatting library.
- **axios** — HTTP utilities (used in error handling types).
- **tippy.js** — Tooltip library (used in grid cell tooltips).
- **Font Awesome** — Icon classes (e.g. `fa-chevron-up`, `fa-solid`).

---

*Generated for AI-assisted development. Focus on `gui2/`; ignore `gui/` (deprecated).*
*Always use `N2_CLASS` constant from `Constants.ts`, never the raw string `'_n2_'`.*
