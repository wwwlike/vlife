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
export type actionType= "create"|"save"|"edit"|"api"|"click";

export interface VFBtn{
  title?:string;//按钮名称(入口名称)
  icon?:ReactNode;//图标 
  onlyIcon?:string[]|true,//只显示图标的场景，true表示仅显示图标
  continueCreate?:boolean;//连续新增 create按钮会出现
  actionType:actionType // 动作类型
  disabled?:boolean;// 当前是否不可用
  usableMatch?:any|((...datas:any[])=>string|boolean|Promise<string|boolean>); //表单数据校验按钮可用性 any=>直接比对|函数=>复杂/异步校验 string表示不能使用原因 赋值给tooltip
  tooltip?:string;// 不可用时候的提醒
  className?:string//按钮样式
  initData?:any;//初始化数据新增时使用的默认值
  permissionCode?:string;//权限编码,不传则根据->`实体名:方法名(动作:模型名)`组成 sysUser:save:sysUserDto对应后端sysUser的API下的saveSysUserDto方法
  multiple?:boolean,//是否是对多条数据操作(和按钮展示位置有关，true:展示在列表上，false 展示在详情页)
  model?:string,//当前操作模型;当前操作数据的模型名称,(form模型type,saveData的返回数据类型) 
  submitConfirm?:boolean,//提交之前是否确认
  disabledHide?:boolean,//不可以用时是否隐藏
  submitClose?:boolean,//model层面的接口调用完成后是否关闭页面
  reaction?:VfAction[],//表单内的级联关系
  fieldOutApiParams?: { [fieldName: string]: any }; //指定字段访问api取值的补充外部入参
  onSaveBefore?:(data:any)=>any;//提交之前进行数据处理，返回数据给saveData函数
  onSubmitFinish?:(...datas:any[])=>void; //提交完成后触发的函数
  onFormilySubmitCheck?:()=>Promise<boolean>;//内部方法不用关注，数据【提交】之前的校验，使用fomily的主动检查 在formModal里添加
  onClick?:(...data:(any&{tableSort:number})[])=>void,//点击按钮触发的自定义事件actionType='click'，一般不做接口访问，用在custom按钮使用
  //按钮触发动作
  saveApi?:(...data:(any&{tableSort:number})[])=>Promise<Result<any>>//保存类型接口
  loadApi?:(data:any)=>Promise<Result<any>|any>,
  //  loadApi?<T extends IdBean,S extends IdBean>(data: T): undefined| Promise<Result<S>|S>//查看详情的接口，和列表模型不一致则需要传，否则根据模型名称计算得到(采用vlife里的通用查询)


}