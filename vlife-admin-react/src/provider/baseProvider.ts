import { fieldInfo, IdBean, ModelInfo, PageVo, Result } from "@src/types/vlife";
import apiClient from "@src/utils/apiClient";
import { Options } from "ahooks/lib/useRequest/src/types";
import { useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { TablePagination } from "@douyinfe/semi-ui/lib/es/table";
import useUrlState from "@ahooksjs/use-url-state";
import qs from "qs";
import { arrayToStr } from "@src/utils/utils";
import SizeContext from "antd/lib/config-provider/SizeContext";

/**
 * 列表分页参数组装
 * @param result
 * @param setPage
 * @returns
 */
const useTablePage = (
  result: PageVo<any> | undefined, //分页结果
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

interface optionProps extends Options<Result<PageVo<any>>, any> {
  entityName: string; //实体模型名称
  listModel?: string; //查询列表模型
}

type Pager = { pager: { size: number; page: number } };

/**
 *
 * @param options 通用的列表搜索
 * @returns
 */
export const usePage = ({
  manual = true,
  entityName,
  listModel,
  ...options
}: optionProps) => {
  return useRequest(
    (params: Pager): Promise<Result<PageVo<any>>> => {
      // alert(qs.stringify(params, { allowDots: true }));
      return apiClient.get(
        `/${entityName}/page${
          listModel && listModel !== entityName ? "/" + listModel : ""
        }?${qs.stringify(params, {
          allowDots: true, //多级对象转str中间加点
          arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
        })}`
      );
    },
    { manual, ...options }
  );
};

/**
 *
 * @param options 通用的列表搜索
 * @returns
 */
// export const usePage = ({
//   manual = true,
//   entityName,
//   listModel,
//   ...options
// }: optionProps) => {
//   if (!options["pager.size"]) {
//     options["pager.size"] = 10;
//   }
//   //普通state
//   const [pageReq, setPageReq] = useState<any>({});
//   // { "pager.page": 1, "pager.size": 5 }
//   // const [pageReq, setPageReq] = useUrlState<any>();
//   //能同步到url的state
//   const req = useRequest((params: any) => {
//     return apiClient.get(
//       `/${entityName}/page${
//         listModel && listModel !== entityName ? "/" + listModel : ""
//       }?${qs.stringify(params, { arrayFormat: "comma" })}`
//     );
//   }, options);

//   // ["pager.page"], pageReq["search"]

//   //分页调用的方法
//   const setPage = (page: number) => {
//     setPageReq({ ...pageReq, "pager.page": page });
//   };
//   const tableInfo = useTablePage(req.data?.data, setPage);

//   /**
//    * 页码变换就触发搜索，search触发page=1
//    */
//   useEffect(() => {
//     req.run(pageReq);
//   }, [pageReq]);

//   return { ...req, tableInfo, pageReq, setPageReq };
// };

// export const usePage = (
//   options: optionProps = {
//     manual: true,
//     "pager.size": 10,
//     apiPath: "",
//   }
// ) => {
//   //普通state
//   const [pageReq, setPageReq] = useState<any>({});
//   //能同步到url的state
//   const { apiPath } = options;
//   const req = useRequest((params: any) => {
//     return apiClient.get(apiPath, {
//       params: params,
//     });
//   }, options);
//   /**
//    * 页码变换就触发搜索，search触发page=1
//    */
//   useEffect(() => {
//     req.run(pageReq);
//   }, [pageReq["pager.page"], pageReq["search"]]);

//   //回调
//   const setPage = (page: number) => {
//     setPageReq({ ...pageReq, "pager.page": page });
//   };
//   const tableInfo = useTable(req.data?.data, setPage);
//   return { ...req, tableInfo, pageReq, setPageReq };
// };

type modelInfoProps = Options<Result<ModelInfo>, any> & {
  entityName: string;
};

/**
 * 模型信息查询
 */
export const useModelInfo = ({
  entityName,
  manual = true,
  ...props
}: modelInfoProps) => {
  return useRequest(
    (modelName: string): Promise<Result<ModelInfo>> => {
      return apiClient.get(`/${entityName}/modelInfo/${modelName}`);
    },
    { manual, ...props }
  );
};

/**
 * 模型信息查询
 */
export const useFindDictColumns = (
  fields: fieldInfo[]
): (string | undefined)[] => {
  return fields
    .filter((f) => {
      if (f.dictCode) return true;
      return false;
    })
    .map((f) => {
      return f.dictCode;
    });
};

/**
 * 数据保存
 */
export const useSave = ({
  manual = true,
  entityName,
  modelName,
  ...props
}: Options<Result<any>, any> & { entityName: string; modelName?: string }) =>
  useRequest(
    (params: Partial<any>): Promise<Result<any>> => {
      // alert(`/${entityName}/save${modelName ? "/" + modelName : ""}`);
      return apiClient.post(
        `/${entityName}/save${
          modelName && modelName !== entityName ? "/" + modelName : ""
        }`,
        params
      );
    },
    { manual, ...props }
  );

/**
 * 逻辑删除
 */
export const useRemove = ({
  entityName,
  manual = true,
  ...options
}: Options<Result<number>, any> & { entityName: string }) =>
  useRequest(
    (id: string | number): Promise<Result<number>> => {
      return apiClient.delete(`/${entityName}/remove/${id}`);
    },
    { manual, ...options }
  );

/**
 * 通用明细查询，根据id查询指定模型的详情
 */
export const useDetail = ({
  entityName,
  manual = true,
  ...options
}: Options<Result<IdBean>, any> & { entityName: string }) =>
  useRequest(
    (id: string | number, modelName?: string): Promise<Result<IdBean>> => {
      return apiClient.get(
        `/${entityName}/view/${modelName ? modelName + "/" : ""}${id}`
      );
    },
    { manual, ...options }
  );

/**
 * 通用明细集合查询，根据id查询指定模型的详情
 */
export const useDetails = ({
  entityName,
  manual = true,
  ...options
}: Options<Result<any[]>, any> & { entityName: string }) =>
  useRequest(
    (
      modelName: string,
      baseName: string = entityName,
      ...ids: (string | number)[]
    ): Promise<Result<any[]>> => {
      return apiClient.get(
        `/${baseName}/views/${modelName}?ids=${arrayToStr(ids, ",")}`,
        {
          params: {},
        }
      );
    },
    { manual, ...options }
  );
