import { Button, ButtonGroup } from "@douyinfe/semi-ui";
import VfButton from "@src/components/button";
import { Mode } from "@src/dsl/base";
import React, { useCallback } from "react";
import { deps, SchemaClz } from "../fieldSettingSchema";

/**
 * 模型设置
 */
interface FormSettingProps {
  mode: Mode; //当前模式
  className: string;
  schema: SchemaClz; //定义模型
  data: any; //数据模型
  layout?: "horizontal" | "vertical"; //布局方式 横|竖
  onDataChange: (model: any, fieldName: string) => void; //数据回传
}
const FormSetting = ({
  mode,
  schema,
  className,
  data,
  onDataChange,
  layout = "horizontal",
  ...props
}: FormSettingProps) => {
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
        arr.filter((a) => a.value.includes(data[a.field])).length ===
        arr.length;
      return back;
    },
    [data]
  );

  return (
    <div
      className={`${
        layout === "horizontal" ? "flex space-x-2 items-center" : ""
      } ${className}`}
    >
      {Object.keys(schema)
        .filter(
          (key) =>
            (schema[key].mode === mode ||
              (schema[key].mode instanceof Array &&
                (schema[key].mode as Array<Mode>).includes(mode))) &&
            check(key, schema[key].deps)
        )
        .map((key, index) => {
          return (
            <div
              className=" flex items-center my-4"
              key={"formSetting_" + index + key}
            >
              <div className="semi-form-field-label-text semi-form-field-label">
                <label>{schema[key].name}</label>
              </div>

              {schema[key].type === "buttonGroup" ? (
                <ButtonGroup className=" flex items-end">
                  {schema[key].items?.map((item, index) => {
                    return (
                      <Button
                        key={key + item.value + index}
                        type={
                          data &&
                          (item.value + "" === data[key] + "" ||
                            (key.startsWith(mode + "_") &&
                              item.value + "" ===
                                data[
                                  key.substring(mode.toString().length + 1)
                                ] +
                                  ""))
                            ? "primary"
                            : `tertiary`
                        }
                        value={item.value + ""}
                        onClick={() => {
                          onDataChange(
                            {
                              ...data,
                              [key]: item.value,
                            },
                            key
                          );
                        }}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </ButtonGroup>
              ) : (
                <></>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default FormSetting;
