"use strict";
const AutofocusedInput = HUI.define('AutofocusedInput', {
    render(props, store) {
        HUI.defer(() => {
            store.get('input').focus();
        });
        return HUI("input", { ref: store.setter('input'), attr: { value: 'An auto-focused input.' } });
    }
});
const Thrower = HUI.define('Thrower', {
    render(props) {
        throw props.msg;
    }
});
const CatchTest = HUI.define('CatchTest', {
    render() {
        return (HUI("p", { title: "?!" },
            "'Catch test: pending...'",
            HUI(Thrower, { msg: "Error4Test" })));
    },
    catch(err) {
        return HUI("p", null,
            "Caught: ",
            String(err));
    }
});
const Dialog = HUI.define('Dialog', {
    state: ['on'],
    init(props, store) {
        store.set('on', true);
    },
    render(props, store) {
        return (HUI(HUI.Fragment, null,
            HUI("button", { onclick: () => { store.toggle('on'); } }, "Toggle dialog"),
            store.get('on') &&
                HUI(HUI.Portal, null,
                    HUI("p", { attr: { style: 'color: blue;' } }, "[Dialog window]"))));
    }
});
const Greeting = HUI.define('Greeting', {
    context: ['target'],
    init(props, store, context) {
        context.set('target', props.children);
    },
    render(props, store, context) {
        return (HUI(HUI.Fragment, null,
            HUI("h1", null,
                "Hello,",
                HUI("span", { style: `color: ${context.get('greeting-color')}` },
                    context.get('target'),
                    "!")),
            HUI("button", { onclick: () => {
                    const newTarget = prompt('New target:', context.get('target'));
                    if (newTarget) {
                        context.set('target', newTarget);
                    }
                } }, "Change target"),
            HUI("br", null),
            HUI("br", null),
            "This is hyper-ui.",
            HUI(RefTest, null),
            HUI(ShowTime, null),
            HUI("br", null)));
    }
});
const ShowTarget = HUI.define('ShowTarget', {
    context: ['target'],
    render(props, store, context) {
        return HUI("p", null,
            "context.target: ",
            context.get('target'));
    }
});
const RefTest = HUI.define('RefTest', {
    state: ['msg'],
    init(props, store) {
        store.set('msg', 'Fail to set the content!');
    },
    render(props, store) {
        HUI.defer(function (s) {
            s.get('ref').innerHTML = 'Reference test passed.';
        }, store);
        return (HUI("p", { ref: store.setter('ref') },
            HUI("span", null, store.get('msg'))));
    }
});
let root;
const summarize = (obj) => obj && typeof obj === 'object' &&
    (Array.isArray(obj) ? obj.map(summarize) : obj);
const Inspector = HUI.define('Inspector', {
    render(props) {
        HUI.defer(() => {
            root = summarize(this);
        });
        return props.children;
    },
    catch(err) {
        console.error(err);
        debugger;
    }
});
const ThrowTest = HUI.define('ThrowTest', {
    state: ['msg'],
    render(props, store) {
        const msg = store.get('msg');
        if (msg) {
            throw msg;
        }
        else {
            return (HUI("div", null,
                HUI("button", { onclick: () => {
                        store.set('msg', prompt('Say sth.') || '(undefined)');
                    } }, "throw sth.")));
        }
    },
    catch(err) {
        return HUI("p", null,
            "I caught you: '",
            err);
    }
});
const ShowTime = HUI.define('ShowTime', {
    state: ['time'],
    init(props, store) {
        store.set('time', props.start || 0);
        store.set('timer', setInterval(() => {
            store.inc('time');
        }, 1000));
    },
    render(props, store) {
        return (HUI(HUI.Fragment, null,
            "Time: ",
            HUI("span", null, store.get('time'))));
    },
    clear(props, store) {
        clearInterval(store.get('timer'));
    }
});
/// <reference types=".." />
const SVG_NS = 'http://www.w3.org/2000/svg';
HUI.render(HUI(Inspector, null,
    HUI(HUI.Context, { key: "greeting-color", value: "blue" }),
    HUI(Greeting, null, "world"),
    HUI("hr", null),
    "Global Timer:",
    HUI("br", null),
    HUI(ShowTime, { start: 100 }),
    HUI("hr", null),
    HUI(ShowTarget, null),
    HUI("hr", null),
    HUI(ThrowTest, null),
    HUI(CatchTest, null),
    HUI("hr", null),
    HUI("p", null, "SVG test:"),
    HUI("svg", { xmlns: SVG_NS, width: "100", height: "100", style: { 'box-shadow': '0 0 10px #999' } },
        HUI("path", { xmlns: SVG_NS, d: "M 10 40 C 20 80 80 80 90 40", stroke: "#f00", "stroke-width": "2", fill: "none" })),
    HUI("hr", null),
    HUI(AutofocusedInput, null),
    HUI("hr", null),
    HUI("p", { class: ['p', false, 'red'] }, ['I should be red!']),
    HUI("hr", null),
    HUI(HUI.Portal, { parent: document.getElementById('portal') },
        "Portal Timer 0:",
        HUI("br", null),
        HUI(ShowTime, null),
        HUI("br", null)),
    HUI(HUI.Portal, null,
        "Portal Timer 1:",
        HUI("br", null),
        HUI(ShowTime, null),
        HUI("br", null)),
    HUI(Dialog, null),
    HUI("hr", null)));
