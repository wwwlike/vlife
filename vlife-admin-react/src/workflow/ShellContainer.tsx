import { memo } from "react"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column;
`

export const ShellContainer = memo((
  props: {
    children?: React.ReactNode
  }
) => {

  return (
    <Container>
      {props.children}
    </Container>
  )
})