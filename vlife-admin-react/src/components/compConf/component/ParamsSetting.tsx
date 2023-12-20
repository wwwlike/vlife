import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Input,
  InputNumber,
  Select,
  Tooltip,
} from "@douyinfe/semi-ui";
import { TimePicker } from "@formily/semi";
import { PageApiParam } from "@src/api/PageApiParam";
import { DataModel, sourceType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import { ParamsInfo, selectObj } from "../compConf";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import { _PageLabel } from "./ObjectSetting";

/**
 * 接口入参设置
 */
export interface ParamsSettingProps {
  paramName: string; //参数标识
  paramInfo: ParamsInfo; //参数定义信息
  value?: Partial<PageApiParam>;
  formVo?: FormVo;
  field?: FormFieldVo;
  onDataChange: (data: Partial<PageApiParam>) => void;
}

export default ({
  value,
  paramName,
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
    if (paramInfo.options && !Array.isArray(paramInfo.options)) {
      if (typeof paramInfo.options === "object") {
        const labelkey = paramInfo.options.labelKey;
        const valuekey = paramInfo.options.valueKey;
        paramInfo.options.func().then((d) => {
          setSelectOptions(
            d.data?.map((dd) => {
              return {
                label: dd[labelkey],
                value: dd[valuekey],
              };
            })
          );
          setType(sourceType.fixed);
        });
      } else {
        (
          paramInfo.options as (
            form?: FormVo,
            field?: FormFieldVo
          ) => Promise<any>
        )(formVo, field).then((d) => {
          setType(sourceType.fixed);
          setSelectOptions(d);
        });
      }
    }
  }, [paramInfo]);

  useUpdateEffect(() => {
    onDataChange(data);
  }, [data]);

  return (
    <>
      {paramInfo.fromField === undefined && (
        <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
          {/* <div className="text-sm box-border items-center font-semibold text-gray-700 mb-1 mt-0 pr-1 inline-block align-middle leading-5 tracking-normal flex-shrink-0">
            <label>
              <i
                style={{ fontSize: "14px" }}
                className={` text-red-400 pr-2   entryIcon icon icon-laptop_mac z-40 `}
              />
              {paramInfo.remark ? (
                <Tooltip className="hide" content={paramInfo.remark}>
                  {paramInfo.label}
                </Tooltip>
              ) : (
                paramInfo.label
              )}
              {paramInfo.must && (
                <span className=" font-bold text-red-600">*</span>
              )}
            </label>
          </div> */}
          <_PageLabel
            // label={paramInfo.label}

            // must={paramInfo.must}
            {...paramInfo}
            remark={
              paramInfo.remark ||
              `组件属性:${paramName};数据类型:${paramInfo.dataModel}`
            }
            icon={<i className={` text-red-400  icon-laptop_mac  `} />}
          />
          {/* 1. 基础数据采用选项方式录入 */}
          {paramInfo.options ? (
            <>
              {/* 固定值域 */}
              {Array.isArray(paramInfo.options) && (
                <Select
                  className="w-full"
                  optionList={paramInfo.options}
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

              {/* 接口值域 */}
              {selectOptions && (
                <>
                  <Select
                    className="w-full"
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
                </>
              )}
            </>
          ) : (
            <>
              {paramInfo.dataModel === DataModel.string && (
                <>
                  {/* {JSON.stringify(data)} */}
                  <Input
                    className="w-full"
                    value={data.paramVal}
                    onChange={(v) => {
                      setData({
                        ...data,
                        sourceType: type,
                        paramVal: v,
                      });
                    }}
                  />
                </>
              )}
              {paramInfo.dataModel === DataModel.date && (
                <TimePicker
                  value={data.paramVal}
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
        </div>
      )}
      {paramInfo.fromField === true && (
        <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
          {/* <div className="text-sm box-border items-center font-semibold text-gray-700 mb-1 mt-0 pr-1 inline-block align-middle leading-5 tracking-normal flex-shrink-0"> */}
          {/* <label>
              <i
                style={{ fontSize: "14px" }}
                className={` text-red-400 pr-2   entryIcon icon icon-laptop_mac z-40 `}
              />
              {paramInfo.remark ? (
                <Tooltip className="hide" content={paramInfo.remark}>
                  {paramInfo.label}
                </Tooltip>
              ) : (
                paramInfo.label
              )}
            </label>
          </div> */}
          <_PageLabel
            label={paramInfo.label}
            remark={paramInfo.label}
            must={paramInfo.must}
            icon={<i className={` text-red-400  icon-laptop_mac  `} />}
          />
          {formVo && (
            <Select
              showClear
              className="w-full"
              optionList={formVo.fields.map((f) => {
                return { label: f.title, value: f.fieldName };
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
        </div>
      )}
    </>
  );
};
