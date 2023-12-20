import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Select, Tooltip } from "@douyinfe/semi-ui";
import { PageApiParam } from "@src/api/PageApiParam";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataModel, DataType, sourceType } from "@src/dsl/base";
import { useUpdateEffect } from "ahooks";
import CompConf from "..";
import { apiDatas } from "../../../resources/ApiDatas";
import { CompPropInfo, ParamsInfo } from "../compConf";
import ParamsSetting from "./ParamsSetting";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { FormFieldVo } from "@src/api/FormField";
import { filterFuns } from "@src/resources/filters";

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
  a: { dataType: DataType; dataModel: DataModel | string },
  b: { dataType: DataType; dataModel: DataModel | string }
): boolean => {
  return (
    a.dataModel.toLowerCase() === b.dataModel.toLowerCase() &&
    a.dataType === b.dataType
  );
};
export const _PageLabel = ({
  label,
  icon,
  remark,
  must,
}: {
  label: string;
  remark?: string;
  icon?: ReactNode;
  must?: boolean;
}) => {
  return (
    <div className="text-sm  items-center font-semibold text-gray-700 mb-1 mt-0 pr-4 inline-block align-middle leading-5 tracking-normal flex-shrink-0">
      {icon}
      {remark ? (
        <Tooltip content={remark}>
          <label>{label}</label>
        </Tooltip>
      ) : (
        <label>
          {label}
          {must && <span className=" font-bold text-red-600">*</span>}
        </label>
      )}
    </div>
  );
};
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
    propInfo: { dataType: DataType; dataModel: DataModel | string },
    apiInfo: { dataType: DataType; dataModel: DataModel | string }
  ): Promise<boolean> => {
    const eq: boolean =
      propInfo.dataModel.toLowerCase() === apiInfo.dataModel.toLowerCase() &&
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
   */
  useEffect(() => {
    Promise.all(
      Object.keys(apiDatas).map((apiName) => {
        return check(propInfo, apiDatas[apiName]).then((d) => {
          const match = apiDatas[apiName].match;
          if (d === true) {
            //模型匹配
            return apiName;
          } else if (match) {
            //转换match匹配
            return Promise.all(
              Object.keys(match).map((name) => {
                return check(propInfo, match[name]).then((d) => {
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
      setApiOpenList(apis);
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
      //只有一个接口适配也不用选择
    } else if (apiOptionList.length === 1) {
      setData({
        ...data,
        listNo: undefined,
        sourceType: sourceType.api,
        propVal: apiOptionList[0].value,
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
                return { label: match[k].label, value: k };
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
          <div className="text-sm box-border font-semibold text-gray-700 mb-1 mt-0 pr-4 inline-block align-middle leading-5 tracking-normal flex-shrink-0">
            {propInfo.label}
            {lineNo !== undefined ? lineNo + 1 : ""}
          </div>
          <div className=" border-t border-dashed  border-gray-400 relative " />
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
          {/* api选择 */}
          {propInfo.apiName === undefined &&
            apiOptionList &&
            apiOptionList.length !== 1 && (
              <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                <_PageLabel
                  {...propInfo}
                  remark={
                    propInfo.remark ||
                    `组件属性:${propName};数据类型:${propInfo.dataType}=>${propInfo.dataModel}`
                  }
                  icon={<i className={`icon-api`} />}
                />

                {apiOptionList.length > 0 ? (
                  <Select
                    optionList={apiOptionList}
                    value={data.propVal}
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
                  <span className=" text-sm font-bold">
                    请添加{propInfo.dataType}-{propInfo.dataModel}类型接口
                  </span>
                )}
              </div>
            )}
          {/* 转换器选择 */}
          {data.propVal &&
            matchOptionList(data.propVal) &&
            matchOptionList(data.propVal).length > 1 && (
              <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                {/* <div className="text-sm box-border items-center font-semibold text-gray-700 mb-1 mt-0 pr-4 inline-block align-middle leading-5 tracking-normal flex-shrink-0">
                  <i
                    style={{ fontSize: "14px" }}
                    className={` text-red-400 pr-2   entryIcon icon icon-knowledge-recycle z-40 `}
                  />
                  <label></label>
                </div> */}
                <_PageLabel
                  label={"适配转换"}
                  remark={
                    "选择的接口出参与属性结构不一致,请转换方法需选择转换方法(`ApiDatas.ts->match`)"
                  }
                  must={true}
                  icon={
                    <i className={` text-red-400   icon-knowledge-recycle  `} />
                  }
                />
                <Select
                  optionList={matchOptionList(data.propVal)}
                  value={data.relateVal}
                  onChange={(d) => {
                    // setRelateVal(d?.toString());
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
                          ? [...data.params.filter((d) => d.paramName !== k), d]
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
              <div className="flex space-x-2 mb-2 w-full mt-2 items-center">
                {/* <div className="text-sm box-border items-center font-semibold text-gray-700 mb-1 mt-0 pr-4 inline-block align-middle leading-5 tracking-normal flex-shrink-0">
                  <i
                    style={{ fontSize: "14px" }}
                    className={` text-red-400 pr-2   entryIcon icon icon-filter_list z-40 `}
                  />
                  <label>范围筛选</label>
                </div> */}
                <_PageLabel
                  label={"数据筛选"}
                  remark={"按照filter.ts里配置筛选"}
                  icon={<i className={`text-red-400 icon-filter_list  `} />}
                />
                <Select
                  showClear
                  style={{ width: "90%" }}
                  value={data.filterFunc}
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
                    setData({ ...data, filterFunc: e?.toString() });
                  }}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
};
