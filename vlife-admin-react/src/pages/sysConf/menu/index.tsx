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
import { IconRegExp } from "@douyinfe/semi-icons";

export default () => {
  return (
    <Content<SysMenu>
      filterType="sysMenuPageReq"
      listType="sysMenu"
      btns={[
        {
          title: "应用",
          actionType: "save",
          model: "sysMenu",
          usableMatch: { app: true },
          disabledHide: true,
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
          title: "菜单",
          actionType: "save",
          model: "sysMenu",
          saveApi: save,
          usableMatch: { app: false },
          disabledHide: true,
          reaction: [
            VF.then("app").value(false).hide(),
            VF.field("confPage")
              .eq(true)
              .then("url", "formId", "placeholderUrl")
              .hide()
              .clearValue(),
            VF.result((sysMenu: any) => {
              return sysMenu?.url && sysMenu.url.indexOf("*") !== -1;
            })
              .then("formId")
              .required(),
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
          reaction: [VF.then("id").hide(), VF.then("formId").hide()],
          icon: <IconRegExp />,
          model: "menuResourcesDto",
          loadApi: (d) => detailMenuResourcesDto({ id: d.id }),
          saveApi: saveMenuResourcesDto,
        },
      ]}
    />
  );
};
