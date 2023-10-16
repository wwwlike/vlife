import { FormFieldVo } from "@src/api/FormField";
import React, { useEffect, useMemo, useState } from "react";
import { FormVo } from "@src/api/Form";
import { Tag } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
/**
 * 可排序字段列表设置组件
 * 1. 数值、日期、字典、外键类型可排序
 * 2. 排序字段提到最上面
 * 3. 支持最多
 */
export interface OrderPageProps {
  value?: orderObj[];
  formVo: FormVo; //查询的模型视图信息
  style?: any;
  className?: string;
  maxShow?: number; //最大显示数量
  onDataChange: (objects: orderObj[]) => void;
}
export type orderObj = { fieldName: string; sort: "asc" | "desc" };

const OrderPage = ({
  value,
  maxShow = 5,
  formVo,
  style,
  className,
  onDataChange,
}: OrderPageProps) => {
  const [selected, setSelected] = useState<orderObj[]>(value ? value : []);
  //可排序字段
  const orderField = useMemo((): FormFieldVo[] => {
    return (
      formVo.fields.filter(
        (f) =>
          f.fieldType === "date" ||
          f.fieldType === "number" ||
          f.dictCode ||
          (f.entityFieldName === "id" && f.pathName.endsWith("Id"))
      ) || []
    );
  }, [formVo]);

  useUpdateEffect(() => {
    onDataChange(selected);
  }, [selected]);

  return (
    <div className={`relative ${className}`} style={style}>
      {selected &&
        selected.length > 0 &&
        selected.map((f, index) => (
          <div className={"flex  "} key={`order${index}`}>
            <div>
              {/* 'ghost' | 'solid' | 'light'; */}
              <Tag type="solid" className="w-20" size="large">
                {orderField.filter((o) => o.fieldName === f.fieldName)[0].title}
              </Tag>
            </div>
            <div className="flex w-full space-x-2 justify-end mb-2">
              <Tag
                size="large"
                type={f.sort === "desc" ? "solid" : "ghost"}
                onClick={() => {
                  let d = [...selected];
                  d[index] = { ...d[index], sort: "desc" };
                  setSelected(d);
                }}
              >
                ↑
              </Tag>
              <Tag
                size="large"
                type={f.sort === "asc" ? "solid" : "ghost"}
                onClick={() => {
                  let d = [...selected];
                  d[index] = { ...d[index], sort: "asc" };
                  setSelected(d);
                }}
              >
                ↓
              </Tag>
              <Tag
                size="large"
                type={"light"}
                onClick={() => {
                  setSelected(selected.filter((d, number) => number != index));
                }}
              >
                -
              </Tag>
            </div>
          </div>
        ))}
      <div></div>
      {orderField
        .filter((f) => !selected.map((s) => s.fieldName).includes(f.fieldName))
        .map((f, index) => (
          <div className={"flex  "} key={`order${index}`}>
            <div>
              <Tag type="ghost" className="w-20" size="large">
                {f.title}
              </Tag>
            </div>
            <div className="flex w-full space-x-2 justify-end mb-2">
              <Tag
                size="large"
                type={"ghost"}
                onClick={() => {
                  setSelected([
                    ...selected,
                    { fieldName: f.fieldName, sort: "desc" },
                  ]);
                }}
              >
                ↑
              </Tag>
              <Tag
                size="large"
                type={"ghost"}
                onClick={() => {
                  setSelected([
                    ...selected,
                    { fieldName: f.fieldName, sort: "asc" },
                  ]);
                }}
              >
                ↓
              </Tag>
            </div>
          </div>
        ))}
    </div>
  );
};
export default OrderPage;
