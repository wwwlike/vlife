import { InfoCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import { memo } from "react"
import { styled } from "styled-components"
import { useError } from "../hooks/useError"

const Schell = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  right: -40px;
`
const ErrorIcon = styled(InfoCircleOutlined)`
  color:red;
  font-size: 24px;
`

export const ErrorTip = memo((props: {
  nodeId: string
}) => {
  const { nodeId } = props
  const errorMsg = useError(nodeId)
  return (
    <Schell>
      {
        errorMsg && <Tooltip title={errorMsg}>
          <ErrorIcon />
        </Tooltip>
      }
    </Schell>
  )
})