# CSS世界的层叠规则

## z-index

在 CSS 世界中，z-index 属性只有和定位元素（position 不为 static 的元素）在一起的时候才有作用，可以是正数也可以是负数。理论上说，数值越大层级越高，但实际上其规则要复杂很多

## 层叠上下文和层叠水平

## 元素层叠顺序

background/border < z-index(-) < block < float < inline < z-index(0) < z-index(+)

## 层叠准则

    1. 谁大谁上
    2. 后来居上

## 层叠上下文

### 层叠上下文特性

    1. 层叠上下文的层叠水平比普通元素高
    2. 层叠上下文可以阻断元素的混合模式
    3. 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文
    4. 层叠上下文和兄弟元素独立。当进行层叠变化或渲染的时候，只需要考虑后代元素。
    5. 层叠上下文自成体系，元素层叠时，整个元素被认为是在父层叠上下文的层叠顺序中。

### 层叠上下文的创建

1. 根层叠上下文
2. z-index 定位元素的层叠上下文
3. css3属性

    1. flex布局
    2. opacity不为1
    3. transform不为none
    4. mix-blend-mode不是normal
    5. filter不是none
    6. isolation是isolate
    7. will-change属性为上面2-6任意一个
    8. -webkit-overflow-scrolling设为touch
