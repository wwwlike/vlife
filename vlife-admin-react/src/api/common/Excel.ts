import { Result } from '../base';
import apiClient from '../base/apiClient';
const apiUrl = import.meta.env.VITE_APP_API_URL;


export interface ExcelUploadFile {
  entityType: string; //所在模块
  file: File; //文件
  override: boolean; //是否覆盖
}

//模版下载
export const template = (type: string) =>{
  window.open(`${apiUrl}/excel/template/${type}`);
};


export const importData = (excelUploadFile: Partial<ExcelUploadFile>): Promise<Result<number>> =>{
  return apiClient.post(`/excel/importData`, excelUploadFile,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};