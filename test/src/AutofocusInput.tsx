interface AutofocusedInputStore {
    input?: HTMLElement;
}

const AutofocusedInput = HUI.define<{}, AutofocusedInputStore, {}>('AutofocusedInput', {
    render(props, store) {
        HUI.defer(() => {
            store.get('input')!.focus();
        });
        return <input ref={store.setter('input')} attr={{ value: 'An auto-focused input.' }} />;
    }
});
