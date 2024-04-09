import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FormPage from "@src/pages/common/formPage";
import { useNavigate } from "react-router-dom";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { useSize } from "ahooks";
import { VF, VfAction } from "@src/dsl/VF";
import { list, remove, ReportCondition, save } from "@src/api/ReportCondition";
import { Tabs } from "@douyinfe/semi-ui";
import GroupLabel from "@src/components/form/component/GroupLabel";
import { OptEnum, where } from "@src/dsl/base";
import { loadApi } from "@src/resources/ApiDatas";
import { SysDict } from "@src/api/SysDict";
import Button from "@src/components/button";
import { TableBean } from "@src/components/table";
import classNames from "classnames";

//tab页签
type TableTab = {
  itemKey: string; //视图编码(唯一)
  tab: string | ReactNode; //名称
  icon?: ReactNode; //图标
  // active?: boolean; //当前页
  req?: object | { fieldName: string; opt: OptEnum; value?: Object }[]; //视图过滤条件(简单方式)
  subs?: (TableTab & { singleReq?: boolean })[]; //子级过滤页签 singleReq:表示不联合上一级过滤条件
};
/**
 * 查询列表的布局page组件
 * 适用于弹出层
 */
export interface ContentProps<T extends TableBean> extends TablePageProps<T> {
  title: string; //页面标题
  filterType: string | { type: string; reaction: VfAction[] }; //左侧布局查询条件模型以及级联响应的低代码
  tabList: TableTab[]; //tab分组的条件对象
  tabDictField: string; //是字典类型的字段，根据该字段的字典进行tab页签展示
  customView: boolean; //是否支持自定义页签
  onReq?: (req: any) => void; //过滤条件回传
}

/**
 * 对象转condition的where查询语法
 */
const objToConditionWhere = (obj: any): Partial<where>[] => {
  const fieldNames: string[] = Object.keys(obj);
  return fieldNames.map((f) => {
    return {
      fieldName: f,
      opt: OptEnum.eq,
      value: Array.isArray(obj[f]) ? obj[f] : [obj[f]],
    };
  });
};

/**
 * crud 左右布局模版
 */
const Content = <T extends TableBean>({
  title,
  listType,
  editType,
  filterType,
  tabList,
  tabDictField,
  req,
  btns,
  customView = true,
  onReq,
  ...props
}: Partial<ContentProps<T>> & { listType: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const confirmModal = useNiceModal("vlifeModal");
  const [filterFormVo, setFilterFormVo] = useState<FormVo>();
  const [formData, setFormData] = useState<any>({});
  const [tableModel, setTableModel] = useState<FormVo>();
  const [formModel, setFormModel] = useState<FormVo>();
  const [conditions, setConditions] = useState<ReportCondition[]>([]); //数据库查询视图
  const [activeKey, setActiveKey] = useState<string[]>(); //可存2级页签

  //左侧列表根据查询维度隐藏指定字段(如查看本人数据，则不需要部门搜索条件)
  const filterReaction = useMemo((): VfAction[] => {
    if (filterFormVo) {
      // 部门code
      const deptCode = filterFormVo.fields.filter(
        (f) => f.entityType === "sysDept" && f.fieldName === "code"
      )?.[0];
      if (deptCode !== undefined) {
        return [
          VF.result(user?.groupFilterType === "sysUser_1")
            .then("code")
            .hide(),
        ];
      }
    }
    return [];
  }, [filterFormVo]);
  const allTab: TableTab = {
    itemKey: "all",
    icon: <i className=" icon-gallery_view " />,
    tab: "全部",
  };

  const addTab: TableTab = useMemo(() => {
    return {
      tab: (
        <Button
          title={`视图创建`}
          actionType="create"
          btnType="icon"
          icon={<i className="icon-task_add-02 font-bold" />}
          model={"reportCondition"}
          saveApi={save}
          reaction={[
            VF.then("sysMenuId").hide().value(tableModel?.sysMenuId),
            VF.then("formId").hide().value(tableModel?.id),
            VF.then("type").hide().value("table"),
            VF.then("name").title("页签名称"),
          ]}
          onSubmitFinish={() => {
            if (tableModel?.id) loadCondition(tableModel?.id);
          }}
        />
      ),
      itemKey: "add",
    };
  }, [tableModel]);
  //固定项页签 tab abList方式+tabDictField方式
  const [fixedTab, setFixedTab] = useState<TableTab[]>([]);
  //查询视图页签
  const [dbTab, setDbTab] = useState<TableTab[]>([]);
  //工作流页签
  const flowTab = useMemo((): TableTab[] => {
    if (formModel?.flowJson) {
      return [
        {
          itemKey: "flow_todo",
          icon: <i className="icon-checkbox_01" />,
          tab: "待办视图",
          req: { flowTab: "todo" },
        },
        {
          itemKey: "flow_byMe",
          icon: <i className="  icon-workflow_new" />,
          tab: `我发起的`,
          req: { flowTab: "byMe" },
          subs: [
            {
              itemKey: "flow_byMe_1",
              icon: <i className="icon-checkbox_01" />,
              tab: "流程中",
              req: { flowTab: "todo" },
            },
            {
              itemKey: "flow_byMe_4",
              icon: <i className="icon-checkbox_01" />,
              tab: "草稿",
              req: { flowTab: "todo" },
            },
            {
              itemKey: "flow_byMe_2",
              icon: <i className="icon-checkbox_01" />,
              tab: "待完善",
              req: { flowTab: "todo" },
            },
            {
              itemKey: "flow_byMe_3",
              icon: <i className="icon-checkbox_01" />,
              tab: "已通过",
              req: { flowTab: "todo" },
            },
          ],
        },
        {
          itemKey: "flow_done",
          tab: "已办视图",
          icon: <i className=" icon-workflow_ok" />,
          req: { flowTab: "done" },
        },
        {
          itemKey: "flow_notifier",
          icon: <i className="  icon-resend" />,
          tab: "抄送视图",
          req: { flowTab: "notifier" },
        },
      ];
    }
    return [];
  }, [tableModel]);
  //计算后的页面页签
  //页签组装
  const contentTab = useMemo((): TableTab[] | undefined => {
    return [
      ...flowTab,
      ...(flowTab.length === 0 ? [allTab] : []),
      ...dbTab,
      ...(flowTab.length === 0 ? fixedTab : []),
      ...(user?.superUser ? [addTab] : []),
    ];
  }, [dbTab, fixedTab, allTab, flowTab, tableModel, addTab]);

  //固定页签组装
  useEffect(() => {
    const tabs: TableTab[] = [];
    if (tabList) {
      tabs.push(
        ...tabList.map((tab: TableTab) => {
          if (Array.isArray(tab.req) || tab.req === undefined) {
            return tab;
          } else {
            return {
              ...tab,
              req: objToConditionWhere(tab.req),
            };
          }
        })
      );
    }
    const dictcode = tableModel?.fields?.filter(
      (f) => f.fieldName === tabDictField
    )?.[0]?.dictCode;

    if (tabDictField && dictcode) {
      loadApi({
        apiInfoKey: "dictOpenApi",
        match: "dictItem",
        paramObj: { code: dictcode },
      }).then((d) => {
        const dicts: SysDict[] = d;
        tabs.push(
          ...dicts.map((d) => {
            return {
              itemKey: d.id, //视图编码(唯一)
              tab: d.title,
              req: [
                {
                  fieldName: tabDictField,
                  opt: OptEnum.eq,
                  value: [d.val],
                },
              ], //视图过滤条件(简单方式)
            };
          })
        );
        setFixedTab(tabs);
      });
    } else if (tabList) {
      setFixedTab(tabs);
    }
  }, [tabDictField, tableModel, tabList]);

  //数据库查询视图加载
  const loadCondition = useCallback((formId: string) => {
    list({ formId, type: "table" }).then((result) =>
      setConditions(result.data || [])
    );
  }, []);
  useEffect(() => {
    if (tableModel && tableModel.id) {
      loadCondition(tableModel.id);
    }
  }, [tableModel]);

  useEffect(() => {
    if (customView === true) {
      if (conditions && conditions.length > 0) {
        setDbTab([
          ...conditions.map((d) => {
            return {
              tab: d.name,
              itemKey: d.id,
              closable: user?.superUser === true,
            };
          }),
        ]);
      } else {
        setDbTab([]);
      }
    }
  }, [conditions, customView]);

  //查询条件组装
  const tableReq = useMemo(() => {
    let customViewReq: any = contentTab?.filter(
      (item) => item.itemKey === activeKey?.[0]
    )?.[0]?.req;

    const where: Partial<where>[] = [];
    let flowReq = {};
    if (customViewReq) {
      if (activeKey?.[0]?.startsWith("flow")) {
        flowReq = customViewReq;
      } else {
        where.push(...customViewReq);
      }
    }
    if (req) {
      where.push(...objToConditionWhere(req));
    }
    return {
      ...formData,
      ...flowReq,
      conditionGroups: [{ where }],
    };
  }, [req, formData, contentTab, activeKey]);

  // const windowWidth = useSize(document.querySelector("body"))?.width;

  const ref = useRef(null);
  const size = useSize(ref);

  const [filterOpen, setFilterOpen] = useState(filterType ? true : false);
  //动态计算table区块宽度
  const tableWidth = useMemo((): number => {
    let width = size?.width || 0;
    if (filterOpen === true) {
      width = width - 280;
    } else {
      width = width - 0;
    }
    return width;
  }, [size, filterOpen]);

  return (
    <div ref={ref} className="flex relative">
      {filterType && (
        <>
          <div
            style={{ width: 280 }}
            className={`${
              filterOpen ? "p-3" : ""
            }   border-r flex border-gray-100 relative  flex-col  overflow-hidden bg-white transition-width duration-200`}
          >
            <GroupLabel text={`${tableModel?.name}查询`} className="mb-6" />
            <FormPage
              key={`filter${filterType}`}
              reaction={
                typeof filterType === "string"
                  ? filterReaction
                  : [...filterReaction, ...filterType.reaction]
              }
              formData={req}
              onDataChange={(data) => {
                setFormData({ ...data });
                onReq?.(data);
              }}
              onVfForm={(v) => {
                setFilterFormVo(v);
              }}
              type={
                typeof filterType === "string" ? filterType : filterType.type
              }
            />
          </div>
          <i
            style={{ fontSize: "25px" }}
            onClick={() => {
              setFilterOpen(!filterOpen);
            }}
            className={` text-gray-400  entryIcon icon ${
              filterOpen ? "icon-sideslip_left left-64 " : "icon-sideslip_right"
            } z-40 top-1/2 cursor-pointer absolute  `}
          />
        </>
      )}
      <div
        className={` flex flex-1 flex-col relative rounded-md ${
          filterOpen ? "pl-1" : ""
        } `}
      >
        {contentTab !== undefined && (
          <div className=" bg-white  pt-1">
            <Tabs
              style={{ height: "36px", paddingLeft: "10px" }}
              type="card"
              activeKey={activeKey?.[0] || contentTab?.[0]?.itemKey} //没有则默认显示全部
              tabList={contentTab}
              onChange={(key) => {
                if (key !== "add") {
                  setActiveKey([key]);
                }
              }}
              onTabClose={(targetKey) => {
                remove([targetKey]).then(() => {
                  if (tableModel?.id) loadCondition(tableModel.id);
                });
              }}
            />
          </div>
        )}

        {/* {JSON.stringify(tableModel)} */}
        {/* 二级页签 */}
        {contentTab?.filter((c) => c.itemKey === activeKey?.[0])?.[0]?.subs && (
          <div className="flex  space-x-1 p-1 ">
            {contentTab
              ?.filter((c) => c.itemKey === activeKey?.[0])?.[0]
              ?.subs?.map((s) => {
                return (
                  <div
                    className={` text-sm  cursor-pointer    ${classNames({
                      "bg-white border": activeKey?.[1] === s.itemKey,
                    })} rounded-2xl  py-1 px-4`}
                    key={s.itemKey}
                    onClick={() => {
                      if (activeKey && activeKey?.[0]) {
                        setActiveKey([activeKey?.[0], s.itemKey]);
                      }
                    }}
                  >
                    {s.tab}
                  </div>
                );
              })}
          </div>
        )}

        {/* 列表行 */}
        <TablePage<T>
          className="flex-grow"
          width={tableWidth}
          key={listType}
          activeKey={activeKey?.[0] || contentTab?.[0].itemKey}
          listType={listType}
          editType={editType}
          req={tableReq}
          btns={btns}
          //视图数据过滤
          conditionJson={
            conditions && activeKey
              ? conditions.find((d) => d.id === activeKey?.[0])?.conditionJson
              : undefined
          }
          columnTitle={filterType !== undefined ? "sort" : true}
          onTableModel={setTableModel}
          onFormModel={setFormModel}
          //错误信息回传
          onHttpError={(e) => {
            if (e.code === 4404) {
              confirmModal.show({
                title: `接口错误`,
                children: (
                  <>{`${e.code}无法访问，请配置或者在模块页面手工传入loadData的prop`}</>
                ),
                okFun: () => {
                  navigate(`/conf/design/${listType}/list`);
                },
              });
            }
          }}
          {...props}
        />
      </div>
    </div>
  );
};
export default Content;
