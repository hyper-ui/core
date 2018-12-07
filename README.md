# hyper-ui

> A lightweight front-end UI lib.

## TOC

- [Features](#features)
- [Usage](#usage)
- [Hello World](#hello-world)
- [API Reference](#api-reference)
- [Env Requirements](#env-requirements)
- [TODO Example](#example)
- [Changelog](#changelog)

## Features

### Lightweight

This lib is rather lightweight. The size of the file which you need to include is less than 10KB!

### Reusable

As your app is splitted into simple and reusable components, you can use any part you want anywhere.

### Simple

You can just easily include it and start writing the code of you app because it can be just plain JavaScript.

## Usage

### npm

1. Use npm to install it as a dependency:

    ```bash
    npm i hyper-ui
    ```

2. Import the default export from the lib:

    ```js
    import HUI from "hyper-ui";
    // or
    const HUI = require("hyper-ui");
    ```

### CDN

1. Include one of the following script tag in your HTML file: (If you want a specified version, just replace `latest` with that. For more information, visit [www.jsdelivr.com](https://www.jsdelivr.com/) or [unpkg.com](https://unpkg.com/).)

    ```html
    <!-- via jsdelivr -->
    <script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    <!-- via unpkg -->
    <script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    ```

2. Access the APIs via the `HUI` global.

## Hello World

```html
<!-- index.html -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1" />
    <title>hyper-ui example</title>
    <style type="text/css">
        /* Set the style of the heading which will be added later */
        #heading {
            text-align: center;
        }
    </style>
</head>

<body>
    <!-- Import the lib -->
    <script type="text/javascript" crossorigin="anonymous"
        src="https://cdn.jsdelivr.net/npm/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    <!-- and your code -->
    <script type="text/javascript" src="./index.js"></script>
</body>

</html>
```

```js
/* index.js */
// Define a component called `Greeting`
HUI.define('Greeting', {
    // Define the `render` method
    render: function (props) {
        // Renders a simple heading: h1#heading
        return HUI('h1', { id: 'heading' }, [
            'Hello,',
            props.target,
            '!'
        ]);
    }
});
// Render the app
HUI.render(
    // Create a greeting
    HUI('Greeting', { target: 'world' })
);
```

## API Reference

### HUI

```ts
function HUI(type: string | symbol, properties?: object, ...children: any[]): HNode;
```

This is the default export of the lib, and the only global exported by the lib if you include the UMD module in your HTML file. You can call this to create virtual nodes (named `HNode` in this lib).

#### type

The first argument is either a string or a symbol telling the type of the virtual node (quite like element tags in HTML). If the type has been [`define`](#define)d as a custom component, then what the [`render`](#descrender) method of the description returns will be rendered. Otherwise, it is used to specify the tag of the element which will be rendered.

#### properties

The second argument is an optional object representing the properties of the node (like element attributes). If the node is a custom component, then it will receive the props. Or, the props will be treated as the attributes of the element. For the latter, each prop will be set as is unless a corresponding handler is in [`propHandlers`](#huiprophandlers) or its name starts with `on`:

Any prop whose name starts with `on` will be considered as an event listener. A valid event listener prop name is: `on`+`event`(+`option`), where `option` can be one or some of `Captrue`, `Nonpassive` and `Once` which stand for the listening options. For instance, `onclick` means a simple `click` event listener, and `ontouchstartOnceNonpassive` means a one-off and nonpassive `touchstart` one.

#### children

Other arguments will be rendered as the children of the element or passed to the component as `props.children`.

### HUI.render

```ts
function render(src: any, parent?: Node, clr?: boolean, global?: Store): void;
```

This method renders `src` into real DOM node(s) in `parent`.

#### src

This argument tells what to be rendered. (See [rendering rules](#rendering-rules) for more information.)

#### parent

The second argument indicates the parent node and is optional. (Default: `document.body`)

#### clr

This is an optional boolean telling whether to clear the parent node before rendering. (Default: false)

#### global

This is an optional parameter which can be a store object representing the initial context. (You may not need this parameter in most cases because you can use [`HUI.Context`](#huicontext) instead. If you do want to pass an initial context store, use [`HUI.createStore`](#huicreatestore) to create one.)

#### rendering rules

It is true that you can render anything, but there are still some rendering rules:

- `HNode`s will be rendered as described in [`type`](#type) explanation in `HUI` section;
- Strings and numbers will be rendered as text nodes;
- Arrays will be rendered as their elements;
- Other things will be rendered as empty text nodes.

### HUI.define

```ts
function define(name: string | symbol, desc: object): void;
```

This method lets you define a custom component.

#### name

This is either a string or a symbol used to identify the component.

#### desc

This is an object which stands for the description of the component. It can have following properties:

##### desc.state

This is an array which contains some keys of the store of the component. When any stored value matching one of the keys in this array changes, the component will be updated.

##### desc.context

This is an array which contains some keys of the context. When any context value matching one of the keys in this array changes, the component will be updated.

##### desc.init

```ts
function init(this: void, props: object, store: Store, ctx: Store): void;
```

This property is an optional function. It will be called before the first paint of the component to initialize the component (e.g. store some initial values or fetch some data for the component).

##### desc.render

```ts
function render(this: void, props: object, store: Store, ctx: Store): any;
```

This property is required and returns what to be rendered.

##### desc.clear

```ts
function clear(this: void, props: object, store: Store, ctx: Store): void;
```

This property is an optional function. It will be called when the component will be destroyed to do some clear things (e.g. clear the timers set in `init` or cancel unfinished data fetching started in `init`).

##### desc.catch

```ts
function catch(this: void, err: any, props: object, store: Store, ctx: Store): any;
```

This property is an optional function. It will be called when something goes wrong with the component. The first argument will be the error. In addition, what it returns will be rendered so that you can show some error messages. (Errors in `clear` will be printed in console but not be passed to this method.)

##### arguments explanation

###### props

This stands for received props. (There will always be a prop called `children` representing received children.)

###### store

This is a [store object](#huicreatestore) and each component instance will have one. You can use it to save some values (e.g. states). If a value changes and its key is in the [`state`](#descstate) array, then the component will be updated.

###### ctx

This is also a store object but each component instance under the same [`HUI.render`](#huirender) call will have a linked context. That is, this is like a global store.

### HUI.propHandlers

This is a map which stores custom node prop handlers. There are some built-in handlers as well:

#### style

The style handler handles style for you so that you can use either strings or objects to describe styles.

#### class

This handler deals with class names and enables you to pass either a simple string or an array as the class list.

#### attributes

With this handler, you can specify some attributes that will be set by calling the `setAttribute` method on the node.

#### ref

This is a very special prop which you can use to get the real DOM node. You need to pass a callback as the value of this prop to receive the node. For example:

```js
// Create an input element and get it
HUI('input', {
    // The reference callback
    ref: function (inputEle) {
        // Here is the input element
        console.log(inputEle);
    }
});
```

### HUI.createStore

This method creates a new store and returns it. You don't need to know this method in most cases. But you should know store objects it returns.

#### Store

Each store object stores some value pairs. The `store` argument and the `context` argument you receive in [`description`](#desc) methods are all store objects. A store object has the following methods for you to manage the values stored in it:

#### store.get

```ts
function get(key: any): any;
```

This method lets you get the value matching the given key.

#### store.set

```ts
function set(key: any, value: any, force?: boolean): this;
```

This method lets you set the value matching the given key. You can also pass a boolean as the third argument to tell the method that this is a new value anyway.

#### store.setter

```ts
function setter(key: any, force?: boolean): (value: any) => void;
```

This method returns a setter for the given key. You can pass a force update flag to it as well, which will later be passed to the `set` method. One use case is passing a store setter as a `ref` prop.

#### store.toggle

```ts
function toggle (key: any): this;
```

This method toggles the value matching the given key.

#### store.inc

```ts
function inc (key: any, addition?: any): this;
```

This method adds the given addition to the matching value. (Default addition: 1)

#### store.push

```ts
function push (key: any, ...items: any[]): this;
```

This method adds the given items to the end of the matching array.

#### store.unshift

```ts
function unshift (key: any, ...items: any[]): this;
```

This method adds the given items to the start of the matching array.

#### store.slice

```ts
function slice (key: any, start: number, end: number): this;
```

This method slices the matching array from `start` to `end`.

#### store.splice

```ts
function splice (key: any, start: number, deleteCount?: number): this;
function splice (key: any, start: number, deleteCount: number, ...items: any[]): this;
```

This method deletes some elements of the matching array and if necessary, adds some new items to it. (If there are only two arguments provided, then all the elements since `start` will be deleted.)

### HUI.defer

```ts
function defer(callback: (...args: any[]) => void, ...args: any[]): void;
```

This method accepts a callback and some optional arguments for it. The `callback` function will be invoked with those arguments later. More specifically speaking, the `callback`s will be invoked after all the components are updated.

One use case is doing DOM manipulations after the DOM objects are completely ready:

```js
// Define a component which renders an auto-focused input
HUI.define('AutofocusedInput', {
    render: function (props, store) {
        // Defer the DOM manipulations
        HUI.defer(function () {
            // The input element is in the document now.
            store.get('input').focus();
        });
        // Render an input and stores its reference in the store
        return HUI('input', { ref: store.setter('input') });
    }
});
```

### HUI.Portal

This is a symbol standing for `portal`s. `Portal`s let you render something elsewhere. For example:

```js
// Define a dialog window component
HUI.define('DialogWindow', {
    // Declare `on` as a state
    state: ['on'],
    // Initializing callback
    init: function (props, store) {
        // Set the default state
        store.set('on', false);
    },
    render: function (props, store) {
        return [
            // A toggle button
            HUI('button', {
                onclick: function () {
                    store.set('on', !store.get('on'));
                }
            }, [
                'Toggle dialog'
            ]),
            // a paragraph somewhere else if the state `on` is true
            store.get('on') && HUI(HUI.Portal, null, [
                HUI('p', { attr: { style: 'color: blue;' } }, '[Dialog window]')
            ])
        ];
    }
});
```

#### PortalProps.node

By default, the children of the portal will be appended to `document.body`, but you can also directly specify a container node.

### HUI.Context

This is a symbol standing for `context`s. `Context`s enable you to easily set context values out of components. A `context` component accepts a `key` prop and a `value` prop. For example,

```js
// Set the context value `foo` to 'bar'
HUI(HUI.Context, {
    key: 'foo',
    value: 'bar'
});
```

### HUI.tick

```ts
function tick(callback: () => void): void;
```

This is the ticking method which is used internally. It accepts a callback and let it be called later. The built-in one uses `requestAnimationFrame` to do this. You can use your own ticking method to override this to meet your needs.

### HUI.frameLimit

This is a number representing the frame time limit in milliseconds. Updates will be sliced according to this. You can set your own value to modify this behaviour. (Default: 15)

## Env Requirements

This lib depends on some features such as `Map`, `Symbol`, `requestAnimationFrame` and so on. So, if you want to use it in some old browsers, consider including some polyfills. For instance, include [`hpolyfill`](https://github.com/huang2002/hpolyfill/) in your HTML:

```html
<!-- via jsdelivr -->
<script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hpolyfill@latest/dist/index.js"></script>
<!-- via unpkg -->
<script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/hpolyfill@latest/dist/index.js"></script>
```

## Example

Here is a TODO app example:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1" />
    <title>TODO</title>
</head>

<body>
    <!-- Load the lib -->
    <script type="text/javascript" crossorigin="anonymous"
        src="https://cdn.jsdelivr.net/npm/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    <!-- Create the app -->
    <script type="text/javascript">
        // Define the editor component
        HUI.define('Editor', {
            render: function (props, store, context) {
                // Render a form with an input and a button
                return HUI('form', {
                    // Handle the submit event
                    onsubmit: function (e) {
                        e.preventDefault();
                        // Get the input element and its value
                        var input = store.get('input'),
                            content = input.value;
                        if (content) {
                            // Add this item
                            context.push('items', content);
                            // Clear the input
                            input.value = '';
                        } else {
                            // Hint the user to input something
                            store.get('input').focus();
                        }
                    }
                }, [
                    // content input
                    HUI('input', { ref: store.setter('input'), placeholder: 'content' }),
                    // submit button
                    HUI('input', { attributes: { type: 'submit', value: 'Add' } })
                ]);
            }
        });
        // Define the list component
        HUI.define('List', {
            // Subscribe to changes of the context value `items`
            context: ['items'],
            render: function (props, store, context) {
                // Render an unordered list
                return HUI('ul', null, context.get('items').map(function (item, i) {
                    // list item
                    return HUI('li', null, [
                        // content
                        HUI('span', { style: 'margin-right: 1em;' }, item),
                        // deleting link
                        HUI('a', {
                            href: 'javascript:;',
                            // Handle the click event
                            onclick: function () {
                                // Delete the item
                                context.splice('items', i, 1);
                            }
                        }, 'Del')
                    ]);
                }));
            }
        });
        // Render the app
        HUI.render([
            // Set the initial context value
            HUI(HUI.Context, { key: 'items', value: [] }),
            // Render a heading
            HUI('h1', null, 'TODO'),
            // Render the editor
            HUI('Editor'),
            // and the list
            HUI('List')
        ]);
    </script>
</body>

</html>
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md)
