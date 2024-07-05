import { memo, useCallback, useEffect, useState } from "react";
import { ShellContainer } from "../ShellContainer";
import { styled } from "styled-components";
import { WorkflowEditor } from "../WorkflowEditor";
import { materialUis } from "../materialUis";
import { useLocation } from "react-router-dom";
import { IWorkFlowNode } from "@src/workflow-editor/interfaces";
import { Button, Space } from "@douyinfe/semi-ui";

const Toolbar = styled.div`cnp
  height: 56px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 8px 16px;
  justify-content: space-between;
  box-sizing: border-box;
`;

export enum Lang {
  cn = "zh-CN",
  en = "en-US",
}

export default memo(() => {
  const [lang, setlang] = useState<Lang>(Lang.cn);
  const currentLocation = useLocation();
  const [themeMode, setThemeMode] = useState<"dark" | "light">("light");

  const handleToggleTheme = useCallback(() => {
    setThemeMode((mode) => (mode === "light" ? "dark" : "light"));
  }, []);

  const handleSwitchLang = useCallback(() => {
    setlang((lang) => (lang === Lang.cn ? Lang.en : Lang.cn));
  }, []);

  const [flowNode, setFlowNode] = useState<IWorkFlowNode>();
  useEffect(() => {
    if (
      currentLocation &&
      currentLocation.state &&
      currentLocation.state.json
    ) {
      setFlowNode(JSON.parse(currentLocation.state.json));
    }
  }, [currentLocation]);

  return (
    // div根容器
    <ShellContainer>
      {/* div容器2 */}
      <Toolbar>
        <span>审批流演示</span>
        <Space>
          <Button onClick={handleToggleTheme}>主题切换</Button>
          <Button onClick={handleSwitchLang}>
            {lang === Lang.cn ? "English" : "中文"}
          </Button>
        </Space>
      </Toolbar>
      <WorkflowEditor
        themeMode={themeMode}
        lang={lang}
        //dlc 卡片，setting 和校验的配置信息
        materialUis={materialUis}
        flowNode={flowNode}
      />
    </ShellContainer>
  );
});
