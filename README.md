# hyper-ui

> A lightweight front-end UI lib.

## TOC

- [Features](#features)
- [Usage](#usage)
- [Hello World](#hello-world)
- [API Reference](#api-reference)
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

2. Import it:

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
        #heading {
            text-align: center;
        }
    </style>
</head>

<body>
    <script type="text/javascript" crossorigin="anonymous"
        src="https://cdn.jsdelivr.net/npm/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    <script type="text/javascript" src="./index.js"></script>
</body>

</html>
```

```js
/* index.js */
HUI.define('Greeting', {
    render: function (props) {
        return HUI('h1', { id: 'heading' }, [
            'Hello,',
            props.target,
            '!'
        ]);
    }
});
HUI.render(
    HUI('Greeting', { target: 'world' })
);
```

## API Reference

### HUI

```ts
HUI(type: string | symbol, properties?: object, ...children: any[]): HNode;
```

This is the default export of the lib, and the only global exported by the lib if you include the UMD module in your HTML file. You can call this to create virtual nodes (named `HNode` in this lib).

#### type

The first argument is either a string or a symbol telling the type of the virtual node (quite like element tags in HTML). If the type has been [`define`](#define)d as a custom component, then what the [`render`](#desc-render) method of the description returns will be rendered. Otherwise, it is used to specify the tag of the element which will be rendered.

#### properties

The second argument is an optional object representing the properties of the node (like element attributes). If the node is a custom component, then it will receive the props. Or, the props will be treated as the attributes of the element. For the latter, each prop will be set as is unless a corresponding handler is in [`propHandlers`](#hui-prophandlers) or its name starts with `on`:

Any prop whose name starts with `on` will be considered as an event listener. A valid event listener prop name is: `on`+`event`(+`option`), where `option` can be one or some of `Captrue`, `Nonpassive` and `Once` which stand for the listening options. For instance, `onclick` means a simple `click` event listener, and `ontouchstartOnceNonpassive` means a one-off and nonpassive `touchstart` one.

#### children

Other arguments will be rendered as the children of the element or passed to the component as `props.children`.

### HUI.render

```ts
HUI.render(src: any, parent?: Node, clr?: boolean, global?: Store): void;
```

This method renders `src` on `parent` and usually will be called only once.

#### src

This argument tells what to be rendered. (See [rendering rules](#rendering-rules) for more information.)

#### parent

The second argument indicates the parent node and is optional. (Default: `document.body`)

#### clr

This is an optional boolean telling whether to clear the parent node before rendering. (Default: false)

#### global

This is an optional parameter which can be a store object representing the initial context. (You may not need this parameter in most cases because you can use [`HUI.Context`](#hui-context) instead. If you do want to pass an initial context store, use [`HUI.createStore`](#hui-createstore) to create one.)

#### rendering rules

It is true that you can render anything, but there are still some rendering rules:

- `HNode`s will be rendered as described in [`type`](#type) explanation in `HUI` section;
- Strings and numbers will be rendered as text nodes;
- Arrays will be rendered as their elements;
- Other things will be rendered as empty text nodes.

### HUI.define

```ts
HUI.define(name: string | symbol, desc: object): void;
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
desc.init: (this: void, props: object, store: Store, ctx: Store) => void;
```

This property is an optional function. It will be called before the first paint of the component to initialize the component (e.g. store some initial values or fetch some data for the component).

##### desc.render

```ts
desc.render: (this: void, props: object, store: Store, ctx: Store) => any;
```

This property is required and returns what to be rendered.

##### desc.clear

```ts
desc.clear: (this: void, props: object, store: Store, ctx: Store) => void;
```

This property is an optional function. It will be called when the component will be destroyed to do some clear things (e.g. clear the timers set in `init` or cancel unfinished data fetching started in `init`).

##### desc.catch

```ts
desc.catch: (this: void, err: any, props: object, store: Store, ctx: Store) => any;
```

This property is an optional function. It will be called when something goes wrong with the component. The first argument will be the error. In addition, what it returns will be rendered so that you can show some error messages. (Errors in `clear` will be printed in console but not be passed to this method.)

##### arguments explanation

###### props

This stands for received props. (There will always be a prop called `children` representing received children.)

###### store

This is a [store object](#hui-createstore) and each component instance will have one. You can use it to save some values (e.g. states). If a value changes and its key is in the [`state`](#desc-state) array, then the component will be updated.

###### ctx

This is also a store object but each component instance under the same `HUI.render` call will have a linked context. That is, this is like a global store.

### HUI.propHandlers

```ts
HUI.propHandlers: Map<string, PropHandler>;
```

This is a map which stores custom node prop handlers. There are some built-in handlers as well:

#### style

The style handler handles style for you so that you can use either strings or objects to describe styles.

#### class

This handler deals with class names and enables you to pass either a simple string or an array as the class list.

#### attributes

With this handler, you can specify some attributes that will be set by calling the `setAttribute` method on the node.

#### ref

This is a very special prop which you can use to get the real DOM object. You need to pass a `RefCallback` as the value of this prop, which receives the node. For example:

```js
HUI('input', {
    ref: function (inputEle) {
        console.log(inputEle);
    }
});
```

### HUI.createStore

This method creates a new store and returns it. You don't need to know this method in most cases. But you should know store objects it returns.

#### Store

Each store object stores some value pairs. The `store` argument and the `context` argument you receive in [`description`](desc) methods are all store objects. A store object has the following methods for you to manage the values stored in it:

#### store.get

```ts
store.get(key: any): any;
```

This method lets you get the value matching the given key.

#### store.set

```ts
store.set(key: any, value: any, force?: boolean): this;
```

This method lets you set the value matching the given key. You can also pass a boolean as the third argument to tell the method that this is a new value anyway.

#### store.setter

```ts
store.setter(key: any, force?: boolean): (value: any) => void;
```

This method returns a setter for the given key. You can pass a force update flag to it as well, which will later be passed to the `set` method. One use case is passing a store setter as a `ref` prop.

### HUI.defer

```ts
HUI.defer<A extends any[] = any[]>(callback: (...args: A) => void, ...args: A): void;
```

This method accepts a callback and some optional arguments for it. The `callback` function will be invoked with those arguments later. More specifically speaking, the `callback`s will be invoked at the end of each tick.

One use case is doing DOM manipulations after the DOM objects are completely ready:

```js
HUI.define('AutofocusedInput', {
    render: function (props, store) {
        HUI.defer(function () {
            // The input element is in the document now.
            store.get('input').focus();
        });
        return HUI('input', { ref: store.setter('input') });
    }
});
```

### HUI.Portal

This is a symbol standing for `portal`s. `Portal`s let you render something elsewhere. For example:

```js
HUI.define('DialogWindow', {
    state: ['on'],
    init: function (props, store) {
        store.set('on', false);
    },
    render: function (props, store) {
        return [
            HUI('button', {
                onclick: function () {
                    store.set('on', !store.get('on'));
                }
            }, [
                'Toggle dialog'
            ]),
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
HUI(HUI.Context, {
    key: 'some-context',
    value: 'some-value'
});
```

### HUI.tick

```ts
HUI.tick(callback: () => void): void;
```

This is the ticking method which is used internally. It accepts a callback and let it be called later. The built-in one uses `requestAnimationFrame` to do this. You can use your own ticking method to override this to meet your needs.

### HUI.frameLimit

This is a number representing the frame time limit in milliseconds. Updates will be sliced according to this. You can set your own value to modify this behaviour. (Default: 15)

## Example

There is a TODO app example:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1" />
    <title>TODO</title>
</head>

<body>
    <script type="text/javascript" crossorigin="anonymous"
        src="https://cdn.jsdelivr.net/npm/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    <script type="text/javascript">

        HUI.define('Editor', {
            render: function (props, store, context) {
                return HUI('form', {
                    onsubmit: function (e) {
                        e.preventDefault();
                        var input = store.get('input'),
                            content = input.value;
                        if (content) {
                            context.set(
                                'items',
                                context.get('items').concat(content)
                            );
                            input.value = '';
                        } else {
                            store.get('input').focus();
                        }
                    }
                }, [
                    HUI('input', { ref: store.setter('input'), placeholder: 'content' }),
                    HUI('input', { attributes: { type: 'submit', value: 'Add' } })
                ]);
            }
        });

        HUI.define('List', {
            context: ['items'],
            render: function (props, store, context) {
                return HUI('ul', null, context.get('items').map(function (item, i) {
                    return HUI('li', null, [
                        HUI('span', { style: 'margin-right: 1em;' }, item),
                        HUI('a', {
                            href: 'javascript:;',
                            onclick: function () {
                                var items = context.get('items');
                                items.splice(i, 1);
                                context.set('items', items, true);
                            }
                        }, 'Del')
                    ]);
                }));
            }
        });

        HUI.render(
            HUI(HUI.Context, { key: 'items', value: [] }, [
                HUI('h1', null, 'TODO'),
                HUI('Editor'),
                HUI('List')
            ])
        );

    </script>
</body>

</html>
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md)
