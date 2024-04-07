import { IDefaultTheme } from "../theme";

export const lineColor = (props: { theme: IDefaultTheme }) => props.theme?.mode === "light" ? "#cacaca" : "rgba(255,255,255,0.35)"