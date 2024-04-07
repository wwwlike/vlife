import { memo, useCallback } from "react"
import { IBranchNode, IRouteNode } from "../../interfaces"
import { styled } from "styled-components"
import { lineColor } from "../../utils/lineColor"
import { nodeColor } from "../../utils/nodeColor"
import { canvasColor } from "../../utils/canvasColor"
import { AddButton } from "../AddButton"
import { ChildNode } from "../ChildNode"
import { useTranslate } from "../../react-locales"
import { useEditorEngine } from "../../hooks"
import { ConditionNodeTitle } from "./ConditionNodeTitle"
import { useMaterialUI } from "../../hooks/useMaterialUI"
import { ErrorTip } from "../ErrorTip"

const ColBox = styled.div`
  display: inline-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  user-select: none;
  background-color: ${canvasColor};
  &::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: ${lineColor};
  }
`

const BranchStyleNode = styled.div`
  min-height: 220px;
  display: inline-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-flex: 1;
  user-select: none;
`
const BranchNodeBox = styled.div`
  padding-top: 30px;
  padding-right: 50px;
  padding-left: 50px;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  flex-grow: 1;
  position: relative;
  display: inline-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-flex: 1;
  user-select: none;
`

const AutoJudge = styled.div`
  position: relative;
  width: 220px;
  min-height: 72px;
  background: ${nodeColor};
  border: solid ${props => props.theme.mode === "dark" ? "1px" : 0} ${props => props.theme?.token?.colorBorder};
  border-radius: 4px;
  padding: 8px 16px;
  user-select: none;
  cursor: pointer;
  &::after{
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
    transition: all .1s cubic-bezier(.645, .045, .355, 1);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .1);
  }
  &.active{
    &::after{
      border: 1px solid #3296fa;
      box-shadow: 0 0 6px 0 rgba(50, 150, 250, .3)
    }
  }
  .mini-bar{
    display: none;
  }
  .priority{
    display: flex;
  }
  &:hover{
    &::after{
      border: 1px solid #3296fa;
      box-shadow: 0 0 6px 0 rgba(50, 150, 250, .3)
    }
    .sort-handler{
      display: flex;
      align-items: center;
    }
    .mini-bar{
      display: flex;
    }
    .priority{
      display: none;
    }
  }
`
const LineCover = styled.div`
  position: absolute;
  height: 8px;
  width: 50%;
  background-color: ${canvasColor};
  &.left{
    left:-1px;
  }
  &.right{
    right: -1px;
  }
  &.top{
    top: -4px;
  }
  &.bottom{
    bottom: -4px;
  }
`

const SortHandler = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: none;
  z-index: 1;
  height: 100%;
  color: ${props => props.theme.token?.colorTextSecondary};
  &.left{
    left: 0;
    border-right: 1px solid ${props => props.theme.token?.colorBorder};
  }
  &.right{
    right: 0;
    border-left: 1px solid ${props => props.theme.token?.colorBorder};
  }
  &:hover{
    background-color: ${props => props.theme.token?.colorBorderSecondary};
  }
`
const NodeContent = styled.div`
  position: relative;
  font-size: 14px;
  padding: 16px 0;
  padding-right: 30px;
  user-select: none;
`

export const BranchNode = memo((props: { parent: IRouteNode, node: IBranchNode, index: number, length: number }) => {
  const { parent, node, index, length } = props
  const t = useTranslate()
  const editorStore = useEditorEngine()
  const materialUi = useMaterialUI(node)

  const handleClick = useCallback(() => {
    editorStore?.selectNode(node?.id)
  }, [editorStore, node?.id])

  const hanldeMoveLeft = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    node.id && editorStore?.transConditionOneStepToLeft(parent, index)
  }, [editorStore, index, node.id, parent])

  const handleMoveRight = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    node.id && editorStore?.transConditionOneStepToRight(parent, index)
  }, [editorStore, index, node.id, parent])

  return (
    <ColBox className="col-box" draggable={false}>
      <BranchStyleNode className="condition-node" draggable={false}>
        <BranchNodeBox className="condition-node-box" draggable={false}>
          <AutoJudge className="auto-judge" draggable={false} onClick={handleClick}>
            {
              index !== 0 &&
              <SortHandler className="sort-handler left" onClick={hanldeMoveLeft}>
                &lt;
              </SortHandler>
            }
            <ConditionNodeTitle node={node} parent={parent} index={index} />
            <NodeContent className="content">
              {materialUi?.viewContent && materialUi?.viewContent(node, { t })}
            </NodeContent>
            {
              index !== (length - 1) &&
              <SortHandler className="sort-handler right" onClick={handleMoveRight}>
                &gt;
              </SortHandler>
            }
            <ErrorTip nodeId={node.id} />
          </AutoJudge>
          {node?.id && <AddButton nodeId={node?.id} />}
          {node?.childNode && <ChildNode node={node?.childNode} />}
        </BranchNodeBox>
      </BranchStyleNode>
      {
        index === 0 &&
        <>
          <LineCover className="top left" />
          <LineCover className="bottom left" />
        </>
      }
      {
        index === (length - 1) &&
        <>
          <LineCover className="top right" />
          <LineCover className="bottom right" />
        </>
      }
    </ColBox>
  )
})