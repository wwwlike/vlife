
import {PageVo,DbEntity,Result, PageQuery} from '@src/api/base'

import apiClient from '@src/api/base/apiClient'
import { BtnToolBarPosition } from '@src/components/button/types';
import { FormRuleDto } from './FormRule';
// 按钮
export interface Button extends DbEntity{
  sysMenuId: string;  // 所在菜单
  formId: string;  // 模型 id
  sysResourcesId: string;  // 接口
  position:BtnToolBarPosition;//位置
  icon: string;  // 图标
  title: string;  // 按钮名称
  submitConfirm: boolean;  // 确认提醒
  disabledHide: boolean;  // 禁用时隐藏
  conditionJson:string;// 按钮可用条件（组装unableMatch函数）
  activeTabKey:string //按钮能运行的页签
  sort: number;  // 排序号
  formVoJson:string;//模型信息
  code:string;//按钮标识
  //------用户不可见字段
  // formTitle: string;  // 按钮表单名称
  // toActiveTabKey: string;  // 完成后去到的场景页签
  // btnType: string;  // 样式
  // tooltip: string;  // 不可用时提示
  // actionType: string;  // 类型
  // model: string;  // 表单模型
  // multiple: boolean;  // 处理多条记录
  // remark: string;  // 按钮说明
}


export interface ButtonVo extends Button{
  rules:FormRuleDto[]
  
}
/** save*/
export const save=(dto:Button): Promise<Result<Button>>=>{
  return apiClient.post(`/button/save`,dto);
};


export const moveUp=(dto:Button): Promise<Result<Button>>=>{
  return apiClient.post(`/button/moveUp`,dto);
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


export const list=(req?:PageQuery): Promise<Result<ButtonVo[]>>=>{
  return Promise.resolve({ data: [],code: "200", msg: "" }); 
  // return apiClient.post(`/button/list/buttonVo`,req);
};

export const moveDown=(dto:Button): Promise<Result<Button>>=>{
  return apiClient.post(`/button/moveDown`,dto);
};