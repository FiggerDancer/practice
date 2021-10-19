import { pushTarget, popTarget } from '../observe/dep';
import { observe, shouldObserve } from '../observe/observer';
import { isDef, emptyObject, isWhiteSpace, hasOwn, getTypeIndex, hyphenate } from './../../util';
import { updateComponentListeners } from './event';

const createComponentInstanceForVnode = (
    vnode,
    parent, // activeInstance处于生命周期中的activeInstance
    parentElm,
    refElm
) => {
    const options = {
        _isComponent: true, // 是否是组件
        parent,
        _parentVnode: vnode,
        _parentElm: parentElm || null,
        _refElm: refElm || null
    };
    const inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render;
        options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options);
}

const getPropDefaultValue = (vm, prop, key) => {
    if (!hasOwn(prop, 'default')) {
        return undefined;
    }
    const def = prop.default;
    if (
        vm && vm.$options.propsData &&
        vm.$options.propsData[key] === undefined &&
        vm._props[key] !== undefined
    ) {
        // 返回上次的默认值
        return vm._props[key];
    }
    // 返回新的默认值
    return typeof def === 'function' && getTypeIndex(prop.type) === 'Function' ? def.call(vm) : def;
}

const validateProp = (
    key,
    propOptions,
    propsData,
    vm
) => {
    const prop = propOptions[key];
    const absent = !hasOwn(propsData, key);
    let value = propsData[key];
    const booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
        if (absent && !hasOwn(prop, 'default')) {
            value = false;
        } else if (
            value === ''
            || value === hyphenate(key)
        ) {
            const stringIndex = getTypeIndex(String, prop.type);
            if (
                stringIndex < 0 ||
                booleanIndex < stringIndex
            ) {
                value = true;
            }
        }
    }
    if (value === undefined) { // 本来没有值就去获取默认值
        value = getPropDefaultValue(vm, prop, key);
        const prevShouldObserve = shouldObserve;
        toggleObserving(true);
        observe(value);
        toggleObserving(prevShouldObserve);
    }
    return value;
}

// 收集该上下文中插槽的子元素
const resolveSlots = (children, context) => {
    const slots = {};
    if (!children) {
        return slots;
    }
    for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i];
        const data = child.data;
        if (data && data.attrs && data.attrs.slot) {
            delete data.attrs.slot;
        }
        // 相同上下文
        if ((child.context === context || child.fnContext === context) && data && data.slot !== null) {
            const name = data.slot;
            const slot = (slots[name] || (slots[name] = []));
            if (child.tag === 'template') {
                slot.push(...(child.children || []));
            } else {
                slot.push(child);
            }
        } else {
            (slots.default || (slots.default = [])).push(child);
        }
    }
    for (let name in slots) {
        if (slots[name].every(isWhiteSpace)) {
            delete slots[name];
        }
    }
    return slots;
}

const updateChildComponent = (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren,
) => {
    isUpdatingChildComponent = true;
    const hasChildren = !!(
        renderChildren || // 是否有新的子节点
        vm.$options._renderChildren || // 是否有旧子节点
        parentVnode.data.scopedSlots || // 是否有范围插槽
        vm.$scopedSlots !== emptyObject // 是否有旧的范围插槽
    );
    vm.$options._parentVnode = parentNode; // 虚拟dom
    vm.$vnode = parentVnode; // 无需重新渲染即可更新vm的占位符节点
    if (vm._vnode) {
        vm._vnode.parent = parentNode; // 更新子树的父节点
    }
    vm.$options._renderChildren = renderChildren; // 子组件
    // 属性和监听事件也是需要响应性
    vm.$attrs = parentVnode.data.attrs || emptyObject; // 属性
    vm.$listeners = listeners || emptyObject; // 监听事件

    if (propsData && vm.$options.props) {
        toggleObserving(false); // 更新的时候就没有必要再去监听一遍了  之前初始化的时候肯定做过了
        const props = vm._props;  // 获取属性
        const propKeys = vm.$options._propKeys || []; // 获取该vm中所有属性的中的key
        for (let i = 0; i < propKeys.length; i++) { // 循环props属性
            const key = propKeys[i]; // 获取props 单个 属性的key
            const propOptions = vm.$options.props;
            /*
                验证支柱  验证 prosp 是否是规范数据 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
                *  校验 props 参数 就是组建 定义的props 类型数据，校验类型
                *
                * 判断prop.type的类型是不是Boolean或者String，如果不是他们两类型，调用getPropDefaultValue获取默认值并且把value添加到观察者模式中
                */
            props[key] = validateProp(key, propOptions, propsData, vm);
        }
        toggleObserving(true);
        // 保留原始副本
        vm.$options.propsData = propsData;
    }
    listeners = listeners || emptyObject;
    const oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
    // 如果有子节点的话，就强制更新子节点
    if (hasChildren) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context);
        vm.$forceUpdate();
    }
    isUpdatingChildComponent = false;
}

// 触发钩子函数
const callHook = (vm, hook) => {
    // 调用钩子函数时，通过将Dep.target = undefined来禁用dep
    pushTarget();
    const handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0, l = handlers.length; i < l; i++) {
            try {
                // 执行钩子
                handlers[i].call(vm);
            } catch {

            }
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
    }
    popTarget();
}

// 自下往上触发更新的钩子
export const callUpdatedHooks = (queue) => {
    let i = queue.length;
    while (i--) {
        const watcher = queue[i];
        const vm = watcher.vm;
        if (vm._watcher === watcher && vm._isMounted) {
            callHook(vm, 'update');
        }
    }
}

// 只要有祖先节点中有未激活的则该节点就无法使用
const isInInactiveTree = (vm) => {
    while (vm && (vm = vm.$parent)) {
        if (vm._inactive) {
            return true;
        }
    }
    return false;
}

// 激活组件
const activateChildComponent = (vm, direct) => {
    if (direct) {
        vm._directInactive = false; // 使该组件处于活跃状态
        if (isInInactiveTree(vm)) { // 看是否祖先节点是否处于激活态，如果未处于激活态则不需要继续执行了
            return
        }
    } else if (vm._directInactive) { // 如果该组件不活跃，直接pass掉
        return
    }
    // 激活组件并激活未被禁用的组件
    if (vm._inactive || vm._inactive === null) { // 如果该组件被标记非激活态则将其置为激活态标记
        vm._inactive = false;
        for (let i = 0; i < vm.$children.length; i++) {
            activateChildComponent(vm.$children[i]); // 递归执行
        }
        callHook(vm, 'activated');
    }
}

const deactivateChildComponent = (vm, direct) => {
    if (direct) {
        vm._directInactive = true;
        if (isInInactiveTree(vm)) {
            return;
        }
    }
    if (!vm._inactive) { // 若原先组件是活跃的，则需要将其置为不活跃状态，同时触发钩子
        vm._inactive = true;
        for (let i = 0, len = vm.$children.length; i < len; i++) {
            deactivateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'deactivated');
    }
}

const queueActivatedComponent = (vm) => {
    // 设置该属性为false 以便让渲染函数可以
    vm._inactive = false;
    // 用于检查组件是否处于激活态  例如  router-view
    activatedChildren.push(vm);
}

export const callActivatedHooks = (queue) => {
    for (let i = 0; i < queue.length; i++) {
        // 先将组件都设置非激活态标记
        queue[i]._inactive = true;
        // 激活这些组件
        activateChildComponent(queue[i], true);
    }
}


// 组件的钩子
const componentVNodeHooks = {
    init (
        vnode,
        hydrating, // hydrating 是否处于水化过程中
        parentElm, 
        refElm
    ) {
        // 如果这个虚拟节点已经存在且尚未被销毁且是一个keepAlive组件
        if (vnode.componentInstance
            && !vnode.componentInstance._isDestroyed
            && vnode.data.keepAlive
        ) {
            const mountedNode = vnode;
            // 去更新
            componentVNodeHooks.prepatch(mountedNode, mountedNode);
        } else {
            // 调用VueComponent构造函数实例化
            const child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance /* 当前活动的实例 */, parentElm, refElm);
            // 实例方法挂载 vm
            child.$mount(
                hydrating ? vnode.elm : undefined, // 水化中就挂载一个新的dom元素
                hydrating // 是否处于水化中
            )
        }
    },
    prepatch (oldVnode, vnode) {
        const options = vnode.componentOptions; // 组件的参数
        const child = vnode.componentInstance = oldVnode.componentInstance; // 组件实例
        updateChildComponent(
            child,
            options.propsData,
            options.listeners,
            vnode, // ?
            options.children,
        )
    },
    insert(vnode) {
        const { context, componentInstance } = vnode;
        if (!componentInstance._isMounted) {
            componentInstance._isMounted = true;
            callHook(
                componentInstance,
                'mounted'
            );
        }
        if (vnode.data.keepAlive) {
            if (context._isMounted) {
                // 把活跃的组件vm添加到activatedChildren中
                queueActivatedComponent(componentInstance);
            } else {
                // 检查未挂载组件中的活跃组件激活并触发激活的钩子
                activatedChildComponent(componentInstance, true /* direct */)
            }
        }
    },
    destroy(vnode) {
        const { componentInstance } = vnode;
        if (!componentInstance._isDestroyed) {
            if (!vnode.data.keepAlive) {
                componentInstance.$destroy();
            } else {
                // 将组件置为非激活状态，并触发钩子
                deactivateChildComponent(componentInstance, true /* direct */);
            }
        }
    }
}
