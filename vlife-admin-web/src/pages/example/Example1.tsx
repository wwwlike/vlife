import React from "react";
import FormPage from "../common/formPage";
import Example from "../template/example";

export default () => {
  return (
    <Example
      title="示例"
      mdFile="/doc/example/demo1.md"
      content=" # 222 "
      ts={`
      import FormPage from "../common/formPage";
      import Example from "../template/example";
     `}
      java={`
     import FormPage from "../common/formPage";
     import Example from "../template/example";
    `}
    >
      <FormPage type="sysUserPageReq" />
    </Example>
  );
};
