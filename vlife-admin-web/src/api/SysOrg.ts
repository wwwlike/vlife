


import apiClient from '@src/api/base/apiClient'
import {PageVo,DbEntity,PageQuery,VoBean,Result, ITree} from '@src/api/base'
// 机构
export interface SysOrg extends DbEntity,ITree{
  enableDate: Date;  // 启用日期
  code: string;  // 编码
  pcode: string;  // 上级机构
  orgcode: string;  // 组织机构代码
  type: string;  // 机构分类
  sysAreaId: string;  // 地区
  name: string;  // 机构名称
}
// 机构查询条件
export interface SysOrgPageReq extends PageQuery{
  code: string;  // 机构信息
  name: string;  // 机构名称/代码
  type: string;  // 机构类型
  sysArea_code: string;  // 区划地区
}
// 类说明
export interface OrgVo extends VoBean{
  name: string;  // 机构名称
}
/** 
* 分页查询;
* @param req 机构查询条件;
* @return null;
*/
export const page=(req: SysOrgPageReq): Promise<Result<PageVo<SysOrg>>>=>{
  return apiClient.get(`/sysOrg/page`,{params:req}  );
};
/** 
* 机构保存;
* @param dto 机构信息;
* @return ;
*/
export const save=(dto: SysOrg): Promise<Result<SysOrg>>=>{
  return apiClient.post(`/sysOrg/save`  ,dto  );
};
/** 
* 明细查询null;
* @param id 主键id;
* @return null;
*/
export const detail=(id: string): Promise<Result<SysOrg>>=>{
  return apiClient.get(`/sysOrg/detail/${id}`  );
};
/** 
* 逻辑删除;
* @param id 主键id;
* @return 已删除数量;
*/
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/sysOrg/remove/${id}`  );
};


/**
 * 树型组件数据
 */
 export const listAll = (params: {
  entityName: string;
}): Promise<Result<SysOrg[]>> => {
  return apiClient.get(`/sysOrg/list/all`, { params });
};
