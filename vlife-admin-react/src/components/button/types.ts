import { IdBean, Result } from '@src/api/base';
import { VfAction } from '@src/dsl/VF';
import {  ReactNode } from 'react';
/**
 * vlife平台按钮数据结构v1.0
 * ------------------------------
 * 2.0完成0代码配置
 */
/**
 * 按钮动作类型
 * # 模型弹出层操作
 * create: 对模型进行操作,新增完后可修改，但是无直接修改权限；disable对其有效
 * edit: 数据修改,没有传saveApi就是预览只读
 * save: 数据新增和修改 是create/edit的合体,disable对新增和修改有效,usableMatch对新增无效；
 * 非模型操作
 * api ：无需模型，直接触发saveApi方法(异步按钮)
 * click:自定义点击事件的按钮 触发的实际onCLick方法(同步按钮)
 */
export type actionType= "create"|"save"|"edit"|"api"|"click"|"flow"|string;
//按钮显示类型
export type btnType= "button" | "icon" | "link";
//场景 按钮位置 tableToolbar：表格工具栏 tableLine |表格行上 | formFooter 表单底部 | page 自定义页面 |dropdown 更多 |  comment 审核说明
export type BtnToolBarPosition = "tableToolbar" | "tableLine" | "formFooter" | "page" |"dropdown" |"comment";

export interface VFBtn{
  title?:string;//按钮名
  icon?:ReactNode;//图标 
  btnType?:btnType;// 按钮类型 "button" | "icon" | "link";
  continueCreate?:boolean;//连续新增 create按钮会出现
  actionType:actionType // 动作类型
  disabled?:boolean;// 布尔方式判断按钮是否不可用
  usableMatch?:any|((...datas:any[])=>string|boolean|Promise<string|boolean>); //表单数据校验按钮可用性 any=>直接比对|函数=>复杂/异步校验 string表示不能使用原因 赋值给tooltip
  tooltip?:string;// 不可用时候的提醒
  className?:string//按钮样式
  reaction?:VfAction[],   //表单内的级联关系配置
  fieldOutApiParams?: { [fieldName: string]: any }; //指定字段访问api取值的补充外部入参
  position?: BtnToolBarPosition; //使用场景
  datas?: any | any[]; //按钮数据
  permissionCode?:string;//权限编码,不传则根据->`实体名:方法名(动作:模型名)`组成 sysUser:save:sysUserDto对应后端sysUser的API下的saveSysUserDto方法
  multiple?:boolean,//是否是对多条数据操作(和按钮展示位置有关，true:展示在列表上，false 展示在详情页)
  model?:string,//当前操作模型;当前操作数据的模型名称,(form模型type,saveData的返回数据类型) 
  submitConfirm?:boolean, //提交之前确认
  disabledHide?:boolean,  //不可用时隐藏
  submitClose?:boolean,   //modal提交后关闭
  comment?:boolean,       //填报意见弹出层(当前仅支持工作流,未规定是否必填)
  otherBtns?:VFBtn[], // 关联按钮信息(弹出层的相关按钮)
  onFormilySubmitCheck?:()=>Promise<boolean>;//内部方法不用关注，数据【提交】之前的校验，使用fomily的主动检查 在formModal里添加
  loadApi?:(data:any)=>Promise<Result<any>|any>,//打开form时模型数据的取值接口(和列表的模型不一致时可传,不传则采用通用查询取值)，
  onSaveBefore?:(data:any)=>any;//提交之前进行数据处理，返回数据给saveData函数
  saveApi?:(...data:(any&{tableSort:number})[])=>Promise<Result<any>>| any//按钮点击后触发的异步或者同步，必须返回数据，该数据返回到外层并且是onSubmitFinish方法作为入参
  onSubmitFinish?:(...saveApiResult:any[])=>void; //提交完成后触发的动作，如：用于关闭弹窗，刷新列表等操作
  onClick?:(...data:(any&{tableSort:number})[])=>void,//一般custom按钮使用，优先级高于saveAPI，一般不做接口类型的操作，不返回数据出去
  //不够好
  divider?:boolean|string; // dropdown的分割线
  //发现以下没有用到
  initData?:any;//初始化数据新增时使用的默认值（没有地方用到）  
  children?: ReactNode;
}

//1. 列表上的数据，每次按钮操作后都需要刷新，因为设计数据变化后，不分数据会流转走，不分数据不在当前页签；所以直接做刷新

//按钮model有值，则api操作后必须返回model数据；可不用刷新页面,直接用model替换列表的哪一行数据

