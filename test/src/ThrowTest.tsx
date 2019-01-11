interface ThrowTestStore {
    msg: string;
}

const ThrowTest = HUI.define<{}, ThrowTestStore, {}>('ThrowTest', {

    state: ['msg'],

    render(props, store) {
        const msg = store.get('msg');
        if (msg) {
            throw msg;
        } else {
            return (
                <div>
                    <button onclick={() => {
                        const msg = prompt('Say sth.');
                        store.set('msg', msg ? `"${msg}"` : '(undefined)');
                    }}>throw sth.</button>
                </div>
            );
        }
    },

    catch(err) {
        return (
            <div>
                <p>I caught you: {err}</p>
            </div>
        );
    }

});
