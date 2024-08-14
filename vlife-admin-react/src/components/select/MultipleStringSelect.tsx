import React from "react";
import { Select } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/component";

/**
 * string类型字段的多选
 * 逗号分隔
 */
export interface MultipleTreeSelectProps extends VfBaseProps<string> {
  optionList: any[];
}

export default (props: MultipleTreeSelectProps) => {
  return (
    <Select
      showClear={true}
      filter={true}
      onClear={() => {
        props.onDataChange("");
      }}
      value={
        props.value && props.value?.length > 0
          ? props.value?.split(",")
          : undefined
      }
      multiple
      emptyContent={"请选择"}
      zIndex={1000}
      optionList={props.optionList}
      onChange={(value) => {
        if (typeof value === "string") {
          props.onDataChange(value);
        } else if (typeof value === "object") {
          value = (value as Array<string>)?.join(",");
          props.onDataChange(value);
        }
      }}
    />
  );
};
