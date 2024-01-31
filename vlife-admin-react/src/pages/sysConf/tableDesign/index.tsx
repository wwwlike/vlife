import { IconSave } from "@douyinfe/semi-icons";
import { Button, Divider } from "@douyinfe/semi-ui";
import { FormVo, list as model, saveFormDto } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { VF } from "@src/dsl/VF";
import VfButton from "@src/components/button";
import { useAuth } from "@src/context/auth-context";
import { Mode, TsType } from "@src/dsl/base";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useSize } from "ahooks";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FieldSelect from "../formDesign/component/fieldSelect";
import FormSetting from "../formDesign/component/formSetting";
import { SchemaClz } from "../formDesign/fieldSettingSchema";

//列表全局设置json
export const tableSettingDatas: SchemaClz = {};
/**
 * 列表设计
 */
export default () => {
  const navigate = useNavigate();
  const local = useLocation();
  const { clearModelInfo } = useAuth();
  const { menuState } = useAuth();
  const windowWidth = useSize(document.querySelector("body"))?.width;
  //列表宽度
  const tableWidth = useMemo(() => {
    if (windowWidth) {
      //460左右栏宽度 100,200菜单栏伸缩宽度
      return windowWidth - 560 - (menuState === "mini" ? 80 : 240);
    }
  }, [menuState, windowWidth]);
  /**
   * 模型名称
   */
  const type = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, []);
  /**当前模型,可修订模型 */
  const [currModel, setCurrModel] = useState<FormVo>();
  /**当前字段 */
  const [currField, setCurrField] = useState<string>();
  const currFieldObj = useMemo(() => {
    if (currField && currModel) {
      return currModel.fields.filter((f) => f.fieldName === currField)[0];
    }
  }, [currField, currModel]);
  useEffect(() => {
    model({ type }).then((data) => {
      setCurrModel(data.data?.[0]);
    });
  }, [type]);

  return currModel ? (
    <div className=" h-full w-full  flex  flex-col ">
      <div className="flex w-full bg-white  h-12 p-2  items-center border-b border-gray-100 ">
        {/* 标题 */}
        <div className=" w-64 flex-none font-sans text-xmd font-bold pl-6">
          {`${currModel.title}(${currModel?.type})`}
        </div>
        {/* 场景 */}
        <FormSetting
          className="items-center flex-none"
          mode={Mode.form}
          schema={tableSettingDatas}
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
        {/* 按钮组 */}
        <div className="  flex flex-1 justify-end space-x-1 pr-4">
          <VfButton
            permissionCode="form:save:formDto"
            actionType="edit"
            icon={<IconSave />}
            saveApi={saveFormDto}
            datas={currModel}
            onSubmitFinish={(data) => {
              if (currModel.id === undefined && data?.id) {
                setCurrModel(data);
              }
              //缓存清除
              clearModelInfo(currModel.type);
            }}
          >
            保存
          </VfButton>
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
          className=" bg-white w-96 h-full"
          key={currModel.type + "_fieldSelect"}
          fields={currModel.fields.filter((x) => x.fieldName !== "id")}
          mode={Mode.list}
          outSelectedField={currField}
          onDataChange={(fields: FormFieldVo[]) => {
            setCurrModel((model) => {
              const newModel: any = { ...model, fields: fields };
              return { ...newModel };
            });
          }}
          onSelect={(field: string) => {
            setCurrField(field);
          }}
        />
        <TablePage
          className="w-flex  border flex-grow h-full p-2"
          pageSize={currModel?.pageSize}
          req={{}}
          listType={currModel?.type}
          model={currModel}
          mode={"view"}
          outSelectedColumn={currField}
          width={tableWidth}
        />
        {/*  字段属性配置 */}
        <div className=" border w-72 bg-white p-4 z-20 relative">
          {currFieldObj && currField && (
            <>
              <div className=" text-sm font-bold p-2">
                标识/分类/模型：{currFieldObj.fieldName}/{currFieldObj.dataType}
                /{currFieldObj.fieldType}
              </div>
              <Divider></Divider>
              <FormPage
                terse={true}
                key={currFieldObj.id}
                type="formFieldListDto"
                fontBold={true}
                formData={{ ...currFieldObj }}
                onDataChange={(data: FormFieldVo) => {
                  setCurrModel((d) => {
                    if (d)
                      return {
                        ...d,
                        fields: currModel.fields.map((f) => {
                          if (f.fieldName === currField) {
                            return data;
                          }
                          return f;
                        }),
                      };
                  });
                }}
                reaction={[
                  VF.result(currFieldObj.fieldType === TsType.number)
                    .then("money")
                    .show(),

                  VF.result(currFieldObj.x_component === "Input")
                    .then("listSearch", "safeStr")
                    .show(),
                ]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <>列表模型信息不存在</>
  );
};
