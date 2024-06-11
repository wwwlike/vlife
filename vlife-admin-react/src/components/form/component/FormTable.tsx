import { Button, Modal } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useSize, useUpdateEffect } from "ahooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconPlusStroked } from "@douyinfe/semi-icons";
import { VfBaseProps } from "@src/dsl/component";
import { useNavigate } from "react-router-dom";
import { IFkItem } from "@src/api/base";
import { VFBtn } from "@src/components/button/types";

/**
 * 1对多，子表数据列表展示
 */
interface FormTableProps extends VfBaseProps<IFkItem[]> {
  type: string; //字段类型
  ignores?: string[]; //忽略不展示的字段
  mainForm?: any; //主表数据
  unCreate?: boolean; //禁止新增
  unRemove?: boolean; //禁止删除
  unModify?: boolean; //禁止修改
}
export default ({
  type,
  value,
  formData,
  fieldInfo,
  read,
  ignores,
  vf,
  unCreate = false,
  unRemove = false,
  unModify = false,
  onDataChange,
}: FormTableProps) => {
  //列表数据
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    setTableData(value || []);
  }, [JSON.stringify(value)]);

  //表单数据
  const [formObj, setFormObj] = useState<any>();
  //当前编辑行号，有值则弹出框弹出
  const [index, setIndex] = useState<number>();
  const btns = useMemo((): VFBtn[] => {
    const btns: VFBtn[] = [
      // {
      //   title: "添加新11行",
      //   allowEmpty: true,
      //   actionType: "create",
      //   model: "sysUser",
      //   saveApi: (d) => {},
      //   // onClick: () => {
      //   //   setIndex(-1);
      //   // },
      // },
    ];

    if (!read && unCreate === false) {
      btns.push({
        title: "添加新行",
        allowEmpty: true,
        multiple: true,
        actionType: "click",
        onClick: (datas: any) => {
          setIndex(-1);
        },
      });
    }

    if (unModify === false) {
      btns.push({
        title: "修改",
        multiple: false,
        actionType: "click",
        submitConfirm: false,
        onClick: (datas: any) => {
          setIndex(datas.tableSort);
        },
      });
    }
    if (unRemove === false) {
      btns.push({
        title: "删除",
        multiple: false,
        actionType: "click",
        submitConfirm: false,
        onClick: (datas: any) => {
          setTableData((data) => {
            return data?.filter((d, i) => i !== datas.tableSort);
          });
        },
      });
    }

    return btns;
  }, [unModify, unRemove]);

  const ref = useRef(null);
  const size = useSize(ref);
  const [width, setWidth] = useState(size?.width);
  useUpdateEffect(() => {
    onDataChange?.([...tableData]);
  }, [tableData]);
  return (
    <div ref={ref}>
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
              tableData?.map((f, num) => (num === index ? formObj : f))
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
            index !== undefined && index >= 0 ? tableData?.[index] : undefined
          }
          parentFormData={formData}
          ignoredFields={ignores}
          onDataChange={setFormObj}
          type={type || fieldInfo?.entityType + ""}
          vf={vf}
        />
      </Modal>
      <TablePage<any>
        tab={false}
        columnTitle={false}
        // hideToolbar={true}
        className="mt-1"
        key={"table_sub" + fieldInfo?.fieldName}
        mode="hand"
        dataSource={tableData}
        listType={type || fieldInfo?.fieldType + ""}
        width={width}
        btns={btns}
        ignores={ignores}
        select_more={undefined}
        read={read}
      />
    </div>
  );
};
