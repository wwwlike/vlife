import React, { FC, useEffect, useMemo, useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import MENU_CONFIG, { MenuItem } from "@src/menu/config";
import { useLocation, useNavigate } from "react-router";
import "../../index.scss";
import { useAuth } from "@src/context/auth-context";
import {
  IconHome,
  IconEdit,
  IconMember,
  IconGridRectangle,
  IconApps,
  IconTickCircle,
  IconAlertTriangle,
  IconUser,
} from "@douyinfe/semi-icons";
const { Sider } = Layout;
function renderIcon(icon: any) {
  if (!icon) {
    return null;
  }
  return icon.render();
}
function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
  for (const menu of menus) {
    menu;
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
  const [allMenuList, setMenuList] = useState<MenuItem[]>(MENU_CONFIG);
  const [allMenuList1, setMenuList1] = useState<MenuItem[]>([
    {
      itemKey: "4",
      text: "使用指南",
      icon: IconApps,
      items: [
        {
          itemKey: "1-2",
          text: "平台介绍",
          icon: IconHome,
          path: "/dashboard/workbeach",
        },
        {
          itemKey: "1-4",
          text: "视频教程",
          icon: IconHome,
          path: "/help",
        },
        {
          itemKey: "1-3",
          text: "生成代码",
          icon: IconHome,
          path: "/ts/code",
        },
      ],
    },
    {
      itemKey: "1",
      text: "权限管理",
      icon: IconHome,
      items: [
        {
          itemKey: "1-1",
          text: "角色管理",
          icon: IconEdit,
          code: "sysRole",
          path: "/auth/role",
        },
        {
          itemKey: "1-10",
          text: "权限组",
          icon: IconAlertTriangle,
          code: "sysGroup",
          path: "/auth/group",
        },
      ],
    },
    {
      itemKey: "3",
      text: "系统管理",
      icon: IconGridRectangle,
      items: [
        {
          itemKey: "1-0",
          text: "用户管理",
          icon: IconUser,
          code: "sysUser",
          path: "/sys/user",
        },
        {
          itemKey: "2-1",
          text: "地区管理",
          code: "sysArea",
          path: "/sys/sysArea",
        },

        {
          itemKey: "2-2",
          text: "机构管理",
          code: "sysOrg",
          path: "/sys/sysOrg",
        },
        {
          itemKey: "2-3",
          icon: IconMember,
          text: "部门管理",
          code: "sysDept",
          path: "/sys/sysDept",
        },

        {
          itemKey: "3-1",
          text: "参数字典",
          code: "sysDict",
          path: "/sys/dict",
        },
      ],
    },
    {
      itemKey: "9",
      text: "系统配置",
      icon: IconEdit,
      items: [
        {
          itemKey: "1-13",
          text: "表单设计",
          icon: IconTickCircle,
          // code: "formDesign",
          path: "/conf/design",
        },
        {
          itemKey: "1-11",
          text: "权限资源",
          icon: IconTickCircle,
          // code: "sysResources",//菜单编码
          path: "/conf/resources",
        },
        {
          itemKey: "1-12",
          text: "查询配置",
          icon: IconTickCircle,
          code: "sysFilterDetail",
          path: "/conf/filter",
        },
      ],
    },
    {
      itemKey: "8",
      text: "演示模块",
      icon: IconEdit,
      items: [
        {
          itemKey: "8-1",
          text: "项目管理(模板组件)",
          path: "/template/project",
        },
        {
          itemKey: "8-2",
          text: "项目管理(编写页面)",
          path: "/oa/project",
        },
      ],
    },
  ]);
  // const { formatMessage } = useLocale()
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const locale = useStore((state) => state.locale)
  const { user } = useAuth();
  const navList = useMemo(() => {
    let mList: MenuItem[] = [];
    if (user) {
      mList = [...allMenuList]
        .filter((e) => {
          //e的子菜单用户是否有权限，如果有一个，父菜单也可以加入进来
          let subs = e.items; //子菜单
          let filterSubItems;
          if (subs) {
            filterSubItems = subs.filter((sub) => {
              if (sub.code) {
                //判断用户信息里是否有该code
                return user?.menus?.includes(sub.code);
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
              if (sub.code) {
                console.log(e, user?.menus?.includes(sub.code));
                return user?.menus?.includes(sub.code);
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
  }, [user?.menus]);

  const onSelect = (data: any) => {
    setSelectedKeys([...data.selectedKeys]);
    navigate(data.selectedItems[0].path as string);
  };
  const onOpenChange = (data: any) => {
    setOpenKeys([...data.openKeys]);
  };

  // setSelectedKeys 和 path 双向绑定
  useEffect(() => {
    const keys: string[] = findMenuByPath(allMenuList, pathname, []);
    setSelectedKeys([keys.pop() as string]);
    setOpenKeys(Array.from(new Set([...openKeys, ...keys])));
  }, [pathname]);

  return (
    <>
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
          footer={{
            collapseButton: true,
          }}
        />
      </Sider>
    </>
  );
};

export default Index;
