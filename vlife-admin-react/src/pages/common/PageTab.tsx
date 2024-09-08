import React, { ReactNode, useMemo } from "react";
import { Tabs } from "@douyinfe/semi-ui";
import classNames from "classnames";
import { IconRender, icons } from "@src/components/SelectIcon";
import { useState } from "react";
import { useEffect } from "react";

/**
 * 两级页签场景
 */
export type VfTab = {
  tab?: string; //场景名称
  icon?: ReactNode | string; //场景图标
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
  const [_level1Selected, setLevel1Selected] = useState<string>(); //第一层选中的
  const [_level2Selected, setLevel2Selected] = useState<string>(); //第二层选中的
  // const [_activeKey, setActiveKey] = useState<string | undefined>(activeKey); //外部传入的激活的key

  //第一层tab页签集合
  const level1Tabs = useMemo(() => {
    return contentTab
      .filter((tab) => tab.pKey === undefined)
      .map((tab) => {
        return {
          ...tab,
          icon: tab.icon ? IconRender(tab.icon) : undefined,
          closable: onRemove && tab.itemKey !== "_all_tab" ? true : false,
        };
      });
  }, [contentTab, onRemove]);
  //第二层页签集合
  const level2Tabs = useMemo(() => {
    if (_level1Selected) {
      return contentTab.filter((tab) => tab.pKey === _level1Selected);
    }
    return [];
  }, [_level1Selected, contentTab]);

  //外部传入的页签(level1或者2的页签则让当前页面的相关页签可以选中)
  useEffect(() => {
    if (activeKey) {
      const selectedTab = contentTab.find((tab) => tab.itemKey === activeKey);
      if (selectedTab) {
        setLevel1Selected(activeKey);
        const level2SelectedTab = contentTab.find((t) => t.pKey === activeKey);
        if (level2SelectedTab) {
          setLevel2Selected(level2SelectedTab.itemKey);
        }
      } else {
        const selected2Tab = contentTab.find(
          (tab) => tab.itemKey === activeKey
        );
        if (selected2Tab) {
          setLevel2Selected(activeKey);
          setLevel1Selected(selected2Tab.pKey);
        }
      }
    } else {
      const _level1_selected_itemKey = level1Tabs[0]?.itemKey;
      setLevel1Selected(_level1_selected_itemKey);
      const _level2SelectedTab = contentTab.find(
        (t) => t.pKey === _level1_selected_itemKey
      );
      if (_level2SelectedTab) {
        setLevel2Selected(_level2SelectedTab.itemKey);
        onSelected(_level2SelectedTab.itemKey);
      } else {
        onSelected(_level1_selected_itemKey);
      }
    }
  }, [activeKey]);
  // }, [activeKey, level1Tabs, contentTab]);

  // //第一层选中页签
  // const level1Selected = useMemo((): string => {
  //   if (activeKey) {
  //     const selectedTab = contentTab.filter(
  //       (tab) => tab.itemKey === activeKey
  //     )?.[0];
  //     return selectedTab?.pKey || selectedTab?.itemKey;
  //   } else {
  //     return level1Tabs[0]?.itemKey;
  //   }
  // }, [activeKey, level1Tabs, contentTab]);

  return (
    <div className={`${className} w-full`}>
      <Tabs
        style={{ height: "37px", paddingLeft: "10px" }}
        type="card"
        activeKey={_level1Selected} //没有则默认显示全部
        tabList={level1Tabs}
        onChange={(_key) => {
          setLevel1Selected(_key);
          const sub = contentTab.find((tab) => tab.pKey === _key);
          if (sub) {
            setLevel2Selected(sub.itemKey);
            onSelected(sub.itemKey);
          } else {
            onSelected(_key);
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
                  setLevel2Selected(s.itemKey);
                  onSelected(s.itemKey);
                }}
              >
                {s.icon && IconRender(s.icon)} <span>{s.tab}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
