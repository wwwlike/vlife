/**
 * 分组标签组件
 */
import React from "react";

interface GroupLabelProps {
  text: string;
  icon: string;
  color: string;
}
export default ({ text, icon, color }: GroupLabelProps) => {
  return (
    <div className="flex h-7 m-0">
      <div className=" border-2 border-blue-400 mr-2 rounded-md"></div>
      <div className=" font-bold font-sans text-base">{text}</div>
    </div>
  );
};
