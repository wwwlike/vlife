import React from "react";
import { SysRole } from "@src/api/SysRole";
import { VF } from "@src/dsl/VF";
import Content from "../../template/content";

export default () => {
  return (
    <Content<SysRole>
      listType="sysRole"
      editType="roleDto"
      reaction={[
        VF.field("sysMenuId").isNull().then("resourcesAndMenuIds").hide(),
        VF.field("sysMenuId").change().then("resourcesAndMenuIds").value([]),
      ]}
    />
  );
};
