Array.prototype.myMap = function(callbackFn, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError(`Cannot read property 'map' of null or undefined`);
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + ' is not a function');
    }
    let O = Object(this);
    let T = thisArg;
    let len = O.length >>> 0;
    let A = new Array(len);
    for (let k = 0; k < len; k++) {
        if (k in O) { // 可以有效处理稀疏数组的情况
            let kValue = O[k];
            let mappedValue = callbackFn.call(T, kValue, k, O);
            A[k] = mappedValue;
        }
    }
    return A;
}

Array.prototype.myReduce = function(callbackFn, initialValue) {
    if (this === null || this === undefined) {
        throw new TypeError(`Cannot read property 'reduce' of null or undefined`);
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + ' is not a function');
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let k = 0;
    let accumulator;
    if (typeof initialValue !== 'undefined') {
        accumulator = initialValue;
    } else {
        for (; k < len; k++) {
            if (k in O) {
                accumulator = O[k];
                k++;
                break;
            }
        }
    }
    if (k === len && accumulator === undefined) throw new Error('Each element of the array is empty');
  
    for (; k < len; k++) {
      if (k in O) {
        // 注意，核心！
        accumulator = callbackfn.call(undefined, accumulator, O[k], k, O);
      }
    }
    return accumulator;
}

Array.prototype.myPush = function(...items) {
    let O = Object(this);
    let len = this.length >>> 0;
    let argCount = items.length >>> 0;
    if (len + argCount > 2 ** 53 - 1) {
        throw new TypeError("The number of array is over the max value restricted!")
    }
    for (let i = 0; i < argCount; i++) {
        O[len + 1] = items;
    }
    let newLength = len + argCount;
    O.length = newLength;
    return newLength;
}

Array.prototype.myPop = function() {
    let O = Object(this);
    let len = this.length >>> 0;
    if (len === 0) {
        O.length = 0;
        return undefined;
    }
    len--;
    let value = O[len];
    delete O[len];
    O.length = len;
    return value;
}

Array.prototype.myFilter = function(callbackFn, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError(`Cannot read property 'filter' of null or undefined`);
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + ' is not a function');
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let resLen = 0;
    let res = [];
    for (let i = 0; i < len; i++) {
        if (i in O) {
            let element = O[i];
            if (callbackFn.call(thisArg, O[i], i, O)) {
                res[resLen++] = element;
            }
        }
    }
    return res;
}

const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
    for (let i = 0; i < deleteCount; i++) {
        let index = startIndex + i;
        if (index in array) {
            let current = array[index];
            deleteArr[i] = current;
        }
    }
}

const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
    if (deleteCount === addElements.length) return;
    if (deleteCount > addElements.length) {
        for (let i = startIndex + deleteCount; i < len; i++) {
            let fromIndex = i;
            let toIndex = i - (deleteCount - addElements.length);
            if (fromIndex in array) {
                array[toIndex] = array[fromIndex];
            } else {
                delete array[toIndex];
            }
        }
        for (let i = len - 1; i >= len + addElements.length - deleteCount; i--) {
            delete array[i];
        }
    } else {
        for (let i = len - 1; i >= startIndex + deleteCount; i--) {
            let fromIndex = i;
            let toIndex = i + (addElements.length - deleteCount);
            if (fromIndex in array) {
                array[toIndex] = array[fromIndex];
            } else {
                delete array[toIndex];
            }
        }
    }
}

const computeStartIndex = (startIndex, len) => {
    // 处理索引负数的情况
    if (startIndex < 0) {
      return startIndex + len > 0 ? startIndex + len: 0;
    } 
    return startIndex >= len ? len: startIndex;
}

const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
    // 删除数目没有传，默认删除startIndex及后面所有的
    if (argumentsLen === 1) 
      return len - startIndex;
    // 删除数目过小
    if (deleteCount < 0) 
      return 0;
    // 删除数目过大
    if (deleteCount > len - startIndex) 
      return len - startIndex;
    return deleteCount;
  }
  

Array.prototype.mySplice = function(startIndex, deleteCount, ...addElements) {
    let array = Object(this);
    let len = array.length;
    let deleteArr = new Array(deleteCount);
    // 下面参数的清洗工作
    startIndex = computeStartIndex(startIndex, len);
    deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);

    // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
    if (Object.isSealed(array) && deleteCount !== addElements.length) {
        throw new TypeError('the object is a sealed object!')
    } else if (Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
        throw new TypeError('the object is a frozen object!')
    }
    sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
    movePostElements(array, startIndex, len, deleteCount, addElements);
    for (let i = 0; i < addElements.length; i++) {
        array[startIndex + i] = addElements[i];
    }
    array.length = len - deleteCount + addElements.length;
    return deleteArr;
}

// n <=10 采用插入排序
// n > 10 时采用三路快速排序
// 10 < n <= 1000 中位数作为哨兵
// n > 1000 每隔200~215个元素挑出一个元素，放到一个新数组，对它排序，找中间位置的数，以此作为中位数

const insertSort = (arr, start = 0, end) => {
    end = end || arr.length;
    for (let i = start; i < end; i++) {
        let e = arr[i];
        let j;
        // 把之前的元素在排下
        for (j = i; j > start && arr[j - 1] > e; j--) {
            arr[j] = arr[j - 1];
        }
        arr[j] = e;
    }
    return arr;
}

// 寻找哨兵
const getThirdIndex = (a, from, to) => {
    let tmpArr = [];
    let increment = 200 + ((to - from) & 15);
    let j = 0;
    from += 1;
    to -= 1;
    for (let i = from; i < to; i += increment) {
        tmpArr[j] = [i, a[i]];
        j++;
    }
    tmpArr.sort(function(a, b) {
        return compareFn(a[1], b[1]);
    });
    let thirdIndex = tmpArr[tmpArr.length >> 1][0];
    return thirdIndex;
}

const partition = (a, from, to) => {
    let pivot = (from) + ((to - from) >> 1);
    let i = from;
    let j = to;
    while (i <= j) {
        while (arr[i] < pivot) {
            i++;
        }
        while (arr[j] > pivot) {
            j--;
        }
        if (i <= j) {
            [a[i], a[j]] = [a[j], a[i]];
            i++;
            j--;
        }
    }
    return i;
}

const quickSort = (a, from = 0, to = a.length - 1) => {
    if (arr.length > 1) {
        const lineIndex = partition(arr, from, to);
        if (lineIndex - 1 > from) {
            quickSort(a, from, lineIndex - 1);
        }
        if (lineIndex < to) {
            quickSort(a, lineIndex, to);
        }
    }
    return arr;
}

const InnerArraySort = (array, length, compareFn) => {
    if (Object.prototype.toString.call(compareFn) !== '[object Function]') {
        compareFn = function (x, y) {
            if (x === y) return 0;
            x = x.toString();
            y = y.toString();
            if (x == y) return 0;
            return x < y ? -1 : 1;
        };
    }

    const insertSort = (arr, start = 0, end) => {
        end = end || arr.length;
        for (let i = start; i < end; i++) {
            let e = arr[i];
            let j;
            for (j = 0; j > start && compareFn(arr[j - 1], e) > 0; j--) {
                arr[j] = arr[j - 1];
            }
            arr[j] = e;
        }
        return;
    }

    const getThirdIndex = (a, from, to) => {
        let tmpArr = [];
        let increment = 200 + ((to - from) & 15);
        let j = 0;
        from += 1;
        to -= 1;
        for (let i = from; i < to; i += increment) {
            tmpArr[j] = [i, a[i]];
            j++;
        }
        tmpArr.mySort(function (a, b) {
            return compareFn(a[1], b[1]);
        });
        let thirdIndex = tmpArr[tmpArr.length >> 1][0];
        return thirdIndex;
    }
    const _sort = (a, b, c) => {
        let arr = [];
        arr.push(a, b, c);
        insertSort(arr, 0, 3);
        return arr;
    }

    const partition = (a, from, to) => {
        let thirdIndex = 0;
        if (to - from <= 10) {
            insertSort(a, from, to);
            return;
        }
        if (to - from > 1000) {
            thirdIndex = getThirdIndex(a, from, to);
        } else {
            thirdIndex = from + ((to - from) >> 1);
        }
        let tmpArr = _sort(a[from], a[thirdIndex], a[to]);
        let pivot = tmpArr[1];
        let i = from;
        let j = to;
        while (i <= j) {
            while (a[i] < pivot) {
                i++;
            }
            while (a[j] > pivot) {
                j--;
            }
            while (i <= j) {
                [a[i], a[j]] = [a[j], a[i]];
                i++;
                j--;
            }
        }
        return i;
    }

    const quickSort = (a, from, to) => {
        if (a.length > 1) {
            const lineIndex = partition(a, from, to);
            if (from < lineIndex - 1) {
                quickSort(a, from, lineIndex - 1);
            }
            if (lineIndex < to) {
                quickSort(a, lineIndex, to);
            }
        }
        return a;
    }
    quickSort(array, 0, length - 1);
}

Array.prototype.mySort = function(compareFn) {
    let array = Object(arr);
    let length = array.length >>> 0;
    return InnerArraySort(array, length, compareFn);
}

const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

const getType = Object.prototype.toString.call(null);

// 可预留遍历的对象
const canTraverse = {
    '[object Map]': true,
    '[object Set]': true,
    '[object Array]': true,
    '[object Object]': true,
    '[object Arguments]': true,
}

// 不可遍历对象
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
    const { source, flags } = target;
    return new target.constructor(source, flags);
}

const handleFunc = (func) => {
    // 箭头函数直接返回本身
    if (!func.prototype) return func;
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (!body) return null;
    if (param) {
        const paramArr = param[0].split(',');
        return new Function(...paramArr, body[0]);
    } else {
        return new Function(body[0]);
    }
}

const handleNotTraverse = (target, tag) => {
    const Ctor = target.constructor;
    switch(tag) {
        case boolTag:
            return new Object(Boolean.prototype.valueOf.call(target));
        case numberTag:
            return new Object(Number.prototype.valueOf.call(target));
        case stringTag: 
            return new Object(String.prototype.valueOf.call(target));
        case errorTag: 
        case dateTag: 
            return new Ctor(target);
        case regexpTag:
            return handleRegExp(target);
        case funcTag:
            return handleFunc(target);
        default:
            return new Ctor(target);
    }
}

const deepClone = function(target, set = new WeakSet()) {
    if (!isObject(target)) {
        return target;
    }
    let type = getType(target);
    let cloneTarget;
    if (!canTraverse[type]) {
        // 处理不能遍历的对象
        return handleNotTraverse(target, type);
    } else {
        // 通过这样做保证对象原型不丢失
        let ctor = target.prototype;
        cloneTarget = new ctor()
    }
    if (set.has(target)) {
        return target;
    }
    set.add(target);
    if (type === '[object Map]') {
        // 处理map
        target.forEach((item, key) => {
            cloneTarget.set(deepClone(key, deepClone(item)));
        })
    }
    if (type === '[object Set]') {
        // 处理map
        target.forEach((item) => {
            cloneTarget.add(deepClone(item));
        })
    }
    for (let prop in target) {
        if (target.hasOwnProperty(prop)) {
            cloneTarget[prop] = deepClone(target[prop], set);
        }
    }
    return cloneTarget;
    
}

const jsonStringify = (data) => {
    let dataType = typeof data;
    if (dataType !== 'object') {
        let result = data;
        if (Number.isNaN(data) || data === Infinity) {
            result = 'null';
        } else if (dataType === 'function' || dataType === 'undefined' || dataType === 'symbol') {
            return undefined;
        } else if (dataType === 'string') {
            result = '"' + data + '"';
        }
        // boolean值返回String（）
        return String(result);
    } else if (dataType === 'object') {
        if (data === null) {
            return 'null';
        } else if (data.toJSON && typeof data.toJSON === 'function') {
            return jsonStringify(data.toJSON());
        } else if (data instanceof Array) {
            let result = [];
            data.forEach((item, index) => {
                if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
                    result[index] = 'null';
                } else {
                    result[index] = jsonStringify(item);
                }
            });
            result = "[" + result + "]";
            return result.replace(/'/g,'"');
        } else {
            let result = [];
            Object.keys(data).forEach((item, index) => {
                if (typeof item !== 'symbol') {
                    if (data[item] !== undefined && typeof data[item] !== 'function' && typeof data[item] !== 'symbol') {
                        result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
                    }
                }
            });
            return ("{" + result + "}").replace(/'/g, '"');
        }
    }

}