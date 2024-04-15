import { memo, useEffect, useState } from "react";
import { IWorkFlowNode, useEditorEngine } from "../../workflow-editor";
import { useTranslate } from "../../workflow-editor/react-locales";
import { CloseCircleOutlined } from "@ant-design/icons";
import { styled } from "styled-components";
import { Button, Modal, Notification } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
const Title = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorIcon = styled(CloseCircleOutlined)`
  color: red;
  font-size: 20px;
  margin-right: 8px;
`;

const Tip = styled.div`
  color: ${(props) => props.theme.token?.colorTextSecondary};
`;

const ErrorItem = styled.div`
  background-color: ${(props) => props.theme.token?.colorBorderSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  padding: 0 16px;
  border-radius: 5px;
  min-height: 48px;
`;

const ErrorCagetory = styled.div`
  color: ${(props) => props.theme.token?.colorTextSecondary};
  opacity: 0.8;
`;

const ErrorMessage = styled.div`
  font-size: 13px;
`;

export interface IErrorItem {
  category: string;
  message: string;
}

export const PublishButton = memo(
  ({
    onValidate,
    iWorkFlowNode,
  }: {
    iWorkFlowNode?: IWorkFlowNode;
    onValidate?: (result: boolean) => void;
  }) => {
    const [errors, setErrors] = useState<IErrorItem[]>();

    useUpdateEffect(() => {
      if (iWorkFlowNode && iWorkFlowNode.childNode) {
        const result = editorStore?.validate();
        if (result !== true && result !== undefined) {
          onValidate?.(false);
        } else {
          onValidate?.(true);
        }
      }
    }, [iWorkFlowNode]);

    const t = useTranslate();
    const editorStore = useEditorEngine();

    const handleValidate = () => {
      const result = editorStore?.validate();
      if (result !== true && result !== undefined) {
        const errs: IErrorItem[] = [];
        for (const nodeId of Object.keys(result)) {
          const msg = result[nodeId];
          const node = editorStore?.getNode(nodeId);
          errs.push({
            category: t("flowDesign"),
            message: node?.name + ": " + msg,
          });
        }
        setErrors(errs);
      } else {
        Notification.success({
          content: `验证成功`,
          position: "bottomRight",
        });
        // message.info("验证成功");
      }
      return result;
    };

    const handleOk = () => {
      setErrors(undefined);
    };

    const handleCancel = () => {
      setErrors(undefined);
    };

    return (
      <>
        {/* <Button onClick={handleValidate}>{t("publish")}</Button> */}
        <Modal
          title={
            <Title>
              <ErrorIcon />
              {t("cantNotPublish")}
            </Title>
          }
          visible={!!errors?.length}
          cancelText={t("gotIt")}
          okText={t("gotoEdit")}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Tip>{t("canNotPublishTip")}</Tip>
          {errors?.map((err, index) => {
            return (
              <ErrorItem key={index}>
                <ErrorCagetory>{err.category}</ErrorCagetory>
                <ErrorMessage>{err.message}</ErrorMessage>
              </ErrorItem>
            );
          })}
        </Modal>
      </>
    );
  }
);
