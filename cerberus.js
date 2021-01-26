export default class Cerberus {

    constructor(parentElement) {
        this.worker = new Worker("./cerberus_worker.js");
        this.parentElement = parentElement;

        this.worker.onmessage = (e) => {
            if ('elementTree' in e.data) {
                this.updateDom(e.data.elementTree);
            }
        }
    }

    updateDom(elementTree) {
        this.parentElement.innerHTML = "";
        this.parentElement.appendChild(this.updateElement(elementTree));
    }

    updateElement(element) {
        var htmlel = document.createElement(element.tag);
        let attrs = element.attrs;
        for (var attr in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
                htmlel.setAttribute(attr == "className" ? "class" : attr, attrs[attr]);
            }
        }
        var r = element.children;
        if (r != undefined && typeof(r) == "object") {
            for (var i = 0; i < r.length; i++) {
                var c = r[i];
                htmlel.appendChild(this.updateElement(c));
            }
        }
        var t = element.text;
        if (t != undefined && typeof(t) == "string") {
            htmlel.innerHTML += t;
        }
        return htmlel;
    }

}