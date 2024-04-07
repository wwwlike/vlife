import React, { lazy, FC, useState } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import {
  WrapperRouteComponent,
  WrapperRouteWithOutLayoutComponent,
} from "./config";
import { AppProviders } from "@src/context";
import Empty from "@src/pages/common/Empty";
import Visit403 from "@src/pages/common/Visit403";
import FormModal from "@src/pages/common/modal/formModal";
import { ISelect } from "@src/dsl/component";
const DashboardPage = lazy(() => import("@src/pages/dashboard"));
const TemplatePage = lazy(() => import("@src/pages/template"));

//系统管理
const UserPage = lazy(() => import("@src/pages/sysManage/user"));
const DeptPage = lazy(() => import("@src/pages/sysManage/dept"));
const RolePage = lazy(() => import("@src/pages/sysManage/role"));
const GroupPage = lazy(() => import("@src/pages/sysManage/group"));
//系统配置
const FormDesignPage = lazy(() => import("@src/pages/sysConf/formDesign")); //表单设计页
const TableDesignPage = lazy(() => import("@src/pages/sysConf/tableDesign")); //列表设计页
const ModelIndelPage = lazy(() => import("@src/pages/sysConf/model")); //模型主页
const ModelDetailPage = lazy(
  () => import("@src/pages/sysConf/model/ModelDetail")
); //模型明细页
const CodeViewPage = lazy(() => import("@src/pages/sysConf/model/CodeView")); //前端代码
const MenuPage = lazy(() => import("@src/pages/sysConf/menu"));
const ResourcesPage = lazy(() => import("@src/pages/sysConf/resources"));
const DictPage = lazy(() => import("@src/pages/sysConf/dict"));
const IconPage = lazy(() => import("@src/pages/common/IconContainer"));
//业务系统
const LoginPage = lazy(() => import("@src/pages/login"));
const LayoutPage = lazy(() => import("@src/pages/layout"));

//erp
const LinkManPage = lazy(() => import("@src/pages/erp/linkman"));
const SupplierPage = lazy(() => import("@src/pages/erp/supplier"));
const CustomerPage = lazy(() => import("@src/pages/erp/customer"));
const ProductPage = lazy(() => import("@src/pages/erp/product"));
const OrderPurchasePage = lazy(() => import("@src/pages/erp/orderPurchase"));
const OrderSalePage = lazy(() => import("@src/pages/erp/orderSale"));
const WareHousePage = lazy(() => import("@src/pages/erp/wareHouse"));
const ItemStockPage = lazy(() => import("@src/pages/erp/itemStock"));
const OrderSendPage = lazy(() => import("@src/pages/erp/orderSend"));

//pageDesign（plus）
const PageDesignPage = lazy(() => import("@src/plus/page/design")); //页面设计列表页
const PageDesignLayoutPage = lazy(
  () => import("@src/plus/page/design/DesignLayout") //页面设置
);
//自定义页面
const CustomPage = lazy(() => import("@src/plus/page/design/CustomPage"));
//视图
const ConditionPage = lazy(() => import("@src/pages/sysConf/condition"));

//工作流
const FlowIndexPage = lazy(() => import("@src/workflow"));
const FlowDesignPage = lazy(() => import("@src/workflow/component"));
//我的待办
const MyTaskPage = lazy(() => import("@src/pages/dashboard/flow/MyTask"));
export const allRoute: any[] = [
  //CRUD页面模版，根据路由后缀确定访问哪个模型
  {
    path: "/vlife",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="业务模版" auth />
    ),
    children: [
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={<TemplatePage />}
            titleId="CRUD页面模版"
            auth
          />
        ),
      },
    ],
  },
  //系统业务
  {
    path: "/",
    element: (
      <WrapperRouteComponent
        element={<LayoutPage />}
        titleId="vlife-admin首页"
        auth
      />
    ),
    children: [
      {
        path: "dashboard/workbeach",
        element: (
          <WrapperRouteComponent
            element={<DashboardPage />}
            titleId="工作台"
            auth
          />
        ),
      },
      {
        path: "dashboard/flow/MyTask",
        element: (
          <WrapperRouteComponent
            element={<MyTaskPage />}
            titleId="我的待办"
            auth
          />
        ),
      },
      {
        path: "403",
        element: <WrapperRouteComponent element={<Visit403 />} titleId="403" />,
      },
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={
              <Empty
                title="高级功能需要授权"
                description="添加微信`vlifeboot`申请开通"
                type="405"
              />
            }
            titleId="405"
          />
        ),
      },
    ],
  },

  //系统管理
  {
    path: "/sysManage",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="系统配置" auth />
    ),
    children: [
      {
        path: "user",
        element: (
          <WrapperRouteComponent
            element={<UserPage />}
            titleId="用户管理"
            auth
          />
        ),
      },
      {
        path: "role",
        element: (
          <WrapperRouteComponent
            element={<RolePage />}
            titleId="角色管理"
            auth
          />
        ),
      },
      {
        path: "group",
        element: (
          <WrapperRouteComponent
            element={<GroupPage />}
            titleId="权限组管理"
            auth
          />
        ),
      },
      {
        path: "dept",
        element: (
          <WrapperRouteComponent
            element={<DeptPage />}
            titleId="部门维护"
            auth
          />
        ),
      },
    ],
  },

  {
    path: "/flow",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="工作流" auth />
    ),
    children: [
      {
        path: "design",
        element: (
          <WrapperRouteComponent
            element={<FlowDesignPage />}
            titleId="流程设计"
            auth
          />
        ),
      },
    ],
  },

  //系统配置
  {
    path: "/sysConf",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="系统配置" auth />
    ),
    children: [
      {
        path: "menu",
        element: (
          <WrapperRouteComponent
            element={<MenuPage />}
            titleId="菜单管理"
            auth
          />
        ),
      },
      {
        path: "dict",
        element: (
          <WrapperRouteComponent
            element={<DictPage />}
            titleId="字典管理"
            auth
          />
        ),
      },
      {
        path: "icon",
        element: (
          <WrapperRouteComponent
            element={<IconPage />}
            titleId="图标容器"
            auth
          />
        ),
      },
      {
        path: "resources",
        element: (
          <WrapperRouteComponent
            element={<ResourcesPage />}
            titleId="权限资源管理"
            auth
          />
        ),
      },
      {
        path: "model",
        element: (
          <WrapperRouteComponent
            element={<ModelIndelPage />}
            titleId="配置中心"
            auth
          />
        ),
      },
      {
        path: "model/detail/*",
        element: (
          <WrapperRouteComponent
            element={<ModelDetailPage />}
            titleId="模型明细"
            auth
          />
        ),
      },
      {
        path: "formDesign/*",
        element: (
          <WrapperRouteComponent
            element={<FormDesignPage />}
            titleId="模型设计"
            auth
          />
        ),
      },
      {
        path: "tableDesign/*",
        element: (
          <WrapperRouteComponent
            element={<TableDesignPage />}
            titleId="列表设计"
            auth
          />
        ),
      },
      {
        path: "model/codeView/*",
        element: (
          <WrapperRouteComponent
            element={<CodeViewPage />}
            titleId="模型代码"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "/erp",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="进销存" auth />
    ),
    children: [
      {
        path: "linkman/*",
        element: (
          <WrapperRouteComponent
            element={<LinkManPage />}
            titleId="联系人"
            auth
          />
        ),
      },
      {
        path: "supplier",
        element: (
          <WrapperRouteComponent
            element={<SupplierPage />}
            titleId="供应商"
            auth
          />
        ),
      },
      {
        path: "customer",
        element: (
          <WrapperRouteComponent
            element={<CustomerPage />}
            titleId="客户"
            auth
          />
        ),
      },
      {
        path: "product",
        element: (
          <WrapperRouteComponent
            element={<ProductPage />}
            titleId="产品"
            auth
          />
        ),
      },
      {
        path: "orderPurchase",
        element: (
          <WrapperRouteComponent
            element={<OrderPurchasePage />}
            titleId="采购单"
            auth
          />
        ),
      },
      {
        path: "orderSale",
        element: (
          <WrapperRouteComponent element={<OrderSalePage />} titleId="销售单" />
        ),
      },
      {
        path: "wareHouse",
        element: (
          <WrapperRouteComponent
            element={<WareHousePage />}
            titleId="仓库管理"
          />
        ),
      },
      {
        path: "itemStock",
        element: (
          <WrapperRouteComponent
            element={<ItemStockPage />}
            titleId="商品库存"
            auth
          />
        ),
      },
      {
        path: "orderSend",
        element: (
          <WrapperRouteComponent
            element={<OrderSendPage />}
            titleId="发货单"
            auth
          />
        ),
      },
    ],
  },

  // plus 高级版本
  {
    path: "/report",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="报表设置" auth />
    ),
    children: [
      {
        path: "condition",
        element: (
          <WrapperRouteComponent
            element={<ConditionPage />}
            titleId="视图配置"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "/page",
    element: (
      <WrapperRouteComponent
        element={<LayoutPage />}
        titleId="页面和模块"
        auth
      />
    ),
    children: [
      {
        path: "design",
        element: (
          <WrapperRouteComponent
            element={<PageDesignPage />}
            titleId="页面配置主页"
            auth
          />
        ),
      },
      {
        path: "layout/*",
        element: (
          <WrapperRouteComponent
            element={<PageDesignLayoutPage />}
            titleId="页面设计器"
            auth
          />
        ),
      },
    ],
  },
  //独立访问的页面
  {
    path: "/page/admin",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="组件演示" auth />
    ),
    children: [
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={<CustomPage />}
            titleId="自定义页面"
            auth
          />
        ),
      },
    ],
  },
  //独立访问的页面
  {
    path: "/page/*",
    element: <CustomPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: (
      <WrapperRouteWithOutLayoutComponent
        element={
          <Empty title="找不到咯" description="这里什么也没有~" type="404" />
        }
        titleId="404"
      />
    ),
  },
];

const RenderRouter: FC = () => {
  const [routeList, setRouteList] = useState<RouteObject[]>(allRoute);
  const element = useRoutes([...routeList]);
  return <AppProviders>{element}</AppProviders>;
};

//可选择路由
export const allRouter = (): ISelect[] => {
  const all: ISelect[] = [];
  const child = (path: string | null, route: any, flag: boolean) => {
    const thisPath =
      path === null
        ? route.path
        : path.endsWith("/")
        ? path + route.path
        : path + "/" + route.path;
    if (flag && thisPath !== "/*") {
      all.push({
        label: `${thisPath} ${
          route.element.props.titleId ? route.element.props.titleId : ""
        }`,
        value: thisPath,
      });
    }

    if (route.children) {
      route.children.forEach((c: any) => {
        child(thisPath, c, true);
      });
    }
  };
  allRoute.forEach((r) => {
    child(null, r, false);
  });
  return all;
};

export default RenderRouter;
