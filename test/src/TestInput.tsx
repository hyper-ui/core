interface TestInputProps {
    children: string;
}

interface TestInputStore {
    input?: HTMLInputElement;
    value: string;
}

const TestInput = HUI.define<TestInputProps, HUI.Store<TestInputStore>, HUI.EmptyStore>('TestInput', {

    state: ['value'],

    init(props, store) {
        store.set('value', props.children[0]);
    },

    render(props, store) {
        HUI.defer(() => {
            store.get('input')!.focus();
        });
        return (
            <HUI.Fragment>
                <input
                    ref={store.setter('input')}
                    prop={{ value: props.children[0] }}
                    oninput={() => {
                        store.set('value', store.get('input')!.value);
                    }}
                />
                <p>{store.get('value')}</p>
            </HUI.Fragment>
        );
    }

});
