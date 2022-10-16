import { Options } from "ahooks/lib/useRequest/src/types";
import { useMemo } from "react";
import { useRequest } from "ahooks";
import { TablePagination } from "@douyinfe/semi-ui/lib/es/table";
import qs from "qs";
import apiClient from "@src/mvc/apiClient";
import { fieldInfo, IdBean, ModelInfo, PageVo, Result } from "@src/mvc/base";
import { Notification } from "@douyinfe/semi-ui";

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
  entityName?: string; //实体模型名称
  listModel?: string; //查询列表模型
  loadData?: (params: Pager) => Promise<Result<PageVo<any>>>; //直接传入异步方法，取代规则（动态方法路径）
}

type Pager = { pager: { size: number; page: number } };

/**
 *
 * @param options 通用的列表搜索
 * @returns
 */
export const usePage = ({
  manual = true,
  loadData = (params: Pager): Promise<Result<PageVo<any>>> => {
    return apiClient.get(
      `/${entityName}/page${
        listModel && listModel !== entityName ? "/" + listModel : ""
      }?${qs.stringify(params, {
        allowDots: true, //多级对象转str中间加点
        arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
      })}`
    );
  },
  entityName,
  listModel,
  ...options
}: optionProps) => {
  return useRequest(loadData, { manual, ...options });
};

type modelInfoProps = Options<Result<ModelInfo>, any> & {
  entityName: string;
};

/**
 * 单个用户信息视图
 * @param id
 * @return
 */
export const modelInfo = (
  entityName: string,
  modelName: string
): Promise<Result<ModelInfo>> => {
  return apiClient.get(`/${entityName}/modelInfo/${modelName}`);
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
 * 通用数据保存
 * save/dtoName
 * save 实体名称进行的
 */
export const useSave = ({
  manual = true,
  ...props
}: Options<Result<any>, any>) =>
  useRequest(
    (
      params: Partial<any>,
      entityName: string,
      modelName?: string
    ): Promise<Result<any>> => {
      return apiClient.post(
        `/${entityName}/save${
          modelName && modelName !== entityName ? "/" + modelName : ""
        }`,
        params
      );
    },
    {
      manual,
      onSuccess(data) {
        // Notification.success({
        //   content: `操作成功`,
        // })
      },
      ...props,
    }
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
    {
      manual,
      onSuccess(data) {
        if (data.data === -1) {
          Notification.warning({
            content: `有关联数据存在,不允许删除`,
          });
        } else {
          Notification.success({
            content: `操作成功`,
          });
        }
      },
      ...options,
    }
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
      ids: (string | number)[]
    ): Promise<Result<any[]>> => {
      return apiClient.get(
        `/${baseName}/views/${modelName}?ids=${ids.join(",")}}`,
        {
          params: {},
        }
      );
    },
    { manual, ...options }
  );

/**
 * 外键信息
 * @param entityName 模块
 * @param ids 主键id
 * @returns
 */
export const find = (
  entityName: string,
  field: string = "id",
  ids: (string | number)[]
): Promise<Result<any[]>> => {
  return apiClient.get(`/${entityName}/find/${field}?ids=${ids.join(",")}`, {
    params: {},
  });
};
