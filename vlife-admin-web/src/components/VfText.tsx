import { FormFieldVo } from "@src/api/FormField";
import { formatDate } from "@src/util/func";
import React from "react";

const findOptionLabel = (
  optionList: { label: string; value: any }[],
  value: any
): string | undefined => {
  const selected = optionList.filter((o) => o.value === value);
  if (selected.length > 0) {
    return selected[0].label;
  }
  return undefined;
};
export const VfText = ({
  value,
  fieldInfo,
  optionList,
}: {
  value: string | number | boolean | any[];
  fieldInfo: FormFieldVo;
  optionList: { value: any; label: string }[];
}) => {
  return fieldInfo?.x_component === "DatePicker" ? (
    <div className="formily-semi-text">{formatDate(value, "yyyy-MM-dd")}</div>
  ) : fieldInfo?.x_component.startsWith("VfSelect") && optionList && value ? (
    <div className="formily-semi-text">
      {typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
        ? value.map((v) => findOptionLabel(optionList, v))
        : findOptionLabel(optionList, value)}
    </div>
  ) : (
    <>{value}</>
  );
};
