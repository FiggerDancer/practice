# 性能监控

1. 准备编译环境
2. rollup esbuild(golang) swc(rust-babel)
3. 编译目标 micro-bundle
main(.js) source(源文件) module(module.js) types(d.ts) unpkg(umd)
4. 分成两部分Github dist [npm login， npm publish]
5. api-extractor 合并ts
6. micro 原分散的d.ts  
    api -> 外面某个文件夹A -> index.d.ts -> dist -> npm包
7. ts-doc/js-doc typedoc
8. 性能监控 + 错误监控 + 用户回溯(用户操作轨迹+还远sourcemap)
9. 开发过程汇总 直接把ts文件引入到浏览器中 parcel自带对ts编译
10. sdk开发原则，不能去影响用户（业务逻辑主线程+网络层 fetch）
11. requestIdleCallback + marcoTask sendBeacon + img(日志服务器 xxx.gif?data=xxxxxxxx) + ajax + fetch（fetch优先最高，会影响用户正常使用）
12. 前端数据送到一个专门的日志服务器 服务器定时task分析日志
13. 根据优先级 -> 微信 邮箱 电话 短信 1分钟
