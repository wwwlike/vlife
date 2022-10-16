
import apiClient from './apiClient'
import {PageVo,DbEntity,Result} from './base'
// 角色聚合组
export interface SysRoleGroup extends DbEntity{
  sysRoleId: string;  // 角色
  sysGroupId: string;  // 角色组
}
/** 
   * 保存角色聚合组;
   * @param dto 角色聚合组;
   * @return 角色聚合组;
   */
export const save=(dto: SysRoleGroup): Promise<Result<SysRoleGroup>>=>{
  return apiClient.post(`/sysRoleGroup/save`,{params:dto}  );
};
/** 
   * 明细查询角色聚合组;
   * @param id 主键id;
   * @return 角色聚合组;
   */
export const detail=(id: string): Promise<Result<SysRoleGroup>>=>{
  return apiClient.get(`/sysRoleGroup/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/sysRoleGroup/remove/${id}`  );
};