import React, { Suspense } from "react";
import { Layout } from "@douyinfe/semi-ui";
import Header from "./components/header";
import Sider from "./components/sider";
import { Outlet } from "react-router-dom";
import SuspendFallbackLoading from "../../components/fallback-loading";
import FormModal from "../common/modal/formModal";
import VlifeModal from "../common/modal/vlifeModal";
import ConfirmModal from "../common/modal/confirmModal";
// import TableModal from "../common/tableModal";
// import FormModal from "../common/formModal";
// import ConfirmModal from "../common/confirmModal";
// import VlifeModal from "../common/vlifeModal";
// import Mp4Modal from "../common/mp4Modal";
const { Content } = Layout;

const Index: React.FC = () => {
  // overflow-hidden
  return (
    <Layout className="layout-page">
      <Header />
      <Layout>
        <Sider />
        <Content className="layout-content">
          <Suspense fallback={<SuspendFallbackLoading message="正在加载中" />}>
            <Outlet />
          </Suspense>
        </Content>
        {/* <Footer /> */}
      </Layout>
      {/* 基于formily的动态表单 */}
      <FormModal />
      <VlifeModal />
      <ConfirmModal />
      {/* 
      <TableModal />

      <Mp4Modal />
       */}
    </Layout>
  );
};

export default Index;
