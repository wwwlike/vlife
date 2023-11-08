import React, { FC, useEffect, useMemo, useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@src/context/auth-context";
import SelectIcon from "@src/components/SelectIcon";
import { MenuVo } from "@src/api/SysMenu";
import { MenuItem } from "../../types";
import { useSize } from "ahooks";

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

const Index = ({
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
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]); //打开节点
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); //选中节点
  const { user, setMenuState } = useAuth();
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
            text: `${menu.name}`,
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
  }, [menus, app]);

  useEffect(() => {
    if (app && app.url) {
      navigate(app.url);
    }
  }, [app]);

  const onSelect = (data: any) => {
    window.localStorage.setItem("currMenuId", data.itemKey);
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

  return currAppMenuList && currAppMenuList.length > 0 ? (
    <Sider>
      <Nav
        bodyStyle={{ height: `${height - 110}px` }}
        className="!overflow-y-auto  "
        items={currAppMenuList}
        openKeys={
          openKeys && openKeys.length > 0 ? openKeys : [currAppMenuList[0].id]
        } //打开父节点
        selectedKeys={
          selectedKeys
          // && selectedKeys.length > 0
          //   ? selectedKeys
          //   : currAppMenuList &&
          //     currAppMenuList.length > 0 &&
          //     currAppMenuList[0].items &&
          //     currAppMenuList[0].items.length > 0
          //   ? [currAppMenuList[0].items[0].id]
          //   : []
        } //选中的子节点
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
  ) : (
    <></>
  );
};

export default Index;
