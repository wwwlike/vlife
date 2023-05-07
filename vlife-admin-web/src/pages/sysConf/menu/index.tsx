import React from "react";
import { SysMenu } from "@src/api/SysMenu";
import Content from "../../template/content";

export default () => {
  return <Content<SysMenu> filterType="sysMenuPageReq" entityType="sysMenu" />;
};
