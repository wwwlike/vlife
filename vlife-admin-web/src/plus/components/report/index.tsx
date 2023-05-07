import Table from "@douyinfe/semi-ui/lib/es/table";
import { ReportItem } from "@src/api/report/ReportItem";
import { ReportKpi } from "@src/api/report/ReportKpi";
import { ReportTableSaveDto } from "@src/api/report/ReportTable";
import React, { useCallback, useEffect, useMemo } from "react";

interface ReportTableProps {
  currReportTable: Partial<ReportTableSaveDto>;
  reportData?: any[];
  allReportItem: ReportItem[];
  allReportKpi: ReportKpi[];
}

const ReportTable = ({
  currReportTable,
  allReportItem,
  allReportKpi,
  reportData,
  ...props
}: ReportTableProps) => {
  const findItem = useCallback(
    (id: string): ReportItem => {
      return allReportItem.filter((item) => item.id === id)[0];
    },
    [allReportItem]
  );

  const findKpi = useCallback(
    (id: string): ReportKpi => {
      return allReportKpi.filter((kpi) => kpi.id === id)[0];
    },
    [allReportKpi]
  );

  const groupTitle = (code: string): string => {
    const codes: string[] = code.split("_");
    let title = "";
    codes.forEach((c) => {
      if (c === "sysUserId") {
        title += "用户";
      } else if (c === "sysDeptId") {
        title += "部门";
      } else if (c === "sysAreaId") {
        title += "地区";
      } else if (c === "createDate") {
        title += "日期";
      } else if (c === "sysOrgId") {
        title += "机构";
      } else if (c === "ji") {
        title += "(季)";
      } else if (c === "year") {
        title += "(年)";
      } else if (c === "month") {
        title += "(月)";
      }
    });
    return title;
  };

  /**
   * 增加title的列信息,title列数据
   */
  const columns = useMemo(() => {
    let groupStr: string;
    //列头信息处理
    if (currReportTable && currReportTable.items) {
      //列头加上列函数
      groupStr =
        currReportTable.groupColumn +
        (currReportTable.func ? "_" + currReportTable.func : "");
      return [
        {
          dataIndex: groupStr,
          isTitle: true,
          title: groupTitle(groupStr),
        },
        ...currReportTable.items.map((i) => {
          // 后端数据返回的是code，这里id转code
          return {
            title: i.reportItemId
              ? findItem(i.reportItemId).name
              : findKpi(i.reportKpiId as string).name,
            dataIndex: i.reportItemId
              ? findItem(i.reportItemId).code
              : findKpi(i.reportKpiId as string).code,
          };
        }),
      ];
    }
  }, [currReportTable]);
  return <Table columns={columns} dataSource={reportData}></Table>;
};

export default ReportTable;
