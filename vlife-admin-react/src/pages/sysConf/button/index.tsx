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
  // const { resources } = useAuth();
  // const [data, setData] = useState<any[]>([]);
  return (
    <TablePage
      listType="button"
      // addTabAble={true}
      btns={[
        {
          title: "表单配置",
          actionType: "click",
          icon: <i className=" icon-table" />,
          model: "button",
          multiple: false,
          reaction: [
            VF.result((a) => {
              return true;
            })
              .then("id", "name")
              .value("1"),
          ],
          // disabledHide: true,
          usableMatch: (d: any) => {
            return d.model !== null;
          },
          // datas: [{ ...props }],
          onClick: (d) => {
            // alert(d.model);
            const el = "navigate(`/sysConf/buttonFormConf?buttonId=${d.id}`);";
            eval(el);
            // 跳转到 /page-b
          },
        },
      ]}
    />
  );
};
