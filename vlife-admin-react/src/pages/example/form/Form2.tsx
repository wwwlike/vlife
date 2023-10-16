import React from "react";
import FormPage from "@src/pages/common/formPage";
import { VF } from "@src/components/form/VF";
import CodeBlock from "@src/components/codeBlock";
export default () => {
  return (
    <CodeBlock
      title={"dto复杂表单"}
      code={`<FormPage type="projectDto"  />`}
      scope={{ FormPage, VF }}
      others={[
        {
          title: "任务点数累加",
          key: "customModel",
          description: "项目表的工时等于任务表工时之和",
          code: `<FormPage type="projectDto" 
          formData={{taskList:[{point:111}]}}
          reaction={[
              VF.then("point").value((d: ProjectDto) => {
                  return d&&d.taskList&&d.taskList.reduce((acc, cur) => acc + cur.point, 0);
              })
            ]}  />`,
        },
      ]}
    />
  );
};
