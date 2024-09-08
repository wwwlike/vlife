// 数据校验是否满足condition里定义的规则

import { ConditionGroup, OptEnum, where } from '@src/dsl/base';
import { isArray } from 'lodash';

//所有数据进行条件比对
export const usableDatasMatch=(conditions:ConditionGroup[],...datas:any[]):boolean=>{
  for (const data of datas) {
    let result=usableMatch(conditions,data);
    if(!result){
      return false;
    }
  }
  return true;
}

/**
 * 判断表单或者列表数据是否满足条件
 *
 * @param conditions 条件组
 * @param data 待判断数据
 * @returns 返回一个布尔值，表示数据是否满足条件
 */
export const usableMatch=(conditions:ConditionGroup[],data:any):boolean=>{
  if(conditions.length===0){
    return true;
  }
  for (const condition of conditions) {
    let result=usableGroupMatch(condition,data);
    if(result){
      return true;
    }
  }
  return false;
}
/**
 * 判断一组条件group是否满足
 *
 * @param condition 条件
 * @param data 待判断数据
 * @returns 返回一个布尔值，表示数据是否满足条件
 */
export const usableGroupMatch=(_group:ConditionGroup,data:any):boolean=>{
  const _wheres:Partial<where>[]=_group.where;
  for (const _where of _wheres) {
    let result=usableWhereMatch(_where,data);
    if(!result){
      return false;
    }
  }
  return true;
}

/**
 * 单个where条件是否满足
 * @param where 条件
 * @param data 待判断数据
 * @returns 返回一个布尔值，表示数据是否满足条件
 */
export const usableWhereMatch=(_where:Partial<where>,data:any):boolean=>{
  console.log("where",_where)
  if(_where.fieldName&&_where.opt===OptEnum.eq && data[_where.fieldName]===_where.value[0]){
    return true
  }
  return false;
}