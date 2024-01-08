import React from "react";
import { list, save, saveResourcesStateDto } from "@src/api/SysResources";
import { VF } from "@src/dsl/VF";
import FormPage from "@src/pages/common/formPage";
import Content from "@src/pages/template/content";
import { OptEnum } from "@src/dsl/base";
/**
 * 资源管理
 */
export default () => {
  // return <FormPage className=" w-1/2" type="resourcesStateDto" />;
  return (
    <Content
      listType="sysResources"
      tabList={[
        {
          tab: "待启用",
          itemKey: "menuNull",
          req: [{ fieldName: "sysMenuId", opt: OptEnum.isNull }],
        },
        {
          tab: "已启用",
          itemKey: "menuisNotNull",
          req: [{ fieldName: "sysMenuId", opt: OptEnum.isNotNull }],
        },
      ]}
      // filterType="sysResourcesPageReq"
      btns={[
        // {
        //   title: "批量启用",
        //   actionType: "create",
        //   model: "resourcesStateDto",
        //   multiple: true, //用在全局
        //   // usableMatch: true, //任何场景都可用
        //   saveApi: (d) => saveResourcesStateDto(d[0]),
        //   reaction: [
        //     VF.then("resourcesIds").value(() => {
        //       return list({}).then((d) =>
        //         d.data?.filter((r) => r.state === "1").map((r) => r.id)
        //       );
        //     }),
        //   ],
        // },
        {
          title: "编辑",
          actionType: "edit",
          model: "sysResources",
          saveApi: save,
        },
      ]}
    />
  );
};
