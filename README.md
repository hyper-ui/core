# hyper-ui

> A lightweight front-end UI lib.

## TOC

- [Features](#features)
- [Usage](#usage)
- [Hello World](#hello-world)
- [Links](#links)
- [Env Requirements](#env-requirements)
- [TODO Example](#example)

## Features

### Lightweight

This lib is rather lightweight. The size of the file which you need to include is less than 10KB!

### Declarative

To create interactive UIs, just define simple components for each state in your app, and changes will be found as well as updated efficiently.

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

1. Include one of the following script tags in your HTML file: (If you want a specified version, just replace `latest` with that. For more information, visit [www.jsdelivr.com](https://www.jsdelivr.com/) or [unpkg.com](https://unpkg.com/).)

    ```html
    <!-- via jsdelivr -->
    <script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    <!-- or via unpkg -->
    <script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/hyper-ui@latest/dist/hyper-ui.umd.min.js"></script>
    ```

2. Access the APIs via the `HUI` global.

## Hello World

```js
// Define a component called `Greeting`
const Greeting = HUI.define('Greeting', {
    // Define the `render` method
    render: function (props) {
        // Render a simple heading
        return HUI('h1', { style: { textAlign: 'center' } }, [
            'Hello,',
            props.target,
            '!'
        ]);
    }
});
// Render the app
HUI.render(
    // Create a greeting instance
    HUI(Greeting, { target: 'world' })
);
```

## Links

- [JSX Usage](JSX.md)
- [API Reference](API.md)
- [Changelog](CHANGELOG.md)
- [License](LICENSE) (MIT)

## Env Requirements

This lib depends on some features such as `Map`, `Symbol`, `array.includes` and so on. So, if you want to use it in some old browsers, consider including some polyfills. For instance, include [`hpolyfill`](https://github.com/huang2002/hpolyfill/) by putting one of the following script tags in your HTML: (it should be put before the script tag of this lib)

```html
<!-- via jsdelivr -->
<script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hpolyfill@latest/dist/index.js"></script>
<!-- or via unpkg -->
<script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/hpolyfill@latest/dist/index.js"></script>
```

## Example

Here is a TODO app example:

```js
// Define the app
const TODO = HUI.define('TODO', {
    // Define the state
    state: ['items'],
    // Define the default state
    defaultStore: {
        items: []
    },
    // Define the renderer
    render: function (props, store) {
        // Render multiple elements
        return [
            // a form
            HUI('form',
                {
                    onsubmit: function (e) {
                        e.preventDefault();
                        // Get the input element and its value
                        var input = store.get('input'),
                            content = input.value;
                        // Validate the data and handle it
                        if (content) {
                            // Add this item
                            store.push('items', content);
                            // Clear the input
                            input.value = '';
                        } else {
                            // Hint the user to input something
                            input.focus();
                        }
                    }
                }, [
                    // content input
                    HUI('input', { ref: store.setter('input'), placeholder: 'content' }),
                    // submit button
                    HUI('input', { attr: { type: 'submit', value: 'Add' } })
                ]
            ),
            // an unordered list
            HUI('ul', {}, store.get('items').map(function (item, i) {
                // list item
                return HUI('li', null, [
                    // content
                    HUI('span', { style: { marginRight: '1em' } }, item),
                    // deleting link
                    HUI('a', {
                        href: 'javascript:;',
                        onclick: function () {
                            // Delete the item
                            store.splice('items', i, 1);
                        }
                    }, 'Del')
                ]);
            }))
        ];
    }
});
// Render a heading and the app
HUI.render([
    HUI('h1', null, 'TODO'),
    HUI(TODO)
]);
```
