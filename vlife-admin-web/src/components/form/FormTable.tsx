import { Button, Modal } from "@douyinfe/semi-ui";

import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
import { useState } from "react";
import { IconTextStroked, IconPlusStroked } from "@douyinfe/semi-icons";
import { FormVo } from "@src/api/Form";
import { VfBaseProps } from "@src/dsl/schema/component";
import { VfButton } from "@src/dsl/schema/button";

/**
 * 1对多，子表数据列表展示
 */
interface FormTableProps extends VfBaseProps<any[], FormVo> {
  type: string; //字段类型
  ignores?: string[]; //忽略不展示的字段
}

export default ({
  type,
  value,
  onDataChange,
  read,
  ignores,
  entityType,
  ...props
}: FormTableProps) => {
  //当前编辑行号，有值则弹出框弹出
  const [index, setIndex] = useState<number>();
  //表单数据
  const [formData, setFormData] = useState<any>();
  //列表数据
  const [tableData, setTableData] = useState<any[]>(value ? value : []);

  const lineButton: VfButton<any>[] = [
    {
      title: "修改",
      key: "sava",
      click: (btn: VfButton<any>, number, data) => {
        setFormData(data);
        setIndex(number);
      },
    },
    {
      title: "删除",
      key: "remove",
      icon: <IconTextStroked></IconTextStroked>,
      click: (btn, number, data) => {
        setTableData(tableData.filter((f, index) => index !== number));
      },
    },
  ];

  useUpdateEffect(() => {
    onDataChange(tableData);
  }, [tableData]);
  return (
    <div>
      {!read ? (
        <Button
          icon={<IconPlusStroked />}
          onClick={() => {
            setIndex(-1);
          }}
        >
          添加新行
        </Button>
      ) : (
        ""
      )}
      <Modal
        title="关联选择"
        visible={index !== undefined ? true : false}
        onOk={() => {
          if (formData && index === -1) {
            const newData = [...tableData, formData];
            //新增
            setTableData(newData);
          } else if (formData && index !== -1) {
            //修改替换
            setTableData(
              tableData.map((f, num) => (num === index ? formData : f))
            );
          }
          setFormData(undefined);
          setIndex(undefined);
        }}
        centered
        onCancel={() => {
          setIndex(undefined);
        }}
        width={900}
        // bodyStyle={{ overflow: "auto" }}
      >
        <FormPage
          key={"formPage_" + index}
          formData={formData}
          ignoredFields={ignores}
          onDataChange={setFormData}
          type={type}
        />
      </Modal>
      <>
        <TablePage<any>
          btnHide={true}
          key={"table_sub" + props.fieldName + tableData.length}
          dataSource={tableData}
          entityType={type}
          // read={true}
          lineBtn={!read ? lineButton : undefined}
          ignores={ignores}
        ></TablePage>
      </>
    </div>
  );
};
