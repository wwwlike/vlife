import React from "react";
import Content from "@src/pages/template/content";
import CodeBlock from "@src/components/codeBlock";
export default () => {
  return (
    <CodeBlock
      viewPosition="tabPanel"
      title={"与列模型一致"}
      code={` <Content
      title="只有列表"
      listType="demoProject" />`}
      scope={{
        Content,
      }}
    />
  );
};
