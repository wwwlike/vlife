export interface where {
  fieldId:string,
  /** 搜索条件来源 */
  from: "searchInput" | "coulumnFilter" | "queryBuilder";
  /** 字段 */
  fieldName: string;
  /** 所在实体类 */
  entityName?:string;
  /** 字段类型 */
  fieldType?: "string" | "number" | "date" | "boolean";
  /** 匹配方式 */
  opt: string;
  /** 转换函数 */
  tran: string;
  /** 匹配值 */
  value: any;
  /** 动态值的code */
  fixCode: string;
  /** 条件中文描述 */
  desc:  {fieldName?:string,opt?:string,value?:any};
}
//简单条件分组 where内部是and, where之间是or
export interface ConditionGroup {
  where: Partial<where>[];
}

export type andOr = "and" | "or";

//复杂条件分组，每组内部由orAnd决定联合方式
export interface FormItemCondition {
  orAnd: andOr;
  where: Partial<where>[];
  conditions: Partial<FormItemCondition>[];
}
