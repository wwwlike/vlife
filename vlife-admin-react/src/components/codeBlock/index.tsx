import React, { useMemo, useState } from "react";
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
};
export interface ICodeBlockProps extends attr {
  scope: any; //引入模块
  others?: attr[]; //其他关联的
  apiDocData?: {
    //文档信息
    attr: string;
    interface: string;
    default?: string;
    remark?: string;
  }[]; //api文档
}
const CodeBlock = ({
  title,
  code,
  scope,
  others,
  description,
  codeRemark,
  apiDocData,
}: ICodeBlockProps) => {
  const [other, setOther] = useState<attr>();
  const currCode = useMemo((): string => {
    const thisCode = formatCode(other ? other.code : code);
    return thisCode;
  }, [code, other]);

  return (
    <LiveProvider code={currCode} scope={scope}>
      <div className=" flex w-full h-full ">
        <Card
          title={
            <Meta
              title={other?.title || title}
              description={
                ((other && other.description) ||
                  (other === undefined && description)) &&
                (other ? other.description : description)
              }
            />
          }
          className="  w-3/5 relative h-full "
        >
          <LivePreview />
          <LiveError />
          <Divider></Divider>
          {others && (
            <div className=" absolute bottom-2 right-2 flex mt-2 justify-end space-x-1">
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
        </Card>
        <Card className=" w-2/5">
          <Tabs className="h-full " defaultActiveKey="1">
            <TabPane
              tab="ts代码"
              itemKey="1"
              style={{ background: "#f5f5f5", padding: 10 }}
            >
              <LiveEditor
                style={{
                  fontFamily: "Consolas",
                  fontSize: 18,
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
        </Card>
      </div>
    </LiveProvider>
  );
};
export default CodeBlock;
