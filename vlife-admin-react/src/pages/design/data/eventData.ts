/**
 * 事件数据源头
 */

type deps = {
  field: string; //依赖的字段
  value: string[] | string; //依赖的值
};
export interface eventProp {
  name: string; //中文
  type: "select" | "input" | "switch";
  deps?: deps; //字段显示依赖
  items?: {
    //子项
    label: string; //子项名称
    type: any; // 子项类型
    value: any; //子项值
    deps?: deps; //明细依赖显示
  }[];
}

export interface eventClz {
  [key: string]: eventProp;
}

const eventDef: eventClz = {
  formFieldId: { name: "字段", type: "select" }, //动态加载
  attr: {
    name: "属性",
    type: "select",
    items: [{ label: "值", value: "value", type: "string" }],
  },
  eventType: {
    name: "事件",
    type: "select",
    items: [
      {
        label: "等于",
        value: "equal",
        type: "string",
      },
    ],
  },
};
