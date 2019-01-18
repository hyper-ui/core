interface DialogStore {
    on: boolean;
}

type DialogStoreHandlers = {
    toggle: () => void;
}

const Dialog = HUI.define<{}, DialogStore, {}, DialogStoreHandlers>('Dialog', {

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
                {store.get('on') && (
                    <HUI.Portal>
                        <p attr={{ style: 'color: blue;' }}>[Dialog window]</p>
                    </HUI.Portal>
                )}
            </HUI.Fragment>
        );
    }

});
