import React from "react";
import Content from "../../template/content";
import { SysDict } from "@src/api/SysDict";

export default () => {
  return (
    <Content<SysDict>
      title="字典"
      entityType="sysDict"
      filterType="sysDictPageReq"
    ></Content>
  );
};
