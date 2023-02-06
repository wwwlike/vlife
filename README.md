<p align="center">
	<img alt="logo" src="https://wwwlike.gitee.io/vlife-img/logo1.jpg">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">vlife低代码研发平台</h1>
<h4 align="center">基于SpringBoot+React前后端分离的Java快速开发框架</h4>
<p align="center">
	<a href="https://gitee.com/wwwlike/vlife" target="_blank"><img src="https://gitee.com/wwwlike/vlife/badge/star.svg?theme=dark"></a>
        <a href="https://gitee.com/open-source-byte/source-vue" target="_blank">
            <img src="https://gitee.com/wwwlike/vlife/badge/fork.svg?theme=dark">
        </a>
	<a href=" http://admin.vlife.cc/login" target="_blank"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>


### 平台简介
vlife平台是一套全部开源的快速开发平台，无保留给个人及企业使用。

> vlife由核心组件和权限管理脚手架（vlife-admin）应用组成，一款快速打造高生产力的低代码研发平台
#### 地址查看
- [使用指南] <http://vlife.cc>
- [入门视频] [5分钟快速体验入门](https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6)
- [示例demo] <http://admin.vlife.cc>
- [前端项目] <https://github.com/wwwlike/vlife-admin-react>

#### 前端
* 前端端采用React、TS4、tailwindcss、Hooks、Semi、函数式组件开发。
* 使用formily实现表单设计器。
* 使用ahooks一套高质量可靠的 React Hooks 库
* 使用wangeditor进行富文本编辑
* 使用react-grid-layout进行组件页面可拖拽布局

#### 后端
* 后端采用Spring Boot、queryDSL、Spring Security & Jwt进行开发
* 使用Javapoet能生成服务端代码
* 支持多种登录方式（验证码登录，密码登录）
* 支持加载动态权限菜单，控制菜单权限，按钮权限，数据权限。
* 高效率开发，使用代码生成器可以一键生成前后端代码。
* 在QueryDsl基础之上对所有复杂CRUD代码进行全量封装。

#### 平台架构

![逻辑架构](https://wwwlike.gitee.io/vlife-img/vlife_jg.png)


### 特性

- 📦 开箱即用，全方位提升前后端研发效能
- 📦 核心底层代码开源、二次开发私有部署无限制
- 📡 平台配套的权限管理脚手架系统可作为多数管理系统的骨架应用
- 🏷 基于模型类型定义，自动生成前后端代码
- 🎨 编写模型就能完成前后端功能，个性化可结合表单设计器搞定
- 📋 跨多表查询、级联保存和删除等复杂数据操作开放的接口全覆盖

#### 核心类库(Java)

- vlife-base 公用基础类库
- vlife-core 数据逻辑处理
- vlife-plugin 代码生成、注释提取等(maven插件)
- vlife-spring-boot-starter 将vlife核心数据逻辑处理封装成starter,项目引入它即可，减少开发配置
- vlife-boot-starter-web 将vlife的web数据出参封装、异常处理、权限控制封装的starter,需要使用这些附加能力引入即可

#### 权限管理脚手架应用

- [vlife-admin](https://github.com/wwwlike/vlife/vlife-admin) 基于vlife核心数据处理与web权限控制能力打造的权限管理骨架的后端接口层，包含了数据逻辑处理的大量应用示例。
- [vlife-admin-react](https://github.com/wwwlike/vlife-admin-react) vlife整个系统的reacts+ts4实现的前端应用，包含了大量封装的通用业务级组件和权限管理的模块

![表单设计器](https://wwwlike.gitee.io/vlife-img/formDesign.png)
![事件响应器](https://wwwlike.gitee.io/vlife-img/reactions.png)
![数据权限](https://wwwlike.gitee.io/vlife-img/dataFilter.png)


### 商业服务
> 如果你需要商业服务，欢迎通过邮件联系我们：vlifelowcode@163.com

或者添加我们的微信：vlifeboot

### 反馈与共建

![反馈与共建](https://wwwlike.gitee.io/vlife-img/link.png)
