import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import React, { ReactNode, useCallback, useEffect } from "react";
/**
 * 1. 动态取数据，页面提供配置，然后存到前端 reactQuery方式缓存
 */
export interface modalProps {
  width?: number; //宽度
  title?: string; //
  children: ReactNode; // 子函数
  okFun: () => Promise<any>; //点击确认回调的方法
}

/**
 */
export const vlifeModal = createNiceModal(
  "vlifeModal",
  ({ children, width = 800, title = "", okFun, ...prop }: modalProps) => {
    const modal = useNiceModal("vlifeModal");
    useEffect(() => {}, [title]);
    return (
      <NiceModal
        id="vlifeModal"
        title={title}
        width={width}
        onOk={() => {
          okFun();
          modal.hide();
        }}
      >
        {children}
      </NiceModal>
    );
  }
);

export default vlifeModal;
