# vlife-admin-react 介绍

> vlife-admin-react 是*V-LIFE*快速开发平台前端 react 实现的权限管理系统，可作为大多数信息系统的基础开发骨架使用。

## 特点

- **[react 技术栈]:** 市面上多为 vue-admin 的骨架系统，好用的 react-admin 很少，可作为项目骨架，也可作为学习 react 的参照项目，帮你快速了解 react 的方方面面.
- **[UI 组件丰富]:** 前端 UI 组件库使用字节跳动开源的[semi](http://semi.design),拥有多种作[主题](https://semi.design/dsm/landing)(飞书、抖音、火山、剪映)和暗色模式，让你的应用显著区别 elementUi,antd 的风格系统。
- **[代码可生成]:** 已开放了将服务端数据模型及接口对应生成前端数据接口及 API 的访问代码(包含注释)，前端只用写页面功能即可. 基本可以告别看接口文档了
- **[业务组件库]:** 使用 ts4+hooks 进行组件式开发,已经封装了 10+的模块页面级的业务组件库,让你开发功能速度显著提升
- **[开箱即用]:** 信息系统骨架权限\用户管理功能已经全部集成进来,完成相关业务模块开发即可

## 演示地址

[http://admin.vlife.cc](http://admin.vlife.cc)

## V-LFIFE 快速研发平台开源地址

[https://githubs.com/wwwlike/vlife](https://githubs.com/wwwlike/vlife)

## vlife-admin 配套服务端开源地址

[https://githubs.com/wwwlike/vlife-admin](https://githubs.com/wwwlike/vlife-admin)

## 技术栈

> 采用 react 最新函数式结合 hooks 进行函数式编程

- react18\typescript4\react-router\react-redux\useContext
- ahooks ：alibaba 自定义 hooks 最佳实践
- formily： alibaba 表单解决方案，根据配置产生动态表单
- semi： 字节跳动前端开源组件，可更换主题(飞书、抖音等)

## 功能模块

![](http://oa.wwwlike.cn/0.png)
![](http://oa.wwwlike.cn/1.png)
![](http://oa.wwwlike.cn/2.png)
![](http://oa.wwwlike.cn/3.png)
![](http://oa.wwwlike.cn/4.png)

### 系统管理(sys)

1. 用户管理(`sysUser`)
2. 部门管理(`sysDept`)
3. 机构管理(`sysOrg`)
4. 字典管理(`sysDict`)
5. 地区管理(`sysArea`)

### 权限管理

6. 权限资源管理(`sysResources`)
7. 角色管理(`sysRole`)
8. 权限组管理(`sysGroup`)
9. 角色权限组绑定(`sysRoleGroup`)

## 操作权限设计

### 资源/角色/权限组/用户的关系

> ` sysResources<-sysRole ->sysRoleGroup<- sysGroup ->sysUser`

- 每个资源`sysResource`有一个归属角色`sysRole`,
- 角色`sysRole`与权限组`sysGroup`是多对多关联->`sysRoleGroup`
- 用户`sysUser`是和权限组`sysGroup`关联的.

通过这样的关联关系,让`用户`拥有该他所在权限组对应角色下的所有资源的权限.

## 代码生成

访问[http://admin.vlife.cc](http://admin.vlife.cc)上传后端`title.json` 文件可以生成和服务端匹配的出参入参数据模型定义代码,和 API 接口的调用代码.

### 数据模型代码

示例,可生成出参\入参的数据模型接口和中文注释
`/src/mvc/sysArea.ts`

```typescript
// 行政区划
export interface SysArea extends DbEntity {
  code: string; // 区划编码
  pcode: string; // 上级地区编码
  level: string; // 地区类型
  name: string; // 区划名称
}
// 地区查询条件
export interface SysAreaPageReq extends PageQuery {
  level: string[]; // 地区类型
  name: string; // 区划名称
}
```

### API 请求代码

示例:可生成与服务端完全一致的 API 接口调用代码
`/src/mvc/sysArea.ts`

```typescript
/**
 * 保存行政区划;
 * @param dto 行政区划;
 * @return 行政区划;
 */
export const save = (dto: SysArea): Promise<Result<SysArea>> => {
  return apiClient.post(`/sysArea/save`, { params: dto });
};

/**
 * 明细查询行政区划;
 * @param id 主键id;
 * @return 行政区划;
 */
export const detail = (id: string): Promise<Result<SysArea>> => {
  return apiClient.get(`/sysArea/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysArea/remove/${id}`);
};
```

## 联系帮助

- QQ 讨论群：786134846
  ![](http://vlife.wwwlike.cn/static/img/qq_qun_786134846.png)

- 微信：vlifeBoot
  <img src="http://oa.wwwlike.cn/wx.jpg" width=150 height=150 />
