# Observer

## 依赖的收集过程

首先通过`Observer.prototype.defineReactive`给每个数据定义get和set，这样get中就可以收集依赖，而set的时候可以触发`Dep.prototype.notify`触发`Watcher.prototype.update`来更新

收集依赖主要通过 `Dep.prototype.depend`

主要步骤如下：

`Dep.prototype.depend -> Watcher.prototype.addDep -> Dep.prototype.addSub -> Watcher.prototype.cleanupDeps`

通过这一系列的操作来完成互相依赖以及依赖的更新

有一种情况比较特殊就是`computed` 因为计算属性一开始不在data里observe的时候不会去定义它，这时需要用到 `initComputed` 这个方法会初始化这个计算属性的set和get,并且令其在get的过程中通过`Watcher.prototype.depend -> Dep.prototype.depend`的方式建立依赖关系,由于value的get中使用其依赖的value的get，这样就能收集到所有依赖的`Watcher`，然后就可以一起更新，这里有个很重要的问题，就是watcher在执行过程中是会排序的，按照顺序data先，computed次之，watch最后，如果是这样的情况下，那么computed可能拿不到watch，所以computed的watch需要延迟执行，这里启用了延迟执行，这样computed就最后执行了。
