import { Select, Table } from "@douyinfe/semi-ui";
import React from "react";

/**
 * table下拉框搜索
 */
interface tableSelectProps {
  columns: { title: string; dataIndex: string }[];
  datas: any[];
}
export default ({ columns, datas, ...prop }: tableSelectProps) => {
  return (
    <Select
      autoAdjustOverflow={false}
      onChangeWithObject
      onChange={(obj) => {}}
      // style={{ width: 200 }}
      outerTopSlot={
        <Table columns={columns} dataSource={datas} pagination={false} />
      } //插槽内容
      // optionList={getSub(key)} //第一页的内容
    />
  );
};
