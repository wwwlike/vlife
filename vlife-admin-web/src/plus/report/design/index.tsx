import { ReportTable } from "@src/api/report/ReportTable";
import Content from "@src/pages/template/content";
import React from "react";

export default () => {
  return (
    <Content<ReportTable>
      entityType="reportTable"
      listType="reportTable"
      filterType="reportTablePageReq"
      editType="reportTableSaveDto"
    ></Content>
  );
};
