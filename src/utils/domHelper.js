export default {
    events: {
        // ref by https://github.com/react-bootstrap/dom-helpers/blob/master/src/events/on.js
        addEventListener (node, event, handler, capture=false) {
            node.addEventListener(event, handler, capture);

            return {
                remove() {
                    node.removeEventListener(event, handler, capture);
                }
            };
        }
    },
    query: {
        // ref by https://github.com/react-bootstrap/dom-helpers/blob/master/src/query/contains.js
        contains(context, node) {
            return context.contains(node);
        }
    }
}
