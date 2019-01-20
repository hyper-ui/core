# hyper-ui

> A lightweight front-end UI lib.

## Links

- [Documents](https://github.com/hyper-ui/core/wiki)
- [Changelog](https://github.com/hyper-ui/core/blob/master/CHANGELOG.md)
- [License (MIT)](https://github.com/hyper-ui/core/blob/master/LICENSE)

## Hello World

```js
// Define a component called `Greeting`
const Greeting = HUI.define('Greeting', {
    // Define the renderer
    render(props) {
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
