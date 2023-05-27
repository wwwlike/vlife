<p align="center">
	<img alt="logo" src="https://wwwlike.gitee.io/vlife-img/logo1.jpg">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">vlife低代码研发平台</h1>
<h4 align="center">基于模型驱动的低代码开发平台</h4>
<h4 align="center">设计模型、页面配置、插入低码快速搭建你的应用</h4>
<h4 align="center"><a target="_blank" href="http://admin.vlife.cc">示例应用</a>&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://gitee.com/wwwlike/vlife-admin-react">前端项目</a></h4>
<p align="center">
    <a href="https://gitee.com/wwwlike/vlife" target="_blank">
      <img src="https://gitee.com/wwwlike/vlife/badge/star.svg?theme=dark" alt="star" />
    </a>
    <a href="https://gitee.com/wwwlike/vlife" target="_blank">
      <img src="https://gitee.com/wwwlike/vlife/badge/fork.svg?theme=dark" alt="star" />
    </a>
</p>

### 愿景使命
* 让开发简单高效，通过模型编写就能渲染出业务功能。让研发有更多的时间去关注业务创新和提升用户体验，并能享受生活。

>  vlife由核心组件和权限管理脚手架（vlife-admin）应用组成，主要技术栈为springboot+react;
#### 地址查看
- [使用指南] <http://vlife.cc>
- [入门视频] [5分钟快速体验入门](https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6)
- [示例demo] <http://admin.vlife.cc>
- [前端项目] <https://github.com/wwwlike/vlife-admin-react>

### 全面提升研发效能

1. 前后端极简开发，后端专注模型设计，业务逻辑处理，进行全栈开发；前端专注公司资产级组件开发，减少双发低质沟通；
2. 写Javabean就能完成功多表关联的CURD功能模块开发；
3. 注释信息能在功能页面展示，后端修改，前端级联改动，它既是注释也是label;
4. 能生成与后端数据结构一致的前端模型和接口调用代码，哪怕你不用我们的前端项目，咱生成的TS4的代码也可以用啊；
5. 提供了所有数据库的接口，可不写一行sql代码完成所有CRUD功能，只需要你定义合适的模型即可(根据req查询模型的封装结构本平台就能完成复杂表关系查询，根据dto传输模型的封装结构本平台就能完成复杂对象存储）
6. 支持零代码开发，在已经生成前端功能基础之上，进行更细节的配置操作，可实现布局、校验、联动等常见的个性化需求；
7. 支持低代码开发，对于更复杂的校验，后端接口调用等复杂需求，在本平台没有提供配置的功能之前，可以用低代码的方式，给组件传入相关代码即可。
8. 完善的前端权限应用骨架系统，用户体系，权限体系开箱即用；封装的内置组件简单上手。
9. 开源开源了，我们真开源的低代码平台。

### 技术栈
#### 前端
* 前端端采用React、TS4、tailwindcss、Hooks、Semi、函数式组件开发。
* 使用formily实现表单设计器。
* 使用ahooks一套高质量可靠的 React Hooks 库
* 使用react-grid-layout进行组件页面可拖拽布局
* 使用TS进行前端开发，使用继承、封装、泛型等语法

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

- [vlife-admin](https://gitee.com/wwwlike/vlife/vlife-admin) 基于vlife核心数据处理与web权限控制能力打造的权限管理骨架的后端接口层，包含了数据逻辑处理的大量应用示例。
- [vlife-admin-react](https://gitee.com/wwwlike/vlife-admin-react) vlife整个系统的reacts+ts4实现的前端应用，包含了大量封装的通用业务级组件和权限管理的模块

![表单设计器](https://wwwlike.gitee.io/vlife-img/formDesign.png)
![事件响应器](https://wwwlike.gitee.io/vlife-img/reactions.png)
![数据权限](https://wwwlike.gitee.io/vlife-img/dataFilter.png)


### 商业服务
> 如果需要商业服务，请微信联系vlifeboot

### 反馈与共建
<p align="center">
     <a href="#" >微信群
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/wxq.jpg" alt="star" />
    </a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="#" >QQ群
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/qqq.png" alt="star" />
    </a>
</p>

             