function Vue(options) {
    this._init(options);
}

let uid = 0 ;
function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm._uid = uid++;
        let startTag, endTag;
        vm._isVue = true;
        if (options && options._isComponent) {
            initInternalComponent(vm, options);
        } else {
            vm.$options = mergeOptions(
                resolveConstructorOptions(vm.constructor),
                options || {},
                vm
            )
        }
        initProxy(vm);
        vm._self = vm;
        initLifecycle(vm);
        initEvent(vm);
        initRender(vm);
        callHook(vm, 'beforeHook');
        initInjections(vm);
        initState(vm);
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }
}

function initInternalComponent(vm, options) {
    const opts = vm.$options = Object.create(vm.constructor.options);
    const parentVnode = options._parentVnode;
    opts.parent = options.parent; // 父节点
    opts._parentVnode = parentNode; // 父虚拟节点
    opts._parentElm = options._parentElm; // 组件父节点元素
    opts._refElm = options._refElm; // 当前节点的元素

    const vnodeComponentOptions = parentVnode.componentOptions; // 父虚拟节点的参数
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
    }
}

function resolveConstructorOptions(Ctor) {
    const options = Ctor.options;
    if (Ctor.super) { // 超类
        const superOptions = resolveConstructorOptions(Ctor.super); // 回调超类表示继承父类
        const cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
            Ctor.superOptions = superOptions;
            const modifiedOptions = resolveModifiedOptions(Ctor);
            if (modifiedOptions) {
                Object.assign(Ctor.extendOptions, modifiedOptions);
            }
            options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
            if (options.name) {
                options.components[options.name] = Ctor;
            }
        }
    }
    return options;
}
