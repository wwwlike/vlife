import React, { useEffect, useState } from "react";
import { Modal, TagInput } from "@douyinfe/semi-ui";
import { IFkItem } from "@src/api/base";
import { find } from "@src/api/base/baseService";
import { VfBaseProps } from "@src/dsl/schema/component";
import Content from "@src/pages/template/content";
interface FilterTableInputProps extends Partial<VfBaseProps<string, IFkItem>> {
  entityType: string;
  filterType: string;
  column?: string[];
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
 * 左测查询条件，右侧搜索结果列表的数据选择组件
 * 需完善
 */
export default ({
  datas, //: IFkItem选中的数据，已经将value里封装在里面了
  read,
  value,
  fieldInfo,
  filterType,
  entityType,
  column = ["name"],
  onDataChange,
}: FilterTableInputProps) => {
  // 当前选中数据
  const [tagData, setTagData] = useState<IFkItem | undefined>(datas);

  useEffect(() => {
    if (value && tagData === undefined) {
      queryData(
        typeof value === "string" ? [value] : value,
        fieldInfo?.entityType || ""
      ).then((d) => {
        if (d) setTagData(d[0]);
      });
    }
  }, []);
  const [modalState, setModalState] = useState(false);
  return read ? (
    <div className="formily-semi-text">{tagData?.name}</div>
  ) : (
    <>
      <Modal
        footer={false}
        visible={modalState}
        centered
        onCancel={() => {
          setModalState(false);
        }}
        width={700}
        height={600}
      >
        {fieldInfo && fieldInfo.entityType && (
          <Content
            className={" w-32"}
            read={true}
            filterType={filterType}
            listType={fieldInfo.entityType}
            column={["name"]}
            mode={"view"}
            onLineClick={(t: IFkItem) => {
              setTagData(t);
              setModalState(false);
              onDataChange && onDataChange(t.id);
            }}
          ></Content>
        )}
      </Modal>
      <TagInput
        placeholder={fieldInfo && fieldInfo.title}
        value={tagData?.name ? [tagData?.name] : []}
        defaultValue={tagData ? [tagData.id] : []}
        onFocus={() => setModalState(true)}
        onRemove={(v, i) => {
          setTagData(undefined);
          if (onDataChange) onDataChange(undefined);
        }}
      />
    </>
  );
};
