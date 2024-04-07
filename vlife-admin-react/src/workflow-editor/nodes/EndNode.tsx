import { memo } from "react"
import { styled } from "styled-components"
import { useTranslate } from "../react-locales"

const Container = styled.div`
  width: 100%;
  font-size: 14px;
  color: ${props => props.theme.token?.colorTextSecondary};
  text-align: left;
  user-select: none;
  margin-bottom: 56px;
  .end-node-circle {
    width: 10px;
    height: 10px;
    margin: auto;
    border-radius: 50%;
    background: ${props => props.theme.mode === "light" ? "#cacaca" : "rgba(255,255,255,0.35)"};
  }
  .end-node-text {
    margin-top: 5px;
    text-align: center
  }
`

export const EndNode = memo(() => {
  const t = useTranslate()
  return (
    <Container className="end-node">
      <div className="end-node-circle"></div>
      <div className="end-node-text">{t("flowFinished")}</div>
    </Container>
  )
})