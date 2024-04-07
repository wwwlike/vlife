import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Space } from "antd"
import { memo } from "react"
import { styled } from "styled-components"
import { canvasColor } from "../../utils/canvasColor"

export const MiniFloatContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  user-select: none;
  background-color: ${canvasColor};
  padding: 4px 8px;
  border-radius: 5px;
  top: 16px;
  &.float{
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, ${props => props.theme.mode === "dark" ? "0.5" : "0.15"});
    transform: ${props => props.theme.mode === "dark" ? "" : "scale(1.05)"};
  }
  transition: all 0.3s;
  &.workflow-editor-zoombar{
    right: 32px;
  }
  &.workflow-operation-bar{
    left: 32px;
  }
`

export const ZoomBar = memo((
  props: {
    float?: boolean,
    zoom: number;
    onZoomIn: () => void,
    onZoomOut: () => void
  }
) => {
  const { float, zoom, onZoomIn, onZoomOut } = props

  return (
    <MiniFloatContainer className={"workflow-editor-zoombar" + (float ? " float" : "")}>
      <Space>
        <Button
          type={"text"}
          size="small"
          icon={<MinusOutlined />}
          disabled={zoom <= 0.1}
          onClick={onZoomOut}
        />
        {Math.round(zoom * 100)}%
        <Button
          type={"text"}
          size="small"
          icon={<PlusOutlined />}
          disabled={zoom >= 3}
          onClick={onZoomIn}
        />
      </Space>
    </MiniFloatContainer>
  )
})