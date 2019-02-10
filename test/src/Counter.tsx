interface CounterStore {
    value: number;
}

const Counter = HUI.define<{}, HUI.Store<CounterStore, {}>, HUI.EmptyStore>('Counter', {

    state: ['value'],

    defaultStore: {
        value: 0
    },

    render(props, store) {
        return (
            <HUI.Fragment>
                <button onclick={() => store.inc('value')}>Click me!</button>
                <p>Count: {store.get('value')}</p>
            </HUI.Fragment>
        );
    }

});
