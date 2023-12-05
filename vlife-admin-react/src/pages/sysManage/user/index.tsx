import React, { useEffect } from "react";
import {
  flow,
  remove,
  reset,
  save,
  SysUser,
  validateName,
} from "@src/api/SysUser";
import { IconPlay, IconForward, IconStop } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { useAuth } from "@src/context/auth-context";
import TablePage from "@src/pages/common/tablePage";
//用户管理主页
export default () => {
  const { user } = useAuth();
  return (
    <Content<SysUser>
      listType="sysUser"
      filterType="sysUserPageReq"
      reaction={[
        // VF.field("name")
        //   .eq("12345")
        //   .then("usetype")
        //   .componentProps({ optionList: [{ label: "a", value: 123 }] }),
        VF.result(user?.superUser === true)
          .then("superUser")
          .hide(),
        VF.field("username")
          .regex(/^[a-zA-Z0-9]+$/)
          .then("username")
          .feedback("不能包含特殊字符串"),
        VF.result(validateName).then("name").feedback("姓名不合理"), //远程验证
      ]}
      btns={[
        {
          title: "新增",
          actionType: "create",
          saveApi: save,
        },
        {
          title: "修改",
          actionType: "edit",
          saveApi: save,
        },
        {
          title: "删除",
          actionType: "api",
          usableMatch: { status: "1" },
          multiple: true,
          onSaveBefore(data: SysUser[]) {
            return data.map((d) => d.id);
          },
          saveApi: remove,
        },
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
          // disabledHide: true,
          // submitConfirm: true,
          model: "sysUser",
          onSaveBefore(data: SysUser) {
            return { id: data.id, state: "-1" };
          },
          saveApi: flow,
        },
        {
          title: "启用",
          icon: <IconPlay />,
          actionType: "api",
          usableMatch: { state: "-1" },
          disabledHide: true,
          // submitConfirm: false,
          model: "sysUser",
          onSaveBefore(data: SysUser) {
            return { id: data.id, state: "1" };
          },
          saveApi: flow,
        },
      ]}
    />
  );
};
