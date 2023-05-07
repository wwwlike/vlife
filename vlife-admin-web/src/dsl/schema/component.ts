import { FormFieldVo } from '@src/api/FormField';
import { DataType, Mode, sourceType, TsType } from './base';

export interface ISelect{
  value:any;
  label:string;
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
  mode?:Mode[]|Mode //组件使用场景 多个或者指定
  match?:match|match[]; //onDataChange输出数据匹配支持的类型
  // dataChangeValueType?: dataType | dataType[];  //出参数据类型 和field的 Type fieldType进行比对
  target?:{type:string,fieldName?:string}[] //绑定的字段,只能给指定模型的字段使用；就算字段满足，也只给指定的对象的字段
  //组件使用说明 ，弹出propver提醒
  remark?: string;
  //组件属性对象定义信息 （目标type fieldType 去掉 dataType和 dataModel）
  propInfo?: PropDef;
};

/**
 * 封装所有组件的对象定义
 */
export interface ComponentDef {
  //组件编码code
  [key: string]:ComponentInfo
}

/**
 * 组件属性的定义信息
 * 属性要能支持事件
 */
export interface  PropInfo{
    label?: string; //属性名称，没有则默认等于key
    dataType?:DataType, //属性字段类型，这里决定组件可以用什么类型的接口，因为组件属性支持多种类型
    dataModel?:TsType|string //数据模型名称
    sourceType?:sourceType //[]|sourceType, //属性数据来源执行，执行了则不用在页面选择,需要调整成指定一个来源 不填写默认就是fixed
    fixed?:{// sourceType===fixed, 以下固定取值的2种情况
      dicts?:{value:any,label:string}[]//自定义字典
      promise?:()=>Promise<{value:any,label:string}[]> //api返回的数据
    },
    dict?:{// sourceType===dict,
      dictCode:string// default vlife 字典大类
    },
    //系统取值，直接取到filed指定的的字段属性值
    sys?:{
      key?:"fieldType"|"type"|"entityType"
    },
    func?:(value:any)=>any,
    // otherData?: { [key:string]: (otherData:any)=>any }, //其他类型的数据， 对应的转换方法(dataType)
    dataSub?:PropDef //下一级数据的定义信息 能支持嵌套一级
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
}
/**
 * 属性封装对象
 */
export interface PropDef {
  //属性编码,datas树型
  [key: string]: PropInfo| string|boolean|number|Date; //字符串就是写死的属性值
}

/**
 * vlife自定义组件属性基类
 */
 export interface VfBaseProps<T, D> {
    //字段初始值
    value: T;
    //value字段数据传出
    // onDataChange: (...data: T[]) => void;
    onDataChange: (data: T|undefined) => void;
    //组件渲染需要的数据
    datas?: D;
    // 表态只读状态
    read: boolean;
    //当前实体类
    entityType:string;
    //样式
    className:string;
    // 以下考虑移除，不和字段信息绑定，做纯粹的组件
    //字段名
    fieldName: string;
    //组件字段信息
    fieldInfo: FormFieldVo;
    //当前模式
    design:true|false|undefined
}

export interface VfBaseViewProps<D>{
  data:D;
}
