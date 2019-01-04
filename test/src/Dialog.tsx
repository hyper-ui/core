interface DialogStore {
    on: boolean;
}

const Dialog = HUI.define<{}, DialogStore, {}>('Dialog', {

    state: ['on'],

    init(props, store) {
        store.set('on', true);
    },

    render(props, store) {
        return (
            <HUI.Fragment>
                <button onclick={() => { store.toggle('on'); }}>Toggle dialog</button>
                {store.get('on') &&
                    <HUI.Portal>
                        <p attr={{ style: 'color: blue;' }}>[Dialog window]</p>
                    </HUI.Portal>}
            </HUI.Fragment>
        );
    }

});
