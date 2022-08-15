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

export interface MenuItem {
  itemKey: string;
  text: string;
  code?: string;
  icon?: React.ReactNode;
  path?: string;
  items?: MenuItem[];
  component?: React.ComponentType<any>;
}

const MENU_CONFIG: MenuItem[] = [
  {
    itemKey: "1",
    text: "权限管理",
    icon: IconHome,
    items: [
      {
        itemKey: "1-2",
        text: "首页",
        icon: IconEdit,
        code: "sysUser",
        path: "/dashboard/workbeach",
      },
      {
        itemKey: "1-22",
        text: "动态模板",
        icon: IconEdit,
        code: "sysUser",
        path: "/template",
      },
      {
        itemKey: "1-11",
        text: "资源管理",
        icon: IconEdit,
        code: "sysUser",
        path: "/resources",
      },
      {
        itemKey: "1-0",
        text: "用户管理",
        icon: IconEdit,
        code: "sysUser",
        path: "/user",
      },
      {
        itemKey: "1-1",
        text: "角色管理",
        icon: IconEdit,
        code: "sysUser",
        path: "/auth/role",
      },
      {
        itemKey: "1-99",
        text: "formilydemo",
        icon: IconMember,
        path: "/formily/demo1",
      },
      {
        itemKey: "1-3",
        text: "url测试",
        icon: IconEdit,
        path: "/test/url",
      },
      {
        itemKey: "1-4",
        text: "formily测试",
        path: "/test/formily",
      },
      {
        itemKey: "1-5",
        text: "角色组管理",
        path: "/user/page",
      },
      {
        itemKey: "1-6",
        text: "角色组管理",
        path: "/user/page",
      },
    ],
  },
  {
    itemKey: "8",
    text: "formily",
    icon: IconHome,
    items: [
      {
        itemKey: "8-1",
        text: "custom",
        path: "/formily/custom",
      },
      {
        itemKey: "8-12",
        text: "reactive",
        path: "/formily/reactive",
      },
      {
        itemKey: "8-13",
        text: "react",
        path: "/formily/react",
      },
      {
        itemKey: "8-14",
        text: "core",
        path: "/formily/core",
      },
      {
        itemKey: "8-15",
        text: "semi",
        path: "/formily/semi",
      },
    ],
  },

  {
    itemKey: "2",
    text: "组织管理",
    icon: IconEdit,
    items: [
      {
        itemKey: "2-1",
        text: "机构管理",
        path: "/form/basic",
      },
      {
        itemKey: "2-2",
        text: "用户管理",
        path: "/form/step",
      },
      {
        itemKey: "2-3",
        text: "部门管理",
        path: "/form/advanced",
      },
      {
        itemKey: "2-4",
        text: "职位管理",
        path: "/form/advanced",
      },
      {
        itemKey: "2-5",
        text: "地区管理",
        path: "/form/advanced",
      },
    ],
  },
  {
    itemKey: "3",
    text: "系统管理",
    icon: IconGridRectangle,
    items: [
      {
        itemKey: "3-1",
        text: "参数字典",
        path: "/sysDict",
      },
      {
        itemKey: "3-2",
        text: "app.menu.list.inquire",
        path: "/list/inquire",
      },
      {
        itemKey: "3-3",
        text: "app.menu.list.standard",
        path: "/list/standard",
      },
      {
        itemKey: "3-4",
        text: "app.menu.list.card",
        path: "/list/card",
      },
    ],
  },
  {
    itemKey: "4",
    text: "VLIFE介绍",
    icon: IconApps,
    items: [
      {
        itemKey: "4-1",
        text: "app.detail.basic",
        path: "/detail/basic",
      },
      {
        itemKey: "4-2",
        text: "app.detail.advanced",
        path: "/detail/advanced",
      },
    ],
  },
  {
    itemKey: "5",
    text: "app.result",
    icon: IconTickCircle,
    items: [
      {
        itemKey: "5-1",
        text: "app.result.success",
        path: "/result/success",
      },
      {
        itemKey: "5-2",
        text: "app.result.failed",
        path: "/result/failed",
      },
    ],
  },
  {
    itemKey: "6",
    text: "app.abnormal",
    icon: IconAlertTriangle,
    items: [
      {
        itemKey: "6-1",
        text: "app.abnormal.403",
        path: "/abnormal/403",
      },
      {
        itemKey: "6-2",
        text: "app.abnormal.404",
        path: "/abnormal/404",
      },
      {
        itemKey: "6-3",
        text: "app.abnormal.500",
        path: "/abnormal/500",
      },
    ],
  },
  {
    itemKey: "7",
    text: "app.user",
    icon: IconUser,
    items: [
      {
        itemKey: "7-1",
        text: "app.user.center",
        path: "/user/center",
      },
      {
        itemKey: "7-2",
        text: "app.user.settings",
        path: "/user/settings",
      },
    ],
  },
];

export default MENU_CONFIG;
