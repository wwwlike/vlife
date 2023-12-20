//定义数据接口
import { Result } from '@src/api/base';
import { FormVo } from '@src/api/Form';
import { FormFieldVo } from '@src/api/FormField';
import { DataModel, DataType } from '@src/dsl/base';
import { ReactNode } from 'react';

//选择项类数据结构
export type selectObj={label:string,value:any,default ?:boolean,remark?:string}
// 对象optionObj 从指定函数返回值取2个字段作为选项名和值
export type optionObj=
{func:()=>Promise<Result<any[]>>,labelKey:string,valueKey:string}
// 固定值类型选项结构
export type Options=
selectObj[]| //手写指定选项范围
optionObj |//指定接口
 ((form?:FormVo,field?:FormFieldVo)=>Promise<Partial<selectObj>[]>)// 异步函数可封装逻辑组装options  
export  type CompProp={[key:string]:(CompPropInfo|string|boolean|number|Date|Array<any>|ReactNode|Function|object)};

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
  icon?:ReactNode|string,//图标
  component:any,//组件
  dataType?:DataType // onDataChange返回类型
  dataModel?:DataModel|string, // 返回数据明细
  props?:CompProp//属性配置/固定值  组件属性配置方法1
  //页面级组件使用
  propForm?:any;// any是组件实例；采用formily表单方式来进行组件属性设置 组件属性配置方法2
  propFormComponentProp?:any;// 固定传的属性值
  key?:string; //组件标识(页面组件使用)
  w?: number,//组件在grid布局里的宽度
  h?: number,//组件在grid布局里的高度
  remark?: string;  //组件使用说明 ，弹出propver提醒
  
}

//入参参数结构
export interface ParamsInfo{
  label:string, //参数名称
  must?:boolean;//必填参数
  dataModel:DataModel|string //参数类型
  remark?:string;//参数说明
  // 参数(接口参数/组件属性)来源选择
  options?:Options, //来源于指定selectObj/接口组装的范围；对于出参是ISelect的也可以
  /**
   * 1:true-> 构造select,从字段里选择(ParamsSetting) 
   * 2:{entity:string,field:string} -> 表示去找指定的字段,**如当前没有则使用父组件上的该字段** (propload.ts)
   * 待：如为2，也找不到；且must；则页面目前没有提示
   */
  fromField?:true|{entity:string,field:string} 
}


//组件属性结构
export interface CompPropInfo extends  ParamsInfo{
  dataType: DataType; //属性类型-大类
  dataSub?:CompProp //复杂对象打散的数据结构嵌套,对子节点的属性进行匹配
  apiName?:string, //绑定指定API(则不使用type/model方式匹配)
}

//接口组成信息
export interface ApiInfo{
  label:string,//接口名称
  dataType: DataType; //出参数据类型-大类 和comp的属性进行比对
  dataModel:DataModel|string //出参数据类型-明细
  remark?:string;//解释说明,
  api:(params?:any)=>Promise<Result<any>>;//异步接口primise
  params?:{[key:string]:(ParamsInfo|string|boolean|number)} //参数配置/固定值
  //接口取得的数据过滤执行顺序 api->filter->match; 可选过滤的选择单独定义在src\resources\filters.ts文件；
  filter?:(data:any,params?:any)=>any; 
  match?: { //数据转换 让dataModel&dataType的出参数据类型能够转换成其他的模型实现一个接口多用
   [key:string]:{
    label:string, //转换器名称
    dataType:DataType; //转换后的大类
    dataModel:DataModel|string; //转换后的模型
    remark?:string;//解释说明,
    func:(data:any,params?:any)=>any;//数据转换方法
   } 
  },
}
