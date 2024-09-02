import React from "react";
import { ConditionGroup } from "@src/dsl/base";

export interface ConditionViewProps {
  className?: string;
  layout?: "inline" | "block";
  condition: ConditionGroup[];
}

/**
 * 查询条件内容展示预览
 */
export default (props: ConditionViewProps) => {
  const { condition, layout = "block" } = props;
  return (
    <div className="flex ">
      {condition.length > 1 && (
        <div className="text-gray-400 font-bold p-1 flex items-center">或</div>
      )}
      <div className={`${props.className} flex-1`}>
        {condition.map((item, index) => {
          return (
            <div
              key={index}
              className={layout === "inline" ? "flex space-x-2 mb-2" : "mb-1"}
            >
              <div
                className={`bg-slate-100 p-1 items-center rounded text-xs ${
                  layout === "inline" ? "flex" : "block"
                } space-y-1`}
              >
                {item.where.map((d, index2) => {
                  return (
                    <div
                      key={index + index2}
                      className={"space-x-2 flex items-center    px-4"}
                    >
                      <span className="font-bold">{d.desc?.fieldName}</span>
                      <span className="font-bold text-gray-400">
                        {d.desc?.opt}
                      </span>
                      <span className="font-bold">
                        {d.desc?.value || d.value?.join(",")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
