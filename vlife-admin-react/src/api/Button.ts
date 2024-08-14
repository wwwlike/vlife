
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'

import apiClient from '@src/api/base/apiClient'
// 按钮
export interface Button extends DbEntity{
  sysMenuId: string;  // 所在菜单
  formId: string;  // 模型 id
  sysResourcesId: string;  // 接口
  icon: string;  // 图标
  title: string;  // 按钮名称
  submitConfirm: boolean;  // 确认提醒
  disabledHide: boolean;  // 禁用时隐藏
  conditionJson:string;// 按钮可用条件（组装unableMatch函数）
  formTitle: string;  // 按钮表单名称
  toActiveTabKey: string;  // 完成后去到的场景页签
  sort: number;  // 排序号
  btnType: string;  // 样式
  tooltip: string;  // 不可用时提示
  //------待移除
  remark: string;  // 按钮说明
  actionType: string;  // 类型
  model: string;  // 表单模型
  multiple: boolean;  // 处理多条记录
}
/** save*/
export const save=(dto:Button): Promise<Result<Button>>=>{
  return apiClient.post(`/button/save`,dto);
};
/** page*/
export const page=(req:PageQuery): Promise<Result<PageVo<Button>>>=>{
  return apiClient.post(`/button/page`,req);
};
/** detail*/
export const detail=(req:{id:string}): Promise<Result<Button>>=>{
  return apiClient.get(`/button/detail/${req.id}`);
};
/** remove*/
export const remove=(ids:string[]): Promise<Result<number>>=>{
  return apiClient.delete(`/button/remove`,{data:ids});
};


export const list=(req?:PageQuery): Promise<Result<Button[]>>=>{
  return apiClient.post(`/button/list`,req);
};