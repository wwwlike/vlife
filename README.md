# V-LIFE是为全面提升研发效能而生的平台级全栈解决方案。
> vlife由核心组件和

- [使用指南] <http://vlife.cc>
- [入门视频] [5分钟快速体验入门](https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6)
- [骨架示例] <http://admin.vlife.cc>

## 特点
- 核心底层代码开源、二次开发私有部署无限制
- 面向开发人员的低代码快速开发平台
- 跨多表复杂查询、多表关联保存、级联删除等复杂CRUD用封装的service接口一行代码就可以搞定
- 前后端代码均可以生成，写的更少，产品稳定有保障
- 开发效率高，是前后端全栈低代码解决方案，数分钟即可完成一个模块的业务场景功能开发
- 开发简单，写POJO数据模型就是V-LIFE里开发要做的主要工作，降低了研发门槛

## 核心类库(Java)
- vlife-base vlife平台的公用基础类库
- vlife-core 数据逻辑处理的核心类库
- vlife-plugin maven插件，包括代码生成和注释提取
- vlife-spring-boot-starter 将vlife核心数据逻辑处理封装成starter,项目引入它即可，减少开发配置
- vlife-boot-starter-web    将vlife的web数据出参封装、异常处理、权限控制封装的starter,需要使用这些附加能力引入即可

## 权限管理脚手架应用
- [vlife-admin](https://github.com/wwwlike/vlife/vlife-admin) 基于vlife核心数据处理与web权限控制能力打造的权限管理骨架的后端接口层，包含了数据逻辑处理的大量应用示例。
- [vlife-admin-react](https://github.com/wwwlike/vlife/vlife-admin-react) vlife整个系统的reacts+ts4实现的前端应用，包含了大量封装的通用业务级组件和权限管理的模块

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



## 反馈与共建
![反馈与共建](https://wwwlike.gitee.io/vlife-img/linkme.png)
