export const remove = function(array, item) {
    const index = array.indexOf(item);
    if (~index) {
        array.splice(index, 1);
    }
    return index;
}

export const noop = () => {};

export const isObject = (obj) => {
    return (obj !== null && typeof obj === 'object');
}

export const isDef = (value) => {
    return typeof value !== 'undefined' && value !== null;
}

export const isUndef = (value) => {
    return value === null || typeof value === 'undefined';
}

export const emptyObject = Object.freeze({});

export const def = (obj, key, val, enumerable) => {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}

export const hasOwn = (value, key) => {
    return Reflect.hasOwnProperty(value, key);
}

export const isPlainObject = (obj) => {
    //判断是否是对象
    return _toString.call(obj) === '[object Object]'
}

export const isWhiteSpace = (node) => {
    return (node.isComment && !node.asyncFactory) || node.text === ' ';
}

export const isNative = (Ctor) => {
    //或者判断该函数是不是系统内置函数
    //判断一个函数中是否含有 'native code' 字符串 比如
    //   function code(){
    //       var native='native code'
    //   }
    //   或者
    //   function code(){
    //       var native='native codeasdfsda'
    //   }

    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export const cached = (fn) => {
    const _cache = {};
    return (str) => {
        const hit = _cache[str];
        return hit || (_cache[str] = fn(str));
    }
}

// 获取函数声明
const getType = (fn) => {
    const match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
}

// 是否是相同的函数声明
const isSameType = (a, b) => {
    return getType(a) === getType(b);
}

// 获取第一个和定义函数声明相同的索引
export const getTypeIndex = (type, expectedTypes) => {
    if (!Array.isArray(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
    }
    for (let i = 0, len = expectedTypes.length; i < len; i++) {
        if (isSameType(expectedTypes[i], type)) {
            return i;
        }
    }
    return -1;
}

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cached((str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
})
