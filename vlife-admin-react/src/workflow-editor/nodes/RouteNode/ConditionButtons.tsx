import { useCallback } from "react";
// import { CloseOutlined } from "@ant-design/icons";
// import { Button, Tooltip } from "antd";
import { styled } from "styled-components";
import { useEditorEngine } from "../../hooks";
import { useTranslate } from "../../react-locales";
import { IRouteNode, IBranchNode } from "../../interfaces";
import { Tooltip } from "@douyinfe/semi-ui";

const Container = styled.div`
  position: absolute;
  right: -4px;
  top: -4px;
  display: flex;
  opacity: 0.7;
  font-size: 11px;
`;

export const ConditionButtons = (props: {
  parent: IRouteNode;
  node: IBranchNode;
}) => {
  const { parent, node } = props;
  const store = useEditorEngine();
  const t = useTranslate();

  const handleClose = useCallback(() => {
    node.id && store?.removeCondition(parent, node.id);
  }, [node.id, parent, store]);

  const handleClone = useCallback(() => {
    store?.cloneCondition(parent, node);
  }, [node, parent, store]);

  return (
    <Container className="mini-bar space-x-2">
      <Tooltip position="topRight" content={t("copyCodition")}>
        <i
          className="text-base  hover:text-blue-500 icon-task-copy"
          onClick={handleClone}
        />
      </Tooltip>
      <i
        className="text-base hover:text-blue-500 icon-delete"
        onClick={handleClose}
      />
    </Container>
  );
};
