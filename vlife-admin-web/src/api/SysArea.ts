
import apiClient from "@src/api/base/apiClient";
import { PageVo, DbEntity, PageQuery, VoBean, Result, ITree } from "./base";
// 行政区划
export interface SysArea extends DbEntity,ITree {
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
export interface AreaVo extends VoBean {
  name: string; // 区划名称
  createDate: Date; // 创建时间
}
/**
 * 分页查询行政区划;
 * @param req 地区查询条件;
 * @return 行政区划;
 */
export const page = (req: SysAreaPageReq): Promise<Result<PageVo<SysArea>>> => {
  return apiClient.get(`/sysArea/page`, { params: req });
};
/**
 * 保存行政区划;
 * @param dto 行政区划;
 * @return 行政区划;
 */
export const save = (dto: SysArea): Promise<Result<SysArea>> => {
  return apiClient.post(`/sysArea/save`, { params: dto });
};
/** */
export const listAll = (params: {
  entityName: string;
}): Promise<Result<SysArea[]>> => {
  return apiClient.get(`/sysArea/list/all`, { params: params });
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
