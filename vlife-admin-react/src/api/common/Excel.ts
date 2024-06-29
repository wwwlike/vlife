import { Result } from '../base';
import apiClient from '../base/apiClient';
const apiUrl = import.meta.env.VITE_APP_API_URL;


export interface ExcelUploadFile {
  entityType: string; //所在模块
  file: File; //文件
  override: boolean; //是否覆盖
}

export interface DataImpResult{
  msg:string ;
   //导入结果
  result:boolean;
  //总数据条数
  total:number;
  //导入成功条数
  success:number;
  // 新增条数
  add:number;
  // 覆盖条数
  update:number;
  // 因数据重复跳过数据条数
  skip:number;
  // 异常数据条数
  error:number;
  // 必填数据异常
  error_null:number;
}

//模版下载
export const template = (type: string) =>{
  return apiClient.get(`${apiUrl}/excel/template/${type}`,{responseType: 'blob'});
};


export const importData = (excelUploadFile: Partial<ExcelUploadFile>): Promise<Result<DataImpResult>> =>{
  return apiClient.post(`/excel/importData`, excelUploadFile,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};