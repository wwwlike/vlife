import { memo } from "react"
import { styled } from "styled-components"
import { IWorkFlowNode, NodeType } from "../../interfaces"
import { useTranslate } from "../../react-locales"
import { NodeTitleEditor } from "./NodeTitleEditor"

const Title = styled.div`
  font-weight: normal;
`

export const TitleText = styled.span`
  margin-right: 8px;
`

export const NodeTitle = memo((
  props: {
    node: IWorkFlowNode
    onNameChange: (value?: string) => void
  }
) => {
  const { node, onNameChange } = props

  const t = useTranslate()

  return (
    <Title>
      {
        node.nodeType === NodeType.start
          ? <TitleText className="title-text">{t("promoter")}</TitleText>
          : <NodeTitleEditor value={node.name} onChange={onNameChange} />
      }

    </Title>
  )
})