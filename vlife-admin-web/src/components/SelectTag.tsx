import { Space, Tag } from "@douyinfe/semi-ui";
import { DataType } from "@src/dsl/schema/base";
import { VfBaseProps } from "@src/dsl/schema/component";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useState } from "react";

interface DictSelectTagProps
  extends VfBaseProps<any, { label: string; value: string }[]> {
  selectMore?: boolean;
}
/**
 * 字典tag选择器(多用于查询模型)
 */
const SelectTag = ({
  //选择的数据
  datas,
  //选中的值
  value,
  read,
  //选中的回调事件
  onDataChange,
  //组件信息
  fieldInfo,
}: //能否多选
DictSelectTagProps) => {
  /**
   * 选中的项val,并数据初始化
   */
  const [selects, setSelects] = useState<string[]>(value ? value : []);
  /**
   * 能否多选根据入参判断，无入参无，根据字段的属性判断
   */
  const [more, setMore] = useState<boolean>(
    fieldInfo?.dataType === DataType.array ? true : false
  );
  /**
   * 点击事件
   */
  const onSelect = useCallback(
    (data: string) => {
      const index = selects.indexOf(data);
      if (index > -1) {
        //包含就删除
        selects.splice(index, 1);
        setSelects([...selects]);
      } else if (selects.length === 0 || more === true) {
        setSelects([...selects, data]);
      } else {
        setSelects([data]);
      }
    },
    [selects]
  );

  useUpdateEffect(() => {
    if (
      fieldInfo &&
      fieldInfo.fieldType === "basic" &&
      selects &&
      selects.length > 0
    ) {
      onDataChange(selects[0]);
    } else {
      onDataChange(selects);
    }
  }, [selects]);

  return read ? (
    <>
      {datas &&
        datas
          .filter((d) => selects.includes(d.value))
          .map((d: { label: string; value: string }) => {
            return (
              <Tag
                onClick={() => {
                  onSelect(d.value);
                }}
                size="large"
                key={"dict_select_tag" + d.value}
                // color="blue"
                type={selects.includes(d.value) ? "solid" : "ghost"}
              >
                {d.label}
              </Tag>
            );
          })}
    </>
  ) : (
    <Space wrap={true}>
      {datas &&
        datas.map((d: { label: string; value: string }) => {
          return (
            <Tag
              onClick={() => {
                onSelect(d.value);
              }}
              size="large"
              key={"dict_select_tag" + d.value}
              // color="blue"
              type={selects.includes(d.value) ? "solid" : "ghost"}
            >
              {d.label}
            </Tag>
          );
        })}
    </Space>
  );
};
export default SelectTag;
