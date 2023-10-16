import { Checkbox, Divider, TabPane, Tabs } from "@douyinfe/semi-ui";
import React, { useCallback, useEffect, useState } from "react";
import { MenuVo, listAll } from "@src/api/SysMenu";
import { SysResources } from "@src/api/SysResources";
import SelectIcon from "@src/components/SelectIcon";
import { VfBaseProps } from "@src/dsl/schema/component";

interface MenuResourcesSelectProp extends VfBaseProps<string[], undefined> {
  appId: string; //应用id
  roleId: string; //角色id
}

/**
 * 菜单接口选择组件
 * 一 约束
 * 1.菜单关联了实体，则该菜单不能作为父级菜单
 * 2.被接口关联了的菜单，则不能和角色关联，只能菜单下的接口(资源)和角色关联
 * 二 功能点
 * 1. 角色id可为空(新增)，app应用id不能为空，每次展示该应用可以被选择的菜单和资源
 * 2. 一级菜单关联实体的，则都放入其他的一个虚拟目录的tab页签下
 * 3. tab页签的一级菜单都不做checkbox功能点，都在二级菜单里做
 */
export default ({
  roleId,
  value,
  appId,
  onDataChange,
}: MenuResourcesSelectProp) => {
  //app应用
  const [appMenu, setAppMenu] = useState<MenuVo>();
  //tab菜单
  const [tabMenus, setTabMenus] = useState<MenuVo[]>([]);
  //所有菜单
  const [menus, setMenus] = useState<MenuVo[]>([]);

  /**
   * 找到指定菜单menuVo下roleId角色能使用的资源
   */
  const findMenuResources = (
    menuVo: MenuVo,
    sroleId: string
  ): SysResources[] => {
    if (menuVo.sysResourcesList && menuVo.sysResourcesList.length > 0) {
      const res = menuVo.sysResourcesList.filter((res) => {
        return sroleId !== undefined && sroleId !== null
          ? res.sysRoleId === null ||
              res.sysRoleId === undefined ||
              res.sysRoleId === sroleId
          : res.sysRoleId === null || res.sysRoleId === undefined;
      });
      return res;
    }
    return [];
  };

  /**
   * 查找指定菜单下的菜单
   */
  const findSubMenu = useCallback(
    (code: string, allMenu: MenuVo[]): MenuVo[] => {
      const subMenus: MenuVo[] = allMenu.filter((m) => m.pcode === code);
      subMenus.forEach((s) => {
        subMenus.push(...findSubMenu(s.code, allMenu));
      });
      return subMenus;
    },
    []
  );

  useEffect(() => {
    if (appId) {
      listAll().then((data) => {
        const mData: MenuVo[] = data.data || [];
        setMenus(mData);
        const aMenu: MenuVo = mData.filter((mm) => mm.id === appId)[0];
        setAppMenu(aMenu);
        setTabMenus([
          ...mData
            .filter((m) => m.pcode === aMenu.code) //是二级菜单
            .filter(
              //有子菜单
              (second) =>
                mData.filter((mm) => mm.pcode === second.code).length > 0
            )
            .filter((mm) => {
              return (
                //子菜单有可用资源
                findSubMenu(mm.code, mData)
                  .map((m) => findMenuResources(m, roleId))
                  .filter((f) => f.length > 0).length > 0 ||
                // 子菜单没有可用资源，且子菜单没有关联roleid的
                findSubMenu(mm.code, mData).filter(
                  (mmm) =>
                    (mmm.sysResourcesList === undefined ||
                      mmm.sysResourcesList === null) &&
                    (mmm.sysRoleId === undefined ||
                      mmm.sysRoleId === null ||
                      (roleId && mmm.sysRoleId === roleId))
                ).length > 0
              );
            }),
        ]);
      });
    }
  }, [appId, roleId, value]);

  /**菜单选择控件 */
  const menuSelect = useCallback(
    (m: MenuVo): any => {
      return (
        <li className="flex  w-full" key={m.code}>
          <Checkbox
            value={m.id}
            type="card"
            checked={value && value.includes(m.id)}
            onChange={(v) => {
              if (v.target.checked && (value === null || value === undefined)) {
                onDataChange([m.id]);
              } else if (v.target.checked && !value?.includes(m.id)) {
                onDataChange([...value, m.id]);
              }
              if (v.target.checked === false && value?.includes(m.id)) {
                onDataChange(value?.filter((v) => v !== m.id));
              }
            }}
          >
            <SelectIcon read value={m.icon} />
            <div className=" ml-4"> {m.name}</div>
          </Checkbox>
        </li>
      );
    },
    [value]
  );

  /**资源选择控件 */
  const resourcesSelect = useCallback(
    (m: MenuVo, roleId: string) => {
      return (
        <div key={"div_" + m.name} className=" w-full">
          <Divider margin="8px" dashed={true} />
          <h3 style={{ marginTop: "12px" }}>
            <div className=" flex  font-lightml-4">
              <SelectIcon value={m.icon} read />
              <div className=" ml-4"> {m.name}</div>
            </div>
          </h3>
          <div className="flex w-full">
            <ul role="list" className="grid p-2 gap-4 grid-cols-6  w-full">
              {findMenuResources(m, roleId).map((dd) => (
                <li className="flex" key={dd.code}>
                  <Checkbox
                    value={dd.code}
                    checked={value && value.includes(dd.id)}
                    onChange={(v) => {
                      if (
                        v.target.checked &&
                        (value === null || value === undefined)
                      ) {
                        onDataChange([dd.id]);
                      } else if (v.target.checked && !value?.includes(dd.id)) {
                        onDataChange([...value, dd.id]);
                      }

                      if (
                        v.target.checked === false &&
                        value?.includes(dd.id)
                      ) {
                        onDataChange(value?.filter((v) => v !== dd.id));
                      }
                    }}
                  >
                    {dd.name}
                  </Checkbox>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    },
    [value]
  );

  return (
    <div>
      <Tabs defaultActiveKey="0">
        {tabMenus
          .sort((a, b) => a.sort - b.sort)
          .map((tab, index) => {
            return (
              <TabPane
                icon={<SelectIcon value={tab.icon} read />}
                key={index + ""}
                tab={tab.name}
                itemKey={index + ""}
              >
                {/* ------------有子菜单的应用一级目录 -------------------- */}
                {/*1 无资源二级菜单、菜单权限绑定*/}
                <ul role="list" className="grid p-2 gap-4 grid-cols-4">
                  {menus
                    .filter(
                      //无资源的二级菜单
                      (m) =>
                        m.pcode === tab.code &&
                        (m.sysResourcesList === null ||
                          m.sysResourcesList === undefined ||
                          m.sysResourcesList.length === 0)
                    )
                    .filter(
                      //未绑定或者已经绑定当前角色
                      (m) =>
                        m.sysRoleId === null ||
                        m.sysRoleId === undefined ||
                        (roleId && m.sysRoleId === roleId)
                    )
                    .sort((a, b) => a.sort - b.sort)
                    .map((m) => {
                      return menuSelect(m);
                    })}
                </ul>
                {/*2 有资源的菜单、资源权限绑定 */}
                {menus
                  .filter(
                    //有资源的二级菜单
                    (m) =>
                      m.pcode === tab.code &&
                      m.sysResourcesList &&
                      m.sysResourcesList.length > 0
                  )
                  .filter(
                    //有未绑定的资源或者已经被当前roleId绑定的资源
                    (m) => findMenuResources(m, roleId).length > 0
                  )
                  .sort((a, b) => a.sort - b.sort)
                  .map((m) => {
                    return resourcesSelect(m, roleId);
                  })}
              </TabPane>
            );
          })}
        {/* ------------ 没有子菜单的应用一级菜单 -------------------- */}
        {/* 1. 未关联资源的菜单 */}
        {appId ? (
          (menus
            .filter(
              //一级目录且没有子菜单
              (m) =>
                m.pcode === appMenu?.code &&
                findSubMenu(m.code, menus).length === 0
            )
            .filter(
              //无资源
              (m) =>
                m.sysResourcesList === null ||
                m.sysResourcesList === undefined ||
                m.sysResourcesList.length === 0
            )
            .filter(
              (m) =>
                m.sysRoleId === null ||
                m.sysRoleId === undefined ||
                (roleId && m.sysRoleId === roleId)
            ).length > 0 ||
            menus
              .filter(
                (m) =>
                  m.pcode === appMenu?.code &&
                  findSubMenu(m.code, menus).length === 0
              )
              .filter(
                (m) => m.sysResourcesList && m.sysResourcesList.length > 0
              ) //有可用资源
              .filter((m) => findMenuResources(m, roleId).length > 0).length >
              0) && (
            <TabPane key={"100"} tab={"其他"} itemKey={"other"}>
              <ul role="list" className="grid p-2 gap-4 grid-cols-4">
                {menus
                  .filter(
                    //一级目录且没有子菜单
                    (m) =>
                      m.pcode === appMenu?.code &&
                      findSubMenu(m.code, menus).length === 0
                  )
                  .filter(
                    //无资源
                    (m) =>
                      m.sysResourcesList === null ||
                      m.sysResourcesList === undefined ||
                      m.sysResourcesList.length === 0
                  )
                  .filter(
                    //没绑定，或者已经绑定当前roleID
                    (m) =>
                      m.sysRoleId === null ||
                      m.sysRoleId === undefined ||
                      (roleId && m.sysRoleId === roleId)
                  )
                  .sort((a, b) => a.sort - b.sort)
                  .map((m) => {
                    return menuSelect(m);
                  })}
              </ul>
              {/* 2. 关联资源的一级菜单 */}
              {menus
                .filter(
                  //一级菜单且没有子菜单
                  (m) =>
                    m.pcode === appMenu?.code &&
                    findSubMenu(m.code, menus).length === 0
                )
                .filter(
                  //有资源
                  (m) => m.sysResourcesList && m.sysResourcesList.length > 0
                ) //有可用资源
                .filter((m) => findMenuResources(m, roleId).length > 0)
                .sort((a, b) => a.sort - b.sort)
                .map((m) => {
                  return resourcesSelect(m, roleId);
                })}
            </TabPane>
          )
        ) : (
          <>请先选择所在应用</>
        )}
      </Tabs>
    </div>
  );
};
