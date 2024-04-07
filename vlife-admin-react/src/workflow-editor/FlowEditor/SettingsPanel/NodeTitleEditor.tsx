import { EditOutlined } from "@ant-design/icons"
import { memo, useCallback, useEffect, useState } from "react"
import { TitleText } from "./NodeTitle"
import { styled } from "styled-components"
import { Input } from "antd"

const TextResonse = styled.div`
  display: flex;
  cursor: pointer;
`

export const NodeTitleEditor = memo((
  props: {
    value?: string
    onChange?: (value?: string) => void
  }
) => {
  const { value, onChange } = props
  const [editting, setEditting] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const changeName = useCallback(() => {
    onChange?.(inputValue)
  }, [inputValue, onChange])

  const handleNameClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setEditting(true)
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

  return (
    <>
      {
        !editting && <TextResonse onClick={handleNameClick}>
          <TitleText className="title-text">{inputValue}</TitleText>
          <EditOutlined />
        </TextResonse>
      }
      {
        editting && <Input
          autoFocus
          value={inputValue}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      }
    </>
  )
})