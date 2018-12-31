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