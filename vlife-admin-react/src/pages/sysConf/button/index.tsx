import React, { useState } from "react";
import Content from "@src/pages/template/content";
import { result } from "lodash";
import BtnToolBar from "@src/components/button/BtnToolBar";
import { useAuth } from "@src/context/auth-context";
import TablePage from "@src/pages/common/tablePage";
import { useNavigate } from "react-router-dom";
import { VF } from "@src/dsl/VF";

export default () => {
  const navigate = useNavigate();
  return (
    <TablePage
      listType="button"
      btns={[
        {
          title: "表单配置",
          actionType: "click",
          icon: <i className=" icon-table" />,
          model: "button",
          multiple: false,
          usableMatch: (d: any) => {
            return d.model !== null;
          },
          onClick: (d) => {
            const el =
              "navigate(`/sysConf/buttonFormDesign?buttonId=${d.id}`);";
            eval(el);
          },
        },
      ]}
    />
  );
};
