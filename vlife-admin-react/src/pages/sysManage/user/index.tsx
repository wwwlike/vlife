import React from "react";
import { remove, reset, save, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconForward, IconStop } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { useAuth } from "@src/context/auth-context";
import { OptEnum } from "@src/dsl/base";
export default () => {
  const { user } = useAuth();
  return (
    <Content<SysUser>
      listType="sysUser"
      // tabDictField="state"
      tabList={[
        {
          itemKey: "state1",
          icon: <i className="  icon-user_Review" />,
          tab: "已启用",
          req: { state: "1" },
        },
        {
          itemKey: "state-1",
          icon: <i className="  icon-user_activation" />,
          tab: "已停用",
          req: [{ fieldName: "state", opt: OptEnum.eq, value: ["-1"] }],
        },
      ]}
      // filterType="sysUserPageReq"
      reaction={[
        // VF.result(user?.superUser !== true)
        //   .then("superUser")
        //   .hide(),
        VF.field("username")
          .regex(/^[a-zA-Z0-9]+$/)
          .then("username")
          .feedback("不能包含特殊字符串"),
      ]}
    />
  );
};
