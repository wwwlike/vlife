// import { message } from "antd";
import { useCallback } from "react";
import { saveFile } from "../utils/saveFile";
import { useTranslate } from "../react-locales";
import { useStartNode } from "./useStartNode";
import { Notification } from "@douyinfe/semi-ui";
export function useExport() {
  const t = useTranslate();
  const startNode = useStartNode();
  const doExport = useCallback(() => {

    saveFile(`approvalflow`, JSON.stringify({ startNode }, null, 2)).then(
      (savedName) => {
        if (savedName) {
          Notification.success({
            content:t("operateSuccess"),
          });
          // message.success(t("operateSuccess"))
        }
      }
    ).catch(err => {
      console.error(err)
    });
  }, [startNode, t]);

  return doExport
}