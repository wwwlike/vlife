import React, { lazy, FC } from "react";
import { RouteObject } from "react-router";
import { useRoutes } from "react-router-dom";
import { WrapperRouteComponent , WrapperRouteWithOutLayoutComponent} from "./config";
import LayoutPage from '../pages/layout'
import Empty from '@src/components/empty'
import LoginPage from '@src/pages/login'
import { AppProviders } from '@src/context';
/**
 * 这里是路由配置页面
 * menu\config.ts 是菜单内容的配置信息
 */
const TemplatePage = lazy(() => import('../pages/template'))
const DashboardWorkbeach = lazy(() => import('../pages/dashboard/workbeach'))
const Quickstart = lazy(() => import('../pages/guide/quickstartMp4'))



const UserPage = lazy(() => import('../pages/sys/user'))
const DictPage = lazy(() => import('../pages/sys/dict'))
const ResourcesPage = lazy(() => import('../pages/auth/resources'))
const RolePage = lazy(() => import('@src/pages/auth/role'))
const GroupPage = lazy(() => import('@src/pages/auth/group'))
const Abnormal403 = lazy(() => import('@src/pages/abnormal/403'))
const Abnormal404 = lazy(() => import('@src/pages/abnormal/404'))
const Abnormal500 = lazy(() => import('@src/pages/abnormal/500'))
const routeList: RouteObject[] = [
	{
		path: '/',
		element: <WrapperRouteComponent element={<LayoutPage />} titleId="" auth />,
		children: [
			{
				path: 'sys/user',
				element: <WrapperRouteComponent element={<UserPage />} titleId="用户管理" auth />
			},
			{
				path: 'sys/dict',
				element: <WrapperRouteComponent element={<DictPage />} titleId="字典管理" auth />
			},
			{
				path: 'auth/resources',
				element: <WrapperRouteComponent element={<ResourcesPage />} titleId="资源管理" auth />
			},
			{
				path: 'auth/role',
				element: <WrapperRouteComponent element={<RolePage />} titleId="角色管理" auth />
			},	
			{
				path: 'auth/group',
				element: <WrapperRouteComponent element={<GroupPage />} titleId="权限组管理" auth />
			},
			{
				path: 'template/*',
				element: <WrapperRouteComponent element={<TemplatePage />} titleId="动态模板" auth />
			},
			{
				path: 'oa/project',
				element: <WrapperRouteComponent element={<TemplatePage />} titleId="项目管理" auth />
			},
			{
				path: 'sys/sysDept',
				element: <WrapperRouteComponent element={<TemplatePage />} titleId="部门管理" auth />
			},
			{
				path: 'sys/sysOrg',
				element: <WrapperRouteComponent element={<TemplatePage />} titleId="机构管理" auth />
			},
			{
				path: 'sys/sysArea',
				element: <WrapperRouteComponent element={<TemplatePage />} titleId="地区管理" auth />
			},
			{
				path: 'dashboard/workbeach',
				element: <WrapperRouteComponent element={<DashboardWorkbeach />} titleId="工作台" auth />
			},
			{
				path: 'guide/quickStart',
				element: <WrapperRouteComponent element={<Quickstart />} titleId="视频介绍" auth />
			},
			{
				path: 'abnormal/403',
				element: <WrapperRouteComponent element={<Abnormal403 />} titleId="403" auth />
			},
			{
				path: 'abnormal/404',
				element: <WrapperRouteComponent element={<Abnormal404 />} titleId="404" auth />
			},
			{
				path: 'abnormal/500',
				element: <WrapperRouteComponent element={<Abnormal500 />} titleId="500" auth />
			}
		]
	},
	{
		path: 'login',
		element: <WrapperRouteWithOutLayoutComponent element={<LoginPage />} titleId="VLIFE快速开发平台" />
	},
	{
		path: '*',
		element: (
			<WrapperRouteWithOutLayoutComponent
				element={<Empty title="找不到咯" description="这里什么也没有~" type="404" />}
				titleId="404"
			/>
		)
	}
]

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return 	<AppProviders>{element}</AppProviders>;
};

export default RenderRouter;
