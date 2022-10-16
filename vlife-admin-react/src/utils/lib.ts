import { useEffect, useMemo, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { Interface } from "readline";
import { cleanObject, subset } from "./utils";

// 工具，方法

/**
 *
 * 组件加载时触发，ahooks里有该hooks了
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

/**
 * 给路由上加参数，通过 useUrlQueryParam来对外服务
 */
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
/**  从URL里获得入参写入到obj里进行数据的初始化，如果数据里面已经有该值，则根据第二个参数决定是否覆盖 **/
// export const useUrlQueryParamGetAndSet = (params: Interface) => {
//   const filteredEntries = Object.entries(params).filter(([key]) => alert(key));
// };

/**
 * 返回页面url中，指定键的参数值 ，设置参数取得参数
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
    },
  ] as const;
};

/**
 * 延迟触发的hooks 防抖
 * 关键字：闭包，解绑，定时器
 */
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次在value变化以后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};
