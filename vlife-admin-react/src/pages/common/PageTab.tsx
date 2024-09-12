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

  //第一级页签选中逻辑
  useEffect(() => {
    if (!activeKey) {
      //页签为空默认第一个选中
      setLevel1Selected(level1Tabs?.[0]?.itemKey);
    } else if (
      level1Tabs &&
      activeKey &&
      level1Tabs.map((_l1) => _l1.itemKey).includes(activeKey)
    ) {
      setLevel1Selected(activeKey);
    } else if (_level2Selected && !_level1Selected) {
      setLevel1Selected(
        contentTab.find((k) => k.itemKey === _level2Selected)?.pKey
      );
    }
  }, [activeKey, _level2Selected, contentTab]);

  //第二级页签选中逻辑
  useEffect(() => {
    if (!activeKey && level2Tabs?.length > 0) {
      setLevel2Selected(level2Tabs?.[0]?.itemKey);
    } else if (
      activeKey &&
      !_level1Selected &&
      contentTab.find((k) => k.itemKey === activeKey && k.pKey !== undefined)
    ) {
      setLevel2Selected(activeKey);
    } else if (
      _level1Selected &&
      level2Tabs?.length > 0 &&
      _level2Selected === undefined
    ) {
      setLevel2Selected(level2Tabs[0].itemKey);
    }
  }, [_level1Selected, level2Tabs, activeKey, contentTab]);

  useEffect(() => {
    if (!activeKey && (_level2Selected || _level1Selected)) {
      const selectedValue =
        _level2Selected !== undefined ? _level2Selected : _level1Selected;
      if (selectedValue !== undefined) {
        onSelected(selectedValue);
      }
    }
  }, [_level1Selected, _level2Selected, activeKey]);
  return (
    <div className={`${className} w-full`}>
      <Tabs
        style={{ height: "37px", paddingLeft: "10px" }}
        type="card"
        activeKey={_level1Selected} //没有则默认显示全部
        tabList={level1Tabs}
        onChange={(_key) => {
          setLevel1Selected(_key);
          setLevel2Selected(undefined);
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
                  "bg-white border font-bold": _level2Selected === s.itemKey,
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
