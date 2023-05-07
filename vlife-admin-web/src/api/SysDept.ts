
import apiClient from "@src/api/base/apiClient";
import { PageVo, DbEntity, PageQuery, Result, ITree,SaveBean } from "./base";
// 科室部门
export interface SysDept extends DbEntity,ITree {
  code: string; // 部门编码
  sysOrgId: string; // 机构
  name: string; // 部门名称
}
// 部门查询条件
export interface SysDeptPageReq extends PageQuery {
  deptName: string; // 名称/编码
  sysOrgId: string; // 机构
}

export interface SysDeptUserDto extends SaveBean{
  sysUser_id: string[];  // 用户
  code: string;  // 编码
  pcode: string;  // 上级部门
  name: string;  // 部门名称
}

/** */
export const listAll = (params: {
  entityName: string;
}): Promise<Result<SysDept[]>> => {
  return apiClient.get(`/sysDept/list/all`, { params: params });
};
/**
 * 分页查询null;
 * @param req 部门查询条件;
 * @return null;
 */
export const page = (req: SysDeptPageReq): Promise<Result<PageVo<SysDept>>> => {
  return apiClient.get(`/sysDept/page`, { params: req });
};
/**
 * 保存null;
 * @param dto null;
 * @return null;
 */
export const save = (dto: SysDept): Promise<Result<SysDept>> => {
  return apiClient.post(`/sysDept/save`, { params: dto });
};


/** */
export const sysDeptUserDto=(dto: SysDeptUserDto): Promise<Result<SysDeptUserDto>>=>{
  return apiClient.post(`/sysDept/save/sysDeptUserDto`  ,dto  );
};

/**
 * 明细查询null;
 * @param id 主键id;
 * @return null;
 */
export const detail = (id: string): Promise<Result<SysDept>> => {
  return apiClient.get(`/sysDept/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysDept/remove/${id}`);
};
