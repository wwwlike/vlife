
import {ReportTableItem} from './ReportTableItem'
import {PageVo,DbEntity,SaveBean,Result, ReportQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
import { AnyFunction } from '@formily/core';
// 报表配置(主)
export interface ReportTable extends DbEntity{
  code: string;  // 报表编码
  func: string;  // 分组聚合函数
  name: string;  // 报表名称
  groupColumn: string;  // 分组字段
}
// 报表及关联统计项和指标传输的dto
export interface ReportTableDto extends SaveBean{
  code: string;  // 报表编码
  func: string;  // 分组聚合函数
  kpiIds: string[];  // 指标项
  itemIds: string[];  // 统计项
  name: string;  // 报表名称
  groupColumn: string;  // 分组字段
}
// 报表及关联统计项和指标保存
export interface ReportTableSaveDto extends SaveBean{
  code: string;  // 报表编码
  func: string;  // 分组聚合函数
  name: string;  // 报表名称
  items: Partial< ReportTableItem>[];  // 报表配置明细
  groupColumn: string;  // 分组字段
}
/** 
   * 明细查询报表配置(主);
   * @param id 主键id;
   * @return 报表配置(主);
   */
export const detail=(id: string): Promise<Result<ReportTable>>=>{
  return apiClient.get(`/reportTable/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/reportTable/remove/${id}`  );
};
/** 
   * 报表保存
   */
export const saveReportTableSaveDto=(dto: Partial<ReportTableSaveDto>): Promise<Result<ReportTableSaveDto>>=>{
  return apiClient.post(`/reportTable/save/reportTableSaveDto`  ,dto  );
};
/** 
   * 所有配置报表
   */
export const listAll=(): Promise<Result<ReportTableSaveDto[]>>=>{
  return apiClient.get(`/reportTable/list/all`  );
};

/** 
   * ]
   * @param req
   * @return
   */
   export const report=(req: ReportQuery): Promise<Result<Map<any,any>[]>>=>{
    return apiClient.get(`/reportTable/report`,{params:req}  );
  };

  /** 
     * 单个统计值指标code查询
     * @return
     */
  export const total=(code: string): Promise<Result<Number>>=>{
    return apiClient.get(`/reportTable/total/${code}`  );
  };