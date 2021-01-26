class Component {

    constructor(tagName, attrs, children) {
        this.tagName = tagName;
        this.attrs = attrs;
        this.lastRender = null;
        this.children = children;
        this.id = this.getUuid();
    }

    // Good-enough-for-now GUID generator
    getUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    setUpdater(updater) {
        this.updater = updater;
    }

    update() {
        this.updater();
    }

    saveLastRender(lastRender) {
        this.lastRender = lastRender;
    }

    render() {
        return this.children;
    }

}

class SampleComponent extends Component {

    constructor(tagName, attrs, children) {
        super(tagName, attrs, children);

        this.text = "Hello world";

        setTimeout(() => {
            this.setSecondText();
        }, 500);
    }

    setSecondText() {
        this.text = "Hello everybody";
        this.update();
    }

    render() {
        return [
            new Component("button", { className: "text1" }, this.text)
        ]
    }
}

class Element {
    
    constructor(tag, attrs) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = [];
        this.text = "";
    }

    appendChild(child) {
        this.children.push(child);
    }

    setText(text) {
        this.text = text;
    }

}

class Vdom {

    constructor(workerUpdateFunction) {

        this.componentTree = null;
        this.prevComponentTree = null;
        this.workerUpdateFunction = workerUpdateFunction;

    }

    render(mainComponent) {
        this.componentTree = mainComponent;
        this.componentTree.setUpdater(() => { this.update() });
        this.update();
    }

    update() {
        this.prevComponentTree == this.componentTree;
        var el = this.updateComponent(this.componentTree);
        this.workerUpdateFunction(el);
    }

    objectsAreEqual(a, b) {
        if (Object.getOwnPropertyNames(a).length !== Object.getOwnPropertyNames(b).length) return false
        for (var prop in a) {
            if (a.hasOwnProperty(prop)) {
                if (b.hasOwnProperty(prop)) {
                    if (typeof a[prop] === 'object') {
                        if (!objectsAreEqual(a[prop], b[prop])) return false;
                    } else {
                        if (a[prop] !== b[prop]) return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    updateComponent(component) {
        var el = new Element(component.tagName, component.attrs);
        var r = component.render();
        if (r != undefined && typeof(r) == "object") {
            for (var i = 0; i < r.length; i++) {
                var c = r[i];
                el.appendChild(this.updateComponent(c));
            }
        }
        else if (r != undefined && typeof(r) == "string") {
            el.setText(r);
        }
        return el;
    }

}

class CerberusWorker {

    constructor() {
        this.vdom = new Vdom((elementTree) => { this.updateDom(elementTree) });
    }

    initialize(mainComponent) {
        this.vdom.render(mainComponent);
    }

    updateDom(elementTree) {
        postMessage({ elementTree });
    }

}

var cerberusWorker = new CerberusWorker();

cerberusWorker.initialize(new SampleComponent("div", { className: "class1" }));

