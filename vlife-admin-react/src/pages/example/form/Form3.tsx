import React from "react";
import FormPage from "@src/pages/common/formPage";
import { VF } from "@src/components/form/VF";
import CodeBlock from "@src/components/codeBlock";

export default () => {
  return (
    <CodeBlock
      title={"表单联动"}
      description="项目状态为合同中时，项目金额才能填写;进行中的项目才能开始任务编辑"
      codeRemark=""
      code={`<FormPage
      formData={{status:"3",total:3203}}
      type="projectDto" reaction={[
        VF.field("status").ne("3").then("total").readPretty(),
        VF.field("status").includes(["1","2"]).then("taskList").show(),
        VF.field("status").eq("2").then("taskList").readPretty()
      ]} />`}
      scope={{ FormPage, VF }}
    />

    //   <FormPage
    //   formData={{ status: "3", total: 3203 }}
    //   type="projectDto"
    //   reaction={[
    //     VF.field("status").ne("3").then("total").readPretty(),
    //     VF.field("status").includes(["1", "2"]).then("taskList").show(),
    //   ]}
    // />
  );
};
