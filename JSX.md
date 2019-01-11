# JSX Usage

## TOC

- [Introduction](#introduction)
- [Syntax](#syntax)
- [Transpile](#transpile)

## Introduction

JSX is an extension to JavaScript which enables you to use XML-like syntax in JavaScript. For example:

```jsx
const heading = <h1>This is JSX.</h1>;
```

It is usually nice to write UIs in JSX. However, it is optional. In fact, all the JSX code will be converted into normal JavaScript function calls. For instance,

```jsx
const paragraph = <p class="para">JSX</p>;
```

will be transformed into something like this: (assuming the JSX factory function is `HUI`)

```js
const paragraph = HUI("p", { class: "para" }, "JSX");
```

In a word, it depends on your own, but it is recommended to try JSX.

## Syntax

As introduced at the beginning, JSX just brings an XML-like syntax sugar to JavaScript, so its syntax is `JavaScript+XML` in brief.

### Extra syntax

1. Any tag can be self-closed if it doesn't have child nodes.
2. Expressions can be inserted by wrapping them with braces.
3. A tag name starting with an uppercase letter will be considered a custom identifier.
4. The value of an attribute whose value is omitted will be `true`.

### Example

1. Self-close:

    ```jsx
    const emptyContainer = <div class="container" />;
    const appWithoutChildren = <App foo="bar" />;
    ```

2. Expressions:

    ```jsx
    const dynamicParagraph = <p>Time: {Date.now()}</p>;
    const appWithConfig = <App config={{ debug: true }} />;
    const inputWithListener = <input oninput={(event) => {
        handleInput(event);
    }} />;
    ```

3. Custom identifiers:

    ```jsx
    import MyComponent from "MyComponent";
    const myComponent = <MyComponent />;
    ```

4. Default value:

    ```jsx
    const input = <input autofocused />;
    // equals to
    const input = <input autofocused={true} />;
    ```

## Transpile

JSX is just a syntax sugar and it can not be directly run in browsers like plain JavaScript, so you need to transpile your JSX code into plain JavaScript. There are many tools which can do this for you. Here are some examples:

### Babel

Babel is a compiler for next generation JavaScript. It can also transform JSX syntax with plugins.

1. Install babel.

2. Install a JSX transformer:

    ```bash
    npm i -D @babel/plugin-transform-react-jsx
    ```

3. Set your `.babelrc` like this:

    ```json
    {
        "plugins": [
            [
                "@babel/plugin-transform-react-jsx",
                {
                    "pragma": "HUI",
                    "pragmaFrag": "HUI.Fragment"
                }
            ]
        ]
    }
    ```

4. Use babel to transform your code.

For more information about babel, see [babeljs.io](https://babeljs.io).

### TypeScript

TypeScript supports JSX out of the box.

1. Install TypeScript.

2. Set your `tsconfig.json` like this:

    ```json5
    {
        // ...
        "compilerOptions": {
            // ...
            "jsx": "react",
            "jsxFactory": "HUI",
            // ...
        },
        // ...
    }
    ```

3. Compile your TypeScript code.

For more information about TypeScript, see [www.typescriptlang.org](https://www.typescriptlang.org).
