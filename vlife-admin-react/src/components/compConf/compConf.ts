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
export type Options=selectObj[]| //手写指定选项范围
optionObj |//从指定函数返回值取2个字段作为选项名和值
 ((form?:FormVo,field?:FormFieldVo)=>Promise<Partial<selectObj>[]>)// 异步函数可封装逻辑组装options  
export  type CompProp={[key:string]:(CompPropInfo|string|boolean|number|Date|Array<any>|ReactNode|Function)};

export interface ViewComponentProps{
  title?:string; //标题
  className?: string
}

/**
 * 函数过滤
 * filter只指定一个表示 必须采用
 */
export type Filter=(data:any,param?:any)=>any;
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
  icon?:string,//图标
  component:any,//组件
  dataType?:DataType // onDataChange返回类型
  dataModel?:DataModel|string, // 返回数据明细
  props?:CompProp//属性配置/固定值  组件属性配置方法1
  //页面级组件使用
  propForm?:any;// any是组件实例；采用formily表单方式来进行组件属性设置 组件属性配置方法2
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
  fromField?:{entity:string,field:string}//指定使用某个字段，如当前没有则使用父组件上的该字段 （page方式不支持）

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
  // func?:(params?:any)=>any; //同步方法和上面二选一
  match?: { //转换函数
   [key:string]:{
    label:string, //转换器名称
    dataType:DataType; //转换后的大类
    dataModel:DataModel|string; //转换后的模型
    remark?:string;//解释说明,
    func:((d:any)=>any);//转换函数 接入api的出参数据
   } 
  },
  filter?:Filter;//内部过滤函数同样接收param参数信息，在api取得数据之后，match转换之前执行； | 另外还要支持：外部过滤函数单独的filter文件；
  params?:{[key:string]:(ParamsInfo|string|boolean|number)} //参数配置/固定值
}
