import React, { useEffect, useState } from "react";
import { SysFile, list, remove, download } from "@src/api/SysFile";
import Button from "@src/components/button";
import { ConditionGroup, OptEnum, where } from "@src/dsl/base";
import { formatDate } from "@src/util/func";
import ShowUser from "../user/ShowUser";

export interface FileListProps {
  relationId: string; //文件关联业务id
  projectId?: string; //文件关联主体项目业务id
  type?: string; // 文件类别(相同业务实体，进行不同场景文件区分，如关联到人才有基本信息和合同之分)
  queryFieldName?: "projectId" | "relationId"; //查询的字段
}

export default (props: FileListProps) => {
  const { relationId, projectId, type, queryFieldName = "relationId" } = props;
  const [files, setFiles] = useState<SysFile[]>([]);
  useEffect(() => {
    const conditionGroups: ConditionGroup[] = [];

    const _where: Partial<where>[] = [];
    _where.push({
      fieldName: queryFieldName,
      opt: OptEnum.eq,
      value: [queryFieldName === "relationId" ? relationId : projectId],
    });
    if (type) {
      _where.push({
        fieldName: "type",
        opt: OptEnum.eq,
        value: [type],
      });
    }
    conditionGroups.push({
      where: _where,
    });

    list({
      conditionGroups,
    }).then((d) => {
      setFiles(d.data || []);
    });
  }, [relationId, projectId, type]);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const [pdfUrl, setPdfUrl] = useState("");

  return (
    //   <Image
    //   width={viewSize.width}
    //   height={viewSize.height}
    //   className={className}
    //   src={}
    // />

    <div className=" p-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex  p-2 w-full h-12 mt-1 rounded-md bg-gray-50   justify-between items-center hover:bg-gray-100 cursor-pointer "
        >
          <div className="flex  space-x-2">
            <i className="  icon-pdf1 text-2xl" />
            <div className=" font-bold">{file.name}</div>
            <div>
              {file.fileSize > 1024 * 1024
                ? (file.fileSize / 1024 / 1024).toFixed(2) + "mb"
                : (file.fileSize / 1024).toFixed(2) + "kb"}
            </div>
            <div>
              <ShowUser userId={file.createId}></ShowUser>
            </div>
            <div>{formatDate(file.createDate, "yyyy/MM/dd")}</div>
          </div>
          <div className=" flex space-x-2 justify-end">
            {file.fileName.endsWith("pdf") && (
              <a
                onClick={() => {
                  window.open(`${apiUrl}/sysFile/pdf/${file.id}`);
                }}
              >
                查看
              </a>
            )}
            <span>
              <a
                onClick={() => {
                  download(file.id);
                }}
              >
                下载
              </a>
            </span>
            <span>
              <Button
                title="删除"
                btnType="link"
                actionType="api"
                datas={file}
                submitConfirm={true}
                onSaveBefore={(data) => {
                  return [data.id];
                }}
                saveApi={remove}
                onSubmitFinish={() => {
                  setFiles((_files) => _files.filter((f) => f.id !== file.id));
                }}
              />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
