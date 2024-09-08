import React, { Suspense } from "react";
import { Layout } from "@douyinfe/semi-ui";
import Header from "./components/header";
import Sider from "./components/sider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SuspendFallbackLoading from "../../components/fallback-loading";
import FormModal from "../common/modal/formModal";
import VlifeModal from "../common/modal/vlifeModal";
import ConfirmModal from "../common/modal/confirmModal";
import FullScreenHeader from "./components/header/FullScreenHeader";
import { useAuth } from "@src/context/auth-context";
const { Content } = Layout;
const Index: React.FC = () => {
  const { allMenus, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const singlePage =
    pathname !== "/" &&
    !allMenus?.map((m) => m.routerAddress).includes(pathname);

  if (singlePage && pathname.includes("/vlife/")) {
    navigate("/403");
  }

  return (
    <Layout className="layout-page">
      {/**/}
      {singlePage ? (
        <>
          {/* <FullScreenHeader title={""} /> */}
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
          <Header />
          <Layout>
            <Sider />
            <Content className="layout-content bg-gray-50 pl-2 pt-2 pr-2">
              <Suspense
                fallback={<SuspendFallbackLoading message="正在加载中" />}
              >
                <Outlet />
              </Suspense>
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
