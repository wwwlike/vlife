import React, { useEffect, useState } from "react";
import { Modal, Space, TagInput } from "@douyinfe/semi-ui";
import { IFkItem } from "@src/api/base";
import { find, useDetail } from "@src/api/base/baseService";
import { DataType } from "@src/dsl/base";
import { VfBaseProps } from "@src/dsl/component";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
import FormPage from "@src/pages/common/formPage";

interface RelationInputProps
  extends Partial<VfBaseProps<string | string[], IFkItem[]>> {
  req: any; //列表过滤条件
  viewModel: string;
}

function queryData(
  value: string[],
  entityType: string
): Promise<any[] | undefined> {
  return find(entityType, "id", value).then((data) => {
    return data.data;
  });
}
/**
 * 外键关联选择预览
 */
const RelationTagInput = ({
  datas, //选中的数据，已经将value里封装在里面了
  fieldInfo,
  read,
  value,
  req,
  className,
  viewModel,
  onDataChange,
}: RelationInputProps) => {
  // 当前选中数据
  const [tagData, setTagData] = useState<any[]>(datas ? [...datas] : []);

  useEffect(() => {
    if (value && (tagData === undefined || tagData.length === 0)) {
      queryData(
        typeof value === "string" ? [value] : value,
        fieldInfo?.entityType || ""
      ).then((d) => {
        if (d) setTagData(d);
      });
    }
  }, []);

  useEffect(() => {
    if (tagData && tagData[0]) {
      getDetail(tagData[0].id, viewModel).then((d) => {
        setFormData(d.data);
      });
    }
  }, [tagData, viewModel]);
  /**
   * 列表选中的数据
   */
  const [tableSelectData, setTableSelectData] = useState<IFkItem[]>();

  const { runAsync: getDetail } = useDetail({
    entityType: fieldInfo?.entityType || "",
  });
  const [formData, setFormData] = useState<any>();

  useUpdateEffect(() => {
    onDataChange && onDataChange(tagData.map((d) => d.id));
  }, [tagData]);

  const [modalState, setModalState] = useState(false);

  return read ? (
    <Space>
      {tagData?.map((d) => {
        return (
          <div key={d.id} className="formily-semi-text">
            {d.name || d.no}
          </div>
        );
      })}
    </Space>
  ) : (
    <>
      <Modal
        title="关联选择"
        visible={modalState}
        onOk={() => {
          setModalState(false);
          setTagData([...(tableSelectData ? tableSelectData : [])]);
          // onDataChange(tagData.map((d) => d.id));
        }}
        centered
        onCancel={() => {
          setModalState(false);
        }}
        width={900}
        className=" m-96"
      >
        <TablePage
          listType={fieldInfo?.entityType || ""}
          selected={tagData}
          req={req}
          onSelected={(data: any) => {
            setTableSelectData(data);
          }} //table的选择事件
          mode={"view"}
          select_more={
            fieldInfo && fieldInfo.dataType === DataType.array ? true : false
          }
        />
      </Modal>
      <>
        {tagData === undefined ||
          (tagData.length === 0 && (
            <TagInput
              className={className}
              placeholder={fieldInfo && fieldInfo.title}
              onFocus={() => setModalState(true)}
            />
          ))}
        {formData && tagData !== undefined && tagData.length > 0 && (
          <FormPage
            formData={formData}
            className=" bg-slate-50 p-4 border rounded-xl "
            type={viewModel}
            fontBold={true}
            terse={true}
            readPretty={true}
          />
        )}
      </>
    </>
  );
};
export default RelationTagInput;
