import React, { lazy, FC, useState } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import {
  WrapperRouteComponent,
  WrapperRouteWithOutLayoutComponent,
} from "./config";
import { AppProviders } from "@src/context";
import Empty from "@src/pages/common/Empty";
import Visit403 from "@src/pages/common/Visit403";
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
//示例
const Form1Page = lazy(() => import("@src/pages/example/form/Form1"));
const Form2Page = lazy(() => import("@src/pages/example/form/Form2"));
const Form3Page = lazy(() => import("@src/pages/example/form/Form3"));
const Form4Page = lazy(() => import("@src/pages/example/form/Form4"));
const List1Page = lazy(() => import("@src/pages/example/list/List1"));
const List2Page = lazy(() => import("@src/pages/example/list/List2"));
const List3Page = lazy(() => import("@src/pages/example/list/List3"));
const List4Page = lazy(() => import("@src/pages/example/list/List4"));
const Page1Page = lazy(() => import("@src/pages/example/page/Page1"));
const Page2Page = lazy(() => import("@src/pages/example/page/Page2"));
//demo项目管理
const ProjectPage = lazy(() => import("@src/pages/demo/project"));

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
            titleId="所有实体通用模版(单实体CRUD可用)"
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
            titleId="部门维护"
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
    path: "/demo",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="项目管理" auth />
    ),
    children: [
      {
        path: "project",
        element: (
          <WrapperRouteComponent
            element={<ProjectPage />}
            titleId="项目管理"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "/example",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="组件演示" auth />
    ),
    children: [
      {
        path: "form1",
        element: (
          <WrapperRouteComponent
            element={<Form1Page />}
            titleId="简单表单"
            auth
          />
        ),
      },
      {
        path: "form2",
        element: (
          <WrapperRouteComponent
            element={<Form2Page />}
            titleId="关联表单"
            auth
          />
        ),
      },
      {
        path: "form3",
        element: (
          <WrapperRouteComponent
            element={<Form3Page />}
            titleId="表单联动"
            auth
          />
        ),
      },
      {
        path: "form4",
        element: (
          <WrapperRouteComponent
            element={<Form4Page />}
            titleId="表单校验"
            auth
          />
        ),
      },
      {
        path: "list1",
        element: (
          <WrapperRouteComponent
            element={<List1Page />}
            titleId="常规列表"
            auth
          />
        ),
      },
      {
        path: "list2",
        element: (
          <WrapperRouteComponent
            element={<List2Page />}
            titleId="工具栏按钮"
            auth
          />
        ),
      },
      {
        path: "list3",
        element: (
          <WrapperRouteComponent
            element={<List3Page />}
            titleId="列表按钮"
            auth
          />
        ),
      },
      {
        path: "list4",
        element: (
          <WrapperRouteComponent
            element={<List4Page />}
            titleId="详情页按钮"
            auth
          />
        ),
      },
      {
        path: "page1",
        element: (
          <WrapperRouteComponent
            element={<Page1Page />}
            titleId="项目管理1"
            auth
          />
        ),
      },
      {
        path: "page2",
        element: (
          <WrapperRouteComponent
            element={<Page2Page />}
            titleId="项目管理2"
            auth
          />
        ),
      },
    ],
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
