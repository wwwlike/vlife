import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IconGridView,
  IconListView,
  IconPlayCircle,
  IconSave,
} from "@douyinfe/semi-icons";
import { Button, Empty } from "@douyinfe/semi-ui";
import { FormVo, model, saveFormDto } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import VfButton from "@src/components/VfButton";
import { Mode } from "@src/dsl/base";
import { SchemaClz } from "@src/dsl/field";
import FormPage from "@src/pages/common/formPage";
import { useLocation, useNavigate } from "react-router-dom";
import SiderSetting from "./component/SiderSetting";
import FieldSelect from "./component/fieldSelect";
import FormSetting from "./component/formSetting";
import FormTab from "./component/formTab";
import { useAuth } from "@src/context/auth-context";
import { VF } from "@src/dsl/VF";
import { IllustrationConstruction } from "@douyinfe/semi-illustrations";
import { useNiceModal } from "@src/store";

//form设置选项信息
export const formSettingDatas: SchemaClz = {
  modelSize: {
    name: "布局",
    type: "buttonGroup",
    mode: Mode.form,
    items: [
      { label: "宽", value: 4, tooltip: "每行4列" },
      { label: "大", value: 3, tooltip: "每行3列" },
      { label: "中", value: 2, tooltip: "每行2列" },
      { label: "小", value: 1, tooltip: "每行1列" },
    ],
  },
  formRead: {
    name: "模式",
    type: "buttonGroup",
    mode: Mode.form,
    deps: [{ field: "itemType", value: ["entity", "save"] }],
    items: [
      { label: "编辑", default: true, icon: IconGridView },
      { label: "只读", value: true, icon: IconListView },
    ],
  },
  x_decorator_props$layout: {
    name: "标签",
    type: "buttonGroup",
    mode: [Mode.form, Mode.filter],
    items: [
      { label: "顶部", value: "vertical" },
      { label: "水平", value: "horizontal" },
    ],
  },

  x_decorator_props$labelAlign: {
    name: "对齐",
    type: "buttonGroup",
    mode: [Mode.form, Mode.filter],
    // deps: { field: "x_decorator_props$layout", value: ["vertical"] },
    items: [
      { label: "居左", value: "left" },
      { label: "居右", value: "right" },
    ],
  },
};

/**
 * 表单设计器
 */
export default () => {
  const navigate = useNavigate();
  const { clearModelInfo } = useAuth();
  const local = useLocation();
  const formModal = useNiceModal("formModal");
  /**
   * 模型名称
   */
  const type = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, [local.pathname]);
  /**当前模型,可修订模型,修订currModel的同时需要修订 currField */
  const [currModel, setCurrModel] = useState<FormVo>();
  /**当前字段名 */
  const [currField, setCurrField] = useState<string>();
  // 当前模型设置的值
  const [formInitData, setFormInitData] = useState<any>();
  /**当前字段 */
  const currFieldObj = useMemo(() => {
    if (currField && currModel) {
      return currModel.fields.filter((f) => f.fieldName === currField)[0];
    }
  }, [currField, currModel]);
  useEffect(() => {
    model({ type }).then((data) => {
      setCurrModel(data.data);
      setFormInitData({
        name: data.data?.name,
        prefixNo: data.data?.prefixNo,
        formDesc: data.data?.formDesc,
        helpDoc: data.data?.helpDoc,
      });
    });
  }, [type]);

  const onDataChange = useCallback(
    (fields: FormFieldVo[]) => {
      const model: any = { ...currModel, fields: fields };
      // 在更新 obj 时同时包含 num 属性
      setCurrModel(model);
    },
    [currModel]
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

  return currModel ? (
    <div className=" h-full w-full  flex  flex-col ">
      <div className="flex w-full bg-white  h-12 p-2  items-center border-b border-gray-100 ">
        {/* 标题 */}
        <div className=" w-64 flex-none font-sans text-md font-bold pl-6">
          {`${currModel.title}(${currModel?.type})`}
        </div>

        {/* 场景 */}
        <FormSetting
          className="items-center flex-none"
          mode={Mode.form}
          schema={formSettingDatas}
          onDataChange={(data: any, fieldName: string) => {
            //修改模型
            const val = data[fieldName];
            if (currModel && Object.keys(currModel).includes(fieldName)) {
              setCurrModel({ ...currModel, [fieldName]: val });
            }
            //判断是否field上的字段，进行批量修订
            if (
              currModel &&
              Object.keys(currModel?.fields[0]).includes(fieldName)
            ) {
              setCurrModel({
                ...currModel,
                fields: currModel.fields.map((f) => {
                  return { ...f, [fieldName]: val };
                }),
              });
            }
          }}
          data={currModel}
        ></FormSetting>
        {/* tab页签设置 */}
        <FormTab
          formVo={currModel}
          onDataChange={(d: FormVo) => {
            setCurrModel(d);
          }}
        ></FormTab>
        {/* 按钮组 */}
        <div className="  flex flex-1 justify-end space-x-1 pr-4">
          <VfButton
            code="form:save:formDto"
            icon={<IconSave />}
            onClick={saveForm}
          >
            保存
          </VfButton>
          <Button
            icon={<IconPlayCircle />}
            onClick={() => {
              formModal.show({
                type: currModel.type,
                modelInfo: { ...currModel },
              });
            }}
          >
            预览
          </Button>
          <Button
            onClick={() => {
              navigate(-1);
            }}
          >
            返回
          </Button>
        </div>
      </div>
      <div id="body" className="flex flex-grow  w-full">
        {/* 字段选择排序 */}
        <FieldSelect
          className=" bg-white w-64 h-full"
          key={currModel.type + "_fieldSelect"}
          fields={currModel.fields}
          mode={Mode.form}
          outSelectedField={currField}
          onDataChange={(fields: FormFieldVo[]) => {
            // 在更新 obj 时同时包含 num 属性
            setCurrModel((model) => {
              const newModel: any = { ...model, fields: fields };
              return { ...newModel };
            });
          }}
          onSelect={(field: string) => {
            setCurrField(field);
          }}
        />
        <div className=" border flex-grow h-full pr-4 relative">
          {currField !== undefined && (
            <div className=" m-2  h-10 flex items-center justify-start">
              <Button
                onClick={() => {
                  setCurrField(undefined);
                }}
                icon={<i className="  icon-admin-main" />}
              >
                编辑表单
              </Button>
            </div>
          )}
          {/* 表单预览 */}
          <FormPage
            design={true}
            key={currModel.id + currModel.type + currModel.modelSize}
            className={` min-h-min center rounded-md bg-white  p-4 m-2 ${
              currModel.modelSize === undefined || currModel.modelSize === 4
                ? "w-full"
                : currModel.modelSize === 3
                ? "w-10/12"
                : currModel.modelSize === 2
                ? "w-8/12"
                : "w-1/2"
            } min-w-1/2`}
            highlight={currField}
            type={currModel.type}
            modelInfo={{ ...currModel }}
            onDataChange={(d) => {}}
            //组件div点击回调
            onClickFieldComponent={(
              fieldName: string,
              opt: "click" | "must" | "delete"
            ) => {
              let currf: FormFieldVo = currModel.fields.filter(
                (f) => f.fieldName === fieldName
              )[0];
              if (opt === "must" || opt === "delete") {
                if (opt === "must") {
                  currf = { ...currf, required: !currf.required };
                } else {
                  currf = { ...currf, x_hidden: true };
                }
                setCurrModel((m) => {
                  const newModel: any = {
                    ...m,
                    fields: currModel.fields.map((f) => {
                      if (f.fieldName === currField) {
                        return currf;
                      }
                      return f;
                    }),
                  };
                  return newModel;
                });
              }
              setCurrField(currf.fieldName);
            }}
          />
        </div>

        <div className=" relative border w-1/4 bg-white p-4 ">
          {/* form表单设置 */}
          {currField === undefined && (
            <FormPage
              type="form"
              formData={formInitData}
              reaction={[
                VF.result(currModel.parentsName.includes("INo"))
                  .then("prefixNo")
                  .show(),
              ]}
              onDataChange={(model) => {
                setCurrModel((es) => {
                  if (es)
                    return {
                      ...es,
                      name: model.name,
                      prefixNo: model.prefixNo,
                      formDesc: model.formDesc,
                      helpDoc: model.helpDoc,
                    };
                });
              }}
              className={` center rounded-md bg-white`}
            />
          )}
          {/* 侧边字段属性配置 */}
          {currFieldObj && (
            <SiderSetting
              mode={Mode.form}
              key={currField}
              form={currModel}
              onDataChange={(data: FormFieldVo) => {
                setCurrModel((model) => {
                  if (model) {
                    return {
                      ...model,
                      fields: currModel.fields.map((f) => {
                        if (f.fieldName === currField) {
                          return data;
                        }
                        return f;
                      }),
                    };
                  }
                  return model;
                });
              }}
              field={currFieldObj}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Empty
      className="flex justify-center items-center"
      image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
      title={`模型不存在,请检查${type}是否正确`}
      description={
        <a
          href="#"
          onClick={() => {
            navigate(-1);
          }}
        >
          返回
        </a>
      }
    />
  );
};
