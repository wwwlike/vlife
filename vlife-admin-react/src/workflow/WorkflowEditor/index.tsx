import React, { memo } from "react";
import { WorkFlowEditorInner } from "./WorkFlowEditorInner";
import { ILocales } from "@rxdrag/locales";
import { IThemeToken, IWorkFlowNode } from "../../workflow-editor";
import { IMaterialUIs, FlowEditorScope } from "../../workflow-editor";
import { FormVo } from "@src/api/Form";

export type WorkflowEditorProps = {
  //皮肤
  themeMode?: "dark" | "light";
  //暂时不知
  themeToken?: IThemeToken;
  //语言
  lang?: string;
  locales?: ILocales;

  //物料UI的一个map，用于组件间通过props传递物料UI，key是节点类型
  // export interface IMaterialUIs {
  //   [nodeType: string]: IMaterialUI<any> | undefined
  // }
  materialUis?: IMaterialUIs;
  //表单模型信息
  // formVo?: FormVo;
  flowNode?: IWorkFlowNode;
  formVo?: FormVo;
};
//  => void
export const WorkflowEditor = memo(
  (
    props: WorkflowEditorProps & {
      onDataChange?: (iWorkFlowNode?: IWorkFlowNode) => void;
    }
  ) => {
    const { themeMode, themeToken, lang, locales, materialUis, ...other } =
      props;

    return (
      // dlc scope 做数据配置使用

      <FlowEditorScope
        mode={themeMode}
        themeToken={themeToken}
        lang={lang}
        locales={locales}
        materialUis={materialUis}
      >
        {/* dlc 工作流核心配置 */}
        <WorkFlowEditorInner {...other} />
      </FlowEditorScope>
    );
  }
);
