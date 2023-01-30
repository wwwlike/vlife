# vlife是企业级全栈快速开发平台。

> vlife由核心组件和权限管理脚手架（vlife-admin）应用组成，能实现低代码快速迭代开发。

- [使用指南] <http://vlife.cc>
- [入门视频] [5分钟快速体验入门](https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6)
- [示例应用] <http://admin.vlife.cc>
- [前端项目] <https://github.com/wwwlike/vlife-admin-react>

![逻辑架构](https://wwwlike.gitee.io/vlife-img/vlife_jg.png)

## 特性

- 📦 开箱即用，全方位提升前后端研发效能
- 📦 核心底层代码开源、二次开发私有部署无限制
- 📡 平台配套的权限管理脚手架系统可作为多数管理系统的骨架应用
- 🏷 基于模型类型定义，自动生成前后端代码
- 🎨 编写模型就能完成前后端功能，个性化可结合表单设计器搞定
- 📋 跨多表查询、级联保存和删除等复杂数据操作开放的接口全覆盖

## 核心类库(Java)

- vlife-base vlife平台的公用基础类库
- vlife-core 数据逻辑处理的核心类库
- vlife-plugin maven插件，包括代码生成和注释提取
- vlife-spring-boot-starter 将vlife核心数据逻辑处理封装成starter,项目引入它即可，减少开发配置
- vlife-boot-starter-web 将vlife的web数据出参封装、异常处理、权限控制封装的starter,需要使用这些附加能力引入即可

## 权限管理脚手架应用

- [vlife-admin](https://github.com/wwwlike/vlife/vlife-admin) 基于vlife核心数据处理与web权限控制能力打造的权限管理骨架的后端接口层，包含了数据逻辑处理的大量应用示例。
- [vlife-admin-react](https://github.com/wwwlike/vlife-admin-react) vlife整个系统的reacts+ts4实现的前端应用，包含了大量封装的通用业务级组件和权限管理的模块

![表单设计器](https://wwwlike.gitee.io/vlife-img/formDesign.png)
![事件响应器](https://wwwlike.gitee.io/vlife-img/reactions.png)
![数据权限](https://wwwlike.gitee.io/vlife-img/dataFilter.png)

### 骨架特新功能

- 用户、部门、机构、地区管理、字典管理
- 角色、权限组、权限资源、可按模块设置查询权限范围、
- 表单设计器: 表单布局，字段组件设置，组件布局，事件响应，正则校验
- token/jwt鉴权
- 前端组件库封装

## 主要技术栈

- springboot
- jpa/queryDsl
- react18/ts4
- semi(字节跳动ui框架)
- hooks/ahooks
- formily(阿里表单组件)

## 项目合作

> vlife能够快速高质量构建中后台信息管理系统，有相关项目外包请联系微信：vlifeboot

## 团队构建

如果您对低代码平台有兴趣，愿意和我们一起来构建它，非常欢迎你的加入，请联系我。

## 反馈与共建

![反馈与共建](https://wwwlike.gitee.io/vlife-img/linkme.png)
