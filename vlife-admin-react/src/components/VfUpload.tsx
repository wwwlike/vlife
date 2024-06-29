import React, { useEffect, useMemo, useState } from "react";
import { Button, Space, Upload } from "@douyinfe/semi-ui";
import { IconPlus, IconUpload } from "@douyinfe/semi-icons";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { Image } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/component";
import { remove, upload } from "@src/api/SysFile";
import apiClient, { localStorageKey } from "@src/api/base/apiClient";
const apiUrl = import.meta.env.VITE_APP_API_URL;
/**
 * 批量文件上传组件
 * 支持拖拽上传
 */
interface VfUploadProps extends Partial<VfBaseProps<string[]>> {
  className?: string;
  //支持的文件后缀
  fileType?: string[];
  //上传文件大小限制
  maxSize?: number;
  //上传文件数量限制
  maxCount?: number;
}
const VfImage = ({
  onDataChange,
  maxCount,
  className,
  maxSize,
  fileType,
}: VfUploadProps) => {
  const action = `${apiUrl}/sysFile/uploadImg`;
  const token = window.localStorage.getItem(localStorageKey);
  const [files, setFiles] = useState<string[]>();

  useEffect(() => {
    onDataChange?.(files);
  }, [files]);

  const mockRequest1 = ({ file, onProgress, onError, onSuccess }: any) => {
    let count = 0;
    let interval = setInterval(() => {
      if (count === 100) {
        clearInterval(interval);
        onSuccess();
        return;
      }
      onProgress({ total: 100, loaded: count });
      count += 20;
    }, 500);
  };

  const mockRequest = ({ file, onProgress, onError, onSuccess }: any) => {
    const formData = new FormData();
    formData.append("file", file);
    apiClient.post(`/sysFile/uploadImg`, formData);
  };

  // upload(formData).then((res) => {
  //   onSuccess();
  // });

  return (
    <Upload
      className={className}
      headers={{
        Authorization: token,
      }}
      fileName="file"
      afterUpload={(data: any) => {
        setFiles([...(files ? files : []), data.response.data.id]);
        return data;
      }}
      onRemove={(a, b, c) => {
        const _id = c.response?.data?.id;
        if (_id) {
          remove([_id]).then((d) => {
            setFiles((imageIds) => {
              const files = imageIds?.filter((item) => item !== _id);
              return files && files.length > 0 ? files : undefined;
            });
          });
        }
      }}
      onClear={() => {
        files &&
          remove(files).then((d) => {
            setFiles(undefined);
          });
      }}
      maxSize={1024 * 10}
      action={action}
      draggable={true}
      // customRequest={mockRequest}
    >
      {/* <Button icon={<IconUpload />} theme="light">
        点击上传
      </Button> */}

      {/* {JSON.stringify(files)} */}
    </Upload>
  );
};
export default VfImage;
