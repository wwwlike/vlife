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
        <div className=" text-red-500 absolute left-16 text-sm">
          点击即可复制(请统一把代码复制或者下载到src/api的目录下,高级版可以自动生成最新前端代码到指定的目录下,不建议在生成的代码上进行修改和逻辑编写，推荐新增封装ts类库)
        </div>
        <div className=" text-blue-500 absolute top-4 left-16 text-sm">
          如与服务端接口或者模型信息不同步，请后端同学运行maven-package命令后重启应用即可
        </div>
        <Button
          type="primary"
          className=" fixed right-10 top-20"
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
