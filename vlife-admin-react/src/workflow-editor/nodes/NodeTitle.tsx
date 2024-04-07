import React, { memo, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { IWorkFlowNode } from "../interfaces";
import { CloseButton } from "./CloseButton";
import { INodeMaterial } from "../interfaces/material";
import { useEditorEngine } from "../hooks";

export const NodeTitleSchell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 30px;
  width: 100%;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: #fff;
  text-align: left;
  //background: #576a95;
  border-radius: 4px 4px 0 0;
  user-select: none;
  &.start-node-title{
    //background: rgb(87, 106, 149);
  }
`
export const NodeIcon = styled.div`
  font-size: 14px;
  margin-right: 8px;
`

export const TitleResponse = styled.div`
  flex:1;
  display: flex;
  padding: 2px 0;
  align-items: center;
`

export const NodeTitleText = styled.div`
  border: solid transparent 1px;
  &:hover{
    line-height: 16px;
    border-bottom: dashed 1px #fff;
  }
`

export const Input = styled.input`
  flex: 1;
  height: 18px;
  padding-left: 4px;
  text-indent: 0;
  font-size: 12px;
  line-height: 18px;
  z-index: 1;
  outline: solid 2px rgba(80,80,80, 0.3);
  border: 0;
  border-radius: 4px;
  background-color: ${props => props.theme?.token?.colorBgBase};
  color: ${props => props.theme?.token?.colorText};
`

export const NodeTitle = memo((props: {
  node: IWorkFlowNode,
  material?: INodeMaterial,
}) => {
  const { node, material } = props;
  const [editting, setEditting] = useState(false)
  const [inputValue, setInputValue] = useState(node.name)

  const editorStore = useEditorEngine()

  useEffect(() => {
    setInputValue(node.name)
  }, [node.name])

  const changeName = useCallback(() => {
    editorStore?.changeNode({ ...node, name: inputValue })
  }, [editorStore, inputValue, node])

  const handleNameClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setEditting(true)
  }, [])

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleBlur = useCallback(() => {
    changeName()
    setEditting(false)
  }, [changeName])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur()
    }
  }, [handleBlur])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  return <NodeTitleSchell className="node-title" style={{ backgroundColor: material?.color, color: "#fff" }}>
    <NodeIcon>
      {material?.icon}
    </NodeIcon>
    {!editting &&
      <>
        <TitleResponse onClick={handleNameClick}>
          <NodeTitleText className="text" >{node.name}</NodeTitleText>
        </TitleResponse>
        <CloseButton nodeId={node.id} />
      </>
    }
    {
      editting && <Input
        autoFocus
        value={inputValue}
        onClick={handleInputClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
    }
  </NodeTitleSchell>
})