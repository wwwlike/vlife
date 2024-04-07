import { memo, useCallback } from "react";
import { IWorkFlowNode } from "../interfaces";
import { RightOutlined } from "@ant-design/icons";
import { AddButton } from "./AddButton";
import { ChildNode } from "./ChildNode";
import { styled } from "styled-components";
import { canvasColor } from "../utils/canvasColor";
import { lineColor } from "../utils/lineColor";
import { nodeColor } from "../utils/nodeColor";
import { useTranslate } from "../react-locales";
import { useEditorEngine } from "../hooks";
import { NodeTitle } from "./NodeTitle";
import { useNodeMaterial } from "../hooks/useNodeMaterial";
import { useMaterialUI } from "../hooks/useMaterialUI";
import { ErrorTip } from "./ErrorTip";

export const NodeWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  padding: 0 50px;
  position: relative;
  user-select: none;
  &::before {
    content: "";
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 4px;
    border-style: solid;
    border-width: 8px 6px 4px;
    border-color: ${lineColor} transparent transparent;
    background: ${canvasColor};
  }
  &.start {
    &::before {
      height: 0;
      border-width: 0;
    }
  }
`;

export const NodeWrapBox = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 220px;
  min-height: 72px;
  flex-shrink: 0;
  background: ${nodeColor};
  border: solid ${(props) => (props.theme.mode === "dark" ? "1px" : 0)}
    ${(props) => props.theme?.token?.colorBorder};
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  &:after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .close {
    display: none;
  }
  &:hover {
    outline: solid 1px ${(props) => props.theme.token?.colorPrimary};
    .close {
      display: inline-flex;
    }
  }
`;
export const NodeContent = styled.div`
  position: relative;
  font-size: 14px;
  padding: 16px;
  padding-right: 30px;
  user-select: none;
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: nowrap;
  }
  .secondary {
    color: ${(props) => props.theme.token?.colorTextSecondary};
    opacity: 0.8;
  }
  .arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 14px;
    font-size: 14px;
    color: ${(props) => props.theme.token?.colorTextSecondary};
  }
`;
export const NormalNode = memo((props: { node: IWorkFlowNode }) => {
  const { node } = props;
  const t = useTranslate();
  const material = useNodeMaterial(node);
  const materialUi = useMaterialUI(node);
  const store = useEditorEngine();

  const handleClick = useCallback(() => {
    store?.selectNode(node?.id);
  }, [node?.id, store]);

  return (
    //就是一个div
    <NodeWrap className="node-wrap">
      <NodeWrapBox className="node-wrap-box" onClick={handleClick}>
        <NodeTitle node={node} material={material} />
        <NodeContent className="content">
          {materialUi?.viewContent && materialUi?.viewContent(node, { t })}
          <RightOutlined className="arrow" />
        </NodeContent>
        <ErrorTip nodeId={node.id} />
      </NodeWrapBox>
      {node?.id && <AddButton nodeId={node?.id} />}
      {node?.childNode && <ChildNode node={node?.childNode} />}
    </NodeWrap>
  );
});
