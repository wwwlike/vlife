import React, { useEffect, useState } from "react";
import { Modal, Space, TagInput } from "@douyinfe/semi-ui";
import { IFkItem } from "@src/api/base";
import { find } from "@src/api/base/baseService";
import { DataType } from "@src/dsl/base";
import { ISelect, VfBaseProps } from "@src/dsl/component";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
interface RelationTagInputProps
  extends Partial<VfBaseProps<string | string[]>> {
  req: any; //列表过滤条件
  onObjectlChange?: (obj: ISelect[]) => void;
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
 * 外键关系的tagInput组件
 */
const RelationTagInput = ({
  fieldInfo,
  read,
  value,
  req,
  placeholder,
  className,
  onDataChange,
  onObjectlChange,
}: RelationTagInputProps) => {
  // 当前选中数据
  const [tagData, setTagData] = useState<any[]>([]);

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
    onObjectlChange &&
      onObjectlChange(
        tagData.map((d) => {
          return {
            label: d.name || d.no || "没有name和no字段不合适使用该组件",
            value: d.id,
          };
        })
      );
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

      <TagInput
        className={className}
        // showClear
        placeholder={placeholder}
        value={tagData?.map((m) => m.name || m.no)}
        defaultValue={tagData?.map((m) => m?.id)}
        onFocus={() => setModalState(true)}
        onRemove={(v, i) => {
          const obj = [
            ...tagData.filter((d, index) => {
              return i !== index;
            }),
          ];
          setTagData([...obj]);
        }}
      />
    </>
  );
};
export default RelationTagInput;
