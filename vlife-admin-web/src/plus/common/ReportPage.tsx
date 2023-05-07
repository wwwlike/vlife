import { Card, Nav, Table } from "@douyinfe/semi-ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReportTableSaveDto,
  listAll,
  report,
} from "@src/api/report/ReportTable";
import { ReportItem, listAll as listItemAll } from "@src/api/report/ReportItem";
import { ReportKpi, listAll as listKpiAll } from "@src/api/report/ReportKpi";
import { IconHistogram } from "@douyinfe/semi-icons";
import { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";
import { find } from "@src/api/base/baseService";

/**
 * 简单报表功能页面
 * 1. 左侧展示报表列表
 * 2. 选择一个报表展示详情
 *  - 报表分组字段内容翻译(sysUserId,)
 */
export default () => {
  /**
   * 当前报表信息
   */
  const [currReportTable, setCurrReportTable] = useState<ReportTableSaveDto>();
  /**
   * 所有报表
   */
  const [allReportDto, setAllReportDto] = useState<ReportTableSaveDto[]>([]);
  /**
   * 全量统计项
   */
  const [allReportItem, setAllReportItem] = useState<ReportItem[]>([]);
  /**
   * 全量指标项
   */
  const [allReportKpi, setAllReportKpi] = useState<ReportKpi[]>([]);
  /**
   * 当前报表数据
   */
  const [reportData, setReportData] = useState<any[]>([]);
  /**
   * 当前报表列头
   */
  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);
  // /**
  //  * 列头数据
  //  */
  // const [titleData, setTitleData] = useState();

  /**
   * 查找统计项
   */
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

  useEffect(() => {
    listAll().then((data) => {
      if (data.data) {
        setAllReportDto(data.data);
        setCurrReportTable(data.data[0]);
      }
    });
    listItemAll().then((data) => {
      if (data.data) {
        setAllReportItem(data.data);
      }
    });
    listKpiAll().then((data) => {
      if (data.data) {
        setAllReportKpi(data.data);
      }
    });
  }, []);

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
  useEffect(() => {
    if (allReportDto && allReportDto.length > 0) {
      let temps: ColumnProps<any>[] = [];
      let groupStr: string = "";
      //列头信息处理
      if (currReportTable && currReportTable.items) {
        //列头加上列函数
        groupStr =
          currReportTable.groupColumn +
          (currReportTable.func ? "_" + currReportTable.func : "");
        temps = [
          {
            dataIndex: groupStr,
            isTitle: true,
            title: groupTitle(groupStr),
          },
          ...currReportTable.items.map((i) => {
            // 后端数据返回的是code，这里id转code
            return {
              title: i.reportItemId
                ? findItem(i.reportItemId)?.name
                : findKpi(i.reportKpiId as string)?.name,
              dataIndex: i.reportItemId
                ? findItem(i.reportItemId)?.code
                : findKpi(i.reportKpiId as string)?.code,
            };
          }),
        ];
      }

      if (
        reportData &&
        reportData.length > 0 &&
        temps.length > 0 &&
        groupStr !== ""
      ) {
        if (groupStr.endsWith("Id")) {
          find(
            groupStr.substring(0, groupStr.length - 2),
            "id",
            reportData.map((r: any) => r[groupStr])
          ).then((data) => {
            const map: any = {};
            data.data?.forEach((e: any) => {
              map[e.id] = e.name;
            });
            temps = temps.map((m) => {
              return m.isTitle
                ? {
                    ...m,
                    render: (text: string, record: any, index: number) => {
                      return map[text];
                    },
                  }
                : m;
            });
            setColumns(temps);
          });
        }
      } else {
        // alert(groupStr);
        setColumns(temps);
      }
    }
    //有数据在做数据转换
  }, [reportData, currReportTable, allReportDto]);

  useEffect(() => {
    if (currReportTable) {
      const groupStr =
        currReportTable.groupColumn +
        (currReportTable.func ? "_" + currReportTable.func : "");
      report({
        reportCode: currReportTable.code,
        groups: [groupStr],
      }).then((data) => {
        if (data.data) {
          setReportData(data.data);
        }
      });
    }
  }, [currReportTable]);

  const onSelect = (data: any) => {
    setCurrReportTable(allReportDto.filter((f) => f.code === data.itemKey)[0]);
  };

  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="统计分析"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <Nav
            bodyStyle={{ height: 320 }}
            selectedKeys={currReportTable ? [currReportTable.code] : []}
            items={allReportDto.map((d) => {
              return {
                itemKey: d.code,
                text: d.name,
                icon: <IconHistogram />,
              };
            })}
            onSelect={onSelect}
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        {/* {JSON.stringify(reportData)} */}
        <Card
          title={currReportTable?.name}
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          {JSON.stringify(columns)}
          <Table columns={columns} dataSource={reportData}></Table>
        </Card>
      </div>
    </div>
  );
};
