import React, { Suspense } from "react";
import { Layout } from "@douyinfe/semi-ui";
import Header from "./components/header";
import Sider from "./components/sider";
import { Outlet } from "react-router-dom";
import SuspendFallbackLoading from "../../components/fallback-loading";
import FormModal from "../common/modal/formModal";
import VlifeModal from "../common/modal/vlifeModal";
import ConfirmModal from "../common/modal/confirmModal";
import FullScreenHeader from "./components/header/FullScreenHeader";
const { Content } = Layout;
const Index: React.FC = () => {
  const fullTitle = new URLSearchParams(location.search).get("fullTitle");
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
