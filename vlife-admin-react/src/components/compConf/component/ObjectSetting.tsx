import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select } from "@douyinfe/semi-ui";
import { PageApiParam } from "@src/api/PageApiParam";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataModel, DataType, sourceType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import CompConf from "..";
import { allApis, apiDatas } from "../../../resources/ApiDatas";
import { CompPropInfo, ParamsInfo, ParamsObj, MatchObj } from "../compConf";
import ParamsSetting from "./ParamsSetting";
import { FormVo, list } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { FormFieldVo } from "@src/api/FormField";
import CompLabel from "./CompLabel";
import { OptionProps } from "@douyinfe/semi-ui/lib/es/autoComplete/option";
import { listAll, MenuVo } from "@src/api/SysMenu";
import FilterSetting from "./FilterSetting";

/**
 * 对象数据设置
 * 1. 如果有dataSub,继续拆分
 * 2. 需要处理预制条件，如select，需求是
 */
export interface ObjectSettingProps {
  propName: string;
  lineNo?: number;
  propInfo: CompPropInfo;
  formVo?: FormVo;
  field?: FormFieldVo;
  value: Partial<PageComponentPropDto>[];
  onDataChange: (datas: Partial<PageComponentPropDto>[]) => void;
}

//判断是否是一致或者继承的数据
const checkEq = (
  a: { dataType?: DataType; dataModel: DataModel | string },
  b: { dataType?: DataType; dataModel: DataModel | string }
): boolean => {
  return (
    a.dataModel.toLowerCase() === b.dataModel.toLowerCase() &&
    (a.dataType || "basic") === (b.dataType || "basic")
  );
};

//查找接口信息里所有是必须的入参且来自指定实体字段的参数来源字段信息集合
export function extractFromFields(
  paramObj: ParamsObj
): { entity: string; field: string }[] {
  // const paramObj = apiInfo.params;
  const compPropKeys: string[] = Object.keys(paramObj || {});
  return compPropKeys
    ?.filter(
      (k) =>
        paramObj &&
        paramObj[k] &&
        typeof paramObj[k] === "object" &&
        (paramObj[k] as ParamsInfo).fromField &&
        (paramObj[k] as ParamsInfo).fromField !== true &&
        (paramObj[k] as ParamsInfo).required == true
    )
    .map(
      (key) =>
        (paramObj?.[key] as ParamsInfo).fromField as {
          entity: string;
          field: string;
        }
    );
}
//接口资产定义
const VfApis = apiDatas;
export default ({
  propInfo,
  propName,
  lineNo,
  formVo,
  field,
  value,
  onDataChange,
}: ObjectSettingProps) => {
  const { getFormInfo } = useAuth();

  const check = (
    propInfo: { dataType?: DataType; dataModel: DataModel | string },
    apiInfo: { dataType: DataType; dataModel: DataModel | string },
    formVo?: FormVo
  ): Promise<boolean> => {
    //先判断formField是否由缺失的字段
    const eq: boolean =
      (propInfo?.dataModel || "basic").toLowerCase() ===
        (apiInfo?.dataModel || "basic").toLowerCase() &&
      propInfo.dataType === apiInfo.dataType;
    if (eq) {
      return new Promise((resolve) => {
        resolve(true);
      });
    } else {
      return getFormInfo({ type: apiInfo.dataModel }).then((d) => {
        const num = d?.parentsName?.filter(
          (name) => propInfo.dataModel === name
        ).length;
        return num && num > 0 ? true : false;
      });
    }
  };
  // data api方式使用的单个data
  const [data, setData] = useState<Partial<PageComponentPropDto>>(
    value && value.length > 0
      ? { ...value[0] }
      : {
          listNo: propInfo.dataSub ? lineNo : undefined,
          propName,
          sourceType: sourceType.api,
        }
  );

  //应用 对接口进行分类
  const [apps, setApps] = useState<MenuVo[]>();
  //
  const [currApp, setCurrApp] = useState<string>();
  //所有模型
  const [models, setModels] = useState<FormVo[]>();
  useEffect(() => {
    listAll().then((res) => {
      setApps(res.data?.filter((m) => m.app));
    });
    list().then((res) => {
      setModels(res.data);
    });
  }, []);
  useEffect(() => {
    if (data.propVal && data.sourceType === sourceType.api) {
      setCurrApp(
        models?.filter(
          (m) =>
            m.type.toLowerCase() ===
            apiDatas[data.propVal]?.dataModel.toLowerCase()
        )?.[0]?.sysMenuId || "other"
      );
    }
  }, [data, models]);

  /**
   * 1. 组件属性数据结构一致/子类的api的
   * 2. 和数组转换后match的一致/子类的api
   * 3.  在1和2的基础上，在判断参数为必填项且来源于指定的字段formField,那么也必须满足这个接口才能选择到
   */
  //满足api对象的选项集合
  const [apiOptionList, setApiOptionList] = useState<OptionProps[]>([]);
  useEffect(() => {
    const dataType = propInfo.dataType;
    const dataModel = propInfo.dataModel;
    const apiOptions: OptionProps[] = [];
    Object.keys(apiDatas).forEach((apiKey) => {
      const matchs: MatchObj = apiDatas[apiKey].match;
      const matchKeys: string[] = Object.keys(matchs);

      matchKeys.forEach((mkey) => {
        const match = matchs[mkey];
        let fromFields: { entity: string; field: string }[] = [];
        if (match.params) {
          fromFields = extractFromFields(match.params);
        }
        const fromFieldPass: boolean =
          fromFields === undefined ||
          fromFields === null ||
          fromFields.length === 0 ||
          //没有这样的字段或者这样的字段都能匹配上
          fromFields.filter(
            (fromField) =>
              formVo?.fields.filter(
                (f) =>
                  f.entityType === fromField.entity &&
                  f.entityFieldName === fromField.field &&
                  f.dataType !== "array"
              ).length === 1
          ).length === fromFields.length;
        //(表单满足字段需求fromField),进行出参
        if (fromFieldPass) {
          //当前接口出参数据对应的模型
          let apiModel: FormVo | undefined = models?.filter(
            (f) =>
              f.type.toLowerCase() === apiDatas[apiKey].dataModel.toLowerCase()
          )?.[0];
          if (
            apiDatas[apiKey].dataType === dataType && //1 接口直接数据匹配
            apiDatas[apiKey].dataModel === dataModel.toLowerCase() &&
            (currApp === undefined || //2 接口出参模型来自的应用和当前接口所选应用匹配
              (apiModel && apiModel.sysMenuId === currApp) ||
              (apiModel === undefined && currApp === "other"))
          ) {
            apiOptions.push({ label: apiDatas[apiKey].label, value: apiKey });
          }
          const matchDatas: MatchObj | undefined = apiDatas[apiKey].match;
          if (matchDatas) {
            Object.keys(matchDatas)
              .filter(
                //1 match适配数据匹配过滤
                (matchKey) =>
                  matchDatas[matchKey].dataType === dataType &&
                  matchDatas[matchKey].dataModel.toLowerCase() ===
                    dataModel.toLowerCase()
              )
              .forEach((matchKey) => {
                if (
                  //2 match适配的模型来自当前所选的应用
                  currApp === undefined ||
                  (apiModel && apiModel.sysMenuId === currApp) ||
                  (apiModel === undefined && currApp === "other")
                ) {
                  apiOptions.push({
                    label:
                      apiDatas[apiKey].label +
                      (matchDatas[matchKey].label
                        ? `(${matchDatas[matchKey].label})`
                        : ""),
                    value: apiKey + "," + matchKey,
                  });
                }
              });
          }
        }
      });
    });
    setApiOptionList(apiOptions);
  }, [propInfo, currApp, models]);

  //当前可用的api
  const useableApiOption = useMemo((): OptionProps[] => {
    //组件属性需求字段类型
    const dataType = propInfo.dataType;
    const dataModel = propInfo.dataModel;
    const apis = allApis(models || []);
    return apis
      .filter(
        (api) =>
          api.dataType === dataType &&
          (api.dataModel.toLowerCase() === dataModel.toLowerCase() ||
            api.parentClass.filter(
              (parent) => parent.toLowerCase() === dataModel.toLowerCase()
            ).length > 0) &&
          (currApp === undefined || api.app === currApp)
      )
      .map((api) => {
        return {
          label: api.apiLabel + (api.matchLabel ? `(${api.matchLabel})` : ""),
          value: api.apiKey + "," + api.matchKey,
        };
      });
  }, [propInfo, currApp, models]);

  useEffect(() => {
    //指定接口前端不用选择
    if (propInfo.apiMatch) {
      setData({
        ...data,
        // listNo: undefined,
        sourceType: sourceType.api,
        propVal: propInfo.apiMatch.apiInfoKey,
        relateVal: propInfo.apiMatch.match,
        filterFunc: propInfo.apiMatch.filterFunc,
        filterConnectionType: propInfo.apiMatch.filterConnectionType,
      });
    }
  }, [apiOptionList, propInfo]);

  //数据传出去
  useUpdateEffect(() => {
    onDataChange([{ ...data }]);
  }, [data]);

  /**
   * 数据转换过滤器数据
   */
  const matchOptionList = useCallback(
    (propVal: string): { label: string; value: any }[] => {
      if (propVal) {
        const api = VfApis[propVal];
        if (api) {
          const match = api.match;
          if (match)
            return Object.keys(match)
              .filter((k) => checkEq(match[k], propInfo))
              .map((k) => {
                return { label: match[k].label || api.label, value: k };
              });
        }
      }
      return [];
    },
    [propInfo]
  );

  //默认选中有且只有一个的转换函数名
  useEffect(() => {
    if (data.sourceType === sourceType.api && data.propVal) {
      const matchs = matchOptionList(data.propVal);
      if (matchs && matchs.length === 1) {
        setData({ ...data, relateVal: matchs[0].value });
        // setRelateVal(matchs[0].value);
      }
    }
  }, [data.propVal, data.sourceType]);

  /**
   * 选择的api对应的参数集合
   */
  const paramsObj = useMemo((): { [key: string]: ParamsInfo } => {
    const p: any = {};
    // if (data.propVal && VfApis[data.propVal] && VfApis[data.propVal].params) {
    //   const params: any = VfApis[data.propVal].params;
    //   //接口的通用参数
    //   Object.keys(params).map((k) => {
    //     if (typeof params[k] === "object") {
    //       p[k] = params[k];
    //     }
    //   });
    // }
    //match的专有参数
    if (data.relateVal && data.propVal) {
      const matchParams =
        VfApis[data.propVal]?.match?.[data?.relateVal]?.params;
      if (matchParams) {
        Object.keys(matchParams).map((k) => {
          if (typeof matchParams[k] === "object") {
            p[k] = matchParams[k];
          }
        });
      }
    }
    return p;
  }, [data]);

  return (
    <div className=" w-full">
      {propInfo.dataSub ? (
        <div>
          <div className="text-xs justify-between flex box-border font-semibold text-gray-700 mb-1 mt-0 pr-4 align-middle leading-5 tracking-normal flex-shrink-0">
            <div>{`${propInfo.label}(${propName})`}</div>
            <div className=" text-gray-500">
              {lineNo !== undefined ? `第${lineNo + 1}组 ` : ""}
            </div>
          </div>
          <div className=" border-t border-dashed   relative " />
          <CompConf
            formVo={formVo}
            field={field}
            propConf={propInfo.dataSub}
            value={value}
            lineNo={lineNo}
            parentName={propName}
            onDataChange={(data: Partial<PageComponentPropDto>[]) => {
              onDataChange(data);
            }}
          />
        </div>
      ) : (
        // api方式
        <div>
          {propInfo.apiMatch === undefined && (
            <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
              <CompLabel
                required={propInfo.required}
                code={propName}
                // label={propInfo.label}
                remark={
                  propInfo.remark ||
                  `该属性数据来源于ApiDatas.ts里定义的出参类型为${propInfo.dataModel}<${propInfo.dataType}>接口`
                }
                icon={<i className={`icon-api text-blue-400`} />}
              />
              {/* api选择 */}
              {
                <div className="flex w-full space-x-1">
                  <Select
                    className=" w-44"
                    value={currApp}
                    placeholder="应用选择"
                    optionList={[
                      ...(apps?.map((a) => {
                        return { value: a.id, label: a.name };
                      }) || []),
                      { value: "other", label: "其他" },
                    ]}
                    onChange={(d) => {
                      setCurrApp(d?.toString());
                      setData((d) => {
                        return {
                          ...d,
                          relateVal: undefined,
                          propVal: undefined,
                        };
                      });
                    }}
                  ></Select>
                  {/* {apiOptionList && apiOptionList.length > 0 ? ( */}
                  <Select
                    optionList={useableApiOption}
                    showClear
                    value={
                      (data.propVal || "") +
                      (data.relateVal ? "," + data.relateVal : "")
                    }
                    // placeholder={`[${propInfo.dataType}/${propInfo.dataModel}]类型接口选择`}
                    placeholder={`${propInfo.label}`}
                    onChange={(d) => {
                      const apiMatch: string[] = d?.toString().split(",") || [];
                      if (d?.toString().split(",").length === 2)
                        setData((d) => {
                          return {
                            ...d,
                            filterFunc: undefined,
                            //match转换
                            relateVal:
                              apiMatch.length === 2 ? apiMatch[1] : undefined,
                            sourceType: sourceType.api,
                            propVal: apiMatch[0],
                          };
                        });
                    }}
                    className="w-full"
                  />
                  {/* ) : (
                  <span className=" text-sm font-bold text-gray-500">
                    没有返回{propInfo.dataType}/{propInfo.dataModel}类型接口
                  </span>
                )} */}
                </div>
              }
              {/* {propInfo.apiMatch && (
              <div className=" w-full flex justify-end text-sm text-center">
                已与
                <span>
                  {propInfo.apiMatch.apiInfoKey}/{propInfo.apiMatch.match}
                </span>
                接口对接
              </div>
            )} */}
            </div>
          )}
          <div className="bg-blue-50">
            {/* api设置 */}
            {paramsObj && Object.keys(paramsObj).length > 0 && (
              <div className=" w-full">
                {Object.keys(paramsObj).map((k) => {
                  return (
                    <ParamsSetting
                      key={k}
                      formVo={formVo}
                      field={field}
                      paramInfo={paramsObj[k]}
                      paramName={k}
                      propName={propName}
                      value={
                        data.params &&
                        data.params.filter((f) => f.paramName === k).length > 0
                          ? data.params.filter((f) => f.paramName === k)[0]
                          : undefined
                      }
                      onDataChange={(d: Partial<PageApiParam>) => {
                        setData({
                          ...data,

                          params: data.params
                            ? [
                                ...data.params.filter((d) => d.paramName !== k),
                                d,
                              ]
                            : [d],
                        });
                      }}
                    />
                  );
                })}
              </div>
            )}
            {/* 当前接口可配置的过滤器选择 */}
            {data.sourceType === sourceType.api && (
              <FilterSetting
                data={data}
                onDataChange={(filterData: {
                  filterFunc: string;
                  filterConnectionType: string;
                }) => {
                  setData((d: any) => {
                    return {
                      ...d,
                      ...filterData,
                    };
                  });
                }}
              ></FilterSetting>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
