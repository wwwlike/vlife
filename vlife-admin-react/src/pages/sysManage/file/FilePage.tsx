import { save } from "@src/api/SysFile";
import React, { useState } from "react";
import Button from "@src/components/button";
import VfUpload from "@src/components/VfUpload";
import FileList, { FileListProps } from "./FileList";

//文件上传预览页面
export interface FilePageProps extends FileListProps {
  title?: string;
}
export default ({ title, ...props }: FilePageProps) => {
  const { relationId, projectId, type } = props;
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* {relationId}-{projectId} */}
      <Button
        actionType="create"
        modal={<VfUpload className="h-48" />}
        onSubmitFinish={() => {
          setCount(count + 1);
        }}
        submitClose={true}
        onClick={(ids: string[]) => {
          const _files = ids.map((id) => {
            return {
              id,
              relationId: relationId,
              projectId: projectId,
              type: type,
            };
          });
          // 关联业务id
          save(_files).then((d) => {
            setCount((count) => count + 1);
          });
        }}
        title={title || "上传"}
      />
      <FileList key={count} {...props}></FileList>
    </div>
  );
};
