import { IdBean, Result } from '@src/api/base';
import { VfAction } from '@src/dsl/VF';
import React, {  ReactNode } from 'react';
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
 * 
 * -- 1. actionType 必须有模型的按钮(需弹出modal)
 * >> 使用saveApi为接口访问层代码，入参和出参类型需要一致
 * -- 1.1 单实体
 * create 新增 (?关联实体的新增，如何将他)
 * edit  修改  
 * save  新增和修改(复杂则考虑移除)
 * -- 1.2 多实体
 * edit ,mulitiple 批量修改指定的
 * 
 * batch 批量更新多个实体类,选择多个实体，模型有ids字段
 * 
 * 
 * -- 2. actionType 不需要模型的按钮(可不依附在模型上进行数据操作)
 * 
 * 
 * 
 * api 异步按钮 审核，工作流
 * 
 * delete
 * 
 */



const create1 = {  
  title: "新增",  
  multiple:false,  
};  



enum ActionTypeEnum {
  CREATE,
  EDIT,
  SAVE,
  PENDING,
};

// interface PaymentType {
//   [ActionTypeEnum.CREATE]: {
//     value: 'pro';
//     type: 1;
//   };
//   [PaymentTypeEnum.TRIAL]: {
//     value: 'trial';
//     type: 2;
//   };
//   [PaymentTypeEnum.FREE]: {
//     value: 'free';
//     type: 0;
//   };
//   [PaymentTypeEnum.PENDING]: {
//     value: 'pending';
//     type: 3;
//   };
// }

export type actionType= "create"|"save"|"edit"|"api"|"click"|"flow"|"modal"|string;
//按钮显示类型
export type btnType= "button" | "icon" | "link"; // 按钮展现类型 一般按钮|图标|连接
//场景 按钮位置 tableToolbar：表格工具栏 tableLine |表格行上 | formFooter 表单底部 | page 自定义页面 |dropdown 更多 |  comment 审核说明
export type BtnToolBarPosition = "tableToolbar" | "tableLine" | "formFooter" | "page" |"dropdown" |"comment";

//本次主要解决之前的缺陷，通过saveAPi确定权限；
export interface VFBtn{
  sysMenuId?: string;  // 所在菜单
  //----------------准备加入new----------
  formTitle?:string;//表单名称
  sort?:number; //排序
  toActiveTabKey?:string; //完成后去到的场景页签key
  onActiveChange?: (key: string) => void; //切换页签后触发
  modalOpen?:boolean;//是否打开modal
  id?:string;
  sysResourcesId?:string;
  // ----------------------------
  actionType?:actionType // 动作类型 (拿掉最好)
  datas?: any | any[]; //按钮数据 考虑和loadApi合并
  title?:string;//按钮名
  icon?:ReactNode;//图标
  model?:string,//当前操作模型;当前操作数据的模型名称,(form模型type,saveData的返回数据类型) 按钮触发的指定表单模型(弹出modal时的模型类型)
  modal?:React.ReactElement<{ //手工传入页面用作按钮触发弹出modal; 该页面需要支持 数据传出onDataChange；该modal不赋值数据保存接口调用，只需要把最新数据传出即可
    onDataChange:(data:any)=>void;//modal弹窗内部数据变化通知外层(一般是通知modal的按钮进行数据保存)
    onFinish:()=>void; //modal弹窗内部业务处理完毕通知外层
  }>; 
  // 可用性检查
  activeTabKey?:string[]; // 按钮所能显示在的页签场景
  disabled?:boolean;// 通过页面数据决定按钮是否警用：true禁用；false可用
  usableMatch?:any|((...datas:any[])=>string|boolean|Promise<string|boolean>); //根据表单数据校验按钮可用性 any=>直接比对|函数=>复杂/异步校验 string表示不能使用原因 赋值给tooltip
  conditionJson?:string;// 条件表达式
  //组件属性
  btnType?:btnType;// 按钮展现类型 "button" | "icon" | "link";
  continueCreate?:boolean;//连续新增 create按钮会出现(undefined不可见 false可见不可用  true可见可用) 
  tooltip?:string;// 不可用时候的提醒
  className?:string//按钮样式
  multiple?:boolean,//是否是对多条数据操作(和按钮展示位置有关，true:展示在列表上，false 展示在详情页)
  submitConfirm?:boolean, //提交之前确认
  disabledHide?:boolean,  //不可用时隐藏
  submitClose?:boolean,   //modal提交后关闭
  comment?:boolean,       //填报意见弹出层(当前仅支持工作流,未规定是否必填
  //权限相关  
  activeKey?:string;// 当前场景
  entity?:string;// 实体类型 和权限编码对应
  permissionCode?:string;//权限编码,不传则根据->`实体名:方法名(动作:模型名)`组成 sysUser:save:sysUserDto对应后端sysUser的API下的saveSysUserDto方法
  //表单相关
  btnConf?:boolean;//是否开启按钮配置功能
  code?:string;//按钮编码
  formVoJson?:string; //表单json配置
  reaction?:VfAction[],   //model表单级联关系配置
  fieldOutApiParams?: { [fieldName: string]: any }; //指定字段访问api取值的补充外部入参
  //希望移除的
  position?: BtnToolBarPosition; //使用场景(按钮能否在场景里出现，取决于他的actionType类型)
  otherBtns?:VFBtn[], // 关联按钮信息(弹出层的相关按钮)
  allowEmpty?:boolean;//是否允许空值(且是对单挑数据操作则可显示在tableToolbar上，因为是对单体数据操作所以列表选择的数据它不使用)

  onFormilySubmitCheck?:()=>Promise<boolean>;//内部方法不用关注，数据【提交】之前的校验，使用fomily的主动检查 在formModal里添加
  loadApi?:(data:any)=>Promise<Result<any>|any>,//打开form时模型数据的取值接口(和列表的模型不一致时可传,不传则采用通用查询取值)，
  onFormBefore?:(data:any)=>any;//去到表单之前进行数据处理，例：选中多行数据，然后弹出表单层,这里就是要准备form表单层的数据，将多行数据提取成表单数据;loadapi异步的，这个是同步的
  onSaveBefore?:(data:any)=>any;//提交之前进行数据处理，返回数据给saveData函数
  saveApi?:(...data:(any&{tableSort:number})[])=>Promise<Result<any>>| any//按钮点击后触发的异步或者同步，必须返回数据，该数据返回到外层并且是onSubmitFinish方法作为入参,提取权限关键字时采用
  onSubmitFinish?:(...saveApiResult:any[])=>void; //提交完成后触发的动作，如：用于关闭弹窗，刷新列表等操作
  onClick?:(...data:(any&{tableSort:number})[])=>void,//一般custom按钮使用，优先级高于saveAPI，一般不做接口类型的操作，不返回数据出去
//React.ComponentType<any>,
  //不够好
  divider?:boolean|string; // dropdown的分割线
  //发现以下没有用到
  initData?:any;//初始化数据新增时使用的默认值（没有地方用到）  
  children?: ReactNode;

}

//1. 列表上的数据，每次按钮操作后都需要刷新，因为设计数据变化后，不分数据会流转走，不分数据不在当前页签；所以直接做刷新

//按钮model有值，则api操作后必须返回model数据；可不用刷新页面,直接用model替换列表的哪一行数据

