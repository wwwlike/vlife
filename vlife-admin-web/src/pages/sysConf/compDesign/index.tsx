import { IconInfoCircle } from "@douyinfe/semi-icons";
import {
  Banner,
  ButtonGroup,
  Divider,
  Input,
  InputGroup,
  Select,
  Switch,
  TabPane,
  Tabs,
  Tooltip,
} from "@douyinfe/semi-ui";
import Form from "@src/components/form";
import { FormVo } from "@src/api/Form";
import { FormEventVo } from "@src/api/FormEvent";
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import React, { ReactNode, useCallback, useMemo } from "react";
import { Mode } from "@src/dsl/schema/base";
import schemaDef, { deps, SchemaClz, types } from "@src/dsl/schema/field";
import VlifeButton from "@src/components/vlifeButton";
import FieldComponentSetting from "./component/FieldComponentSetting";

/**
 * schemaData选择组件
 * 1. 包含组件属性设置 FieldComonentSetting  调用
 * 2. 字段表单的属性设置 render()函数 （抽取出去）
 * 待：接收FormFieldVo数据，与schemaData对应的数据进行操作，隐藏组件的数据需要清空
 */
interface schemaModalProp {
  /**
   * 组件使用场景
   */
  mode: Mode;
  /**
   * 当前字段信息
   */
  field: FormFieldVo;
  /**
   * 字段所在表单信息
   */
  form: FormVo;
  /**
   * 设置信息回传
   */
  onDataChange: (field: FormFieldVo) => void;
}

export default ({ field, form, onDataChange, mode }: schemaModalProp) => {
  /**
   *  对字段属性的字典，和列宽,所在容器进行计算和提取在这里完成组装
   */
  const fieldsConf = useMemo((): SchemaClz => {
    //动态加入相关内容
    schemaDef["formTabCode"].items = [];
    if (form.formTabDtos && form.formTabDtos.length > 0) {
      form.formTabDtos.forEach((tab, index) => {
        schemaDef["formTabCode"].items?.push({
          value: tab.code,
          label: tab.name || "",
        });
      });
    }

    if (form.modelSize) {
      const obj: { [key: string]: number } =
        form.modelSize + "" === "4"
          ? { "25": 1, "50": 2, "75": 3, "100": 4 }
          : form.modelSize + "" === "3"
          ? { "33": 1, "66": 2, "100": 3 }
          : form.modelSize + "" === "2"
          ? { "50": 1, "100": 2 }
          : { "100": 1 };

      schemaDef["x_decorator_props$gridSpan"].items = Object.keys(obj).map(
        (key: string) => {
          return {
            value: obj[key],
            label: key,
            tooltip: `一行${form.modelSize}列占${obj[key]}列`,
          };
        }
      );
    }
    return schemaDef;
  }, [JSON.stringify(form)]);

  /** 设置的属性是否能够展示进行检查，依赖的项目是否满足 */
  const check = useCallback(
    (fieldName: string, dd: deps | deps[] | undefined): boolean => {
      if (dd === undefined) return true;
      let arr: deps[] = [];
      if (dd instanceof Array<deps>) {
        arr = dd;
      } else {
        arr.push(dd);
      }
      let back: boolean = false;
      back =
        //大类必须都满足
        arr.filter((a) => a.value.includes(field[a.field])).length ===
        arr.length;
      return back;
    },
    [field]
  );

  const fieldEvents = useMemo((): FormEventVo[] => {
    const events: FormEventVo[] = [];
    form.fields
      .filter((f) => f.events)
      .forEach((f) => {
        f.events
          .filter((e) =>
            e.reactions.map((r) => r.formFieldId).includes(field.id + "")
          )
          .forEach((e) => {
            events.push(e);
          });
      });

    return events;
  }, [form]);

  const render = useCallback(
    (key: string): ReactNode => {
      if (
        //1无依赖值无UI场景，2有依赖有ui都满足 3满足ui场景 4满足字段依赖
        (fieldsConf[key].deps === undefined &&
          fieldsConf[key].mode === undefined) ||
        (fieldsConf[key].mode &&
          fieldsConf[key].mode === mode && //场景满足
          fieldsConf[key].deps &&
          // fieldsConf[key].deps?.value.includes(
          //   field[fieldsConf[key].deps?.field || ""]
          // )

          check(key, fieldsConf[key].deps)) ||
        (fieldsConf[key].mode &&
          fieldsConf[key].deps == undefined &&
          fieldsConf[key].mode === mode) ||
        (fieldsConf[key].deps &&
          fieldsConf[key].mode == undefined &&
          check(key, fieldsConf[key].deps))
        // fieldsConf[key].deps?.value.includes(
        //   field[fieldsConf[key].deps?.field || ""]
        // )
      ) {
        if (fieldsConf[key].type === "select") {
          const optionList = fieldsConf[key].items?.filter((item) => {
            if (
              //选择项的显示根据依赖值是否满足来完成进一步的展示
              (item.deps === undefined && item.mode === undefined) ||
              (item.deps &&
                check(key, item.deps) &&
                item.mode &&
                mode === item.mode) ||
              (item.deps && item.mode === undefined && check(key, item.deps)) ||
              (item.mode && item.deps === undefined && mode === item.mode)
            ) {
              return true;
            }
            return false;
          });
          if (optionList && optionList?.length > 0) {
            return (
              <Select
                showClear
                key={"select_" + key}
                // field={key}
                value={field[key]}
                onChange={(d) => {
                  onDataChange({
                    ...field,
                    [key]: d,
                  });
                }}
                style={{ width: "100%" }}
                optionList={optionList.filter((d) => d !== undefined)}
              ></Select>
            );
          }
        }
        if (fieldsConf[key].type === "input") {
          return (
            <Input
              key={"input_" + key}
              // field={key}
              // label=
              value={field[key]}
              style={{ width: "100%" }}
              onChange={(value) => {
                onDataChange({
                  ...field,
                  [key]: value,
                });
              }}
            ></Input>
          );
        }
        if (fieldsConf[key].type === "switch") {
          return (
            <InputGroup key={"inputgroup" + key}>
              <Switch
                checked={field[key]}
                onChange={(val) => {
                  onDataChange({
                    ...field,
                    [key]: val,
                  });
                }}
                key={"switch" + key}
                // field={key}
              ></Switch>
            </InputGroup>
          );
        }
        const items = fieldsConf[key]?.items;
        if (
          fieldsConf[key].type === "buttonGroup" &&
          items !== undefined &&
          items.length > 0
        ) {
          return (
            <ButtonGroup key={"ButtonGroup" + key} className=" flex items-end ">
              {items?.map((item, index) => {
                return (
                  <VlifeButton
                    key={`subButton_${key + index}`}
                    tooltip={item.tooltip}
                    type={
                      item.value + "" === field[key] + ""
                        ? "primary"
                        : `tertiary`
                    }
                    value={item.value + ""}
                    onClick={() => {
                      onDataChange({
                        ...field,
                        [key]: item.value,
                      });
                    }}
                  >
                    {item.label}
                    {/* {item.value} {key} */}
                  </VlifeButton>
                );
              })}
            </ButtonGroup>
          );
        }
        //类型时表单，默认值使用他，目前存在部分类型组件可以不需要默认值。
        if (
          fieldsConf[key].type === "form" &&
          field &&
          field.fieldName !== undefined
        ) {
          return (
            <Form
              modelInfo={{
                ...form,
                modelSize: 1,
                fields: form.fields.map((f) => {
                  return { ...f, title: "" };
                }),
              }}
              fieldMode={field.fieldName}
              formData={{ [field.fieldName]: field[key] }}
              onDataChange={(d) => {
                //alert(key);
                // field[key] = d[key];
                onDataChange({
                  ...field,
                  [key]: d[field.fieldName + ""],
                });
              }}
            />
          );
        }
      }
    },
    [fieldsConf, field]
  );

  return (
    <div>
      <div
        style={{
          fontSize: "14px",
          borderStyle: "dotted solid dashed solid",
          borderColor: "#cccccc",
        }}
      >
        <div className=" absolute bottom-2">
          {fieldEvents
            .filter((e) => e.sys !== true)
            .map((e) => {
              return (
                <Banner
                  // type="success"
                  description={"1111" + e.sys + e.name}
                ></Banner>
              );
            })}
        </div>

        {field ? (
          <div>
            <b style={{ font: "14px" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;标识/分类/模型：{field.fieldName}/
              {field.dataType}/{field.fieldType}
              <Divider margin="12px" />
            </b>
          </div>
        ) : (
          "请选择一个表单元素"
        )}
      </div>
      <Tabs type="button" defaultActiveKey={"panel_0"} keepDOM={true}>
        {types.map((t, index) => {
          return (
            <TabPane
              key={"panel_" + index}
              tab={t.title}
              itemKey={"panel_" + index}
              icon={<t.icon></t.icon>}
              style={{ padding: "2px" }}
            >
              {/* 第一个panel设置组件 */}
              {index === 0 && field.fieldName && (
                <FieldComponentSetting
                  key={field.fieldName}
                  mode={mode}
                  fieldName={field.fieldName}
                  fields={form.fields}
                  x_component={field.x_component}
                  pageComponentPropDtos={field.pageComponentPropDtos}
                  onDataChange={(data: {
                    x_component: string;
                    pageComponentPropDtos?: Partial<PageComponentPropDto>[];
                  }) => {
                    const fmv: FormFieldVo = {
                      ...field,
                      x_component: data.x_component,
                      pageComponentPropDtos: data.pageComponentPropDtos
                        ? [...data.pageComponentPropDtos]
                        : [],
                    };
                    onDataChange(fmv);
                  }}
                />
              )}

              {Object.keys(fieldsConf)
                .filter((key) => fieldsConf[key].tag === t.value)
                .map((key: string, index: number) => {
                  const RenderObj = render(key); //待渲染的数据
                  return (
                    RenderObj && (
                      <div
                        key={key}
                        className="flex items-center space-x-2 w-full mt-2"
                      >
                        <div className="semi-form-field-label-text semi-form-field-label">
                          <label>
                            {fieldsConf[key].name}
                            {fieldsConf[key].tooltip && (
                              <Tooltip content={fieldsConf[key].tooltip}>
                                <IconInfoCircle />
                              </Tooltip>
                            )}
                          </label>
                        </div>
                        <div className=" w-full ">{RenderObj}</div>
                      </div>
                    )
                  );
                })}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};
