import React from "react";
import FormPage from "@src/pages/common/formPage";
import { VF } from "@src/components/form/VF";
import CodeBlock from "@src/components/codeBlock";

export default () => {
  return (
    <CodeBlock
      title={"最简表单"}
      description="传入模型名称，进行模型配置，更复杂的使用低代码"
      codeRemark="type 模型标识首字母需小写"
      code={`<FormPage 
      //传入模型名称,从配置信息里读取到该表单模型内容进行渲染
      type="demoProject"  />`}
      scope={{ FormPage, VF }}
      apiDocData={[
        {
          attr: "type",
          interface: "string",
          remark: "模型标识",
        },
        {
          attr: "modelInfo",
          interface: "FormVo",
          remark: "模型信息(和type二者传一)",
        },
        {
          attr: "formData",
          interface: "IdBean",
          remark: "表单数据",
        },
        {
          attr: "terse",
          interface: "boolean",
          default: "false",
          remark: "布局紧凑",
        },
        {
          attr: "fontBold",
          interface: "boolean",
          default: "false",
          remark: "标题加粗",
        },
      ]}
      others={[
        {
          title: "手动模型入参",
          description: "不常用",
          key: "customModel",
          code: `<FormPage   modelInfo={
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
          title: "只读",
          key: "readPretty",
          code: `<FormPage type="demoProject"  readPretty={true}  formData={{name:"项目名称",point:123,total:78888,status:"1"}} />`,
        },
        {
          title: "紧凑布局",
          key: "terse",
          code: `<FormPage type="demoProject"  terse={true} />`,
        },
        {
          title: "标题加粗",
          key: "fontBold",
          code: `<FormPage type="demoProject"  fontBold={true} />`,
        },
        {
          title: "数据初始化",
          key: "dataInit",
          code: `<FormPage type="demoProject"
          formData={{name:"项目名称",point:123,total:78888,status:"1"}} />`,
        },
        {
          title: "项目状态只读",
          key: "reaction1",
          code: `  <FormPage
            type="demoProject"
            //设置项目状态为只读
            reaction={[VF.then("status").readPretty()]}
          />`,
        },
      ]}
    />
  );
};
