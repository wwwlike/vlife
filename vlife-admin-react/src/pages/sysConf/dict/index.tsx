import React, { useState } from "react";
import Content from "../../template/content";
import { remove, save, SysDict, SysDictPageReq } from "@src/api/SysDict";
import { VF } from "@src/dsl/VF";

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
          // initData: { code: req?.code },
          reaction: [VF.then("code").value(req?.code)],
          actionType: "create",
          usableMatch: (...datas: any[]) =>
            req?.code === undefined ? "请选择一个字典类目" : true,
          saveApi: save,
        },
        {
          title: "修改",
          actionType: "edit",
          usableMatch: { sys: false },
          saveApi: save,
        },
        {
          title: "删除",
          actionType: "api",
          usableMatch: { sys: false },
          saveApi: remove,
          onSaveBefore: (data: SysDict[]) => data.map((d) => d.id),
        },
      ]}
    />
  );
};
