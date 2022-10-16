# 容器组件

> 与 formily 动态表单容器组件，将表单内容解析形成 json,schema 形式

1. index.tsx 表单组件
2. queryForm\index.tsx 查询条件表单组件

# 桥接组件

> vlife 里现有业务组件(semi 基础之上封装的)用 formily 的函数进行桥接成为 formily 可以使用的组件

1. comp\TabSelect.tsx tab 二级分享页组件；
2. comp\TreeQuery.tsx 属性菜单选择组件；

# formily 组件

> 直接写的 formily 组件，只能用在 formily 里，后期需要改造

1. comp\DictSelectTag.tsx -> 字典平铺 tag 选择组件
2. comp\RelationInput.tsx -> 外键展示及选择组件
3. comp\SearchInput.tsx -> 搜索组件

# 待处理问题

1. 组件的只读模式
2. formily 组件剥离成业务组件和桥接组件
