# vlife-admin
基于vlife低代码核心开发能力打造的开箱即用的权限管理应用，可在此系统之上进行二次开发

开发文档：http://vlice.cc

## 必读
1. 已验证支持的软件版本：`jdk8\jdk11maven3.6\`
2. 在启动项目之前，在整体项目上运行`maven install`命令初始化项目所需的文件。
3. 在`idea`编辑器修改`模型类`的代码，则要运行`maven package` 命令。

## 技术架构
1. 采用`springboot`+`security`+`queryDsl`+`jpa`的单体技术架构
2. 数据库支持`mysql8\oracle11G\SQL server\达梦8`(其他数据库陆续接入中)

## 理念
* `vlife`追求简洁开发，强调最少规则、配置和注解。
* 平台目标不是取代程序员的工作，而是把繁琐重复的开发部分替研发分担。
* 平台前端封装十分完善，推崇后端进行全栈开发。

## 后端项目启动
1. 导入项目到`idea`里，配置`jdk`的编译版本为`jdk1.8`
2. 通过`maven`导入依赖包，导入完成后，整个项目运行`maven install` 命令
3. 在`mysql8`版本下创建数据库,字符集`utf8mb4`，修改对应的`application-mysql.yml` 里数据库连接信息
4. 导入`db` 文件夹下`basic.sql` 的数据库脚本
5. 运行`AdminApplication.java`,项目启动，启动时回进行模型\接口\字典信息的同步工作




