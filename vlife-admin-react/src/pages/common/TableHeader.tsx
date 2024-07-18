import React, {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormVo } from "@src/api/Form";
import { SysDict } from "@src/api/SysDict";
import { objToConditionWhere, OptEnum, where } from "@src/dsl/base";
import { loadApi } from "@src/resources/ApiDatas";
import PageTab, { VfTab } from "./PageTab";
import { save, list, ReportCondition, remove } from "@src/api/ReportCondition";
import Button from "@src/components/button";
import { VF } from "@src/dsl/VF";
import { useAuth } from "@src/context/auth-context";

//tab页签
export interface VfTableTab extends VfTab {
  filterLevel?: "all" | "sysDept_1" | "sysDept_2"; //过滤级别(有值和当前用户匹配则能显示该页签)
  // showCount?: boolean; //是否显示统计数量
  req?: object | Partial<where>[]; //简单属性| grouCondition(不嵌套方式设计器)  ps:当前不支持传入复杂condition对象
}

export interface TableHeaderProps {
  activeKey?: string; //当前页签key
  addTabAble?: boolean; //是否允许自定义页签
  allTabAble?: boolean; //是否允许全部页签
  entityModel?: FormVo; //实体模型
  tabList?: VfTableTab[]; //   1. fixed固定传值
  tabDictField?: string; // 2. 传字典编码的预设固定页签
  tabReqCount?: { [tabKey: string]: number }; //分页数量
  children?: any;
  showCount?: boolean; //是否显示数量
  tabCount?: { [key: string]: number };
  onActiveTabChange?: (tab: VfTableTab) => void; //页签场景切换
  onCountTab?: (countTabReqObj: { [tabKey: string]: any }) => void; //返回当前用户可用的且是需要加载数量的页签
}

export default ({ ...props }: TableHeaderProps) => {
  const {
    activeKey,
    entityModel,
    addTabAble = false,
    allTabAble = false,
    showCount = false, //是否显示tab页签数量
    tabList, //优先级1
    tabDictField, //优先级2
    children,
    tabCount, //查询到的页签数量 || 动态的
    onActiveTabChange,
    onCountTab,
  } = props;
  const allTab: VfTableTab = {
    itemKey: "_all_tab",
    icon: <i className=" icon-gallery_view " />,
    tab: "全部",
  };
  const { user } = useAuth();
  const [contentTab, setContentTab] = React.useState<VfTableTab[]>(); //查询到的页签

  const setTabByDb = useCallback(() => {
    list({ formId: entityModel?.id, type: "table" }).then((result) => {
      const conditions: ReportCondition[] = result.data || [];
      if (conditions && conditions.length > 0) {
        // console.log(conditions);
        setContentTab([
          ...conditions
            .sort((a, b) => Number(a.createDate) - Number(b.createDate))
            .map((d) => {
              return {
                tab: d.name,
                itemKey: d.id,
                showCount: true,
                closable: addTabAble,
                req: {
                  conditionGroups: JSON.parse(conditions?.[0]?.conditionJson),
                },
              };
            }),
        ]);
      } else {
        setContentTab([]);
      }
    });
  }, [entityModel]);
  //页签查询组装转换
  useEffect(() => {
    //固定的
    if (tabList) {
      //查询条件转换
      setContentTab(
        tabList.map((tab: VfTableTab) =>
          Array.isArray(tab.req) || tab.req === undefined
            ? { ...tab, req: { conditionGroups: [{ where: tab.req }] } }
            : Object.keys(tab.req).includes("flowTab")
            ? {
                ...tab,
                ...tab.req,
              }
            : {
                ...tab,
                req: {
                  conditionGroups: [{ where: objToConditionWhere(tab.req) }],
                },
              }
        ) || []
      );
    } else if (entityModel) {
      //字典
      if (tabDictField) {
        const dictcode = entityModel.fields?.filter(
          (f) => f.fieldName === tabDictField
        )?.[0]?.dictCode;
        if (dictcode) {
          loadApi({
            apiInfoKey: "dictOpenApi",
            match: "dictItem",
            paramObj: { code: dictcode },
          }).then((d) => {
            const dicts: SysDict[] = d;
            const tabs: VfTableTab[] = [];
            tabs.push(
              ...dicts.map((d) => {
                return {
                  itemKey: d.id, //视图编码(唯一)
                  tab: d.title,
                  req: {
                    conditionGroups: [
                      {
                        where: [
                          {
                            fieldName: tabDictField,
                            opt: OptEnum.eq,
                            value: [d.val],
                          },
                        ],
                      },
                    ],
                  },
                };
              })
            );
            setContentTab(tabs || []);
          });
        }
      } else if (addTabAble) {
        setTabByDb();
      } else {
        setContentTab([]);
      }
    } else {
      setContentTab([]);
    }
  }, []); //tabList, tabDictField, entityModel, addTabAble

  //最后根据行级数据权限过滤后的页签+数量组装
  const _contentTab = useMemo(() => {
    if (contentTab) {
      let _filterTab = contentTab.filter((t) => {
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
      return allTabAble || _filterTab.length === 0
        ? [allTab, ..._filterTab]
        : [..._filterTab];
    }
    return [];
  }, [contentTab]);

  //需要计数的页签查询对象数据回调
  useEffect(() => {
    if (showCount && _contentTab && _contentTab.length > 0) {
      const obj = _contentTab
        .filter((c) => !_contentTab.map((_c) => _c.pKey).includes(c.itemKey)) //多级目录里面的一级目录不需要计数
        .reduce((acc, cur) => ({ ...acc, [cur.itemKey]: cur.req }), {});

      console.log(obj);
      onCountTab?.(obj);
    }
  }, [_contentTab, showCount]);

  const count = useCallback(
    (itemKey: string) => {
      if (tabCount?.[itemKey]) {
        return `(${tabCount?.[itemKey]})`;
      } else {
        const subItemKeys: string[] = _contentTab
          .filter((s) => s.pKey === itemKey)
          .map((s) => s.itemKey);
        var total = 0;
        subItemKeys.forEach((_itemKey) => {
          total += tabCount?.[_itemKey] || 0;
        });
        return `(${total})`;
      }
    },
    [tabCount, _contentTab]
  );

  return (
    <div className=" flex flex-col item-center bg-white  pt-1">
      <div className=" flex item-center bg-white ">
        {_contentTab &&
          (_contentTab.length > 0 ? (
            <PageTab
              activeKey={activeKey}
              contentTab={_contentTab.map((_tab) => {
                return {
                  ..._tab,
                  tab: `${_tab.tab}${showCount ? count(_tab.itemKey) : ""}`,
                };
              })}
              onRemove={(targetKey) => {
                remove([targetKey]).then(() => {
                  setContentTab((tab) =>
                    tab?.filter((t) => t.itemKey !== targetKey)
                  );
                });
              }}
              onSelected={function (key: string): void {
                // alert(_contentTab.filter((f) => f.itemKey === key)?.[0].req);
                onActiveTabChange?.(
                  _contentTab.filter((f) => f.itemKey === key)?.[0]
                );
              }}
            />
          ) : (
            <div className=" h-10 px-4 py-1 text-center text-red-500 font-bold">
              当前无可用场景！
            </div>
          ))}
        {tabList === undefined &&
          tabDictField === undefined &&
          addTabAble === true &&
          user &&
          user.superUser === true && (
            <div className=" text-center flex items-center pl-10 bg-white  w-20">
              <Button
                title={`场景创建`}
                actionType="create"
                btnType="icon"
                icon={<i className="icon-task_add-02 font-bold" />}
                model={"reportCondition"}
                saveApi={save}
                reaction={[
                  VF.then("sysMenuId").hide().value(entityModel?.sysMenuId),
                  VF.then("formId").hide().value(entityModel?.id),
                  VF.then("type").hide().value("table"),
                  VF.then("name").title("场景页签名称"),
                ]}
                onSubmitFinish={() => {
                  setTabByDb();
                }}
              />
            </div>
          )}
      </div>
      {children && (
        <div className=" flex relative m-2 bg-white">{children}</div>
      )}
    </div>
  );
};
