
import {
  IconGridView,IconArticle,IconListView,IconCommand
} from "@douyinfe/semi-icons";
import { Mode } from '@src/dsl/base';
//显示的依赖定义
export type deps = {
  field: string; //依赖的属性
  value: any[]; //依赖的值 满足其中之一即可
};


export interface designProp {
  name: string; //title
  icon?:any;
  type: "select" | "input" | "switch"| "buttonGroup" | "form" |"textArea"; //设置组件的类型
  tag?: "basic"  | "layout"; //所在分组标签
  mode?:Mode[]|Mode; //使用场景
  deps?: deps | deps[]; //字段显示依赖,如果是数组都需要满足
  tooltip?:string;//提示语 label
  items?: { //多选时的内容
    icon?:any;
    tooltip?:string;//提示语 label
    label: string;
    default?:boolean;//是否默认值
    value?: any; //嵌套一个，尤它进行值得选择
    mode?: Mode;
    deps?: deps | deps[]; // 满足得一项，或者多项都满足
  }[]; //子项显示依赖
}

export interface SchemaClz {
  [key: string]: designProp; //扩展字段
}

export const types: { title: string; value: string,icon?:any }[] = [
  { title: "数据属性", value: "basic" ,icon:IconArticle},
  { title: "布局样式", value: "layout",icon:IconCommand },
];

 const schemaDef: SchemaClz = {
  title: {
    name: "标题",
    type: "input",
    tag: "basic",
  },
  initialValues: {
    name: "默认值",
    // type: "form",
    type:"input",
    tag: "basic",
    deps: { field: "x_component", value: ["Input", "Input.TextArea"]  },
    mode:Mode.form
  },
  // dictCode: {
  //   name: "字典项目",
  //   type: "select",
  //   tag: "basic",
  //   deps: { field: "x_component", value: ["Select", "DictSelectTag"] },
  //   items: [],
  // },
  x_hidden: {
    name: "隐藏",
    type: "switch",
    tag: "layout",
    mode:Mode.form
  },
  required: {
    name: "必填",
    type: "switch",
    tag: "basic",
    mode:Mode.form
  },
  x_read_pretty: {
    name: "只读",
    type: "switch",
    tag: "layout",
    mode:Mode.form
  },
  // listHide: {
  //   name: "列表",
  //   type: "switch",
  //   tag: "layout",
  // },
  x_validator: {
    name: "限定输入格式",
    type: "select",
    mode:Mode.form,
    tag: "basic",
    deps: { field: "x_component", value: ["Input", "Input.TextArea"] },
    items: [
      { label: "email", value: "email" },
      { label: "phone", value: "phone" },
      { label: "number", value: "number" },
      { label: "idcard", value: "idcard" },
      { label: "采用正则校验", value: "pattern" },
    ],
  },
  vlife_pattern: {
    name: "正则表达式",
    type: "input",
    tag: "basic",
    mode:Mode.form,
    tooltip:"必须是正则表达式",
    deps: { field: "x_validator", value: ["pattern"] },
  },
  vlife_message: {
    name: "校验提醒",
    type: "input",
    tag: "basic",
    mode:Mode.form,
    deps: { field: "x_validator", value: ["pattern"] },
  },
  validate_unique: {
    name: "不允许重复",
    type: "switch",
    mode:Mode.form,
    tag: "basic",
    deps: { field: "x_component", value: ["Input"] },
  },
  maxLength: {
    name: "最大长度",
    type: "input",
    tag: "basic",
    mode:Mode.form,
    deps: { field: "x_component", value: ["Input"] },
  },
  minLength: {
    name: "最小长度",
    type: "input",
    tag: "basic",
    mode:Mode.form,
    deps: { field: "x_component", value: ["Input"] },
  },
  maximum: {
    name: "最大值",
    type: "input",
    tag: "basic",
    mode:Mode.form,
    deps: { field: "x_component", value: ["InputNumber"] },
  },
  minimum: {
    name: "最小值",
    type: "input",
    tag: "basic",
    mode:Mode.form,
    deps: { field: "x_component", value: ["InputNumber"] },
  },
  x_component_props$placeholder: {
    name: "填写说明",
    type: "textArea",
    mode:Mode.form,
    tag: "basic",
    // deps: { field: "x_component", value: ["Input","VfSelect","VfSelect_DICT","Select"] },
  },
  create_hide: {//保存时才会触发数据产生，无法实时预览
    name: "新增时隐藏",
    tooltip:"保存后生效",
    type: "switch",
    mode:Mode.form,
    tag: "basic",
  },
  modify_read:{
    name: "修改时只读",
    tooltip:"保存后生效",
    type: "switch",
    mode:Mode.form,
    tag: "basic",
  },
  hideLabel:{ 
    name: "标签隐藏",
    type: "switch",
    tag: "layout",
  },
  divider:{ 
    name: "分组名称",
    type: "switch",
    tag: "layout",
  },
  dividerLabel:{ 
    name: "",//分组名称
    type: "input",
    tag: "layout",
     deps: { field: "divider", value:[true] },
  },
  x_decorator_props$layout: {
    name: "标签位置",
    type: "buttonGroup",
    tag: "layout",
    items: [
      {
        label: "顶部",
        value: "vertical",
      },
      {
        label: "水平",
        value: "horizontal",
      },
    ],
  },
  // x_decorator_props$labelAlign: {
  //   name: "标签对齐",
  //   type: "buttonGroup",
  //   tag: "layout",
  //   deps: { field: "x_decorator_props$layout", value: ["vertical"] },
  //   items: [
  //     {
  //       label: "居左",
  //       value: "left",
  //     },
  //     {
  //       label: "居右",
  //       value: "right",
  //     },
  //   ],
  // },
  formTabCode: {
    name: "所在页签",
    type: "buttonGroup",
    mode:Mode.form,
    tag: "layout",
    // deps://有数量才显示
    // deps: { field: "x_decorator_props$layout", value: ["vertical"] },
    items: [],
  },
  x_decorator_props$gridSpan: {
    name: "字段占比",
    type: "buttonGroup",
    tag: "layout",
    items:[]
  },
};

//模型的schema
export const modelSchemaDef:SchemaClz = {
  modelSize:{
    name:"布局",
    type: "buttonGroup",
    mode:Mode.form,
    items: [
      { label: "宽", value: 4 ,tooltip: "每行4列"},
      { label: "大", value: 3 ,tooltip: "每行3列" },
      { label: "中", value: 2 ,tooltip: "每行2列" },
      { label: "小", value: 1 ,tooltip: "每行1列" },
    ],
  },
  filter_modelSize:{// filter里的modelSize开头
    name:"布局",
    type: "buttonGroup",
    mode:Mode.filter,
    items: [
      { label: "横向", value: 4 },
      { label: "纵向", value: 1},
    ],
  },

  pageSize:{
    name:"分页",
    type: "buttonGroup",
    mode:Mode.list,
    items: [
      { label: "15条", value: 15  },
      { label: "10条", value: 10 },
      { label: "5条", value: 5  }
    ],
  },
  formRead:{
    name:"模式",
    type: "buttonGroup",
    mode:Mode.form,
    deps:[{field:"itemType",value:["entity","save"]}],
    items: [
      { label: "编辑",default:true,icon:IconGridView},
      { label: "只读", value: true,icon:IconListView },
    ],
  },
  x_decorator_props$layout:{
    name:"标签",
    type: "buttonGroup",
    mode:[Mode.form,Mode.filter],
    items: [
      { label: "顶部1", value: "vertical"},
      { label: "水平", value: "horizontal"},
    ],
  },
  // x_decorator_props$labelAlign:{
  //   name:"对齐",
  //   type: "buttonGroup",
  //   mode:[Mode.form,Mode.filter],
  //   // deps: { field: "x_decorator_props$layout", value: ["vertical"] },
  //   items: [
  //     { label: "居左", value: "left"},
  //     { label: "居右", value: "right"},
  //   ],
  // },
}



//模型的schema
export const listSchemaDef:SchemaClz = {
  modelSize:{
    name:"列表宽度",
    type: "buttonGroup",
    mode:[Mode.list],
    items: [
      { label: "宽", value: 4 ,tooltip: "每行4列" },
      { label: "大", value: 3 ,tooltip: "每行3列" },
      { label: "中", value: 2 ,tooltip: "每行2列" },
      { label: "小", value: 1 ,tooltip: "每行1列" },
    ],
  },
  fixed_prefix:{
    name:"前固",
    type: "buttonGroup",
    tooltip:"固定指定的前面的列",
    mode:Mode.list,
    items: [
      { label: "1", value: 1 ,tooltip: "固定第1列" },
      { label: "2", value: 2 ,tooltip: "固定前2列" },
      { label: "3", value: 3 ,tooltip: "固定前3列" },
      { label: "4", value: 4 ,tooltip: "固定前4列" },
    ],
  },
  fixed_suffix:{
    name:"尾固",
    type: "buttonGroup",
    tooltip:"固定指定的后面的列",
    mode:Mode.list,
    items: [
      { label: "1", value: 1 ,tooltip: "固定最后1列" },
      { label: "2", value: 2 ,tooltip: "固定后2列" },
      { label: "3", value: 3 ,tooltip: "固定后3列" },
      { label: "4", value: 4 ,tooltip: "固定后列" },
    ],
  }
}

//字段的schema
export default schemaDef;