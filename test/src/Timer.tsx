interface TimerProps {
    start?: number;
}

interface TimerStore {
    time: number;
    timer: any;
}

type TimerStoreHandlers = {
    setInterval: (interval: number) => any;
}

const Timer = HUI.define<TimerProps, TimerStore, {}, TimerStoreHandlers>('Timer', {

    state: ['time'],

    defaultProps: {
        start: 0
    },

    storeHandlers: {
        setInterval(interval) {
            const timer = setInterval(this.inc, interval, 'time');
            this.set('timer', timer);
            return timer;
        }
    },

    init(props, store) {
        store.set('time', props.start);
        store.set('timer', store.trigger('setInterval', 1000));
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