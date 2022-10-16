import {
  Breadcrumb,
  Card,
  Collapse,
  Divider,
  Form,
  InputGroup,
} from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { useAuth } from "@src/context/auth-context";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { SysDict } from "@src/mvc/SysDict";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import schemaDef, { SchemaClz, types } from "../data/vlifeSchema";

/**
 * schemaData选择组件
 * 接收FormFieldVo数据，与schemaData对应的数据进行操作，隐藏组件的数据需要清空
 */

interface schemaModalProp {
  field: FormFieldVo;
  uiType: string; //场景
  // span: number; //最小单位字段宽度
  type?: string; //只限制指定类型的
  onDataChange: (field: FormFieldVo) => void; //数据修改后回调
}
export default ({
  field,
  type,
  uiType,
  onDataChange,
  ...schemaModalProp
}: schemaModalProp) => {
  const api = useRef<FormApi>();
  const { getDict } = useAuth();
  // const [dict, setDict] = useState<Partial<SysDict>[]>();

  /**
   *  对字段属性的字典，和列宽 进行计算和提取在这里完成组装
   */
  const fieldsConf = useMemo((): SchemaClz => {
    const dictTypes = getDict({ emptyLabel: "请选择" })[0].sysDict;
    schemaDef["dictCode"].items = [];
    dictTypes.forEach((dict) => {
      schemaDef["dictCode"].items?.push({
        value: dict.code || "",
        label: dict.title || "",
      });
    });
    // schemaDef["x_decorator_props$gridSpan"].items = [];

    return schemaDef;
  }, []);

  //表单数据初始化,字段变化数据重新初始化
  useEffect(() => {
    if (field) {
      api.current?.setValues({ ...field });
    }
  }, [field.fieldName]);

  /**
   *formData有的字段覆盖filed的并返回出去
   */
  const backData = useCallback(
    (formData: any): FormFieldVo => {
      const back = { ...field };
      Object.keys(fieldsConf).forEach((attr) => {
        back[attr] = formData[attr];
      });
      return back;
    },
    [field.fieldName]
  );

  // const formData=useMemo(()=>{

  // },[field])

  return (
    <>
      <div
        style={{
          fontSize: "14px",
          borderStyle: "dotted solid dashed solid",
          borderColor: "#cccccc",
        }}
      >
        {field ? (
          <div>
            <b style={{ font: "14px" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;标识/类型：{field.fieldName}/{field.type}
              <Divider margin="12px" />
            </b>
          </div>
        ) : (
          "请选择一个表单元素"
        )}
      </div>
      <Form
        getFormApi={(formApi) => (api.current = formApi)}
        layout="vertical"
        labelAlign="left"
        labelPosition="left"
        onValueChange={(data, val) => {
          onDataChange(backData(data));
        }}
      >
        <Collapse accordion defaultActiveKey={"panel_0"} keepDOM={true}>
          {types.map((t, index) => {
            return (
              <Collapse.Panel
                header={t.title}
                itemKey={"panel_" + index}
                style={{ padding: "2px" }}
              >
                {Object.keys(fieldsConf)
                  .filter((key) => fieldsConf[key].tag === t.value)
                  .map((key, index) => {
                    if (
                      //1无依赖值无UI场景，2有依赖有ui都满足 3满足ui场景 4满足字段依赖
                      (fieldsConf[key].deps === undefined &&
                        fieldsConf[key].uiType === undefined) ||
                      (fieldsConf[key].uiType &&
                        fieldsConf[key].uiType === uiType && //场景满足
                        fieldsConf[key].deps &&
                        fieldsConf[key].deps?.value.includes(
                          field[fieldsConf[key].deps?.field || ""]
                        )) ||
                      (fieldsConf[key].uiType &&
                        fieldsConf[key].deps == undefined &&
                        fieldsConf[key].uiType === uiType) ||
                      (fieldsConf[key].deps &&
                        fieldsConf[key].uiType == undefined &&
                        fieldsConf[key].deps?.value.includes(
                          field[fieldsConf[key].deps?.field || ""]
                        ))
                    ) {
                      if (fieldsConf[key].type === "select") {
                        const optionList = fieldsConf[key].items?.filter(
                          (f) => {
                            if (
                              //选择项的显示根据依赖值是否满足来完成进一步的展示
                              (f.deps === undefined &&
                                f.uiType === undefined) ||
                              (f.deps &&
                                f.deps.value.includes(
                                  field[f.deps?.field || ""]
                                ) &&
                                f.uiType &&
                                uiType === f.uiType) ||
                              (f.deps &&
                                f.uiType === undefined &&
                                f.deps.value.includes(
                                  field[f.deps?.field || ""]
                                )) ||
                              (f.uiType &&
                                f.deps === undefined &&
                                uiType === f.uiType)
                            ) {
                              return true;
                            }
                            return false;
                          }
                        );
                        if (optionList && optionList?.length > 0) {
                          return (
                            <Form.Select
                              showClear
                              key={"select_" + index + key}
                              field={key}
                              label={fieldsConf[key].name}
                              style={{ width: "100%" }}
                              optionList={optionList}
                            ></Form.Select>
                            // </div>
                          );
                        }
                      }
                      if (fieldsConf[key].type === "input") {
                        return (
                          <Form.Input
                            key={"input_" + key}
                            field={key}
                            label={fieldsConf[key].name}
                            style={{ width: "100%" }}
                          ></Form.Input>
                        );
                      }
                      if (fieldsConf[key].type === "switch") {
                        return (
                          <InputGroup key={"group" + key + index}>
                            <Form.Switch
                              key={"switch" + key + index}
                              field={key}
                              label={fieldsConf[key].name}
                            />
                          </InputGroup>
                        );
                      }
                    }
                  })}
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Form>
    </>
  );
};
