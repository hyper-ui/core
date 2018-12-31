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

To create interactive UIs, just define simple components for each state in your app, and this lib will find out the changes as well as update them efficiently.

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
const Greeting = HUI.define('Greeting', {
    // Define the `render` method
    render: function (props) {
        // Render a simple heading: h1#heading
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
    HUI(Greeting, { target: 'world' })
);
```

## Links

- [JSX Usage](JSX.md)
- [API Reference](API.md)
- [Changelog](CHANGELOG.md)
- [License](LICENSE) (MIT)

## Env Requirements

This lib depends on some features such as `Map`, `Symbol`, `array.includes` and so on. So, if you want to use it in some old browsers, consider including some polyfills. For instance, include [`hpolyfill`](https://github.com/huang2002/hpolyfill/) in your HTML:

```html
<!-- via jsdelivr -->
<script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hpolyfill@latest/dist/index.js"></script>
<!-- or via unpkg -->
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
    <script src="../dist/hyper-ui.umd.js"></script>
    <!-- Create the app -->
    <script type="text/javascript">
        // Define the app
        const TODO = HUI.define('TODO', {
            // Define the state
            state: ['items'],
            // Define the initializer
            init: function (props, store) {
                // Initialize the item list
                store.set('items', []);
            },
            // Define the renderer
            render: function (props, store) {
                return [
                    // Render a form
                    HUI('form', {
                        // Handle the submit event
                        onsubmit: function (e) {
                            e.preventDefault();
                            // Get the input element and its value
                            var input = store.get('input'),
                                content = input.value;
                            // Validate the input data
                            if (content) {
                                // Add this item
                                store.push('items', content);
                                // Fix focus
                                HUI.defer(function () {
                                    store.get('input').focus();
                                });
                            } else {
                                // Hint the user to input something
                                input.focus();
                            }
                        }
                    }, [
                        // content input
                        HUI('input', {
                            ref: store.setter('input'),
                            placeholder: 'content'
                        }),
                        // submit button
                        HUI('input', {
                            attr: {
                                type: 'submit',
                                value: 'Add'
                            }
                        })
                    ]),
                    // Render an unordered list
                    HUI('ul', {}, store.get('items').map(function (item, i) {
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
                                    store.splice('items', i, 1);
                                }
                            }, 'Del')
                        ]);
                    }))
                ];
            }
        });
        // Render
        HUI.render([
            // Render a heading
            HUI('h1', null, 'TODO'),
            // Render the app
            HUI(TODO)
        ]);
    </script>
</body>

</html>
```
