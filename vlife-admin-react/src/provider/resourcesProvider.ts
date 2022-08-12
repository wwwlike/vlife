import { TablePagination } from "@douyinfe/semi-ui/lib/es/table";
import { runEffects } from "@formily/core/esm/shared/effective";
import { ResourcesPageReq, SysResources } from "@src/types/resources";
import { IdBean, PageVo, Result } from "@src/types/vlife";
import apiClient from "@src/utils/apiClient";
import { useRequest } from "ahooks";
import { Options } from "ahooks/lib/useRequest/src/types";
import { table } from "console";
import { useEffect, useMemo, useState } from "react";
import useUrlState from "@ahooksjs/use-url-state";
// const a: TablePagination = {};
/**
 * 查询数据封装成semi tabl需要的数据结构
 * @param result  查询结果
 * @param setPage 分页调用的方法
 */
export const useTable = (
  result: PageVo<any> | undefined,
  setPage: (page: number) => void
) => {
  return useMemo((): { pagination: TablePagination; dataSource: any } => {
    return {
      pagination: {
        currentPage: result?.page,
        pageSize: result?.size,
        total: result?.total,
        onPageChange: setPage,
      },
      dataSource: result?.result,
    };
  }, [result]);
};

/**
 * 资源查询
 * 页码改变就立刻触发搜索
 * 实时搜索类型的，就等待变换几秒后触发搜索
 *
 */
export const useResourcesPage = (
  options: Options<Result<PageVo<SysResources>>, any> = {
    manual: true,
  }
) => {
  //普通state
  // const [resourcesPageReq, setResourcePageReq] = useState<
  //   Partial<ResourcesPageReq>
  // >({ "pager.size": 1, "pager.page": 1 });
  //能同步到url的state
  const [resourcesPageReq, setResourcePageReq] = useUrlState<
    Partial<ResourcesPageReq>
  >({ "pager.page": 1, "pager.size": 5 });
  const req = useRequest(
    (
      params: Partial<ResourcesPageReq> = resourcesPageReq
    ): Promise<Result<PageVo<SysResources>>> => {
      return apiClient.get(`/sysResources/page`, {
        params: params,
      });
    },
    options
  );
  /**
   * 页码变换就触发搜索，search触发page=1
   */
  useEffect(() => {
    req.run(resourcesPageReq);
  }, [resourcesPageReq]);
  // }, [resourcesPageReq["pager.page"], resourcesPageReq["search"]]);

  //回调
  const setPage = (page: number) => {
    setResourcePageReq({ ...resourcesPageReq, "pager.page": page });
  };
  const tableInfo = useTable(req.data?.data, setPage);
  return { ...req, tableInfo, resourcesPageReq, setResourcePageReq };
};
/**
 * 资源新增
 */
export const useResourcesSave = (
  options: Options<Result<SysResources>, any> = {
    manual: true,
  }
) =>
  useRequest((params: Partial<SysResources>): Promise<Result<SysResources>> => {
    return apiClient.post(`/sysResources/save`, params);
  }, options);

/**
 * 资源删除
 */
export const useResourcesRemove = (
  options: Options<Result<number>, any> = {
    manual: true,
  }
) =>
  useRequest((id: string): Promise<Result<number>> => {
    return apiClient.delete(`/sysResources/remove/${id}`);
  }, options);

/**
 * 模型信息查询
 */
export const useResourcesModelInfo = (
  options: Options<Result<any>, any> = { manual: true }
) =>
  useRequest((voName: string): Promise<Result<any>> => {
    return apiClient.get(`/sysResources/tableInfo/${voName}`);
  }, options);
