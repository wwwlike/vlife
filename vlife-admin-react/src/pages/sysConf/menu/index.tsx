import React from "react";
import {
  detailMenuResourcesDto,
  remove,
  save,
  saveMenuResourcesDto,
  SysMenu,
} from "@src/api/SysMenu";
import Content from "../../template/content";
import { VF } from "@src/dsl/VF";
import { IconEdit, IconRegExp } from "@douyinfe/semi-icons";

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
      btns={[
        {
          title: "创建应用",
          actionType: "create",
          model: "sysMenu",
          saveApi: save,
          reaction: [
            VF.then("app").value(true).hide(),
            VF.then("url", "formId", "placeholderUrl", "pcode", "confPage")
              .hide()
              .clearValue(),
            VF.then("name").title("应用名称"),
          ],
        },
        {
          title: "创建菜单",
          actionType: "create",
          model: "sysMenu",
          saveApi: save,
          reaction: [
            VF.then("app").value(false).hide(),
            VF.field("confPage")
              .eq(true)
              .then("url", "formId", "placeholderUrl")
              .hide()
              .clearValue(),
            VF.field("confPage").eq(true).then("pageLayoutId").show(),
            VF.field("url")
              .endsWidth("*")
              .then("placeholderUrl")
              .show()
              .then("placeholderUrl")
              .required(),
          ],
        },
        {
          title: "编辑",
          actionType: "edit",
          icon: <IconEdit />,
          model: "sysMenu",
          saveApi: save,
        },
        {
          title: "删除",
          actionType: "api",
          usableMatch: { status: "1" },
          multiple: true,
          onSaveBefore(data: SysMenu[]) {
            return data.map((d) => d.id);
          },
          saveApi: remove,
        },
        {
          title: "权限关联",
          actionType: "edit",
          // disabledHide: true,
          usableMatch: (...datas: SysMenu[]) => {
            return datas[0]?.formId !== undefined && datas[0]?.formId !== null;
          },
          icon: <IconRegExp />,
          model: "menuResourcesDto",
          loadApi: (d) => detailMenuResourcesDto({ id: d.id }),
          saveApi: saveMenuResourcesDto,
        },
      ]}
    />
  );
};
