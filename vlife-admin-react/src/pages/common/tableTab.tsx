import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { save, list, ReportCondition, remove } from "@src/api/ReportCondition";
import Button from "@src/components/button";
import { VF } from "@src/dsl/VF";
import { TableTab } from "./tablePage";
import classNames from "classnames";
import { objToConditionWhere, OptEnum } from "@src/dsl/base";
import { loadApi } from "@src/resources/ApiDatas";
import { SysDict } from "@src/api/SysDict";
import { useAuth } from "@src/context/auth-context";

//激活页签
export interface ActiveTab {
  level1: string; //首层
  level2?: string; //第二层
}

export interface TableTabBaseProps {
  activeTab?: ActiveTab; //当前页签场景key
  addTabAble?: boolean; //是否可新增
  allTabAble?: boolean; //是否显示全部页签
  tabList?: TableTab[]; // 1. 前端传过滤条件的预设固定页签
  tabDictField?: string; //2. 传字典编码的预设固定页签
}

export interface TableTabProps extends TableTabBaseProps {
  tableModel: FormVo; //列表模型
  tabCount?: { [tabKey: string]: number }; //tab页签数量
  onActiveChange: (activeKey: { level1: string; level2?: string }) => void; //切换页签
  onTabReq: (req: any) => void; // 页签查询条件传出
  onCountReq?: (countReq: { [tabKey: string]: any }) => void; // 需要请求数量的页签查询条件
}

export default (props: TableTabProps) => {
  const {
    tabList,
    tabDictField,
    addTabAble = false,
    allTabAble = true,
    tableModel,
    activeTab,
    tabCount,
    onActiveChange,
    onCountReq,
    onTabReq,
  } = props;

  const { user } = useAuth();
  const [_activeTab, setActiveTab] = useState<ActiveTab | undefined>(activeTab); //当前页面激活的页签(场景)

  useEffect(() => {
    //外部传入的场景页签
    if (activeTab) setActiveTab(activeTab);
  }, [activeTab?.level1, activeTab?.level2]);

  useEffect(() => {
    //当前选中页签传出
    if (_activeTab) onActiveChange(_activeTab);
  }, [_activeTab?.level1, _activeTab?.level2]);

  const allTab: TableTab = {
    itemKey: "all",
    icon: <i className=" icon-gallery_view " />,
    tab: "全部",
  };
  const [fixedTab, setFixedTab] = useState<TableTab[]>(
    tabList
      ? tabList.map((tab: TableTab) =>
          Array.isArray(tab.req) || tab.req === undefined
            ? tab
            : { ...tab, req: objToConditionWhere(tab.req) }
        )
      : []
  ); // 1.固定项页签 -> tabList 需转换
  const [dictTab, setDictTab] = useState<TableTab[]>(); // 2. 字典页签 ->tabDictField 需加载
  const [dbTab, setDbTab] = useState<TableTab[]>(); // 3. 数据库页签

  //3 数据库页签加载
  const loadDbTab = useCallback((formId: string) => {
    list({ formId, type: "table" }).then(
      (result) => {
        const conditions: ReportCondition[] = result.data || [];
        if (conditions && conditions.length > 0) {
          setDbTab([
            ...conditions.map((d) => {
              return {
                tab: d.name,
                itemKey: d.id,
                req: JSON.parse(conditions?.[0]?.conditionJson),
                closable: addTabAble,
              };
            }),
          ]);
        } else {
          setDbTab([]);
        }
      }
      // setConditions( || [])
    );
  }, []);

  //字典页签加载
  useEffect(() => {
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
        const tabs: TableTab[] = [];
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
        setDictTab(tabs || []);
      });
    } else {
      setDictTab([]);
    }
  }, []);

  const addTab: TableTab = useMemo(() => {
    return {
      tab: (
        <Button
          title={`场景创建`}
          actionType="create"
          btnType="icon"
          icon={<i className="icon-task_add-02 font-bold" />}
          model={"reportCondition"}
          saveApi={save}
          reaction={[
            VF.then("sysMenuId").hide().value(tableModel?.sysMenuId),
            VF.then("formId").hide().value(tableModel?.id),
            VF.then("type").hide().value("table"),
            VF.then("name").title("场景页签名称"),
          ]}
          onSubmitFinish={() => {
            if (tableModel?.id) loadDbTab(tableModel?.id);
          }}
        />
      ),
      itemKey: "add",
    };
  }, [tableModel]);

  //流程页签有则其他页签不显示
  const contentTab = useMemo((): TableTab[] | undefined => {
    if (dictTab && dbTab) {
      //需这2个加载完毕
      const tabs: TableTab[] = (allTabAble ? [allTab] : [])
        .concat(dbTab)
        .concat(dictTab)
        .concat(fixedTab ? fixedTab : [])
        .concat(addTabAble ? [addTab] : []);

      //tab页签和行级数据权限有关(t.filterLevel) 且用户角色组没有行级数据权限(!=="all")，则需要进行tab页签能否显示的逻辑判断
      return tabs.filter((t) => {
        if (user?.groupFilterType !== "all" && t.filterLevel !== undefined) {
          if (t.filterLevel === "all") {
            return false;
          } else if (
            user?.groupFilterType.startsWith("sysUser") &&
            t.filterLevel.startsWith("sysDept")
          ) {
            return false;
          } else if (
            user?.groupFilterType === "sysDept_1" &&
            t.filterLevel === "sysDept_2"
          ) {
            return false;
          }
        }
        return true;
      });
    }
    return undefined;
  }, [
    dbTab,
    dictTab,
    fixedTab,
    addTab,
    addTabAble,
    // tabCount,
    allTabAble,
  ]);

  useEffect(() => {
    if (contentTab !== undefined && activeTab === undefined) {
      setActiveTab({ level1: contentTab?.[0]?.itemKey });
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
          if (req?.[0]?.where) {
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
    [contentTab]
  );

  //数据查询回传  reqFunc, contentTab
  useEffect(() => {
    if (onTabReq !== undefined && contentTab) {
      if (_activeTab) {
        onTabReq(reqFunc(_activeTab));
      } else if (contentTab?.[0]?.itemKey) {
        onTabReq(reqFunc({ level1: contentTab?.[0]?.itemKey }));
      }
    }
  }, [_activeTab?.level1, _activeTab?.level2, onTabReq, contentTab]);

  useEffect(() => {
    if (onCountReq && contentTab) {
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
  }, [_activeTab?.level1, _activeTab?.level2, contentTab]);

  //视图tab加载
  useEffect(() => {
    if (tableModel && tableModel.id) {
      loadDbTab(tableModel.id);
    }
  }, []);

  return (
    <>
      {/* {activeTab?.level1} */}
      {contentTab !== undefined && (
        <div className=" bg-white  pt-1">
          <Tabs
            style={{ height: "37px", paddingLeft: "10px" }}
            type="card"
            activeKey={activeTab?.level1 || contentTab?.[0]?.itemKey} //没有则默认显示全部
            tabList={contentTab.map((t) => {
              return {
                ...t,
                tab:
                  t.itemKey !== "add"
                    ? t.tab +
                      `${
                        t.showCount && tabCount?.[t.itemKey] !== undefined
                          ? " (" + tabCount?.[t.itemKey] + ")"
                          : ""
                      }`
                    : t.tab,
              };
            })}
            onChange={(key) => {
              if (key !== "add") {
                if (contentTab.filter((tab) => tab.itemKey === key)?.[0].subs) {
                  setActiveTab({
                    level1: key,
                    level2: contentTab.filter((tab) => tab.itemKey === key)?.[0]
                      .subs?.[0]?.itemKey,
                  });
                } else {
                  setActiveTab({ level1: key });
                }
              }
            }}
            onTabClose={(targetKey) => {
              remove([targetKey]).then(() => {
                if (tableModel?.id) loadDbTab(tableModel.id);
              });
            }}
          />
          {/* 二级页签 */}
          {contentTab?.filter((c) => c.itemKey === activeTab?.level1)?.[0]
            ?.subs && (
            <div className="flex  space-x-1 p-1  bg-gray-50">
              {contentTab
                ?.filter((c) => c.itemKey === activeTab?.level1)?.[0]
                ?.subs?.map((s) => {
                  return (
                    <div
                      className={` text-sm  cursor-pointer    ${classNames({
                        "bg-white border font-bold":
                          activeTab?.level2 === s.itemKey,
                      })} rounded-2xl  py-1 px-4`}
                      key={s.itemKey}
                      onClick={() => {
                        if (activeTab && activeTab?.level1) {
                          setActiveTab({
                            level1: activeTab.level1,
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
