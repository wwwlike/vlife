import { FormFieldVo } from '@src/api/FormField';
import { VF, VfAction } from '@src/dsl/VF';

/**
 * 下拉选择数据结构
 */
export interface ISelect{
  value:any;
  label:string;
  extra?:string;//说明信息
}
/**
 * 树形选择数据结构
 */
export interface ITreeData extends ISelect{
  key:string,
  children?:ITreeData[]
}
/**
 * 选项对象结构
 */
export type SelectInferface={
  label:string,//选项名
  value:any, //选项值
  desc?:string //选项描述，需要做到下拉时就能展示
  default?:boolean,//是否默认值
}

/**
 * 平台自定义表单组件属性基础类
 */
 export interface VfBaseProps<T> {
  //字段初始值
  value: T;
  //占位提示;
  placeholder:string;
  // 表态只读状态
  read: boolean;
  //样式
  className:string;
  //css样式
  style:any;
  //组件渲染需要的数据
  design:true|false|undefined,
  //当前表单名称取自Form的type字段
  reaction:VfAction[];//响应
  vf:VF[];//设置
  //字体加粗
  fontBold:boolean,
  //紧凑布局
  terse:boolean,
  // form 表单会固定传入的值，可不在compData里配置以下属性
    //当前字段所在表单数据
  formData:any;
  //组件字段信息
  fieldInfo: Partial< FormFieldVo>;
  //数据回传
  onDataChange: (data: T|undefined) => void;
}


export interface VfBaseViewProps<D>{
  data:D;
}
