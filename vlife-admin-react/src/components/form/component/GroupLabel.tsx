/**
 * 分组标签组件
 * title标题分组栏
 */
import React, { ReactNode } from "react";
interface GroupLabelProps {
  text: string;
  icon?: ReactNode;
  className?: string;
}
export default ({ text, className, icon }: GroupLabelProps) => {
  return (
    <div className={`${className} flex h-7 m-0`}>
      <div className=" border-2 border-blue-400 mr-2 rounded-md" />
      <div className=" font-bold font-sans text-base">
        {icon} {text}
      </div>
    </div>
  );
};
