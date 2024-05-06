import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { save, list, ReportCondition, remove } from "@src/api/ReportCondition";
import Button from "@src/components/button";
import { VF } from "@src/dsl/VF";
import { TableTab } from "./tablePage";
import classNames from "classnames";
import { objToConditionWhere, OptEnum, where } from "@src/dsl/base";
import { loadApi } from "@src/resources/ApiDatas";
import { SysDict } from "@src/api/SysDict";

//激活页签
export interface ActiveTab {
  level1: string; //首层
  level2?: string; //第二层
}
export interface TableTabProps {
  activeKey?: ActiveTab; //场景页签
  tabList?: TableTab[]; //tab分组的条件对象
  tabDictField?: string; //是字典类型的字段，根据该字段的字典进行tab页签展示
  formModel?: FormVo; //表单模型
  tableModel: FormVo; //列表模型
  tabCount?: { [tabKey: string]: number }; //tab页签数量
  createAble?: boolean; //是否可新增
  onActiveChange: (activeKey: { level1: string; level2?: string }) => void; //切换页签
  onTabReq: (req: any) => void; // 请求数据
  onCountReq?: (countReq: { [tabKey: string]: any }) => void; // 需要请求数量的页签查询条件
}

export default (props: TableTabProps) => {
  const {
    tabList,
    tabDictField,
    createAble,
    formModel,
    tableModel,
    activeKey,
    onActiveChange,
    onCountReq,
    tabCount,
    onTabReq,
  } = props;

  const [_activeKey, setActiveKey] = useState<ActiveTab | undefined>(activeKey);

  useEffect(() => {
    if (activeKey) setActiveKey(activeKey);
  }, [activeKey?.level1, activeKey?.level2]);

  useEffect(() => {
    if (_activeKey) onActiveChange(_activeKey);
  }, [_activeKey?.level1, _activeKey?.level2]);

  const allTab: TableTab = {
    itemKey: "all",
    icon: <i className=" icon-gallery_view " />,
    tab: tableModel?.name || "全部",
  };
  const [fixedTab, setFixedTab] = useState<TableTab[]>([]); //固定项页签 tab dbList方式+tabDictField方式
  const [dbTab, setDbTab] = useState<TableTab[]>([]); //用户保存的自定义页签
  const [conditions, setConditions] = useState<ReportCondition[]>([]); //数据库查询视图
  //数据库查询视图加载函数
  const loadCondition = useCallback((formId: string) => {
    list({ formId, type: "table" }).then((result) =>
      setConditions(result.data || [])
    );
  }, []);
  //工作流页签
  const flowTab = useMemo((): TableTab[] => {
    if (formModel?.flowJson || tableModel?.flowJson) {
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
              itemKey: "flow_byMe_todo",
              tab: "流程中",
              showCount: true,
              req: { flowTab: "byMe_todo" },
            },
            {
              //待办
              itemKey: "flow_byMe_edit",
              tab: "待完善",
              showCount: true,
              req: { flowTab: "byMe_edit" },
            },
            {
              //
              itemKey: "flow_byMe_finish",
              tab: "已通过",
              showCount: true,
              req: { flowTab: "byMe_finish" },
              singleReq: true,
            },
            {
              itemKey: "flow_byMe_refuse",
              tab: "已拒绝",
              showCount: true,
              req: { flowTab: "byMe_refuse" },
            },
            {
              itemKey: "flow_byMe_draft",
              tab: "草稿",
              showCount: true,
              req: { flowTab: "byMe_draft" },
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
  }, [formModel, tableModel]);
  //视图转换成页签
  useEffect(() => {
    if (conditions && conditions.length > 0) {
      setDbTab([
        ...conditions.map((d) => {
          return {
            tab: d.name,
            itemKey: d.id,
            req: JSON.parse(conditions?.[0]?.conditionJson),
            closable: createAble,
          };
        }),
      ]);
    } else {
      setDbTab([]);
    }
  }, [conditions]);

  //固定页签组装 tablePage手工传值页签组装
  useEffect(() => {
    const tabs: TableTab[] = [];
    // 1 代码object方式传参页签，不分简单对象型过滤方式需要转换成 `and连接的[{fieldName:"xxx"，opt:OptEnum.eq,value:[]}]`
    if (tabList) {
      tabs.push(
        ...tabList.map((tab: TableTab) => {
          if (Array.isArray(tab.req) || tab.req === undefined) {
            return tab; //
          } else {
            return {
              ...tab,
              req: objToConditionWhere(tab.req), //简单对象转成后台能识别的格式
            };
          }
        })
      );
    }
    // 2 dict方式，手工生成opt方式对比数组长度为1的查询条件 [{fieldName:"xxx"，opt:OptEnum.eq,value:[]}]
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

  //页面页签整体组装
  const contentTab = useMemo((): TableTab[] | undefined => {
    const tabs = [
      ...flowTab,
      ...(flowTab.length === 0 ? [allTab] : []),
      ...dbTab,
      ...(flowTab.length === 0 ? fixedTab : []),
      ...(createAble ? [addTab] : []),
    ];
    //一级节点绑定数量
    return tabs.map((t) => {
      return {
        ...t,
        tab:
          t.itemKey !== "add"
            ? t.tab +
              `${
                tabCount?.[t.itemKey] !== undefined
                  ? " (" + tabCount?.[t.itemKey] + ")"
                  : ""
              }`
            : t.tab,
      };
    });
  }, [dbTab, fixedTab, allTab, flowTab, addTab, tabCount]);

  useEffect(() => {
    if (contentTab && activeKey === undefined) {
      setActiveKey({ level1: contentTab[0].itemKey });
    }
  }, [contentTab]);

  //指定页签数据返回(字典/数据库/自定义/flow)
  const reqFunc = useCallback(
    (_activeKey: { level1: string; level2?: string }) => {
      // 1 流程页签，使用obj方式给PageQuery对象flowTab传值
      if (_activeKey?.level1?.startsWith("flow")) {
        if (_activeKey?.level2) {
          //二级tab工作流
          return contentTab
            ?.filter((item) => item.itemKey === _activeKey?.level1)?.[0]
            .subs?.filter((item) => item.itemKey === _activeKey?.level2)?.[0]
            .req;
        } else {
          // 一级tab工作流
          return contentTab?.filter(
            (item) => item.itemKey === _activeKey?.level1
          )?.[0]?.req;
        }
      } else {
        const req = contentTab?.filter(
          (item) => item.itemKey === _activeKey?.level1
        )?.[0]?.req;

        if (Array.isArray(req)) {
          //2 复杂页签，来源queryBuilder设计器，
          if (req[0].where) {
            return {
              conditionGroups: req,
            };
          } else {
            // 3 简单页签 固定的 obj和dict类型页签，产出简单条件，不支持or
            return {
              conditionGroups: [
                {
                  where: req,
                },
              ],
            };
          }
        } else {
          //
          return {};
        }
      }
    },
    [contentTab?.length]
  );

  //数据查询回传  reqFunc, contentTab
  useEffect(() => {
    if (onTabReq !== undefined && _activeKey) {
      onTabReq(reqFunc(_activeKey));
    }
  }, [_activeKey?.level1, _activeKey?.level2, onTabReq, contentTab?.length]);

  //视图tab加载
  useEffect(() => {
    if (tableModel && tableModel.id) {
      loadCondition(tableModel.id);
    }
  }, [tableModel]);

  useEffect(() => {
    if (onCountReq) {
      let countReq: any = {};
      //统计数量页签参数封装(2级页签各自封装)
      contentTab?.forEach((tab) => {
        if (tab.showCount) {
          countReq = {
            // Level1封装
            ...countReq,
            [tab.itemKey]: {
              ...reqFunc({ level1: tab.itemKey }),
            },
          };
        }
        tab?.subs
          ?.filter((sub) => sub.showCount)
          .forEach((sub) => {
            countReq = {
              // Level2封装
              ...countReq,
              [sub.itemKey]: {
                ...reqFunc({ level1: tab.itemKey, level2: sub.itemKey }),
              },
            };
          });
      });
      onCountReq(countReq);
    }
  }, [_activeKey?.level1, _activeKey?.level2, contentTab?.length]);

  return (
    <>
      {/* {JSON.stringify(tabCount)} */}
      {contentTab !== undefined && (
        <div className=" bg-white  pt-1">
          <Tabs
            style={{ height: "37px", paddingLeft: "10px" }}
            type="card"
            activeKey={activeKey?.level1 || contentTab?.[0]?.itemKey} //没有则默认显示全部
            tabList={contentTab}
            onChange={(key) => {
              if (key !== "add") {
                if (contentTab.filter((tab) => tab.itemKey === key)?.[0].subs) {
                  setActiveKey({
                    level1: key,
                    level2: contentTab.filter((tab) => tab.itemKey === key)?.[0]
                      .subs?.[0]?.itemKey,
                  });
                } else {
                  setActiveKey({ level1: key });
                }
              }
            }}
            onTabClose={(targetKey) => {
              remove([targetKey]).then(() => {
                if (tableModel?.id) loadCondition(tableModel.id);
              });
            }}
          />
          {/* 二级页签 */}
          {contentTab?.filter((c) => c.itemKey === activeKey?.level1)?.[0]
            ?.subs && (
            <div className="flex  space-x-1 p-1  bg-gray-50">
              {contentTab
                ?.filter((c) => c.itemKey === activeKey?.level1)?.[0]
                ?.subs?.map((s) => {
                  return (
                    <div
                      className={` text-sm  cursor-pointer    ${classNames({
                        "bg-white border font-bold":
                          activeKey?.level2 === s.itemKey,
                      })} rounded-2xl  py-1 px-4`}
                      key={s.itemKey}
                      onClick={() => {
                        if (activeKey && activeKey?.level1) {
                          setActiveKey({
                            level1: activeKey.level1,
                            level2: s.itemKey,
                          });
                        }
                      }}
                    >
                      {s.tab}
                      {`${
                        tabCount?.[s.itemKey] !== undefined
                          ? " (" + tabCount?.[s.itemKey] + ")"
                          : ""
                      }`}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </>
  );
};
