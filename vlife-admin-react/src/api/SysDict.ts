import apiClient from "@src/api/base/apiClient";
import { PageVo, DbEntity, PageQuery, Result } from "@src/api/base";
// 字典表
export interface SysDict extends DbEntity {
  val: string | undefined; // 选项值
  code: string; // 编码
  sort: number; // 排序号
  color:'amber' | 'blue' | 'cyan' | 'green' | 'grey' | 'indigo' | 'light-blue' | 'light-green' | 'lime' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'violet' | 'yellow' | 'white'; //颜色代码
  title: string; // 选项名
  sys: boolean; // 系统项
  dictType:boolean;//是否字典类别
}
// 类说明
export interface SysDictPageReq extends PageQuery {
  code: string; // 编码
  title: string; // 名称
  sys: boolean; // 系统项
  queryType: boolean; // 跳过检查
}
/** */
export const page = (req: SysDictPageReq): Promise<Result<PageVo<SysDict>>> => {
  return apiClient.get(`/sysDict/page`, { params: req });
};
/** */
export const all = (): Promise<Result<SysDict[]>> => {
  return apiClient.get(`/sysDict/all`);
};

export const listType=(): Promise<Result<SysDict[]>>=>{
  return apiClient.get(`/sysDict/list/type`  );
};

export const listByCode = ({
  code,
}: {
  code: string;
}): Promise<Result<SysDict[]>> => {
  return apiClient.get(`/sysDict/listByCode?code=${code}`);
};

/**
 * 保存字典表;
 * @param dto 字典表;
 * @return 字典表;
 */
export const save = (sysDict: Partial<SysDict>): Promise<Result<SysDict>> => {
  return apiClient.post(`/sysDict/save`, sysDict);
};
/**
 * 明细查询字典表;
 * @param id 主键id;
 * @return 字典表;
 */
export const detail = (id: string): Promise<Result<SysDict>> => {
  return apiClient.get(`/sysDict/detail/${id}`);
};

/**
 * 逻辑删除;
 */
 export const remove = (ids: string[]): Promise<Result<number>> => {
  return apiClient.delete(`/sysDict/remove`,{data:ids});
};

/** */
export const sync = (): Promise<Result<SysDict[]>> => {
  return apiClient.get(`/sysDict/sync`);
};
