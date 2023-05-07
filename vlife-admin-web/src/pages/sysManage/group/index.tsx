import React from "react";
import { SysGroup } from "@src/api/SysGroup";
import { useAuth } from "@src/context/auth-context";
import Content from "../../template/content";

export default () => {
  const { clearModelInfo } = useAuth();
  return (
    <Content<SysGroup>
      entityType="sysGroup"
      listType="sysGroup"
      editType="groupDto"
      filterType="sysGroupPageReq"
      onAfterSave={(key: string, data: any) => {
        if (key === "save") {
          clearModelInfo();
        }
      }}
      lineBtn={
        [
          // {
          //   title: "数据权限",
          //   tooltip: "设置各模块独立行级数据过滤权限",
          //   model: {
          //     title: "数据权限",
          //     entityType: "sysGroup",
          //     type: "groupFilterDto",
          //   },
          // },
        ]
      }
    />
  );
};
