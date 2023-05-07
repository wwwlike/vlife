import { SysRole } from "@src/api/SysRole";
import React from "react";
import Content from "../../template/content";

export default () => {
  return (
    <Content<SysRole>
      entityType="sysRole"
      listType="sysRole"
      editType="roleDto"
      filterType="sysRolePageReq"
    />
  );
};
