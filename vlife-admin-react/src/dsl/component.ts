import { Form } from '@formily/core';
import { FormVo } from '@src/api/Form';
import { FormFieldVo } from '@src/api/FormField';
import { VF, VfAction } from '@src/dsl/VF';
import { DataType, Mode, sourceType, TsType } from './base';




/**
 * 下拉选择数据结构
 */
export interface ISelect{
  value:any;
  label:string;
  children?:ISelect[] // 
}
/**
 * 树形选择数据结构
 */
export interface ITreeData extends ISelect{
  key:string,
  children?:ITreeData[]
}
/**
 * 匹配数据类型
 */
type dataModel=TsType|string
export interface match{
  dataType:DataType,
  dataModel:dataModel|dataModel[]
}
/**
 * 单个组件的数据结构信息
 */
export interface  ComponentInfo  {
  key?:string; //组件标识
  label?: string; //组件名称
  icon?:any,//组件表示图标
  w?: number,//组件在grid布局里的宽度
  h?: number,//组件在grid布局里的高度
  component:any,//组件
  mode?:Mode|Mode[] //组件使用场景
  match?:match|match[]; //onDataChange输出数据匹配支持的类型(应该不能支持[])
  target?:{type:string,fieldName?:string}[] //绑定的字段,只能给指定模型的字段使用；就算字段满足，也只给指定的对象的字段
  remark?: string;  //组件使用说明 ，弹出propver提醒
  propInfo?: PropDef; // 根据配置传组件属性 ；组件属性对象定义信息 （目标type fieldType 去掉 dataType和 dataModel）
  propForm?:any;// 根据表单传组件配置(图标使用) 直接使用formily
};

/**
 * 封装所有组件的对象定义
 */
export interface ComponentDef {
  //组件编码code
  [key: string]:ComponentInfo
}

type Expression = {
  [key: string]: string|boolean|number | RegExp | Expression;
};

/**
 * 选项对象结构
 */
export type SelectInferface={
  label:string,//选项名
  value:any, //选项值
  desc?:string //选项描述，需要做到下拉时就能展示
  default?:boolean,//是否默认值
}
// const dict:()=>Promise<[]>|{label:}[];

export interface DS{
  [key:string]:((allProp?:any)=>Promise<SelectInferface[]>);
}

/**
 * 组件属性的定义信息
 * 属性要能支持事件
 */
export interface  PropInfo{
    label?: string; //属性名称，没有则默认等于key
    //需要做到自动映射，则填写 dataType,dataModel
    dataType?:DataType, //属性字段类型(大类，object,basic,array)
    dataModel?:TsType|string //模型名称(具体类型)
    sourceType?:sourceType , //组件属性数据来源，不填写默认就是fixed（考虑不指定，让由用户选择具体来源） 干掉
    dicts?:SelectInferface[]|((allProp?:any)=>Promise<SelectInferface[]>),
    // fixed，dict,sys,func->手工在配置时传入数据
    // 简单数据类型，如何快速匹配，可在这里配置
    fixed?:{ // 从这里匹配和dataModel,sourceType里的数据 以下拉形式来 dict,否则就是选接口
      // 手工创建可选项让用户选择组件应
      dicts?:SelectInferface[] //|true|string//自创造字典选择|系统字典|指定字典大类
      // filed:{key:string} // 异步字典数据
      // 用接口的方式返回简单数据的多个目标结果，让用户选择
      promise?:(allProp?:any)=>Promise<SelectInferface[]> 
     

      //以上是产生basic类简单的数据让用户选。那对于复杂的数据一般情况是采用api方式来进行，api方式有个弊端
      //就是选了api还要 指定api的入参 ，那在这里有些确定性的组件
      
      // selectField:boolean;//是否选择字段
      //指定数据集
      // form
      // 根据字段fieldType选择
    },
    //准备去掉
    dict?:{// sourceType===dict,
      dictCode:string// default vlife 字典大类
    },
    //系统取值，直接取到filed指定的的字段属性值
    sys?:{
      key?:"fieldType"|"type"|"entityType"
    },
    dataSub?:PropDef //下一级数据的定义信息 能支持嵌套一级;如原本需要传入Object复杂对象，使用dataSub则传递
    must?: boolean; //是否必填,默认不是必须的

    //思考form里是否有相关使用场景，那么该如何处理；
    // dataType ==='event' //需要给该事件的方法体里选择一个函数；
    event?:{
      params?:{//出参就是api的入参， api包涵就可以使用
          [name:string]:TsType|string} ;// 出参参数名
          // label:string,//出参中文名称
          // dataType:dataType, //出参类型
          // defaultValue?:any;//默认值参数值
          //事件调用哪个方法 paramName 给到事件的哪个参数？
          //方法最后得到的值 给到 prop里的哪个
        //回调得到的值给到哪个属性上
      propName?:string; //api数据付给到哪个属性上
    } 
    show?:Expression;
    // togetherProp:PropDef;//可放在一起的属性，共享一个名称;需要解决递归和值传出的问题
}
/**
 * 属性封装对象
 */
export interface PropDef {
  //属性编码,datas树型
  [key: string]: PropInfo| string|boolean|number|Date; //PropInfo之外的就是固定给属性传定值
}

/**
 * vlife自定义表单组件数据
 * T 出参数据类型
 * D 组件类型
 */
 export interface VfBaseProps<T, D> {
    //字段初始值
    value: T;
    //组件渲染需要的数据
    datas?: D;
    // 表态只读状态
    read: boolean;
    //当前实体类
    entityType:string;
    //css样式
    style:any;
    //样式
    className:string;
    // 以下考虑移除，不和字段信息绑定，做纯粹的组件
    //字段名
    fieldName: string;
    //组件字段信息
    fieldInfo: Partial< FormFieldVo>;
    //当前模式
    design:true|false|undefined,
    //当前表单名称取自Form的type字段
    formName:string,
    //模型信息
    model:FormVo,
    //模型名称(未使用)
    modelTitle:string,
    //当前字段所在表单数据
    formData:any;
     //表单设置配置
    reaction:VfAction[];//响应
    vf:VF[];//设置
    //表单formily对象 注入页面会卡顿
    // form:Form,
    //字段(或子表单)数据回传
    onDataChange: (data: T|undefined) => void;
    //formli表单信息回传
    onForm:(form:Form|Form[])=>void;
    //字体加粗
    fontBold:boolean,
    //紧凑布局
    terse:boolean,
   
   
}

export interface VfBaseViewProps<D>{
  data:D;
}
