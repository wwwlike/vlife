import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@src/context/auth-context";
import SelectIcon from "@src/components/SelectIcon";
import {
  detailMenuResourcesDto,
  MenuVo,
  remove,
  save,
  saveMenuResourcesDto,
} from "@src/api/SysMenu";
import { MenuItem } from "../../types";
import BtnToolBar from "@src/components/table/component/BtnToolBar";
import { IconDelete, IconEditStroked, IconRegExp } from "@douyinfe/semi-icons";
import classNames from "classnames";
import { VF } from "@src/dsl/VF";
import { VFBtn } from "@src/components/table/types";

const { Sider } = Layout;
export function renderIcon(icon: any) {
  if (!icon) {
    return null;
  }
  if (typeof icon === "string") {
    return <SelectIcon read value={icon} />;
  }
  return icon.render();
}
function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
  for (const menu of menus) {
    if (menu.path === path) {
      return [...keys, menu.itemKey];
    }
    if (menu.items && menu.items.length > 0) {
      const result = findMenuByPath(menu.items, path, [...keys, menu.itemKey]);
      if (result.length === 0) {
        continue;
      }
      return result;
    }
  }
  return [];
}

export default ({
  menus,
  app,
  onClick,
}: {
  menus: MenuVo[];
  app: MenuVo | undefined;
  onClick: (menuVo: MenuVo) => void;
}) => {
  const navigate = useNavigate();
  const [height, setHeight] = useState(window.innerHeight);
  const { pathname } = useLocation();

  const [openKeys, setOpenKeys] = useState<string[]>([]); //打开节点
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); //选中节点
  const { user, setMenuState, allMenus, setAllMenus } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (app && app.url) {
      navigate(app.url);
    }
  }, [app]);

  const createMenuBtn = useCallback((pcode: string, title?: string): VFBtn => {
    return {
      title: title || "新增菜单",
      icon: <i className="  icon-task_add-02" />,
      actionType: "create",
      model: "sysMenu",
      reaction: [
        VF.then("app").hide().value(false),
        VF.then("pcode").value(pcode),
        VF.field("confPage")
          .eq(true)
          .then("url", "formId", "placeholderUrl")
          .hide()
          .clearValue(),
        VF.field("url").isNotNull().then("formId").show(),
        VF.result((sysMenu: any) => {
          return sysMenu?.url && sysMenu.url.indexOf("*") !== -1;
        })
          .then("formId")
          .required(),
        VF.field("confPage").eq(true).then("pageLayoutId").show(),
        VF.field("url")
          .endsWidth("*")
          .then("placeholderUrl")
          .show()
          .then("placeholderUrl")
          .required(),
      ],
      saveApi: save,
      onSubmitFinish: (...datas) => {
        setAllMenus([
          ...(allMenus?.filter((f) => f.id !== datas[0].id) || []),
          datas[0],
        ]);
      },
    };
  }, []);
  /**
   * 当前应用当前用户拥有权限下的所有菜单
   */
  const currAppMenuList = useMemo(() => {
    // const size useSize()
    const nav = (root: MenuVo): MenuItem[] => {
      return menus
        .sort((a, b) => a.sort - b.sort)
        .filter((m) => m.pcode === root.code)
        .map((menu) => {
          return {
            id: menu.id,
            itemKey: menu.id,
            text: user?.superUser ? (
              <div key={menu.id} className=" group z-10 flex relative w-28">
                <div className="z-10">{menu.name}</div>
                <div
                  className="flex absolute space-x-1 right-0 !z-20 "
                  onClick={(event) => {
                    event.cancelable = true; //阻止事件冒泡
                    event.stopPropagation();
                  }}
                >
                  <BtnToolBar
                    dropdown={true}
                    key={menu.id + JSON.stringify(selectedKeys)}
                    datas={[menu]}
                    className={`${classNames({
                      hidden: !selectedKeys.includes(menu.id),
                    })}   group-hover:block `}
                    btns={[
                      {
                        title: "编辑菜单",
                        icon: <IconEditStroked size="small" className="z-20" />,
                        actionType: "edit",
                        model: "sysMenu",
                        saveApi: save,
                        onSubmitFinish: (...datas) => {
                          setAllMenus([
                            ...(allMenus?.filter((f) => f.id !== datas[0].id) ||
                              []),
                            datas[0],
                          ]);
                        },
                        reaction: [
                          VF.then("app").hide(),
                          VF.field("confPage")
                            .eq(true)
                            .then("url", "formId", "placeholderUrl")
                            .hide()
                            .clearValue(),
                          VF.field("url").isNotNull().then("formId").show(),
                          VF.result((sysMenu: any) => {
                            return (
                              sysMenu?.url && sysMenu.url.indexOf("*") !== -1
                            );
                          })
                            .then("formId")
                            .required(),
                          VF.field("confPage")
                            .eq(true)
                            .then("pageLayoutId")
                            .show(),
                          VF.field("url")
                            .endsWidth("*")
                            .then("placeholderUrl")
                            .show()
                            .then("placeholderUrl")
                            .required(),
                        ],
                      },
                      {
                        title: "删除菜单",
                        icon: <IconDelete size="small" className="z-20" />,
                        actionType: "api",
                        saveApi: (...data: any[]) => {
                          return remove([menu.id]);
                        },
                        submitConfirm: true,
                        onSubmitFinish: (...datas) => {
                          setAllMenus([
                            ...(allMenus?.filter((f) => f.id !== menu.id) ||
                              []),
                          ]);
                        },
                      },
                      {
                        title: "权限关联",
                        actionType: "edit",
                        disabledHide: true,
                        usableMatch: (...datas: MenuVo[]) => {
                          return (
                            datas[0]?.formId !== undefined &&
                            datas[0]?.formId !== null
                          );
                        },
                        reaction: [
                          VF.then("id").hide(),
                          VF.then("formId").hide(),
                        ],
                        icon: <IconRegExp />,
                        model: "menuResourcesDto",
                        loadApi: (d) => detailMenuResourcesDto({ id: d.id }),
                        saveApi: saveMenuResourcesDto,
                      },
                      {
                        title: "模型配置",
                        actionType: "click",
                        disabledHide: true,
                        usableMatch: (...datas: MenuVo[]) => {
                          return (
                            datas[0]?.formId !== undefined &&
                            datas[0]?.formId !== null
                          );
                        },
                        onClick: () => {
                          navigate(`/sysConf/model?formId=${menu.formId}`);
                        },
                        icon: <IconRegExp />,
                      },
                    ]}
                  />
                  {menu.pcode === app?.code && (
                    <BtnToolBar
                      key={menu.id}
                      datas={[menu]}
                      btns={[
                        {
                          ...createMenuBtn(menu.code, "添加下级菜单"),
                          onlyIcon: true,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>
            ) : (
              menu.name
            ),
            code: menu.code,
            icon: menu.icon ? renderIcon(menu.icon) : null,
            path:
              menu.url && menu.url.endsWith("*") //通配符页面
                ? menu.url.replace("*", menu.placeholderUrl)
                : menu.url, //路由配置页面
            items: nav(menu),
          };
        });
    };
    if (app && menus) {
      return nav(app);
    }
    return [];
  }, [menus, app, selectedKeys, pathname]);

  const onSelect = (data: any) => {
    if (data.selectedKeys[0]) {
      window.localStorage.setItem(
        "currMenu",
        menus.filter((m) => m.id === data.selectedKeys[0])?.[0].name
      );
    }
    setSelectedKeys([...data.selectedKeys]);
    navigate(data.selectedItems[0].path as string);
  };
  const onOpenChange = (data: any) => {
    setOpenKeys([...data.openKeys]);
  };

  /**
   * url直接打开找到应该展开的菜单
   */
  useEffect(() => {
    if (
      pathname &&
      currAppMenuList &&
      currAppMenuList.length > 0 &&
      selectedKeys.length === 0
    ) {
      const keys: string[] = findMenuByPath(currAppMenuList, pathname, []);
      setSelectedKeys([keys.pop() as string]);
      setOpenKeys(Array.from(new Set([...openKeys, ...keys])));
    }
    if (currAppMenuList && currAppMenuList.length === 0) {
      setMenuState("hide");
    } else {
      setMenuState("show");
    }
  }, [pathname, currAppMenuList]);

  return (
    <Sider>
      <Nav
        toggleIconPosition={user?.superUser ? "left" : "right"}
        bodyStyle={{ height: `${height - 110}px` }}
        className="!overflow-y-auto  !z-10 "
        items={
          currAppMenuList && currAppMenuList.length > 0 ? currAppMenuList : []
        }
        openKeys={
          openKeys && openKeys.length > 0
            ? openKeys
            : [currAppMenuList?.[0]?.id]
        } //打开父节点
        selectedKeys={selectedKeys} //选中的子节点
        onSelect={onSelect}
        onOpenChange={onOpenChange}
        style={{ maxWidth: 220, height: "100%" }}
        onCollapseChange={(open: boolean) => {
          setMenuState(open ? "mini" : "show");
        }}
      >
        {(!currAppMenuList || currAppMenuList.length === 0) && app?.code && (
          <BtnToolBar btns={[createMenuBtn(app.code)]} />
        )}
        <Nav.Footer className=" absolute bottom-0" collapseButton={true} />
      </Nav>
    </Sider>
  );
};
