/**
 * 树型数据查询组件
 * 只在查询req模型里使用
 */
import { Button, Tag } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import Tree, { TreeNodeData, TreeProps } from "@douyinfe/semi-ui/lib/es/tree";
import { ITree } from "@src/api/base";
import { VfBaseProps } from "@src/dsl/schema/component";
import { checkSubData } from "@src/util/func";
import React, { useCallback, useMemo } from "react";

interface TreeQueryProps extends VfBaseProps<string, ITree[]> {
  /**
   *点击值字段标识
   */
  valField: "id" | "code";
  /**
   * 根节点code,
   */
  root: string; //设置了则从他开始，没有设置就是从最短的开始
}

const style = {
  width: 260,
  border: "1px solid var(--semi-color-border)",
};
//树的数据结构
interface treeElementProps {
  label: string;
  value: string;
  key: string;
  children?: treeElementProps[];
}

/**
 * 实现对任意数据结构的数据形成树型关系
 * 待：机构/地区/部门联合树如何实现？
 */
const VfTreeSelect = ({
  root, //尚未使用
  datas,
  value,
  fieldInfo,
  onDataChange,
  ...props
}: TreeQueryProps & TreeProps) => {
  /**
   * 查找根节点，有指定就用，无则找pcode最短的，code作为
   */
  const findRoot = useMemo((): string[] => {
    if (root) return [root];
    if (datas) {
      //查找pcode为空的为根节点
      const findNull: string[] = datas
        .filter(
          (d: any) => (d.pcode === undefined || d.pcode === null) && d.code
        )
        .map((d: any) => d.code);

      if (findNull && findNull.length > 0) return findNull;

      //查找pcode在datas里给定的code不存在的 ，作为根节点
      const allPcodes = datas.map((d) => d.code);
      return datas
        .filter((data) => !allPcodes.includes(data.pcode))
        .map((d) => d.code);
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
        .map((dd) => {
          return {
            value: dd[fieldInfo.fieldName.endsWith("Id") ? "id" : "code"],
            label: dd.name,
            key: dd[fieldInfo.fieldName.endsWith("Id") ? "id" : "code"],
            children: treeData(dd.code, true),
          };
        });
    },
    [datas]
  );
  return (
    <div>
      {value ? (
        <div className="flex ">
          <div>
            <Label>{datas.filter((d: any) => d.code === value)[0].name}</Label>
          </div>
          <div className=" absolute right-0 ">
            <Tag
              className=" cursor-pointer"
              onClick={() => {
                onDataChange(undefined);
              }}
              size="small"
            >
              取消
            </Tag>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <Tree
        expandAll={true}
        // className=" border-12 border-blue-600"
        treeData={treeData(root, false)}
        defaultExpandAll
        onSelect={(
          selectedKeys: string,
          selected: boolean,
          selectedNode: TreeNodeData
        ) => {
          if (selected) {
            onDataChange(selectedKeys);
          }
        }}
        style={style}
      />
    </div>
  );
};

export default VfTreeSelect;
