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