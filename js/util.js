/**
 * @param {string} selector
 * @param {jQuery} root
 */
function waitForElm(selector, root) {
    return new Promise(resolve => {

        if (root === undefined)
            root = $(document.body)
        
        elements = $(selector, root)
        if (elements.length) {
            return resolve(elements);
        }
                
        (new MutationObserver((mutations, observer) => {
            elements = $(selector, root)
            if (elements.length) {
                observer.disconnect();
                return resolve(elements);
            }
        })).observe(root[0], {
            childList: true,
            subtree: true
        });
    });
}

/**
 * @param {string | jQuery} observee
 * @param {function} callback
 * @returns {void}
 * @description
 * 1. Observe the first node matched by selector.
 * 2. When a child node is added to the observed node, callback is called with the added node as argument.
 * 3. The callback is called immediately if there are already child nodes.
 * This util funtion use callback style, not promise. Because callback should be called several times.
 */
function onChildListAdded(observee, callback) {
    if (typeof observee === 'string')    
        nodes = $(observee)
    else if (observee instanceof jQuery)
        nodes = observee
    else {
        console.error("observee should be a string or jQuery object.")
        return
    }

    if (nodes.length == 0) {
        console.warn("jQuery object is empty, please make sure selected nodes exist.")
        return
    }

    callback(nodes.children())
    for (let _node of nodes.toArray()){
        new MutationObserver(mutations => {
            addedNodes = mutations.map(a => Array.from(a.addedNodes)).flat()
            if(addedNodes.length == 0) return
                callback($(addedNodes))
        }).observe(_node, {
            childList: true,
            subtree: false
        });  
    }    
}

function waitForElmNotExist(selector, root) {
    return new Promise(resolve => {
        if (root === undefined)
            root = $(document.body)
        
        elements = $(selector, root)
        if (elements.length === 0) {
            return resolve();
        }

        (new MutationObserver((mutations, observer) => {
            elements = $(selector, root)
            if (elements.length === 0) {
                observer.disconnect();
                return resolve();
            }
        })).observe(root[0], {
            childList: true,
            subtree: true
        });
    });
}