/**
 * 给表单添加事件(基础版。支持固定值)
 */
import { Button, Card, Col, Divider, Form, Row } from "@douyinfe/semi-ui";
import { ArrayField, FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { FormEventDto } from "@src/mvc/model/FormEvent";
import React, { useCallback, useMemo } from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/mvc/model/Form";
import { FormFieldVo } from "@src/mvc/model/FormField";

//入参类型
interface eventProps {
  model: FormVo; //模型
  dto?: Partial<FormEventDto>; //数据
  title?: string; //
  onValueChange: (dto: Partial<FormEventDto>) => void;
}

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
  // decoratorProps$gridSpan: {
  //   name: "宽度",
  //   type: "number",
  // },
};

/**
 * 事件类型结构
 */
interface eventType {
  [key: string]: {
    name: string; //名称
    attr: string[]; //支持的属性,
    match: boolean; //是否需要有事件匹配的固定的某写值匹配
    matchNum?: number; //匹配值的数量,匹配1，2等多个值，以便暂时不同组件录入值，暂时没启用
    matchAttr?: string[]; //匹配的属性，默认不限制则attrs里的都能匹配
    el?: boolean; //是否支持表达式
  };
}
/**
 * 匹配方式
 */
const events: eventType = {
  equals: {
    name: "等于",
    attr: ["value"], //支持的属性,
    match: true,
  },
  ne: {
    name: "不等于",
    attr: ["value"], //支持的属性,
    match: true,
  },
  booleanEq: {
    name: "等于",
    attr: ["x-disabled", "required", "x-hidden"], //支持的属性,
    match: true,
  },
  null: {
    name: "为空",
    attr: ["value"], //支持的属性,
    match: false,
  },
  notNull: {
    name: "不为空",
    attr: ["value"], //支持的属性,
    match: false,
  },
  change: {
    name: "变化时",
    attr: ["value"], //支持的属性,
    match: false,
    matchAttr: ["value"], // 响应属性
  },
};

/**
 * 事件响应设置模块页面
 * 用到1对多同时保存，故没有用生成的页面
 */
export default ({ model, dto, onValueChange, title }: eventProps) => {
  const { getDict } = useAuth();
  const [data, setData] = useState<Partial<FormEventDto>>(
    dto || { formId: model.id, reactions: [{}] }
  );

  /**
   * 当前依赖的字段
   */
  const depsField = useMemo((): FormFieldVo => {
    return model.fields.filter((f) => f.id === data.formFieldId)[0];
  }, [model, data.formFieldId]);

  const dict = useMemo(() => {
    if (depsField && depsField.dictCode) {
      return getDict({ emptyLabel: "请选择", codes: [depsField.dictCode] })[0]
        .sysDict;
    }
    return [];
  }, [depsField]);

  /**
   * semi表单对象
   */
  const api = useRef<FormApi>();
  useEffect(() => {
    api.current?.setValues({ ...data });
  }, [data.id]);

  const name = useMemo((): string => {
    let str = "请根据需求选择实际场景对应的表单响应内容";
    if (data.formFieldId) {
      str = `当'${depsField.title}'的`;
      if (data.attr) {
        str = str + "'" + attrs[data.attr].name + "属性为'";
      }
      if (data.eventType) {
        str = str + events[data.eventType].name;
      }
      if (depsField.dictCode) {
        str = str + dict.filter((d) => d.val === data.val)[0].title + "时，";
      } else if (data.val) {
        str = str + data.val + "时，";
      }
      if (data.reactions) {
        data.reactions.forEach((f) => {
          if (f.formFieldId) {
            const fieldVo = model.fields.filter(
              (ff) => f.formFieldId === ff.id
            )[0];
            str = str + fieldVo.title + "的";
            if (f.reactionAttr) {
              str = str + attrs[f.reactionAttr].name;
            }
            if (f.reactionValue) {
              str = str + "等于" + f.reactionValue + ";";
            }
          }
        });
      }
    }
    return str;
  }, [data]);

  /**
   * name变化则触发事件
   */
  useEffect(() => {
    onValueChange({ ...data, ...api.current?.getValues(), name });
  }, [name]);

  return (
    <>
      <Form
        getFormApi={(formApi: any) => (api.current = formApi)}
        labelAlign="left"
        labelPosition="left"
        onValueChange={(formData: any, val: any) => {
          if (Object.keys(val).length === 1) {
            setData({ ...data, ...formData });
          }
        }}
      >
        <Card>
          <div style={{ fontSize: "16px" }}>
            <b>{name}</b>
          </div>
        </Card>
        <Row>
          <Col span={6} key="col1">
            <Form.Select
              field="formFieldId"
              onChange={(data1) => {
                api.current?.reset();
              }}
              label="事件字段"
              style={{ width: "90%" }}
            >
              {model.fields
                .filter((f) => f.x_hidden !== true)
                .map((f) => (
                  <Form.Select.Option value={f.id} key={f.id}>
                    {f.title}
                  </Form.Select.Option>
                ))}
            </Form.Select>
          </Col>
          <Col span={6} key="col2">
            <Form.Select
              field="attr"
              label="属性"
              onChange={() => {
                setData({ ...data, eventType: undefined });
              }}
              style={{ width: "90%" }}
            >
              {Object.keys(attrs)
                .filter(
                  (k: string) =>
                    attrs[k].support === undefined ||
                    attrs[k].support?.includes("event")
                )
                .map((key) => {
                  return (
                    <Form.Select.Option value={key} key={key + "attr"}>
                      {attrs[key].name}
                    </Form.Select.Option>
                  );
                })}
            </Form.Select>
          </Col>
          <Col span={6} key="col3">
            {data.attr ? (
              <Form.Select
                field="eventType"
                label="匹配方式"
                style={{ width: "90%" }}
              >
                {Object.keys(events)
                  .filter((key) => {
                    const eventType = events[key];
                    return (
                      eventType.attr === undefined || //没设置
                      eventType.attr.filter((str) => str === data.attr).length >
                        0 //包含
                    );
                  })
                  .map((key) => {
                    return (
                      <Form.Select.Option value={key} key={key + "_eventType"}>
                        {events[key].name}
                      </Form.Select.Option>
                    );
                  })}
              </Form.Select>
            ) : (
              ""
            )}
          </Col>
          <Col span={6} key="col4">
            {/* 显示的控件和字段类型和是否显录入值有关 */}
            {data.attr && data.eventType && events[data.eventType].match ? (
              depsField && depsField.dictCode ? (
                <Form.Select field="val" label="匹配值域">
                  {dict.map((dict) => {
                    return (
                      <Form.Select.Option
                        key={"dict" + dict.val}
                        value={dict.val}
                      >
                        {dict.title}
                      </Form.Select.Option>
                    );
                  })}
                </Form.Select>
              ) : attrs[data.attr].type === "string" ? (
                <Form.Input field="val" label="匹配值域" />
              ) : attrs[data.attr].type === "boolean" ? (
                <Form.Select field="val" label="匹配值域">
                  <Form.Select.Option value={"true"}>true</Form.Select.Option>
                  <Form.Select.Option value={"false"}>false</Form.Select.Option>
                </Form.Select>
              ) : attrs[data.attr].type === "number" ? (
                <Form.InputNumber field="val" label="匹配值域" />
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Divider margin="12px" align="left">
          响应字段信息
        </Divider>
        <ArrayField field="reactions" initValue={data.reactions}>
          {({ add, arrayFields, addWithInitValue }) => (
            <React.Fragment>
              <Button onClick={add} theme="light">
                新增响应
              </Button>
              {arrayFields.map(({ field, key, remove }, i) => (
                <div key={key}>
                  <Row key={"row" + i}>
                    <Col span={6} key="col1">
                      <Form.Select
                        field={`${field}[formFieldId]`}
                        label="响应字段"
                        style={{ width: "90%" }}
                      >
                        {model.fields
                          .filter((f) => f.x_hidden !== true)
                          .map((f) => (
                            <Form.Select.Option value={f.id} key={f.id}>
                              {f.title}
                            </Form.Select.Option>
                          ))}
                      </Form.Select>
                    </Col>
                    <Col span={6} key="col2">
                      {data && data.eventType !== undefined ? (
                        <Form.Select
                          field={`${field}[reactionAttr]`}
                          label="属性"
                          style={{ width: "90%" }}
                        >
                          {Object.keys(attrs)
                            .filter((attr) =>
                              (data.eventType &&
                                events[data.eventType].matchAttr &&
                                events[data.eventType].matchAttr?.includes(
                                  attr
                                )) ||
                              (data.eventType &&
                                events[data.eventType] &&
                                events[data.eventType].matchAttr === undefined)
                                ? true
                                : false
                            )
                            .map((key) => {
                              return (
                                <Form.Select.Option
                                  value={key}
                                  key={key + "attr"}
                                >
                                  {attrs[key].name}
                                </Form.Select.Option>
                              );
                            })}
                        </Form.Select>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col span={6} key="col3">
                      {data.reactions &&
                      data.reactions[i] &&
                      data.reactions[i].reactionAttr ? (
                        attrs[data.reactions[i].reactionAttr || ""].type ===
                        "string" ? (
                          <Form.Input
                            style={{ width: "90%" }}
                            field={`${field}[reactionValue]`}
                            label="影响值"
                          />
                        ) : attrs[data.reactions[i].reactionAttr || ""].type ===
                          "number" ? (
                          <Form.InputNumber
                            style={{ width: "90%" }}
                            field={`${field}[reactionValue]`}
                            label="影响值"
                          />
                        ) : attrs[data.reactions[i].reactionAttr || ""].type ===
                          "boolean" ? (
                          <Form.Select
                            field={`${field}[reactionValue]`}
                            label="影响值"
                          >
                            <Form.Select.Option value={"true"}>
                              true
                            </Form.Select.Option>
                            <Form.Select.Option value={"false"}>
                              false
                            </Form.Select.Option>
                          </Form.Select>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col span={6} key="col4">
                      <Button
                        type="danger"
                        theme="borderless"
                        onClick={remove}
                        style={{ margin: 12 }}
                      >
                        删
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </React.Fragment>
          )}
        </ArrayField>
      </Form>
    </>
  );
};
