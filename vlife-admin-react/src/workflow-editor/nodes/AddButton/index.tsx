import { PlusOutlined } from "@ant-design/icons"
import { Popover } from "antd"
import { memo, useCallback, useState } from "react"
import { styled } from "styled-components"
import { ContentPanel } from "./ContentPanel"

const AddButtonBox = styled.div`
      width: 240px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    position: relative;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        margin: auto;
        width: 2px;
        height: 100%;
        background-color: ${props => props.theme.mode === "light" ? "#cacaca" : "rgba(255,255,255,0.35)"};
    }
`

const ButtonShell = styled.div`
  user-select: none;
  width: 240px;
  padding: 20px 0 32px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  flex-shrink: 0;
  -webkit-box-flex: 1;
  flex-grow: 1;
  .btn {
      //display: flex;
      //justify-content: center;
      //align-items: center;
      padding-left: 4.5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
      width: 30px;
      height: 30px;
      background: ${props => props.theme?.token?.colorPrimary};
      border-radius: 50%;
      position: relative;
      border: none;
      line-height: 28px;
      -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      cursor: pointer;
      color:#fff;
      font-size: 20px;
      &:hover {
        transform: scale(1.3);
        box-shadow: 0 13px 27px 0 rgba(0, 0, 0, .1)
      }
      &:active {
        transform: none;
        background: ${props => props.theme?.token?.colorPrimary};
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1)
      }
  }
`

export const AddButton = memo((
  props: {
    nodeId: string
  }
) => {
  const { nodeId } = props
  const [open, setOpen] = useState(false)

  const handleOpenChange = useCallback((status: boolean) => {
    setOpen(status)
  }, [])

  const handleMaterialClick = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <AddButtonBox className="add-node-button-box">
      <ButtonShell>
        <Popover
          placement="rightTop"
          content={<ContentPanel nodeId={nodeId} onClickMaterial={handleMaterialClick} />}
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <div className="btn">
            <PlusOutlined />
          </div>
        </Popover>
      </ButtonShell>
    </AddButtonBox>
  )
})