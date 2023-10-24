/**
 * 树型数据选择组件
 */
import React, { useCallback, useMemo, useState } from "react";
import { Input, TreeSelect } from "@douyinfe/semi-ui";
import { ITree } from "@src/api/base";
import { VfBaseProps } from "@src/dsl/component";
import { checkSubData } from "@src/util/func";
import { useUpdateEffect } from "ahooks";
import { TreeSelectProps } from "@douyinfe/semi-ui/lib/es/treeSelect";
import { TreeNodeData } from "@douyinfe/semi-ui/lib/es/tree";

interface VfTreeInputProps extends TreeSelectProps {
  read: boolean;
  onDataChange: (data: string | undefined) => void;
}

/**
 * 树型选择input组件(支持有VfTree=>code,pcode,name,id的组件)
 * 待：机构/地区/部门联合树如何实现？
 */
const VfTreeInput = ({
  read,
  value,
  treeData,
  onDataChange,
  className,
  ...props
}: VfTreeInputProps) => {
  const findNode = (
    datas: TreeNodeData[],
    val: any
  ): TreeNodeData | undefined => {
    for (const node of datas) {
      if (node.value === val + "") {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const childResult = findNode(node.children, value);
        if (childResult) {
          return childResult;
        }
      }
    }
    return undefined;
  };
  const treeName = useMemo((): string | undefined => {
    return value && treeData && findNode(treeData, value.toString())
      ? findNode(treeData, value.toString())?.label + ""
      : undefined;
  }, [value, treeData]);
  return read ? (
    <div className="formily-semi-text font-semibold">{treeName}</div>
  ) : (
    <>
      <TreeSelect
        value={value}
        className={className}
        showClear
        onChange={(v) => {
          onDataChange(v + "");
        }}
        treeData={treeData}
        {...props}
      />
    </>
  );
};
export default VfTreeInput;
