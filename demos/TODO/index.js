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