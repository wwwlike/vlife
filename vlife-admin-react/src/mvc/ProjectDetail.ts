
import apiClient from './apiClient'
import {PageVo,DbEntity,Result} from './base'
// 类说明
export interface ProjectDetail extends DbEntity{
  name: string;
}
/** 
   * 保存null;
   * @param dto null;
   * @return null;
   */
export const saveProject=(dto: ProjectDetail): Promise<Result<ProjectDetail>>=>{
  return apiClient.post(`/projectDetail/save/project`,{params:dto}  );
};
/** 
   * 明细查询null;
   * @param id null;
   * @return null;
   */
export const detail=(id: string): Promise<Result<ProjectDetail>>=>{
  return apiClient.get(`/projectDetail/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id null;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/projectDetail/remove/${id}`  );
};