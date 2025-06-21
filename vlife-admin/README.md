# vlife-admin

## 简介
`vlife-admin` 是一个功能强大的开发工具，它既是开发脚手架，也是零代码应用的开发平台。它能够帮助开发者快速搭建项目基础架构，并支持零代码开发，提升开发效率。

当前，`vlife-admin` 的前端应用默认发布在 `/resources/static` 目录下，会随服务端同时启动。用户也可以根据需要，将前端单独发布至 Nginx。

开发文档地址：[vlife-admin 开发文档](http://vlice.cc)

## 项目启动
1. 安装: `jdk8/jdk11`，`mysql8`,导入初始化数据库`db/vlife_mysql.sql`
2. 编译: `maven package` 编译项目
3. 启动: `vlife-admin`，运行`vlife-admin/AdminApplication` 脚手架项目
4. 访问: `http://localhost:8288/login` 超级管理员：`manage/123456`

## 技术架构
1. 采用`springboot`+`security`+`queryDsl`+`jpa`的单体技术架构
2. 数据库支持`mysql8\oracle11G\SQL server\达梦8`(其他数据库陆续接入中)

## 低代码开发
1. entity,dto,contorller,service,dao代码均可在前端发布模型时自动生成。
2. 关于低代码开发的具体使用场景和最佳实践，建议参考以下文档：[低码何时入场？](https://alidocs.dingtalk.com/i/nodes/np9zOoBVBQKpPBnbHGmybmapW1DK0g6l)

## 使用说明
1. 务必在**开发环境**下进行**模型设计**和发布
2. 如**手动**的修改了**模型代码**,则需要运行`mvn package`打包命令