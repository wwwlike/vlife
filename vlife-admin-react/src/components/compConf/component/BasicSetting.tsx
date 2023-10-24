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

  const [selectOptions, setSelectOptions] = useState<Partial<selectObj>[]>();
  //sourcetYpe 默认是固定值
  const [type, setType] = useState<sourceType>(sourceType.fixed);
  //options非数组的另外两种模式产生数组数据
  useEffect(() => {
    if (propInfo.options && !Array.isArray(propInfo.options)) {
      if (typeof propInfo.options === "object") {
        const labelkey = propInfo.options.labelKey;
        const valuekey = propInfo.options.valueKey;
        propInfo.options.func().then((d) => {
          setSelectOptions(
            d.data?.map((dd) => {
              return {
                label: dd[labelkey],
                value: dd[valuekey],
              };
            })
          );
        });
      } else {
        (
          propInfo.options as (
            form?: FormVo,
            field?: FormFieldVo
          ) => Promise<any>
        )(formVo, field).then((d) => {
          setSelectOptions(d);
        });
      }
    }
  }, [propInfo]);

  useUpdateEffect(() => {
    // alert(JSON.stringify(data));
    onDataChange({ ...data, sourceType: type });
  }, [data, type]);

  return (
    <>
      {propInfo.fromField === undefined && ( //从字段里取则不需要在页面进行设置
        <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
          <div className="text-sm box-border font-semibold text-gray-700 mb-1 mt-0 pr-4 inline-block align-middle leading-5 tracking-normal flex-shrink-0">
            <label>
              <i
                style={{ fontSize: "14px" }}
                className={` text-red-400 pr-2   entryIcon icon icon-knowledge_file z-40 `}
              />
              {propInfo.label}
              {listNo !== undefined && subName === undefined
                ? `${listNo + 1}`
                : ""}
            </label>
          </div>
          {/* 1. 基础数据采用选项方式录入 */}
          {propInfo.options ? (
            <>
              {/* 固定值域 */}
              {Array.isArray(propInfo.options) && (
                <Select
                  showClear
                  className="w-full"
                  optionList={propInfo.options}
                  value={data.propVal}
                  onChange={(v) => {
                    setData({ ...data, propVal: v });
                  }}
                />
              )}

              {/* 接口值域 */}
              {selectOptions && (
                <Select
                  showClear
                  className="w-full"
                  optionList={selectOptions}
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
                  onChange={(v) => {
                    setData({ ...data, propVal: v });
                  }}
                />
              )}
              {propInfo.dataModel === DataModel.date && (
                <TimePicker
                  value={data.propVal}
                  onChange={(v) => {
                    setData({ ...data, propVal: v });
                  }}
                />
              )}
              {propInfo.dataModel === DataModel.number && (
                <InputNumber
                  value={data.propVal}
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
            </>
          )}
        </div>
      )}
    </>
  );
};
