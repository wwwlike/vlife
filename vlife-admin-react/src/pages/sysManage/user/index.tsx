import React from "react";
import { remove, reset, save, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconForward, IconStop } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { useAuth } from "@src/context/auth-context";

export default () => {
  const { user } = useAuth();
  return (
    <Content<SysUser>
      listType="sysUser"
      tabDictField="usetype"
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
          req: { state: "-1" },
        },
        {
          itemKey: "dept",
          icon: <i className="  icon-group" />,
          tab: "本部门",
          req: { sysDeptId: user?.sysDeptId },
        },
      ]}
      filterType="sysUserPageReq"
      reaction={[
        // VF.field("name").eq("12345").then("usetype").componentProps({
        //   test: "12345",
        // }),
        VF.result(user?.superUser === true)
          .then("superUser")
          .hide(),
        VF.field("username")
          .regex(/^[a-zA-Z0-9]+$/)
          .then("username")
          .feedback("不能包含特殊字符串"),
      ]}
      otherBtns={[
        // {
        //   title: "新增",
        //   actionType: "create",
        //   saveApi: save,
        // },
        // {
        //   title: "修改",
        //   actionType: "edit",
        //   saveApi: save,
        // },
        // {
        //   title: "删除",
        //   actionType: "api",
        //   usableMatch: { status: "1" },
        //   multiple: true,
        //   onSaveBefore(data: SysUser[]) {
        //     return data.map((d) => d.id);
        //   },
        //   saveApi: remove,
        // },
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
          actionType: "api",
          usableMatch: { state: "1" },
          model: "sysUser",
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
          model: "sysUser",
          onSaveBefore(data: SysUser) {
            return { id: data.id, state: "1" };
          },
          saveApi: state,
        },
      ]}
    />
  );
};
