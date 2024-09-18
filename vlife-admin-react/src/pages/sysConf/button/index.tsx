import React from "react";
import TablePage from "@src/pages/common/tablePage";
import { useNavigate } from "react-router-dom";

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
