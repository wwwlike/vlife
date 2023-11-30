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
 * create:需要对模型进行操作
 * edit: 模型编辑，保存修改
 * view: 模型预览，只读查看
 * api ：
 * click:自定义点击事件的按钮
 */
export type actionType= "create"|"edit"|"api"|"click";

export interface VFBtn{
  title:string;//按钮名称 ●
  tooltip?:string;// 不可用时候的提醒
  disabled?:boolean;// 当前是否不可用
  icon?:ReactNode;
  actionType:actionType //动作类型：和模型表单有关的：create|edit|createEdit|view；
  //1:boolean判断能否使用|2:属性对象完全匹配|3：函数校验(同步异步)string表示不能使用原因
  usableMatch?:boolean|any|((...datas:any[])=>string|boolean|Promise<string|boolean>);
  className?:string//按钮样式
  initData?:any;//初始化数据新增时使用的默认值
  permissionCode?:string;//权限编码,不传则根据->`实体名:方法名(动作:模型名)`组成 sysUser:save:sysUserDto对应后端sysUser的API下的saveSysUserDto方法
  multiple?:boolean,//是否是对多条数据操作(和按钮展示位置有关，true:展示在列表上，false 展示在详情页)
  model?:string,//当前操作模型;当前操作数据的模型名称,(form模型type,saveData的返回数据类型) 
  submitConfirm?:boolean,//提交之前是否确认
  disabledHide?:boolean,//不可以用时是否隐藏
  submitClose?:boolean,//model层面的接口调用完成后是否关闭页面
  reaction?:VfAction[],//表单内的级联关系
  onSaveBefore?:(data:any)=>any;//提交之前进行数据处理，返回数据给saveData函数
  onSubmitFinish?:(...datas:any[])=>void; //提交完成后触发的函数
  onFormilySubmitCheck?:()=>Promise<boolean>;//内部方法不用关注，数据【提交】之前的校验，使用fomily的主动检查 在formModal里添加
  onClick?:(...data:(any&{tableSort:number})[])=>void,//点击按钮触发的自定义事件，一般不用作接口访问，用在custom按钮使用
  //按钮触发动作
  saveApi?:(...data:(any&{tableSort:number})[])=>Promise<Result<any>>//保存类型接口
  loadApi?:(data:any)=>Promise<Result<any>|any>,
  //  loadApi?<T extends IdBean,S extends IdBean>(data: T): undefined| Promise<Result<S>|S>//查看详情的接口，和列表模型不一致则需要传，否则根据模型名称计算得到(采用vlife里的通用查询)


}