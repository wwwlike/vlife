import { useCallback } from "react";
import { useEditorEngine } from "../hooks";
// import { CloseOutlined } from "@ant-design/icons"
import { styled } from "styled-components";
import { Button } from "@douyinfe/semi-ui";

const CloseStyledButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const CloseButton = (props: { nodeId?: string }) => {
  const { nodeId } = props;
  const store = useEditorEngine();

  const handleClose = useCallback(() => {
    store?.removeNode(nodeId);
  }, [nodeId, store]);

  return (
    <CloseStyledButton
      className="close"
      // type="text"
      size="small"
      // shape="circle"
      icon={<i className=" text-xl icon-close" />}
      onClick={handleClose}
    />
  );
};
