import React from "react";
import CodeBlock from "@src/components/codeBlock";
import TablePage from "@src/pages/common/tablePage";
import { BtnPropDoc, TablePropDoc } from "@src/resources/CompProp";
import {
  saveProjectDto,
  save,
  detailProjectDto,
  remove,
  DemoProject,
} from "@src/api/demo/DemoProject";
import { save as saveCustomer } from "@src/api/demo/DemoCustomer";
import { save as saveTask } from "@src/api/demo/DemoTask";
export default () => {
  return (
    <>
      <CodeBlock
        title={"工具栏按钮(新增)"}
        apiDocData={BtnPropDoc}
        description="传入btns按钮组件信息覆盖了默认的Crud功能,vlife里面的功能都是通过按钮触发的"
        codeRemark="`saveApi`是保存数据的接口;`create`是按钮动作分类；创建型的按钮均会放置在列表的工具栏"
        code={`<TablePage<DemoProject> listType="demoProject" btns={[
          {
            title: "新增项目(实体)",
            actionType: "create",
            saveApi: save,
            // model:'demoProject' 模型名称和列表listType一致则可以省略
          }, {
            title: "新增项目(Dto)",
            actionType: "create",
            saveApi: saveProjectDto,
            model:'projectDto'//projectDto->为DemoProject的dto传输模型对象
          },{
            title: "新增任务(关联子表)",
            actionType: "create",
            saveApi: saveTask,
            model:'demoTask',//demoTask->为demoProject的子表
          }
        ]} />`}
        scope={{
          TablePage,
          saveProjectDto,
          save,
          saveCustomer,
          saveTask,
          detailProjectDto,
          remove,
        }}
        others={[
          {
            title: "批量接口操作按钮",
            key: "saveTask",
            description: "在项目模块里也能保存其他模块数据",
            codeRemark: "这里的model和table",
            code: `<TablePage<DemoProject>  listType="demoProject" btns={[
              {
                title: "确认删除",
                actionType: "api",
                multiple:true,//支持批量操作，所以按钮放置在列表的工具栏位置
                // submitConfirm: true, //删除之前是否确认提醒，默认true需要提醒
                onSaveBefore:(data: DemoProject[]) =>data.map((d) => d.id),
                saveApi: remove
              },{
                title: "直接删除",
                actionType: "api",
                multiple:true,
                submitConfirm:false,
                onSaveBefore:(data: DemoProject[]) =>data.map((d) => d.id),
                saveApi: remove
              }
            ]}  />`,
          },
          {
            title: "条件按钮",
            key: "conditionBtn",
            description: "满足usableMatch里的条件，按钮才可用",
            codeRemark: "这里的model和table",
            code: `<TablePage<DemoProject>  listType="demoProject" btns={[
              {
                title: "布尔值判断",
                actionType: "api",
                multiple:true,//支持批量操作，所以按钮放置在列表的工具栏位置
                usableMatch: 2>1, //表达式不成立，按钮不可以用
                onClick:()=>alert("布尔值判断，2>1的条件表达式成立")
              },{
                title: "对象值匹配",
                actionType: "api",
                multiple:true,
                usableMatch: { state: "1" }, // state=1进行中的，智能操作进行中的数据
                onClick:()=>alert("对象值匹配，选择的数据都是进行中的合同")
              },{
                title: "函数匹配",
                actionType: "api",
                multiple: true,
                usableMatch: (datas: DemoProject[]) =>datas.filter(d=>d.total>3000).length===datas.length?undefined:"合同金额应大于3000",
                onClick:()=>alert("函数匹配校验成功，当前合同金额大于3000")
              }
            ]}  />`,
          },
        ]}
      />
    </>
  );
};
