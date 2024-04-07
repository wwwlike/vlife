/**
 * 视图查询条件设计器
 */
import React from "react";
import { FormVo } from "@src/api/Form";
import { useMemo } from "react";
import Condition from "./component/Condition";
import { ConditionGroup, where } from "./types";

interface QueryBuilderProps {
  entityModel: FormVo; //当前实体模型
  subForms?: FormVo[]; //1对多数据集信息
  value: string;
  className?: string;
  style?: any;
  mode?: "build" | "list"; //使用场景 视图|列表
  onDataChange: (conditionJson: string) => void;
}

/**
 * 简易模式的数据筛选设计器
 * 1. 支持多个分组，单个分组内是且运算关系
 * 2. 组内不支持递归组嵌套,组和组之间只能是或运算 支持=> (a and b and c) or ( d and e) 不支持=>(a and b and (a or c or (e and f)))
 */
const QueryBuilder = ({
  onDataChange,
  entityModel,
  className,
  subForms,
  style,
  mode,
  value,
}: QueryBuilderProps) => {
  const groups = useMemo((): Partial<ConditionGroup>[] => {
    return value ? JSON.parse(value) : [{ where: [{}] }];
  }, [value]);
  return entityModel ? (
    <div style={style} className={`${className} space-y-2`}>
      {groups.map((group, groupIndex) => (
        <div
          key={`and${groupIndex}`}
          className=" space-y-1 rounded bg-gray-50 p-2"
        >
          {group?.where?.map((where, whereIndex) => (
            <div
              key={`where${whereIndex}`}
              className=" space-x-2 flex relative justify-between   items-center"
            >
              <Condition
                key={`conditionWhere${whereIndex}`}
                className="w-full"
                mode={mode}
                subForms={subForms}
                where={where}
                formVo={entityModel}
                onDataChange={(where: Partial<where>) => {
                  const removeGroups = groups.map((g, group2Index) => {
                    if (group2Index === groupIndex) {
                      return {
                        ...g,
                        where: g.where?.map((ww, where2Index) => {
                          if (where2Index !== whereIndex) return ww;
                          return where;
                        }),
                      };
                    }
                    return g;
                  });
                  //防抖延时(待)
                  onDataChange(JSON.stringify(removeGroups));
                }}
              />
              <div
                onClick={() => {
                  const removeGroups = groups
                    .map((g, group3Index) => {
                      if (group3Index === groupIndex) {
                        return {
                          ...g,
                          where: g.where?.filter(
                            (ww, where3Index) => where3Index !== whereIndex
                          ),
                        };
                      }
                      return g;
                    })
                    .filter((g) => g.where !== undefined && g.where.length > 0);
                  onDataChange(JSON.stringify(removeGroups));
                }}
                className=" justify-end  text-right"
              >
                <i
                  style={{ fontSize: "18px" }}
                  className={`icon-recycle   text-gray-400 hover:text-gray-600  cursor-pointer `}
                />
              </div>
            </div>
          ))}
          <div
            onClick={() => {
              onDataChange(
                JSON.stringify(
                  groups.map((g, group4Index) => {
                    if (group4Index === groupIndex) {
                      return {
                        ...g,
                        where: g.where ? [...g.where, {}] : [{}],
                      };
                    }
                    return g;
                  })
                )
              );
            }}
            className="group relative inline-flex border-dashed items-center py-2 px-4 text-gray-600 hover:text-gray-700 border border-gray-300 rounded transition duration-300 hover:bg-gray-100 hover:border-gray-400  cursor-pointer"
          >
            <i
              style={{ fontSize: "18px" }}
              className={`icon-add_circle mr-2   text-gray-400 group-hover:text-gray-600`}
            />
            <span>且条件</span>
          </div>
        </div>
      ))}
      <div
        onClick={() => {
          onDataChange(JSON.stringify([...groups, { where: [{}] }]));
        }}
        className=" group ml-2 relative inline-flex border-dashed items-center py-2 px-4 text-gray-600 hover:text-gray-700 border border-gray-300 rounded transition duration-300 hover:bg-gray-100 hover:border-gray-400  cursor-pointer"
      >
        <i
          style={{ fontSize: "18px" }}
          className={`icon-add_circle mr-2   text-gray-400 group-hover:text-gray-600`}
        />
        <span>或条件</span>
      </div>
    </div>
  ) : (
    <div>请先确定数据集</div>
  );
};
export default QueryBuilder;
