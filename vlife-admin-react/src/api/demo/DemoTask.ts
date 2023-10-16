
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// export interface DemoTask extends DbEntity{
//   name: string;  // 任务名称
//   demoProjectId: string;  // 所属项目
//   remark: string;  // 任务说明
//   sysUserId: string;  // 任务负责人
//   type: string;  // 任务类型
//   point: number;  // 任务点数
// }


export class DemoTask implements DbEntity{
  public id:string;
  public name: string;  // 任务名称
  public demoProjectId: string;  // 所属项目
  public remark: string;  // 任务说明
  public sysUserId: string;  // 任务负责人
  public type: string;  // 任务类型
  public point: number;  // 任务点数


  constructor(
     id:string,
     name: string, // 任务名称
     demoProjectId: string,  // 所属项目
     remark: string, // 任务说明
     sysUserId: string,  // 任务负责人
     type: string,  // 任务类型
     point: number, // 任务点数
  
  ) {
    this.id=id;
    this.name=name;
    this.demoProjectId=demoProjectId;
    this.remark=remark;
    this.sysUserId=sysUserId;
    this.type=type;
    this.point=point;
  }
}
/** 
   * 分页查询实体demoTask;
   * @param req ;
   * @return 实体demoTask;
   */
export const page=(req: PageQuery): Promise<Result<PageVo<DemoTask>>>=>{
  return apiClient.get(`/demoTask/page`,{params:req}  );
};
/** 
   * 保存实体demoTask;
   * @param demoTask 实体demoTask;
   * @return 实体demoTask;
   */
export const save=(demoTask: DemoTask): Promise<Result<DemoTask>>=>{
  return apiClient.post(`/demoTask/save`  ,demoTask  );
};
/** 
   * 明细查询实体demoTask;
   * @param id 主键id;
   * @return 实体demoTask;
   */
export const detail=(id: string): Promise<Result<DemoTask>>=>{
  return apiClient.get(`/demoTask/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/demoTask/remove`,{data:ids}  );
};