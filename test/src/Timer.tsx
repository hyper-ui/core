interface TimerProps {
    start?: number;
}

type TimerStore = HUI.Store<{
    time: number;
}, {
    setInterval: (interval: number) => any;
}>;

const Timer = HUI.define<TimerProps, TimerStore, HUI.EmptyStore>('Timer', {

    state: ['time'],

    defaultProps: {
        start: 0
    },

    effects: [
        function (props, store) {
            const timer = store.trigger('setInterval', 1000);
            return () => {
                clearInterval(timer);
            };
        }
    ],

    storeHandlers: {
        setInterval(interval) {
            const timer = setInterval(this.inc, interval, 'time');
            return timer;
        }
    },

    init(props, store) {
        store.set('time', props.start!);
    },

    render(props, store) {
        return (
            <HUI.Fragment>
                Time: <span>{store.get('time')}</span>
            </HUI.Fragment>
        );
    }

});