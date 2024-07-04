import React from "react";
import { move, reset, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconForward, IconStop } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { useAuth } from "@src/context/auth-context";

export default () => {
  const { user } = useAuth();
  return (
    <Content<SysUser>
      listType="sysUser"
      tabDictField="state"
      dataImp={true}
      filterType="sysUserPageReq"
      // tabList={[
      //   {
      //     itemKey: "sysTab_1",
      //     tab: "用户tab页签名称",
      //     req: { username: "vlife" },
      //   },
      // ]}
      editType={{
        type: "sysUser",
        reaction: [
          VF.result(user?.superUser === true)
            .then("superUser")
            .show(),
        ],
      }}
      // filterType="sysUserPageReq"
      // tabList={[
      //   {
      //     itemKey: "state1",
      //     icon: <i className="  icon-user_Review" />,
      //     tab: "已启用",
      //     req: { state: "1" },
      //   },
      //   {
      //     itemKey: "state-1",
      //     icon: <i className="  icon-user_activation" />,
      //     tab: "已停用",
      //     req: [{ fieldName: "state", opt: OptEnum.eq, value: ["-1"] }],
      //   },
      // ]}
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
          title: "数据迁移",
          actionType: "edit",
          icon: <IconForward />,
          model: "userDataMoveDto",
          multiple: true,
          // submitConfirm: true,
          onFormBefore(data: SysUser[]) {
            return { ids: data.map((d) => d.id) };
          },
          saveApi: move,
        },
        {
          title: "停用",
          icon: <IconStop />,
          disabledHide: true,
          actionType: "api",
          usableMatch: { state: "1" },
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
          onSaveBefore(data: SysUser) {
            return { id: data.id, state: "1" };
          },
          saveApi: state,
        },
      ]}
    />
  );
};
