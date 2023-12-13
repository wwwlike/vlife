import React, { useState } from "react";
import Content from "../../template/content";
import { remove, save, SysDict, SysDictPageReq } from "@src/api/SysDict";

export default () => {
  const [req, setReq] = useState<SysDictPageReq>();
  return (
    <Content<SysDict>
      title="字典"
      listType="sysDict"
      filterType="sysDictPageReq"
      tabList={[
        { tab: "业务字典", itemKey: "state-1", req: { sys: false } },
        { tab: "系统字典", itemKey: "state1", req: { sys: true } },
      ]}
      onReq={(d: any) => {
        setReq({ ...d });
      }}
      btns={[
        {
          title: "新增",
          initData: { code: req?.code },
          actionType: "create",
          // usableMatch: req?.code !== undefined,
          saveApi: save,
        },
        {
          title: "修改",
          actionType: "edit",
          saveApi: save,
        },
        {
          title: "删除",
          actionType: "api",
          multiple: true,
          saveApi: remove,
          onSaveBefore: (data: SysDict[]) => data.map((d) => d.id),
        },
      ]}
    />
  );
};
