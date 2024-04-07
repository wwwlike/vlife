import { memo, useCallback } from "react"
import { INodeMaterial } from "../../interfaces/material"
import { useTranslate } from "../../react-locales"
import { styled } from "styled-components"
import { useEditorEngine } from "../../hooks"
import { createUuid } from "../../utils/create-uuid"

const MaterialSchell = styled.div`
  width: 50%;
  padding: 4px 8px;
`

const MItem = styled.div`
  padding: 0px 8px;
  height: 64px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover{
    box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, ${props => props.theme.mode === "light" ? "0.08" : "0.2"});
  }
`

const MaterialIcon = styled.div`
  display: flex;
  height: 40px;
  width: 40px;
  border: solid 1px ${props => props.theme.token?.colorBorder};
  margin-right: 16px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #ff943e;
`
export const MaterialItem = memo((
  props: {
    nodeId: string,
    material: INodeMaterial,
    onClick?: () => void
  }
) => {
  const { nodeId, material, onClick } = props
  const t = useTranslate();
  const editorStore = useEditorEngine()

  const handleClick = useCallback(() => {
    const newId = createUuid()
    const newName = t(material.label)
    if (material.defaultConfig) {
      //复制一份配置数据，保证immutable
      editorStore?.addNode(nodeId, { ...JSON.parse(JSON.stringify(material.defaultConfig)), id: newId, name: newName })
    } else if (material.createDefault) {
      editorStore?.addNode(nodeId, { ...material.createDefault({ t }), name: newName })
    } else {
      console.error("Material no defutConfig or createDefault")
    }

    editorStore?.selectNode(newId);
    onClick?.()
  }, [editorStore, material, nodeId, onClick, t])

  return (
    <MaterialSchell>
      <MItem onClick={handleClick}>
        <MaterialIcon style={{ color: material.color }}>
          {material.icon}
        </MaterialIcon>
        {t(material.label)}
      </MItem>
    </MaterialSchell>
  )
})