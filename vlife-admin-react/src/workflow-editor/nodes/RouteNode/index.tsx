import { memo } from "react"
import { IRouteNode } from "../../interfaces"
import { styled } from "styled-components"
import { AddBranchButton } from "./AddBranchButton"
import { AddButton } from "../AddButton"
import { lineColor } from "../../utils/lineColor"
import { ChildNode } from "../ChildNode"
import { BranchNode } from "./BranchNode"

const RouteWrap = styled.div`
  display: inline-flex;
`
const RouteBoxWrap = styled.div`
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 270px;
  width: 100%;
  -ms-flex-negative: 0;
  flex-shrink: 0;
`

const RouteBox = styled.div`
  display: flex;
  overflow: visible;
  min-height: 180px;
  height: auto;
  border-bottom: 2px solid;
  border-top: 2px solid;
  border-color: ${lineColor};
  position: relative;
  margin-top: 15px;
`

export const RouteNode = memo((
  props: {
    node: IRouteNode
  }
) => {
  const { node } = props
  return (
    <RouteWrap className="route-wrap" draggable={false}>
      <RouteBoxWrap className="route-box-wrap" draggable={false}>
        <RouteBox className="route-box" draggable={false}>
          <AddBranchButton node={node} />
          {
            node.conditionNodeList?.map((child, index) => {
              return (
                <BranchNode key={child.id} parent={node} node={child} index={index} length={node.conditionNodeList?.length || 0} />
              )
            })
          }
        </RouteBox>
        {node?.id && <AddButton nodeId={node?.id} />}
        {node?.childNode && <ChildNode node={node?.childNode} />}
      </RouteBoxWrap>
    </RouteWrap>
  )
})