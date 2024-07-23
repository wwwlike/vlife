import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Nav, Tooltip } from "@douyinfe/semi-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@src/context/auth-context";
import SelectIcon from "@src/components/SelectIcon";
import {
  detailMenuResourcesDto,
  listAll,
  MenuVo,
  remove,
  save,
  saveMenuResourcesDto,
} from "@src/api/SysMenu";
import { MenuItem } from "../../types";
import BtnToolBar from "@src/components/button/BtnToolBar";
import { IconDelete, IconEditStroked } from "@douyinfe/semi-icons";
import classNames from "classnames";
import { VF } from "@src/dsl/VF";
import { findSubs, findTreeRoot } from "@src/util/func";
import { VFBtn } from "@src/components/button/types";
import Button from "@src/components/button";
import { isNull } from "lodash";

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

export const urlMenu = (userAllMenus: MenuVo[], pathUrl: string) => {
  const menu = userAllMenus?.filter((m) => m.routerAddress === pathUrl)?.[0];
  return menu;
};
//查询第一个有链接的菜单
export const visitTopMenu = (
  currAppMenus: MenuVo[],
  appCode: string
): MenuVo | undefined => {
  const level1Menus: MenuVo[] = currAppMenus
    .filter((m: any) => m.pcode === appCode) //一级菜单
    .sort((a, b) => a.sort - b.sort);
  let targetMenu: MenuVo | undefined;
  level1Menus.find((modelMenu) => {
    if (modelMenu.routerAddress) {
      targetMenu = modelMenu;
      return true;
    } else {
      const subMenu = currAppMenus
        .filter((m) => m.pcode === modelMenu.code)
        .sort((a, b) => a.sort - b.sort)
        .find((sub) => {
          if (sub.routerAddress) {
            targetMenu = sub;
            return true;
          }
          return false;
        });
      if (subMenu) {
        return true;
      }
    }
    return false;
  });
  return targetMenu;
};

export default () => {
  const { user, setMenuState, app, allMenus, setAllMenus } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [height, setHeight] = useState(window.innerHeight);
  const [openKeys, setOpenKeys] = useState<string[]>([]); //打开节点
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); //选中节点

  //用户当前应用的菜单
  const appMenus = useMemo((): MenuVo[] => {
    if (allMenus && allMenus.length > 0 && app) {
      return findSubs(allMenus, app);
    } else {
      return [];
    }
  }, [allMenus, app]);
  //访问应用首页

  const visitMenu = (menu?: MenuVo) => {
    if (menu && menu.routerAddress) {
      navigate(menu.routerAddress);
    }
  };

  useEffect(() => {
    if (
      app &&
      pathname === "/" //切换了应用跳转到该应用的第一个菜单
    ) {
      visitMenu(visitTopMenu(appMenus, app.code));
    } else {
      let currMenu: MenuVo = appMenus?.filter(
        (m: MenuVo) => m.routerAddress === pathname
      )?.[0];
      if (currMenu !== undefined) {
        setSelectedKeys([currMenu.id]);
        const _openKeys: string[] = [
          allMenus?.filter((m) => m.code === currMenu.pcode)?.[0]?.id,
        ];
        setOpenKeys((openKeys) => [...openKeys, ..._openKeys]);
      } else {
        //缓存里读取
        // const localMenu: any = localStorage.getItem("currMenu");
        // if (localMenu !== null) {
        //   const _currMenu = JSON.parse(localMenu);
        //   setSelectedKeys([_currMenu.menu]);
        //   setOpenKeys(_currMenu.openKeys);
        // }
      }
    }
  }, [pathname, app, appMenus]);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const createMenuBtn = useCallback(
    (pcode: string, title?: string): VFBtn => {
      return {
        title: title || "一级菜单创建",
        btnType: "icon",
        icon: <i className="  icon-task_add-02" />,
        actionType: "create",
        continueCreate: false,
        model: "sysMenu",
        fieldOutApiParams: { formId: { sysMenuId: app?.id } },
        reaction: [
          VF.then("app").hide().value(false),
          VF.then("pcode")
            .value(pcode)
            .readPretty()
            .title(title ? "上级菜单" : "所在应用"),
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
          listAll().then((d) => setAllMenus(d.data || []));
          if (datas && datas[0] && datas[0].routerAddress) {
            visitMenu(datas[0]);
          }

          // if(datas[0])
          // menuUrl(datas[0]) && ();
        },
      };
    },
    [allMenus?.length, allMenus, app]
  );

  /**
   * 菜单转换nav类型
   */
  const currAppMenuList = useMemo(() => {
    // const size useSize()
    const nav = (root: MenuVo): MenuItem[] => {
      return appMenus
        .sort((a, b) => a.sort - b.sort)
        .filter((m) => m.pcode === root.code)
        .map((menu: MenuVo) => {
          return {
            id: menu.id,
            itemKey: menu.id,
            text: user?.superUser ? (
              <div
                key={menu.id}
                className=" group z-10 flex items-center relative w-28"
              >
                <div className="z-10">
                  {" "}
                  {menu.name}
                  {/* {menu.url !== undefined && menu.formId === null ? (
                    <Tooltip content={"菜单没有关联模型无法导入相关权限接口"}>
                      <span className=" text-blue-500 "></span>
                    </Tooltip>
                  ) : (
                    menu.name
                  )} */}
                </div>
                <div
                  className="flex absolute items-center right-0 !z-20 "
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
                    })} group-hover:block `}
                    btns={[
                      {
                        title: "编辑菜单",
                        icon: <IconEditStroked size="small" className="z-20" />,
                        actionType: "edit",
                        model: "sysMenu",
                        saveApi: save,
                        onSubmitFinish: (...datas) => {
                          listAll().then((d) => {
                            setAllMenus(d.data || []);
                            if (datas[0] && datas[0].routerAddress) {
                              visitMenu(datas[0]);
                            }
                          });
                        },
                        reaction: [
                          VF.then("app").hide(),
                          VF.field("confPage")
                            .eq(true)
                            .then("url", "formId", "placeholderUrl")
                            .hide()
                            .clearValue(),
                          VF.then("pcode").readPretty(),
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
                          const _appMenus = [
                            ...(appMenus?.filter((f) => f.id !== menu.id) ||
                              []),
                          ];
                          listAll()
                            .then((d) => setAllMenus(d.data || []))
                            .then(() => {
                              _appMenus.length > 0 &&
                                app &&
                                visitMenu(visitTopMenu(_appMenus, app.code));
                            });

                          // listAll().then((d) => {
                          //   setAllMenus(d.data || []);
                          //   if (datas[0] && datas[0].routerAddress) {
                          //     visitMenu(
                          //       visitTopMenu(appMenus, app?.code || "")
                          //     );
                          //   }
                          // });
                          // visitMenu(visitTopMenu(appMenus, app?.code || ""));
                        },
                      },
                      {
                        title: "权限导入",
                        actionType: "edit",
                        tooltip: "权限错误",
                        // disabledHide: true,
                        usableMatch: (...datas: MenuVo[]) => {
                          if (datas[0].pageLayoutId) {
                            return "自定义页面无需导入权限";
                          } else if (
                            (datas[0]?.formId !== undefined &&
                              datas[0]?.formId !== null) === false
                          ) {
                            return "请先编辑菜单关联模型";
                          }
                          return true;
                        },
                        reaction: [
                          VF.then("id").hide(),
                          VF.then("formId").hide(),
                        ],
                        icon: <i className=" icon-gonext" />,
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
                        icon: <i className="  icon-setting" />,
                      },
                      {
                        title: "页面配置",
                        actionType: "click",
                        disabledHide: true,
                        usableMatch: !isNull(menu.pageLayoutId),
                        onClick: () => {
                          navigate(`/page/layout/${menu.pageLayoutId}`);
                        },
                        icon: <i className=" icon-hr_webpage" />,
                      },
                    ]}
                  />
                  {menu.pcode === app?.code && (
                    <BtnToolBar
                      key={menu.id + pathname}
                      btns={[
                        {
                          ...createMenuBtn(menu.code, "添加下级菜单"),
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
            path: menu.pageLayout
              ? `/page/admin/${menu.pageLayout.url}` //自定义界面
              : menu.url && menu.url.endsWith("*") //通配符页面
              ? menu.url.replace("*", menu.placeholderUrl)
              : menu.url, //路由配置页面
            items: nav(menu),
          };
        });
    };
    if (app && appMenus) {
      return nav(app);
    }
    return [];
  }, [appMenus, app, selectedKeys, allMenus, pathname, createMenuBtn]);

  const onSelect = (data: any) => {
    if (data.selectedKeys[0]) {
      window.localStorage.setItem(
        "currMenu",
        JSON.stringify({
          title: appMenus.filter((m) => m.id === data.selectedKeys[0])?.[0]
            .name,
          app: app?.id,
          menu: data.selectedKeys[0],
          openKeys: openKeys,
        })
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
    <Sider className=" relative">
      {app?.code && user?.superUser && (
        <div
          className={` ${classNames({
            "absolute bottom-16": appMenus.length !== 0,
            " h-96": appMenus.length === 0,
          })}   flex  w-full items-center justify-center`}
        >
          <Button {...createMenuBtn(app.code)} btnType="button" />
        </div>
      )}
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
        <Nav.Footer className=" absolute bottom-0" collapseButton={true} />
      </Nav>
    </Sider>
  );
};
