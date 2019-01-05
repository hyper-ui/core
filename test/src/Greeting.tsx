interface GreetingProps {
    children: string;
}

const Greeting = HUI.define<GreetingProps, {}, TestContext>('Greeting', {
    context: ['target'],
    init(props, store, context) {
        context.set('target', props.children);
    },
    render(props, store, context) {
        return (
            <HUI.Fragment>

                <h1>
                    Hello,
                <span style={`color: ${context.get('greeting-color')}`}>{context.get('target')}!</span>
                </h1>

                <button onclick={() => {
                    const newTarget = prompt('New target:', context.get('target'));
                    if (newTarget) {
                        context.set('target', newTarget);
                    }
                }}>Change target</button>

                <br />
                <br />

                This is hyper-ui.

                <RefTest />

                Timer in Greeting:
                <br />
                <Timer />
                <br />

            </HUI.Fragment>
        );
    }
});

const ShowTarget = HUI.define<{}, {}, TestContext>('ShowTarget', {
    context: ['target'],
    render(props, store, context) {
        return <p>context.target: {context.get('target')}</p>;
    }
});

interface RefTestStore {
    msg: string;
    ref?: HTMLElement;
}

const RefTest = HUI.define<{}, RefTestStore, {}>('RefTest', {

    state: ['msg'],

    init(props, store) {
        store.set('msg', 'Fail to set the content!');
    },

    render(props, store) {

        HUI.defer(function (s) {
            s.get('ref')!.innerHTML = 'Reference test passed.';
        }, store);

        return (
            <p ref={store.setter('ref')}>
                <span>{store.get('msg')}</span>
            </p>
        );

    }

});
