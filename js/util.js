function waitForElm(selector) {
    return new Promise(resolve => {
        elements = $(selector)
        if (elements.length) {
            return resolve(elements);
        }

        (new MutationObserver((mutations, observer) => {
            elements = $(selector)
            if (elements.length) {
                observer.disconnect();
                return resolve(elements);
            }
        })).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

/**
 * @param {string} selector
 * @param {function} callback
 * @returns {void}
 * @description
 * 1. Observe the first node matched by selector.
 * 2. When a child node is added to the observed node, callback is called with the added node as argument.
 * 3. The callback is called immediately if there are already child nodes.
 * This util funtion use callback style, not promise. Because callback should be called several times.
 */
function onChildListAdded(selector, callback) {
    node = $(selector)
    if (node.length == 0) {
        console.warn("jQuery object is empty, please make sure selected nodes exist.")
        return
    }

    if (node.length > 1) {
        console.warn("Several nodes are matched, but only the first one is observed.")
    }

    callback(node.children())
    
    list = node[0]
        
    new MutationObserver(mutations => {
        addedNodes = mutations.map(a => Array.from(a.addedNodes)).flat()
        if(addedNodes.length == 0) return
        callback($(addedNodes))
    }).observe(list, {
        childList: true,
        subtree: false
    });   
}

function onElementRemoved(selector) {
    return new Promise((resolve, reject) => {
        node_to_remove = $(selector)
        if (node_to_remove.length == 0) {
            reject("jQuery object is empty, please make sure selected nodes exist.")
            return
        }

        if (node_to_remove.length > 1) {
            console.warn("Several nodes are matched, but only the first one is observed.")
        }
        
        _node_to_remove = node_to_remove[0]
        parent = node_to_remove.parent()
        _parent = parent[0]
            
        new MutationObserver((mutations, observer) => {
            let removed = false
            mutations.map(a => Array.from(a.removedNodes)).flat().forEach(node => {
                if (node === _node_to_remove) removed = true
            })
            if (!removed) {
                return
            }
            observer.disconnect();
            resolve(parent)
        }).observe(_parent, {
            childList: true,
            subtree: false
        });
    })
}