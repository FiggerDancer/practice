import { isUndef } from "../../util";

let target;

const add = (event, fn, once) => {
    if (once) {
        target.$once(event, fn);
    } else {
        target.$on(event, fn);
    }
}

const remove = (event, fn) => {
    target.$off(event, fn);
}

export const updateComponentListeners = (vm, listeners, oldListeners) => {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove, vm);
    target = undefined;
}

// 创建一个调用程序
const createFnInvoker = (fns) => {
    const invoker = (...rest) => {
        const _fns = invoker.fns;
        if (Array.isArray(_fns)) {
            const cloned = _fns.slice();
            for (let i = 0, l = cloned.length; i < l; i++) {
                cloned[i].apply(null, rest);
            }
        } else {
            return _fns.apply(null, rest);
        }
    }
    invoker.fns = fns;
    return invoker;
}

// 将event事件的名称与特性分离
const normalizeEvent = cached((name) => {
    const passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    const once = name.charAt(0) === '~';
    name = once ? name.slice(1) : name;
    const capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
        name,
        once,
        capture,
        passive,
    }
});

// 更新事件，添加
const updateListeners = (on, oldOn, add, remove, vm) => {
    let name, cur, old, event;
    for (name in on) {
        cur = on[name];
        old = oldOn[name];
        event = normalizeEvent(name); // 将修饰符与名称分离

        if (isUndef(cur)) {
            // 新的值为空直接跳过
        } else if (isUndef(old)) {
            // 旧的值为空则创建新的值并增加监听事件
            if (isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur);
            }

            name = `&${name}`;
            add(
                event.name,
                cur,
                event.once,
                // event.capture,
                // event.passive,
                // event.params,
            );
        } else if (cur !== old) {
            // 这种情况就是单纯替换下会回调的函数
            old.fns = cur;
            on[name] = old;
        }
    }
    // 将新的值中为空值的事件移除
    for (name in oldOn) {
        if (isUndef(on[name])) {
            event = normalizeEvent(name);
            remove(event.name, oldOn[name]);
        }
    }
}
