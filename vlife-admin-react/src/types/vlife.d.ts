/**
 *实体模型
 */
export interface IdBean {
  id: string;
}
/**
 * 数据库实体模型
 */
export interface DbEntity extends IdBean {
  createDate: Date;
  modifyDate: Date;
  status: string;
}

/**
 * 查询条件基类
 * 所有field的input查询方式的均可以用search进行联合模糊搜索
 */
export interface BaseRequest {
  search: string; //
}

/**
 * 分页入参模型 (待删除)
 */
export interface Pager extends BaseRequest {
  "pager.page": number;
  "pager.size": number;
}

export interface PageReq {
  pager: { page: number; size: number };
  //   "pager.page": string;
  //   "pager.size": string;
  // }
}

/**
 *查询分页结果
 */
export interface PageVo<T extends IdBean> {
  page: number;
  size: number;
  total: number;
  totalPage: number;
  first: boolean;
  lasts: boolean;
  result: T[];
}

/**
 * 分页结果
 */
export interface Result<D> {
  data: D | undefined;
  msg: string;
  code: string;
}

// /**
//  * 字段信息
//  */
// export interface FieldInfo {
//   type?: string;
//   fieldType: string;
//   fieldName: string;
// }

export interface TranDict {
  column: string;
  dict: { val?: string | undefined; title: string }[];
}

/**
 * 模型信息
 */
export interface ModelInfo {
  title: string;
  type: string;
  itemType: string;
  entityType: string;
  fields: fieldInfo[];
}
//字段信息
export interface fieldInfo {
  dataIndex: string; // 字段名
  type: "string" | "number" | "boolean" | "date"; //字段类型 string
  fieldType: "basic" | "list";
  title: string; //中文名
  dictCode?: string; //字典
  pathName: string; // 全量路径字段
  entityFieldName: string; //数据库模型字段
  entityType: string;
}

//表信息
export interface formInfo {
  initData?: any; //传进来的初始化数据
  setFormValues?: (t: any) => void; // 数据传出去
  setError?: () => void; //错误信息传输出去
  hideColumns?: string[]; //需要隐藏的不显示的列
  read?: boolean; //只读模式
  dicts?: TranDict[]; //字典信息
  fkIds?: { fk: string; vals: { id: string; name: string }[] }; // 外键信息
  fields: fieldInfo[]; //表单字段信息
  maxColumns?: number[];
}
