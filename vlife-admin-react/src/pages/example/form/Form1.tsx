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
    total: 8888,
    demoCustomerId: "4028b8818b136277018b13731cf40000",
    state: "1",
    endDate: "2023/10/12",
    beginDate: "2012/10/12",
  };
  return (
    <CodeBlock
      title={"最简表单"}
      description="传入模型名称,样式、外观、常规校验联动可使用页面配置功能完成设置，对于复杂的校验计算联动可使用低代码完成"
      codeRemark="type模型标识首字母需小写"
      code={`<FormPage type="demoProject"  />`}
      scope={{ FormPage, VF, initData }}
      apiDocData={FormPropDoc}
      others={[
        {
          title: "手动模型入参",
          description: "表单设计器里使用该模式，其它未采用",
          key: "customModel",
          code: `<FormPage modelInfo={
              {  
              "modelSize": 4,
              "fields": [
                  {
                    fieldName:"name",
                    "title": "项目名称",
                    "x_component": "Input",
                    "required":true,
                  },
                  {
                    fieldName:"point",
                    "title": "项目点数",
                    "x_component": "InputNumber",
                  }
              ],
          }} />`,
        },
        {
          title: "数据初始化",
          key: "dataInit",
          code: `<FormPage type="demoProject" formData={initData} />`,
        },
        {
          title: "预览紧凑加粗",
          key: "readPretty",
          code: `<FormPage type="demoProject" fontBold={true}  terse={true} readPretty={true} formData={initData} />`,
        },
        {
          title: "字段只读",
          description: "设置项目状态为只读",
          key: "reaction1",
          code: `<FormPage type="demoProject" design={true} highlight={"state"} formData={initData} 
          // 低代码的方式设置，这类常规设置用页面的配置功能就能满足
          reaction={[VF.then("state").readPretty()]}/>`,
        },
        {
          title: "隐藏指定字段",
          description:
            "对模型内的部分字段不做显示可以使用ignoredFields传值设置",
          key: "depart",
          code: `<FormPage type="demoProject"  ignoredFields={["total","point","beginDate"]}/>`,
        },
      ]}
    />
  );
};
