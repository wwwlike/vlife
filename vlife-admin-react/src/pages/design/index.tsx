import {
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Layout,
  Nav,
  Select,
  Space,
  TabPane,
  Tabs,
  Tag,
} from "@douyinfe/semi-ui";
import { models as formModels, saveFormDto } from "@src/mvc/model/Form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconMaximize,
  IconEyeOpened,
  IconEyeClosedSolid,
  IconTick,
  IconArrowUp,
  IconArrowDown,
  IconReply,
  IconSave,
} from "@douyinfe/semi-icons";
import FormPage from "@src/pages/common/formPage";
import { FormVo } from "@src/mvc/model/Form";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { useAuth } from "@src/context/auth-context";
import { SysDict } from "@src/mvc/SysDict";
import EventTabPage from "@src/pages/design/event";
import FieldSetting from "./fieldSetting";
import { useUrlQueryParam } from "@src/utils/lib";
import VlifeButton from "@src/components/basic/vlifeButton";
const { Content, Sider } = Layout;
const modelType: any = {
  entity: "实体模型",
  save: "传输模型",
  req: "查询模型",
  vo: "视图模型",
};
const uiTypeObj: any = {
  save: "Form表单",
  req: "查询条件",
  // vo:"视图展示",
  // list:"列表展示"
};

/**
 * vlife的模型设计器
 */
export default () => {
  const { getDict } = useAuth();
  /**
   * 字典大类
   */
  const [dict, setDict] = useState<Partial<SysDict>[]>();
  useEffect(() => {
    setDict(getDict({ emptyLabel: "请选择" })[0].sysDict);
  }, []);

  const [urlParam, setUrlParam] = useUrlQueryParam([
    "uiType", //场景
    "model", //指定模块
    "filterSys", //是否系统
  ]);

  /**
   * 是否过滤
   * url有值就不过滤（false）
   */
  const [filterSys, setFilterSys] = useState<boolean>(
    urlParam.filterSys === "true" || urlParam.filterSys === undefined
      ? true
      : false
  );
  /**
   * 当前场景
   */
  // const [uiType, setUiType] = useState<"req" | "vo" | "save" | "list" | any>(
  //   urlParam.uiType ? urlParam.uiType : "save"
  // );

  const [uiType, setUiType] = useState<"req" | "vo" | "save" | "list" | any>(
    urlParam.uiType ? urlParam.uiType : "save"
  );

  //场景模型
  const [models, setModels] = useState<FormVo[]>();

  //当前模型
  const [currModel, setCurrModel] = useState<FormVo>();

  const [gridSpan, setGridSpan] = useState<string>();

  useEffect(() => {
    if (uiType) {
      setUrlParam({
        ...urlParam,
        uiType,
        model: currModel?.type,
        filterSys: filterSys,
      });
    }
    if (gridSpan === undefined && currModel) {
      setGridSpan(currModel.type + currModel.gridSpan); // sysUser2
    } else if (
      currModel &&
      gridSpan &&
      currModel.type &&
      gridSpan.startsWith(currModel?.type) === false &&
      currModel?.gridSpan + "" !== gridSpan.substring(gridSpan.length - 1)
    ) {
      // alert(gridSpan + "_" + currModel?.type);
      //切换了model且gridspan不同则需要刷新页面
      window.location.reload();
      //需要刷新当前页面
    }
  }, [uiType, currModel, filterSys]);

  //当前字段
  const [currField, setCurrField] = useState<FormFieldVo>();
  //保存按钮可操作标识
  const [saveFlag, setSaveFlag] = useState<{ [key: string]: boolean }>({});

  //----------副作用------------------------

  /**
   * 请求模型表单数据，并初始化currModel
   */
  useEffect(() => {
    formModels(uiType).then((data) => {
      let total = data.data;
      setModels(total);
      let filter = total?.filter((m) =>
        filterSys === true &&
        (m.entityType.startsWith("sys") || m.entityType.startsWith("form"))
          ? false
          : true
      );
      if (filter) {
        setCurrModel(
          urlParam.model &&
            filter?.filter((f) => f.type === urlParam.model).length > 0
            ? filter.filter((f) => f.type === urlParam.model)[0]
            : filter[0]
        );
      }
    });
    setCurrField(undefined);
  }, [uiType]);

  //字段信息改变，CurrField,models联动更新
  useEffect(() => {
    if (currModel && currField) {
      if (currField) {
        const ff = currModel.fields;
        //当前字段替换
        setCurrModel({
          ...currModel,
          fields: ff.map((fff) =>
            fff.fieldName === currField?.fieldName ? currField : fff
          ),
        });
        //请求模型里的数据替换
        setModels(
          models?.map((m) =>
            m.entityType === currModel.entityType ? currModel : m
          )
        );
      }
    }
  }, [currField]);

  //----------funs------------------------

  /**
   *  一键设置，并把数据放入到currModel里
   */
  const oneKeySet = (form: FormVo) => {
    if (currModel) {
      setSaveFlag({ ...saveFlag, [currModel.entityType]: true });
      const fields: FormFieldVo[] = form.fields.map((f) => {
        if (f.dictCode && uiType === "save") {
          f.x_component = "Select";
        } else if (f.dictCode && uiType === "req") {
          f.x_component = "DictSelectTag";
        } else if (f.type === "date") {
          f.x_component = "DatePicker";
        } else if (f.type === "boolean") {
          f.dictCode = "TF";
          if (uiType === "save") {
            f.x_component = "Select";
          } else {
            f.x_component = "DictSelectTag";
          }
        } else if (
          (f.fieldName !== "id" &&
            f.entityType !== currModel?.entityType &&
            (f.pathName.endsWith("Id") || f.pathName.endsWith("_id"))) ||
          f.fieldName === "modifyId" ||
          f.fieldName === "createId"
        ) {
          f.x_component = "RelationInput";
        } else if (f.type === "boolean") {
          f.x_component = "Checkbox";
        } else if (f.type === "string") {
          if (uiType === "req") {
            f.x_component = "SearchInput";
          } else {
            f.x_component = "Input";
          }
        }
        if (uiType === "save") {
          const required = ["name", "code"];
          if (required.filter((h) => h === f.pathName).length > 0) {
            f.required = true;
          }
        } else {
          f.required = false;
          f.x_decorator_props$layout = "vertical";
          f.x_decorator_props$labelAlign = "left";
        }
        f.x_decorator_props$gridSpan = 1;
        // f.x_decorator_props$gridSpan = uiType === "req" ? 3 : 1;
        //默认不显示的字段
        const hide = [
          "id",
          "status",
          "modifyId",
          "createId",
          "createDate",
          "modifyDate",
          "password",
        ];
        if (hide.filter((h) => h === f.pathName).length > 0) {
          f.x_hidden = true;
        }
        return f;
      });
      setCurrModel({ ...form, fields });
    }
  };

  /**
   * currModel保存
   */
  const saveForm = useCallback(() => {
    if (currModel) {
      saveFormDto({ ...currModel }).then((data) => {
        setCurrModel(data.data);
      });
      //路由跳转重新加载
      setSaveFlag({ ...saveFlag, [currModel.entityType]: false });

      if (currModel.type + currModel.gridSpan !== gridSpan) {
        window.location.reload();
      }
      // grid有变化就跳转
      // window.location.href = `/conf/design?uiType=${uiType}&model=${currModel.type}&`;
    }
  }, [currModel]);

  /**
   * 快捷操作(对指定field的attr操作)
   */
  const quickField = useCallback(
    (quickFields: FormFieldVo[]) => {
      if (currModel) {
        setSaveFlag({ ...saveFlag, [currModel.entityType]: true });
        setCurrModel({
          ...currModel,
          fields: currModel?.fields.map((f) => {
            const siderFields: FormFieldVo[] = quickFields.filter(
              (quick) => quick.fieldName === f.fieldName
            );
            if (siderFields.length > 0) {
              return siderFields[0];
            }
            return f;
          }),
        });
        setCurrField({ ...quickFields[quickFields.length - 1] });
      }
    },
    [currModel]
  );

  /**
   * 模型切换
   */
  const modelChange = useCallback(
    (selectModel: FormVo | undefined) => {
      setCurrModel(selectModel);
      setCurrField(undefined);
    },
    [models]
  );

  //当gridSpan大小发生变化则进行跳转
  // useEffect(() => {}, [currModel?.gridSpan]);

  // window.location.href = `/conf/design?uiType=${uiType}&model=${
  //   selectModel?.type
  //----------memo------------------------

  /**
   * 根据表单字段填写的默认值生成整个表单的初始值
   */
  const formData = useMemo(() => {
    if (currModel && currModel.fields) {
      const memoFormData: any = {};
      currModel.fields
        .filter((f) => f.initialValues !== undefined)
        .forEach((f) => {
          memoFormData[f.fieldName] = f.initialValues;
        });
      return memoFormData;
    }
  }, [currModel]);
  return (
    <div>
      <Layout className="layout-page">
        <Layout.Header
          className="layout-header shadow"
          style={{ height: "50px" }}
        >
          <Nav
            mode="horizontal"
            header={
              <>
                <Select
                  value={uiType}
                  insetLabel="应用场景"
                  onChange={(v) => {
                    //  window.location.href = `/conf/design?uiType=${v}`;
                    setUiType(v);
                  }}
                  optionList={[
                    ...Object.keys(uiTypeObj).map((key) => {
                      return { label: uiTypeObj[key], value: key };
                    }),
                  ]}
                ></Select>
                &nbsp;&nbsp;&nbsp;
                <Select
                  filter
                  style={{ width: 180 }}
                  value={currModel?.type}
                  onChange={(e) => {
                    modelChange(models?.filter((m) => m.type === e)[0]);
                  }}
                  optionList={models
                    ?.filter((m) =>
                      filterSys === true &&
                      (m.entityType.startsWith("sys") ||
                        m.entityType.startsWith("form"))
                        ? false
                        : true
                    )
                    .map((m) => {
                      return {
                        value: m.type,
                        label:
                          m.title +
                          "【" +
                          modelType[m.itemType] +
                          m.type +
                          "】",
                      };
                    })}
                ></Select>
              </>
            }
            footer={
              <Space>
                <Checkbox
                  defaultChecked={filterSys === true ? false : true}
                  value={true}
                  onChange={(f) => {
                    // window.location.href = `/conf/design?uiType=${uiType}&model=${
                    //   currModel?.type
                    // }${f.target.checked ? "&filterSys=false" : ""}`;
                    f.target.checked ? setFilterSys(false) : setFilterSys(true);
                    if (
                      f.target.checked === false &&
                      (currModel?.entityType.startsWith("sys") ||
                        currModel?.entityType.startsWith("form"))
                    ) {
                      //不显示系统的,但是当前currModel是的,则需要对currModel重新设置
                      setCurrModel(
                        models?.filter((m) =>
                          filterSys === true &&
                          (m.entityType.startsWith("sys") ||
                            m.entityType.startsWith("form"))
                            ? false
                            : true
                        )[0]
                      );
                    }
                  }}
                >
                  系统级{filterSys}
                </Checkbox>
                {/* 增加页签的时候写页签名，字选择字段，分组同理 */}
                {uiType === "save" ? (
                  <>
                    {/* 
                      <Button icon={<IconKanban />} >页签</Button>
                      <Button icon={<IconOrderedList/>} >分组</Button> 
                    */}
                  </>
                ) : (
                  ""
                )}
                {currModel && currModel.id ? (
                  <>
                    <VlifeButton
                      code="form:save:formDto"
                      icon={<IconSave />}
                      disabled={
                        currModel && saveFlag[currModel.entityType]
                          ? !saveFlag[currModel.entityType]
                          : true
                      }
                      onClick={saveForm}
                    >
                      保存
                    </VlifeButton>
                    <Button
                      icon={<IconReply />}
                      onClick={() => (currModel ? oneKeySet(currModel) : "")}
                    >
                      初始设置
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </Space>
            }
          />
        </Layout.Header>
        <Layout>
          <Sider
            style={{
              backgroundColor: "var(--semi-color-bg-1)",
              minWidth: "210px",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "0px",
                paddingRight: "10px",
                fontSize: 14,
              }}
            >
              位置|显隐 {uiType !== "req" ? "|必填" : ""}
            </div>
            <Divider margin="12px" align="left"></Divider>
            {currModel ? (
              <div>
                {currModel.fields
                  .sort((a, b) => {
                    return a.sort - b.sort;
                  })
                  .map((field, index) => {
                    return (
                      <div style={{ padding: "8px" }} key={field.fieldName}>
                        <Space>
                          {/* {field.sort} */}
                          <Tag
                            style={{ width: "80px" }}
                            size="large"
                            onClick={() => setCurrField({ ...field })}
                            color="blue"
                            type={
                              currField &&
                              field.fieldName === currField.fieldName
                                ? "solid"
                                : "ghost"
                            }
                          >
                            {field.title}
                          </Tag>
                          {index !== 0 ? (
                            <IconArrowUp
                              onClick={() => {
                                const self = field.sort;
                                const before = currModel.fields[index - 1].sort;
                                quickField([
                                  {
                                    ...currModel.fields[index - 1],
                                    sort: self,
                                  },
                                  { ...field, sort: before },
                                ]);
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {index !== currModel.fields.length - 1 ? (
                            <IconArrowDown
                              onClick={() => {
                                const self = field.sort;
                                const next = currModel.fields[index + 1].sort;
                                quickField([
                                  {
                                    ...currModel.fields[index + 1],
                                    sort: self,
                                  },
                                  { ...field, sort: next },
                                ]);
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {field.x_hidden ? (
                            <IconEyeClosedSolid
                              onClick={() => {
                                quickField([{ ...field, x_hidden: false }]);
                              }}
                            />
                          ) : (
                            <IconEyeOpened
                              onClick={() => {
                                quickField([{ ...field, x_hidden: true }]);
                              }}
                            />
                          )}
                          {uiType !== "req" ? (
                            field.required ? (
                              <IconTick
                                onClick={() => {
                                  quickField([{ ...field, required: false }]);
                                }}
                              />
                            ) : (
                              <IconMaximize
                                onClick={() => {
                                  quickField([{ ...field, required: true }]);
                                }}
                              />
                            )
                          ) : (
                            ""
                          )}
                        </Space>
                      </div>
                    );
                  })}
              </div>
            ) : (
              ""
            )}
          </Sider>
          <Content className="layout-content">
            <Tabs>
              {currModel &&
              currModel.id &&
              (uiType === "save" || uiType === "req") ? (
                <TabPane tab="实时预览" itemKey={"AA"}>
                  <FormPage
                    type={uiType}
                    highlight={currField?.fieldName}
                    entityName={currModel.entityType}
                    modelInfo={currModel}
                    formData={formData}
                  ></FormPage>
                </TabPane>
              ) : (
                ""
              )}

              {currModel && currModel.id && uiType === "save" ? (
                <TabPane tab="事件响应" itemKey="eventTab">
                  <EventTabPage
                    onChange={(model) => {
                      setCurrModel({ ...model });
                    }}
                    currModel={currModel}
                  ></EventTabPage>
                </TabPane>
              ) : (
                ""
              )}
              {currModel && (uiType === "save" || uiType === "req") ? (
                <TabPane tab="表单配置" itemKey="confTab">
                  <Card
                    footer={
                      currModel.id === null ? (
                        <Button
                          icon={<IconSave />}
                          disabled={
                            currModel && saveFlag[currModel.entityType]
                              ? !saveFlag[currModel.entityType]
                              : true
                          }
                          onClick={() => {
                            saveForm();
                            oneKeySet(currModel);
                          }}
                        >
                          {"启用"}
                        </Button>
                      ) : (
                        ""
                      )
                    }
                  >
                    <Input
                      value={currModel.name}
                      onChange={(data) => {
                        setCurrModel({ ...currModel, name: data });
                        setSaveFlag({
                          ...saveFlag,
                          [currModel.entityType]: true,
                        });
                      }}
                      prefix="表单名称"
                      placeholder={currModel.title}
                      style={{ width: 350 }}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Select
                      prefix="列数"
                      style={{ width: 140 }}
                      onChange={(data) => {
                        setCurrModel({
                          ...currModel,
                          gridSpan: data as number,
                        });
                        setSaveFlag({
                          ...saveFlag,
                          [currModel.entityType]: true,
                        });
                      }}
                      value={currModel.gridSpan || (uiType === "req" ? 1 : 2)}
                      optionList={[
                        { label: "1列", value: 1 },
                        { label: "2列", value: 2 },
                        { label: "3列", value: 3 },
                        { label: "4列", value: 4 },
                        { label: "5列", value: 5 },
                        { label: "6列", value: 6 },
                      ]}
                    ></Select>
                  </Card>
                </TabPane>
              ) : (
                ""
              )}
            </Tabs>
          </Content>
          <Sider
            className="shadow-lg"
            style={{
              padding: "10px",
              backgroundColor: "var(--semi-color-bg-1)",
              minWidth: "280px",
              maxWidth: "280px",
            }}
          >
            {currField ? (
              <FieldSetting
                uiType={uiType}
                onDataChange={(data) => {
                  setCurrField({ ...data });
                  if (currModel) {
                    setSaveFlag({ ...saveFlag, [currModel.entityType]: true });
                  }
                }}
                field={currField}
              ></FieldSetting>
            ) : (
              ""
            )}
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
};
