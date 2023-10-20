import React, { ReactNode, useMemo, useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import {
  Banner,
  Button,
  Card,
  Divider,
  Table,
  TabPane,
  Tabs,
} from "@douyinfe/semi-ui";
import prettier from "prettier/standalone";
import parserTypescript from "prettier/parser-typescript";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta";
import { compPropDoc } from "@src/resources/CompProp";
import classNames from "classnames";
import TablePage from "@src/pages/common/tablePage";

function formatCode(code: string) {
  return prettier.format(code, {
    parser: "typescript",
    plugins: [parserTypescript],
    tabWidth: 2,
    singleQuote: true,
    trailingComma: "es5",
  });
}
type attr = {
  title: string; //标题
  key?: string; //关键字，主示例可不填
  code: string; //代码
  description?: string; //详细描述
  codeRemark?: string; //代码说明
  viewPosition?: "left" | "tabPanel"; //预览显示位置，左侧|tab页签
};
export interface ICodeBlockProps extends attr {
  scope: any; //引入模块
  others?: attr[]; //其他关联的
  apiDocData?: compPropDoc[]; //api文档
}
const CodeBlock = ({
  title,
  code,
  scope,
  others,
  description,
  codeRemark,
  viewPosition = "left",
  apiDocData,
}: ICodeBlockProps) => {
  const [other, setOther] = useState<attr>();
  const currCode = useMemo((): string => {
    const codeDescription = other ? other.description : description;
    const thisCode = formatCode(other ? other.code : code);
    if (codeDescription) {
      return `//${codeDescription}
${thisCode}`;
    }

    return thisCode;
  }, [code, description, other]);

  const left = useMemo((): ReactNode => {
    return (
      <div
        className={`${classNames({
          "w-1/2 flex p-2": viewPosition === "left",
        })} ${classNames({
          "w-full": viewPosition === "tabPanel",
        })}  relative  flex-col h-full `}
      >
        {viewPosition === "left" && (
          <>
            <Meta
              className=" flex mb-4"
              title={other?.title || title}
              description={
                ((other && other.description) ||
                  (other === undefined && description)) &&
                (other ? other.description : description)
              }
            />
            <Divider />
          </>
        )}
        {others && (
          <div className="  flex my-2 justify-end space-x-1">
            <Button
              theme="solid"
              type={other ? "tertiary" : "primary"}
              onClick={() => {
                if (other) {
                  setOther(undefined);
                }
              }}
            >
              {title}
            </Button>
            {others?.map((a) => (
              <Button
                key={a.key}
                theme="solid"
                type={other?.key === a.key ? "primary" : "tertiary"}
                onClick={() => {
                  if (other === undefined || other?.key !== a.key) {
                    setOther(a);
                  }
                }}
              >
                {a.title}
              </Button>
            ))}
          </div>
        )}
        <LivePreview className="flex-grow bg-white p-4 rounded" />
      </div>
    );
  }, [other, viewPosition]);

  return (
    <LiveProvider code={currCode} scope={scope}>
      <div className={`flex`}>
        {viewPosition === "left" && left}
        <Tabs
          className={`${classNames({
            "w-1/2": viewPosition === "left",
            "w-full": viewPosition === "tabPanel",
          })}   overflow-y-auto  flex flex-col relative  `}
          contentStyle={{ flex: 1 }}
          defaultActiveKey={viewPosition === "tabPanel" ? "0" : "1"}
        >
          {viewPosition === "tabPanel" && (
            <TabPane tab="预览" itemKey="0" className="flex h-full relative  ">
              <LivePreview className="flex h-full" />
            </TabPane>
          )}

          <TabPane
            tab="ts代码"
            itemKey="1"
            className=" h-full w-full"
            // style={{
            //   width: `${width}px`, //设置宽度方便横向滚动条展示
            //   display: `block` /* 让表格以块级元素显示，使高度属性生效 */,
            //   overflow: `auto` /* 添加滚动条，以便在表格内容溢出时可以滚动查看 */,
            // }}

            style={{
              // background: "#8888",
              padding: 10,
            }}
          >
            <LiveEditor
              // className=" !h-3/5"
              style={{
                fontFamily: "Consolas",
                fontSize: 18,
                // height: "600px",
                overflow: `auto`,
                lineHeight: "1.5",
              }}
            />
            {((other && other.codeRemark) ||
              (other === undefined && codeRemark)) && (
              <Banner
                className="flex mt-2"
                fullMode={false}
                type="success"
                bordered
                icon={null}
                closeIcon={null}
                description={other ? other.codeRemark : codeRemark}
              />
            )}
          </TabPane>
          {apiDocData && (
            <TabPane
              tab="文档"
              itemKey="2"
              style={{ background: "#f5f5f5", padding: 10 }}
            >
              <Table
                pagination={false}
                columns={[
                  { dataIndex: "attr", title: "属性" },
                  { dataIndex: "interface", title: "类型" },
                  { dataIndex: "default", title: "默认值" },
                  { dataIndex: "remark", title: "描述" },
                ]}
                dataSource={apiDocData}
              ></Table>
            </TabPane>
          )}
        </Tabs>
      </div>
    </LiveProvider>
  );
};
export default CodeBlock;
