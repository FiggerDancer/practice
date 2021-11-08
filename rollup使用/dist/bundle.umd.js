
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('lodash')) :
    typeof define === 'function' && define.amd ? define(['lodash'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global._));
})(this, (function (_) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var ___namespace = /*#__PURE__*/_interopNamespace(_);

    const go = (n) => {
        console.log(new Array(n).fill('go').join(''));
    };
    const sum = (arr) => {
        return (___namespace.sum(arr));
    };

    class Demo {
        name;
        sex;
        constructor(params) {
            this.name = params.name;
            this.sex = params.sex;
        }
        say() {
            console.log(`Hello! My Name is ${this.name}, sex: ${this.sex}`);
            go(3);
            const a = sum([1, 2, 3]);
            console.log(a, 3);
        }
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = "body {\n    background: #ffe;\n}\n\n.container {\n    background: #eff;\n    width: 40px;\n    height: 40px;\n}";
    styleInject(css_248z);

    const demo = new Demo({
        name: 'Tom',
        sex: '男'
    });
    const oDiv = document.createElement('div');
    oDiv.className = 'container';
    const oBody = document.querySelector('body');
    if (oBody) {
        oBody.appendChild(oDiv);
    }
    oDiv.innerHTML = '14sadf34';
    demo.say();
    const getMap = (a, b) => {
        const map = new Map();
        map.set(a, b);
        return map;
    };
    const map = getMap(6, [1, 2]);
    console.log(map);
    console.log('hello world1!');

}));
//# sourceMappingURL=bundle.umd.js.map
