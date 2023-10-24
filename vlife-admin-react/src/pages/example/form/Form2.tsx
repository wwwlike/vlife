import React from "react";
import FormPage from "@src/pages/common/formPage";
import { VF } from "@src/dsl/VF";
import CodeBlock from "@src/components/codeBlock";
import { FormPropDoc } from "@src/resources/CompProp";
export default () => {
  const initData = {
    name: "项目名称",
    point: 300,
    sysUserId: "40288a8182a656740182a659f4d10001",
    total: -1,
    demoCustomerId: "4028b8818b136277018b13731cf40000",
    status: "1",

    beginDate: "2023/10/12",
    endDate: "2022/10/11",
  };
  return (
    <>
      <CodeBlock
        title={"初始校验逻辑"}
        description="无需触发规则初始设置校验逻辑,项目名称必填"
        apiDocData={FormPropDoc}
        code={`<FormPage type="demoProject" reaction={[VF.then("name").required()]} />`}
        scope={{ FormPage, VF, initData }}
        others={[
          {
            title: "自定义校验",
            description:
              "在页面配置里可以配置这样简单的逻辑校验，使用这样的低码的方式也可以完成",
            key: "zero",
            code: `<FormPage formData={initData} type="demoProject"  
            reaction={[VF.field("total").lt(0).then("total").feedback("合同金额不能小于0元")]} />`,
          },
          {
            title: "多条件判断",
            description: "客户不为空且金额小于100时'工时,开始结束日期'均隐藏",
            key: "you",
            code: ` <FormPage
            type="demoProject"
            formData={{ demoCustomerId: "4028b8818b136277018b13731cf40000",total:10}}
            reaction={[
              VF.field("demoCustomerId")
                .isNotNull()
                .and("total")
                .lt(100)
                .then("point","beginDate","endDate")
                .hide(),
            ]}
          />`,
          },
          {
            title: "函数校验实现联动",
            description: "页面配置里无法完成联动方式的设置，低代码可以搞定",
            key: "wu",
            code: `<FormPage formData={initData} type="demoProject" reaction={[VF.result(d=>d.beginDate>d.endDate).then("beginDate").feedback("开始日期不能晚于已结束日期")]} />`,
          },
          {
            title: "异步校验",
            description:
              "通过远程(异步)函数，进行逻辑计算；（返回true则执行校验反馈信息）",
            key: "promiseCheck",
            code: ` <FormPage
            type="demoProject"
            formData={initData}
            //promise仿异步接口，在后端进行逻辑校验，返回true则执行then后的语法
            reaction={[
              VF.result((d:DemoProject)=>{
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve({ code: '200', msg: 'success', data: d.total < 100 });
                  }, 1000);
                });
              })
                .then("total")
                .feedback("合同金额不能小于100元"),
            ]}
          />`,
          },
        ]}
      />
    </>
  );
};
