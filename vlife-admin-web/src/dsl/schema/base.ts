/**
 * 组件的数据结构
 */
export enum sourceType{
  fixed='fixed',field='field',dict='dict',sys='sys',api='api',func='func'}


export enum Mode{
  list="list",filter="filter",form="form"
}

export enum DataType{
  basic="basic", //基础数据类型
  array="array", //集合数组
  object="object",//复杂对象
  icon="Icon",//图标类型
  image="image",//图像类型
  event="event", //事件数据类型
  page="page",//分页数据
}

/**
 * ts数据类型
 */
 export enum TsType{
  string="string", //基础数据类型
  number="number", //集合数组
  date="date",//复杂对象
  boolean="boolean",
}