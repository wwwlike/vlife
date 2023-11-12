# 后端
vlife集成了数据封装、模型解析、代码生成、权限控制、流程引擎的模块，可作为企业级开发的后台底座; 可基于脚手架应用`vlife-admin`进行二次开发。
 
## 服务端特色能力
1. 使用的srpingboot+security+jpa+querydsl技术栈;
2. 根据模型(pojo)可智能生成后端mvc代码；
3. 封装了所有所有逻辑关联的CRUD数据操作接口；
4. 脚手架应用`vlife-admin`有完善的数据操作查询权限的封装；


## 启动注意事项步骤
1. 使用jdk1.8，对整个平台代码进行编译；
2. 对这个平台代码进行 `maven install`
3. 导入数据库`db\db_mysql.sql`，修改数据库配置->`application-basic.yml`
4. 启动 vlife-admin/AdminApplication.java


             