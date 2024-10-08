
import {PageVo,DbEntity,SaveBean,PageQuery,VoBean,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
import { SysGroupResources } from './SysGroupResources';
// 权限组
export interface SysGroup extends DbEntity{
  name: string;  // 角色组名称
  remark: string;  // 描述
  filterType: string;  // 数据维度
}
// 权限组
export interface GroupDto extends SaveBean{
  name: string;  // 组名称
  remark: string;  // 组描述
  filterType: string;  // 数据维度
}
// 角色组分页查询条件
export interface SysGroupPageReq extends PageQuery{
  name: string;  // 组名称
}
// 权限组数据对象封装
export interface GroupVo extends VoBean{
  filterType: string;  //     public Integer scope;
}



// 权限组dto
export interface GroupResourcesDto extends SaveBean{
  sysGroupResourcesList: SysGroupResources[];  // 权限与资源关联
  name: string;  // 权限组名称
  remark: string;  // 描述
  filterType: string;  // 数据维度
}

/** 权限组列表*/
export const listAll=(req?:PageQuery): Promise<Result<SysGroup[]>>=>{
  return apiClient.post(`/sysGroup/list/all`,req||{});
};
/** 权限组查询*/
export const page=(req:SysGroupPageReq): Promise<Result<PageVo<SysGroup>>>=>{
  return apiClient.post(`/sysGroup/page`,req);
};
/** 权限组保存*/
export const saveGroupDto=(dto:GroupDto): Promise<Result<GroupDto>>=>{
  return apiClient.post(`/sysGroup/save/groupDto`,dto);
};
/** 权限组详情*/
export const detail=(req:{id:string}): Promise<Result<SysGroup>>=>{
  return apiClient.get(`/sysGroup/detail/${req.id}`);
};
/** 删除权限组*/
export const remove=(ids:String[]): Promise<Result<number>>=>{
return apiClient.delete(`/sysGroup/remove`,{data:ids});
};

/** 权限组(资源)保存*/
export const saveGroupResourcesDto=(dto:GroupResourcesDto): Promise<Result<GroupResourcesDto>>=>{
  return apiClient.post(`/sysGroup/save/groupResourcesDto`,dto);
};