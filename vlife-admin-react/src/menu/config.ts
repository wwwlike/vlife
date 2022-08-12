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
    itemKey: "4",
    text: "使用指南",
    icon: IconApps,
    items: [
      {
        itemKey: "1-2",
        text: "首页",
        icon: IconHome,
        path: "/dashboard/workbeach",
      },
    ],
  },
  {
    itemKey: "1",
    text: "权限管理",
    icon: IconHome,
    items: [
      {
        itemKey: "1-11",
        text: "权限资源",
        icon: IconTickCircle,
        code: "sysResources",
        path: "/resources",
      },

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
  // {
  //   itemKey: "2",
  //   text: "组织管理",
  //   icon: IconEdit,
  //   items: [],
  // },
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
        path: "/user",
      },

      {
        itemKey: "2-2",
        text: "机构管理",
        path: "/template/sysOrg",
      },
      {
        itemKey: "2-3",
        icon: IconMember,
        text: "部门管理",
        path: "/template/sysDept",
      },
      {
        itemKey: "2-1",
        text: "地区管理",
        path: "/template/sysArea",
      },
      {
        itemKey: "3-1",
        text: "参数字典",
        code: "dict",
        path: "/dict",
      },
    ],
  },
];

export default MENU_CONFIG;
