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
  // icon?: React.ReactNode;
  icon?: any;
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
        code: "form",
        path: "/conf/design",
      },
      {
        itemKey: "1-11",
        text: "权限资源",
        icon: IconTickCircle,
        code: "sysResources", // 与菜单编码对应
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
        code: "project", // 与菜单编码对应
        path: "/oa/project",
      },
      {
        itemKey: "8-3",
        text: "客户管理",
        code: "customer", // 与菜单编码对应
        path: "/template/customer",
      },
    ],
  },
];

export default MENU_CONFIG;
