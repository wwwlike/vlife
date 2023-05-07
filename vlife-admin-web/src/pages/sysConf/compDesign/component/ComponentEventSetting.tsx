import { Select } from "@douyinfe/semi-ui";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { useCallback, useMemo } from "react";
import { PropInfo } from "@src/dsl/schema/component";
import { ApiProp } from "@src/dsl/schema/api";
import { ApiInfo } from "@src/dsl/datas/apis";
/**
 * 组件事件设置
 */
export interface ComponentEventSettingProp {
  /**
   * 页面key
   */
  pageKey: string;
  /**
   * 事件名称
   */
  eventName: string;
  /** 事件定义信息属性 */
  propInfo: PropInfo;

  /** 会音响到的属性信息 evnet=>propName有值 */
  targetPropInfo?: PropInfo;
  /** 事件DB录入信息 */
  propObj?: Partial<PageComponentPropDto>;
  onDataChange: (propObj: Partial<PageComponentPropDto>) => void;
}

/**
 * 核心是找到与propInfo里面params匹配的api放进来
 * 当前是通过参数名称命名一致来匹配(没有通过参数类型一致，因为api定义参数时没有dataType属性)
 */
const ComponenetEventSetting = ({
  eventName,
  propInfo,
  pageKey,
  propObj,
  targetPropInfo,
  onDataChange,
}: ComponentEventSettingProp) => {
  /**
   * 数据库记录组装
   */
  const propData = useMemo((): Partial<PageComponentPropDto> => {
    if (propObj) {
      return { ...propObj };
    } else {
      return {
        propName: eventName,
      };
    }
  }, [eventName, propInfo, propObj]);

  const onPropValChange = useCallback(
    (val: any) => {
      onDataChange({ ...propData, propVal: val === "" ? undefined : val });
    },
    [{ ...propData }] //对象要处理呀
  );
  /**
   * 查找匹配事件触发后去调用的接口
   * 1.组件事件属性如绑定另一个组件属性（event:propName有值）,那么绑定的接口出参数据类型需要和该属性数据类型一致
   * 2.接口的入参参数和组件事件属性函数的入参 名称需要一致(当前是名称一致，后期期望调整为数据类型一致即可，因为目前接口里没有定义类型)
   * @returns 找到命名一致的接口
   */
  const findByParamName = useCallback((): (ApiProp & { apiName: string })[] => {
    const names: string[] = propInfo.event?.params //事件的所有参数名称
      ? Object.keys(propInfo.event?.params)
      : [];
    const rightApi: (ApiProp & { apiName: string })[] = []; //合适的api

    for (let key in ApiInfo) {
      //遍历所有的api
      let api = ApiInfo[key]; //当前api
      if (
        //如调用的方法请求的值需要赋值给某个属性上，则这里过滤的接口的出参和该属性dataType必须一致
        //第二步，对比接口的入参是否一致
        ((targetPropInfo === undefined ||
          (targetPropInfo.dataType === api.dataType &&
            (targetPropInfo.dataModel === undefined ||
              (targetPropInfo.dataModel &&
                api.dataModel &&
                targetPropInfo.dataModel.includes(api.dataModel))))) &&
          (names === undefined || names === null || names.length === 0) &&
          (api.params === undefined || // 需求和目标都不需要参数
            api.params === null ||
            Object.keys(api.params).length === 0)) ||
        (names !== undefined && // 需求和目标都有参数且包涵
          names !== null &&
          names.length > 0 &&
          api.params !== undefined &&
          api.params !== null &&
          Object.keys(api.params).length > 0 &&
          Object.keys(api.params).filter((name) => names.includes(name))
            .length === names.length)
      ) {
        rightApi.push({ ...api, apiName: key });
      }
    }

    return rightApi;
  }, [propInfo, targetPropInfo]);

  return (
    <Select
      style={{ width: "90%" }}
      onChange={onPropValChange}
      value={propData?.propVal}
      className=""
      optionList={findByParamName().map((d) => {
        return {
          value: d.apiName,
          label: d.label,
        };
      })}
    />
    // </div>
  );
};

export default ComponenetEventSetting;
