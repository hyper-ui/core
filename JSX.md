# JSX Usage

## TOC

- [Introduction](#introduction)
- [Syntax](#syntax)
- [Transpile](#transpile)

## Introduction

JSX is an extension to JavaScript which enables you to use XML-like syntax sugar in JavaScript. For example:

```jsx
const heading = <h1>This is JSX.</h1>;
```

It is usually nice to write UIs in JSX. However, it is not necessary. In fact, all the JSX code will be converted into normal JavaScript function calls. For instance,

```jsx
const paragraph = <p class="para">JSX</p>;
```

will be transformed into something like this: (assuming the factory function is `HUI`)

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

### Example

1. Self-close:

    ```jsx
    const emptyContainer = <div class="container" />;
    const appWithoutChildren = <App foo="bar" />;
    ```

2. Expressions:

    ```jsx
    const appWithConfig = <App config={{ debug: true }} />;
    const inputWithListener = <input oninput={(event) => {
        handleInput(event);
    }} />;
    ```

3. Custom identifiers:

    ```jsx
    import MyApp from "MyApp";
    const myApp = <MyApp />;
    ```

## Transpile

JSX is just a syntax sugar and it can not be directly run in browsers like plain JavaScript, so you need to transpile your JSX code into plain JavaScript.

(TBC)
