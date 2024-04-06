import React, { useMemo, useState } from "react";
import { Space, Upload } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { Image } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/component";
const apiUrl = import.meta.env.VITE_APP_API_URL;
/**
 * 图片上传组件
 */
interface VfImageProps extends Partial<VfBaseProps<string | string[]>> {
  size?: "large" | "small" | "default";
}
const VfImage = ({
  fieldInfo,
  value,
  size = "small",
  onDataChange,
  read,
  disabled,
  className,
  ...props
}: VfImageProps) => {
  const action = `${apiUrl}/sysFile/uploadImg`;
  const [imageIds, setImageIds] = useState<string[]>();
  //是否手动修改过
  const [hand, setHand] = useState<boolean>(false);
  const viewSize = useMemo((): { width: number; height: number } => {
    if (size === "small") {
      return { width: 35, height: 35 };
    } else if (size === "large") {
      return { width: 150, height: 150 };
    } else {
      return { width: 100, height: 100 };
    }
  }, [size]);

  const getPrompt = (pos: any, isListTypes: any) => {
    let basicStyle = {
      display: "flex",
      alignItems: "center",
      color: "grey",
      height: isListTypes ? "100%" : 32,
    };
    let marginStyle: any = {
      left: { marginRight: 10 },
      right: { marginLeft: 10 },
    };
    let style = { ...basicStyle, ...marginStyle[pos] };

    return (
      <div style={style}>
        {/* {imageIds && imageIds.length === 1 && fieldInfo.fieldType === "basic"
          ? "删除后修改"
          : "请上传图片"} */}
      </div>
    );
  };

  const fileList = useMemo((): FileItem[] => {
    if (value && typeof value === "string") {
      return [
        {
          uid: value,
          status: "success",
          name: value,
          size: value,
          url: apiUrl + "/sysFile/image/" + value,
        },
      ];
    }
    return [];
  }, [value]);

  return read || disabled ? (
    <>
      <Space>
        {typeof value === "string" ? (
          <Image
            width={viewSize.width}
            height={viewSize.height}
            className={className}
            src={`${apiUrl}/sysFile/image/${value}`}
          />
        ) : (
          value &&
          value.length > 0 &&
          value.map((d) => (
            <Image
              width={viewSize.width}
              height={viewSize.height}
              className={className}
              src={`${apiUrl}/sysFile/image/${d}`}
            />
          ))
        )}
      </Space>
    </>
  ) : fileList && fileList.length > 0 ? (
    <>
      <div
        style={{
          marginBottom: 12,
          marginTop: 12,
          borderBottom: "1px solid var(--semi-color-border)",
        }}
      ></div>
      <Upload
        action={action}
        fileName="file"
        prompt={getPrompt("right", true)}
        promptPosition={"right"}
        listType="picture"
        limit={fieldInfo?.dataType === "array" ? 100 : 1}
        defaultFileList={fileList}
        afterUpload={(data: any) => {
          setHand(true);
          if (data.response.data === -1) {
          } else {
            if (onDataChange)
              if (fieldInfo?.dataType === "array") {
                onDataChange([
                  ...(imageIds ? imageIds : []),
                  data.response.data.id,
                ]);
              } else {
                onDataChange(data.response.data.id);
              }
            setImageIds([...(imageIds ? imageIds : []), data.response.data.id]);
          }
          return data;
        }}
        onRemove={(a, b, c) => {
          setHand(true);
          let result: any = undefined;
          if (fieldInfo?.dataType === "array") {
            result = imageIds?.filter((f) => f != c.uid);
          }
          if (onDataChange) {
            onDataChange(result);
          }
          setImageIds(result);
        }}
      >
        <IconPlus size="extra-large" />
      </Upload>
    </>
  ) : (
    <Upload
      action={action}
      fileName="file"
      prompt={getPrompt("right", true)}
      promptPosition={"right"}
      accept=".jpg,.png,.gif"
      listType="picture"
      limit={fieldInfo?.dataType === "array" ? 100 : 1}
      defaultFileList={fileList}
      afterUpload={(data: any) => {
        setHand(true);
        if (data.response.data === -1) {
        } else {
          if (onDataChange) {
            if (fieldInfo?.dataType === "array") {
              onDataChange([
                ...(imageIds ? imageIds : []),
                data.response.data.id,
              ]);
            } else {
              onDataChange(data.response.data.id);
            }
          }
          setImageIds([...(imageIds ? imageIds : []), data.response.data.id]);
        }
        return data;
      }}
      onRemove={(a, b, c) => {
        setHand(true);
        let result: any = undefined;
        if (fieldInfo?.dataType === "array") {
          result = imageIds?.filter((f) => f != c.uid);
        }
        if (onDataChange) {
          onDataChange(result);
        }
        setImageIds(result);
      }}
    >
      <IconPlus size="extra-large" />
    </Upload>
  );
};
export default VfImage;
