const loaderUtils = require('loader-utils');

module.exports = function(source) {
    this.cacheable(true);
    const callback = this.async();
    const options = loaderUtils.getOptions(source);
    callback(null, source, sourceMaps, ast);
    return source;
}

module.exports.raw = true;