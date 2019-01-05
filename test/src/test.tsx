/// <reference types="../.." />

interface TestContext {
    target: string;
    'greeting-color': string;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

HUI.render(

    <Inspector>

        <HUI.Context key="greeting-color" value="blue" />

        <Greeting>world</Greeting>

        <hr />

        Global Timer:<br />
        <Timer start={100} />

        <hr />

        <ShowTarget />

        <hr />

        <ThrowTest />

        <CatchTest />

        <hr />

        <p>SVG test:</p>

        <svg xmlns={SVG_NS} width="100" height="100" style={{ 'box-shadow': '0 0 10px #999' }}>
            <path
                xmlns={SVG_NS}
                d="M 10 40 C 20 80 80 80 90 40"
                stroke="#f00"
                stroke-width="2"
                fill="none"
            />
        </svg>

        <hr />

        <TestInput />

        <hr />

        <p class={['p', false, 'red']}>{['I should be red!']}</p>

        <hr />

        <HUI.Portal parent={document.getElementById('portal')!}>
            Portal Timer 0:
            <br />
            <Timer />
            <br />
        </HUI.Portal>

        <HUI.Portal>
            Portal Timer 1:
            <br />
            <Timer />
            <br />
        </HUI.Portal>

        <Dialog />

        <hr />

    </Inspector>

);
