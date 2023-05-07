/**
 * API参数设置
 */
import { Input, Select, Typography } from "@douyinfe/semi-ui";
import { useAuth } from "@src/context/auth-context";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PageApiParam } from "@src/api/PageApiParam";
import { FormFieldVo } from "@src/api/FormField";
import { ParamInfo } from "@src/dsl/schema/api";
const { Text } = Typography;
interface PropSettingProps {
  /** 参数名 */
  paramName: string;
  /** 参数信息 */
  paramInfo: ParamInfo;
  /** 参数DB数据 */
  pageApiParam?: Partial<PageApiParam>;
  /**
   * 数据回传
   */
  onDataChange: (pageApiParam: Partial<PageApiParam>) => void;

  fields?: FormFieldVo[];
}

const ComponentPropSetting = ({
  paramName,
  paramInfo,
  pageApiParam,
  onDataChange,
  fields,
}: PropSettingProps) => {
  const { dicts } = useAuth();

  const paramData = useMemo((): Partial<PageApiParam> => {
    if (pageApiParam) {
      return { ...pageApiParam };
    } else {
      return {
        paramName: paramName,
        paramVal: paramInfo.defValue ? paramInfo.defValue : undefined,
        sourceType: paramInfo.sourceType, //可以去掉
      };
    }
  }, [paramName, pageApiParam, paramInfo]);

  const onParamValChange = useCallback(
    (val: any) => {
      onDataChange({ ...paramData, paramVal: val });
    },
    [{ ...paramData }] //对象要处理呀
  );

  // api数据支持的数据来源
  // dict field,fixed,table; api能否也支持？

  /**
   * sourceType=table时，从服务端请求的可以选择的数据集
   */
  const [selectData, setSelectData] =
    useState<{ label: string; value: any }[]>();

  /**
   * 和ComponentPropSetting重复了，应该提取成
   */
  useEffect(() => {
    const fixed = paramInfo?.fixed;
    if (fixed && fixed.dicts) {
      setSelectData(fixed.dicts);
    } else if (fixed && fixed.promise) {
      fixed.promise().then((d) => {
        setSelectData(d);
      });
    }
  }, [paramInfo]);

  return (
    <div key={"api_div_" + paramName}>
      {/* 1 固定值录入 */}
      <div className="flex space-x-1 mb-2 p-2">
        <div className=" w-24">{paramInfo.label}</div>
        {(paramInfo.sourceType === "fixed" ||
          paramInfo.sourceType === undefined) &&
        selectData === undefined &&
        paramInfo.dict === undefined ? (
          <Input value={paramData?.paramVal} onChange={onParamValChange} />
        ) : (
          <></>
        )}
        {/* 2字典选择 */}
        {paramInfo.sourceType === "dict" || paramInfo.dict ? (
          <Select
            style={{ width: "100%" }}
            showClear
            value={paramData.paramVal}
            optionList={dicts[paramInfo?.dict?.dictCode || "vlife"].data}
            onChange={onParamValChange}
          />
        ) : (
          <></>
        )}
        {/*3  自定义传值选择 */}
        {selectData ? (
          <Select
            showClear
            value={paramData.paramVal}
            onChange={onParamValChange}
            optionList={selectData}
          />
        ) : (
          <></>
        )}
        {paramInfo.sourceType === "field" && fields ? (
          //vlife是选择字典类目
          <Select
            style={{ width: "100%" }}
            showClear
            value={paramData.paramVal}
            optionList={fields.map((m) => {
              return { value: m.fieldName, label: m.title };
            })}
            onChange={onParamValChange}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ComponentPropSetting;
