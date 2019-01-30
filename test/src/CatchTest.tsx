interface ThrowerProps {
    msg: string;
}

const Thrower = HUI.define<ThrowerProps, HUI.Store<{}>, HUI.Store<{}>>('Thrower', {
    render(props) {
        throw props.msg;
    }
});

const CatchTest = HUI.define<{}, HUI.Store<{}>, HUI.Store<{}>>('CatchTest', {

    render() {
        return (
            <p title="?!">
                'Catch test: pending...'
                <Thrower msg="Error4Test" />
            </p>
        );
    },

    catch(err) {
        return <p>Caught: {String(err)}</p>;
    }

});
