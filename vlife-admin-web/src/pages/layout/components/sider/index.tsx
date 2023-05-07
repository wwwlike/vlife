import React, { FC, useEffect, useMemo, useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { MenuItem } from "@src/menu/config";
import { useLocation, useNavigate } from "react-router";
import "../../index.scss";
import { useAuth } from "@src/context/auth-context";
import SelectIcon from "@src/components/SelectIcon";
import { listAll, SysMenu } from "@src/api/SysMenu";

const { Sider } = Layout;
function renderIcon(icon: any) {
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

const Index: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // MENU_CONFIG
  const [allMenuList, setAllMenuList] = useState<MenuItem[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const locale = useStore((state) => state.locale)
  const { user } = useAuth();

  useEffect(() => {
    const getSub = (menus: SysMenu[], parent?: SysMenu): MenuItem[] => {
      // alert(menus.filter((m) => m.pcode === null).length);
      return menus
        .filter((m) => m.pcode === (parent ? parent.code : null))
        .map((m) => {
          return {
            itemKey: m.id || "",
            text: m.name,
            code: m.code,
            icon: m.icon,
            path:
              m.url && m.url.endsWith("*")
                ? m.url.replace("*", m.placeholderUrl)
                : m.url,
            items: getSub(menus, m),
          };
        });
    };
    listAll().then((d) => {
      const menus: SysMenu[] = d.data || [];
      const menuItems: MenuItem[] = getSub(menus);
      setAllMenuList(menuItems);
    });
  }, []);

  /**
   * 有权限的菜单
   */
  const navList = useMemo(() => {
    let mList: MenuItem[] = [];
    if (user) {
      mList = [...allMenuList]
        .filter((e) => {
          if (user.sysGroupId === "super") {
            return true;
          }
          //e的子菜单用户是否有权限，如果有一个，父菜单也可以加入进来
          let subs = e.items; //子菜单
          let filterSubItems;
          if (subs) {
            filterSubItems = subs.filter((sub) => {
              if (sub.itemKey) {
                //判断用户信息里是否有该code
                return user?.menus?.includes(sub.itemKey);
              }
              return true;
            });
          }
          if (filterSubItems && filterSubItems.length > 0) {
            return true;
          } else {
            return false;
          }
        })
        .map((e) => {
          let subs = e.items; //子菜单
          let filterSubItems;
          if (subs) {
            filterSubItems = subs.filter((sub) => {
              if (user.sysGroupId === "super") {
                return true;
              }
              if (sub.itemKey) {
                return user?.menus?.includes(sub.itemKey);
              }
              return true;
            });
          }
          e.items = filterSubItems;
          return e;
        });

      return mList.map((e) => {
        return {
          ...e,
          text: e.text,
          icon: e?.icon ? renderIcon(e.icon) : null,
          items: e?.items
            ? e.items.map((m) => {
                return {
                  ...m,
                  text: m.text,
                  icon: m.icon ? renderIcon(m.icon) : null,
                };
              })
            : [],
        };
      });
    }
  }, [user?.menus, allMenuList]);

  const onSelect = (data: any) => {
    window.localStorage.setItem("currMenuId", data.itemKey);
    setSelectedKeys([...data.selectedKeys]);
    navigate(data.selectedItems[0].path as string);
  };
  const onOpenChange = (data: any) => {
    setOpenKeys([...data.openKeys]);
  };

  // setSelectedKeys 和 path 双向绑定
  useEffect(() => {
    if (pathname && allMenuList && allMenuList.length > 0) {
      const keys: string[] = findMenuByPath(allMenuList, pathname, []);
      setSelectedKeys([keys.pop() as string]);
      setOpenKeys(Array.from(new Set([...openKeys, ...keys])));
    }
  }, [pathname, allMenuList]);

  return (
    <Sider
      className="shadow-lg"
      style={{ backgroundColor: "var(--semi-color-bg-1)" }}
    >
      <Nav
        items={navList}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        onOpenChange={onOpenChange}
        style={{ maxWidth: 220, height: "100%" }}
        // header={{
        // 	logo: <IconApps style={{ fontSize: 36 }} />,
        // 	text: 'VLife Admin',
        // }}
        // footer={{
        //   collapseButton: true,
        //   // collapseText: () => <div>{"展开"}</div>,
        // }}
      >
        <Nav.Footer collapseButton={true} />
      </Nav>
    </Sider>
  );
};

export default Index;
