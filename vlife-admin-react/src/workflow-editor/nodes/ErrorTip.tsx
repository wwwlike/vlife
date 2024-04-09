import { Tooltip } from "@douyinfe/semi-ui";
import { memo } from "react";
import { useError } from "../hooks/useError";
import { styled } from "styled-components";
// import { InfoCircleOutlined } from "@ant-design/icons";
// const ErrorIcon = styled(InfoCircleOutlined)`
//   color: red;
//   font-size: 24px;
// `;
const Schell = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  right: -40px;
`;

export const ErrorTip = memo((props: { nodeId: string }) => {
  const { nodeId } = props;
  const errorMsg = useError(nodeId);
  return (
    <Schell>
      {errorMsg && (
        <Tooltip content={errorMsg}>
          <i className=" text-red-500 text-xl  icon-error_outline" />
        </Tooltip>
      )}
    </Schell>
  );
});
