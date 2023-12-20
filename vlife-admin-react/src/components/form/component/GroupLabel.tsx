/**
 * 分组标签组件
 * title标题分组栏
 */
import React, { ReactNode } from "react";
interface GroupLabelProps {
  text: string;
  desc?: string; //描述性介绍
  icon?: ReactNode;
  className?: string;
}
export default ({ text, className, icon, desc }: GroupLabelProps) => {
  return (
    <div className={` relative  p  ${className} flex h-7 m-0 items-end  `}>
      <div className=" border-2 h-full border-blue-400 mr-2 rounded-md" />
      <div className=" font-bold font-sans text-base">
        {icon} {text}
      </div>
      <div className=" absolute right-1 text-sm text-gray-400">{desc}</div>
    </div>
  );
};
