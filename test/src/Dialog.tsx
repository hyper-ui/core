interface DialogStore {
    on: boolean;
}

interface DialogStoreHandlers {
    toggle: () => void;
}

const Dialog = HUI.define<{}, HUI.Store<DialogStore, DialogStoreHandlers>, HUI.EmptyStore>('Dialog', {

    state: ['on'],

    defaultStore: {
        on: true
    },

    storeHandlers: {
        toggle() {
            this.toggle('on');
        }
    },

    render(props, store) {
        return (
            <HUI.Fragment>
                <button onclick={store.getHandler('toggle')}>Toggle dialog</button>
                {store.get('on') && [
                    <p>(Dialog window is shown.)</p>,
                    <HUI.Portal>
                        {undefined}
                        <p attr={{ style: 'color: blue;' }}>[Dialog window]</p>
                        {null}
                        {Object}
                    </HUI.Portal>
                ]}
            </HUI.Fragment>
        );
    }

});
