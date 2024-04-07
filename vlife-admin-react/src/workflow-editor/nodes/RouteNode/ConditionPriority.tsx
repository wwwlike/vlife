import { styled } from "styled-components"
import { useTranslate } from "../../react-locales"

const Container = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  display: flex;
`

export const ConditionPriority = ((
  props: {
    index: number
  }
) => {
  const { index } = props
  const t = useTranslate()
  return (
    <Container className="priority">
      {t("priority") + (index + 1)}
    </Container>
  )
})