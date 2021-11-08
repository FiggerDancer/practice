// inherit.js https://gist.github.com/RubaXa/8857525
import {window, head, html as HTML} from 'my-global';

const CACHED = {};// loader
export var assign = Object.assign;
export var extend = assign;

export function isObject(value) {
  return typeof value === 'object' && value !== null;
}
export function isEmpty(obj) {
  if (!isObject(obj)) {
    return !Boolean(obj);
  }
  for (var i in obj) {
    return false;
  }
  return true;
}
export function isFunction(value) {
  return typeof value === 'function';
}
export function isRegExp(value) {
  return isset(value) && value instanceof RegExp;
}
export function isNode(value) {
  return value instanceof window.Node;
}
if (!Array.isArray) {
  var op2str = Object.prototype.toString;
  Array.isArray = function(a) {
    return op2str.call(a) === '[object Array]';
  };
}
export function isArray(value) {
  return Array.isArray(value);//return isset(value) && value instanceof Array;
}
export function isString(value) {
  return isset(value) && typeof value === 'string';
}
export function isNumber(value) {
  return isset(value) && typeof value === 'number';
}
export function isUndefined(value) {
  return typeof value === 'undefined';
}
export function isset(value) {
  return value !== undefined;
}
export function is(value) {
  return isset(value) && !!value;
}
export function isEqual(input1, input2) {
  return input1 === input2 || JSON.stringify(input1) === JSON.stringify(input2);
}
export function isFragment(node) {
  return isset(node) && node.nodeType === window.Node.DOCUMENT_FRAGMENT_NODE;
}
export var now = Date.now ? Date.now : function () {
  return Number(new Date());
};
export function rand() {
  return (Math.random() * 1e17).toString(36).replace('.', '');
}
export function result(object, key) {
  if (isObject(object)) {
    var value = object[key];
    return isFunction(value) ? object[key]() : value;
  }
}
export function inherits(protoProps, staticProps) {
  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var _parent = this;
  var child;
  // The constructor function for the new subclass is either defined by you
  // (the 'constructor' property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (isset(protoProps) && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function () {
      return _parent.apply(this, arguments);
    };
  }

  // Add static properties to the constructor function, if supplied.
  extend(child, _parent, staticProps);
  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function () {
    this.constructor = child;
  };
  Surrogate.prototype = _parent.prototype;
  child.prototype = new Surrogate();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (isset(protoProps)) {
    extend(child.prototype, protoProps);
  }

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = _parent.prototype;

  return child;
}
export function pick(input, _keys) {
  /**
   * Creates a shallow clone of `object` composed of the specified properties.
   * Property names may be specified as individual arguments or as arrays of
   * property names.
   *
   * $.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
   * // => { 'name': 'fred' }
   *
   */
  var output = {};
  _keys.forEach(function (key) {
    if (key in input) {
      output[key] = input[key];
    }
  });
  return output;
}
export function noop() {}
export function contains(where, value) {
  if (isArray(this) || isString(this)) {
    value = where;
    where = this;
  }
  return where.indexOf(value) !== -1;
}
export function clone(value) {
  if (isNode(value)) {
    return value.cloneNode(true);
  } else if (isObject(value)) {
    return extend({}, value);
  } else {
    return value;
  }
}
export function keys(o) {
  if (isObject(o)) {
    return Object.keys(o) || [];
  }
  return [];
}

export function throttle(func, delay) {
  if (isFunction(this)) {
    delay = func;
    func = this;
  }
  var throttling = false;
  delay = delay || 100;
  return function () {
    if (!throttling) {
      func();
      throttling = true;
      setTimeout(function () {
        throttling = false;
      }, delay);
    }
  };
}

export function debounce(func, delay) {
  if (isFunction(this)) {
    delay = func;
    func = this;
  }
  var timeout;
  delay = delay || 100;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

export function encode(str) {
  return encodeURIComponent(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}
var stripTagsRegExp;
export function strip_tags(str) {
  if (typeof stripTagsRegExp === undefined) {
    stripTagsRegExp = /<\/?[^>]+>/gi;
  }
  return str.replace(stripTagsRegExp, '');
}


export function toRadix(N,radix) {
  var HexN = '';
  var Q=Math.floor(Math.abs(N));
  var R;
  while (true) {
    R = Q % radix;
    HexN = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.charAt(R) + HexN;
    Q = (Q - R) / radix; 
    if (Q === 0) {
      break;
    }
  }
  return ((N < 0) ? '-' + HexN : HexN);
}


export function stringHash(str) {
  var hash = 5381;
  var i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}




export function decl(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}


export function timestamp(timestamp) {
  return diff(parseInt(now() / 1000) - timestamp);
}
export function diff(date) {
  var time, words,
    minute = 60,
    hour = 3600,
    day = 86400,
    week = 604800,
    month = 2628000,
    year = 31536000;
  if (date < minute) {
    return '1 минуту';
  } else if (date < (time = minute) * 60) {
    words = ['минуту', 'минуты', 'минут'];
  } else if (date < (time = hour) * 24) {
    words = ['час', 'часа', 'часов'];
  } else if (date < (time = day) * 7) {
    words = ['день', 'дня', 'дней'];
  } else if (date < (time = week) * 5) {
    words = ['неделю', 'недели', 'недель'];
  } else if (date < (time = month) * 12) {
    words = ['месяц', 'месяца', 'месяцев'];
  } else if (time = year) {
    words = ['год', 'года', 'лет'];
  }
  var diff = parseInt(date / time);
  return `${diff} ${decl(diff, words)}`;
}

export function loader (src) {
  if (isArray(src)) {
    return Promise.all(src.map(loader));
  }
  return new Promise(function (resolve, reject) {
    if (CACHED[src]) {
      resolve();
    } else {
      var script = document.createElement('script');
      var loadTimer = setTimeout(reject, 5000);
      var done = false;
      script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
          resolve();
          clearTimeout(loadTimer);
          // Handle memory leak in IE
          script.onload = script.onreadystatechange = null;
          if (head && script.parentNode) {
            head.removeChild(script);
          }
        }
      };
      script.setAttribute('async', '1');
      script.setAttribute('defer', '1');
      script.src = src;
      // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
      // This arises when a base node is used (#2709 and #4378).
      head.insertBefore(script, head.firstChild);
    }
  });
}
var slice = Array.prototype.slice;
export function toArray(smth) {
  return slice.call(smth);
}

export var send = 'sendBeacon' in navigator ? viaSendBeacon : viaImg;

function viaSendBeacon(url, data) {
  if (typeof data === 'object') {
    var realData = JSON.stringify(data);
    setTimeout(() => navigator.sendBeacon(url, realData), 0);
  }
}

function viaImg(url, data) {
  if (typeof data === 'object') {
    var img = new Image();
    var params = [];
    for (var i in data) {
      params.push(`${i}=${data[i]}`);
    }
    var uri = `${url}?${params.join('&')}`;
    setTimeout(() => img.src = uri.substr(0, 2000), 0);
  }
}


