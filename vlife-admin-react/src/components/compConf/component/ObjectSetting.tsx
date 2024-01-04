import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Select } from "@douyinfe/semi-ui";
import { PageApiParam } from "@src/api/PageApiParam";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataModel, DataType, sourceType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import CompConf from "..";
import { apiDatas } from "../../../resources/ApiDatas";
import { CompPropInfo, ParamsInfo, ParamsObj, ApiInfo } from "../compConf";
import ParamsSetting from "./ParamsSetting";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { FormFieldVo } from "@src/api/FormField";
import { filterFuns } from "@src/resources/filters";
import CompLabel from "./CompLabel";

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
  apiInfo: ApiInfo
): { entity: string; field: string }[] {
  const paramObj = apiInfo.params;
  const compPropKeys: string[] = Object.keys(paramObj || {});
  return compPropKeys
    ?.filter(
      (k) =>
        paramObj &&
        paramObj[k] &&
        typeof paramObj[k] === "object" &&
        (paramObj[k] as ParamsInfo).fromField &&
        (paramObj[k] as ParamsInfo).fromField !== true &&
        (paramObj[k] as ParamsInfo).must == true
    )
    .map(
      (key) =>
        (apiInfo?.params?.[key] as ParamsInfo).fromField as {
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
  //满足api对象的选项集合
  const [apiOptionList, setApiOpenList] = useState<
    { label: string; value: any }[]
  >([]);

  /**
   * 1. 组件属性数据结构一致/子类的api的
   * 2. 和数组转换后match的一致/子类的api
   * 3.  在1和2的基础上，在判断参数为必填项且来源于指定的字段formField,那么也必须满足这个接口才能选择到
   */
  useEffect(() => {
    Promise.all(
      Object.keys(apiDatas).map((apiName) => {
        return check(propInfo, apiDatas[apiName], formVo).then((d) => {
          const match = apiDatas[apiName].match;
          //1. 完全匹配，接口继承一致匹配
          if (d === true) {
            return apiName;
          } else if (match) {
            //需要转换match匹配
            return Promise.all(
              Object.keys(match).map((name) => {
                return check(propInfo, match[name], formVo).then((d) => {
                  return d;
                });
              })
            ).then((includes: boolean[]) => {
              if (includes.includes(true)) {
                return apiName;
              }
              return undefined;
            });
          }
          return undefined;
        });
      })
    ).then((d: (string | undefined)[]) => {
      let apis: { label: string; value: any }[] = d
        .filter((dd) => dd !== undefined)
        .map((name) => {
          return { label: apiDatas[name || ""].label, value: name };
        });

      //二次过滤，fromField匹配过滤(?找父节点)
      const fromFieldFIlterApis = apis.filter((api) => {
        const fromFields: { field: string; entity: string }[] =
          extractFromFields(apiDatas[api.value]);
        return (
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
          ).length === fromFields.length
        );
      });
      setApiOpenList(fromFieldFIlterApis);
    });
  }, [propInfo]);

  useEffect(() => {
    //指定接口前端不用选择
    if (propInfo.apiName) {
      setData({
        ...data,
        // listNo: undefined,
        sourceType: sourceType.api,
        propVal: propInfo.apiName,
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
    if (data.propVal && VfApis[data.propVal] && VfApis[data.propVal].params) {
      const params: any = VfApis[data.propVal].params;
      Object.keys(params).map((k) => {
        if (typeof params[k] === "object") {
          p[k] = params[k];
        }
      });
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
          <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
            <CompLabel
              must={propInfo.must}
              code={propName}
              label={propInfo.label}
              remark={
                propInfo.remark ||
                `该属性数据来源于ApiDatas.ts里定义的出参类型为${propInfo.dataModel}<${propInfo.dataType}>接口`
              }
              icon={<i className={`icon-api text-blue-400`} />}
            />
            {/* api选择 */}
            {propInfo.apiName === undefined && (
              <>
                {apiOptionList && apiOptionList.length > 0 ? (
                  <Select
                    optionList={apiOptionList}
                    showClear
                    value={data.propVal}
                    placeholder={`[${propInfo.dataType}/${propInfo.dataModel}]类型接口选择`}
                    onChange={(d) => {
                      setData({
                        ...data,
                        filterFunc: undefined,
                        relateVal: undefined,
                        sourceType: sourceType.api,
                        propVal: d,
                      });
                    }}
                    className="w-full"
                  />
                ) : (
                  <span className=" text-sm font-bold text-gray-500">
                    没有返回{propInfo.dataType}/{propInfo.dataModel}类型接口
                  </span>
                )}
              </>
            )}
            {propInfo.apiName && (
              <div className=" w-full flex justify-end text-sm text-center">
                已指定apiName属性，使用
                <span className=" text-red-500">`{propInfo.apiName}`</span>
                接口
              </div>
            )}
          </div>
          <div className="bg-blue-50">
            {/* 转换器选择 */}
            {data.propVal &&
              matchOptionList(data.propVal) &&
              matchOptionList(data.propVal).length > 1 && (
                <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                  <CompLabel
                    blod={false}
                    label={"适配定制"}
                    remark={`当接口返回的数据结构与组件所需的数据结构不一致时，我们在API定义中增加了一个match函数来进行适配。目前有${
                      matchOptionList(data.propVal).length
                    }种适配方式可供选择，请选择适合当前组件场景的一种。`}
                    must={true}
                    icon={
                      <i className={`icon-knowledge-recycle text-red-400  `} />
                    }
                  />
                  <Select
                    showClear
                    optionList={matchOptionList(data.propVal)}
                    value={data.relateVal}
                    placeholder={"需要转换当前接口返回的数据"}
                    onChange={(d) => {
                      setData({ ...data, relateVal: d?.toString() });
                    }}
                    className="w-full"
                  />
                </div>
              )}
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
            {/* 全局过滤器选择 */}
            {data.propVal &&
              data.sourceType === sourceType.api &&
              propInfo.dataType === DataType.array &&
              Object.keys(filterFuns).filter((k) => {
                return (
                  filterFuns[k].dataModel ===
                  apiDatas[data.propVal || ""]?.dataModel
                );
              })?.length > 0 && (
                <>
                  <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                    <CompLabel
                      blod={false}
                      label={"数据筛选"}
                      remark={"按照filter.ts里配置筛选"}
                      icon={
                        <i className={` icon-filter_list  text-red-400 `} />
                      }
                    />
                    <Select
                      showClear
                      multiple
                      placeholder={"对数据做进一步过滤"}
                      style={{ width: "90%" }}
                      value={
                        data && data.filterFunc && data.filterFunc.length > 0
                          ? data.filterFunc.split(",")
                          : undefined
                      }
                      optionList={Object.keys(filterFuns)
                        .filter((k) => {
                          return (
                            filterFuns[k].dataModel ===
                            apiDatas[data.propVal || ""].dataModel
                          );
                        })
                        .map((d: string) => {
                          return { label: filterFuns[d].title, value: d };
                        })}
                      onChange={(e) => {
                        setData((d: any) => {
                          return {
                            ...d,
                            filterFunc: e?.toString(),
                            filterConnectionType:
                              d.filterConnectionType || "or",
                          };
                        });
                      }}
                    />
                  </div>
                  {data.filterFunc && data.filterFunc.split(",").length > 1 && (
                    <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                      <CompLabel
                        blod={false}
                        label={"筛选整合"}
                        remark={
                          "经过2个以上筛选过滤器分别处理后的数据连接整合方式"
                        }
                        icon={<i className=" text-red-400 icon-link_record" />}
                      />
                      <Select
                        showClear
                        style={{ width: "90%" }}
                        optionList={[
                          { label: "取多次筛选的交集数据", value: "and" },
                          { label: "取多次筛选的并集数据", value: "or" },
                        ]}
                        value={data.filterConnectionType}
                        onChange={(e) => {
                          setData((d: any) => {
                            return {
                              ...d,
                              filterConnectionType: e?.toString(),
                            };
                          });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
