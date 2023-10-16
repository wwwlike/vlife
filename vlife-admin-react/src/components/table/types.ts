// import { Type } from '@douyinfe/semi-ui/lib/es/button';
// import { Result } from '@src/api/base';
// import {  ReactNode } from 'react';
// import { AnyIfEmpty } from 'react-redux';
// /**
//  * vlife平台按钮数据结构v1.0
//  * ------------------------------
//  * 2.0完成0代码配置
//  */
// export interface VFBtn{
//   title:string;//按钮名称 ●
//   icon?:ReactNode//标签 ●
//   className?:string//按钮样式
//   initData?:any;//初始化数据新增时使用的默认值
//   permissionCode?:string;//权限编码
//   //按钮可用性校验（三种方式）
//   usableMatch?:boolean|any|any[];//按钮可用满足其中之一就可用
//   multiple?:boolean,//是否是对多条数据操作(和按钮展示位置有关，true:展示在列表上，false 展示在详情页)
//   actionType:"create"|"edit"|"api"|"view"|"custom" //动作类型(1创建型|2数据展示后修改型|3直接接口操作型())
//   model?:string,//当前操作数据的模型名称,(form模型type,saveData的返回数据类型) 
//   saveDataType?:"id"|"object",//传入到saveData里的入参类型
//   onFormilySubmitCheck?:()=>Promise<boolean>;//数据【提交】之前的校验，使用fomily的主动检查 在formModal里添加
//   onSubmitFinish?:(...datas:any[])=>void; //提交完成后触发的函数
//   submitClose?:boolean,//回调完成是否关闭页面
//   submitConfirm?:boolean,//提交之前是否需要确认
//   disabledHide?:boolean,//禁用隐藏
//   onClick?:(...data:(any&{tableSort:number})[])=>void,//点击按钮触发的自定义事件
//   //按钮触发动作
//   saveData?:(...data:(any&{tableSort:number})[])=>Promise<Result<any>>//数据保存函数，
//   loadData?:(id:string)=>Promise<Result<any>>,//查看详情的接口，和列表模型不一致则需要传，否则根据模型名称计算得到(采用vlife里的通用查询)
//   //预留
//   disableMatch?:any|any[],//按钮不可用，满足其中之一就不可用
//   onSelectedCheck?:(...datas:any[])=>string|undefined //数据【选中】后的回调检查，返回string表示检查不通过，影响按钮的显示状态
// }

import { Result } from '@src/api/base';
import {  ReactNode } from 'react';
/**
 * vlife平台按钮数据结构v1.0
 * ------------------------------
 * 2.0完成0代码配置
 */
export interface VFBtn{
  title:string;//按钮名称 ●
  icon?:ReactNode;
  actionType:"create"|"edit"|"api"|"view"|"custom" //动作类型(1创建型|2数据展示后修改型|3直接接口操作型())
  usableMatch?:boolean|any|((...datas:any[])=>string|undefined);//boolean判断能否使用|属性值匹配一直能使用|函数判断如果有返回值则是不可用提醒
  className?:string//按钮样式
  initData?:any;//初始化数据新增时使用的默认值
  permissionCode?:string;//权限编码,不传则根据->`实体名:方法名(动作:模型名)`组成 sysUser:save:sysUserDto对应后端sysUser的API下的saveSysUserDto方法
  multiple?:boolean,//是否是对多条数据操作(和按钮展示位置有关，true:展示在列表上，false 展示在详情页)
  model?:string,//当前操作数据的模型名称,(form模型type,saveData的返回数据类型) 
  submitConfirm?:boolean,//提交之前是否确认
  disabledHide?:boolean,//不可以用时是否隐藏
  submitClose?:boolean,//model层面的接口调用完成后是否关闭页面

  onSaveBefore?:(data:any)=>any;//提交之前进行数据处理，返回数据给saveData函数
  onSubmitFinish?:(...datas:any[])=>void; //提交完成后触发的函数
  onFormilySubmitCheck?:()=>Promise<boolean>;//内部方法不用关注，数据【提交】之前的校验，使用fomily的主动检查 在formModal里添加
  onClick?:(...data:(any&{tableSort:number})[])=>void,//点击按钮触发的自定义事件，一般不用作接口访问，用在custom按钮使用
  //按钮触发动作
  saveApi?:(...data:(any&{tableSort:number})[])=>Promise<Result<any>>//保存类型接口
  loadApi?:(id:string)=>Promise<Result<any>>,//查看详情的接口，和列表模型不一致则需要传，否则根据模型名称计算得到(采用vlife里的通用查询)
  //预留
  disableMatch?:any|any[],//按钮不可用，满足其中之一就不可用
  onSelectedCheck?:(...datas:any[])=>string|undefined //数据【选中】后的回调检查，返回string表示检查不通过，影响按钮的显示状态
}