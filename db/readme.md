# 数据库
1. 数据库支持mysql8,oracle11+,达梦,sqlserver2012+

## 1. mysql
1. 在mysql下创建平台数据库`vlife` 
2. 导入`db/vlife_mysql.sql`数据库创建脚本
3. 修改`application-mysql.yml`里的数据库配置信息

```
    url: jdbc:p6spy:mysql://localhost:3306/vlife?useUnicode=true&characterEncoding=utf8
    username: root
    password: root
```