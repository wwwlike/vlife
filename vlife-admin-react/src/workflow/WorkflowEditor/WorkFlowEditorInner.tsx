import { memo, useEffect } from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import {
  FlowEditorCanvas,
  useStartNode,
  useEditorEngine,
  IWorkFlowNode,
} from "../../workflow-editor";
import { useUpdateEffect } from "ahooks";
import { on } from "process";
import { FormVo } from "@src/api/Form";
const Container = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column;
  background-color: ${(props) => props.theme.token?.colorBgBase};
  color: ${(props) => props.theme.token?.colorText};
  height: 0;
`;
export enum TabType {
  baseSettings = "baseSettings",
  formDesign = "formDesign",
  flowDesign = "flowDesign",
  addvancedSettings = "addvancedSettings",
}

export const WorkFlowEditorInner = memo(
  (props: {
    className?: string;
    flowNode?: IWorkFlowNode;
    formVo?: FormVo;
    onDataChange?: (iWorkFlowNode?: IWorkFlowNode) => void;
  }) => {
    const { className, flowNode, onDataChange, formVo, ...other } = props;
    const edtorStore = useEditorEngine();

    useEffect(() => {
      if (flowNode) {
        edtorStore?.setStartNode(flowNode);
      }
    }, [flowNode]);
    const startNode = useStartNode();
    useUpdateEffect(() => {
      onDataChange?.(startNode);
    }, [startNode]);
    return (
      <Container
        className={classNames("workflow-editor", className || "")}
        {...other}
      >
        <FlowEditorCanvas form={formVo} />
      </Container>
    );
  }
);
