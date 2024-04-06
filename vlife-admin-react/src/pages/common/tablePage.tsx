import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Table, { ListProps, TableBean } from "@src/components/table";
import { useAuth } from "@src/context/auth-context";
import { IdBean, PageQuery, PageVo, Result } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { find, useDetail, useRemove, useSave } from "@src/api/base/baseService";
import { FormFieldVo } from "@src/api/FormField";
import { IconSetting } from "@douyinfe/semi-icons";
import apiClient from "@src/api/base/apiClient";
import { VfAction } from "@src/dsl/VF";
import TagFilter from "@src/components/table/component/TagFilter";
import { Empty, Pagination, Tooltip } from "@douyinfe/semi-ui";
import { orderObj } from "./orderPage";
import { useSize } from "ahooks";
import BtnToolBar from "@src/components/button/BtnToolBar";
import { IllustrationConstruction } from "@douyinfe/semi-illustrations";
import classNames from "classnames";
import VfSearch from "@src/components/VfSearch";
import { useNavigate } from "react-router-dom";
import { Conditions, OptEnum, where } from "@src/dsl/base";
import { VFBtn } from "@src/components/button/types";
import {
  backProcess,
  cancelProcess,
  completeTask,
  findProcessDefinitions,
  recall,
  RecordFlowInfo,
  startFlow,
} from "@src/api/workflow/Flow";
import { ConsoleSqlOutlined, TruckFilled } from "@ant-design/icons";
import { fromPairs } from "lodash";
import { useNiceModal } from "@src/store";

const defaultPageSize = import.meta.env.VITE_APP_PAGESIZE;
// 后端排序字符串格式创建
const orderStr = (orderList: orderObj[] | undefined): string => {
  if (orderList === undefined) {
    return "";
  }
  let localStr = "";
  orderList
    .filter((o) => o.sort !== undefined)
    .forEach((o) => {
      localStr = localStr === "" ? localStr : localStr + ",";
      localStr = localStr + o.fieldName;
      if (o.sort) {
        localStr = localStr + "_" + o.sort;
      }
    });
  return localStr;
};
type PageFuncType<T extends IdBean> = <L extends PageQuery>(
  req: any
) => Promise<Result<PageVo<T>>>;
type apiError = {
  code: number;
  msg: string;
  url: string;
  method: string;
};

// T为列表listType的类型
export interface TablePageProps<T extends TableBean> extends ListProps<T> {
  listType: string; //列表模型
  activeKey: string; //当前激活的tab页签key
  editType: string | { type: string; reaction: VfAction[] }; //编辑模型，需要和listType有相同的实体模型(entityType)
  req: any; //查询条件obj  //自定义tab页签条件，filter过滤条件
  conditionJson?: string; //db视图过滤的条件
  design: true | undefined; //true则是设计器模式
  pageSize: number; //默认分页数量
  select_show_field: string; //选中时进行展示的字段，不传则不展示
  mode: "view" | "hand" | "normal"; //列表的三个场景模式  预览(精简无按钮，有搜索分页)|input传值(不从数据库取值，无需系统内置按钮和分页)|一般场景
  loadApi: PageFuncType<T>; //异步加载数据的地址，
  onTableModel: (formVo: FormVo) => void; //列表模型信息传出
  onFormModel: (formVo: FormVo) => void; //表单模型信息传出
  onGetData: (datas: T[]) => void; //请求的列表数据传出
  onHttpError: (error: apiError) => void; //异常信息传出，设计阶段时接口没有会用到
  otherBtns: VFBtn[]; // 按钮触发的增量功能
}

const TablePage = <T extends TableBean>({
  className,
  listType,
  editType,
  req,
  model,
  conditionJson,
  dataSource,
  activeKey,
  mode = "normal",
  width,
  btns,
  otherBtns,
  outSelectedColumn,
  loadApi,
  onGetData,
  onHttpError,
  onFormModel,
  read,
  onTableModel,
  ...props
}: Partial<TablePageProps<T>> & { listType: string }) => {
  const navigate = useNavigate();
  const { getFormInfo, user } = useAuth();
  const ref = useRef(null);
  const size = useSize(ref);
  const [tableModel, setTableModel] = useState<FormVo | undefined>(model); //列表模型信息
  const [formModel, setFormModel] = useState<FormVo | undefined>(model); //主要表单模型信息

  const [recordFlowInfo, setRecordFlowInfo] = useState<RecordFlowInfo[]>(); //列表记录关联的流程信息
  const [apiError, setApiError] = useState<apiError>(); //接口异常信息
  const [pageNum, setPageNum] = useState(1); //分页
  const [pageSize, setPageSize] = useState<number>(); //每页条数
  const [selected, setSelected] = useState<T[]>(); //列表选中的数据
  const [pageData, setPageData] = useState<PageVo<T>>(); //请求到的分页数据
  const [order, setOrder] = useState<orderObj[]>(); //默认的排序内容
  const [loadFlag, setLoadFlag] = useState(1); //刷新标志
  const [relationMap, setRealationMap] = useState<{
    fkObj: any; //外键数据
    parentObj: any; //code关联数据
  }>();
  // const [queryBuilderCondition, setQueryBuilderCondition] =
  //   useState<ConditionGroup[]>(); //builder查询条件
  const [columnWheres, setColumnWheres] = useState<Partial<where>[]>([]); //字段的查询条件
  //支持嵌套的查询条件组装inputSearch和columnFilter
  const [condition, setCondition] = useState<Partial<Conditions> | undefined>({
    orAnd: "or",
    where: [],
  });
  const editModelType = useMemo(() => {
    return editType
      ? typeof editType === "string"
        ? editType
        : editType.type
      : tableModel?.entityType;
  }, [editType, tableModel]);
  useEffect(() => {
    if (model) setTableModel(model);
  }, [model]);

  //模型信息加载
  useEffect(() => {
    if (tableModel === undefined || tableModel === null) {
      getFormInfo({
        type: listType,
      }).then((f: FormVo | undefined) => {
        setTableModel(f);
        if (onTableModel && f) {
          onTableModel(f);
        }

        if (listType !== editModelType) {
          getFormInfo({
            type: editModelType,
          }).then((f: FormVo | undefined) => {
            setFormModel(f);
            onFormModel && f && onFormModel(f);
          });
        } else {
          setFormModel(f);
          onFormModel && f && onFormModel(f);
        }
      });
    }
  }, [listType, editModelType]);

  //列表数据(整合流程节点信息)
  const tableData = useMemo(() => {
    if (dataSource) {
      return dataSource;
    } else if (pageData && pageData.result) {
      if (recordFlowInfo && recordFlowInfo.length > 0) {
        return pageData.result.map((item) => {
          const flowInfo = recordFlowInfo.filter(
            (flow) => flow.businessKey === item.id
          )?.[0];
          if (flowInfo) {
            return { ...item, flow: flowInfo };
          }
          return item;
        });
      }
      return pageData.result;
    }
  }, [dataSource, pageData?.result, recordFlowInfo]);

  useEffect(() => {
    if (pageData?.result && formModel?.flowJson) {
      findProcessDefinitions({
        defineKey: formModel.type,
        businessKeys: pageData.result.map((item) => item.id),
      }).then((result) => {
        setRecordFlowInfo(result.data);
      });
    }
  }, [formModel, pageData?.result]);

  const tableHight = useMemo(() => {
    const hight = size?.height ? size?.height - 145 : undefined;
    return hight && hight < 700 ? 700 : hight;
  }, [size]);
  const pager = useMemo((): { size: number; page: number } => {
    return {
      size: pageSize || tableModel?.pageSize || defaultPageSize,
      page: pageNum,
    };
  }, [pageSize, pageNum, tableModel]);

  const pagination = useMemo(() => {
    if (pageData?.total && pager) {
      return {
        currentPage: pageData.page,
        pageSize: pager?.size,
        total: pageData.total,
        onPageChange: (page: number) => {
          setPageNum(page);
        },
      };
    }
    return {};
  }, [pageData]);

  const searchAndColumnCondition = useMemo(():
    | Partial<Conditions>
    | undefined => {
    if (
      condition?.where &&
      condition.where.length > 0 &&
      columnWheres &&
      columnWheres.length > 0
    ) {
      return {
        orAnd: "and",
        where: columnWheres,
        conditions: [condition],
      };
    } else if (condition?.where && condition.where.length > 0) {
      return condition;
    } else if (columnWheres && columnWheres.length > 0) {
      return {
        orAnd: "and",
        where: columnWheres,
      };
    }
    return {};
  }, [columnWheres, condition]);

  //数据请求
  const pageLoad = useMemo((): PageFuncType<T> | undefined => {
    if (loadApi) {
      return loadApi;
    } else if (tableModel) {
      const { type, entityType } = tableModel;
      return (params: PageQuery): Promise<Result<PageVo<T>>> => {
        return apiClient.post(
          `/${entityType}/page${entityType !== type ? "/" + type : ""}`,
          params
        );
      };
    }
  }, [loadApi, JSON.stringify(tableModel)]);
  const { runAsync: rm } = useRemove({
    entityType: tableModel?.entityType || "",
  }); //数据删除方法
  const { runAsync: baseSave } = useSave({}); //数据保存的方法
  const save = useCallback((entityType: string, type?: string) => {
    return (data: any): Promise<any> => baseSave(data, entityType, type);
  }, []);
  const { runAsync: getDetail } = useDetail({
    entityType: tableModel?.entityType || "",
  });

  //数据请求参数
  const reqParams = useMemo(() => {
    const params = {
      ...req,
      conditionGroups: conditionJson
        ? JSON.parse(conditionJson)
        : req && req.conditionGroups && req.conditionGroups.length > 0
        ? req.conditionGroups
        : undefined,
      conditions: searchAndColumnCondition, //列表上的组件过滤(待合并到groups里)
      order: { orders: orderStr(order) },
      pager: pager,
    };
    return params;
  }, [
    order,
    JSON.stringify(req),
    conditionJson,
    searchAndColumnCondition,
    JSON.stringify(pager),
  ]);

  const query = useCallback(() => {
    // console.log("reqParams", JSON.stringify(reqParams));
    if (pageLoad) {
      pageLoad(reqParams)
        .then((data: Result<PageVo<T>>) => {
          if (data.data) {
            if (data.data.totalPage !== 0 && data.data.totalPage < pager.page) {
              setPageNum(data.data.totalPage);
            }
            setPageData(data.data);
            if (onGetData) {
              onGetData(data.data.result || []);
            }
          }
        })
        .catch((data) => {
          setApiError(data);
          if (onHttpError) {
            onHttpError(data);
          } else {
            console.error("table error " + data.code + data.msg);
          }
        });
    }
  }, [
    JSON.stringify(reqParams),
    JSON.stringify(tableModel),
    JSON.stringify(pageLoad),
    JSON.stringify(pager),
  ]);

  useEffect(() => {
    if (dataSource === undefined) query();
  }, [
    dataSource,
    JSON.stringify(req),
    order,
    loadFlag,
    conditionJson,
    searchAndColumnCondition,
    JSON.stringify(tableModel),
    JSON.stringify(pager),
    JSON.stringify(pageLoad),
  ]);

  const addMissingButtonAttributes = (b: VFBtn, entity: string): VFBtn => {
    if (b.actionType !== "click") {
      if (
        b.model === undefined &&
        b.saveApi &&
        (b.actionType === "create" ||
          b.actionType === "edit" ||
          b.actionType === "save")
      ) {
        b.model = entity;
      }
      //编辑模型和列表模型不一致，并且没有给出加载数据的方法，则使用通用方法
      if (
        b.model &&
        b.model !== listType &&
        b.loadApi === undefined &&
        b.actionType !== "create"
      ) {
        b.loadApi = (id: string): Promise<Result<any>> => {
          return getDetail(id, b.model);
        };
      }

      if (b.model === undefined && b.saveApi === undefined) {
        b.model = listType;
      }

      if (b.disabledHide === undefined) {
        b.disabledHide = true;
      }
      if (
        b.saveApi &&
        (b.permissionCode === undefined || b.permissionCode === null)
      ) {
        b.permissionCode = entity + ":" + b.saveApi.name;
      }
      return {
        ...b,
        reaction:
          b.reaction ||
          (typeof editType === "object" && editType.type === b.model
            ? editType.reaction
            : undefined),
        submitConfirm:
          b.submitConfirm !== undefined
            ? b.submitConfirm
            : b.actionType === "api",
        onSubmitFinish:
          b.onSubmitFinish ||
          (() => {
            setLoadFlag((flag) => flag + 1);
            setSelected([]); //清空选中
          }),
        // submitClose: b.submitClose || true, //默认触发关闭
      };
    } else {
      return b;
    }
  };
  const defbtn = useMemo((): VFBtn[] => {
    if (tableModel) {
      const savePermissionCode =
        tableModel?.entityType +
        ":save" +
        (tableModel?.entityType !== editModelType ? ":" + editModelType : "");
      const defaultBtns: VFBtn[] = [
        {
          actionType: "save",
          icon: <i className=" icon-add_circle_outline" />,
          multiple: false,
          permissionCode: savePermissionCode,
          model: editModelType,
          disabledHide: false,
          reaction:
            typeof editType === "object" ? editType.reaction : undefined,
          saveApi: save(tableModel?.entityType || "", editModelType), // save方法需要返回和model一致的数据
        },
        {
          title: "删除",
          actionType: "api",
          icon: <i className="  icon-remove_circle_outline1" />,
          usableMatch: { status: "1" }, //都可以修改
          multiple: true,
          permissionCode: tableModel?.entityType + ":remove",
          saveApi: (datas: IdBean[]): Promise<Result<any>> => {
            return rm(datas.map((d) => d.id));
          },
        },
      ];
      return defaultBtns;
    }
    return [];
  }, [tableModel, activeKey]);

  //工作流按钮
  const flowBtns = useMemo(() => {
    if (formModel?.flowJson) {
      return [
        {
          //permissionCode: savePermissionCode,权限取消掉了
          actionType: "save",
          // title: "保存",
          icon: <i className=" icon-add_circle_outline" />,
          multiple: false,
          model: editModelType,
          // disabledHide: true,
          usableMatch: (data: TableBean) => {
            //不结束都能保存
            return (
              data === undefined ||
              data.id === undefined ||
              (data?.flow?.ended !== true &&
                (data?.flow?.started === false || data?.flow?.currTask))
            );
          },
          reaction:
            typeof editType === "object" ? editType.reaction : undefined,
          saveApi: save(formModel?.entityType || "", editModelType), // save方法需要返回和model一致的数据
        },
        {
          title: "删除",
          disabledHide: true,
          actionType: "api",
          disabled: activeKey !== "flow_byMe",
          usableMatch: (datas: TableBean[]) => {
            return datas.every((data) => {
              return (
                data.status === "1" &&
                data?.flow?.started === false &&
                data?.flow?.ended === false
              );
            });
          },
          icon: <i className="  icon-remove_circle_outline1" />,
          multiple: true,
          permissionCode: formModel?.entityType + ":remove",
          saveApi: (datas: IdBean[]): Promise<Result<any>> => {
            return rm(datas.map((d) => d.id));
          },
        },
        {
          actionType: "flow",
          title: "通过",
          icon: <i className=" text-base icon-ok" />,
          multiple: false,
          model: formModel?.type,
          usableMatch: (d: T) => {
            return d?.flow?.currTask && d.flow.nodeType === "approver";
          },
          comment: true,
          disabledHide: true,
          saveApi: (data: any) => {
            completeTask({
              comment: data.comment,
              businessKey: data.id,
              defineKey: formModel?.type,
              formData: data,
            });
            return data;
          },
        },
        {
          actionType: "flow",
          title: "提交", //保存数据并且当流程流转到下一个节点
          disabled: !formModel?.flowJson,
          icon: <i className="  icon-upload1" />,
          multiple: false,
          // comment: true,
          model: formModel?.type,
          usableMatch: (d: T) => {
            return (
              d?.flow?.started === false || //开始任务节点
              (d?.flow?.currTask &&
                d?.flow?.ended === false &&
                (d.flow?.nodeType === "audit" || d.flow.nodeId === "start")) //办理节点
            );
          },
          disabledHide: true,
          saveApi: (data: any) => {
            return save(formModel?.entityType || "")(data).then(
              (d: Result<any>) => {
                if (data?.flow?.started === false) {
                  return startFlow({
                    businessKey: d.data.id,
                    defineKey: formModel?.type,
                    formData: data,
                    description: "发起流程",
                  }).then((res) => {
                    if (res.data === false) {
                      alert("不能操作当前流程");
                    }
                    return d;
                  });
                } else {
                  return completeTask({
                    comment: data.comment,
                    businessKey: data.id,
                    defineKey: formModel?.type,
                    formData: data,
                    description: "提交处理",
                  }).then((res) => {
                    if (res.data === false) {
                      alert("不能操作当前流程");
                    }
                    return d;
                  });
                }
              }
            );
          },
        },
        {
          actionType: "flow",
          title: "回退",
          icon: <i className=" text-base icon-reply" />,
          model: formModel?.type,
          usableMatch: (d: T) => {
            return (
              d?.flow?.auditInfo?.rollback === true &&
              d?.flow?.started === true &&
              d?.flow?.ended === false &&
              d.flow.currTask
            );
          },
          comment: true,
          saveApi: (data: any) => {
            backProcess({
              comment: data.comment,
              businessKey: data.id,
              defineKey: formModel?.type,
            }).then((res) => {
              if (res.data === false) {
                alert("不能操作当前流程");
              }
            });
            return data;
          },
        },
        {
          actionType: "flow",
          title: "转交",
          icon: <i className=" text-base icon-reply" />,
          model: formModel?.type,
          usableMatch: (d: T) => {
            return (
              d?.flow?.auditInfo?.transfer === true &&
              d?.flow?.started === true &&
              d?.flow?.ended === false &&
              d.flow.currTask
            );
          },
          comment: true,
          saveApi: (data: any) => {
            return data;
          },
        },
        {
          actionType: "flow",
          title: "撤回",
          icon: <i className=" text-base icon-reply" />,
          model: formModel?.type,
          usableMatch: (d: T) => {
            return d.flow?.recallable === true;
          },
          comment: true,
          saveApi: (data: any) => {
            recall({
              comment: data.comment,
              businessKey: data.id,
              defineKey: formModel?.type,
            }).then((res) => {
              if (res.data) {
                alert(res.data);
              }
            });
            return data;
          },
        },
        {
          actionType: "flow",
          title: "拒绝",
          icon: <i className=" text-base icon-cancel" />,
          model: formModel?.type,
          comment: true,
          usableMatch: (d: T) => {
            return (
              d?.flow?.auditInfo?.rejected === true &&
              d?.flow?.started === true &&
              d?.flow?.ended === false &&
              d.flow.currTask
            );
          },
          saveApi: (data: any) => {
            cancelProcess({
              comment: data.comment,
              businessKey: data.id,
              defineKey: formModel?.type,
            }).then((res) => {
              if (res.data === false) {
                alert("不能操作当前流程");
              }
            });
            return data;
          },
        },
      ];
    } else {
      return [];
    }
  }, [formModel, activeKey]);

  /*页面所有按钮(查找工作流加入进来) */
  const totalBtns = useMemo((): VFBtn[] => {
    const buttons = formModel?.flowJson
      ? [...flowBtns]
      : btns
      ? btns
      : otherBtns
      ? [...defbtn, ...otherBtns]
      : [...defbtn];

    return tableModel
      ? buttons.map((b) =>
          addMissingButtonAttributes(b, tableModel?.entityType)
        )
      : [];
  }, [
    btns,
    defbtn,
    tableModel,
    JSON.stringify(formModel),
    query,
    JSON.stringify(reqParams),
    flowBtns,
    otherBtns,
  ]);

  const getFkObj = async (tableData: T[], tableModel: FormVo): Promise<any> => {
    let fkObj: any = {};
    const fkField = tableModel?.fields.filter((f: FormFieldVo) => {
      return (
        (f.listHide === undefined ||
          f.listHide === null ||
          f.listHide === false) &&
        f.entityFieldName === "id" &&
        tableModel?.entityType !== f.entityType
      );
    });
    return Promise.all(
      fkField.map((f) => {
        const ids: string[] =
          tableData
            .map((d: any) => d[f.fieldName] as string)
            .filter((f) => f !== undefined && f !== "" && f !== null) || [];
        if (ids.length > 0) {
          const d = async () =>
            await find(f.entityType, "id", ids).then((data) => {
              getFormInfo({ type: f.entityType }).then((e) => {
                const itemName = e?.itemName;
                const itemFields: string[] =
                  itemName?.match(/[a-zA-Z]+/g) || [];

                if (itemName && itemFields.length > 0) {
                  data.data?.forEach((e: any) => {
                    let fkvalue = itemName;
                    itemFields.forEach((itemField) => {
                      fkvalue = fkvalue.replaceAll(
                        itemField,
                        e[itemField] || itemField
                      );
                    });
                    fkObj[e.id] = fkvalue;
                  });
                } else {
                  data.data?.forEach((e: any) => {
                    fkObj[e.id] = e.name || e.title || e.no;
                  });
                }
              });
              return fkObj;
            });
          return d();
        }
      })
    ).then((r) => {
      return fkObj;
    });
  };

  const getParentObj = async (
    tableData: T[],
    tableModel: FormVo
  ): Promise<any> => {
    const parentObj: any = {};
    if (
      tableModel &&
      tableModel.fields.filter(
        (f) => f.fieldName === "pcode" || f.fieldName === "code"
      ).length > 0
    ) {
      const codes: string[] =
        tableData
          ?.map((d: any) => d["pcode"] as string)
          .filter((f) => f !== undefined && f !== "" && f !== null) || [];

      if (codes.length > 0) {
        await find(tableModel?.entityType, "code", codes).then((data) => {
          data.data?.forEach((e: any) => {
            parentObj[e.code] = e.name;
          });
        });
      }
    }
    return parentObj;
  };

  const formModal = useNiceModal("formModal");
  /**
   * 设置外键，设置上级名称
   */
  useEffect(() => {
    if (tableModel && (dataSource || pageData)) {
      const dd = dataSource || pageData?.result;
      const relation = async (data: any[]) => {
        const fkObj: any = await getFkObj(data, tableModel);
        const parentObj: any = await getParentObj(data, tableModel);
        setRealationMap({ fkObj, parentObj });
      };
      if (dd && dd.length > 0) {
        relation(dd);
      }
    }
  }, [pageData, tableModel, dataSource]);

  return tableModel && apiError === undefined ? (
    <div
      ref={ref}
      className={`${className} relative h-full flex flex-col text-sm  `}
    >
      {/* {JSON.stringify(tableData?.[0])} */}
      <div
        className={`flex bg-white items-center p-2 border-gray-100  justify-start  `}
      >
        {/* 1. tableToolBar列表工具栏 */}
        <BtnToolBar<T>
          className={` ${classNames({
            hidden: mode !== "normal",
          })}`}
          // model={tableModel.entityType}
          key={"tableBtn"}
          btns={totalBtns}
          position="tableToolbar"
          datas={selected}
          {...props}
        />
        {/* 搜索 */}
        {tableModel?.fields?.filter((f) => f.listSearch).length > 0 && (
          <VfSearch
            className=" flex ml-2"
            tooltip={`根据${tableModel.fields
              .filter((f) => f.listSearch)
              .map((f) => `[${f.title}]`)}进行查询`}
            onDataChange={(v) => {
              if (v && v !== "") {
                const searchWhere = tableModel.fields
                  .filter((f) => f.listSearch)
                  .map((f) => {
                    return {
                      fieldName: f.fieldName,
                      opt: OptEnum.like,
                      value: [v],
                    };
                  });
                setCondition({ orAnd: "or", where: searchWhere });
              } else {
                setCondition(undefined);
              }
            }}
          />
        )}
        {/* 已设置的查询排序tag*/}
        <TagFilter
          className=" flex items-center ml-2 mb-1"
          formVo={tableModel}
          onOrderRemove={(newOrder: orderObj[]) => {
            setOrder(newOrder);
          }}
          order={order || []}
          where={searchAndColumnCondition?.where || []}
          onConditionRemove={(fieldId: string) => {
            setColumnWheres(columnWheres.filter((c) => c.fieldId !== fieldId));
          }}
        />
      </div>
      <Table<T>
        className={"flex justify-center flex-grow"}
        key={tableModel.type + pageSize + pager?.page}
        model={tableModel} //设计模式时应用实时传入的formVo
        dataSource={tableData}
        selected={selected}
        btns={mode === "view" ? [] : totalBtns}
        outSelectedColumn={outSelectedColumn}
        onSelected={(data: T[]) => {
          setSelected(data);
        }}
        flowFormType={formModel?.flowJson ? formModel.type : undefined}
        // onLineClick={(data: T) => {
        //   alert(JSON.stringify(data));
        // }}
        onLineClick={(record) => {
          formModal.show({
            modelInfo: formModel,
            type: editModelType,
            formData: record,
            btns: mode === "view" ? [] : totalBtns,
          });
        }}
        read={read}
        wheres={columnWheres}
        onColumnFilter={setColumnWheres}
        pagination={mode === "view" ? pagination : false}
        select_more={true}
        fkMap={{ ...relationMap?.fkObj }}
        parentMap={relationMap?.parentObj}
        onColumnSort={(orderObj: orderObj) => {
          let newOrder = order?.map((o) => {
            if (o.fieldName === orderObj.fieldName) {
              return orderObj;
            }
            return o;
          });
          if (JSON.stringify(newOrder) === JSON.stringify(order)) {
            newOrder = [...(order || []), orderObj];
          }
          setOrder(newOrder);
        }}
        width={width || size?.width}
        height={tableHight}
        {...props}
      />
      {/*6 分页器 */}
      {mode === "normal" && (
        <div className=" z-30  absolute bottom-0 w-full font-bold  flex h-12 bg-white  border-t justify-between border-gray-100">
          <div className="flex items-center">
            <div className=" text-gray-500 pl-4 ">共{pageData?.total}条</div>
            <Pagination {...pagination} />
          </div>
          <div className="text-gray-500 space-x-2 justify-end items-center pr-4 flex ">
            每页
            {[10, 15, 20].map((num) => {
              return (
                <span
                  key={num}
                  onClick={() => {
                    setPageSize(num);
                  }}
                  className={` ml-1 border  rounded hover:bg-slate-200 hover:cursor-pointer p-1 ${classNames(
                    {
                      " bg-slate-100 text-blue-500 font-bold":
                        num === pager.size,
                      " font-normal": num !== pager.size,
                    }
                  )}`}
                >
                  {num}
                </span>
              );
            })}
            &nbsp;条记录
          </div>
        </div>
      )}
      {model === undefined && user?.superUser === true && (
        <div
          onClick={() => {
            navigate(`/sysConf/tableDesign/${listType}`);
          }}
          className="absolute z-50 top-4  right-2 font-bold text-gray-500 hover:text-blue-500 cursor-pointer"
        >
          <Tooltip content="列表配置">
            <IconSetting />
          </Tooltip>
        </div>
      )}
    </div>
  ) : (
    <Empty
      className="flex justify-center items-center"
      image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
      title={`${tableModel ? "接口地址不存在" : "模型名称错误"}`}
      description={`${
        tableModel
          ? `没有为${listType}列表模型提供分页查询接口${apiError?.url}`
          : `${listType}模型无法解析，请检查名称`
      }`}
    />
  );
};
export default TablePage;
