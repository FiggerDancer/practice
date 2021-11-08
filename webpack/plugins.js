class BasicPlugins {
    constructor(options) {}
    apply(compiler) {
        compiler.plugin('compilation', function(compilation, callback){
            const chunks = compilation.chunks;
            chunks.forEach((chunk) => {
                chunk.forEachModule((module) => module.fileDependencies.forEach((filePath) => {}));
                const files = chunk.files;
                files.forEach((file => {
                    const source = compilation.assets[file].source();
                }))
            })
            callback();
        })
        compiler.plugin('watch-run', (watching, callback) => {
            // 获取发生变化的文件列表
            const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
            // changedFiles 格式为键值对，键为发生变化的文件路径。
            if (changedFiles[filePath] !== undefined) {
              // filePath 对应的文件发生了变化
            }
            callback();
        });
        compiler.plugin('after-compile', (compilation, callback) => {
        // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
            compilation.fileDependencies.push(filePath);
            callback();
        });
        compiler.plugin('emit', (compilation, callback) => {
            // 设置名称为 fileName 的输出资源
            compilation.assets[fileName] = {
              // 返回文件内容
              source: () => {
                // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
                return fileContent;
                },
              // 返回文件大小
                size: () => {
                return Buffer.byteLength(fileContent, 'utf8');
              }
            };
            callback();
        });
        compiler.plugin('emit', (compilation, callback) => {
            // 读取名称为 fileName 的输出资源
            const asset = compilation.assets[fileName];
            // 获取输出资源的内容
            asset.source();
            // 获取输出资源的文件大小
            asset.size();
            callback();
        });
    }
}

module.exports = BasicPlugins;