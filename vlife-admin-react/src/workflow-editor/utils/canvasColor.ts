import { IDefaultTheme } from "../theme";

export const canvasColor = (props: { theme: IDefaultTheme }) => props.theme.mode === "light" ? "#f5f5f7" : props.theme.token?.colorBgBase