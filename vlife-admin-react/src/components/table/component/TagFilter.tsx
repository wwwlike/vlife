import React, { useCallback } from "react";
import { IconClose } from "@douyinfe/semi-icons";
import { Space, Tag } from "@douyinfe/semi-ui";
import { FormVo } from "@src/api/Form";
import { orderObj } from "@src/pages/common/orderPage";
import { FormFieldVo } from "@src/api/FormField";
import { useAuth } from "@src/context/auth-context";
import { where } from "@src/dsl/base";
export interface TagFilterProps {
  where: Partial<where>[]; //查询条件
  order: orderObj[]; //排序信息
  formVo: FormVo;
  className?: string;
  style?: any;
  onOrderRemove: (order: orderObj[]) => void; //排序删除
  onConditionRemove: (fieldId: string) => void; //条件删除
}
//过滤排序已经选择的项目的tag展示栏目
const TagFilter = ({
  where,
  order,
  formVo,
  onOrderRemove,
  onConditionRemove,
  ...props
}: TagFilterProps) => {
  const { dicts } = useAuth();
  //排序div
  const orderMsg = useCallback(
    (order: orderObj): string => {
      return (
        formVo.fields.filter((f) => f.fieldName === order.fieldName)[0].title +
        "：" +
        (order.sort === "asc" ? "升序" : "降序")
      );
    },
    [formVo]
  );
  //条件div
  const conditionMsg = useCallback(
    (field: FormFieldVo): string => {
      return (
        field.title +
        "：" +
        where
          .filter((w) => w.fieldId === field.id)
          .map((w) =>
            w.opt === "isNull"
              ? "未填写"
              : w.opt === "isNotNull"
              ? "已填写"
              : field.dictCode
              ? dicts[field.dictCode].data
                  .filter(
                    (d) => w.value === d.value || w.value.includes(d.value)
                  )
                  .map((d) => d.label)
                  .toString()
              : (w.opt === "loe" && where.map((w) => w.opt).includes("goe")) ||
                (w.opt === "goe" && where.map((w) => w.opt).includes("loe"))
              ? w.opt === "loe"
                ? undefined
                : `${where.filter((w) => w.opt === "goe")[0].value}~${
                    where.filter((w) => w.opt === "loe")[0].value
                  }`
              : w.value[0]
          )
          .filter((s) => s !== undefined)
          .join(",")
      );
    },
    [formVo, where]
  );
  // .map(obj => obj.val + (obj.opt===("goe") ? "~" : ",")).join("");
  return (
    <Space className={`${props.className} `} style={props.style}>
      {order?.map((w, index) => {
        return (
          <div
            key={`order${w.fieldName}`}
            className=" bg-gray-100 hover:bg-gray-200 p-1 rounded h-full items-center flex text-xs  text-gray-500
            hover:text-gray-600
            "
          >
            <div>{`${orderMsg(w)}`}</div>
            <IconClose
              size="small"
              className="ml-2 cursor-pointer"
              onClick={() => {
                onOrderRemove(order.filter((o, reIndex) => reIndex !== index));
              }}
            />
          </div>
        );
      })}
      {formVo.fields
        .filter((f) => where.map((w) => w.fieldId).includes(f.id))
        .map((field, index) => {
          return (
            <div
              key={`condition${field.id}`}
              className=" bg-gray-100 hover:bg-gray-200 p-1 rounded h-full items-center flex text-xs  text-gray-500
            hover:text-gray-600
            "
            >
              <div>{`${conditionMsg(field)}`}</div>
              <IconClose
                size="small"
                className="ml-2 hover:cursor-pointer"
                onClick={() => {
                  onConditionRemove(field.id);
                }}
              />
            </div>
          );
        })}
    </Space>
  );
};
export default TagFilter;
