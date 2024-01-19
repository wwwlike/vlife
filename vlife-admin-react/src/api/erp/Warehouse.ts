
import {PageVo,DbEntity,Result,PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 仓库
export interface Warehouse extends DbEntity{
  area: number;  // 仓库面积
  address: string;  // 仓库地址
  name: string;  // 仓库名称
  sysUserId: string;  // 仓库负责人
}
/** 
   * 分页查询仓库;
   * @param req ;
   * @return 仓库;
   */
export const page=(req?: PageQuery): Promise<Result<PageVo<Warehouse>>>=>{
  return apiClient.post(`/warehouse/page`,req||{} );
};

//仓库列表
export const list=(req?: PageQuery): Promise<Result<Warehouse[]>>=>{
  return apiClient.post(`/warehouse/list`,req||{} );
};

/** 
   * 保存仓库;
   * @param warehouse 仓库;
   * @return 仓库;
   */
export const save=(warehouse: Warehouse): Promise<Result<Warehouse>>=>{
  return apiClient.post(`/warehouse/save`  ,warehouse  );
};
/** 
   * 明细查询仓库;
   * @param id 主键id;
   * @return 仓库;
   */
export const detail=(id: string): Promise<Result<Warehouse>>=>{
  return apiClient.get(`/warehouse/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/warehouse/remove`,{data:ids}  );
};