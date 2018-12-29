/// <reference path="../index.d.ts" />

let root;

const summarize = obj =>
    obj && typeof obj === 'object' &&
    (Array.isArray(obj) ? obj.map(summarize) : obj);

HUI.define('Inspector', {
    render(props) {
        HUI.defer((children) => {
            root = summarize(children);
        }, props.children);
        return props.children;
    },
    catch(err) {
        console.error(err);
        debugger;
    }
});

HUI.define('Timer', {
    state: ['time'],
    init(props, store) {
        store.set('time', props.start || 0);
        store.set('timer', setInterval(() => {
            store.inc('time');
        }, 1000));
    },
    render(props, store) {
        return [
            HUI('p', {}, ['Time: ', store.get('time')])
        ];
    },
    clear(props, store) {
        clearInterval(store.get('timer'));
    }
});

HUI.define(Symbol.for('ShowTarget'), {
    context: ['target'],
    render(props, store, context) {
        return HUI('p', null, [
            'context.target: ',
            `"${context.get('target')}"`
        ]);
    }
});

HUI.define('RefTest', {
    state: ['msg'],
    init(props, store) {
        store.set('msg', 'Fail to set the content!');
    },
    render(props, store) {
        HUI.defer(function (s) {
            s.set('msg', 'Reference test passed.');
        }, store);
        return HUI('p', { ref: store.setter('ref') },
            HUI('span', {}, store.get('msg'))
        );
    }
});

HUI.define('Greeting', {
    context: ['target'],
    init(props, store, context) {
        context.set('target', props.children);
    },
    render(props, store, context) {
        return [
            HUI('h1', {}, [
                'Hello,',
                HUI('span', { style: `color: ${context.get('greeting-color')}; ` }, [context.get('target')]),
                '!'
            ]),
            HUI('button', {
                onclick() {
                    const newTarget = prompt('New target:', store.get('target'));
                    if (newTarget) {
                        context.set('target', newTarget);
                    }
                }
            }, 'Change target'),
            HUI('br'),
            HUI('br'),
            'This is hyper-ui.',
            HUI('RefTest'),
            HUI('Timer')
        ];
    }
});

HUI.define('ThrowTest', {
    state: ['msg'],
    render(props, store) {
        const msg = store.get('msg');
        if (msg) {
            throw msg;
        } else {
            return HUI('div', 0,
                HUI('button', {
                    onclick() {
                        store.set('msg', prompt('Say sth.'));
                    }
                }, 'throw sth.')
            );
        }
    },
    catch(err) {
        return HUI('p', false, [
            'I caught you: ',
            err
        ]);
    }
});

HUI.define('Thrower', {
    render(props) {
        throw props.msg;
    }
});

HUI.define('CatchTest', {
    render() {
        return HUI('p', { title: '?!' }, [
            'Catch test: pending...',
            HUI('Thrower', { msg: 'Error4Test' })
        ]);
    },
    catch(err) {
        return HUI('p', false, [
            'Caught: ',
            err
        ]);
    }
});

HUI.define('AutofocusedInput', {
    render(props, store) {
        HUI.defer(() => {
            store.get('input').focus();
        });
        return HUI('input', { ref: store.setter('input'), attr: { value: 'An auto-focused input.' } });
    }
});

HUI.define('Dialog', {
    state: ['on'],
    init(props, store) {
        store.set('on', true);
    },
    render(props, store) {
        return [
            HUI('button', { onclick() { store.toggle('on'); } }, ['Toggle dialog']),
            store.get('on') && HUI(HUI.Portal, {}, [
                HUI('p', { attr: { style: 'color: blue;' } }, '[Dialog window]')
            ])
        ];
    }
});

const SVG_NS = 'http://www.w3.org/2000/svg';

HUI.render(
    HUI('Inspector', {},
        HUI(HUI.Context, { key: 'greeting-color', value: 'blue' }),
        HUI('Greeting', {}, 'world'),
        HUI('hr'),
        'Global Timer:',
        HUI('br'),
        HUI('Timer', { start: 100 }),
        HUI('hr'),
        HUI(Symbol.for('ShowTarget')),
        HUI('hr'),
        HUI('ThrowTest'),
        HUI('CatchTest'),
        HUI('hr'),
        HUI('svg', { xmlns: SVG_NS, width: 100, height: 100, style: { 'box-shadow': '0 0 10px #999' } }, [
            HUI('path', {
                xmlns: SVG_NS,
                d: 'M 10 40 C 20 80 80 80 90 40',
                stroke: '#f00',
                'stroke-width': 2,
                fill: 'none'
            })
        ]),
        HUI('hr'),
        HUI('AutofocusedInput'),
        HUI('hr'),
        HUI('p', { class: ['p', false, 'red'] }, ['I should be red!']),
        HUI('hr'),
        HUI(HUI.Portal, null, [
            'Portal Timer 0:',
            HUI('Timer')
        ]),
        HUI(HUI.Portal, { node: document.getElementById('portal') }, [
            'Portal Timer 1:',
            HUI('Timer')
        ]),
        HUI('Dialog'),
        HUI('hr')
    )
);
