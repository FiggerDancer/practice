import Dep from './dep';
import { def, isObject, isPlainObject } from '../../util';

// 禁止添加观察者模式
let shouldObserve = true;
export const toggleObserving = (value) => {
    shouldObserve = value;
}

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const arrayKeys = Reflect.getOwnPropertyNames(arrayMethods);

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

methodsToPatch.forEach((method) => {
    const original = arrayProto[method];
    def(arrayMethods, methods, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) {
            // 观察新加入的数据
            ob.observeArray(inserted);
        }
        ob.dep.notify();
        return result;
    })
})

// IE
const protoAugment = (target, src, keys) => {
    target.__proto__ = src;
}

// 用于扩展数组方法以便监听数组方法push等
const copyAugment = (target, src, keys) => {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        def(target, key, src[key]);
    }
}

// 对象响应式处理
const defineReactive = (
    obj,
    key,
    val,
    customSetter,
    shallow, // 是否只进行浅监听
) => {
    const dep = new Dep();
    const property = Reflect.getOwnPropertyDescriptor(obj, key);
    // 不可编辑
    if (property && property.configurable === false) {
        return;
    }
    const getter = property && property.get;
    if (!getter && arguments.length === 2) {
        val = obj[key];
    }
    const setter = property && property.set;
    // 子监视器
    const childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();
                if (childOb) { // 其实这里还是蛮好奇为啥要给子节点增加这个依赖的，因为子节点是不是可以通过子节点的observe时去增加这个dep监视器的
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            if (newVal === value) {
                return;
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            childOb = !shallow && observe(newVal);
            // 去通知更新
            dep.notify();
        }
    })
}

const dependArray = (value) => {
    for (let e = (void 0), i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}

const observe = (value, asRootData) => {
    if (!isObject(value) || value instanceof VNode) {
        return;
    }
    let ob;
    if (
        hasOwn(value, '__ob__') && 
        value.__ob__ instanceof Observer
    ) { // 如果对象已经被监听过就没必要再监听一遍了
        ob = value.__ob__;
    } else if (
        shouldObserve &&
        (Array.isArray(value)) || isPlainObject(value) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) { // 可扩展对象或者数组则进行监听
        ob = new Observer(value);
    }
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob;
}


class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        def(this.value, '__ob__', this);
        if (Array.isArray(value)) {
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    }
}



export default Watcher;
