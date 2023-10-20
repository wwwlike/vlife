
import {DemoTask} from './DemoTask'
import {PageVo,DbEntity,SaveBean,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 项目表
export interface DemoProject extends DbEntity{
  endDate: Date;  // 结束日期
  demoCustomerId: string;  // 甲方客户
  point: number;  // 项目点数
  beginDate: Date;  // 开始日期
  total: number;  // 项目金额
  name: string;  // 项目名称
  sysUserId: string;  // 项目负责人
  status: string;  // 项目状态
}



// // 项目dto
// export interface ProjectDto extends SaveBean{
//   beginDate: Date;  // 开始日期
//   total: number;  // 项目金额
//   endDate: Date;  // 结束日期
//   name: string;  // 项目名称
//   demoCustomerId: string;  // 甲方客户
//   taskList: DemoTask[];  // 任务详情
//   sysUserId: string;  // 项目负责人
//   point: number;  // 工时点数
//   status: string;  // 项目状态
// }

export class ProjectDto implements SaveBean {
  public id:string;
  public endDate: Date;
  public demoCustomerId: string;
  public point: number;
  public beginDate: Date;
  public total: number;
  public name: string;
  public sysUserId: string;
  public status: string;
  public taskList:DemoTask[];

  constructor(
    id:string,
    endDate: Date,
    demoCustomerId: string,
    point: number,
    beginDate: Date,
    total: number,
    name: string,
    sysUserId: string,
    status: string,
    taskList:DemoTask[],
  ) {
    this.id=id;
    this.endDate = endDate;
    this.demoCustomerId = demoCustomerId;
    this.point = point;
    this.beginDate = beginDate;
    this.total = total;
    this.name = name;
    this.sysUserId = sysUserId;
    this.status = status;
    this.taskList=taskList;
  }
}


// 项目查询
export interface DemoProjectPageReq extends PageQuery{
}
/** 
   * 分页查询项目表;
   * @param req 项目查询;
   * @return 项目表;
   */
export const page=(req: DemoProjectPageReq): Promise<Result<PageVo<DemoProject>>>=>{
  return apiClient.get(`/demoProject/page`,{params:req}  );
};
/** 
   * 保存项目dto;
   * @param projectDto 项目dto;
   * @return 项目dto;
   */
export const saveProjectDto=(projectDto: ProjectDto): Promise<Result<ProjectDto>>=>{
  return apiClient.post(`/demoProject/save/projectDto`  ,projectDto  );
};


/** 
   * 保存项目
   */
 export const save=(demoProject: DemoProject): Promise<Result<DemoProject>>=>{
  return apiClient.post(`/demoProject/save`  ,demoProject  );
};
/** 
   * 明细查询项目表;
   * @param id 主键id;
   * @return 项目表;
   */
export const detail=(id: string): Promise<Result<DemoProject>>=>{
  return apiClient.get(`/demoProject/detail/${id}`  );
};

export const detailProjectDto=(id: string): Promise<Result<ProjectDto>>=>{
  return apiClient.get(`/demoProject/detail/projectDto/${id}`  );
};

/** 
   * 逻辑删除;
   * @param ids ;
   * @return 已删除数量;
   */
export const remove=(ids: String[]): Promise<Result<number>>=>{
  return apiClient.delete(`/demoProject/remove`,{data:ids}  );
};