import React, { useEffect, useMemo, useState } from "react";
import { Button, Notification } from "@douyinfe/semi-ui";
import { tsCode } from "@src/api/Form";
import { IconClose } from "@douyinfe/semi-icons";

// 代码高亮
import { Prism } from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
// 代码复制
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useLocation, useNavigate } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";
import DownloadButton from "./component/CodeDownload";

export default () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const local = useLocation();

  const entityName = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, []);

  useEffect(() => {
    if (entityName)
      tsCode(entityName).then((t) => {
        if (t.data) setCode(t.data);
      });
  }, [entityName]);
  const handleCopy = () => {
    Notification.success({
      content: `复制成功`,
    });
  };

  return (
    <Scrollbars autoHide={true}>
      <div className="relative rounded-md">
        <div className=" text-red-500 absolute top-2 left-16 text-sm">
          点击即可复制
        </div>
        <div className=" text-red-500 absolute top-2 right-16 text-sm">
          如果代码不是最新的，请后端同学运行maven-install命令
        </div>
        {/*justify-end 要配合 flex  */}
        <Button
          type="primary"
          className=" fixed  right-10 top-20"
          icon={<IconClose />}
          onClick={() => {
            navigate(-1);
          }}
          aria-label="关闭"
        />
        <DownloadButton
          className=" fixed right-10 bottom-4"
          data={code}
          fileName={`${
            entityName.charAt(0).toUpperCase() + entityName.slice(1)
          }.ts`}
        ></DownloadButton>
        <CopyToClipboard onCopy={handleCopy} text={code}>
          <Prism
            showLineNumbers={true}
            startingLineNumber={0}
            language="typescript"
            wrapLines={true}
            style={duotoneLight}
          >
            {code}
          </Prism>
        </CopyToClipboard>
      </div>
    </Scrollbars>
  );
};
