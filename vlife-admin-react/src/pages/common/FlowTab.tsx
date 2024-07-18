import React, { useCallback, useEffect, useState } from "react";
import { Tabs } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { TableTab } from "./tablePage";
import classNames from "classnames";
import { useAuth } from "@src/context/auth-context";
import { ActiveTab } from "./tableTab";

export interface FlowTabProps {
  activeKey?: ActiveTab; //场景页签
  tableModel: FormVo; //列表模型
  tabCount?: { [tabKey: string]: number }; //tab页签数量
  onActiveChange: (activeKey: { level1: string; level2?: string }) => void; //切换页签
  onTabReq: (req: any) => void; // 请求数据
  onCountReq?: (countReq: { [tabKey: string]: any }) => void; // 需要请求数量的页签查询条件
}

//工作流页签
export const FlowTabs: TableTab[] = [
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

export default (props: FlowTabProps) => {
  const { activeKey, onActiveChange, onCountReq, tabCount, onTabReq } = props;
  const [_activeKey, setActiveKey] = useState<ActiveTab | undefined>(activeKey);
  const { user } = useAuth();

  useEffect(() => {
    if (activeKey) setActiveKey(activeKey);
  }, []);

  useEffect(() => {
    if (_activeKey) {
      onActiveChange(_activeKey);
    } else {
      onActiveChange({ level1: "flow_todo" });
    }
  }, [_activeKey?.level1, _activeKey?.level2]);

  //指定页签数过滤条件返回
  const reqFunc = useCallback(
    (_activeKey: { level1: string; level2?: string }) => {
      // 1 流程页签，使用obj方式给PageQuery对象flowTab传值
      if (_activeKey?.level2) {
        //二级tab工作流
        return FlowTabs?.filter(
          (item) => item.itemKey === _activeKey?.level1
        )?.[0].subs?.filter((item) => item.itemKey === _activeKey?.level2)?.[0]
          .req;
      } else {
        // 一级tab工作流
        return FlowTabs?.filter(
          (item) => item.itemKey === _activeKey?.level1
        )?.[0]?.req;
      }
    },
    []
  );

  //数据查询回传  reqFunc, FlowTabs
  useEffect(() => {
    if (onTabReq !== undefined) {
      if (_activeKey) {
        onTabReq(reqFunc(_activeKey));
      } else if (FlowTabs?.[0]?.itemKey) {
        onTabReq(reqFunc({ level1: FlowTabs?.[0]?.itemKey }));
      }
    }
  }, [_activeKey?.level1, _activeKey?.level2, onTabReq, FlowTabs?.length]);

  useEffect(() => {
    if (onCountReq) {
      let countReq: any = {};
      //统计数量页签参数封装(2级页签各自封装)
      FlowTabs?.forEach((tab) => {
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
  }, [_activeKey?.level1, _activeKey?.level2, FlowTabs?.length]);

  return (
    <>
      {/* {JSON.stringify(_activeKey)} */}
      {FlowTabs !== undefined && (
        <div className=" bg-white  pt-1">
          <Tabs
            style={{ height: "37px", paddingLeft: "10px" }}
            type="card"
            activeKey={activeKey?.level1 || FlowTabs?.[0]?.itemKey} //没有则默认显示全部
            tabList={FlowTabs.map((t) => {
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
                if (FlowTabs.filter((tab) => tab.itemKey === key)?.[0].subs) {
                  setActiveKey({
                    level1: key,
                    level2: FlowTabs.filter((tab) => tab.itemKey === key)?.[0]
                      .subs?.[0]?.itemKey,
                  });
                } else {
                  setActiveKey({ level1: key });
                }
              }
            }}
          />
          {/* 二级页签 */}
          {FlowTabs?.filter((c) => c.itemKey === activeKey?.level1)?.[0]
            ?.subs && (
            <div className="flex space-x-1 p-1  items-start bg-gray-50">
              {FlowTabs?.filter(
                (c) => c.itemKey === activeKey?.level1
              )?.[0]?.subs?.map((s) => {
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
