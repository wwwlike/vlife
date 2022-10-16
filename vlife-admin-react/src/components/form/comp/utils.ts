type itree = {
  id: string;
  pcode: string;
  code: string;
  name: string;
};

type treeData = {
  label: string;
  value: string;
  key: string;
  children: treeData[] | undefined;
};

/**
 * 找pcode的子节点，如果传空则说明找pcode为空的，空的找不到则找code最短的
 * @param datas 将后端框架数据格式转换成semi需要的属性格式
 * @returns
 */
export const getTreeData = (
  datas: itree[],
  pcode: string | null,
  valField: "id" | "code"
): treeData[] | undefined => {
  //找到根节点
  let filter = datas.filter((d) => d.pcode === pcode);
  let length = 3;
  while (filter.length === 0 && pcode === null) {
    filter = datas.filter((d) => d.pcode.length === length);
    length = length + 4;
  }
  if (filter.length === 0) {
    return undefined;
  }
  return filter.map((dd) => {
    return {
      label: dd.name,
      value: dd[valField],
      key: dd.id,
      children: getTreeData(datas, dd.code, valField),
    };
  });
};
