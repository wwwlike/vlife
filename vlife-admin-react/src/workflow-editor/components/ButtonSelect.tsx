import { Button, Divider } from "antd"
import { Fragment, memo, useCallback, useEffect, useState } from "react"
import { styled } from "styled-components"

const Shell = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.token?.colorBorderSecondary};
  padding: 2px 1px;
  border-radius: 6px;
`

const StyledDivider = styled(Divider)`
  margin: 0 4px;
  border-color: ${props => props.theme.token?.colorBorder};
`

const StyleButton = styled(Button)`
  flex:1;
  color: ${props => props.theme.token?.colorTextSecondary};
  &.active{
    color: ${props => props.theme.token?.colorText};
    cursor: default;
    &:hover{
      border: solid 1px ${props => props.theme.token?.colorBorder};
      color: ${props => props.theme.token?.colorText};
    }
    div{
      display: none;
    }
  }
`

export interface IButtonItem {
  key: string,
  label: React.ReactElement | string | undefined
}


export const ButtonSelect = memo((
  props: {
    options: IButtonItem[]
    value: string,
    onChange?: (value: string) => void
  }
) => {
  const { value, options, onChange } = props
  const [inputValue, setInputValue] = useState<string>(value || props.options?.[0]?.key)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleNodeClick = useCallback((key: string) => {
    setInputValue(key)
    onChange?.(key)
  }, [onChange])

  return (
    <Shell>
      {
        options.map((option, index) => {
          return (
            <Fragment key={option.key}>
              <StyleButton
                type={inputValue !== option.key ? "text" : undefined}
                className={inputValue === option.key ? "active" : undefined}
                onClick={() => handleNodeClick(option.key)}
              >
                {option.label}
              </StyleButton>
              {index < (options.length - 1) && <StyledDivider type="vertical" />}
            </Fragment>
          )
        })
      }
    </Shell>
  )
})