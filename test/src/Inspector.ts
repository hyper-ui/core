let root;

const summarize = (obj: unknown): any =>
    obj && typeof obj === 'object' &&
    (Array.isArray(obj) ? obj.map(summarize) : obj);

interface InspectorProps {
    children: unknown[];
}

const Inspector = HUI.define<InspectorProps, {}, {}>('Inspector', {

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
