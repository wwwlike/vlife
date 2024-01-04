import React from "react";
import { IllustrationNoAccess } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";

export default () => {
  return (
    <Empty
      image={<IllustrationNoAccess />}
      title={"没有权限"}
      description={
        "在角色管理里关联了新的权限或者权限组关联了新的角色，都需要重启后台服务"
      }
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};
