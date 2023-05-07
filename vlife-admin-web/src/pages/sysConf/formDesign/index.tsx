import {
  Button,
  ButtonGroup,
  Empty,
  Layout,
  Nav,
  Space,
  TabPane,
  Tabs,
} from "@douyinfe/semi-ui";
import { saveFormDto } from "@src/api/Form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconSave,
  IconFilter,
  IconKanban,
  IconList,
  IconPlayCircle,
} from "@douyinfe/semi-icons";
import FormPage from "@src/pages/common/formPage";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@src/context/auth-context";
import TablePage from "@src/pages/common/tablePage";
import { ItemType } from "@src/api/base";
import { useNiceModal } from "@src/store";
import { Mode, sourceType } from "@src/dsl/schema/base";
import FormApi, { httpError } from "./component/formApi";
import VlifeButton from "@src/components/vlifeButton";
import FormSetting from "./component/formSetting";
import { modelSchemaDef } from "@src/dsl/schema/field";
import FormTab from "./component/formTab";
import FieldSelect from "./component/fieldSelect";
import CompDesign from "../compDesign";
import VfTour from "@src/components/VfTour";
import Scrollbars from "react-custom-scrollbars";
const { Content, Sider } = Layout;

// 临时态数据结构
interface settingParams {
  formRead: true | undefined; //表单状态
  mode?: Mode; //当前模式
  x_decorator_props$layout?: "vertical" | "horizontal";
  x_decorator_props$labelAlign?: "left" | "right";
  httpError?: httpError; //请求错误信息
}

/**
 * 类型和组件默认对应接口
 */
const typeComponent: {
  [key: string]: string;
} = {
  basic_string: "Input",
  basic_integer: "InputNumber",
  basic_double: "InputNumber",
  basic_date: "DatePicker",
};

const typeReqComponent: {
  [key: string]: string;
} = {
  basic_string: "SearchInput",
  basic_integer: "InputNumber",
  basic_double: "InputNumber",
  basic_date: "DatePicker",
  list_date: "DatePicker",
};

/**
 * vlife的模型设计器
 */
export default () => {
  //表单模型modal
  const formModal = useNiceModal("formModal");
  //任意组件modal
  const vlifeModal = useNiceModal("vlifeModal");
  const local = useLocation();
  const navigate = useNavigate();
  const { getFormInfo, clearModelInfo, dicts } = useAuth();
  //当前模型
  const [currModel, setCurrModel] = useState<FormVo>();

  //场景变量
  const [params, setParams] = useState<settingParams>({
    formRead: undefined,
    x_decorator_props$layout: undefined,
  });

  /**
   * 模型名称
   */
  const type = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    // const model = local.pathname.split("/")[length - 1];
    return local.pathname.split("/")[length - 2];
  }, [params]);

  //当前字段
  const [currField, setCurrField] = useState<FormFieldVo>();

  //
  const initComponent = (ff: FormFieldVo, itemType: ItemType): FormFieldVo => {
    const componentMappingObj =
      itemType === "req" ? typeReqComponent : typeComponent;
    //组件名计算
    const componentStr =
      ff.x_component !== undefined &&
      ff.x_component !== null &&
      ff.x_component !== ""
        ? ff.x_component //不为空
        : ff.dictCode
        ? "VfSelect_DICT"
        : ff.fieldName.endsWith("_id")
        ? "RelationTagInput"
        : componentMappingObj[ff.fieldType + "_" + ff.type]
        ? componentMappingObj[ff.fieldType + "_" + ff.type]
        : "Input";
    let init: FormFieldVo = { ...ff, x_component: componentStr };
    // 字典类型组件，并生成一个属性
    if (componentStr === "VfSelect_DICT" && ff.dictCode) {
      init = {
        ...init,
        pageComponentPropDtos: [
          {
            propName: "optionList",
            propVal: ff.dictCode,
            sourceType: sourceType.dict,
          },
        ],
      };
    }
    //系统字段默认隐藏
    if (
      itemType === "entity" &&
      (ff.fieldName === "sysAreaId" ||
        ff.fieldName === "sysOrgId" ||
        ff.fieldName === "sysDeptId") &&
      ff.x_hidden === undefined
    ) {
      init = {
        ...init,
        x_hidden: true,
      };
    }
    return init;
  };
  /**
   * 模型标识变化,模型数据加载
   */
  useEffect(() => {
    if (type) {
      //传design 请求数据不会过滤
      getFormInfo({ type, design: true }).then((model) => {
        if (model) {
          // alert(model.formTabDtos?.length);
          setCurrModel({
            ...model,
            fields: model.fields.map((ff): any => {
              // 初始化组件类型
              return {
                ...ff,

                ...initComponent(ff, model.itemType), //初始化组件信息
                x_decorator_props$gridSpan: ff.x_decorator_props$gridSpan
                  ? ff.x_decorator_props$gridSpan
                  : 1,
                x_decorator_props$labelAlign: "left",
              };
            }),
          });
          setCurrField(model.fields[0]);
          const length = local.pathname.split("/").length;
          const pathEnd = local.pathname.split("/")[length - 1];
          if (
            pathEnd === Mode.form ||
            pathEnd === Mode.list ||
            pathEnd === Mode.filter
          ) {
            setParams({
              ...params,
              mode:
                pathEnd === Mode.form
                  ? Mode.form
                  : pathEnd === Mode.list
                  ? Mode.list
                  : Mode.filter,
              x_decorator_props$layout:
                currModel?.fields[0].x_decorator_props$layout,
            });
          } else {
            setParams({
              ...params,
              mode: model.itemType === "req" ? Mode.filter : Mode.form,
              x_decorator_props$layout:
                currModel?.fields[0].x_decorator_props$layout,
            });
          }
        }
      });
    }
  }, [type]);

  const showFormApiModal = useCallback(() => {
    // 4404 === params.httpError?.code ||
    if (currModel) {
      let data: any = undefined;
      vlifeModal.show({
        title: "接口设置",
        okFun: () => {
          if (data) setCurrModel({ ...data });
        },
        children: (
          <FormApi
            httpError={params.httpError}
            mode={params.mode}
            formVo={currModel}
            onDataChange={(formVo: FormVo) => {
              data = formVo;
            }}
          />
        ),
      });
    }
  }, [params.httpError, currModel, params.mode]);
  /**
   * 接口不能使用则弹出
   */
  useEffect(() => {
    if (4404 === params.httpError?.code && currModel) {
      showFormApiModal();
    }
  }, [params.httpError]);

  //更新字段，同步模型
  const updateFieldSyncModel = useCallback(
    (selectedField: FormFieldVo | undefined) => {
      if (selectedField) {
        setCurrField({ ...selectedField });
      } else {
        setCurrField(undefined);
      }
      if (currModel) {
        //当前字段替换
        setCurrModel({
          ...currModel,
          fields: currModel.fields?.map((f) =>
            f.fieldName === selectedField?.fieldName ? selectedField : f
          ),
        });
      }
    },
    [currModel]
  );

  //更新模型同步字段
  const updateModelsyncField = useCallback(
    (model: FormVo) => {
      setCurrModel(model);
      if (currField) {
        //当前字段替换
        setCurrField(
          model.fields.filter((f) => f.fieldName === currField.fieldName)[0]
        );
      }
    },
    [currField, currModel]
  );

  /**
   * currModel保存
   */
  const saveForm = useCallback(() => {
    if (currModel) {
      saveFormDto({
        ...currModel,
      }).then((data) => {
        //更新主键
        if (currModel.id === undefined && data?.data?.id) {
          setCurrModel(data.data);
        }
        //缓存清除
        clearModelInfo(currModel.type);
      });
    }
  }, [currModel]);

  /**
   * 返回最新的formily用户的写入数据，在read模式时使用该数据
   */
  const [writeData, setWriteData] = useState<any>({});

  /**
   * 表单数据
   */
  const formData = useMemo(() => {
    if (currModel && currModel.fields) {
      const memoFormData: any = {};

      currModel.fields
        .filter((f) => f.initialValues !== undefined)
        .forEach((f) => {
          if (f.fieldName) memoFormData[f.fieldName] = f.initialValues;
        });
      return memoFormData;
    }
  }, [currModel]);
  return (
    <VfTour
      code="abcd"
      // every={true}
      steps={[
        {
          selector: ".fieldSelectTour",
          content: "选择表单需要的字段，并且进行排序",
        },
        {
          selector: ".formSettingTour",
          content: "对表单布局进行整体设置",
        },
        {
          selector: ".compSetting",
          content: "对单个字段进行设置",
        },
      ]}
    >
      <div>
        <Layout className="layout-page">
          <Layout.Header
            className="layout-header shadow"
            style={{ height: "50px" }}
          >
            <Nav
              mode="horizontal"
              header={
                <div className=" flex items-center">
                  <div
                    className="left-0"
                    style={{
                      backgroundColor: "var(--semi-color-bg-1)",
                      minWidth: "190px",
                    }}
                  >
                    <span className=" font-bold">{`${currModel?.title}(${currModel?.type})`}</span>
                  </div>
                  {/* 1 .场景选择 */}
                  <div className=" ml-4 semi-form-field-label-text semi-form-field-label">
                    <label> 场景</label>
                  </div>
                  <ButtonGroup className=" mr-4">
                    {currModel?.itemType !== "req" ? (
                      <>
                        <VlifeButton
                          tooltip={"设计表单"}
                          type={
                            params.mode === Mode.form ? "primary" : "tertiary"
                          }
                          icon={<IconKanban />}
                          onClick={() =>
                            setParams({ ...params, mode: Mode.form })
                          }
                        ></VlifeButton>
                        <VlifeButton
                          tooltip={"设计列表"}
                          type={
                            params.mode === Mode.list ? "primary" : "tertiary"
                          }
                          className=" w-25"
                          onClick={() =>
                            setParams({ ...params, mode: Mode.list })
                          }
                          icon={<IconList />}
                        ></VlifeButton>
                      </>
                    ) : (
                      <VlifeButton
                        tooltip={"过滤条件"}
                        type={"primary"}
                        className=" w-25"
                        onClick={() =>
                          setParams({ ...params, mode: Mode.filter })
                        }
                        icon={<IconFilter />}
                      ></VlifeButton>
                    )}
                  </ButtonGroup>

                  {/* 2 场景模型设置 */}
                  <FormSetting
                    className="formSettingTour"
                    mode={params.mode || Mode.form}
                    onDataChange={(data: any, fieldName: string) => {
                      //不同mode key可能重复，重复则在key前面加上mode+"_"的前缀
                      //本次需要修改的值
                      const val = data[fieldName];
                      //真实要修改的字段
                      if (
                        params.mode &&
                        fieldName.startsWith(params.mode + "_")
                      ) {
                        fieldName = fieldName.substring(params.mode.length + 1);
                      }
                      // 1. 修改state
                      if (Object.keys(params).includes(fieldName)) {
                        setParams({ ...params, [fieldName]: data[fieldName] });
                      }
                      // 2. 修改currModel
                      if (
                        currModel &&
                        Object.keys(currModel).includes(fieldName)
                      ) {
                        setCurrModel({ ...currModel, [fieldName]: val });
                      }
                      // 3. 修改所有字段
                      if (
                        currModel &&
                        Object.keys(currModel?.fields[0]).includes(fieldName)
                      ) {
                        updateModelsyncField({
                          ...currModel,
                          fields: currModel.fields.map((f) => {
                            return { ...f, [fieldName]: val };
                          }),
                        });
                      }
                    }}
                    data={{ ...currModel, ...params }}
                    schema={modelSchemaDef}
                  ></FormSetting>
                  {currModel && params.mode === Mode.form && (
                    <FormTab
                      formVo={currModel}
                      onDataChange={(d: FormVo) => {
                        updateModelsyncField(d);
                      }}
                    />
                  )}
                </div>
              }
              footer={
                <Space>
                  {currModel && currModel.id && (
                    <>
                      <VlifeButton
                        code="form:save:formDto"
                        icon={<IconSave />}
                        onClick={saveForm}
                      >
                        保存
                      </VlifeButton>
                      <Button
                        icon={<IconPlayCircle />}
                        onClick={() => {
                          formModal.show({
                            type: type,
                            title: "预览",
                            readPretty:
                              currModel.itemType == "vo"
                                ? true
                                : params.formRead,
                            modelInfo: currModel,
                          });
                        }}
                      >
                        预览
                      </Button>

                      <Button
                        onClick={() => {
                          // alert(JSON.stringify(navigate));
                          // window.history.back();
                          navigate(-1);
                        }}
                      >
                        返回
                      </Button>
                    </>
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
              {currModel && currModel.fields && (
                <FieldSelect
                  className="fieldSelectTour"
                  key={currModel.type + "_fieldSelect"}
                  fields={currModel.fields}
                  mode={params.mode || Mode.form}
                  selectedField={currField?.fieldName}
                  del={currModel.itemType === "req" ? false : true}
                  onDataChange={(fields1: FormFieldVo[]) => {
                    updateModelsyncField({ ...currModel, fields: fields1 });
                  }}
                  onSelect={(fieldName: string) => {
                    updateFieldSyncModel({
                      ...currModel.fields.filter(
                        (f) => f.fieldName === fieldName
                      )[0],
                    });
                  }}
                />
              )}
            </Sider>
            <Content className="grid h-full p-2">
              <Scrollbars autoHide={true}>
                {currModel && currModel.id && params.mode !== Mode.list ? (
                  <>
                    <FormPage
                      type="form"
                      formData={currModel}
                      onDataChange={(model) => {
                        setCurrModel({ ...model });
                      }}
                      className={` center rounded-md h-20 w-8/12 bg-white p-4 pt-6 m-2`}
                    />
                    <FormPage
                      design={true}
                      key={currModel.type + currModel.modelSize}
                      className={` center rounded-md bg-white  p-4 m-2 ${
                        currModel.modelSize === undefined ||
                        currModel.modelSize === 4
                          ? "w-full"
                          : currModel.modelSize === 3
                          ? "w-10/12"
                          : currModel.modelSize === 2
                          ? "w-8/12"
                          : "w-1/2"
                      } min-w-1/2`}
                      readPretty={
                        currModel.itemType == "vo" ? true : params.formRead
                      }
                      // type={currModel.itemType === "req" ? "req" : "save"}
                      highlight={currField?.fieldName}
                      // entityType={currModel.entityType}
                      type={currModel.type}
                      // itemType={currModel.itemType}
                      modelInfo={{ ...currModel }}
                      formData={params.formRead ? writeData : formData}
                      onDataChange={(d) => {
                        setWriteData(d);
                      }}
                      //组件div点击回调
                      onClickFieldComponent={(
                        fieldName: string,
                        opt: "click" | "must" | "delete"
                      ) => {
                        let fff: any = currModel.fields.filter(
                          (f) => f.fieldName === fieldName
                        )[0];
                        if (opt === "click") {
                          updateFieldSyncModel({ ...fff });
                        }
                        if (opt === "delete") {
                          updateModelsyncField({
                            ...currModel,
                            fields: currModel.fields.map((ff): any => {
                              // 初始化组件类型
                              return ff.fieldName === fieldName
                                ? { ...ff, x_hidden: true }
                                : ff;
                            }),
                          });
                          // updateFieldSyncModel(undefined);
                        } else if (opt === "must") {
                          fff = { ...fff, required: !fff.required };
                          updateModelsyncField({
                            ...currModel,
                            fields: currModel.fields.map((ff): any => {
                              // 初始化组件类型
                              return ff.fieldName === fieldName ? fff : ff;
                            }),
                          });
                          // setCurrField(fff);
                        }
                      }}
                    />
                  </>
                ) : (
                  // // <Tabs>
                  //   {/* <TabPane tab={`实时预览`} itemKey={"FormView"}> */}

                  //   {/* </TabPane> */}

                  //   {/* <TabPane tab={`模型设置`} itemKey={"formModelSetting"}>
                  //     <FormPage type="form" formData={} />
                  //   </TabPane> */}
                  //   {/* {params.mode === Mode.form && (
                  //   <TabPane tab="事件响应" itemKey="eventTab">
                  //     <EventTabPage
                  //       onChange={(model) => {
                  //         updateModelsyncField({ ...model });
                  //       }}
                  //       currModel={currModel}
                  //     ></EventTabPage>
                  //   </TabPane>
                  // )} */}
                  // // </Tabs>
                  <div className="center rounded-md bg-white h-full p-4">
                    <div className=" flex m-2">
                      <div className="text-md items-start">列表设计</div>
                      <div className=" absolute right-2">
                        <Button onClick={showFormApiModal}>接口设置</Button>
                      </div>
                      {/* {params.httpError?.code === 4404 ? (
                    <Button onClick={showFormApiModal}>接口设置</Button>
                  ) : (
                    <Button onClick={showFormApiModal}>接口设置</Button>
                  )} */}
                    </div>

                    {currModel && (
                      <TablePage
                        key={`table${JSON.stringify(currModel)}`}
                        design={true}
                        pageSize={currModel?.pageSize}
                        req={{}}
                        entityType={currModel?.entityType || ""}
                        listType={currModel?.type}
                        editType={currModel?.type}
                        // select_more={true}
                        formVo={currModel}
                        btnHide={true}
                        onHttpError={(error: httpError) => {
                          setParams({ ...params, httpError: error });
                        }}
                        // customBtns={customBtns}
                      />
                    )}
                  </div>
                )}
              </Scrollbars>
            </Content>
            <Sider
              className="shadow-lg"
              style={{
                padding: "10px",
                backgroundColor: "var(--semi-color-bg-1)",
                minWidth: "320px",
                maxWidth: "320px",
              }}
            >
              {currField &&
                currModel &&
                (params.mode === Mode.form || params.mode === Mode.filter) && (
                  <div className="compSetting">
                    <CompDesign
                      mode={params.mode}
                      key={currField.fieldName}
                      form={currModel}
                      onDataChange={(data: FormFieldVo) => {
                        updateFieldSyncModel({ ...data });
                      }}
                      field={currField}
                    />
                  </div>
                )}
              {currField && currModel && params.mode === Mode.list && (
                <></>
                // <FormSetting
                //   layout={"vertical"}
                //   data={currField}
                //   schema={listSchemaDef}
                //   mode={Mode.list}
                //   onDataChange={(data, fieldName) => {}}
                // />
              )}
            </Sider>
          </Layout>
        </Layout>
      </div>
    </VfTour>
  );
};
