import { pushTarget, popTarget } from './dep';
import { noop, isObject, remove } from '../../util'
import { nextTick } from '../../util/next-tick';
import { callUpdatedHooks, callActivatedHooks } from '../instance';


// 解析 watch: { 'obj.obj.xxx': function() {}} 解析其中的键值，获取其在该实例中的实际值
const reg = /[^\w.$]/;

const parsePath = (path) => {
    // path : 'obj.obj.key'
    // 路径对不上里面有不是$.或者字母数字及下划线的
    if (reg.test(path)) {
        return
    }
    var segments = path.split('.');
    return function (obj) {
        for (let i = 0, len = segments.length; i < len; i++) {
            if (!obj) {
                return;
            }
            obj = obj[segments[i]];
        }
        // 这里的目的是为了返回 obj.obj.key所对应的值  （一个被监听过的值）
        return obj;
    }
}

// 递归的将该对象全部监听
const set = new Set();

const traverse = (val) => {
    _traverse(val, set);
    set.clear();
}

const _traverse = (val, set) => {
    let i, keys;
    const isArray = Array.isArray(val);
    if ((!isArray && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
        return
    }

    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
        if (set.has(depId)) {
            return
        }
        set.add(depId);
    }

    if (isArray) {
        i = val.length;
        while (i--) {
            _traverse(val[i], set);
        }
    } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) {
            _traverse(val[keys[i]], set);
        }
    }
}

const MAX_UPDATE_COUNT = 100; // 最大循环数，100，超过这个循环数就报错
const queue = []; // 监查者队列
const activatedChildren = []; // 激活的子组件
const has = {}; // 已经使用的监查者
const circular = {}; // 用于检查循环引用的  这里我没用  不是必要的
let waiting = false; // 观察者更新数据的等待标记
let flushing = false; // 进入 flushSchedulerQueue 函数等待标志
let index = 0; // queue 观察者队列的索引


// 重置调度程序状态
const resetSchedulerState = () => {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    circular = {};
    waiting = flushing = false;
}

// 刷新队列并运行监视监视程序
const flushSchedulerQueue = () => {
    flushing = true;
    let watcher, id;
    /*
        刷新前对队列排序，这是因为：
        1. 确保组件从父组件更新到子组件。因为父组件总是在子组件之前创建
        2. 组件的用户使用的观察者在其渲染观察者之前运行。因为用户使用的观察者会在渲染观察者之前运行
        3. 如果一个组件在父组件的监视程序运行期间被销毁，可以跳过该组件的观察者
    */
    queue.sort((a, b) => a.id - b.id);
    // 这里就不能缓存长度了，因为这个queue数组是在不断变换的，有可能会有更多的观察者
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }

    const activatedQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();

    resetSchedulerState();

    // 调用组件的激活和更新钩子
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);
}

// 加入观察者队列
const queueWatcher = (watcher) => {
    const id = watcher.id;
    if (has[id] === null) {
        has[id] = true;
        if (!flushing) {
            queueWatcher.push(watcher);
        } else {
            let i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }
        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue);
        }
    }
}

let uid = 0;

class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        this.vm = vm;
        if (isRenderWatcher) {
            vm._watcher = this;
        }
        vm._watchers.push(this);
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = ++uid;
        this.active = true;
        this.dirty = this.lazy;
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.expression = expOrFn.toString();
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            if (reg.test(path)) {
                return
            }
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }
    get() {
        pushTarget(this);
        let value;
        const vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        } catch {

        } finally {
            if (this.deep) {
                traverse(value);
            }
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }
    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }
    cleanupDeps() {
        const self = this;
        let i = this.deps.length;
        while (i--) {
            let dep = self.deps[i];
            if (!self.newDepIds.has(dep.id)) {
                dep.removeSub(self);
            }
        }
        [self.depIds, self.newDepIds] = [self.newDepIds, self.depIds];
        self.newDepIds.clear();
        [self.deps, self.newDeps] = [self.newDeps, self.deps];
        self.newDeps.length = 0;
    }
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else if (this.sync) {
            this.run();
        } else {
            queueWatcher(this);
        }
    }
    run() {
        if  (this.active) {
            const value = this.get();
            if (value !== this.value || isObject(value) || this.deep) {
                const oldValue = this.value;
                this.value = value;
                this.cb.call(this.vm, value, oldValue);
            }
        }
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }
    teardown() {
        if (this.active) {
            if (!this.vm._isBeginDestroyed) {
                remove(this.vm._watchers, this);
            }
            let i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    }
}

export default Watcher;
