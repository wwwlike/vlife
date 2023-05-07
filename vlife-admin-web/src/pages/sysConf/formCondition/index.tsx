import { FormCondition } from "@src/api/FormCondition";
import Content from "@src/pages/template/content";
import React from "react";
export default () => {
  return (
    <Content<FormCondition>
      filterType="formConditionPageReq"
      entityType={"formCondition"}
    />
  );
};
