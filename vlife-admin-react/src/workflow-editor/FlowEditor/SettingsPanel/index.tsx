import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { memo, useCallback } from "react";
import { NodeTitle } from "./NodeTitle";
import { Footer } from "./Footer";
import { useSelectedNode } from "../../hooks/useSelectedNode";
import { useEditorEngine } from "../../hooks";
import { styled } from "styled-components";
import { useMaterialUI } from "../../hooks/useMaterialUI";
import { FormVo } from "@src/api/Form";

const Content = styled.div`
  display: flex;
  flex-flow: column;
`;
export const SettingsPanel = memo((props: { formVo?: FormVo }) => {
  const selectedNode = useSelectedNode();
  const materialUi = useMaterialUI(selectedNode);
  const store = useEditorEngine();
  const handelClose = useCallback(() => {
    store?.selectNode(undefined);
  }, [store]);

  const handleConfirm = useCallback(() => {
    store?.selectNode(undefined);
  }, [store]);

  const handleNameChange = useCallback(
    (name?: string) => {
      selectedNode && store?.changeNode({ ...selectedNode, name });
    },
    [store, selectedNode]
  );

  const handleSettingsChange = useCallback(
    (value: any) => {
      if (
        selectedNode?.nodeType === "approver" || //审核节点
        selectedNode?.nodeType === "audit" || //办理节点
        selectedNode?.nodeType === "start" || //开始节点
        selectedNode?.nodeType === "notifier" //抄送节点
      ) {
        store?.changeNode({ ...selectedNode, approverSettings: value });
      } else if (selectedNode?.nodeType === "condition") {
        store?.changeNode({ ...selectedNode, conditions: value });
      }
      // selectedNode && store?.changeNode({ ...selectedNode, ...value });
    },
    [selectedNode]
  );
  return (
    <Drawer
      title={
        selectedNode && (
          <NodeTitle node={selectedNode} onNameChange={handleNameChange} />
        )
      }
      placement="right"
      width={656}
      closable={false}
      extra={
        <Button
          size="small"
          type="text"
          icon={<CloseOutlined />}
          onClick={handelClose}
        />
      }
      footer={<Footer onConfirm={handleConfirm} onCancel={handelClose} />}
      onClose={handelClose}
      open={!!selectedNode}
    >
      {/* 不同类型的节点右侧使用不同的面板，条件类型节点使用conditions数据 */}
      <Content className="settings-panel-content">
        {materialUi?.settersPanel && (
          <materialUi.settersPanel
            value={
              selectedNode?.nodeType === "condition"
                ? selectedNode?.conditions
                : selectedNode?.approverSettings
            }
            onChange={handleSettingsChange}
            formVo={props.formVo}
          />
        )}
      </Content>
    </Drawer>
  );
});
