/**
 * 树型数据选择组件
 * 只在查询req模型里使用
 */
import { TreeSelect } from "@douyinfe/semi-ui";
import { ITree } from "@src/api/base";
import { VfBaseProps } from "@src/dsl/schema/component";
import { checkSubData } from "@src/util/func";

import { useUpdateEffect } from "ahooks";
import React, { useCallback, useMemo, useState } from "react";

interface TreeQueryProps extends VfBaseProps<string, ITree[]> {
  /**
   *点击值字段标识
   */
  valField?: string;
  parentField?: string;
  /**
   * 根节点code,
   * 设置了则从他开始，没有设置就是从最短的开始
   */
  root: string;
}

//树的数据结构
interface treeElementProps {
  label: string;
  value: string;
  key: string;
  children?: treeElementProps[];
}

/**
 * 树型选择input组件(支持有VfTree=>code,pcode,name,id的组件)
 * 待：机构/地区/部门联合树如何实现？
 */
const VfTreeInput = ({
  valField = "code",
  parentField = "pcode",
  root,
  fieldInfo,
  datas,
  value,
  read,
  onDataChange,
  ...props
}: TreeQueryProps) => {
  const [val, setVal] = useState(value);

  useUpdateEffect(() => {
    onDataChange(val);
  }, [val]);
  /**
   * 查找根节点，有指定就用，无则找pcode最短的，code作为
   */
  const findRoot = useMemo((): string[] => {
    if (root) return [root];
    if (datas) {
      const findNull: string[] = datas
        .filter(
          (d: any) =>
            (d[parentField] === undefined || d[parentField] === null) &&
            d[valField]
        )
        .map((d: any) => d[valField]);

      if (findNull && findNull.length > 0) return findNull;
      const allPcodes = datas.map((d) => d.code);
      return datas
        .filter((data) => !allPcodes.includes(data.pcode))
        .map((d) => d.code);
    } else {
    }
    return [];
  }, [datas]);

  /**
   * 使用递归调用的方式组装数据
   * @sub 是否是查children,那么就不是eq,是startWith
   * @code 查询的编码
   */
  const treeData = useCallback(
    (code: string | undefined, sub: boolean): treeElementProps[] => {
      if (datas === null || datas === undefined || datas.length === 0) {
        return [];
      }
      //遍历全部，效率值得商榷找到开发头的
      return datas
        .filter((d) => d.code)
        .filter(
          (d: ITree) =>
            sub && code
              ? checkSubData(code, d.code) //找子级
              : code
              ? d.code === code
              : findRoot.filter((dd) => dd === d.code).length > 0 //父级
        )
        .map((dd: any) => {
          return {
            value: dd[fieldInfo.fieldName.endsWith("Id") ? "id" : valField],
            label: dd.name,
            key: dd[fieldInfo.fieldName.endsWith("Id") ? "id" : valField],
            children: treeData(dd.code, true),
          };
        });
    },
    [datas]
  );
  return (
    <>
      {read ? (
        <div className="formily-semi-text">
          {/* {JSON.stringify(datas)} */}
          {datas
            ?.filter(
              (d: any) =>
                d[fieldInfo.fieldName.endsWith("Id") ? "id" : valField] === val
            )
            .map((d) => d.name)}
        </div>
      ) : (
        <>
          <TreeSelect
            showClear
            onChange={(d) => {
              setVal(d as string);
            }}
            value={val}
            // onSelect={(d) => {
            //   alert(d);
            //   setVal(d);
            // }}
            style={{ width: "100%" }}
            treeData={treeData(root, false)}
          />
        </>
      )}
    </>
  );
};

export default VfTreeInput;
