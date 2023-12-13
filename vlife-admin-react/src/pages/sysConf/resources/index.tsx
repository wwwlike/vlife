import React from "react";
import { listAll, save, saveResourcesStateDto } from "@src/api/SysResources";
import { VF } from "@src/dsl/VF";
import FormPage from "@src/pages/common/formPage";
import Content from "@src/pages/template/content";
/**
 * 资源管理
 */
export default () => {
  // return <FormPage className=" w-1/2" type="resourcesStateDto" />;
  return (
    <Content
      listType="sysResources"
      // filterType="sysResourcesPageReq"
      btns={[
        {
          title: "批量启用",
          actionType: "create",
          model: "resourcesStateDto",
          multiple: true, //用在全局
          // usableMatch: true, //任何场景都可用
          saveApi: (d) => saveResourcesStateDto(d[0]),
          reaction: [
            VF.then("resourcesIds").value(() => {
              return listAll({}).then((d) =>
                d.data?.filter((r) => r.state === "1").map((r) => r.id)
              );
            }),
          ],
        },
        // {
        //   title: "主接口设置",
        //   actionType: "create",
        //   model: "resourcesStateDto",
        //   multiple: true, //用在全局
        //   saveApi: (d) => saveResourcesStateDto(d[0]),
        //   reaction: [
        //     VF.then("resourcesIds").value(() => {
        //       return listAll({}).then((d) =>
        //         d.data?.filter((r) => r.menuRequired).map((r) => r.id)
        //       );
        //     }),
        //   ],
        // },
        {
          title: "完善",
          actionType: "edit",
          model: "sysResources",
          saveApi: save,
        },
        {
          title: "启用",
          actionType: "api",
          // model: "sysResources",
          usableMatch: { state: "-1" },
          onSaveBefore(data) {
            return { ...data, state: "1" };
          },
          saveApi: save,
        },
        {
          title: "停用",
          actionType: "api",
          // model: "sysResources",
          onSaveBefore(data) {
            return { ...data, state: "-1" };
          },
          saveApi: save,
          usableMatch: { state: "1" },
        },
      ]}
    />
  );
};
