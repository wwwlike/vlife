import { Card, TabPane, Tabs } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import { Prism } from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import Scrollbars from "react-custom-scrollbars";
import { useAuth } from "@src/context/auth-context";
/**
 * 使用示例
 */
export interface ExampleProps {
  //按钮名称
  title: string; //示例标题
  content: string; //描述说明
  mdFile: string; //文件地址
  java?: string; //过滤条件模型名称
  ts?: string; //隐藏的按钮
  children: any;
}

/**
 * crud 左右布局模版
 * @param param0
 * @returns
 */
const Example = ({
  children,
  ts,
  title,
  java,
  content,
  mdFile,
  ...props
}: ExampleProps) => {
  const [markdown, setMarkDown] = useState<string>();
  const { screenSize } = useAuth();
  useEffect(() => {
    fetch("/src" + mdFile)
      .then((mds) => {
        return mds.text();
      })
      .then((text) => {
        setMarkDown(text);
      });
  }, [mdFile]);

  return (
    <div className="flex h-full space-x-2">
      <Card className="h-full w-1/2" title={title}>
        {children}
      </Card>

      <div className="h-full w-1/2">
        <Tabs className="h-full " defaultActiveKey="1">
          {markdown && (
            <TabPane tab="说明" className=" bg-slate-300" itemKey="1">
              <Scrollbars
                style={{
                  height: `${
                    screenSize?.height ? screenSize.height - 150 : 100
                  }px`,
                }}
              >
                <ReactMarkdown className="markdown mx-4">
                  {markdown}
                </ReactMarkdown>
              </Scrollbars>
            </TabPane>
          )}

          {ts && (
            <TabPane tab="ts代码" itemKey="2">
              <Prism
                showLineNumbers={true}
                startingLineNumber={0}
                language="typescript"
                wrapLines={true}
                style={duotoneLight}
              >
                {ts}
              </Prism>
            </TabPane>
          )}
          {java && (
            <TabPane tab="java代码" itemKey="3">
              <Prism
                showLineNumbers={true}
                startingLineNumber={0}
                language="typescript"
                wrapLines={true}
                style={duotoneLight}
              >
                {java}
              </Prism>
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
};
export default Example;
