// 根据FormReaction信息返回对应的 formReaction对象
import { SchemaReaction } from "@formily/react";
import { FormEventVo } from "@src/api/FormEvent";
import { FormReactionVo } from "@src/api/FormReaction";
import { FormFieldDto } from "@src/api/FormField";

/**
 * 支持事件属性
 */
 export const attrs: {
  [key: string]: {
    name: string; //中文
    type: "boolean" | "string" | "number";
    support?: ("event" | "reactions")[];

    // component?:string[],//支持的组件
    // fieldType?:string[]
  }; //支持的字段类型
} = {
  value: {
    name: "值",
    type: "string",
  },
  "x-disabled": {
    name: "只读",
    type: "boolean",
    support: ["reactions"],
  },
  required: {
    name: "必填",
    type: "boolean",
    support: ["reactions"],
  },
  "x-hidden": {
    //值保留 visable值不保留
    name: "隐藏",
    type: "boolean",
    support: ["reactions"],
  },
  "x-read-pretty": {
    name: "只读2",
    type: "boolean",
    support: ["reactions"],
  },
  visible: {
    name: "显示",
    type: "boolean",
    support: ["reactions"],
  },
};

/**
 * 事件触发字符串
 */
const when = (event: FormReactionVo): string => {
  return "{{$deps[0].required===true}}";
};

/**
 * 响应字段的名称计算(如有$则去掉返回第一层)
 */
const reactionName = (prop: string): string => {
  if (prop.indexOf("$") !== -1) {
    return prop.substring(0, prop.indexOf("$"));
  } else {
    return prop;
  }
};

/**
 * 响应字段的匹配值
 * 将prop:aaa&bbb&ccc ;val=123的入参 转换成 {aaa:{bbb:{ccc:123}}} 返回出去
 * 支持递归计算
 * $是分隔符
 */
const reactionVal = (prop: string, val: any): any => {
  const $index = prop.indexOf("$");
};

/**
 * 满足条件时，目标对象属性变化
 * @param prop 属性
 * @param val 属性值
 * @returns
 */
const fulfillObj = (prop: string, val: any): any => {
  // const stringObj = isStringObject(val)
  const len = val.length;
  //去除匹配值里有的字符串开头结尾的符号"'
  if (val && len && (val.startsWith('"') || val.startsWith("'"))) {
    val = val.substring(1, len - 1);
  }

  const isObj = prop.indexOf("$") !== -1;
  if (!isObj) {
    //简单对象
    if (prop.startsWith("x-")) {
      return {
        schema: {
          [prop]: val,
        },
      };
    } else {
      return {
        state: {
          [prop]: val,
        },
      };
    }     
  } else {
    //包含$
    const before = prop.substring(0, prop.indexOf("$"));
    const after = prop.substring(prop.indexOf("$") + 1);
    const obj = fulfillObj(before, {});
    obj[before.startsWith("x-") ? "schema" : "state"][before][after] = val;

    return obj;
  }
};
//1. Boolean类型，取反;
const otherwiseObj = (prop: string, val: any, field: FormFieldDto): any => {
  if (attrs[prop].type === "boolean") {
    return fulfillObj(prop, val === "false" ? true : false);
  }
  return {};
};

const whenEl = (prop: string, eventType: string, val: any): string => {
  if (eventType === "change") {
    return `{{$self.${prop}}}`;
  } else if (eventType === "equals") {
    return `{{$self.${prop}==="${val}"}}`;
  } else if (eventType === "ne") {
    return `{{$self.${prop}!=="${val}"}}`;
  } else if (eventType === "null") {
    return `{{$self.${prop}===null||$self.${prop}===undefined}}`;
  } else if (eventType === "notNull") {
    return `{{$self.${prop}}}`;
  }
  return "";
};

/**
 * 主动联动，
 * 扩展点：满足条件修改指定值为某个值，otherwise(不满足)时如何处理
 * 1. Boolean类型，取反
 * 2. 有默认值,otherwise取默认值
 * 3. 制空
 */
export const eventReaction = (
  events: Partial< FormEventVo>[], //联动信息
  fields: FormFieldDto[] //所有字段信息
): SchemaReaction[] => {
  let obj: SchemaReaction[] = [];
  if(events){
  events.forEach((event) => {
    if(event.reactions&& event.reactions.length>0){
    obj = [
      ...obj,
      ...event.reactions?.map((reaction) => {
        return {
          target: `${reaction.fieldName}`,
          // when: `{{$self.value==="${event.val}"}}`,
          when: whenEl(event.attr||"", event.eventType||"", event.val),
          fulfill: fulfillObj(
            reaction.reactionAttr||"",
            // '{{$self.value.split('/')[1]}}',
            reaction.reactionValue
          ),
          otherwise: otherwiseObj(
            reaction.reactionAttr||"",
            reaction.reactionValue,
            fields.filter((f) => f.fieldName === reaction.fieldName)[0]//事件字段 （没有用到）
          ),
        };
      }),
    ];}
  });}
  return obj;
    
};

export const loadDeps = (dynamic: any, entityType: string): any => {
  const mapping:any = {};
  let keys: string[] = Object.keys(dynamic);
  keys.forEach((key) => {
    mapping[key] =
      dynamic[key][
        Object.keys(dynamic[key]).filter((m) => m === entityType)[0]
      ];
  });
  return mapping;
};
