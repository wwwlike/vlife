import React from "react";
import CodeBlock from "@src/components/codeBlock";
import TablePage from "@src/pages/common/tablePage";
import { TablePropDoc } from "@src/resources/CompProp";
export default () => {
  return (
    <>
      <CodeBlock
        title={"常规列表"}
        apiDocData={TablePropDoc}
        description="传入列表模型，列表渲染的同时提供CRUD操作入口"
        codeRemark="type模型标识首字母需小写"
        code={`<TablePage listType="demoProject" />`}
        scope={{ TablePage }}
        others={[
          {
            title: "无checkbox",
            key: "noCheckbox",
            code: `<TablePage  listType="demoProject" select_more={undefined} />`,
          },
          {
            title: "只能单选",
            key: "selectOne",
            code: `<TablePage  listType="demoProject" select_more={false} />`,
          },
          {
            title: "预览模式",
            key: "hand",
            code: `<TablePage  listType="demoProject" mode={"view"} />`,
          },
          {
            title: "指定列显示",
            key: "column",
            code: `<TablePage column={["name","total"]}  listType="demoProject"  mode={"view"} />`,
          },
        ]}
      />
    </>
  );
};
