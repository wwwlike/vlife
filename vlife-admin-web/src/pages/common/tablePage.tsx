import Table from "@src/components/table";
import { useAuth } from "@src/context/auth-context";
import { IdBean, PageQuery, PageVo, Result } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { find, useDetail, useRemove, useSave } from "@src/api/base/baseService";
import { useNiceModal } from "@src/store";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormFieldVo } from "@src/api/FormField";
import { IconDeleteStroked, IconPlusStroked } from "@douyinfe/semi-icons";
import apiClient from "@src/api/base/apiClient";
import CheckModel from "@src/pages/sysConf/model/checkModel";
import { BtnType, RecordNum, VfButton } from "@src/dsl/schema/button";
import TableToolbar from "@src/components/table/component/TableToolbar";
import { Form, GeneralField } from "@formily/core";
const defaultPageSize = import.meta.env.VITE_APP_PAGESIZE;
const mode = import.meta.env.VITE_APP_MODE;

type PageFuncType<T extends IdBean> = <L extends PageQuery>(
  req: any
) => Promise<Result<PageVo<T>>>;

export interface TablePageProps<T extends IdBean> {
  className: string;
  // check: { [key: string]: () => void };
  entityType: string; //实体模块
  listType: string; //list模型名称
  editType: string; //编辑模型
  formVo: FormVo; //模型信息(主动传入)
  req: any; //查询条件obj
  column?: string[]; // 手工传入要显示的列,配置设置的无效
  pageSize: number; //分页数量
  loadData: PageFuncType<T>; //异步加载数据的地址，
  tableBtn: VfButton<T>[]; //表按钮
  lineBtn: VfButton<T>[]; //行按钮
  btnHide: true | BtnType[]; //隐藏的按钮
  design: true | undefined; //true则是设计器模式
  dataSource: T[]; //table数据
  select_more: boolean; // undefined|false|true ->无勾选框|单选|多选
  selected: T[]; //进入之前选中的数据信息
  select_show_field: string; //选中时进行展示的字段，不传则不展示
  ignores?: string[]; //忽略不展示的字段
  onLineClick: (obj: T) => void; //行点击事件(未启用)
  onSelected: (selecteds: T[]) => void; //选中回调
  onGetData: (datas: T[]) => void; //列表数据加载完成事件,把数据传出去
  onFormModel: (formVo: FormVo) => void; //请求到模型信息，数据传出
  onHttpError: (error: {
    code: number;
    msg: string;
    url: string;
    method: string;
  }) => void; //异常信息传出，设计阶段时接口没有会用到

  /**
   * 生命周期函数
   */
  //列表做了post数据提交后的回调函数
  onAfterSave: (key: string, data: any) => void; //数据保存后的回调事件

  /*表单需要的组件属性*/
  /**
   * 表单字段校验
   */
  validate?: {
    //指定[key]字段的校验函数;校验函数： (val字段值：formData:整个表单数据)=>
    [key: string]: (val: any, formData: object) => string | Promise<any> | void;
  };
  filterProps?: {
    [fieldName: string]: {
      [propName: string]: (datas: any, form: FormVo, formData: any) => any;
    };
  };
  //整个表单的被动级联
  formEvents?: {
    [fieldName: string]: (
      field: GeneralField,
      form: Form,
      model: FormVo
    ) => void;
  };
  dataComputer?: { funs: (data: any) => any; watchFields?: string[] };
  read: boolean; //是否预览模式
  children?: any;
}
const TablePage = <T extends IdBean>({
  formVo,
  // entityType,
  // listType = entityType,
  // editType = listType, //list如果是vo则不能编辑
  entityType,
  editType = entityType,
  listType = editType,
  req,
  dataSource,
  pageSize,
  loadData,
  lineBtn,
  tableBtn,
  btnHide,
  onGetData,
  onFormModel,
  onHttpError,
  onAfterSave,
  children,
  ...props
}: Partial<TablePageProps<T>> & { entityType: string }) => {
  //加载弹出表单modal
  const formModal = useNiceModal("formModal");
  // 弹出提醒modal
  const confirmModal = useNiceModal("confirmModal");
  const { user, getFormInfo } = useAuth();
  //查询函数
  const [pageFunc, setPageFunc] = useState<PageFuncType<T> | undefined>(
    loadData ? () => loadData : undefined
  );
  //模型数据
  const [tableModel, setTableModel] = useState<FormVo | undefined>(formVo);
  const [selected, setSelected] = useState<T[]>();
  //列表数据
  const [tableData, setTableData] = useState<PageVo<T>>();
  //当前页数
  const [pager, setPager] = useState<{ size: number; page: number }>();

  //翻页参数初始化
  useEffect(() => {
    if (
      tableModel !== undefined &&
      tableModel !== null &&
      pager === undefined
    ) {
      setPager({
        size: pageSize
          ? pageSize
          : tableModel.pageSize
          ? tableModel.pageSize
          : defaultPageSize,
        page: 1,
      });
    }
  }, [pageSize, tableModel]);

  const page = useCallback(
    (refesh?: true | undefined) => {
      if (pageFunc && (dataSource === undefined || refesh === true)) {
        const filterObj = { ...req, pager: pager };
        pageFunc(filterObj)
          .then((data: Result<PageVo<T>>) => {
            setTableData(data.data);
            if (onGetData) {
              onGetData(data.data?.result || []);
            }
          })
          .catch((data) => {
            if (onHttpError) {
              onHttpError(data);
            } else {
              console.error("table error " + data.code + data.msg);
            }
          });
      }
    },
    [pageFunc, JSON.stringify(req), JSON.stringify(pager), dataSource]
  );

  /**
   * 监听的内容有变化则加载数据
   */
  useEffect(() => {
    if (pageFunc && pager) {
      page();
    }
  }, [pageFunc, JSON.stringify(req), JSON.stringify(pager)]);

  const defaultFunc = (listFormModel: FormVo): PageFuncType<T> => {
    const { type, entityType } = listFormModel;
    return (params: PageQuery): Promise<Result<PageVo<T>>> => {
      return apiClient.get(
        `/${entityType}/page${entityType !== type ? "/" + type : ""}`,
        { params }
      );
    }; //空则使用该默认值
  };

  //执行一次加载模型信息
  useEffect(() => {
    const func = async (api: string) => {
      try {
        const ts: any = await import(api.split(":")[0]);
        if (api.split(":").length === 1 || api.split(":")[1] in ts) {
          setPageFunc(() => {
            return ts[api.split(":")[1]];
          });
        } else {
          throw api + "接口配置不正确";
        }
      } catch (e) {
        alert(e);
      }
    };

    if (tableModel === undefined) {
      getFormInfo({ entityType, type: listType, design: props.design }).then(
        (f: FormVo | undefined) => {
          setTableModel(f);
          if (onFormModel && f) {
            onFormModel(f);
          }
          //数据提取函数加载
          if (pageFunc === undefined) {
            if (f) {
              if (f.listApiPath) {
                func(f.listApiPath);
              } else {
                if (f) {
                  setPageFunc(() => defaultFunc(f));
                }
              }
            }
          }
          return f;
        }
      );
    } else if (pageFunc === undefined && tableModel) {
      if (tableModel.listApiPath) {
        func(tableModel.listApiPath);
      } else {
        setPageFunc(() => defaultFunc(tableModel));
      }
    }
  }, [listType]);

  /**
   * 分页数据
   */
  const pagination = useMemo(() => {
    if (tableData?.total && pager) {
      return {
        pagination: {
          // formatPageText: props.select_more !== undefined,
          currentPage: tableData.page,
          pageSize: pager?.size,
          total: tableData.total,
          onPageChange: (page: number) => {
            setPager({ ...pager, page });
          },
        },
      };
    }
    return {};
  }, [tableData]);

  //数据明细
  const { runAsync: getDetail } = useDetail({
    entityType,
  });
  //数据保存的方法
  const { runAsync: baseSave } = useSave({});
  //数据删除方法
  const { runAsync: rm } = useRemove({ entityType });

  /**
   * 通用保存方法调用
   */
  const save = useCallback((entityType: string, type?: string) => {
    return (data: any): Promise<any> => baseSave(data, entityType, type);
  }, []);

  const apiFunc = useCallback((func: (data: any) => Promise<Result<any>>) => {
    return (data: any): Promise<any> => func(data);
  }, []);

  /**
   *
   * @param btn 模型的按钮点击事件
   * @param index 行号 ，-1 标识全局table按钮点击
   * @param record 当前操作的数据
   */
  const modalShow = useCallback(
    (btn: VfButton<T>, index: number, ...record: T[]) => {
      // alert(btn?.modal?.type);
      if (
        btn?.model?.type !== listType &&
        record &&
        record.length > 0 &&
        record[0].id
      ) {
        getDetail(record[0].id, btn?.model?.type).then((data: Result<any>) => {
          formModal
            .show({
              ...btn.model, //配置
              formData: data.data, //数据
              saveFun: btn.model?.formApi,
              validate: props.validate, //自定义校验
              filterProps: props.filterProps, //数据过滤加工
              formEvents: props.formEvents,
              dataComputer: props.dataComputer, //数据计算
            })
            .then((saveData) => {
              if (onAfterSave) {
                onAfterSave(btn.key, saveData);
              }
              page(true); //
            });
        });
      } else {
        formModal
          .show({
            ...btn.model, //配置
            formData: record ? record[0] : undefined, //undefined 新增
            validate: props.validate, //自定义校验
            filterProps: props.filterProps, //数据过滤加工
            formEvents: props.formEvents, //手工加入级联处理
            dataComputer: props.dataComputer, //数据计算
            saveFun: btn.model?.formApi,
          })
          .then((saveData) => {
            if (onAfterSave) {
              onAfterSave(btn.key, saveData);
            }
            page(true); //
          });
      }
    },
    [formModal, page, pageFunc, JSON.stringify(req), pager]
  );

  /**
   * 非表单的操作，提取ID给到接口
   */
  const confirmShow = useCallback(
    (btn: VfButton<T>, index: number, ...record: T[]) => {
      if (pageFunc) {
        confirmModal
          .show({
            saveFun: () => {
              const ids: string[] = record.map((r) => r.id);
              return btn.tableApi && btn.tableApi(...ids);
            },
            title: `确认${btn.title}${record.length}条记录`,
          })
          .then((data: any) => {
            if (data.code === 200) {
              page(true);
              if (onAfterSave) {
                onAfterSave(btn.key, data);
              }
              // setSelected([]);
            } else {
              alert(data.msg);
            }
          });
      }
    },
    [confirmModal, pageFunc, JSON.stringify(pager), page]
  );

  //计算资源权限code
  const resourceKey = ({
    entityType,
    action,
    type,
  }: {
    entityType: string; //模块
    type?: string; //模型
    action: string; //操作
  }): string => {
    const code: string =
      entityType +
      (":" + action) +
      (entityType === type ? "" : type ? ":" + type : "");
    return code;
  };

  /**
   * 根据行数据校验按钮的可操作属性记录
   */
  const checkUser = useCallback(
    (...records: any[]): boolean => {
      const checkResult =
        records && records.length > 0
          ? records.filter(
              (record: any) => {
                return (
                  "createId" in record &&
                  (record.createId === null || record.createId === user?.id)
                );
                // record?.createId === user?.id || record?.modifyId === user?.id
              } //2个字段等于当前用户id
            ).length === records.length
          : true;

      return checkResult;
    },
    [user?.id]
  );

  /**
   * 全局按钮组装
   */
  const tableBtnMemo = useMemo((): VfButton<T>[] => {
    const memoBtns: VfButton<T>[] = [];
    const addDefBtn: VfButton<T> = {
      title: "新增",
      icon: <IconPlusStroked />,
      key: "save",
      code: resourceKey({ entityType, type: editType, action: "save" }),
      model: {
        entityType,
        type: editType,
        formApi: save(entityType, editType),
      }, //操作的模型
      click: (btn) => modalShow(btn, -1), //点击触发的事件
    };
    const batchRmBtn: VfButton<T> = {
      title: "删除",
      key: "remove",
      icon: <IconDeleteStroked />,
      code: resourceKey({ entityType, action: "remove" }),
      enable_recordNum: RecordNum.MORE,
      click: confirmShow,
      tableApi: (...ids: string[]) => {
        return rm(ids);
      },
      statusCheckFunc: (...record: T[]) => {
        if (record.filter((r) => checkUser(r)).length !== record.length) {
          return "无权删除他人创建的数据";
        }
        if (
          record.filter((r) =>
            "sys" in r && (r as any).sys === true ? true : false
          ).length > 0
        ) {
          return "系统数据不能删除";
        }

        // record.forEach((r) => {
        //   if (!checkUser(r)) {
        //     return "无权删除他人创建的数据";
        //   }
        //   if ("sys" in r && (r as any).sys === true) {
        //     return "系统数据不能删除";
        //   }
        // });
      },
    };
    if (btnHide !== true) {
      if (!btnHide?.includes(BtnType.ADD)) {
        memoBtns.push(addDefBtn);
      }
      if (!btnHide?.includes(BtnType.RM)) {
        memoBtns.push(batchRmBtn);
      }
    }
    //自定义按钮
    if (tableBtn) {
      tableBtn.forEach((customBtn) => {
        if (customBtn.model) {
          customBtn.click = modalShow;
          customBtn.model.formApi = save(
            customBtn.model.entityType,
            customBtn.model.type
          );
        } else if (customBtn.tableApi) {
          customBtn.click = confirmShow;
        }
        memoBtns.push(customBtn);
      });
    }
    return memoBtns;
  }, [
    tableBtn,
    btnHide,
    pageFunc,
    formModal,
    confirmModal,
    req,
    JSON.stringify(pager),
  ]);

  /**
   * 列表行按钮组装
   */
  const lineBtnMemo = useMemo((): VfButton<T>[] => {
    if (tableModel) {
      const { entityType, type } = tableModel;
      const memoBtns: VfButton<T>[] = [];
      const rmDefBtn: VfButton<T> = {
        key: "remove",
        title: "删除",
        code: resourceKey({ entityType, action: "remove" }),
        click: confirmShow,
        tableApi: (...ids: string[]) => {
          return rm(ids);
        },
        statusCheckFunc: (record: T) => {
          if (checkUser(record) === false) {
            return "无权删除他人创建的数据";
          }
          if ("sys" in record && (record as any).sys === true) {
            return "系统数据不能删除";
          }
        },
      };
      if (editType) {
        const editDefBtn: VfButton<T> = {
          title: "修改",
          key: "save",
          code: resourceKey({
            entityType: entityType,
            type: editType,
            action: "save",
          }),
          model: {
            entityType,
            type: editType,
            formApi: save(entityType, editType),
          },
          click: modalShow,
          statusCheckFunc: (record: T) => {
            if (checkUser(record) === false) {
              return "无权修改他人创建的数据";
            }
            if ("sys" in record && (record as any).sys === true) {
              return "系统数据不能修改";
            }
          },
        };
        const detailDefBtn: VfButton<T> = {
          title: "查看",
          key: "view",
          model: { entityType, type: editType, readPretty: true },
          click: modalShow,
        };

        if (btnHide !== true && !btnHide?.includes(BtnType.EDIT) && editType) {
          memoBtns.push(editDefBtn);
        }
        if (btnHide !== true && !btnHide?.includes(BtnType.VIEW)) {
          memoBtns.push(detailDefBtn);
        }
      }

      if (btnHide !== true) {
        if (!btnHide?.includes(BtnType.RM)) {
          memoBtns.push(rmDefBtn);
        }
      }
      //自定义按钮
      if (lineBtn) {
        lineBtn.forEach((customBtn) => {
          if (customBtn.model) {
            customBtn.click = modalShow;
            customBtn.model.formApi = save(
              customBtn.model.entityType,
              customBtn.model.type
            );
          } else if (customBtn.tableApi) {
            customBtn.click = confirmShow;
          }
          memoBtns.push(customBtn);
        });
      }
      return memoBtns;
    }
    return [];
  }, [lineBtn, btnHide, formModal, tableModel, pager]);

  //关联数据对象，在本页一次查询到
  const [relationMap, setRealationMap] = useState<{
    fkObj: any; //外键对象信息
    parentObj: any; //父级对象信息
  }>();

  const getFkObj = async (tableData: T[], tableModel: FormVo): Promise<any> => {
    let fkObj: any = {};
    const fkField = tableModel?.fields.filter((f: FormFieldVo) => {
      return (
        (f.x_hidden === undefined || f.x_hidden === false) &&
        f.entityFieldName === "id" &&
        entityType !== f.entityType
      );
    });
    return Promise.all(
      fkField.map((f) => {
        const ids: string[] =
          tableData.map((d: any) => d[f.fieldName] as string) || [];
        if (ids.length > 0) {
          const d = async () =>
            await find(f.entityType, "id", ids).then((data) => {
              data.data?.forEach((e: any) => {
                fkObj[e.id] = e.name || e.title;
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
      ).length === 2
    ) {
      const codes: string[] =
        tableData?.map((d: any) => d["pcode"] as string) || [];
      if (codes.length > 0) {
        await find(entityType, "code", codes).then((data) => {
          data.data?.forEach((e: any) => {
            parentObj[e.code] = e.name;
          });
        });
      }
    }
    return parentObj;
  };

  /**
   * 设置外键，设置上级名称
   */
  useEffect(() => {
    if (tableModel) {
      const dd = tableData?.result || dataSource;
      const relation = async (data: any[]) => {
        const fkObj: any = await getFkObj(data, tableModel);
        const parentObj: any = await getParentObj(data, tableModel);
        setRealationMap({ fkObj, parentObj });
      };
      if (dd) {
        relation(dd);
      }
    }
  }, [tableData, tableModel, dataSource]);

  // console.log("555555");

  const table = useMemo(() => {
    if (tableModel) {
      return (
        <div>
          {/* table按钮 */}
          <TableToolbar<T>
            tableModel={tableModel}
            tableBtn={tableBtnMemo}
            selectedRow={selected || []}
          />
          <Table<T>
            key={tableModel.type + pageSize + pager?.page}
            model={tableModel}
            dataSource={dataSource ? dataSource : tableData?.result}
            lineBtn={lineBtnMemo}
            // selected={selected}
            onSelected={(data: T[]) => {
              setSelected(data);
            }}
            fkMap={{ ...relationMap?.fkObj }}
            parentMap={relationMap?.parentObj}
            {...pagination}
            {...props}
          />
        </div>
      );
    } else {
      return <>模型无法解析，请检查名称是否准确</>;
    }
  }, [
    JSON.stringify(pager),
    tableModel,
    tableData,
    lineBtnMemo,
    tableBtnMemo,
    relationMap,
    selected,
  ]);
  // console.log("1");
  return (
    <>
      {mode === "pro" ? (
        <>{table}</>
      ) : (
        <>
          <CheckModel
            modelName={[entityType, listType, editType]}
            buttons={lineBtn}
          >
            {table}
          </CheckModel>
        </>
      )}
    </>
  );
};

export default TablePage;
