import React, { lazy, FC, useEffect, useState } from "react";
import { RouteObject } from "react-router";
import { Link, Route, useRoutes } from "react-router-dom";
import {
  WrapperRouteComponent,
  WrapperRouteWithOutLayoutComponent,
} from "./config";
import { AppProviders } from "@src/context";
// 下一步做动态组件提取
//桌面
// import DemoPage from "@src/pages/demo";
import DashboardPage from "@src/pages/dashboard";
//模版页面
import MainTemplatePage from "@src/pages/template/main";
//示例
import ExamplePage from "@src/pages/example";
//系统管理
import UserPage from "@src/pages/sysManage/user";
import DeptPage from "@src/pages/sysManage/dept";
import RolePage from "@src/pages/sysManage/role";
import GroupPage from "@src/pages/sysManage/group";
//系统配置
import ModelDesignPage from "@src/pages/sysConf/formDesign"; //模型设计页
import ModelIndelPage from "@src/pages/sysConf/model"; //模型主页
import ModelDetailPage from "@src/pages/sysConf/model/detail"; //模型明细页
import ModelCodePage from "@src/pages/sysConf/model/code"; //模型明细页
import MenuPage from "@src/pages/sysConf/menu";
import ResourcesPage from "@src/pages/sysConf/resources";
import DictPage from "@src/pages/sysConf/dict";
import FormConditionPage from "@src/pages/sysConf/formCondition"; //过滤条件组装
import EventPage from "@src/pages/sysConf/event"; //事件主页

//业务系统
import LoginPage from "@src/pages/login";
import LayoutPage from "@src/pages/layout";

//erp
import LinkManPage from "@src/pages/erp/linkman";
import SupplierPage from "@src/pages/erp/supplier";
import CustomerPage from "@src/pages/erp/customer";
import ProductPage from "@src/pages/erp/product";
import OrderPurchasePage from "@src/pages/erp/orderPurchase";
import OrderSalePage from "@src/pages/erp/orderSale";

//plus
import ReportItemPage from "@src/plus/report/item"; //统计项
import ReportKpiPage from "@src/plus/report/kpi"; //指标
import ReportDesignPage from "@src/plus/report/design"; //报表设计器
import ReportPage from "@src/plus/common/ReportPage"; //配置的报表
export const allRoute: any[] = [
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
    ],
  },
  //通用模版页面
  {
    path: "/page",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="业务模版" auth />
    ),
    children: [
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={<MainTemplatePage />}
            titleId="模版"
            auth
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
            titleId="权限组管理"
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
        path: "event",
        element: (
          <WrapperRouteComponent
            element={<EventPage />}
            titleId="表单事件"
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
            titleId="模型管理"
            auth
          />
        ),
      },
      {
        path: "modelDesign/*",
        element: (
          <WrapperRouteComponent
            element={<ModelDesignPage />}
            titleId="模型设计"
            auth
          />
        ),
      },
      {
        path: "modelCode/*",
        element: (
          <WrapperRouteComponent
            element={<ModelCodePage />}
            titleId="模型代码"
            auth
          />
        ),
      },
      {
        path: "modelDetail/*",
        element: (
          <WrapperRouteComponent
            element={<ModelDetailPage />}
            titleId="模型明细"
            auth
          />
        ),
      },
      {
        path: "condition",
        element: (
          <WrapperRouteComponent
            element={<FormConditionPage />}
            titleId="过滤条件"
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
        path: "linkman",
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
          <WrapperRouteComponent
            element={<OrderSalePage />}
            titleId="销售单"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "/example",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="演示说明" auth />
    ),
    children: [
      {
        path: "crud/*",
        element: (
          <WrapperRouteComponent
            element={<ExamplePage />}
            titleId="入口"
            auth
          />
        ),
      },
    ],
  },
  // plus

  {
    path: "/plus",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="报表设置" />
    ),
    children: [
      {
        path: "report/item",
        element: (
          <WrapperRouteComponent
            element={<ReportItemPage />}
            titleId="统计项维护"
            auth
          />
        ),
      },
      {
        path: "report/kpi",
        element: (
          <WrapperRouteComponent
            element={<ReportKpiPage />}
            titleId="指标维护"
            auth
          />
        ),
      },
      {
        path: "report/design",
        element: (
          <WrapperRouteComponent
            element={<ReportDesignPage />}
            titleId="报表设计"
            auth
          />
        ),
      },
      {
        path: "report/table",
        element: (
          <WrapperRouteComponent
            element={<ReportPage />}
            titleId="配置结果"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
];

const RenderRouter: FC = () => {
  const [routeList, setRouteList] = useState<RouteObject[]>(allRoute);
  const element = useRoutes([...routeList]);

  // const element = useRoutes([...routeList]);

  // /**
  //  * 静态路由
  //  */
  // const routes = useMemo((): any => {
  //   return element;
  // }, [routeList]);

  return <AppProviders>{element}</AppProviders>;
};

export default RenderRouter;
