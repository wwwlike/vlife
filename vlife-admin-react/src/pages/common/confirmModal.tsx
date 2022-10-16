/**
 * 确认型弹出框
 */
import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import React, { useCallback } from "react";
import { FormPageProps } from "./formPage";

/**
 * 1. 动态取数据，页面提供配置，然后存到前端 reactQuery方式缓存
 */
export interface ConfirmModalProps
  extends Omit<FormPageProps, "setFormData" | "formData"> {
  saveFun?: () => Promise<number>;
  title?: string; //默认删除的内容
}

/**
 */
export const ConfirmModal = createNiceModal(
  "confirmModal",
  ({ saveFun, title = "确认删除选中的记录么?" }: ConfirmModalProps) => {
    const modal = useNiceModal("confirmModal");
    const handleSubmit = useCallback(() => {
      //提交按钮触发的事件
      if (saveFun) {
        //通用保存
        saveFun()
          .then((data) => {
            modal.resolve(data);
          })
          .finally(() => {
            modal.hide();
          });
      }
    }, [saveFun]);

    return (
      <NiceModal
        id="confirmModal"
        title={"操作确认"}
        width={350}
        onOk={handleSubmit}
      >
        <p>{title}</p>
      </NiceModal>
    );
  }
);

export default ConfirmModal;
