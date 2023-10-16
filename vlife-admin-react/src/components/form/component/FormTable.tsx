import { Button, Modal } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useSize, useUpdateEffect } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { IconPlusStroked } from "@douyinfe/semi-icons";
import { FormVo } from "@src/api/Form";
import { VfBaseProps } from "@src/dsl/schema/component";
import { VFBtn } from "../../table/types";

/**
 * 1对多，子表数据列表展示
 */
interface FormTableProps extends VfBaseProps<any[], FormVo> {
  type: string; //字段类型
  ignores?: string[]; //忽略不展示的字段
  mainForm?: any; //主表数据
}
export default ({
  type,
  value,
  formData,
  fieldInfo,
  read,
  ignores,
  vf,
  fieldName,
  onDataChange,
}: FormTableProps) => {
  useEffect(() => {
    // alert(vf[0].getActions());
  }, [vf]);
  //列表数据
  const [tableData, setTableData] = useState<any[]>(value ? value : []);
  //表单数据
  const [formObj, setFormObj] = useState<any>();
  //当前编辑行号，有值则弹出框弹出
  const [index, setIndex] = useState<number>();
  const btns: VFBtn[] = [
    {
      title: "删除",
      multiple: false,
      actionType: "custom",
      submitConfirm: false,
      onClick: (datas: any) => {
        setTableData(tableData.filter((d, i) => i !== datas.tableSort));
      },
    },
    {
      title: "修改",
      multiple: false,
      actionType: "custom",
      submitConfirm: false,
      onClick: (datas: any) => {
        setIndex(datas.tableSort);
      },
    },
  ];

  const ref = useRef(null);
  const size = useSize(ref);
  const [width, setWidth] = useState(size?.width);
  useUpdateEffect(() => {
    onDataChange([...tableData]);
  }, [tableData]);
  return (
    <div ref={ref} className="">
      {!read && (
        <Button
          icon={<IconPlusStroked />}
          onClick={() => {
            setIndex(-1);
          }}
        >
          添加新行
        </Button>
      )}
      <Modal
        title={index !== -1 ? "修改" : "新增"}
        visible={index !== undefined ? true : false}
        onOk={() => {
          if (formObj && index === -1) {
            //新增
            const newData = [...tableData, formObj];
            setTableData(newData);
          } else if (formObj && index !== -1) {
            //修改替换
            setTableData(
              tableData.map((f, num) => (num === index ? formObj : f))
            );
          }
          setFormObj(undefined);
          setIndex(undefined);
        }}
        centered
        onCancel={() => {
          setIndex(undefined);
        }}
        width={900}
      >
        <FormPage
          key={"formPage_" + index}
          formData={
            index !== undefined && index >= 0 ? tableData[index] : undefined
          }
          parentFormData={formData}
          ignoredFields={ignores}
          onDataChange={setFormObj}
          type={type || fieldInfo.entityType + ""}
          vf={vf}
        />
      </Modal>
      <TablePage<any>
        className="mt-1"
        key={"table_sub" + fieldName}
        // btnHide={true}
        mode="hand"
        dataSource={tableData}
        listType={type || fieldInfo.fieldType + ""}
        width={width}
        btns={btns}
        ignores={ignores}
        select_more={undefined} //无checkbox
        read={read}
      />
    </div>
  );
};
