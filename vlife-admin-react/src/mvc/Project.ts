import apiClient from "./apiClient";
import { PageVo, DbEntity, PageQuery, Result } from "./base";
// 项目管理
export interface Project extends DbEntity {
  projectNo: string; // 项目编号
  sysOrgId: string; // 甲方
  name: string; // 项目名称
  state: string; // 项目阶段
  sysUserId: string; // 负责人
  startDate: Date; // 启动日期
}
// 查询条件
export interface ProjectPageReq extends PageQuery {
  sysOrgId: string; // 甲方
  name: string; // 项目名称
  state: string[]; // 项目阶段
  sysUserId: string[]; // 负责人
  startDate: Date[]; // 启动日期
}

//-------------------------api调用代码----------------------
/**
 * 分页查询项目管理;
 * @param req 类说明;
 * @return 项目管理;
 */
export const page = (req: ProjectPageReq): Promise<Result<PageVo<Project>>> => {
  return apiClient.get(`/project/page`, { params: req });
};
/**
 * 保存项目管理;
 * @param dto 项目管理;
 * @return 项目管理;
 */
export const save = (dto: Project): Promise<Result<Project>> => {
  return apiClient.post(`/project/save`, { params: dto });
};
/**
 * 明细查询项目管理;
 * @param id 主键id;
 * @return 项目管理;
 */
export const detail = (id: string): Promise<Result<Project>> => {
  return apiClient.get(`/project/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/project/remove/${id}`);
};
