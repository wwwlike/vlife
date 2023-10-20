import React from "react";
import CodeBlock from "@src/components/codeBlock";
import TablePage from "@src/pages/common/tablePage";
import { TablePropDoc } from "@src/resources/CompProp";
import {
  saveProjectDto,
  save,
  detailProjectDto,
} from "@src/api/demo/DemoProject";
import { save as saveCustomer } from "@src/api/demo/DemoCustomer";
import { save as saveTask } from "@src/api/demo/DemoTask";
export default () => {
  return (
    <>
      <CodeBlock
        title={"与列模型一致"}
        apiDocData={TablePropDoc}
        description="通过传入btns按钮组件信息覆盖了默认的Crud功能,vlife里面的功能都是通过按钮触发的"
        codeRemark="`save`是保存数据的接口;`create`是按钮动作分类；创建型的按钮均会放置在列表的工具栏"
        code={`<TablePage<DemoProject> listType="demoProject" btns={[
          {
            title: "修改",
            actionType: "edit",
            saveApi: save,
          },{
            title: "启动",
            model:"demoProject",
            actionType: "api",
            submitConfirm:false,
            usableMatch:{state:"2"},
            onSaveBefore: (d) => ({ ...d, state: "1" }),
            saveApi: save,
          },{
            title: "签合同",
            model:"demoProject",
            actionType: "api",
            submitConfirm:false,
            usableMatch:{state:"1"},
            onSaveBefore: (d) => ({ ...d, state: "2" }),
            saveApi: save,
          }

        ]} />`}
        scope={{
          TablePage,
          saveProjectDto,
          save,
          saveCustomer,
          saveTask,
          detailProjectDto,
        }}
      />
    </>
  );
};
