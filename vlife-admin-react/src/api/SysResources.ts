import apiClient from "@src/api/base/apiClient";
import { RoleDto } from "@src/api/SysRole";
import { SysRoleGroup } from "@src/api/SysRoleGroup";
import { PageVo, DbEntity, SaveBean, PageQuery, VoBean, Result, ITree, IFkItem } from "@src/api/base";
import qs from "qs";
import { Options } from 'ahooks/lib/useRequest/src/types';
import { useRequest } from 'ahooks';

// 权限资源
export interface SysResources extends DbEntity ,ITree,IFkItem {
  code: string; // 归属菜单
  pcode: string; // 上级权限
  icon: string; // 图标
  sysRoleId: string; // 归属角色
  resourcesType: string; // 资源类型
  url: string; // 路由地址
  name: string; // 资源名称
  menuRequired:boolean;//是否主要的API；
  sysMenuId:string,//关联菜单
  entityType:string, //关联实体
  actionType:string,//所在action  
  remark:string//说明
  formId:string//所属板块
  permission:string;//授权方式
  methedType:string;
  param:string;//    参数名
  paramType:string;//参数类别
  paramWrapper:string; //参数类型
  paramGeneric:string; //参数泛型
  returnClz:string; //出参类型
  returnType:string; //出参类别
  returnGeneric:string; //出参泛型
  state:string;//状态 1正常 2待启用
}
// 类说明
export interface ResourcesDto extends SaveBean {
  sysRole: RoleDto; // 用户角色
  name: string; // 资源名称
  sysRoleId: string; // 归属角色
  sysRole_sysRoleGroup: SysRoleGroup[]; // 角色聚合组
}


// 资源批量操作dto
export interface ResourcesStateDto extends SaveBean {
  resourcesIds: string[]; // 启用的权限id集合
}


// 资源页面
export interface SysResourcesPageReq extends PageQuery {
  search: string; // 名称/编码/地址
  sysRoleId: string; // 接口角色
  type: string; // 资源类型
}
// 类说明
export interface ResourcesVo extends VoBean {
  pcode: string; // 上级权限
  groupIds: string[]; // 资源对应的角色组
  url: string; // 请求路径
}
/**
 * 保存权限资源;
 * @param dto 权限资源;
 * @return 权限资源;
 */
export const save = (dto: SysResources): Promise<Result<SysResources>> => {
  return apiClient.post(`/sysResources/save`, dto);
};

export const saveImport = (
  dto: SysResources
): Promise<Result<SysResources>> => {
  return apiClient.post(`/sysResources/save/import`, dto);
};

/**
 * 明细查询权限资源;
 * @param id 主键id;
 * @return 权限资源;
 */
export const detail = (id: string): Promise<Result<SysResources>> => {
  return apiClient.get(`/sysResources/detail/${id}`);
};
/**
 * 角色应该有的资源权限，因该去掉，交给前端过滤
 * params.id 是所有接口调用必须穿的参数
 * @param sysRoleId
 * @return
 */
export const roleAllResources = (params: {
  id: string;
}): Promise<Result<SysResources[]>> => {
  return apiClient.get(`/sysResources/roleAllResources/${params.id}`);
};
// /**
//  * 全量的资源数据
//  */
// export const list = (params: {
//   sysMenuId?: string;
//   ids?: string[];
//   formId?: string;
// }): Promise<Result<SysResources[]>> => {
//   return apiClient.get(`/sysResources/list`,{params:{...params}});
// };

/**
 * 
 * @param params 资源查询
 * @returns 
 */
export const list = (params?: PageQuery): Promise<Result<SysResources[]>> => {
  return apiClient.post(`/sysResources/list`,params||{});
};



/**
 * 按钮可绑定资源
 */
 export const listButtons = (params?: PageQuery): Promise<Result<SysResources[]>> => {
  return apiClient.post(`/sysResources/listButtons`,params||{});
};


//请求菜单可访问的资源
export const listMenuUseableResources = (params:{sysMenuId:string}): Promise<Result<SysResources[]>> => {
  return apiClient.get(`/sysResources/list/menuUseableResources`,{params});
};

/**
 * 待导入的资源
 */
export const pageImport = (
  req: SysResourcesPageReq
): Promise<Result<PageVo<SysResources>>> => {
  return apiClient.get(
    `/sysResources/page/import?${qs.stringify(req, {
      allowDots: true, //多级对象转str中间加点
      arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
    })}`
  );
};

/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysResources/remove/${id}`);
};
/** */
export const page = (
  req: SysResourcesPageReq
): Promise<Result<PageVo<SysResources>>> => {
  return apiClient.get(`/sysResources/page`, { params: req });
};


/** 
  * 单个模块的所有接口&菜单（数据库+title结合)
  * @param menuCode
  * @return
  * @throws IOException
  */
 export const menuResources=(menuCode: string): Promise<Result<SysResources[]>>=>{
  return apiClient.get(`/sysResources/menuResources/${menuCode}`  );
};


/** 
  * 一次批量保存资源
  * @return
  */
 export const saveResources=(resources: Partial<SysResources>[]): Promise<Result<number>>=>{
  return apiClient.post(`/sysResources/save/resources`  ,resources  );
};



/**
 * 保存权限资源;
 * @param dto 权限资源;
 * @return 权限资源;
 */
 export const saveResourcesStateDto = (dto: ResourcesStateDto): Promise<Result<ResourcesStateDto>> => {
  return apiClient.post(`/sysResources/save/resourcesStateDto`, dto);
};
