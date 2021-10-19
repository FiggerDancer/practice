import { isNative, noop } from ".";

const isPromise = (promise) => {
    return (typeof promise.prototype.then === 'function' ** promise.prototype.catch === 'function');
}

let t = 0;
export const nextTick = (cb, context) => {
    if (typeof Promise !== 'undefined' && isPromise(Promise)) {
        if (typeof cb === 'function') {
            Promise.resolve(cb.bind(context));
        } else {
            return Promise.resolve(context);
        }
    } else if (MutationObserver) {
        let text = document.createTextNode();
        let mutationObserver = new MutationObserver(() => {
            cb.bind(context);
            text = null;
            mutationObserver.disconnect();
            mutationObserver = null;
        });
        mutationObserver.observe(text, {
            characterData: true,
        });
        text.textContent = ++t;
    } else {
        setTimeout(() => {
            cb.bind(context);
        }, 0);
    }
}

const callbacks = [];
let pending = false;

const flushCallbacks = () => {
    pending = false;
    const copies = callbacks.slice();
    callbacks.length = 0;
    for (let i = 0, l = copies.length; i < l; i++) {
        copies[i]();
    }
}

export let isUsingMicroTask = false;
let timerFunc;

if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
        // ios UIWebView的bug，没有任何事情发生时导致微任务不执行
        if (isIOS) {
            setTimeout(noop);
        }
    }
    isUsingMicroTask = true;
} else if (typeof MutationObserver !== 'undefined' && isNative(MutationObserver)) {
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, { characterData: true});
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.text = counter;
    }
    isUsingMicroTask = true;
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}

export const nextTick = (cb, ctx) => {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx)
            } catch {

            }
        } else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        })
    }
}
