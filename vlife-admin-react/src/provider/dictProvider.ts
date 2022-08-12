/**
 * 字典远程数据获取
 */
import { useRequest } from "ahooks";
import apiClient from "@src/utils/apiClient";
import { IdBean, Pager, TranDict } from "@src/types/vlife";
import { useEffect, useRef } from "react";
import { Result } from "@src/types/vlife";
import { Options } from "ahooks/lib/useRequest/src/types";

export interface Dict extends IdBean {
  code: string;
  val: string | undefined;
  title: string;
  sys: boolean | undefined;
  del: boolean | undefined;
}

export interface DictPageReq extends Pager {
  code?: string;
  val?: string;
  title?: string;
}
/**
 * 字典分类查询
 */
export const dictPageType = (req: Partial<DictPageReq>) => {
  return apiClient.get("/dict/pageType");
};

export const dictAll = (): Promise<Result<Dict[]>> => {
  return apiClient.get(`/dict/all`);
};

export const useAllDict = () => {
  return useRequest(() => dictAll(), { manual: true });
};

/**
 * 资源删除
 */
export const useDictSync = (
  options: Options<Result<Dict[]>, any> = {
    manual: true,
  }
) =>
  useRequest((): Promise<Result<Dict[]>> => {
    return apiClient.get(`/dict/sync`);
  }, options);

export const useDict = () => {
  const dictData = useRef<Dict[]>(); // 全量的字典数据读取
  const { data, runAsync, run } = useRequest(() => dictAll());
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
  const getSub = (code: string): Dict[] => {
    const codeDicts: Dict[] | undefined = dictData.current?.filter((dict) => {
      return dict.code === code;
    });
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
      dicts.push({ column: code, dict: getSub(code) });
    });
    return dicts;
  };
  return { pullDict, getSub, getSubs };
};
