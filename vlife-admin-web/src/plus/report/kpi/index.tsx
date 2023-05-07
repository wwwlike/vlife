import { ReportKpi } from "@src/api/report/ReportKpi";
import Content from "@src/pages/template/content";
import React from "react";

export default () => {
  return (
    <Content<ReportKpi> entityType="reportKpi" filterType="reportKpiPageReq" />
  );
};
