/**
 * 字典远程数据获取
 */
import { useRequest } from "ahooks";
import { TranDict, Result } from "@src/mvc/base";
import { useEffect, useRef } from "react";
import { Options } from "ahooks/lib/useRequest/src/types";
import { all, sync, SysDict } from "@src/mvc/SysDict";
export const useAllDict = () => {
  return useRequest(all, { manual: true });
};

/**
 * 资源删除
 */
export const useDictSync = (
  options: Options<Result<SysDict[]>, any> = {
    manual: true,
  }
) => useRequest(sync, options);

export const useDict = () => {
  const dictData = useRef<SysDict[]>(); // 全量的字典数据读取
  const { data, runAsync, run } = useRequest(all);
  /**
   * 全局字典信息拉取
   */
  const pullDict = () => {
    runAsync().then((data) => {
      dictData.current = data.data;
    });
  };
  /**
   *字典初始化
   */
  useEffect(() => {
    if (!dictData.current) {
      pullDict();
    }
  }, []);

  /**
   * 获得单条字典信息
   */
  const getSub = (code: string): SysDict[] => {
    const codeDicts: SysDict[] | undefined = dictData.current?.filter(
      (sysDict) => {
        return sysDict.code === code;
      }
    );
    if (codeDicts) return codeDicts;
    return [];
  };

  /**
   * @param codes 多条字典信息
   * @returns
   */
  const getSubs = (...codes: string[]): TranDict[] => {
    let dicts: TranDict[] = [];
    codes.forEach((code) => {
      dicts.push({ column: code, sysDict: getSub(code) });
    });
    return dicts;
  };
  return { pullDict, getSub, getSubs };
};
