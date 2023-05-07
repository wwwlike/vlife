import { Modal, Space, TagInput } from "@douyinfe/semi-ui";
import { IFkItem } from "@src/api/base";
import { find } from "@src/api/base/baseService";
import { FormFieldVo } from "@src/api/FormField";
import { DataType } from "@src/dsl/schema/base";
import { VfBaseProps } from "@src/dsl/schema/component";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
import { useEffect, useState } from "react";

interface RelationInputProps
  extends VfBaseProps<string | string[], IFkItem[]> {}

function queryData(
  value: string[],
  f: FormFieldVo
): Promise<IFkItem[] | undefined> {
  return find(f.entityType, "id", value).then((data) => {
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
  onDataChange,
}: RelationInputProps) => {
  // 当前选中数据
  const [tagData, setTagData] = useState<IFkItem[]>(datas ? datas : []);

  useEffect(() => {
    // alert(tagData);
    if (value && (tagData === undefined || tagData.length === 0)) {
      queryData(typeof value === "string" ? [value] : value, fieldInfo).then(
        (d) => {
          if (d) setTagData(d);
        }
      );
    }
  }, []);

  /**
   * 列表选中的数据
   */
  const [tableSelectData, setTableSelectData] = useState<IFkItem[]>();

  useUpdateEffect(() => {
    onDataChange(tagData.map((d) => d.id));
  }, [tagData]);

  const [modalState, setModalState] = useState(false);

  return read ? (
    <Space>
      {tagData?.map((d) => {
        return <div className="formily-semi-text">{d.name}</div>;
      })}
    </Space>
  ) : (
    <>
      <Modal
        title="关联选择"
        // height={500}
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
      >
        <TablePage
          entityType={fieldInfo.entityType}
          selected={tagData}
          onSelected={(data: any) => {
            setTableSelectData(data);
          }} //table的选择事件
          btnHide={true}
          select_more={fieldInfo.dataType === DataType.array ? true : false}
          // select_show_field={"name"}
        ></TablePage>
      </Modal>
      <>
        {/* {JSON.stringify(tagData)} */}
        <TagInput
          // showClear
          placeholder={fieldInfo.title}
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
