// define the editor
const Editor = HUI.define('Editor', {
    // renderer
    render(props, store, context) {
        // render a form with an input and a submit button
        return HUI('form',
            {
                // handle `submit` event
                onsubmit(event) {
                    // prevent default action
                    event.preventDefault();
                    // get the input and its value
                    const input = store.get('input'),
                        content = input.value;
                    // handle submission
                    if (content) {
                        // add the item
                        context.push('items', content);
                        // clear the input
                        input.value = '';
                    } else {
                        // hint the user to type something
                        input.focus();
                    }
                }
            }, [
                // the input
                HUI('input', {
                    ref: store.setter('input'),
                    placeholder: props.placeholder
                }),
                // the submit button
                HUI('button', { attr: { type: 'submit' } }, 'Add')
            ]
        );
    }
});
// define the item list
const ItemList = HUI.define('ItemList', {
    // required context
    context: ['items'],
    // renderer
    render(props, store, context) {
        // render an unordered item list
        return HUI('ul', null, context.get('items').map((content, index) => (
            // a list item
            HUI('li', null, [
                // content
                HUI('span', { style: { marginRight: '1em' } }, content),
                // delete link
                HUI('a', {
                    href: 'javascript:;',
                    // handle `click` event
                    onclick(event) {
                        // delete the item
                        context.splice('items', index, 1);
                    }
                }, 'Delete')
            ])
        )));
    }
});
// define the app
const TODOApp = HUI.define('TODOApp', {
    // renderer
    render() {
        return [
            // heading
            HUI('h1', null, 'TODO'),
            // editor
            HUI(Editor, { placeholder: 'content' }),
            // item list
            HUI(ItemList)
        ];
    }
});
// render the app
HUI.render(
    HUI(TODOApp),
    { defaultContext: { items: [] } }
);
