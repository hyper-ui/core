interface TestInputStore {
    input?: HTMLElement;
    value: string;
}

const TestInput = HUI.define<{}, TestInputStore, {}>('TestInput', {
    render(props, store) {
        HUI.defer(() => {
            store.get('input')!.focus();
        });
        return (
            <HUI.Fragment>
                <input
                    ref={store.setter('input')}
                    value="An auto-focused input."
                    oninput={() => store.set('value', (store.get('input') as HTMLInputElement).value)}
                />
                <p>{store.get('value')}</p>
            </HUI.Fragment>
        );
    }
});
