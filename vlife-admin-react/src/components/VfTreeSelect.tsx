/**
 * 树型选择组件
 */
import React, { useCallback, useMemo } from "react";
import { Tag } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import Tree, { TreeNodeData, TreeProps } from "@douyinfe/semi-ui/lib/es/tree";
import { ITree } from "@src/api/base";
import { VfBaseProps } from "@src/dsl/component";
import { checkSubData } from "@src/util/func";
interface TreeQueryProps extends VfBaseProps<string> {
  datas: ITree[];
  /**
   *点击值字段标识
   */
  valField: "id" | "code";
  /**
   * 根节点code,
   */
  root: string; //设置了则从他开始，没有设置就是从最短的开始
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
  expandAll,
  onDataChange,
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
    (code: string | undefined, sub: boolean): any[] => {
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
            value:
              dd[
                fieldInfo &&
                fieldInfo.fieldName &&
                fieldInfo.fieldName.endsWith("Id")
                  ? "id"
                  : "code"
              ],
            label: dd.name,
            key: dd[
              fieldInfo &&
              fieldInfo.fieldName &&
              fieldInfo.fieldName.endsWith("Id")
                ? "id"
                : "code"
            ],
            children: treeData(dd.code, true),
          };
        });
    },
    [datas]
  );

  return (
    <div className=" h-full">
      {value ? (
        <div className="flex ">
          <div>
            <Label>{datas?.filter((d: any) => d.code === value)[0].name}</Label>
          </div>
          <div className=" absolute right-0 ">
            <Tag
              className=" cursor-pointer"
              onClick={() => {
                onDataChange && onDataChange(undefined);
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
        key={JSON.stringify(findRoot)}
        //  expandAll={true}
        // className=" border-12 border-blue-600"
        defaultExpandedKeys={[findRoot[0]]}
        treeData={treeData(root, false)}
        // expandAll={expandAll}
        onSelect={(
          selectedKeys: string,
          selected: boolean,
          selectedNode: TreeNodeData
        ) => {
          if (selected) {
            onDataChange && onDataChange(selectedKeys);
          }
        }}
        // style={style}
      />
    </div>
  );
};

export default VfTreeSelect;
