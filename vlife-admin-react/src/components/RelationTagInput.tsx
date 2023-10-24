import React, { useEffect, useState } from "react";
import { Modal, Space, TagInput } from "@douyinfe/semi-ui";
import { IFkItem } from "@src/api/base";
import { find } from "@src/api/base/baseService";
import { DataType } from "@src/dsl/base";
import { VfBaseProps } from "@src/dsl/component";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";

interface RelationInputProps
  extends Partial<VfBaseProps<string | string[], IFkItem[]>> {
  req: any; //列表过滤条件
}

function queryData(
  value: string[],
  entityType: string
): Promise<IFkItem[] | undefined> {
  return find(entityType, "id", value).then((data) => {
    return data.data;
  });
}
/**
 * 外键关系的tagInput组件
 */
const RelationTagInput = ({
  datas, //选中的数据，已经将value里封装在里面了
  fieldInfo,
  read,
  value,
  req,
  className,
  onDataChange,
}: RelationInputProps) => {
  // 当前选中数据
  const [tagData, setTagData] = useState<IFkItem[]>(datas ? [...datas] : []);

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

  /**
   * 列表选中的数据
   */
  const [tableSelectData, setTableSelectData] = useState<IFkItem[]>();

  useUpdateEffect(() => {
    onDataChange && onDataChange(tagData.map((d) => d.id));
  }, [tagData]);

  const [modalState, setModalState] = useState(false);

  return read ? (
    <Space>
      {tagData?.map((d) => {
        return (
          <div key={d.id} className="formily-semi-text">
            {d.name}
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
        {/* {JSON.stringify(tagData)} */}
        <TagInput
          className={className}
          // showClear
          placeholder={fieldInfo && fieldInfo.title}
          value={tagData?.map((m) => m.name)}
          defaultValue={tagData?.map((m) => m?.id)}
          onFocus={() => setModalState(true)}
          onRemove={(v, i) => {
            const obj = [
              ...tagData.filter((d, index) => {
                return i !== index;
              }),
            ];
            // alert(obj.length);
            setTagData([...obj]);
          }}
        />
      </>
    </>
  );
};
export default RelationTagInput;
