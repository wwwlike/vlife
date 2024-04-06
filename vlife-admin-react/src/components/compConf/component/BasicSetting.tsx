import React, { useEffect, useState } from "react";
import { Checkbox, Input, InputNumber, Select } from "@douyinfe/semi-ui";
import { TimePicker } from "@formily/semi";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataModel, sourceType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import { CompPropInfo, selectObj } from "../compConf";
import { FormVo } from "@src/api/Form";
import VfImage from "@src/components/VfImage";
import { FormFieldVo } from "@src/api/FormField";
import CompLabel from "./CompLabel";
import { loadApi } from "@src/resources/ApiDatas";
import SelectIcon from "@src/components/SelectIcon";

/**
 * 基础数据设置
 * 最原子的设置
 */
export interface BasicSettingProps {
  propName: string; //属性名称
  subName?: string; //
  formVo?: FormVo;
  field?: FormFieldVo;
  listNo?: number; //所在组序号
  propInfo: CompPropInfo; //属性信息
  value: Partial<PageComponentPropDto>;
  onDataChange: (data: Partial<PageComponentPropDto>) => void;
}

export default ({
  propInfo,
  value,
  propName,
  field,
  listNo,
  formVo,
  subName,
  onDataChange,
}: BasicSettingProps) => {
  const [data, setData] = useState<Partial<PageComponentPropDto>>({
    ...value,
    propName,
    subName,
    listNo,
  });
  const [selectOptions, setSelectOptions] = useState<Partial<selectObj>[]>([]);
  //sourceType 默认是固定值
  const [type, setType] = useState<sourceType>(sourceType.fixed);
  //options非数组的另外两种模式产生数组数据
  useEffect(() => {
    if (propInfo.options) {
      if (
        !Array.isArray(propInfo.options) &&
        typeof propInfo.options === "object" &&
        propInfo.options.apiInfoKey
      ) {
        loadApi(propInfo.options).then((d) => {
          setSelectOptions(d);
        });
      } else {
        setSelectOptions(propInfo.options as selectObj[]);
      }
    }
  }, [propInfo]);

  useUpdateEffect(() => {
    onDataChange({ ...data, sourceType: type });
  }, [data, type]);

  return (
    // 简单类型字段属性设置
    propInfo.fromField === undefined || propInfo.fromField === true ? (
      <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
        {/* label */}
        <CompLabel
          code={`${
            listNo !== undefined && subName !== undefined
              ? listNo + 1 + "_"
              : ""
          }${subName || propName}
            `}
          label={propInfo.label}
          required={propInfo.required}
          remark={propInfo.remark}
          icon={<i className={` text-blue-400  icon-knowledge_file `} />}
        />
        {propInfo.fromField === undefined && (
          <>
            {/* 1. 基础数据采用选项方式录入 */}
            {propInfo.options ? (
              <>
                {selectOptions && (
                  <Select
                    showClear
                    className="w-full"
                    optionList={selectOptions}
                    placeholder={`请选择${subName || propName}属性值`}
                    value={data.propVal}
                    onChange={(v) => {
                      setData({
                        ...data,
                        propVal: v,
                      });
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {propInfo.dataModel === DataModel.string && (
                  <Input
                    className="w-full"
                    value={data.propVal}
                    placeholder={`请录入${subName || propName}属性值`}
                    onChange={(v) => {
                      setData({ ...data, propVal: v });
                    }}
                  />
                )}
                {propInfo.dataModel === DataModel.date && (
                  <TimePicker
                    value={data.propVal}
                    placeholder={`请录入${subName || propName}属性值`}
                    onChange={(v) => {
                      setData({ ...data, propVal: v });
                    }}
                  />
                )}
                {propInfo.dataModel === DataModel.number && (
                  <InputNumber
                    value={data.propVal}
                    placeholder={`请录入${propName}属性值`}
                    onChange={(v) => {
                      setData({ ...data, propVal: v });
                    }}
                  />
                )}
                {propInfo.dataModel === DataModel.boolean && (
                  <Checkbox
                    value={data.propVal}
                    onChange={(v) => {
                      setData({ ...data, propVal: v.target.checked });
                    }}
                  />
                )}
                {propInfo.dataModel === DataModel.image && (
                  <VfImage
                    value={data.propVal}
                    onDataChange={(v) => {
                      setData({ ...data, propVal: v });
                    }}
                  />
                )}
                {propInfo.dataModel === DataModel.icon && (
                  <SelectIcon
                    value={data.propVal}
                    onDataChange={(v) => {
                      setData({ ...data, propVal: v });
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
        {/* 来源于关联字段 */}
        {propInfo.fromField === true && formVo && (
          <Select
            showClear
            className="w-full"
            placeholder={`属性${propName}值等于的字段选取`}
            emptyContent="未找到类型匹配的字段"
            optionList={formVo.fields
              .filter(
                (f) =>
                  f.dataType === propInfo.dataType &&
                  f.fieldType === propInfo.dataModel &&
                  f.fieldName !== field?.fieldName
              )
              .map((f) => {
                return {
                  label: `${f.title}(${f.fieldName})`,
                  value: f.fieldName,
                };
              })}
            value={data.propVal}
            onChange={(v) => {
              setData({ ...data, propVal: v });
            }}
          />
        )}
      </div>
    ) : (
      <div className=" hidden">
        fromField不为true且有值则不用进行展示，需要再组件选择的时候判断是否匹配；
        组件属性使用fromfield的一般情况都是组件与接口绑定死了是，是模块不是组件
      </div>
    )
  );
};
