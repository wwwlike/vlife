import React, { useState } from "react";
import { Modal, Space, Tag, TagInput } from "@douyinfe/semi-ui";
import { IFkItem } from "@src/api/base";
import { DataType } from "@src/dsl/base";
import { VfBaseProps } from "@src/dsl/component";
import TablePage from "@src/pages/common/tablePage";
import Scrollbars from "react-custom-scrollbars";

//模态选择的tag展示的INPUT组件
interface ModalTagInputProps extends VfBaseProps<string[], IFkItem[]> {}
const ModalTagInput = ({
  value,
  datas,
  read,
  onDataChange,
  fieldInfo,
  ...props
}: ModalTagInputProps) => {
  const [modalState, setModalState] = useState(false);
  //选中的数据
  // const [tagData, setTagData] = useState<IFkItem[]>(datas ? datas : []);
  const [tableSelectData, setTableSelectData] = useState<IFkItem[]>();

  return read && datas ? (
    <Space>
      {/* 'ghost' | 'solid' | 'light'; */}
      {datas.map((d: IFkItem) => {
        return (
          <Tag size="large" type="ghost">
            {d.name}
          </Tag>
        );
      })}
    </Space>
  ) : (
    <>
      <Modal
        title="关联选择"
        height={500}
        visible={modalState}
        onOk={() => {
          setModalState(false);
          // setTagData([...(tableSelectData ? tableSelectData : [])]);
          onDataChange(tableSelectData?.map((d) => d.id) || []);
        }}
        centered
        onCancel={() => {
          setModalState(false);
        }}
        width={900}
      >
        <Scrollbars>
          <TablePage
            listType={fieldInfo.entityType || ""}
            selected={datas}
            onSelected={(data: any) => {
              setTableSelectData(data);
            }} //table的选择事件
            mode={"view"}
            select_more={fieldInfo.dataType === DataType.array ? true : false}
          ></TablePage>
        </Scrollbars>
      </Modal>
      <TagInput
        {...props}
        showClear
        value={datas?.map((m) => m.name)}
        onChange={(v) => {
          onDataChange(v);
        }}
        defaultValue={value}
        onFocus={() => setModalState(true)}
        onRemove={(v, i) => {
          onDataChange([
            ...value.filter((d, index) => {
              return i !== index;
            }),
          ]);
        }}
      />
    </>
  );
};

export default ModalTagInput;
