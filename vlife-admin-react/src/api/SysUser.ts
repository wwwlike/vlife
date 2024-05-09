
import {MenuVo} from './SysMenu'
import {SysDept} from './SysDept'
import {IFkItem,IModel,PageVo,DbEntity,SaveBean,PageQuery,VoBean,IUser,Result} from '@src/api/base'
import apiClient,{stringify} from '@src/api/base/apiClient'
// 用户表
export interface SysUser extends DbEntity,IFkItem,IUser{
  thirdId: string;  // 第三方id
  avatar: string;  // 头像
  sysDeptId: string;  // 部门
  source: string;  // 用户来源
  idno: string;  // 证件号
  loginNum: number;  // 登录次数
  superUser: boolean;  // 超级用户
  password: string;  // 密码
  name: string;  // 姓名
  tel: string;  // 电话
  state: string;  // 启用状态
  thirdToken: string;  // 第三方的token
  usetype: string;  // 用户类型
  sysGroupId: string;  // 权限组
  email: string;  // 邮箱
  age: number;  // 年龄
  username: string;  // 用户名
}
// 注册信息
export interface RegisterDto extends IModel{
  password: string;  // 密码
  email: string;  // 邮箱账号
  checkCode: string;  // 校验码
}
// 第三方账号信息
export interface ThirdAccountDto extends IModel{
  name: string;  // 中文
  from: string;  // 来源
  avatar: string;  // 头像
  thirdToken: string;  // 三方账号临时token
  email: string;  // 邮箱
  username: string;  // 账号
  token: string;  // 本系统token
}
// 密码修改dto
export interface UserPasswordModifyDto extends SaveBean{
  password: string;  // 原密码
  newPassword: string;  // 新密码
}
// 用户列表查询
export interface SysUserPageReq extends PageQuery{
  id:string[]
  search: string;  // 姓名/手机/证件/用户名
  sysDept_code: string;  // 部门
}
// 用户详细信息
export interface UserDetailVo extends VoBean{
  name: string;  // 用户名
  avatar: string;  // 头像
  sysDeptId: string;  // 部门id
  menus: MenuVo[];  // 用户能够访问到的所有菜单信息
  sysDept: SysDept;  // 科室部门
  codeDept: string;  // 部门代码
  sysGroupId: string;  // 权限组
  resourceCodes: string[];  // 用户有的权限资源代码 权限组->角色权限->角色->资源——资源编码
  username: string;  // 账号
  superUser: boolean;  // 超级用户
  state:string;//用户状态
  groupName: string;  // 权限组名称
  groupFilterType:string;//数据维度
}
// 用户列表信息
export interface UserVo extends VoBean{
  groupName: string;  // 角色组名称
  name: string;  // 用户名
  tel: string;  // 联系电话
  avatar: string;  // 头像
  state: string;  // 启用状态
  idno: string;  // 证件号码
  usetype: string;  // 用户类型
  username: string;  // 账号
}

/** 用户查询 */
export const list=(req: Partial<SysUserPageReq>): Promise<Result<SysUser[]>>=>{
  return apiClient.post(`/sysUser/list`,req);
};
/** 分页查询*/
export const page=(req:SysUserPageReq): Promise<Result<PageVo<SysUser>>>=>{
  return apiClient.post(`/sysUser/page`,req);
};
/** 密码重置*/
export const reset=(ids:String[]): Promise<Result<number>>=>{
  return apiClient.post(`/sysUser/reset`,ids);
};
/** 密码修改*/
export const saveUserPasswordModifyDto=(userPasswordModifyDto:UserPasswordModifyDto): Promise<Result<boolean>>=>{
  return apiClient.post(`/sysUser/save/userPasswordModifyDto`,userPasswordModifyDto);
};
/** 用户保存*/
export const save=(sysUser:SysUser): Promise<Result<SysUser>>=>{
  return apiClient.post(`/sysUser/save`,sysUser);
};
/** 用户详情*/
export const detail=(req:{id:string}): Promise<Result<SysUser>>=>{
  return apiClient.get(`/sysUser/detail/${req.id}`,{params:req});
};
/** 用户删除*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/sysUser/remove`,{data:ids});
};
/** 当前用户*/
export const currUser=(): Promise<Result<UserDetailVo>>=>{
  return apiClient.get(`/sysUser/currUser`);
};
/** 邮箱唯一性校验*/
export const checkEmail=(req:{email:string}): Promise<Result<number>>=>{
return apiClient.get(`/sysUser/checkEmail`,{params:req});
};
/** 启用停用*/
export const state=(dto:{state:string,id:string}): Promise<Result<SysUser>>=>{
  return apiClient.post(`/sysUser/state?${stringify(dto)}`);
};