<p align="center">
	<img alt="logo" src="https://wwwlike.gitee.io/vlife-img/logo1.jpg">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">vlife低代码研发平台</h1>
<h4 align="center">基于模型驱动企业级研发平台</h4>
<h4 align="center">业务数智化，皆可低代码</h4>
<h4 align="center"><a target="_blank" href="http://admin.vlife.cc">示例应用</a>&nbsp;&nbsp;
&nbsp;<a target="_blank" href="https://gitee.com/wwwlike/vlife-admin-react">前端项目</a></h4>
<p align="center">
    <a href="https://gitee.com/wwwlike/vlife" target="_blank">
      <img src="https://gitee.com/wwwlike/vlife/badge/star.svg?theme=dark" alt="star" />
    </a>
    <a href="https://gitee.com/wwwlike/vlife" target="_blank">
      <img src="https://gitee.com/wwwlike/vlife/badge/fork.svg?theme=dark" alt="star" />
    </a>
</p>

>  vlife由核心组件和权限管理脚手架（vlife-admin）应用组成，主要技术栈为springboot+react;
#### 地址查看
- [使用指南] <http://vlife.cc>
- [入门视频] [5分钟快速体验入门](https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6)
- [示例demo] <http://admin.vlife.cc>
- [前端项目] <https://gitee.com/wwwlike/vlife-admin-react>

### V-LIFE要做研发欢迎的低码平台
#### vlife了解开发过程中各环节存在的痛点和繁琐点。提供了全栈解决方案助力研发专注于逻辑和技能提升。

#### 📦  核心底层代码全量开源
* 前后端代码、底层核心代码均开源，二次开发私有部署无限制。
#### 📡 开发流程与原生开发一致
* 提供与原生企业级开发一致的开发体验。并配合图形化配置+低码开发成倍提升研发效能。
#### 🏷 极简开发
* 平台规则约束少，能快速上手，复杂的逻辑由开发来，繁琐的vlife搞定。
#### 🎨 模型驱动
* 设计模型(Javabean)、添加注释就能渲染出复杂关系的功能模块，这是vlife已经实现并还在不断深化的平台最显著的特点。
#### 📋 DSL
* vlife平台提供了一套DSL，供开发者使用来进行组件和接口的定义，让复杂的组件与数据不匹配的接口也能组合在一起。
#### 📦 组件化思想
* 前端封装完善业务组件和页面模版，让后端也能轻松完成全栈开发；在后端封装全量数据库操作接口，可不写SQL对数据库进行复杂操作。

### 技术方案

#### 前端
* 前端端采用React18+函数式组件开发、TS4、tailwindcss、Hooks、Semi。
* 使用formily实现表单设计器。
* 使用ahooks一套高质量可靠的 React Hooks 库
* 使用react-grid-layout进行组件页面可拖拽布局
* 使用TS进行前端开发，使用继承、封装、泛型等语法；

#### 后端
* 后端采用Spring Boot、queryDSL、Spring Security & Jwt进行开发
* 全量数据库访问接口封装，实现不写sql就能完成各种数据库操作；
* 采用SpringSecurity进行多级权限粒度控制，菜单权限，接口权限，数据权限
* 可生成与后端模型一致的前端TS代码和接口调用层代码；根据模型智能生成后台MVC三层代码；

#### 平台架构

![逻辑架构](https://wwwlike.gitee.io/vlife-img/vlife_jg.png)


#### 核心类库(Java)

- vlife-base 公用基础类库
- vlife-core 数据逻辑处理
- vlife-plugin 代码生成、注释提取等(maven插件)
- vlife-spring-boot-starter 将vlife核心数据逻辑处理封装成starter,项目引入它即可，减少开发配置
- vlife-boot-starter-web 将vlife的web数据出参封装、异常处理、权限控制封装的starter,需要使用这些附加能力引入即可

#### 权限管理脚手架应用

- [vlife-admin](https://gitee.com/wwwlike/vlife/vlife-admin) 基于vlife核心数据处理与web权限控制能力打造的权限管理骨架的后端接口层，包含了数据逻辑处理的大量应用示例。
- [vlife-admin-react](https://gitee.com/wwwlike/vlife-admin-react) vlife整个系统的reacts+ts4实现的前端应用，包含了大量封装的通用业务级组件和权限管理的模块

![表单设计器](https://wwwlike.gitee.io/vlife-img/formDesign.png)
表单设计器
![事件响应器](https://wwwlike.gitee.io/vlife-img/resources.png)
资源关联权限组
![权限组](https://wwwlike.gitee.io/vlife-img/group.png)
权限组配置

### 商业服务
> 如果需要商业服务，请微信联系vlifeboot

### 反馈与共建
<div >
    <div style="display: inline-block;">
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/wxq.jpg" alt="微信">
      <p style="text-align: center;">微信群</p>
    </div>&nbsp;&nbsp;&nbsp;&nbsp;
    <div style="display: inline-block;">
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/qqq.png" alt="qq群">
      <p style="text-align: center;">QQ群(786134846)</p>
    </div>
</div>


             