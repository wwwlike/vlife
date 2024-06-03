import React, { useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";

import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@douyinfe/semi-icons";
import { SysMenu } from "@src/api/SysMenu";
const { Header } = Layout;

export default ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <Header className="layout-header shadow">
      <Nav
        mode={"horizontal"}
        header={
          <div className=" flex items-center  space-x-3">
            <IconArrowLeft
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate(-1);
              }}
            />
            <div className=" text-base font-bold ">{title}</div>
          </div>
        }
        footer={<></>}
      ></Nav>
    </Header>
  );
};
