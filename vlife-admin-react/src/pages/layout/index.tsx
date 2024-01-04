import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Layout } from "@douyinfe/semi-ui";
import Header from "./components/header";
import Sider from "./components/sider";
import { Outlet, useLocation } from "react-router-dom";
import SuspendFallbackLoading from "../../components/fallback-loading";
import FormModal from "../common/modal/formModal";
import VlifeModal from "../common/modal/vlifeModal";
import ConfirmModal from "../common/modal/confirmModal";
import { MenuVo, SysMenu } from "@src/api/SysMenu";
import { useAuth } from "@src/context/auth-context";
import { findSubs, findTreeRoot } from "@src/util/func";
import FullScreenHeader from "./components/header/FullScreenHeader";
const { Content } = Layout;

const Index: React.FC = () => {
  const { pathname } = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fullTitle = searchParams.get("fullTitle") || undefined;
  const userMenus: MenuVo[] = useAuth().user?.menus || []; //所有菜单
  const apps: MenuVo[] = //所有应用
    useAuth()
      .user?.menus.filter((m) => m.app === true)
      ?.sort((a, b) => a.sort - b.sort) || [];

  const [currApp, setCurrApp] = useState<MenuVo>(); //当前应用
  const [currMenu, setCurrMenu] = useState<MenuVo>(); //当前菜单

  useEffect(() => {
    const menu = userMenus.filter(
      (m) =>
        pathname.indexOf(
          m.url?.endsWith("*") ? m.url.replace("*", m.placeholderUrl) : m.url
        ) !== -1
    )?.[0];
    if (currMenu === undefined && menu) {
      setCurrMenu(menu);
      setCurrApp(findTreeRoot(userMenus, menu));
    }
  }, [currMenu, pathname]);

  const currAppMenuList = useMemo(() => {
    if (userMenus && userMenus.length > 0 && currApp) {
      return findSubs(userMenus, currApp);
    } else {
      return [];
    }
  }, [userMenus, currApp]);

  return (
    <Layout className="layout-page">
      {fullTitle ? (
        <>
          <FullScreenHeader title={fullTitle} />
          <Content className="layout-content bg-gray-50 pl-2 pt-2 pr-2">
            <Suspense
              fallback={<SuspendFallbackLoading message="正在加载中" />}
            >
              <Outlet />
            </Suspense>
            {/* <Scrollbars autoHide={true}></Scrollbars> */}
          </Content>
        </>
      ) : (
        <>
          <Header
            appMenus={apps}
            outApp={currApp}
            onAppClick={(app) => {
              setCurrApp(app);
              if (!app.url) {
              }
            }}
          />
          <Layout>
            <Sider
              menus={currAppMenuList}
              app={currApp}
              onClick={setCurrMenu}
            />
            <Content className="layout-content bg-gray-50 pl-2 pt-2 pr-2">
              <Suspense
                fallback={<SuspendFallbackLoading message="正在加载中" />}
              >
                <Outlet />
              </Suspense>
              {/* <Scrollbars autoHide={true}></Scrollbars> */}
            </Content>
          </Layout>
        </>
      )}
      <FormModal />
      <VlifeModal />
      <ConfirmModal />
    </Layout>
  );
};

export default Index;
