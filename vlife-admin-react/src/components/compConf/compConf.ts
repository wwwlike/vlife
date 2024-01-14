//定义数据接口
import { Result } from '@src/api/base';
import { FormVo } from '@src/api/Form';
import { FormFieldVo } from '@src/api/FormField';
import { DataModel, DataType, OptEnum } from '@src/dsl/base';
import { loadApiParams } from '@src/resources/ApiDatas';
// import { filterObj } from '@src/resources/filters';
import { ReactNode } from 'react';

//给定的常量下拉选择数据结构
export type selectObj={label:string,value:any,default ?:boolean,remark?:string}
/**
 * 指定1异步函数取下拉数据结构 2: lable字段 3：value字段
 */
export type optionObj={
  func:()=>Promise<Result<any[]>>,
  labelKey:string,
  valueKey:string
}
//通过下拉窗口取属性或者接口值的3种方式
export type Options=
  selectObj[]| //手写指定选项范围
  loadApiParams //取值来自指定配置转换过滤的接口
  // optionObj |  //指定接口的2个字段分别取lable和value
  // ((form?:FormVo,field?:FormFieldVo)=>Promise<Partial<selectObj>[]>)// 异步函数可封装逻辑组装options  

/**
 * 组件属性定义数据结构
 * string|boolean|number|Date|Array<any>|Function|ReactNode 固定传值写死
 * 配置里传回调函数目前还没有应用场景,可以考虑做成影响整合系统全局的操作；表单内联动部需要事件，只需要对方组件关注了当前组件的值的变化即可
 * CompPropInfo：属性结构定义，需在Sider面板进行配置
 */
export  type CompProp={
  [key:string]:(CompPropInfo|string|boolean|number|Date|Array<any>|ReactNode|Function|object)
};

export interface ViewComponentProps{
  title?:string; //标题
  className?: string
}


//组件数据资产
export interface CompDatas{
  [key:string]:CompInfo
}
//api数据资产
export interface ApiDatas{
  [key:string]:ApiInfo
}

//组件组成信息
export interface CompInfo{
  label:string; //组件名称
  component:any,//组件
  icon?:ReactNode|string,//图标
  remark?: string;  //组件使用说明
  dataType?:DataType // onDataChange返回类型
  onDataChange?:string// 数据返回回调事件名称,默认是"onDataChange"
  dataModel?:DataModel|string, // 返回数据明细
  props?:CompProp//属性配置1 采用编写CompProp的方式
  //以下为页面级组件使用
  propForm?:any;//属性配置2：采用formily方式配置组件取到props的方式，目前报表页面采用该方式
  propFormComponentProp?:{[field:string]:{[propName:string]:any}};//给指定字段field的组件的指定属性赋值 {name:{options:[],show:true}} 
  key?:string; //组件标识(页面组件使用)
  w?: number,//组件在grid布局里的宽度
  h?: number,//组件在grid布局里的高度
}

export interface AttrInfo{
  label?:string, //参数名称
  required?:boolean;//必填参数
  dataType?: DataType; //属性大类 默认是basic
  dataModel:DataModel|string //基本类型
  remark?:string;//说明
  //参数(接口参数/组件属性)来源选择
  options?:Options, //来源于指定selectObj/接口组装的范围；对于出参是ISelect的也可以
  /**
   * 1:true-> 构造select,从字段里选择(ParamsSetting) 
   * 2:{entity:string,field:string} -> 表示去找指定的字段,**如当前没有则使用父组件上的该字段** (propload.ts)
   * 待：如为2，也找不到；且must；则页面目前没有提示
   */
    fromField?:true|{entity:string,field:string} 

}
//接口参数和组件属性公用结构
export interface ParamsInfo extends AttrInfo{
  dynamicParams?:boolean;//动态入参，采用condition来接收,默认eq
  dynamicParamsOpt?:OptEnum;//动态入参匹配方式
  send?:boolean;//是否发送到后端,false说明该菜单用来做数据转换筛选逻辑
}


//组件属性结构
export interface CompPropInfo extends  AttrInfo{
  dataSub?:CompProp //复杂对象打散的数据结构嵌套,对子节点的属性进行匹配
  apiMatch?:loadApiParams,//属性直接匹配指定的api
  // apiMatch?:{api:string,match:string}, //绑定指定API(则不使用type/model方式匹配)
}

//是固定(string,boolean,number)值时，服务端需要专有对象对应的属性来接收
export type ParamsObj={[key:string]:(ParamsInfo|string|boolean|number)}

export type MatchObj={ [key:string]:{
  label?:string, //转换器名称,为空则使用api的label
  dataType:DataType; //转换后的大类
  dataModel:DataModel|string; //转换后的模型 
  remark?:string;//解释说明,
  filterKey?:string[],//指定支持的过滤器的key,不传则全部可以使用，传[]则全部不使用
  params?:ParamsObj //该类型数据需要的接口入参
  func?:(data:any,params?:any)=>any;//数据转换方法，为空说明不转换直接使用
 } }

 // export interface filter{
//   title:string;//过滤器标题
//   func:(datas:any[])=>any[],
//   dataType?:DataType;//出参数据类型。可以省
//   dataModel?:TsType|string; //数据模型
//   remark?:string;//解释说明
// }

// export interface filterObj{
//   [key:string]:filter
// }
//过滤器结构
export type filterObj={
  [dbKey:string]: {
    title:string,
    func?:(datas:any[])=>any[]//|string// 方法过滤和字典字段过滤
  }
  
} //过滤器
//接口组成信息
export interface ApiInfo{
  label:string,//接口名称
  dataType: DataType; //出参数据类型-大类 和comp的属性进行比对
  dataModel:DataModel|string //出参数据类型-明细
  remark?:string;//解释说明,
  api:(params?:any)=>Promise<Result<any>>;//关联接口
  filters?:filterObj;//作为接口的可选过滤器，是无参数过滤器,如果必须过滤则在适配方法里完成即可
  //接口取得的数据过滤执行顺序 api->filter->match; 可选过滤的选择单独定义在src\resources\filters.ts文件；
  match:MatchObj  //数据转换 让dataModel&dataType的出参数据类型能够转换成其他的模型实现一个接口多用
  // params?:ParamsObj //参数配置/固定值
  // filter?:(data:any,params?:any)=>any;  //强制过滤 待删除
}
