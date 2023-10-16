import React from "react";
import { SysGroup } from "@src/api/SysGroup";
import Content from "../../template/content";
export default () => {
  return (
    <Content<SysGroup>
      listType="sysGroup"
      editType="groupDto"
      filterType="sysGroupPageReq"
    />
  );
};
