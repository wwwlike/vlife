<p align="center">
	<img alt="logo" src="https://wwwlike.gitee.io/vlife-img/logo1.jpg">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">vlife低代码研发平台</h1>
<h4 align="center">基于模型驱动的企业级研发平台</h4>
<h4 align="center">业务数智化，皆可低代码</h4>
<h4 align="center"><a target="_blank" href="http://vlife.cc">官网</a>&nbsp;&nbsp;
&nbsp;<a target="_blank" href="http://admin.vlife.cc/login">平台体验</a></h4>
<p align="center">
    <a href="https://gitee.com/wwwlike/vlife" target="_blank">
      <img src="https://gitee.com/wwwlike/vlife/badge/star.svg?theme=dark" alt="star" />
    </a>
    <a href="https://gitee.com/wwwlike/vlife" target="_blank">
      <img src="https://gitee.com/wwwlike/vlife/badge/fork.svg?theme=dark" alt="star" />
    </a>
</p>

##  vlife是什么
vlife是一套采用前后端分离（java+react）架构的企业级低代码研发平台。它基于**模型驱动**的理念，通过编写**javabean**并结合平台提供的**高级组件**，用户可以轻松完成复杂需求的开发,**提升10倍研发效能**

## 真开源？
平台的核心代码、底层代码以及前端、后端、脚手架和示例代码都是开源的，这样就不存在任何对应用的库表、字段、行数限制；没有代码黑盒遇到问题也能自行处理。只要用户遵循Apache 2.0协议，在二次开发和私有部署方面是没有限制的。

## 目标群体
	中小软件企业，个人及外包团队或有全面提升提升研发团队效能，降低研发成本的管理者；
* vlife是一款独特的低代码平台，专为研发人员而设计。我们深知研发人员对于传统低代码平台的排斥，因此我们致力于打造一款让程序员热爱的低代码平台。

## 使用成本
> vlife平台提供与原生企业级开发一致的开发体验。对于程序员来说，使用vlife进行开发与传统的开发流程方式完全一致，不会有任何不适应的情况。vlife平台在这个过程中帮助用户解决了许多繁琐、重复的开发任务，让开发者可以专注于核心业务逻辑的实现。
 - 采用前后端分离的单体技术架构，安装部署开发简单，配置数据库连接即可启动项目。
 - 平台规则、规范少（10几条要求）。初级研发有能快速上手。轻松实现1小时完成1天的开发工作。
 - 平台封装了完善的数据访问，丰富的表单列表组件。全栈开发也没有难度。

## 研发干什么？
	vlife平台的显著能力就是将数据接口与功能组件组织在一起形成业务功能。
1. 前端：将重点工作转移到公司组件资产研发上来，让复用的组件不断迭代优化，并能提供组件的文档和使用示例；第二块内容是开发复杂的场景交互功能。
2. 后端：设计合理的数据模型，编写复杂的业务逻辑接口。推荐后端做全栈开发，使用前端封装完善的组件完成全栈项目功能的开发。


* 

## 低代码能力
####  用低码方式为列表加入一个密码重置功能
``` typescript
{
	title:  "密码重置",
	actionType:  "api",
	icon:  <IconForward  />, //按钮的标签
	multiple:  true,//支持对多条数据进行批量重置操作
	onSaveBefore(data: SysUser[]) {//传到reset之前，需要对数据进行处理
		return data.map((d) =>  d.id);
	},
	saveApi:  reset,//重置接口
}
```
#### 用低码方式实现复杂表单逻辑：
-  用低码方式增加一个字段的正则校验
``` typescript
VF.field("username")
.regex(/^[a-zA-Z0-9]+$/)
.then("username")
.feedback("不能包含特殊字符串")
```

## 技术方案

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
    <div style="display: inline-block;width:200px">
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/wxq.png" alt="微信">
      <p style="text-align: center;">微信群</p>
    </div>&nbsp;&nbsp;&nbsp;&nbsp;
    <div style="display: inline-block;width:200px">
      <img style="width: 200px; height: 200px;" src="https://wwwlike.gitee.io/vlife-img/qqq.png" alt="qq群">
      <p style="text-align: center;">QQ群(786134846)</p>
    </div>
</div>


             
