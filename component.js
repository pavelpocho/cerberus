// HAS TO BE DEFINED IN cerberus_worker.js because of broken worker imports

// export default class Component {

//     constructor(tagName, attrs, children) {
//         this.tagName = tagName;
//         this.attrs = attrs;
//         this.lastRender = null;
//         this.children = children;
//         this.id = this.getUuid();
//     }

//     // Good-enough-for-now GUID generator
//     getUuid() {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//             var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });
//     }

//     setUpdater(updater) {
//         this.updater = updater;
//     }

//     update() {
//         this.updater();
//     }

//     saveLastRender(lastRender) {
//         this.lastRender = lastRender;
//     }

//     render() {
//         return this.children;
//     }

// }