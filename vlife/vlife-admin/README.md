# vlife-admin
基于vlife低代码核心开发能力打造的开箱即用的权限管理应用，可在此系统之上进行二次开发

开发文档：http://vlice.cc

## 必读
1. 已验证支持的软件版本：jdk1.8\maven3.6\
2. 在启动项目之前，需要运行`Maven install`命令初始化项目所需的文件。
3. 数据库实体模型发生变化，需要`Maven install` 命令。
4. 其他模型（VO、DTO和Req）发生变化需要立即更同步给前端，请同样运行`Maven install`命令。

## 技术架构
1. 采用springboot+security+queryDsl+jpa的单体技术架构
2. 目前支持mysql8\oracle11G \达梦8数据库(更多数据库支持陆续接入中)

## 理念
* `vlife`追求简洁开发，强调最少规则、配置和注解。
* 平台目标不是取代程序员的工作，而是把繁琐重复的开发部分替研发分担。
* 平台前端封装十分完善，推崇后端进行全栈开发。

## 后端项目启动
1. 导入项目到`idea`里，`File\Project Structure\Project-Setting->`选择项目编译版本为jdk1.8
2. 通过maven导入依赖包，导入完成后，整个项目运行`maven install` 命令
3. 创建mysql/oracle数据库，修改对应的application-mysql.yml/application-oracle.yml里的数据库连接信息
4. 运行 AdminApplication.java,项目启动，启动的同时项目会建表和导入数据，

## 核心能力
1. 能根据`req`模型对象，生成对应的where语句
2. 能根据`vo`模型对象，将查询到的数据封装成对应的数据结构
3. 能根据`dto`模型对象，根据表关系依次把对象数据存入

## 开发流程
1. 按规`范设`计模型
2. 运行`maven install` 生成mvc代码,更新模型信息(title.json)
3. 修改api接口相关逻辑；

## 开发建议
1. 跟着开发示例写个demo;
2. 掌握模型设计规范及相关规约；如何封装符合规范的`req,vo,dto`模型
3. 掌握`VlifeService`数据存取服务，会使用`QueryWrapper`进行lamdba链式查询

