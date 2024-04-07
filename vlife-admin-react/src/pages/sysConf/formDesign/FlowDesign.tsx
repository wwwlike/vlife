import { FormVo } from "@src/api/Form";
import { Lang } from "@src/workflow/component";
import { materialUis } from "@src/workflow/materialUis";
import { WorkflowEditor } from "@src/workflow/WorkflowEditor";
import { IWorkFlowNode } from "@src/workflow-editor";
import { useState } from "react";

export interface FlowSettingProps {
  type: string; // dto模型
  formVo: FormVo; // 模型信息
  onDataChange: (flowJSON: string) => void;
}
export default (props: FlowSettingProps) => {
  const { formVo, onDataChange } = props;
  const lang = Lang.cn;
  const themeMode = "light";
  const [flowNode, setFlowNode] = useState<IWorkFlowNode>(
    JSON.parse(formVo.unpublishJson || formVo.flowJson)
  );
  //

  // useEffect(() => {
  //   if (formVo.flowJson) {
  //     setFlowNode();
  //   }
  // }, [formVo.flowJson]);

  return (
    <WorkflowEditor
      themeMode={themeMode}
      lang={lang}
      onDataChange={(node) => {
        onDataChange(JSON.stringify(node));
      }}
      //dlc 卡片，setting 和校验的配置信息
      materialUis={materialUis}
      flowNode={flowNode}
      formVo={formVo}
    />
  );
};
