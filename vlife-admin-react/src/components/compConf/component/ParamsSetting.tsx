import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, Input, InputNumber, Select } from "@douyinfe/semi-ui";
import { TimePicker } from "@formily/semi";
import { PageApiParam } from "@src/api/PageApiParam";
import { DataModel, DataType, sourceType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import { ParamsInfo, selectObj } from "../compConf";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import CompLabel from "./CompLabel";
import { loadApi } from "@src/resources/ApiDatas";

/**
 * 单个接口入参设置
 */
export interface ParamsSettingProps {
  paramName: string; //参数标识
  propName: string; //属性
  paramInfo: ParamsInfo; //参数定义信息
  value?: Partial<PageApiParam>;
  formVo?: FormVo;
  field?: FormFieldVo;
  onDataChange: (data: Partial<PageApiParam>) => void;
}

export default ({
  value,
  paramName,
  propName,
  formVo,
  field,
  paramInfo,
  onDataChange,
}: ParamsSettingProps) => {
  const [data, setData] = useState<Partial<PageApiParam>>({
    ...value,
    paramName,
  });

  // sourceType
  const [type, setType] = useState<sourceType>(sourceType.fixed);
  const [selectOptions, setSelectOptions] = useState<Partial<selectObj>[]>();

  //异步下拉框组装
  useEffect(() => {
    if (paramInfo.options) {
      if (
        !Array.isArray(paramInfo.options) &&
        typeof paramInfo.options === "object"
      ) {
        loadApi(paramInfo.options).then((d) => {
          setSelectOptions(d);
        });
      } else {
        setSelectOptions(paramInfo.options);
      }
    }
  }, [paramInfo]);

  useUpdateEffect(() => {
    onDataChange(data);
  }, [data]);

  //接口参数的tooltip提示
  const remark = useMemo((): string => {
    const msg = ``;
    if (paramInfo.fromField !== undefined) {
      if (paramInfo.fromField === true) {
        return msg + "该参数的数据来自当前表单的其他字段";
      } else {
        return msg + "该参数的数据来自当前表单指定字段";
      }
    } else if (paramInfo.options) {
      return msg + "下拉选择项内容来自接口配置项params->options";
    }
    return "";
  }, [paramInfo, propName]);

  return (
    <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
      <CompLabel
        required={paramInfo.required}
        code={paramName}
        // label={paramInfo.label}
        remark={paramInfo.remark || remark}
        icon={<i className={` text-red-400  icon-laptop_mac  `} />}
      />
      {paramInfo.fromField === undefined && (
        <>
          {/*  1 下拉方式取值 */}
          {selectOptions && (
            <Select
              className="w-full"
              // placeholder={`[${paramInfo.dataType}/${paramInfo.dataModel}]接口参数选择`}
              placeholder={`${paramInfo.label}`}
              optionList={selectOptions}
              value={data.paramVal}
              onChange={(v) => {
                setData({
                  ...data,
                  sourceType: type,
                  paramVal: v?.toString(),
                });
              }}
            />
          )}
          {/* 2手写入参 */}
          {(paramInfo.dataType === undefined ||
            paramInfo.dataType === "basic") &&
            paramInfo.options === undefined &&
            paramInfo.fromField === undefined && (
              <>
                {paramInfo.dataModel === DataModel.string && (
                  <Input
                    className="w-full"
                    value={data.paramVal}
                    // placeholder={`[${paramInfo.dataType}/${paramInfo.dataModel}]接口参数值录入`}
                    placeholder={`${paramInfo.label}`}
                    onChange={(v) => {
                      setData({
                        ...data,
                        sourceType: type,
                        paramVal: v,
                      });
                    }}
                  />
                )}
                {paramInfo.dataModel === DataModel.date && (
                  <TimePicker
                    value={data.paramVal}
                    placeholder={`${paramInfo.label}`}
                    onChange={(v) => {
                      setData({
                        ...data,
                        sourceType: type,
                        paramVal: v.toString(),
                      });
                    }}
                  />
                )}
                {paramInfo.dataModel === DataModel.number && (
                  <InputNumber
                    value={data.paramVal}
                    placeholder={`${paramInfo.label}`}
                    onChange={(v) => {
                      setData({
                        ...data,
                        sourceType: type,
                        paramVal: v.toString(),
                      });
                    }}
                  />
                )}
                {paramInfo.dataModel === DataModel.boolean && (
                  <Checkbox
                    value={data.paramVal}
                    onChange={(v) => {
                      setData({
                        ...data,
                        sourceType: type,
                        paramVal: v.target.checked,
                      });
                    }}
                  />
                )}
              </>
            )}
        </>
      )}
      {/* 3.来自表单其他字段 */}
      {paramInfo.fromField === true && formVo && (
        <Select
          showClear
          emptyContent="未找到类型匹配的字段"
          placeholder={`参数${paramName}值等于的字段选取`}
          className="w-full"
          optionList={formVo.fields
            .filter(
              (f) =>
                f.dataType === paramInfo.dataType &&
                f.fieldType === paramInfo.dataModel &&
                f.fieldName !== field?.fieldName
            )
            .map((f) => {
              return {
                label: `${f.title}(${f.fieldName})`,
                value: f.fieldName,
              };
            })}
          value={data.paramVal}
          onChange={(v) => {
            setData({
              ...data,
              sourceType: type,
              paramVal: v?.toString(),
            });
          }}
        />
      )}
      {/* 4. fromfield匹配判断 */}
      {paramInfo.fromField && paramInfo.fromField !== true && (
        <div className=" w-full text-sm text-red-500 flex">
          {formVo &&
          formVo?.fields
            .filter((f) => f.entityType === (paramInfo.fromField as any).entity)
            .filter((f) => f.dataType !== "array")
            .filter(
              (ff) => ff.entityFieldName === (paramInfo.fromField as any)?.field
            ).length > 0 ? (
            <>{`已将该入参与表单"${
              formVo?.fields
                .filter(
                  (f) => f.entityType === (paramInfo.fromField as any).entity
                )
                .filter((f) => f.dataType !== "array")
                .filter(
                  (ff) =>
                    ff.entityFieldName === (paramInfo.fromField as any)?.field
                )[0].fieldName
            }"字段关联,数据可联动`}</>
          ) : (
            <>{`该入参可不传，当前未匹配到`}</>
          )}
        </div>
      )}
      {/* 5. 配置不正确提醒 */}
      {paramInfo.fromField === undefined &&
        paramInfo.dataType !== undefined &&
        paramInfo.dataType !== DataType.basic &&
        formVo && (
          <div className=" w-full text-sm text-red-500 flex">{`${paramName}没有指定来源(fromField)`}</div>
        )}
      {/* 5. 配置的确定的formField也会找不到，没有做提示，prop也有此缺陷 */}
    </div>
  );
};
