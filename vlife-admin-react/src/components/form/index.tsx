/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  registerValidateLocale,
  createForm,
  Form,
  IFormFeedback,
  onFormInit,
  onFormMount,
  onFormValuesChange,
} from "@formily/core";
import { createSchemaField, FormProvider } from "@formily/react";
import {
  FormItem,
  Input,
  FormGrid,
  GridColumn,
  Select,
  ArrayItems,
  ArrayTable,
  Checkbox,
  DatePicker,
} from "@formily/semi";
import { fieldInfo, TranDict } from "@src/mvc/base";
import RelationInput from "@src/components/form/comp/RelationInput";
import RoleResourcesSelect from "@src/pages/auth/role/RoleResourcesSelect/formily";
import TabSelect from "@src/components/form/comp/TabSelect";
import PageSelect from "@src/components/form/comp/PageSelect";
import TreeSelect from "@src/components/form/comp/TreeSelect";

/**
 * 表单布局展示，需要固定写在函数式组件之外
 * 圈定所有组件
 */
const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    FormGrid,
    GridColumn,
    Select,
    ArrayItems,
    ArrayTable,
    Checkbox,
    DatePicker,
    RelationInput, //封装关系选择formily组件。特定组件支持特定业务
    RoleResourcesSelect, // 特定的业务型组件 占2列；自定义组件，根据传参来处理
    TabSelect, //tab方式的过滤，权限选择上级权限时使用在，应该会被TreeSelect取代
    PageSelect, //平铺选择组件（查询条件过滤使用在）
    TreeSelect,
    VlifeSelect,
    SearchInput,
    DictSelectTag,
    TreeQuery,
  },
});

import { FormVo } from "@src/mvc/model/Form";
import { eventReaction } from "./reactions";
import VlifeSelect from "./comp/VlifeSelect";
import SearchInput from "./comp/SearchInput";
import DictSelectTag from "./comp/DictSelectTag";
import TreeQuery from "./comp/TreeQuery";

// reaction
//https://react.formilyjs.org/zh-CN/api/shared/schema#schemareactions

//表信息
export interface FormProps {
  entityName: string; //预留字段
  formData?: any; // form初始数据
  highlight?: string; //高亮字段(设计器使用)
  onDataChange?: (data: any, field?: string) => void; //整体数据变化回调,最新变化的字段
  onForm?: (form: Form) => void; //将最新表单信息传输出去（formModal使用）
  hideColumns?: string[]; //需要隐藏的不显示的列
  read?: boolean; //显示模式
  // layout?:string,// [] 横/纵布局
  dicts?: TranDict[]; //所有用到的字典信息(没有从authContext里取，避免耦合)
  fkMap?: any; // 外键对象信息{ID,NAME}
  // maxColumns?: number[]; //列信息个数
  modelInfo?: FormVo; //模型信息
  onError?: (error: IFormFeedback[]) => void; // 将最新错误信息传输出去 formModal使用
  //覆盖model.fileds里的数据，也可以对field里没有的信息可以进行补充
}

registerValidateLocale({
  "zh-CN": {
    required: "该字段必填",
  },
});

export default ({
  dicts,
  formData,
  onDataChange,
  onForm,
  read,
  fkMap,
  modelInfo,
  onError,
  highlight,
}: FormProps) => {
  /**
   * 动态表单数据初始化
   * 使用参考：https://core.formilyjs.org/zh-CN/api/models/form
   */
  const form = useMemo(
    () =>
      createForm({
        readPretty: read,
        // editable:false,
        initialValues: {
          ...formData,
        },
        effects() {
          onFormMount((form) => {
            if (onForm != undefined) {
              onForm(form);
            }
          }),
            onFormInit((form) => {}),
            onFormValuesChange((form) => {
              if (form.errors.length > 0 && onError !== undefined) {
                setTimeout(() => onError(form.errors), 200);
              }
              if (onDataChange !== undefined) {
                onDataChange(form.values);
              }
              if (onForm != undefined) {
                onForm(form);
              }
            });
        },
      }),
    [modelInfo, fkMap, formData]
  );

  /**
   * 字典数据提取
   */
  const fieldEnum = useCallback(
    (dictCode: string, fieldType: string) => {
      const dictEnum: { label?: string; value: any }[] = [];
      if (dicts) {
        const array = dicts.filter((sysDict) => {
          if (sysDict.column.toLowerCase() === dictCode.toLowerCase()) {
            return true;
          }
        });
        if (array && array.length > 0) {
          array[0].sysDict.forEach((d) => {
            if (fieldType === "integer") {
              dictEnum.push({ label: d.title, value: Number(d.val) });
            } else {
              dictEnum.push({ label: d.title, value: d.val });
            }
          });
        }
      }
      return dictEnum;
    },
    [dicts]
  );

  /**
   * 动态表单formily
   * 讲后端fieldInfo信息转换成schema信息
   */
  const schema = useMemo(() => {
    const pp: any = {};
    if (modelInfo) {
      modelInfo.fields.forEach((f) => {
        pp[f.fieldName] = { ...f };
        const prop: fieldInfo = pp[f.fieldName];
        // java属性不能包含“-”是"_",故进行转换，并批量赋值
        Object.keys(prop)
          .filter((key) => key.startsWith("x_"))
          .map((key) => {
            // formily 转换对应的字段， vlife转换之前的字段，用来取值
            return { formily: key.replaceAll("_", "-"), vlife: key };
          })
          .forEach((obj) => {
            //[key: string]: any
            const vlifeVal = f[obj.vlife]; // bs端存属性(包含下划线_和$的属性)存的值
            if (vlifeVal) {
              const objs = obj.formily.split("$");
              if (objs.length === 1) {
                prop[obj.formily] = vlifeVal;
              } else if (objs.length === 2) {
                //最多支持3层嵌套(不优雅先如此写死支持2层嵌套)
                if (prop[objs[0]] === undefined) {
                  prop[objs[0]] = {};
                }
                prop[objs[0]][objs[1]] = vlifeVal;
              } else if (objs.length === 3) {
                if (prop[objs[0]] === undefined) {
                  prop[objs[0]] = {};
                }
                if (prop[objs[0]][objs[1]] === undefined) {
                  prop[objs[0]][objs[1]] = {};
                }
                prop[objs[0]][objs[1]][objs[2]] = vlifeVal;
              }
            }
          });
        prop["x-decorator"] = "FormItem";
        // 高亮字段(表单设计器)
        if (f.fieldName === highlight) {
          prop["x-decorator-props"] = {
            ...prop["x-decorator-props"],
            style: { backgroundColor: "#e5ffff" },
          };
        }
        if (f.events) {
          prop["x-reactions"] = eventReaction(f.events, modelInfo.fields);
        }
        //自定义组件里需要的值通过这里传输，待从页面取
        if (f.props) {
          prop["x-component-props"] = {
            ...prop["x-component-props"],
            [f.fieldName]: f.props, //写属性名则知道去取需要的 可写死
            props: f.props,
          };
        }
        //组件关联属性附加(待移除,也需要从页面添加)
        if (
          (f.x_component === "Select" || f.x_component === "DictSelectTag") &&
          f.dictCode
        ) {
          prop.enum = fieldEnum(f.dictCode, f.type);
        } else if (f.x_component === "DatePicker") {
          //日期格式设置
          if (f.fieldType === "list") {
            prop["x-component-props"] = {
              ...prop["x-component-props"],
              type: "dateRange",
              format: "yyyy/MM/dd",
            };
          } else {
            prop["x-component-props"] = {
              ...prop["x-component-props"],
              format: "yyyy/MM/dd",
            };
          }
        } else if (f.x_component === "RelationInput") {
          //模型信息全部传入到RelationInput里，该组件与接口耦合
          prop["x-component-props"] = {
            ...prop["x-component-props"],
            fkMap: fkMap,
            ...f,
          };
        }
        if (f.vlife_pattern) {
          prop["x-validator"] = {
            validator:
              `{{(value, rule)=> {
                if (!value) return ''
                return /` +
              f.vlife_pattern +
              `/.test(value)
              }}}`,
            message: f.vlife_message ? f.vlife_message : "校验不通过",
          };
        }
        //把字段信息放入组件里
        if (prop["x-component-props"] === undefined) {
          prop["x-component-props"] = {};
        }
        // field字段上放 formFieldVo信息
        prop["x-component-props"]["field"] = f;
        //作用?
        prop.type = "string";
      });

      // pp["validator_style_2"] = {
      //   title: "局部定义风格",
      //   "x-validator": {
      //     validator: `{{(value, rule)=> {
      //       if (!value) return ''
      //       return /cat/.test(value)
      //     }}}`,
      //     message: "错误了❎",
      //   },
      //   "x-component": "Input",
      //   "x-decorator": "FormItem",
      // };
      return {
        type: "object",
        properties: {
          grid: {
            type: "void",
            "x-component": "FormGrid",
            "x-component-props": {
              maxColumns: [
                modelInfo.gridSpan,
                modelInfo.gridSpan,
                modelInfo.gridSpan,
              ], //固定6列
              minColumns: [
                modelInfo.gridSpan,
                modelInfo.gridSpan,
                modelInfo.gridSpan,
              ],
            },
            properties: pp,

            // properties: {
            //   id: {
            //     "x-component": "Input",
            //     "x-decorator": "FormItem",
            //     "x-decorator-props": { gridSpan: 1 },
            //   },
            //   id1: {
            //     "x-component": "Input",
            //     "x-decorator": "FormItem",
            //     "x-decorator-props": { gridSpan: 3 },
            //   },
            //   id2: {
            //     "x-component": "Input",
            //     "x-decorator": "FormItem",
            //     "x-decorator-props": { gridSpan: 2 },
            //   },
            // },
          },
        },
      };
    }
    return {};
  }, [modelInfo, fkMap, formData]);

  return (
    <div>
      {/* <FormProvider form={form}>
          <Field name="input" component={[Input]} />
          <FormConsumer>{(form) => form.values.input}</FormConsumer>
      </FormProvider> */}
      <FormProvider form={form}>
        {/* <FormConsumer>
          {(form) => JSON.stringify(form.values.name)}
        </FormConsumer> */}
        <SchemaField schema={schema}></SchemaField>
        {/* <FormConsumer>  {(form) => JSON.stringify(form.values.name)}
           </FormConsumer> */}
        {/* <Observer>{() => <div>{obs.value}</div>}</Observer>
           <Observer>
            {() => (
              <input
                style={{
                  height: 28,
                  padding: '0 8px',
                  border: '2px solid #888',
                  borderRadius: 3,
                }}
                value={obs.value}
                onChange={(e) => {
                  obs.value = e.target.value
                }}
              />
            )}
          </Observer> */}
      </FormProvider>
    </div>
  );
};
