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
            // model:'demoProject' 模型名称和列表listType一致则可以省略
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
        others={[
          {
            title: "与列模型不同",
            key: "dtoSave",
            codeRemark:
              "与列表模型不同，则编辑时需要传入查询该模型的方法`detailProjectDto`",
            code: `<TablePage<DemoProject>  listType="demoProject" btns={[{
              title: "修改",
              actionType: "edit",
              model:'projectDto',//与列表模型demoProject不一致
              loadApi:detailProjectDto,
              saveApi: saveProjectDto,}]}/>`,
          },
          {
            title: "直接修改",
            key: "apiEdit",
            description: "在项目模块里也能保存其他模块数据",
            codeRemark: "这里的model和table",
            code: `<TablePage<DemoProject>  listType="demoProject" btns={[
              {
                title: "签合同",
                actionType: "api",
                submitConfirm:false,
                usableMatch:{state:"1"},
                onSaveBefore: (d) => ({ ...d, state: "2" }),//对当前行数据进行数据调整
                saveApi: save,
              },{
                title: "启动",
                actionType: "api",
                submitConfirm:false,
                usableMatch:{state:"2"},
                onSaveBefore: (d) => ({ ...d, state: "1" }),
                saveApi: save,
              }
            ]}  />`,
          },
          {
            title: "不可用隐藏",
            key: "hideConfirg",
            description: "在项目模块里也能保存其他模块数据",
            codeRemark: "这里的model和table",
            code: `<TablePage<DemoProject>  listType="demoProject" btns={[
              {
                title: "签合同",
                actionType: "api",
                submitConfirm:true,
                disabledHide:true,
                usableMatch:{state:"1"},
                onSaveBefore: (d) => ({ ...d, state: "2" }),
                saveApi: save,
              },{
                title: "启动",
                actionType: "api",
                submitConfirm:true,
                disabledHide:true,
                usableMatch:{state:"2"},
                onSaveBefore: (d) => ({ ...d, state: "1" }),
                saveApi: save,
              }
            ]}  />`,
          },
        ]}
      />
    </>
  );
};
