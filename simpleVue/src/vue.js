let template;
let mount = Vue.prototype.$mount;

const idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML
});


class Vue {
    constructor(options) {
        this._init(options);
    }
    $mount(el, hydrating) {
        el = el && query(el);
        const options = this.$options;
        // 无渲染函数的情况下去生成渲染函数,如果是字符串模板则用id生成，如果是dom元素用innerHTML提取
        if (!options.render) {
            const template = options.template;
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template);
                    }
                } else if (template.nodeType) {
                    template = template.innerHTML;
                } else {
                    return this;
                }
            } else if (el) { // 没有template，则只能从页面中直接提取html
                template = getOuterHTML(el);
            }
            // 到了这里肯定有template了
            if (template) {
                const ref = compileToFunctions(
                    template,
                    {
                        shouldDecodeNewLines: false,
                        shouldDecodeNewLinesForHref: true,
                        delimiters: ['{{', '}}'],
                        comments: false,
                    },
                    this
                )
                const { render, staticRenderFns } = ref;
                options.render = render;
                options.staticRenderFns = staticRenderFns;
            }
        }
        return mount.call(this, el, hydrating);
    }
}


// 获取页面中html当做template模板
function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    } else {
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}



Vue.compile = compileToFunctions;

export default Vue;
