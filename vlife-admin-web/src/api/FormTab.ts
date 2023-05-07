
import apiClient from '@src/api/base/apiClient'
import {  DbEntity, Result, SaveBean } from '@src/api/base'
// import { FormGroup } from '@src/api/FormGroup';

// 表单页签
export interface FormTab extends DbEntity{
  formId: string;  // 所在表单
  code: string;  // 组件编号
  name: string;  // Tab名称
  sort: number;  // 同级序号
}
// 页签dto
export interface FormTabDto extends SaveBean{
  formId: string;  // 所在表单
  code: string;  // 组件编号
  // formGroups: FormGroup[];  // 表单容器
  name: string;  // Tab名称
  sort: number;  // 同级序号
}
/** 
   * 保存页签dto;
   * @param dto 页签dto;
   * @return 页签dto;
   */
export const save=(dto: FormTabDto): Promise<Result<FormTabDto>>=>{
  return apiClient.post(`/formTab/save`  ,dto  );
};
/** 
   * 明细查询表单页签;
   * @param id ;
   * @return 表单页签;
   */
export const detail=(id: string): Promise<Result<FormTab>>=>{
  return apiClient.get(`/formTab/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id ;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/formTab/remove/${id}`  );
};