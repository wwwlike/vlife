//显示的依赖定义
type deps = {
  field: string; //依赖的属性
  value: string[]; //依赖的值 满足其中之一即可
};
export interface designProp {
  name: string;
  type: "select" | "input" | "switch";
  tag: "basic" | "rule" | "layout";
  uiType?: "req" | "save"; //使用场景
  deps?: deps; //字段显示依赖
  items?: {
    label: string;
    value: string | number; //嵌套一个，尤它进行值得选择
    uiType?: "req" | "save";
    deps?: deps;
  }[]; //子项显示依赖
}

export interface SchemaClz {
  [key: string]: designProp;
}

export const types: { title: string; value: string }[] = [
  { title: "基础属性", value: "basic" },
  { title: "校验规则", value: "rule" },
  { title: "外观布局", value: "layout" },
];

const schemaDef: SchemaClz = {
  title: {
    name: "标题",
    type: "input",
    tag: "basic",
  },
  x_component: {
    name: "组件",
    type: "select",
    tag: "basic",
    items: [
      {
        value: "SearchInput",
        label: "搜索Input",
        uiType: "req",
        deps: {
          field: "type",
          value: ["string"],
        },
      },
      {
        value: "DictSelectTag",
        label: "字典tag",
        uiType: "req",
        deps: {
          field: "type",
          value: ["string", "boolean"],
        },
      },
      {
        value: "Input",
        label: "字符输入",
      },
      {
        value: "Select",
        label: "下拉选择(字典)",
      },
      {
        value: "VlifeSelect",
        label: "下拉选择(异步)",
      },
      {
        value: "DatePicker",
        label: "日期选择",
      },
      {
        value: "RelationInput",
        label: "外键选择(弹出层)",
      },
      {
        value: "RoleResourcesSelect",
        label: "角色资源(特定)",
      },
      {
        value: "TabSelect",
        label: "Tab下拉选择(异步)",
      },
      {
        value: "TreeSelect",
        label: "树形选择(select)",
        uiType: "save",
      },
      {
        value: "TreeQuery",
        label: "树形查询组件",
        uiType: "req",
      },
      {
        value: "PageSelect",
        label: "页面多级选择组件",
        uiType: "save",
      },
    ],
  },
  initialValues: {
    name: "默认值",
    type: "input",
    tag: "basic",
  },
  dictCode: {
    name: "字典项目",
    type: "select",
    tag: "basic",
    deps: { field: "x_component", value: ["Select", "DictSelectTag"] },
    items: [],
  },
  x_hidden: {
    name: "隐藏",
    type: "switch",
    tag: "layout",
  },
  required: {
    name: "必填",
    type: "switch",
    tag: "rule",
    uiType: "save",
  },
  readOnly: {
    name: "只读",
    type: "switch",
    tag: "layout",
  },
  apiKey: {
    // 对应loadDatas value=> key
    name: "数据接口",
    type: "select",
    tag: "basic",
    items: [
      {
        value: "sysFilterSelect",
        label: "查询权限设置",
        deps: {
          field: "x_component",
          value: ["PageSelect"],
        },
      },
      {
        value: "roleAllResources",
        label: "角色资源",
        deps: {
          field: "x_component",
          value: ["RoleResourcesSelect"],
        },
      },
      {
        value: "resourcesApiAll",
        label: "上级资源选择",
        deps: {
          field: "x_component",
          value: ["TabSelect"],
        },
      },
      {
        value: "listMenu",
        label: "菜单选择",
        deps: {
          field: "x_component",
          value: ["VlifeSelect"],
        },
      },
      {
        value: "orgTree",
        label: "机构树",
        deps: {
          field: "x_component",
          value: ["TreeQuery"],
        },
      },
      {
        value: "areaTree",
        label: "地区树",
        deps: {
          field: "x_component",
          value: ["TreeQuery"],
        },
      },
      {
        value: "deptTree",
        label: "部门树",
        deps: {
          field: "x_component",
          value: ["TreeQuery"],
        },
      },

      {
        value: "orgSelect",
        label: "机构树选择",
        deps: {
          field: "x_component",
          value: ["TreeSelect"],
        },
      },
      {
        value: "areaSelect",
        label: "地区树选择",
        deps: {
          field: "x_component",
          value: ["TreeSelect"],
        },
      },
      {
        value: "deptTree",
        label: "部门树选择",
        deps: {
          field: "x_component",
          value: ["TreeSelect"],
        },
      },
    ],
  },
  x_validator: {
    name: "校验方式",
    type: "select",
    tag: "rule",
    deps: { field: "x_component", value: ["Input"] },
    items: [
      { label: "email", value: "email" },
      { label: "phone", value: "phone" },
      { label: "number", value: "number" },
      { label: "idcard", value: "idcard" },
      { label: "正则", value: "pattern" },
    ],
  },
  vlife_pattern: {
    name: "正则校验",
    type: "input",
    tag: "rule",
    deps: { field: "x_validator", value: ["pattern"] },
  },
  vlife_message: {
    name: "校验提醒",
    type: "input",
    tag: "rule",
    deps: { field: "x_validator", value: ["pattern"] },
  },
  x_component_props$placeholder: {
    name: "填写说明",
    type: "input",
    tag: "basic",
    deps: { field: "x_component", value: ["Input"] },
  },
  x_decorator_props$layout: {
    name: "标签显示位置",
    type: "select",
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
  x_decorator_props$labelAlign: {
    name: "标签对齐方式",
    type: "select",
    tag: "layout",
    deps: { field: "x_decorator_props$layout", value: ["vertical"] },
    items: [
      {
        label: "居左",
        value: "left",
      },
      {
        label: "居右",
        value: "right",
      },
    ],
  },
  x_decorator_props$gridSpan: {
    name: "组件宽度",
    type: "select",
    tag: "layout",
    items: [
      {
        label: "1列",
        value: 1,
      },
      {
        label: "2列",
        value: 2,
      },
      {
        label: "3列",
        value: 3,
      },
      // {
      //   label: "4列",
      //   value: 4,
      // },
    ],
  },
};

export default schemaDef;
