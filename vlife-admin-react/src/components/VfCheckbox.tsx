import React from "react";
import { Checkbox } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/dsl/component";
interface VfCheckboxProps extends VfBaseProps<boolean> {}
const VfCheckbox = ({
  value,
  read,
  disabled,
  onDataChange,
}: VfCheckboxProps) => {
  return read || disabled ? (
    <div className="formily-semi-text">
      {value && value === true ? "是" : "否"}
    </div>
  ) : (
    <Checkbox
      defaultChecked={value}
      onChange={(e) => {
        onDataChange(e.target.checked ? true : false);
      }}
    />
  );
};

export default VfCheckbox;
