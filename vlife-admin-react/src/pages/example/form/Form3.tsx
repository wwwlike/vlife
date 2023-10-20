import React from "react";
import FormPage from "@src/pages/common/formPage";
import { VF } from "@src/components/form/VF";
import CodeBlock from "@src/components/codeBlock";
import { FormPropDoc } from "@src/resources/CompProp";

export default () => {
  const initData = {
    id: "111",
    name: "项目名称",
    point: 300,
    sysUserId: "40288a8182a656740182a659f4d10001",
    total: 8888,
    demoCustomerId: "4028b8818b136277018b13731cf40000",
    status: "1",
    endDate: "2023/10/12",
    beginDate: "2012/10/12",
    taskList: [
      {
        demoProjectId: "111",
        sysUserId: "40288a8182a656740182a659f4d10001",
        name: "任务名称1",
        point: 2,
      },
      {
        demoProjectId: "111",
        sysUserId: "40288a8182a656740182a659f4d10001",
        name: "任务名称2",
        point: 3,
      },
    ],
  };
  return (
    <>
      <CodeBlock
        title={"复杂表单"}
        apiDocData={FormPropDoc}
        codeRemark="传入的模型`projectDto`一个DTO数据传输模型,包涵了`taskList:DemoTask[]`任务子表单列表"
        code={`<FormPage type="projectDto"  formData={initData} />`}
        scope={{ FormPage, VF, initData }}
        others={[
          {
            title: "子表单数据初始化",
            description: "使用subThen,value方法",
            key: "su333b",
            code: `<FormPage
            type="projectDto"
            formData={initData}
            reaction={[VF.subThen("taskList","name").value("任务名称")]}
          />`,
          },
          {
            title: "子表内部条件判断",
            description: "在主表组件配置里设置子表的校验，级联",
            key: "dd",
            code: `<FormPage
            type="projectDto"
            formData={initData}
            reaction={[
              VF.subThen("taskList","demoProjectId").hide(),
              VF.subThen("taskList", "remark").readPretty(),
          VF.subField("taskList", "name")
            .eq("123")
            .then("remark")
            .value("子表内部条件判断")
            .otherwise("remark")
            .value(""),
            ]}
          />`,
          },
          {
            title: "设置子表的校验",
            description: "在主表组件属性reaction里支持设置子表的关联关系",
            codeRemark:
              "主表的组件属性里支持通过subField来设置子表的条件，然后通过then方法设置触发的事件",
            key: "sub",
            code: `<FormPage
            type="projectDto"
            formData={initData}
            reaction={[
              VF.subField("taskList","point").lt(3).then("point").feedback("单个任务的工时不能小于3"),
              VF.subThen("taskList","demoProjectId").hide(),
            ]}
          />`,
          },
          {
            title: "子表数据来源主表",
            description: "在主表组件配置里设置子表的校验，级联",
            codeRemark: "子表的value可接受函数，函数入参里的parent为主表数据",
            key: "su3ee3443b",
            code: `<FormPage
            type="projectDto"
            formData={initData}
            reaction={[
              VF.subThen("taskList", "remark").value((d)=>"任务归属项目("+d.parent.name+")"),
            ]}
          />`,
          },
          {
            title: "根据子表数据计算",
            description: "项目表工时等于任务表工时之和",
            key: "su3ee344333b",
            code: `<FormPage
            type="projectDto"
            formData={initData}
            reaction={[
              VF.then("point").readPretty(),
              VF.then("point").value((d)=>d.taskList.map(dd=>dd.point).reduce((acc, curr) => acc + curr, 0)),
            ]}
          />`,
          },
        ]}
      />

      {/* <FormPage
        type="projectDto"
        formData={initData}
        reaction={[
          VF.subThen("taskList", "remark").readPretty(),
          VF.subField("taskList", "name")
            .eq("123")
            .then("remark")
            .value("子表内部条件判断")
            .otherwise("remark")
            .value(""),
        ]}
      /> */}

      {/* <FormPage
        type="projectDto"
        formData={initData}
        //设置子表的任务工时必填，你可以点新增看看
        reaction={[
          VF.subThen("taskList", "sysUserId").value((d: any) => {
            return d?.parent?.sysUserId;
          }),
        ]}
      /> */}
      {/* <FormPage
        type="projectDto"
        formData={initData}
        //设置子表的任务工时必填，你可以点新增看看
        reaction={[VF.subThen("taskList", "point").required()]}
      /> */}
    </>
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
