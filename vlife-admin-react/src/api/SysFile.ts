import apiClient from "@src/api/base/apiClient";
import { DbEntity, PageQuery, Result } from "@src/api/base/";
const apiUrl = import.meta.env.VITE_APP_API_URL;
// 文件存储
export interface SysFile extends DbEntity {
  fileName: string; // 存放文件名
  fileSize: number; // 文件大小
  name: string; // 原文件名
  url: string; // 访问地址
  viewMode: string; // 文件展现形式
  projectId: string; // 项目id
  relationId:string; // 关联id
}

/**
 * 批量查询
 */
export const details = (req: {ids:string[]}): Promise<Result<SysFile>> => {
  return apiClient.get(`/sysFile/details`,{params:req});
};



/**
 * 保存文件存储;
 *
 * @param dto 文件存储;
 * @return 文件存储;
 */
export const save = (dto: Partial<SysFile>[]): Promise<Result<SysFile[]>> => {
  return apiClient.post(`/sysFile/save`, dto);
};
/**
 * 逻辑删除;
 *
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (ids: string[]): Promise<Result<number>> => {
  return apiClient.delete(`/sysFile/remove`,{data:ids});
};


/**
 * 逻辑删除;
 *
 * @param id 主键id;
 * @return 已删除数量;
 */
 export const list = (req:PageQuery ): Promise<Result<SysFile[]>> => {
  return apiClient.post(`/sysFile/list`,req);

};

export const upload=(formData:FormData): Promise<Result<SysFile[]>> => {
  return apiClient.post(`/sysFile/uploadImg`,formData);
};

//模版下载
export const download = (id: string) =>{
  return apiClient.get(`/sysFile/download/${id}`,{responseType: 'blob'});
};
