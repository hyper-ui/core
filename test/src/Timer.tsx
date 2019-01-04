interface TimerProps {
    start?: number;
}

interface TimerStore {
    time: number;
    timer: any;
}

const ShowTime = HUI.define<TimerProps, TimerStore, {}>('ShowTime', {

    state: ['time'],

    init(props, store) {
        store.set('time', props.start || 0);
        store.set('timer', setInterval(() => {
            store.inc('time');
        }, 1000));
    },

    render(props, store) {
        return (
            <HUI.Fragment>
                Time: <span>{store.get('time')}</span>
            </HUI.Fragment>
        );
    },

    clear(props, store) {
        clearInterval(store.get('timer'));
    }

});