import React, { useCallback, useState } from "react";
import {
  CheckboxGroup,
  DatePicker,
  Radio,
  RadioGroup,
} from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/api/FormField";
import VfSearch from "@src/components/VfSearch";
import { ISelect } from "@src/dsl/schema/component";
import { where } from "@src/dsl/schema/base";

interface ColumnFilterProps {
  entityName: string; //查询模型标识
  field: FormFieldVo;
  where?: Partial<where>[];
  className?: string;
  option?: ISelect[];
  onChange: (where?: Partial<where>[]) => void;
}
/**
 * 单个字段查询界面(弹出层展示)
 */
export default ({
  field,
  where = [],
  className,
  entityName,
  onChange,
  option,
}: ColumnFilterProps) => {
  const [goeVal, setGoeVal] = useState<any>();
  const [loeVal, setLoeVal] = useState<any>();

  const allWhere = (
    val: any,
    opt: string,
    where: Partial<where>[]
  ): Partial<where>[] => {
    return [
      ...(where?.filter((w) => w.opt !== opt) || []),
      {
        fieldId: field.id,
        fieldName: field.entityType !== entityName ? "name" : field.fieldName,
        entityName:
          field.entityType !== entityName ? field.entityType : undefined,
        opt: opt,
        fieldType: field.fieldType,
        value: val instanceof Array ? val : [val],
      },
    ];
  };

  const change = useCallback(
    (val: any, opt: string) => {
      if (val) {
        let wheres = allWhere(val, opt, where);
        if (opt === "goe" && loeVal) {
          wheres = allWhere(loeVal, "loe", wheres);
        }
        if (opt === "loe" && goeVal) {
          wheres = allWhere(goeVal, "goe", wheres);
        }
        onChange(wheres);
      } else {
        onChange([...(where?.filter((w) => w.opt !== opt) || [])]);
      }
    },
    [field, where, entityName, loeVal, goeVal]
  );

  return (
    <div className={`${className} flex-grow px-4 pt-6`}>
      {field.fieldType === "string" &&
        field.dictCode === null &&
        field.x_component !== "VfImage" && (
          <VfSearch
            className="border-b pb-2 border-dashed border-gray-300 mb-2"
            hideBtn={true}
            value={where?.filter((w) => w.opt === "like")?.[0]?.value}
            onDataChange={(v) => {
              change(v, "like");
            }}
          />
        )}
      {field.fieldType === "number" && (
        <div className="flex items-center space-x-1 justify-center border-b pb-2 border-dashed border-gray-300 mb-2">
          <VfSearch
            fieldType={field.fieldType}
            placeholder="最小值"
            value={where?.filter((w) => w.opt === "goe")?.[0]?.value}
            hideBtn={true}
            onChange={setGoeVal}
            onDataChange={(v) => {
              change(v, "goe");
            }}
          />
          <span>~</span>
          <VfSearch
            fieldType={field.fieldType}
            placeholder="最大值"
            onChange={setLoeVal}
            value={where?.filter((w) => w.opt === "loe")?.[1]?.value}
            hideBtn={true}
            onDataChange={(v) => {
              change(v, "loe");
            }}
          />
        </div>
      )}
      {field.fieldType === "date" && (
        <div className="flex items-center space-x-1 justify-center border-b pb-2 border-dashed border-gray-300 mb-2">
          <DatePicker
            format="yyyy/MM/dd"
            placeholder="最小日期"
            value={where?.filter((w) => w.opt === "goe")?.[0]?.value}
            onChange={(e, v) => {
              change(v, "goe");
            }}
          />
          <span>~</span>
          <DatePicker
            format="yyyy/MM/dd"
            value={where?.filter((w) => w.opt === "loe")?.[0]?.value}
            placeholder="最大日期"
            onChange={(e, v) => {
              change(v, "loe");
            }}
          />
        </div>
      )}
      <RadioGroup
        className=" border-b pb-2 border-dashed border-gray-300 mb-2"
        direction="vertical"
        value={
          where?.filter((w) => w.opt === "isNull" || w.opt === "isNotNull")?.[0]
            ?.opt
        }
        onChange={(e) => {
          if (e.target.value && e.target.value.length > 0) {
            onChange([
              ...(where?.filter(
                (w) => w.opt !== "isNull" && w.opt !== "isNotNull"
              ) || []),
              {
                fieldId: field.id,
                fieldName: field.fieldName,
                fieldType: field.fieldType,
                opt: e.target.value,
              },
            ]);
          } else {
            onChange([
              ...(where?.filter(
                (w) => w.opt !== "isNull" && w.opt !== "isNotNull"
              ) || []),
            ]);
          }
        }}
      >
        <Radio>全部</Radio>
        <Radio value={"isNotNull"}>已填写</Radio>
        <Radio value={"isNull"}>未填写</Radio>
      </RadioGroup>
      {option && (
        <CheckboxGroup
          options={option}
          value={where?.filter((w) => w.opt === "in")?.[0]?.value}
          onChange={(d: any[]) => {
            change(d, "in");
          }}
        />
      )}
    </div>
  );
};
