import React from "react";
import { SysMenu } from "@src/api/SysMenu";
import Content from "../../template/content";
import { VF } from "@src/components/form/VF";

export default () => {
  return (
    <Content<SysMenu>
      filterType="sysMenuPageReq"
      listType="sysMenu"
      reaction={[
        VF.field("app")
          .eq(true)
          .then("url", "entityType", "placeholderUrl", "pcode", "confPage")
          .hide()
          .clearValue()
          .then("name")
          .title("应用名称")
          .then("entityPrefix")
          .show()
          .otherwise("name")
          .title("菜单名称"),
        VF.field("url")
          .endsWidth("*")
          .then("placeholderUrl")
          .show()
          .then("placeholderUrl")
          .required(),
      ]}
    />
  );
};
