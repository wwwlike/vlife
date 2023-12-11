/**
 * 使用formliy + semi联合打造的动态表单
 * reaction:https://react.formilyjs.org/zh-CN/api/shared/schema#schemareactions
 * form:    https://core.formilyjs.org/zh-CN/api/models/form
 */
import React, {
  cloneElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  registerValidateLocale,
  createForm,
  Form,
  IFormFeedback,
  onFormValuesChange,
  Field,
  onFieldValueChange,
  GeneralField,
  onFormInit,
  onFormMount,
  IFieldFeedback,
} from "@formily/core";
import { FormProvider, createSchemaField, Schema } from "@formily/react";
import {
  FormItem,
  Section,
  PreviewText,
  FormGrid,
  GridColumn,
  ArrayItems,
  ArrayTable,
  FormTab,
} from "@formily/semi";
import { IdBean, Result, TranDict } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { eventReaction } from "./reactions";
import { FormFieldVo } from "@src/api/FormField";
import { fetchPropObj } from "@src/components/form/propload";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import DesignFormItem from "@src/components/form/component/DesignFormItem";
import GroupLabel from "@src/components/form/component/GroupLabel";
import { DataType } from "@src/dsl/base";
import { exist } from "@src/api/base/baseService";
import SelectIcon from "../SelectIcon";
import { Spin } from "@douyinfe/semi-ui";
import { execVfAction, vfEventReaction, whenEl2 } from "./vfReactions";
import { VF } from "../../dsl/VF";
import { isFunction } from "lodash";
import { FormComponents } from "@src/resources/CompDatas";
import useDelayedExecution from "@src/hooks/useDelayedExecution";

export interface validate {
  [key: string]: (
    val: any, //watchDataObj
    ...watch: string[] //监听的对象，watch里的字段有改变则触发validate的方法执行，如果没有则val就时key的值 watch里面
  ) => string | Promise<Result<string>> | void; //string返回的错误信息，void表示校验通过
}

export interface FormProps<T> {
  key?: string;
  className?: string;
  rootFormName?: string; //表单模型名称
  modelInfo: FormVo; //模型信息
  parentFormData?: any; // 当前表单作为子表单，那么父表单的实时数据;做联动时会用到
  formData?: any; // 表单数据/默认初始化数据
  design?: boolean; //自定义表单设计模式（设计模式采用的是FormItem）
  terse?: boolean; //是否紧凑布局
  fontBold?: boolean; //是否label加粗
  highlight?: string; //高亮字段(当前聚焦需要高亮的)
  readPretty?: boolean; //显示模式
  dicts?: TranDict[]; //所有用到的字典信息(没有从authContext里取，避免耦合)
  ignoredFields?: string[]; //排除不展示的字段
  fkMap?: any; // 外键对象信息{ID,NAME}
  vf?: VF[]; //字段配置
  //单字段模式，只显示fieldMode里的一个字段
  fieldMode?: string;
  componentProp?: { [fieldName: string]: object }; //为特定字段传入固定的入参属性
  //指定字段校验
  // validate?: {
  //   //指定[key]字段的校验函数;校验函数： (val字段值：formData:整个表单数据)=>
  //   [key: string]: (
  //     val: any,
  //     formData?: T
  //   ) => string | Promise<Result<string>> | void;
  // };
  //表单数据改变时触发
  onDataChange?: (
    data: any, //表单数据
    field: string //当前触发改变的字段
  ) => void;
  //表单对象输出
  onForm?: (form: Form) => void;
  //子表单对象输出
  onSubForm?: (subForm: { [key: string]: Form | Form[] }) => void; //子表单传出
  // 将最新错误信息传输出去 formModal使用
  onError?: (error: IFormFeedback[]) => void;
  //设计器模式下点击fielddiv触发的相关操作回调事件
  onClickFieldComponent?: (
    fieldName: string,
    opt: "click" | "must" | "delete" //点击区域
  ) => void;
}
const formTab = FormTab.createFormTab?.("tab1");
registerValidateLocale({
  "zh-CN": {
    required: "必填项",
  },
});

//field对应的组件的prop来源于异步加载数据(联动数据)
const load = async (
  field: Field,
  parentFormData: any,
  rootFormName: string,
  formVo: FormVo
) => {
  if (
    field.componentProps["fieldInfo"] &&
    field.componentProps["fieldInfo"].x_component
  ) {
    const pageComponentPropDtos: PageComponentPropDto[] =
      field.componentProps["pageComponentPropDtos"];
    fetchPropObj(
      //请求组件属性的值
      pageComponentPropDtos, //组件设置的db设置信息(包涵参数设置)
      FormComponents[field.componentProps["fieldInfo"].x_component], //组件信息
      // field.componentProps.apiCommonParams, //下面设置进来的
      field, //字段信息；其实只传这一个值，上面三个可以都取得到
      parentFormData,
      rootFormName,
      formVo
    ).then((field: Field) => {});
  }
};
export default <T extends IdBean>({
  className,
  dicts,
  formData,
  readPretty,
  fkMap,
  modelInfo,
  rootFormName = modelInfo.type,
  highlight,
  fieldMode,
  ignoredFields,
  // validate,
  parentFormData,
  design = false,
  vf,
  terse = false,
  fontBold = false,
  componentProp,
  onClickFieldComponent,
  onError,
  onDataChange,
  onForm,
  onSubForm,
}: FormProps<T>) => {
  //控制版本，让页面重新加载刷新(添加querybuild会触发)
  const [key, setKey] = useState(0);
  //当前表单阶段
  const [formStep, setFormStep] = useState<"schemaFinished" | "onForm">();
  //子表单数据
  const [subFormObj, setSubFormObj] = useState<{
    [key: string]: Form | Form[];
  }>({});
  //子表单信息输出
  useEffect(() => {
    if (onSubForm && Object.keys(subFormObj).length > 0) {
      // onSubForm(subFormObj);
    }
  }, [subFormObj]);
  //防抖hooks
  const [delayedExecution, isCallPending] = useDelayedExecution() as [
    (callback: () => void, delay: number) => void,
    boolean
  ];

  //清除指定类型的验证提醒内容
  const clearFeedback = function (
    feeds: IFieldFeedback[],
    errorType: string
  ): IFieldFeedback[] {
    return feeds.filter((f) => f.code !== errorType);
  };

  /**
   * 联动处理方式1：
   * 动态result条件/无条件的联动处理
   */
  const formDynamicReaction = useCallback(
    (m: Form): void => {
      //result方式的比对条件
      vf?.filter(
        (f) =>
          (f.result !== undefined ||
            f.conditions === undefined ||
            f.conditions.length === 0) &&
          f.subField === undefined
      ).forEach((f) => {
        if (isFunction(f.result)) {
          const funcResult = f.result({ ...m.values, parent: parentFormData });
          if (typeof funcResult === "object") {
            //promise的typeof是object
            //1 异步promise函数
            funcResult.then((d) => {
              if (typeof d === "boolean") {
                execVfAction(
                  f.actions.filter((a) => (d ? a.fill : !a.fill)),
                  m,
                  parentFormData
                );
              } else {
                execVfAction(
                  f.actions.filter((a) => (d.data ? a.fill : !a.fill)),
                  m,
                  parentFormData
                );
              }
            });
          } else {
            //2 同步函数
            execVfAction(
              f.actions.filter((a) => (funcResult ? a.fill : !a.fill)),
              m,
              parentFormData
            );
          }
        } else if (f) {
          //3 boolean返回
          execVfAction(
            f.actions.filter((a) =>
              f.result === undefined ? true : f.result ? a.fill : !a.fill
            ),
            m,
            parentFormData
          );
        }
      });
      // //执行vf里的 func 计算函数
      // vf?.forEach((v) => {
      //   v.actions.forEach((action) => {
      //     const func = action.func;
      //     if (func !== undefined) {
      //       if (whenEl2(v, m.values)) {
      //         //条件是否满足满足则执行
      //         m.setValues(
      //           func({ formData: m.values, formVo: modelInfo, form: m })
      //         );
      //       }
      //     }
      //   });
      // });
    },
    [vf, modelInfo, parentFormData]
  );
  /**
   * 联动处理方式2：
   * 静态condition条件，动态联动function的vf进行处理
   */
  const formStaticReaction = useCallback(
    (m: Form): void => {
      vf?.filter(
        (f) => f.conditions.length > 0 && f.subField === undefined
      ).forEach((f) => {
        f.actions.forEach((action) => {
          action.reations.forEach((r) => {
            if (isFunction(r.value)) {
              execVfAction(
                f.actions.filter((a) => a.fill === whenEl2(f, m.values)),
                m,
                parentFormData
              );
            }
          });
        });
      });
    },
    [vf, modelInfo, parentFormData]
  );

  const form = useMemo(() => {
    return createForm({
      readPretty,
      initialValues: {
        ...formData,
      },
      effects() {
        //表单的生命周期
        onFormInit((form: Form) => {
          setFormStep("onForm");
        }),
          onFormMount((m: Form) => {
            if (onForm) {
              onForm(m);
            }
            formDynamicReaction(m); //动态/空条件响应
            formStaticReaction(m); //静态条件动态响应
          }),
          onFormValuesChange((m: Form) => {
            //防抖
            delayedExecution(() => {
              if (m.errors.length > 0 && onError !== undefined) {
                setTimeout(() => onError(m.errors), 200);
              }
              //fieldValueChange里处理更优
              formDynamicReaction(m);
              formStaticReaction(m);
            }, 400);
          });
        // validate 外部数据校验函数，
        // if (validate) {
        //   Object.keys(validate).forEach((fieldName) => {
        //     //onFieldValueChange 需要做到数据变化后延迟访问到这里
        //     onFieldValueChange(fieldName, (field) => {
        //       const message = validate[fieldName](
        //         field.value,
        //         field.form.values
        //       );
        //       if (message) {
        //         if (typeof message === "string") {
        //           const feedBack: IFormFeedback = {
        //             code: "ValidateError",
        //             type: "error",
        //             messages: [message],
        //           };
        //           if (onError)
        //             onError([
        //               ...field.form.errors.filter(
        //                 (f) => f.address !== fieldName
        //               ),
        //               feedBack,
        //             ]);
        //           field.setFeedback({
        //             code: "ValidateError",
        //             type: "error",
        //             messages: [message],
        //           });
        //         } else {
        //           //异步校验方式(需要延迟触发)
        //           message.then((d) => {
        //             if (d && d.data !== "") {
        //               field.setFeedback({
        //                 code: "ValidateError",
        //                 type: "error",
        //                 messages: [d.data],
        //               });
        //             } else {
        //               field.setFeedback({});
        //             }
        //           });
        //         }
        //       } else {
        //         field.setFeedback({});
        //         if (onError)
        //           onError([
        //             ...field.form.errors.filter((f) => f.address !== fieldName),
        //           ]);
        //       }
        //     });
        //   });
        // }
        modelInfo.fields.forEach((field) => {
          if (onDataChange) {
            onFieldValueChange(
              field.fieldName,
              (generalField: GeneralField, form: Form) => {
                // 计算属性联动(被动联动) 最优实现方案方式，当前是在formDataChange里做依赖响应性能有缺陷（每次无论是否依赖属性变化都触发更新）
                // if (vf) {
                //   const filterVf: VF[] = vf
                //     ?.filter((s) => s.subField === undefined) //1 =undefined过滤本表单的vf
                //     // ?.filter((s) => s.conditions?.length > 0) //2 过滤出有条件condition的vf
                //     ?.filter((s) => {
                //       // 过滤响应是动态的
                //       return (
                //         s.actions.filter((ss) => {
                //           return (
                //             ss.reations.filter(
                //               (r) => typeof r.value === "function"
                //             ).length > 0
                //           );
                //         }).length > 0
                //       );
                //     })
                //     .filter((s) => s.result === undefined); //4 过滤掉条件是result函数的
                //   filterVf.forEach((vf) => {
                //     vf.actions.forEach((action) => {
                //       action.reations
                //         .filter((r) => typeof r.value === "function")
                //         .forEach((r) => {
                //           action.fields.forEach((f) => {
                //             form.setFieldState(f, (state: any) => {
                //               state["value"] = r.value(form.values);
                //             });
                //           });
                //         });
                //     });
                //   });
                // }
                //数据传输出去的同时告知，当前触发变化的字段(评估是否需要此字段)
                onDataChange(form.values, generalField.path.toString());
                // delayedExecution(() => {
                //   onDataChange(form.values, generalField.path.toString());
                // }, 100);
              }
            );
          }
          //字段值唯一性校验
          field.validate_unique &&
            onFieldValueChange(field.fieldName, (formilyField) => {
              if (formilyField.value) {
                exist({
                  entityType: field.entityType,
                  fieldName: field.fieldName,
                  fieldVal: formilyField.value,
                  id: formilyField.form.getValuesIn("id"),
                }).then((d: Result<number>) => {
                  if (d.data && d.data > 0) {
                    if (formilyField.feedbacks.length === 0) {
                      formilyField.setFeedback({
                        code: "uniqueError",
                        type: "error",
                        messages: [field.title + "已经存在了"],
                      });
                    }
                  } else if (
                    formilyField.feedbacks.filter(
                      (f) => f.code === "uniqueError"
                    ).length > 0
                  ) {
                    const feeds = formilyField.feedbacks.filter(
                      (f) => f.code !== "uniqueError"
                    );
                    formilyField.setFeedback(
                      feeds && feeds.length > 0 ? feeds[0] : {}
                    );
                  }
                });
              } else {
                formilyField.setFeedback({});
              }
            });
        });
      },
    });
  }, [modelInfo, formData, readPretty, highlight, dicts, key]);

  const SchemaField = useMemo(() => {
    const components: any = {};
    Object.keys(FormComponents)
      .filter((key) => FormComponents[key].component)
      .forEach((key) => {
        components[key] = FormComponents[key].component;
      });
    return createSchemaField({
      components: {
        ...components,
        PreviewText,
        FormItem,
        Section,
        FormGrid,
        GridColumn,
        ArrayItems,
        FormTab,
        ArrayTable,
        DesignFormItem,
        GroupLabel,
      },
    });
  }, []);

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
   * 过滤得到分组的表单对象
   * @param pp 过滤的表单对象
   * @param tabId 分组id
   * @param index 分组索引号
   * @returns
   */
  const filterProperties = function (
    pp: any,
    code: string, //组件编码
    index: number
  ): any {
    const tmp: any = {};
    Object.keys(pp).forEach((key) => {
      if (
        (pp[key]["formTabCode"] === null && index === 0) ||
        pp[key]["formTabCode"] === code
      ) {
        if (pp[key + "_divider"]) {
          //关联添加分割线添加
          tmp[key + "_divider"] = pp[key + "_divider"];
        }
        tmp[key] = pp[key];
      }
    });
    return tmp;
  };
  const sysComponents = [
    "Input",
    "InputNumber",
    "TextArea",
    "DatePicker",
    "Select",
  ];
  /**
   * 动态表单formily
   * 后端FormField转换成schema信息
   */
  const schema: Schema = useMemo(() => {
    const pp: any = {};
    let fields: FormFieldVo[] = modelInfo.fields;
    if (fieldMode) {
      fields = modelInfo.fields.filter((f) => f.fieldName === fieldMode);
    }
    if (ignoredFields) {
      fields = modelInfo.fields.filter(
        (f) => !ignoredFields.includes(f.pathName)
      );
    }
    //过滤条设计器里不展示字段
    fields
      // .filter((f) => f.x_hidden === undefined || f.x_hidden === false)
      .sort((a, b) => {
        return a.sort - b.sort;
      })
      .forEach((f: FormFieldVo, index: number) => {
        if (f.divider) {
          pp[f.fieldName + "_divider"] = {
            type: "object",
            "x-component": "GroupLabel",
            "x-decorator": "FormItem",
            "x-component-props": {
              text: f.dividerLabel,
              className: "",
            },
            "x-decorator-props": {
              gridSpan: 4,
            },
          };
        }
        pp[f.fieldName] = {
          ...f,
        };
        const prop: any = pp[f.fieldName];

        // java属性不能包含“-”是"_",故进行转换，并批量赋值
        Object.keys(prop)
          .filter((key) => key.startsWith("x_"))
          .map((key) => {
            // formily 转换对应的字段， vlife转换之前的字段，用来取值
            return { formily: key.replaceAll("_", "-"), vlife: key };
          })
          .forEach((obj: { formily: string; vlife: string }) => {
            const vlifeVal = f[obj.vlife]; // bs端存属性(包含下划线_和$的属性)存的值
            if (vlifeVal) {
              const objs = obj.formily.split("$");
              if (objs.length === 1) {
                prop[obj.formily] = vlifeVal;
              } else if (objs.length === 2) {
                //最多支持3层嵌套
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
        //隐藏标签
        if (prop.hideLabel) {
          if (design) {
            prop.title = (
              <>
                {prop.title}
                <SelectIcon value="IconEyeClosedSolid" read size="small" />
              </>
            );
          } else {
            prop.title = "";
          }
        } else if (readPretty) {
          prop.title = prop.title + ":";
        }
        //包裹的组件，设计器的包裹组件替换掉FormItem
        if (design) {
          prop["x-decorator"] = "DesignFormItem";
          prop["x-decorator-props"] = {
            ...prop["x-decorator-props"],
            highlight: highlight,
            // style: {
            //   backgroundColor:
            //     highlight === f.fieldName ? "rgba(33, 150, 243, 0.15)" : "",
            // },
            itemType: modelInfo.itemType,
            feedbackLayout: terse || readPretty ? "terse" : "",
            // extra: "描述文案",
            onClick: (fieldName: string, opt: "click" | "delete" | "must") => {
              //点击组件上的按钮
              if (onClickFieldComponent) {
                onClickFieldComponent(fieldName, opt);
              }
            },
            design: true,
            ...f,
          };
        } else {
          prop["x-decorator"] = "FormItem";
          prop["x-decorator-props"] = {
            ...prop["x-decorator-props"],
            labelStyle: {
              display: f.hideLabel ? "none" : "",
            },
            feedbackLayout: terse ? "terse" : null, //紧凑布局
            bordered: false,
            // before:content-['_:']
            className: `   ${index === fields.length - 1 ? "flex-grow" : ""} ${
              fontBold ? "font-bold" : ""
            }`,
            labelAlign: "left",
          };
        }
        // 数据库添加添加级联响应
        if (
          f.events &&
          (design === false || design === undefined) //设计模式下无效，避免字段不展示
        ) {
          prop["x-reactions"] = eventReaction(
            [...(f.events || [])],
            modelInfo.fields
          );
        }
        // 被动静态联动(非result方式的，value非function)：过滤出action响应字段里包含本字段的级联，
        if (vf) {
          const filterVf: VF[] = vf
            ?.filter((s) => s.subField === undefined) //1 =undefined过滤本表单的vf
            ?.filter((s) => s.conditions?.length > 0) //2 过滤出有条件condition的vf
            ?.filter((s) => {
              // 3过滤响应字段包含当前字段
              return (
                s.actions.filter((ss) => {
                  return ss.fields.includes(f.fieldName);
                }).length > 0
              );
            })
            .filter((s) => s.result === undefined); //4 过滤掉条件是result函数的
          if (filterVf && filterVf.length > 0) {
            const reaction = vfEventReaction(
              filterVf.map((v) => {
                const vf = new VF("");
                Object.assign(vf, v);
                vf.actions = [];
                v.actions.forEach((action) => {
                  if (action.fields.includes(f.fieldName)) {
                    vf.getActions().push(action);
                  }
                });
                return vf;
              }),
              form
            );
            prop["x-reactions"] = reaction;
          }
        }
        if (f.fieldName === "code") {
          prop["x-reactions"] = [
            {
              dependencies: ["formId", "func"],
              fulfill: (field: any) => {
                field.componentProps = {
                  ...field.componentProps,
                  optionList: [],
                };
              },
            },
          ];
        }
        //组件关联属性附加(待移除,也需要从页面添加)
        if (
          (f.x_component === "Select" || f.x_component === "DictSelectTag") &&
          f.dictCode
        ) {
          // prop.enum = fieldEnum(f.dictCode, f.fieldType);
        } else if (f.x_component === "DatePicker") {
          if (f.dataType === DataType.array) {
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
          //待移除 模型信息全部传入到RelationInput里，该组件与接口耦合
          prop["x-component-props"] = {
            ...prop["x-component-props"],
            fkMap: fkMap,
            ...f,
          };
        }
        const isValidRegExp = (str: string) => {
          try {
            new RegExp(str);
            return true;
          } catch (e) {
            return false;
          }
        };
        //正则验证
        if (f.vlife_pattern && isValidRegExp(f.vlife_pattern)) {
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
        if (prop["x-component-props"] === undefined) {
          prop["x-component-props"] = {};
        }
        if (!sysComponents.includes(f.x_component)) {
          prop["x-component-props"] = {
            ...prop["x-component-props"],
            ...componentProp?.[f.fieldName],
            design: design,
            onForm: (subForm: Form | Form[]) => {},
            onDataChange: (data: any) => {
              //自定义组件接收修订的数据
              if (
                (typeof data === "string" &&
                  (data === "undefined" ||
                    data === "null" ||
                    data === undefined ||
                    data === null)) ||
                (data instanceof Array && data.length === 0)
              ) {
                //值去除
                form.deleteValuesIn(f.fieldName);
              } else if (data instanceof Array) {
                if (f.dataType === "basic") {
                  form.setValuesIn(f.fieldName, data[0]);
                } else {
                  form.setValuesIn(
                    f.fieldName,
                    JSON.parse(JSON.stringify(data))
                  );
                }
              } else {
                form.setValuesIn(f.fieldName, data);
              }
            },
            //自定义组件 VfBaseProps 的入参
            fieldInfo: {
              ...f, //把字段信息全放入
            },
            formData: form.values, //表单数据
            formName: rootFormName || modelInfo.type, //根表单名
            model: modelInfo, //模型信息
            // form: form, //formliy的表单信息传入到字段里；（子表单使用，把子form注入到父form里）
            entityType: modelInfo.entityType,
            componentSetting: f.componentSetting,
            //组件设置信息
            pageComponentPropDtos: f.pageComponentPropDtos,
            // 组件prop组件接口取值通用参数，不一定使用但是每次必定传，固需要用则参数名称应该和下面一致
            apiCommonParams: {
              type: modelInfo.type,
              itemType: modelInfo.itemType,
              entityType: modelInfo.entityType, //当前业务模型名称
              id: formData?.id, //当前业务记录id,
              fieldName: f.fieldName, //当前字段
              val: formData ? formData[f.fieldName] : undefined, //当前字段的值
              //               fieldEntityType: f.entityType,
            },
            vf: vf
              ?.filter((s) => s.subField === f.fieldName) //f.pathName
              ?.map((subFs, index) => {
                return { ...subFs, subField: undefined };
              }), //子表单fs设置过滤
            read: readPretty, //预览状态
            terse,
            fontBold,
          };
        }
        // 组件配置里CompData里props配置的固定属性值提取（boolean,string,number,date,ReactNode）
        const propInfo = FormComponents[f.x_component]?.props;
        if (propInfo) {
          const keys = Object.keys(propInfo);
          keys.forEach((k) => {
            if (
              typeof propInfo[k] === "string" ||
              propInfo[k] instanceof Date ||
              typeof propInfo[k] === "number" ||
              typeof propInfo[k] === "boolean" ||
              React.isValidElement(propInfo[k])
            ) {
              prop["x-component-props"] = {
                ...prop["x-component-props"],
                //reactNode类型的节点属性对应的组件创建，如：select的底部slot
                [k]: React.isValidElement(propInfo[k])
                  ? React.Children.map(propInfo[k] as ReactNode, (child) => {
                      if (React.isValidElement(child)) {
                        return cloneElement(propInfo[k] as any, {
                          ...f, //将formfieldVo属性解构
                          vf: vf
                            ?.filter((s) => s.subField === f.fieldName) //f.pathName,
                            ?.map((subFs, index) => {
                              return { ...subFs, subField: undefined };
                            }), //子表单fs设置过滤
                          setKey: setKey,
                          form: form,
                        });
                      }
                      return child;
                    })
                  : propInfo[k], //一般属性string boolean ,number date
              };
            }
          });
        }
        // 2在formDesign设计器里配置的组件属性数据进行提取，和**转换**
        if (prop["x-reactions"]) {
          prop["x-reactions"] = [
            ...prop["x-reactions"],
            (field: Field) => {
              load(field, parentFormData, rootFormName, modelInfo);
            },
          ];
        } else {
          prop["x-reactions"] = [
            (field: Field) => {
              load(field, parentFormData, rootFormName, modelInfo);
            },
          ];
        }
        prop.type = "string"; //?
      });

    const schemaObj: any = { type: "object", properties: {} };
    const grid = {
      type: "void",
      "x-component": "FormGrid",
      "x-component-props": {
        minWidth: 50, //最小宽度
        // minColumns: [4, 4, 4],
        maxColumns: [
          modelInfo.modelSize,
          modelInfo.modelSize,
          modelInfo.modelSize,
        ], //大中小尺寸
        minColumns: [
          modelInfo.modelSize,
          modelInfo.modelSize,
          modelInfo.modelSize,
        ],
      },
    };
    //有分组则加入分组容器，把内容组件放入容器里
    if (modelInfo.formTabDtos) {
      schemaObj.properties = {
        collapse: {
          type: "void",
          "x-component": "FormTab",
          properties: {},
        },
      };
      modelInfo.formTabDtos
        .sort((tab1, tab2) => tab1.sort - tab2.sort)
        .forEach((tab, index) => {
          schemaObj.properties.collapse.properties[tab.code] = {
            type: "void",
            "x-component": "FormTab.TabPane",
            "x-component-props": {
              tab: tab.name,
            },
            properties: {
              content: {
                ...grid,
                properties: filterProperties(pp, tab.code, index),
              },
            },
          };
        });
      return schemaObj;
    } else {
      return {
        type: "object11111111",
        properties: {
          content: { ...grid, properties: pp },
        },
      };
    }
  }, [
    modelInfo,
    fkMap,
    readPretty,
    formData,
    parentFormData,
    highlight,
    form,
    componentProp,
    vf,
  ]);

  return form && formStep === "onForm" ? (
    <PreviewText.Placeholder value="-">
      {/* {vf?.length} */}
      <FormProvider form={form}>
        <div className={`${className ? className : ""} relative`}>
          <SchemaField
            schema={schema}
            scope={{
              formTab,
              load,
            }}
          ></SchemaField>
        </div>
      </FormProvider>
    </PreviewText.Placeholder>
  ) : (
    <div className=" h-full w-full flex items-center justify-center ">
      <Spin size="large">
        <div
          style={{
            borderRadius: "4px",
            paddingTop: "48px",
          }}
        >
          <p>正在构建...</p>
        </div>
      </Spin>
    </div>
  );
};
