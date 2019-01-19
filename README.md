# hyper-ui

> A lightweight front-end UI lib.

## TOC

- [Features](#features)
- [Usage](#usage)
- [Hello World](#hello-world)
- [Links](#links)
- [Env Requirements](#env-requirements)
- [TODO Example](#todo-example)

## Features

### Lightweight

This lib is rather lightweight. The size of this core package which you need to include is less than 10KB!

### Declarative

To create interactive UIs, just define simple components for each state in your app, and changes will be found as well as updated efficiently.

### Simple

You can just easily include it and start writing the code of you app because it can be just plain JavaScript.

## Usage

### npm

1. Use npm to install it as a dependency:

    ```bash
    npm install @hyper-ui/core
    ```

2. Import the default export of this lib:

    ```js
    // es2015+
    import HUI from "@hyper-ui/core";
    // or es5
    const HUI = require("@hyper-ui/core");
    ```

3. Use it to build your app.

### CDN

1. Include one of the following script tags in your HTML file: (If you want a specified version, just replace `latest` with that. For more information, visit [www.jsdelivr.com](https://www.jsdelivr.com/) or [unpkg.com](https://unpkg.com/).)

    via jsdelivr:

    ```html
    <script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/@hyper-ui/core@latest/dist/hyper-ui.core.umd.min.js"></script>
    ```

    or via unpkg:

    ```html
    <script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/@hyper-ui/core@latest/dist/hyper-ui.core.umd.min.js"></script>
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

- [JSX Usage](docs/JSX.md)
- [API Reference](docs/API.md)
- [Changelog](CHANGELOG.md)
- [License (MIT)](LICENSE)

## Env Requirements

This lib depends on some features such as `Map`, `Symbol`, `array.includes` and so on. So, if you want to use it in some old browsers, consider including some polyfills. For instance, include [`hpolyfill`](https://github.com/huang2002/hpolyfill/) by putting one of the following script tags in your HTML: (it should be put before the script tag of this lib)

via jsdelivr:

```html
<script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hpolyfill@latest/dist/index.js"></script>
```

or via unpkg:

```html
<script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/hpolyfill@latest/dist/index.js"></script>
```

## TODO Example

Here is a TODO app example:

```js
// Define the editor
const Editor = HUI.define('Editor', {
    // Initializer
    init(props, store, context) {
        // Set the submission handler
        store.handle('submit', event => {
            // Prevent default action
            event.preventDefault();
            // Get the input and its value
            const input = store.get('input'),
                content = input.value;
            // Handle submission
            if (content) {
                // Add the item
                context.push('items', content);
                // Clear the input
                input.value = '';
            } else {
                // Hint the user to type something
                input.focus();
            }
        });
    },
    // Renderer
    render(props, store) {
        // Render a form with an input and a submit button in it
        return HUI('form', { onsubmit: store.getHandler('submit') }, [
            // The input
            HUI('input', {
                ref: store.setter('input'),
                placeholder: props.placeholder
            }),
            // The submit button
            HUI('button', { attr: { type: 'submit' } }, 'Add')
        ]);
    }
});
// Define the item list
const ItemList = HUI.define('ItemList', {
    // Required context
    context: ['items'],
    // Renderer
    render(props, store, context) {
        // Render an unordered item list
        return HUI('ul', null, context.get('items').map((content, index) => (
            // A list item
            HUI('li', null, [
                // Item content
                HUI('span', { style: { marginRight: '1em' } }, content),
                // Delete link
                HUI('a', {
                    href: 'javascript:;',
                    // Handle `click` event
                    onclick(event) {
                        // Delete the item
                        context.splice('items', index, 1);
                    }
                }, 'Delete')
            ])
        )));
    }
});
// Define the app
const App = HUI.define('App', {
    // Renderer
    render() {
        return [
            // Heading
            HUI('h1', null, 'TODO'),
            // Editor
            HUI(Editor, { placeholder: 'content' }),
            // Item list
            HUI(ItemList)
        ];
    }
});
// Render the app
HUI.render(
    HUI(App),
    { defaultContext: { items: [] } }
);
```
