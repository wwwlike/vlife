import React, { useState } from "react";
import { IconSort, IconTriangleDown } from "@douyinfe/semi-icons";
import { Popover } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/api/FormField";
import SelectIcon from "@src/components/SelectIcon";
import { orderObj } from "@src/pages/common/orderPage";
import { FormComponents } from "@src/resources/CompDatas";
import ColumnFilter from "./ColumnFilter";
import { ISelect } from "@src/dsl/component";
import { where } from "@src/dsl/base";

interface ColumnTagProps {
  field: FormFieldVo;
  entityName: string;
  opt?: "search" | "sort" | true; //支持的操作，true都支持
  option?: ISelect[];
  where: Partial<where>[] | undefined;
  onFilter?: (where: Partial<where>[] | void) => void;
  onSort?: (order: orderObj) => void; //排序
  onFixed?: (fixed: boolean) => void; //固定操此
  onHide?: (fixed: boolean) => void; //隐藏
}

//列表上字段标题的展示
const ColumnTitle = ({
  field,
  onSort,
  where,
  onFixed,
  opt = true,
  onFilter,
  option,
  entityName,
  onHide,
}: ColumnTagProps) => {
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  return (
    <div className="flex w-full  items-center  ">
      <div
        onMouseOver={() => {
          setMouseOver(true);
        }}
        onMouseOut={() => {
          setMouseOver(false);
        }}
        onClick={() => {
          if (onSort) {
            onSort({ fieldName: field.fieldName, sort: sort });
            setSort(sort === "desc" ? "asc" : "desc");
          }
        }}
        className="flex justify-center items-center w-full hover:bg-gray-200 hover:cursor-pointer p-1  rounded-sm "
      >
        {mouseOver === false && FormComponents[field.x_component]?.icon && (
          <SelectIcon
            size="small"
            read
            value={FormComponents[field.x_component]?.icon as string}
          />
        )}
        {mouseOver === true && FormComponents[field.x_component]?.icon && (
          <IconSort />
        )}
        <div className=" pl-1 text-black font-bold rounded">{field.title}</div>
      </div>
      {(opt === true || opt === "search") && (
        <div className="w-4">
          <Popover
            position="bottom"
            spacing={20}
            trigger="click"
            content={
              <ColumnFilter
                //  style={{ width: "300px" }}
                entityName={entityName}
                option={option}
                className=" p-2 w-72 rounded-md shadow-md bg-white"
                field={field}
                where={where}
                onChange={(where: Partial<where>[] | undefined) => {
                  if (onFilter) onFilter(where);
                }}
              />
            }
          >
            <IconTriangleDown className="hover:cursor-pointer" size="small" />
          </Popover>
        </div>
      )}
    </div>
  );
};
export default ColumnTitle;
