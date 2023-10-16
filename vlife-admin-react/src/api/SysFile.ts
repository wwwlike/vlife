import apiClient from "@src/api/base/apiClient";
import { DbEntity, Result } from "@src/api/base/";
// 文件存储
export interface SysFile extends DbEntity {
  fileName: string; // 存放文件名
  size: string; // 文件大小
  name: string; // 原文件名
  url: string; // 访问地址
  viewMode: string; // 文件展现形式
}

/**
 * 批量查询
 */
export const details = (req: {ids:string[]}): Promise<Result<SysFile>> => {
  return apiClient.get(`/sysFile/details`,{params:req});
};


/**
 * 测试单个简单基础数据返回
 */
 export const test = (): Promise<Result<string>> => {
  return apiClient.get(`/sysFile/test`);
};


/**
 * 测试对象返回
 */
 export const test1 = (): Promise<Result<any>> => {
  return apiClient.get(`/sysFile/test1`);
};


/**
 * 测试数组对象返回
 */
 export const test2 = (): Promise<Result<any[]>> => {
  return apiClient.get(`/sysFile/test2`);
};
/**
 * 保存文件存储;
 *
 * @param dto 文件存储;
 * @return 文件存储;
 */
export const save = (dto: SysFile): Promise<Result<SysFile>> => {
  return apiClient.post(`/sysFile/save`, dto);
};
/**
 * 逻辑删除;
 *
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysFile/remove/${id}`);
};
