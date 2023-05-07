import React, { useEffect, useMemo, useState } from "react";
import { Space, Upload } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { SysFile } from "@src/api/SysFile";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { Image } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/schema/component";
const apiUrl = import.meta.env.VITE_APP_API_URL;
/**
 * @returns 图片上传组件
 */

interface VfImageProps
  extends Partial<VfBaseProps<string | string[], SysFile[]>> {
  size?: "large" | "small" | "default";
}
const VfImage = ({
  fieldInfo,
  value,
  datas,
  size = "small",
  onDataChange,
  read,
}: VfImageProps) => {
  const action = `${apiUrl}/sysFile/uploadImg`;

  const [imageIds, setImageIds] = useState<string[]>();
  //是否手动修改过
  const [hand, setHand] = useState<boolean>(false);
  useEffect(() => {
    //没有手工调整过之前都使用服务端传来的已上传数据信息
    if (datas && hand === false) {
      setImageIds(datas.map((d: any) => d.id));
    }
  }, [datas, hand]);

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
    if (datas) {
      return (
        datas
          // ?.filter((d) => imageIds?.includes(d.id))
          .map((d: any) => {
            return {
              uid: d.id,
              status: "success",
              name: d.fileName,
              size: d.size,
              url: apiUrl + "/sysFile/image/" + d.id,
            };
          }) || []
      );
    } else if (value && typeof value === "string") {
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
  }, [datas, value]);

  return read ? (
    <>
      <Space>
        {typeof value === "string" ? (
          <Image
            width={viewSize.width}
            height={viewSize.height}
            src={`${apiUrl}/sysFile/image/${value}`}
          />
        ) : (
          value?.map((d) => (
            <Image
              width={viewSize.width}
              height={viewSize.height}
              src={`${apiUrl}/sysFile/image/${d}`}
            />
          ))
        )}
      </Space>
    </>
  ) : fileList && fileList.length > 0 ? (
    <>
      {/* {JSON.stringify(fileList[0].url)} */}
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
        limit={fieldInfo?.fieldType === "list" ? 100 : 1}
        defaultFileList={fileList}
        afterUpload={(data: any) => {
          setHand(true);
          if (data.response.data === -1) {
          } else {
            if (onDataChange)
              if (fieldInfo?.fieldType === "list") {
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
          if (fieldInfo?.fieldType === "list") {
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
    <>
      {/* {JSON.stringify(fileList)} */}
      <Upload
        action={action}
        fileName="file"
        prompt={getPrompt("right", true)}
        promptPosition={"right"}
        accept=".jpg,.png,.gif"
        listType="picture"
        limit={fieldInfo?.fieldType === "list" ? 100 : 1}
        defaultFileList={fileList}
        afterUpload={(data: any) => {
          setHand(true);
          if (data.response.data === -1) {
          } else {
            if (onDataChange) {
              if (fieldInfo?.fieldType === "list") {
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
          if (fieldInfo?.fieldType === "list") {
            result = imageIds?.filter((f) => f != c.uid);
          }
          if (onDataChange) {
            onDataChange(result);
          }
          setImageIds(result);
        }}
        // defaultFileList={value && datas ? fileList : {}}
      >
        <IconPlus size="extra-large" />
      </Upload>
    </>
  );
};

export default VfImage;
