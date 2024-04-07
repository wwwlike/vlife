import { ITreeData, VfBaseProps } from "@src/dsl/component";
import { useState } from "react";

/**
 * 级联多选组件
 */
export interface MultipleTreeSelectProps extends VfBaseProps<string[]> {
  label: string;
  selectData: ITreeData[];
}

export default (props: MultipleTreeSelectProps) => {
  return <div className=" w-1/2"></div>;
};
