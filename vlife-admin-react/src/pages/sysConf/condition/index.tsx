import React from "react";
import { ReportCondition } from "@src/api/ReportCondition";
import { VF } from "@src/dsl/VF";
import Content from "@src/pages/template/content";
/**
 * 视图设计主页
 */
export default () => {
  return (
    <Content<ReportCondition>
      listType="reportCondition"
      filterType="reportConditionPageReq"
      editType={{
        type: "reportCondition",
        reaction: [
          VF.field("sysMenuId").change().then("formId").clearValue(),
          VF.field("formId").change().then("conditionJson").clearValue(),
          VF.field("formId").isNull().then("conditionJson").hide(),
          VF.field("id").isNotNull().then("formId", "sysMenuId").readPretty(),
          VF.then("sysUserId").hide(),
        ],
      }}
    />
  );
};
