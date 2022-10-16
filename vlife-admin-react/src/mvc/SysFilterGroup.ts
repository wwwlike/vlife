
import apiClient from './apiClient'
import {PageVo,DbEntity,Result} from './base'
// 权限组和查询权限绑定关系
export interface SysFilterGroup extends DbEntity{
  sysFilterDetailId: string;
  sysGroupId: string;
}
/** 
   * 保存权限组和查询权限绑定关系;
   * @param dto 权限组和查询权限绑定关系;
   * @return 权限组和查询权限绑定关系;
   */
export const save=(dto: SysFilterGroup): Promise<Result<SysFilterGroup>>=>{
  return apiClient.post(`/sysFilterGroup/save`,{params:dto}  );
};
/** 
   * 明细查询权限组和查询权限绑定关系;
   * @param id 主键id;
   * @return 权限组和查询权限绑定关系;
   */
export const detail=(id: string): Promise<Result<SysFilterGroup>>=>{
  return apiClient.get(`/sysFilterGroup/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/sysFilterGroup/remove/${id}`  );
};