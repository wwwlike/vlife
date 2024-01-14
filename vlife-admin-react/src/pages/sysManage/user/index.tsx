import React from "react";
import { reset, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconForward, IconStop } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { useAuth } from "@src/context/auth-context";
import { OptEnum } from "@src/dsl/base";
export default () => {
  const { user } = useAuth();
  return (
    <Content<SysUser>
      listType="sysUser"
      // tabDictField="state"
      // filterType="sysUserPageReq"
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
      otherBtns={[
        {
          title: "密码重置",
          actionType: "api",
          icon: <IconForward />,
          multiple: true,
          onSaveBefore(data: SysUser[]) {
            return data.map((d) => d.id);
          },
          saveApi: reset,
        },
        {
          title: "停用",
          icon: <IconStop />,
          disabledHide: true,
          actionType: "api",
          usableMatch: { state: "1" },
          // model: "sysUser",
          onSaveBefore(data: SysUser) {
            return { id: data.id, state: "-1" };
          },
          saveApi: state,
        },
        {
          title: "启用",
          icon: <IconPlay />,
          actionType: "api",
          usableMatch: { state: "-1" },
          disabledHide: true,
          // model: "sysUser",
          onSaveBefore(data: SysUser) {
            return { id: data.id, state: "1" };
          },
          saveApi: state,
        },
      ]}
    />
  );
};
