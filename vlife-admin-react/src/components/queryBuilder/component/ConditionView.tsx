import React from "react";
import { ConditionGroup } from "../types";

export interface ConditionViewProps {
  className?: string;
  condition: ConditionGroup[];
}
/**
 * 查询条件内容展示预览
 */
export default (props: ConditionViewProps) => {
  const { condition } = props;
  return (
    <div className={`${props.className}`}>
      {condition.map((item, index) => {
        return (
          <div key={index}>
            <ul className=" bg-slate-100 p-1 rounded text-xs space-y-1 ">
              {item.where.map((d, index2) => {
                return (
                  <li key={index + index2} className={" space-x-2"}>
                    <span className=" font-bold">{d.desc?.fieldName}</span>
                    <span className=" font-bold text-gray-400">
                      {d.desc?.opt}
                    </span>
                    <span className=" font-bold">
                      {d.desc?.value || d.value?.join(",")}
                    </span>
                  </li>
                );
              })}
            </ul>
            {index !== condition.length - 1 && (
              <div className=" text-gray-400 font-bold p-1">或</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
