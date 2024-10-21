### 介绍

> `vlife-admin-react`是一个易于上手拥有各类可视化设计器，以及丰富的组件库的一款低代码平台的前端应用。

### 使用必读

平台封装了完善的 crud 组件库，以及相关的页面模版.`vlife`推崇让 java 技术栈同学进行最全栈开发，让前端去丰富业务级组件库，完成公司级公用的 ui 组件资产库的搭建。这样开发效能可以进一步提升，后端同学不必担心不懂前端技能，使用 `vlife`平台仅需了解各个组件如何使用即可。

### 项目初始化

#### 下载项目

```shell
  git clone https://gitee.com/wwwlike/vlife
  cd .\vlife\vlife-admin-react\
```

#### 安装依赖

1. 改为官方源配置为`https://registry.npmmirror.com/`镜像地址；

```
npm config set registry https://registry.npmmirror.com/

```

2. 安装项目`npm` 依赖包;

```
npm install --legacy-peer-deps

```

3.  项目运行

```
npm run dev

```

#### 访问项目

> 访问 http://localhost:3000 进入项目

### 快速上手一个 Crud 页面

vlife 使用 `react和typescript` 进行开发，完成单模块 `CRUD` 功能，仅需要使用 `Content`组件即可。

```ts
export default () => {
  return <Content<SysUser> entityType="sysUser" filterType="sysUserPageReq" />;
};
```

> 这里用`sysUserPageReq` 模型渲染进行数据查询，用`sysUser`实体模型渲染列表和编辑页面；

### 效果预览

![反馈与共建](https://wwwlike.gitee.io/vlife-img/sysUser.png)

## 技术选型

> 主要采用 react18+semi+hooks 进行开发

- react-router
- typescript4
- react-router
- react-redux
- tailwindcss 原子化 css 方案
- axios(http 请求模块，可用于前端任何场景，很强大 👍)
- ahooks ：alibaba 自定义 hooks 最佳实践
- formily： alibaba 表单解决方案，根据配置产生动态表单
- semi： 字节跳动前端开源组件，可更换主题(飞书、抖音等)
- echart 图标组件
- wangeditor 富文本编辑器
- react-draggable(拖拽模块)
- screenfull(全屏插件)
- animate.css(css 动画库)
- react-loadable(代码拆分，按需加载，预加载，样样都行)
- react-syntax-highlighter 代码高亮

## 关联 Java 平台

[`vlife`](https://gitee.com/wwwlike/vlife)

### 商业服务

> 如果需要商业服务，请微信联系 vlifeboot

### 反馈与共建

<div>
    <div style="display: inline-block;">
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/wxq.png" alt="微信">
      <p style="text-align: center;">微信群</p>
    </div>&nbsp;&nbsp;&nbsp;&nbsp;
    <div style="display: inline-block;">
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/qqq.png" alt="qq群">
      <p style="text-align: center;">QQ群(786134846)</p>
    </div>
</div>
