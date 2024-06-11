import React, { useState } from "react";
import Content from "../../template/content";
import { remove, save, SysDict, SysDictPageReq } from "@src/api/SysDict";
import { VF } from "@src/dsl/VF";

export default () => {
  const [req, setReq] = useState<SysDictPageReq>();
  return (
    <Content<SysDict>
      listType="sysDict"
      filterType="sysDictPageReq"
      req={{ level: 2, type: "field" }}
      onReq={(d: any) => {
        setReq({ ...d });
      }}
      btns={[
        {
          title: "新增选择项",
          // initData: { code: req?.code },
          reaction: [
            VF.then("code").value(req?.code),
            VF.then("level").value(2),
            VF.then("level", "type").hide(),
          ],
          actionType: "create",
          usableMatch: true,
          saveApi: save,
        },
        {
          title: "修改",
          actionType: "edit",
          reaction: [
            VF.then("level", "type").hide(),
            VF.field("sys").eq(true).then("title", "sort").readPretty(),
          ],
          model: "sysDict",
          saveApi: save,
        },
        {
          title: "删除",
          actionType: "api",
          usableMatch: { sys: false },
          saveApi: remove,
          onSaveBefore: (data: SysDict) => [data.id],
        },
      ]}
    />
  );
};
