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

## 用户行为回溯

1. 一张张的图 html2Canvas base64 卡顿
2. video api 允许 录屏上传（报错后让用户传）
3. 简单粗暴
    1. 代理掉用户的全部事件：如click，mousedown等
    2. 留存栈 30 \[xpath\]
        例如：body/\[5\]div/\[3\]li/\[1\]a
    3. 监控错误 栈压缩 -> 服务器 -> 清空
    4. Playwright -> xpath(点点) -> 截图 -> 合成视频
4. 精细化（rrweb)
    1. 页面全量快照 转换成虚拟dom
    2. 转成虚拟dom（节点需要标记id）
    3. 虚拟dom换成dom
    4. MutationObserver监控
    5. 监控input（因为MutationObserver监听不到）
    6. canvas hack api

## 所有web指标

web-vitals

可以在web.dev里看这些指标
