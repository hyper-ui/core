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
