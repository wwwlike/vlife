import { memo, useCallback } from "react";
import { useStartNode } from "../hooks/useStartNode";
import { AddButton } from "./AddButton";
import { useTranslate } from "../react-locales";
import { RightOutlined } from "@ant-design/icons";
import { ChildNode } from "./ChildNode";
import { NodeWrap, NodeWrapBox, NodeContent } from "./NormalNode";
import { EndNode } from "./EndNode";
import { useEditorEngine } from "../hooks";
import { NodeTitleSchell } from "./NodeTitle";
import { useNodeMaterial } from "../hooks/useNodeMaterial";
import { useMaterialUI } from "../hooks/useMaterialUI";
import { ErrorTip } from "./ErrorTip";

export const StartNode = memo(() => {
  //dlc 一个IWorkFlowNode 类型的数据
  const startNode = useStartNode();
  //dlc 国际化转换对象
  const t = useTranslate();
  //dlc 理解是物料配置的右侧面板信息
  const materialUi = useMaterialUI(startNode);
  //dlc 获得 EditorEngine  编辑器引擎的上下文对象 ，我把它看成一个action 提供各种接口使用
  const store = useEditorEngine();
  //dlc 当前堪称一个节点的信息
  const material = useNodeMaterial(startNode);

  const handleClick = useCallback(() => {
    store?.selectNode(startNode?.id);
  }, [startNode?.id, store]);

  return (
    <NodeWrap className="node-wrap start">
      {/* NodeWrapBox 卡片节点DIV */}
      <NodeWrapBox className="node-wrap-box" onClick={handleClick}>
        <NodeTitleSchell
          className="node-title start-node-title"
          style={{ backgroundColor: material?.color }}
        >
          {t(material?.label || "")}
        </NodeTitleSchell>
        <NodeContent className="content">
          {materialUi?.viewContent && materialUi?.viewContent(startNode, { t })}
          <RightOutlined className="arrow" />
        </NodeContent>
      </NodeWrapBox>
      {startNode?.id && <AddButton nodeId={startNode?.id} />}
      {startNode?.childNode && <ChildNode node={startNode?.childNode} />}
      <EndNode />
    </NodeWrap>
  );
});
