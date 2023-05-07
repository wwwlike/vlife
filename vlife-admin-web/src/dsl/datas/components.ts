/**
 * 所有组件配置化信息
 ts有反射读取则是最优方案
 */
 import {
  DatePicker as SemiDatePicker,
  Input as SemiInput,
  TextArea as SemiTextArea,
  Select as SemiSelect,
  Checkbox,
  Switch,
} from "@douyinfe/semi-ui";
import { connect, mapReadPretty } from '@formily/react';
import {
  PreviewText,
  InputNumber,
} from '@formily/semi'

// import Input  from '@formily/semi/esm/input';
// import QueryBuilder from '@src/components/queryBuilder';


// import ResourcesSelect from '@src/components/ResourcesSelect';
import RelationTagInput from '@src/components/RelationTagInput';
import PageSelect from '@src/components/PageSelect';
import GroupSelect from '@src/components/GroupSelect';
import FormTable from '@src/components/form/FormTable';
import ModalTagInput from '@src/components/ModalTagInput';
import SearchInput from '@src/components/SearchInput';
import SelectIcon from '@src/components/SelectIcon';
import SelectTag from '@src/components/SelectTag';
import VfEditor from '@src/components/VfEditor';
import VfImage from '@src/components/VfImage';
import { VfText } from '@src/components/VfText';
import VfTreeInput from '@src/components/VfTreeInput';
import VfTreeSelect from '@src/components/VfTreeSelect';
import { DataType, Mode, sourceType, TsType } from '@src/dsl/schema/base';
import { ComponentDef } from '@src/dsl/schema/component';
import VfCheckbox from '@src/components/VfCheckbox';
import VfNumbersInput from '@src/components/VfNumbersInput';
import QueryBuilder from '@src/pages/sysConf/queryBuilder';
// import SearchInput from '@src/life-ui/components/SearchInput';
const Input = connect(SemiInput, mapReadPretty(PreviewText.Input))
const Select = connect(SemiSelect, mapReadPretty(VfText))
const TextArea = connect(SemiTextArea, mapReadPretty(PreviewText.Input));
const DatePicker = connect(SemiDatePicker, mapReadPretty(VfText));


/**
 * 表单搜索类组件信息
 */
export const ComponentInfos: ComponentDef = {
  Input: {
    component:Input,
    icon:"IconFont",
    label:"单行文字",
    // dataChangeValueType: dataType.string,
    match:{ dataType:DataType.basic,
      dataModel:TsType.string},
    // target:[{entityType:"project",fieldName:"name"}]
  },
  VfCheckbox:{
    component:VfCheckbox,
    icon:"IconFont",
    label:"复选框",
    match:{ dataType:DataType.basic,dataModel:TsType.boolean},
  },
  TextArea:{
    icon:"IconWholeWord",
    component:TextArea,
    label:"多行文字",
    match:{ dataType:DataType.basic,
      dataModel:TsType.string},
  },
  VfNumbersInput:{
    icon:"IconWholeWord",
    component:VfNumbersInput,
    label:"数字范围",
    match:{ dataType:DataType.array,
      dataModel:TsType.number},
  },
  InputNumber: {
    label:"数字",
    icon:"IconIdentity",
    component:InputNumber,
    match:{ dataType:DataType.basic,
      dataModel:TsType.number},
  },
  VfSelect_DICT: {
    component:Select,
    icon:"IconDescend2",
    label: "下拉选择(字典)",
    match:[{ dataType:DataType.basic,
      dataModel:TsType.string},{ dataType:DataType.basic,
        dataModel:TsType.boolean}],
    // dataChangeValueType: [dataType.string, dataType.number,dataType.boolean,dataType.list,dataType.integer],
    propInfo: {
      optionList:{
        label:"字典分类",
        sourceType:sourceType.dict,//
        //  dataType:dataType.dictList,//view时候会使用
        // dataType: dataType.list, //需要的数据类型
      },
      showClear:true, 
      // valField:"val",// selectd固定值
      // labelField:"title",
    },
  },
  VfSelect: {
    component:Select,
    icon:"IconDescend2",
    label:"下拉选择(接口)",
    match:{ dataType:DataType.basic,
            dataModel:TsType.string},
    // dataChangeValueType: [dataType.string, dataType.number,dataType.list,dataType.integer],
    propInfo: {
      showClear:true,
      optionList:{
        label:"来源接口",
        sourceType:sourceType.api,
        dataType:DataType.array,
        dataModel:"ISelect",
      }
    }
  }
        // dataType:dataType.label_value_list, //期望的是这个数据类型
        // otherData:{ //支持的其他类型的入参数据，传入之前需要转换成 lableValue类型
        //   [dataType.id_name_list]:(datas:{id:string,name:string}[])=>{
        //     return datas.map((data:{id:string,name:string})=>{return {value:data.id,label:data.name}});
        //   },
        //   [dataType.code_name_list]:(datas:{code:string,name:string}[])=>{
        //     return datas.map((data:{code:string,name:string})=>{return {value:data.code,label:data.name}});
        //   },
        //   [dataType.resourcesCode_name_list]:(datas:{resourcesCode:string,name:string}[])=>{
        //     return datas.map((data:{resourcesCode:string,name:string})=>{return {value:data.resourcesCode,label:data.name}});
        //   },
        //   [dataType.entityType_name_list]:(datas:{entityType:string,name:string}[])=>{
        //     return datas.map((data:{entityType:string,name:string})=>{return {value:data.entityType,label:data.name}});
        //   },
        //   [dataType.fieldName_title_list]:(datas:{fieldName:string,title:string}[])=>{
        //     return datas.map((data:{fieldName:string,title:string})=>{return {value:data.fieldName,label:data.title}});
        //   },
        //   [dataType.resources_list]:(datas:{resourcesCode:string,name:string}[])=>{
        //     return datas.map((data:{resourcesCode:string,name:string})=>{return {value:data.resourcesCode,label:data.name}});
        //   },
        // },

//       }
//     },
//   },,
,
  RelationTagInput: {
    component:RelationTagInput,
    icon:"IconDescend2",
    label: "列表弹框",
    match:[{ dataType:DataType.array,
      dataModel:TsType.string},{ dataType:DataType.basic,
        dataModel:TsType.string}],
  },
  ModalTagInput:{
    component:ModalTagInput,
    label: "列表选择输入框",
    match:{dataType:DataType.array,
    dataModel:TsType.string},
    propInfo:{
      datas:{
        label:"Prop[datas]来源",//缺省状态，可以这样来定义
        sourceType:sourceType.api,
        dataType: DataType.array,
        dataModel:"IFkItem",
        must: true,
      }
    }
  },
  DatePicker: {
    component:DatePicker,
    icon:"IconClock",
    label: "日期",
    match:[{ dataType:DataType.array,
      dataModel:TsType.date},{ dataType:DataType.basic,
        dataModel:TsType.date}],
  },
  VfTreeInput: {
    component:VfTreeInput,
    icon:"IconTreeTriangleDown",
    label: "树型下拉",
    mode:[Mode.form],
    match:{dataType:DataType.basic,dataModel:TsType.string},
    propInfo: {
      datas: {
        label: "数据类型",
        sourceType:sourceType.api, //数据来源接口
        dataType: DataType.array,
        dataModel:"ITree",
        must: true,
      },
      // valField: "code",
      // valField: {
      //   label: "取值字段",
      //   dataType: dataType.string,
      //   must: true,
      // },
    },
},
VfEditor: {
  component:VfEditor,
  icon:"IconTextRectangle",
  label:"富文本",
  match:{ dataType:DataType.basic,dataModel:TsType.string},
  mode:[Mode.form],
},
SelectIcon:{
  component:SelectIcon,
  icon:"IconComponent",
  label: "图标选择",
  mode:[Mode.form],
  match:{ dataModel:TsType.string,dataType:DataType.basic},
},
VfImage: {
  component:VfImage,
  icon:"IconImage",
  label:"图片上传",
  mode:[Mode.form],
  match:[{ dataModel:TsType.string,dataType:DataType.basic},
    { dataModel:TsType.string,dataType:DataType.array}],
    //下面的用处？？？
  // propInfo: {
  //   datas: {
  //     label: "已上传",
  //     dataType:dataType.fileList,
  //     sourceType:"api"
  //   },
  // },
},

  SearchInput: {
    component:SearchInput,
    match:{ dataModel:TsType.string,dataType:DataType.basic},
    label: "搜索组件",
    mode:[Mode.filter]
  },
  SelectTag: {
    label:"Tag标签(字典)",
    // mode:[Mode.filter],
    component:SelectTag,
    match:[{ dataType:DataType.array,
      dataModel:TsType.string},{ dataType:DataType.basic,
        dataModel:TsType.string}],
    // dataChangeValueType: [dataType.string, dataType.integer, dataType.list], //出参数据类型 3种出参数据类型
    propInfo: {
      datas: { //组件属性名称标识
        label: "字典分类", //组件属性说明会
        sourceType:sourceType.dict,//存字典编码，取的时候通过字典编码，取到所有分类数据
        // dataType: dataType.dictList, // 属性字段类型(字典类型的集合) //这一行最好能干掉
        must: true,
      },
    },
  },
  VfTreeSelect: {
    component:VfTreeSelect,
    label: "树型选择",
    mode:[Mode.filter],
    match:{dataType:DataType.basic,
      dataModel:TsType.string},
    propInfo: {
      datas: {
        label: "数据来源",
        sourceType:sourceType.api,
        dataType: DataType.array,
        dataModel:'ITree',
        must: true,
      },
      valField: "code",
    },
  },
  PageSelect:{
    component:PageSelect,
    label:"分组选择组件",
    mode:[Mode.form],
    match:{ dataType:DataType.array,dataModel:TsType.string},
    propInfo:{
      datas: {
        label: "分组数据",
        sourceType:sourceType.api,
        dataType:DataType.array,
        dataModel:"PageSelectData",
        must: true,
      }
    }
  },
  table:{
    component:FormTable,
    label: "子表单",
    icon:"IconOrderedList",
    mode:[Mode.form],
    match:{ dataType:DataType.array,dataModel:"IdBean"},
    // dataChangeValueType:dataType.list,
    propInfo:{
      type:{
        sourceType:sourceType.sys,
        sys:{key:'entityType'},
        label:"实体类",
        dataType:DataType.basic,
        dataModel:TsType.string
      },
      ignores:{
        label:"列表忽略字段",
        dataType:DataType.array,
        dataModel:TsType.string,
        sourceType:sourceType.fixed
        // sys:{key:'entityType'},
      }
    }
  }

//   // TabSelectInput:{
//   //   component:TabSelectInput,
//   //   dataChangeValueType: dataType.string,
//   //   label:"tab选择组件",
//   //   propInfo:{
//   //     datas:{
//   //       label: "待选择的分组tab数据",
//   //       sourceType:'api',
//   //       dataType:dataType.id_name_list
//   //     }
//   //   }
//   // }
,
  GroupSelect: {
    component:GroupSelect,
    label: "分组选择",
    match:{dataType:DataType.array,
        dataModel:TsType.string},
   mode:[Mode.form],
    propInfo: {
      datas: {
        label: "数据来源",
        sourceType:sourceType.api,
        dataType:DataType.array,
        dataModel:'SysFilterVo',
        must: true,
      },
      selectType:
      {
        label: "选择维度",
        // dataType:dataType.string,
        fixed:{
          dicts: [
          {value:"more",label:"多选"},
          // {value:"one",label:"单选"},
          {value:"typeOne",label:"单选"}
        ],
        }
      },
    },
  },
  //高级组件
  QueryBuilder: {
    component:QueryBuilder,
    match:{dataType:DataType.basic,
    dataModel:TsType.string},
    target:[
      {type:"reportItem",fieldName:"conditionJson"}
    ],
    label: "查询条件设计器",
    mode:[Mode.form],
    propInfo: {
      datas: {
        label: "模型字段",
        dataType:DataType.basic,
        dataModel:TsType.string,
        sourceType:sourceType.field,
        must: true,
      },
    },
  },


 
};
