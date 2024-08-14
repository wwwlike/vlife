import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Tabs } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { table } from "console";
import ConfWrapper from "@src/components/compConf/component/ConfWrapper";
import { useUpdateEffect } from "ahooks";

/**
 * 两级页签场景
 */
export type VfTab = {
  tab?: string; //场景名称
  icon?: ReactNode; //场景图标
  itemKey: string; // 场景标识key
  pKey?: string; //上级场景key
};

export interface PageTabProps {
  className?: string;
  contentTab: VfTab[]; //页签列表
  activeKey?: string; //默认激活的页签
  onSelected: (key: string) => void; //页签切换回调
  onRemove?: (key: string) => void; //删除页签回调
}

export default ({ ...props }: PageTabProps) => {
  const { className, contentTab, onSelected, onRemove, activeKey } = props;
  //根据传入的activeKey获取当前激活的页签；

  //第一层tab页签
  const level1Tabs = useMemo(() => {
    return contentTab
      .filter((tab) => tab.pKey === undefined)
      .map((tab) => {
        return {
          ...tab,
          closable: onRemove && tab.tab !== "全部" ? true : false,
        };
      });
  }, [contentTab, onRemove]);

  //第一层选中页签
  const level1Selected = useMemo((): string => {
    if (activeKey) {
      const selectedTab = contentTab.filter(
        (tab) => tab.itemKey === activeKey
      )?.[0];
      return selectedTab?.pKey || selectedTab?.itemKey;
    } else {
      return level1Tabs[0]?.itemKey;
    }
  }, [activeKey, level1Tabs, contentTab]);

  //第二层页签
  const level2Tabs = useMemo(() => {
    if (level1Selected) {
      return contentTab.filter((tab) => tab.pKey === level1Selected);
    }
    return [];
  }, [level1Selected, contentTab]);

  return (
    <div className={`${className} w-full`}>
      <Tabs
        style={{ height: "37px", paddingLeft: "10px" }}
        type="card"
        activeKey={level1Selected} //没有则默认显示全部
        tabList={level1Tabs}
        onChange={(_key) => {
          const sub = contentTab.filter((tab) => tab.pKey === _key);
          if (sub === undefined || sub.length === 0) {
            onSelected(_key);
          } else {
            onSelected(sub?.[0].itemKey);
          }
        }}
        onTabClose={onRemove}
      />
      {/* 二级页签 */}
      {level2Tabs && level2Tabs.length > 0 && (
        <div className="flex  space-x-1 p-1  bg-gray-50 ">
          {level2Tabs.map((s) => {
            return (
              <div
                className={` text-sm  cursor-pointer    ${classNames({
                  "bg-white border font-bold": activeKey === s.itemKey,
                })} rounded-2xl  py-1 px-4`}
                key={s.itemKey}
                onClick={() => {
                  onSelected(s.itemKey);
                }}
              >
                {s.icon} <span>{s.tab}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
