/**
 * 确认型弹出框
 */
import NiceModal, { createNiceModal, useNiceModal } from "@src/store";
import React, { useCallback } from "react";
import { FormPageProps } from "./formPage";

/**
 * 1. 动态取数据，页面提供配置，然后存到前端 reactQuery方式缓存
 */
export interface Mp4ModalProps {
  id: string;
  title?: string; //默认删除的内容
}

/**
 */
export const Mp4Modal = createNiceModal("mp4Modal", (props: Mp4ModalProps) => {
  const modal = useNiceModal("mp4Modal");
  const handleSubmit = useCallback(() => {
    //提交按钮触发的事件
    modal.hide();
  }, []);

  return (
    <NiceModal
      id="mp4Modal"
      title={props.title}
      width={1024}
      onOk={handleSubmit}
    >
      <iframe
        src={
          "//player.bilibili.com/player.html?aid=" +
          props.id +
          "&page=1&danmaku=0&high_quality=1"
        }
        // allowfullscreen="allowfullscreen"
        width="100%"
        height="800"
        scrolling="no"
        // frameborder="0"
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
      ></iframe>
    </NiceModal>
  );
});

export default Mp4Modal;
