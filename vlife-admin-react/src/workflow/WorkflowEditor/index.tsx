import React, { memo, useEffect, useState } from "react";
import { WorkFlowEditorInner } from "./WorkFlowEditorInner";
import { ILocales } from "@rxdrag/locales";
import { IThemeToken, IWorkFlowNode } from "../../workflow-editor";
import { IMaterialUIs, FlowEditorScope } from "../../workflow-editor";
import { FormVo } from "@src/api/Form";
import { PublishButton } from "./PublishButton";

export type WorkflowEditorProps = {
  themeMode?: "dark" | "light"; //皮肤
  themeToken?: IThemeToken; //样式变量
  lang?: string; //语言
  locales?: ILocales; //国际化
  materialUis?: IMaterialUIs;
  flowNode?: IWorkFlowNode; //已配置节点信息
  formVo?: FormVo; //在面板配置时需要的模型信息
  onDataChange?: (iWorkFlowNode?: IWorkFlowNode) => void;
};
//  => void
export const WorkflowEditor = memo((props: WorkflowEditorProps) => {
  const {
    themeMode,
    themeToken,
    lang,
    locales,
    materialUis,
    onDataChange,
    formVo,
    flowNode,
  } = props;

  const [iWorkFlowNode, setIWorkFlowNode] = useState<IWorkFlowNode>();
  const [validate, setValidate] = useState(false); //节点校验通过标识
  useEffect(() => {
    if (validate && iWorkFlowNode && iWorkFlowNode.childNode) {
      onDataChange?.(iWorkFlowNode);
    } else {
      onDataChange?.(undefined);
    }
  }, [validate, iWorkFlowNode]);
  return (
    <FlowEditorScope
      mode={themeMode}
      themeToken={themeToken}
      lang={lang}
      locales={locales}
      materialUis={materialUis}
    >
      {/* 流程校验 */}
      <PublishButton onValidate={setValidate} iWorkFlowNode={iWorkFlowNode} />
      {/*  工作流核心配置 */}
      <WorkFlowEditorInner
        flowNode={flowNode}
        formVo={formVo}
        onDataChange={(_iWorkFlowNode?: IWorkFlowNode) => {
          setIWorkFlowNode(_iWorkFlowNode);
        }}
      />
    </FlowEditorScope>
  );
});
