# 脚手架应用
`vlife-admin`是基于vlife低代码核心能力打造的开箱即用的权限管理应用，可在此系统之上进行二次开发

[开发文档](http://vlice.cc/quick)   [示例项目](http://admin.vlife.cc)

## 目标
做研发热爱的快速开发平台，为中小企业降本增效；

## 准备
1. 支持：jdk8和jdk11
2. 数据库：mysql8\oracle11G
3. 采用springboot单体技术架构

## 项目启动
> 项目启动过程中会建表和数据初始化
1. 导入项目到`idea`里，项目编译版本为jdk1.8
2. 导入依赖包后，**整个**项目运行`maven package`
3. 创建mysql/oracle数据库，导入db下数据库脚本，修改对应的application-mysql.yml的数据库连接信息
4. 运行 AdminApplication.java,完成项目启动。

## 开发内容
> VLIFE没有改变原有的研发流程，研发上手都是特别快
- 设计模型：按照简约**规范**编写entity/req/vo/dto模型。
- 添加注释：注释不仅提供开发提示，还作为元数据的解释**实时展示**。
- 添加注解：在约定之外增加**灵活性**。(VClass/VMethod/VField)
- API编写：生成的代码能满足大部分业务场景，复杂逻辑需要研发参与。
- 编译打包：接口/模型有变化时，及时运行**maven package**，以便将最新的模型信息提供给前端。

## 开发建议
1. 跟着开发示例写个demo;
2. 掌握模型设计规范及相关规约；如何封装符合规范的`req,vo,dto`模型
3. 掌握`VlifeService`数据存取服务，会使用`QueryWrapper`进行`lambda`链式查询

