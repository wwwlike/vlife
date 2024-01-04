import React from "react";
import {
  detailMenuResourcesDto,
  saveMenuResourcesDto,
  SysMenu,
} from "@src/api/SysMenu";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { IconRegExp } from "@douyinfe/semi-icons";

export default () => {
  return (
    <Content<SysMenu>
      filterType="sysMenuPageReq"
      listType="sysMenu"
      reaction={[
        VF.field("app")
          .eq(true)
          .then("url", "formId", "placeholderUrl", "pcode", "confPage")
          .hide()
          .clearValue()
          .then("name")
          .title("应用名称")
          .otherwise("name")
          .title("菜单名称"),
        VF.field("confPage")
          .eq(true)
          .or("app")
          .eq(true)
          .then("url", "formId", "placeholderUrl")
          .hide()
          .clearValue(),
        VF.field("confPage").eq(true).then("pageLayoutId").show(),
        // .otherwise("pageLayoutId")
        // .clearValue(),
        VF.field("url")
          .endsWidth("*")
          .then("placeholderUrl")
          .show()
          .then("placeholderUrl")
          .required(),
      ]}
      otherBtns={[
        {
          // title: "权限",
          // actionType: "edit",
          // model: "menuResourcesDto",
          // saveApi: saveMenuResourcesDto,
          title: "权限关联",
          actionType: "edit",
          icon: <IconRegExp />,
          model: "menuResourcesDto",
          loadApi: (d) => detailMenuResourcesDto({ id: d.id }),
          saveApi: saveMenuResourcesDto,
        },
      ]}
    />
  );
};
