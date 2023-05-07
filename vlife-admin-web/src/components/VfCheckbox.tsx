import { Checkbox } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/schema/component";
import React, { useState } from "react";

interface VfCheckboxProps extends VfBaseProps<boolean, null> {}

const VfCheckbox = ({
  fieldInfo,
  value,
  read,
  onDataChange,
  ...props
}: VfCheckboxProps) => {
  return read ? (
    <div className="formily-semi-text">
      {value && value === true ? "是" : "否"}
    </div>
  ) : (
    <Checkbox
      defaultChecked={value}
      onChange={(e) => {
        onDataChange(e.target.checked);
      }}
    />
  );
};

export default VfCheckbox;
