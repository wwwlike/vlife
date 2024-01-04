import { Options } from "ahooks/lib/useRequest/src/types";
import { useRequest } from "ahooks";
import { TablePagination } from "@douyinfe/semi-ui/lib/es/table";
import qs from "qs";
import apiClient from "@src/api/base/apiClient";
import {  IdBean,  PageVo, Result } from "@src/api/base";
import { Notification } from "@douyinfe/semi-ui";
import { useMemo } from 'react';

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
  entityType: string; //实体模型名称
  listModel: string; //查询列表模型
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
    return apiClient.post(
      `/${entityType}/page${
        listModel && listModel !== entityType ? "/" + listModel : ""
      }`,params
    );
  },//空则使用该默认值
  entityType,
  listModel,
  ...options
}: optionProps) => {
  return useRequest(loadData, { manual, ...options });
  // return useRequest(loadData, { manual,refreshDeps: [loadData], ...options });
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
      dto: Partial<any>,
      entityType: string,
      type?: string
    ): Promise<Result<any>> => {
      return apiClient.post(
        `/${entityType}/save${
          type && type !== entityType ? "/" + type : ""
        }`,
        dto
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
  entityType,
  manual = true,
  ...options
}: Options<Result<number>, any> & { entityType: string }) =>
  useRequest(
    (ids: string[]): Promise<Result<number>> => {
      return apiClient.delete(`/${entityType}/remove`,{data:ids}); //命名规范
    },
    {
      manual,
      onSuccess(data) {
        if (data.data === -1) {
          Notification.warning({
            content: `有关联数据存在,不允许删除`,
          });
        } else {
          // Notification.success({
          //   content: `操作成功`,
          // });
        }
      },
      ...options,
    }
  );

/**
 * 通用明细查询，根据id查询指定模型的详情
 */
export const useDetail = ({
  entityType,
  manual = true,
  ...options
}: Options<Result<IdBean>, any> & { entityType?: string }) =>
  useRequest(
    ({id}:IdBean, detailModelName: string,_entityType?:string): Promise<Result<IdBean>> => {
      return apiClient.get(
        `/${entityType||_entityType}/view/${detailModelName + "/" }${id}`
      );
    },
    { manual, ...options }
  );

/**
 * 通用明细集合查询，根据id查询指定模型的详情
 */
export const useDetails = ({
  entityType,
  manual = true,
  ...options
}: Options<Result<any[]>, any> & { entityType: string }) =>
  useRequest(
    (
      modelName: string,
      baseName: string = entityType,
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
 * 外键信息(查找指定表的指定ID行记录的指定字段的全部值)
 * @param entityType 模块
 * @param ids 主键id
 * @returns
 */
export const find = (
  entityType: string,
  field: string = "id",
  ids: (string | number)[]
): Promise<Result<any[]>> => {
  return apiClient.get(`/${entityType}/find/${field}?ids=${ids.join(",")}`, {
    params: {},
  });
};

/**
 * 字段去重
 */
 export const exist = (req:{entityType:string,fieldName:string,fieldVal:string,id?:string}): Promise<Result<number>> => {
  return apiClient.get(`/${req.entityType}/exist`,{params:req});
};


/**
 * 单表全量数据查询
 * @param entityType 模块
 * @param req 查询条件
 * @returns
 */
 export const listAll = (params:{
  entityType: string,
  req?:any
}): Promise<Result<any[]>> => {
  return apiClient.get(`/${params.entityType}/list/all?${qs.stringify(params.req, {
    allowDots: true,
    arrayFormat: "comma",
  })}`);
};


export const findName = (prop: {ids:string[],entityType:string}): Promise<Result<any[]>> => {
  if (prop.ids === undefined || prop.ids === null || prop.ids.length === 0) {
    return new Promise((resolve) => {
      resolve({ code: "200", msg: "success", data: undefined });
    });
  } else {
    // alert(prop.entityType)
    return apiClient.get(
      `/${prop.entityType}/findName`,{params:prop}
    );
  }
};
