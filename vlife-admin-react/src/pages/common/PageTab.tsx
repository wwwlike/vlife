import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Tabs } from "@douyinfe/semi-ui";
import classNames from "classnames";

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
  const [_activeKey, setActiveKey] = useState<string>();

  useEffect(() => {
    const key =
      activeKey &&
      contentTab.filter(
        (tab) => tab.pKey === activeKey || tab.itemKey === activeKey
      ).length > 0
        ? contentTab.filter((tab) => tab.pKey === activeKey).length > 0
          ? contentTab.filter((tab) => tab.pKey === activeKey)?.[0].pKey
          : activeKey
        : contentTab.filter((tab) => tab.pKey === contentTab[0].itemKey)
            .length > 0
        ? contentTab.filter((tab) => tab.pKey === contentTab[0].itemKey)?.[0]
            .itemKey
        : contentTab[0].itemKey;
    setActiveKey(key);
  }, [activeKey, contentTab]);

  useEffect(() => {
    if (_activeKey) onSelected(_activeKey);
  }, [_activeKey]);

  //第一层tab页签
  const level1Tabs = useMemo(() => {
    return contentTab.filter((tab) => tab.pKey === undefined);
  }, [contentTab]);

  //第一层选中页签
  const level1Selected = useMemo((): string => {
    if (_activeKey) {
      const selectedTab = contentTab.filter(
        (tab) => tab.itemKey === _activeKey
      )?.[0];
      return selectedTab?.pKey || selectedTab.itemKey;
    } else {
      return level1Tabs[0]?.itemKey;
    }
  }, [_activeKey, level1Tabs, contentTab]);

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
            setActiveKey(_key);
          } else {
            setActiveKey(sub?.[0].itemKey);
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
                  "bg-white border font-bold": _activeKey === s.itemKey,
                })} rounded-2xl  py-1 px-4`}
                key={s.itemKey}
                onClick={() => {
                  setActiveKey(s.itemKey);
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
