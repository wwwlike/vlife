import React from "react";
import { SysRole } from "@src/api/SysRole";
import { VF } from "@src/components/form/VF";
import Content from "../../template/content";

export default () => {
  return (
    <Content<SysRole>
      listType="sysRole"
      editType="roleDto"
      filterType="sysRolePageReq"
      reaction={[
        VF.field("sysMenuId").isNull().then("resourcesAndMenuIds").hide(),
        VF.field("sysMenuId").change().then("resourcesAndMenuIds").value([]),
      ]}
    />
  );
};
