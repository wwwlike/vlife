import { Field, Form } from '@formily/core';
import {   FS_OPT, FS_PROP, FS_STATE,reaction, VF, VfAction, VfCondition } from './VF';
import {  isBoolean, isNull, isNumber } from 'lodash';
import { SchemaReaction } from '@formily/react';
//手动级联响应与formily配合使用

/**
 * 字段批量响应
 * @param actions 响应内容
 * @param form  formily对象
 */
export const execVfAction = (actions: VfAction[], form: Form,parentData:any) => {
  actions.forEach((a:VfAction) => {
    const fields: string[] = a.fields;
    fields.forEach((fieldName) => {
      const reactions:reaction[]=a.reations;
      reactions.forEach((r:reaction)=>{
        // form.formily里的form对象需要获得指定useranme的 field对象，应该如何调用form对象的方法
        const prop: string = FS_STATE[r.state];
        if(typeof r.value==="function"){//1函数方式设置value
          const funcResult=r.value({...form.values,parent:parentData});
          //1.1异步函数设置value
          if (typeof funcResult === "object") {
            funcResult.then((d:any) => {
              form.setFieldState(fieldName, (state: any) => {
                state[prop] = d;
              });
            });
          }else{//1.2同步函数设置value
            form.setFieldState(fieldName, (state: any) => {
              state[prop] =funcResult;
            });
          }
        }else{//2直接设置固定值
          form.setFieldState(fieldName, (state: any) => {
            state[prop] = r.value;
          });
        }
      })
    });
  });
};

export const  getObjElStr1=(depsIndex:number,condition:VfCondition|undefined,form:Form):string=>{
  if(condition?.prop===FS_PROP.size){
    return `$deps[${depsIndex}]&&$deps[${depsIndex}].length`
  }else if(condition?.prop===FS_PROP.fetchData_type){
    return `${form.query(condition.field).take()?.componentProps.fetchData.filter(
      (f:any) => f.id === form.query(condition.field).value
    )[0].fieldType }`
  }else{
    return `$deps[${depsIndex}]`
  }
}

/**
 * 条件结果
 * @param vf 
 * @param form 
 * @returns 实时匹配结果result返回)
 */
 export const whenEl2=(vf:VF,formData:any):boolean=>{
  if(vf.conditions.length===0){
    return true;
  }
  const results:boolean[]=[];
  vf.conditions.forEach((condition:VfCondition)=>{
    const field=condition.field;
    if(field!==undefined){
      const leftVal=formData[field]; //左侧变量值 取自字段/取自formVo里的信息
      const rightFixedVal=condition.value //等式右侧固定值
      if (condition.opt === FS_OPT.EQ) {
        results.push(leftVal===rightFixedVal)
      }else if (condition.opt === FS_OPT.GT) {
        results.push(leftVal>rightFixedVal)
      }else if (condition.opt === FS_OPT.GE) {
        results.push(leftVal>=rightFixedVal)
      }else if (condition.opt === FS_OPT.LT) {
        results.push(leftVal<rightFixedVal)
      }else if (condition.opt === FS_OPT.LE) {
        results.push(leftVal<=rightFixedVal)
      }else if (condition.opt === FS_OPT.INCLUDES) {
        results.push(leftVal.includes(rightFixedVal))
      }else if (condition.opt === FS_OPT.iSNOTNULL) {
        results.push(!isNull(leftVal))
      }else if (condition.opt === FS_OPT.iSNULL) {
        results.push(isNull(leftVal))
      }else if (condition.opt === FS_OPT.LIKE) {
      }else if (condition.opt === FS_OPT.START_WITH) {
        results.push(leftVal.startsWith(rightFixedVal))
      }else if (condition.opt === FS_OPT.END_WITH) {
        results.push(leftVal.endsWith(rightFixedVal))
      }else if (condition.opt === FS_OPT.REGEX) {
        results.push(leftVal.endsWith(rightFixedVal))
      }
    }
  })
  if(vf.conn==="and"){
     return results.every((value) => value === true);
  }else{
    return results.some((value) => value === true);
  }
}

/**
 * 条件结果
 * @param vf 
 * @param deps 
 * @param form 
 * @returns  字符串表达式返回
 */
 export const whenElStr1 = (vf: VF,deps:string[],form:Form): any => {
  let whenStr=`{{`;
  vf.conditions.forEach((condition,index)=>{
    const sort:number= deps.indexOf(condition.field);
    const when=():any=>{
        const val=getObjElStr1(sort,condition,form);
        if (condition.opt === FS_OPT.EQ) {
            return `${val}===${isNumber(condition.value)||isBoolean(condition.value)?condition.value:(`"`+condition.value+`"`)}`;
        }else if (condition.opt === FS_OPT.GT) {
          return `${val}&&${val}>${condition.value}`;
        }else if (condition.opt === FS_OPT.GE) {
          return `${val}&&${val}>=${condition.value}`;
        }else if (condition.opt === FS_OPT.LT) {
          return `${val}&&${val}<${condition.value}`;
        }else if (condition.opt === FS_OPT.LE) {
          return `${val}&&${val}<=${condition.value}`;
        }else if (condition.opt === FS_OPT.INCLUDES) {//格式化成字符串形式的数组
          return `(${val}&&${JSON.stringify(condition.value)}.includes(${val}))`
        }else if (condition.opt === FS_OPT.NE) {
          return `${val}!==${isNumber(condition.value)||isBoolean(condition.value)?condition.value:(`"`+condition.value+`"`)}`;
          // return `$deps[${sort}]!=="${condition.value}"`;
        }else if (condition.opt === FS_OPT.iSNOTNULL) {
          return `($deps[${sort}]!==null&&$deps[${sort}]!==undefined&&$deps[${sort}]!=="")`;
        }else if (condition.opt === FS_OPT.iSNULL) {
          return `($deps[${sort}]===null||$deps[${sort}]===undefined||$deps[${sort}]==="")`;
        }else if (condition.opt === FS_OPT.CHANGE) {
          return `$deps[${sort}]`;
        }else if (condition.opt === FS_OPT.START_WITH) {
          return `($deps[${sort}]&&$deps[${sort}].startsWith("${condition.value}"))`
        }else if (condition.opt === FS_OPT.END_WITH) {
          return `($deps[${sort}]&&$deps[${sort}].endsWith("${condition.value}"))`
        }else if (condition.opt === FS_OPT.REGEX) {
          return `$deps[${sort}]&&!${condition.value}.test($deps[${sort}])`
        }
      return "";
    }
    whenStr+=when();
    if(index !==vf.conditions.length-1){
      if(vf.conn==="and"){
        whenStr=whenStr+"&&"
      }else{
        whenStr=whenStr+"||"
      }
    }
  })
  whenStr+=`}}`;
   return whenStr;
};
export const stateFulfill = (actions:VfAction[],form:Form): any => {
  const object:any={};
  actions.forEach(action=>{
    action.reations.forEach(reaction=>{
      //动态的响应(函数)不添加进来
      if(typeof reaction.value!=="function"){
        object[FS_STATE[reaction.state]]=reaction.value;
      }
    })
  })
  return object
};
export const vfEventReaction = (
    vf: VF[], //字段设置,
    form:Form
  ): Partial<SchemaReaction>[] => {
    let obj: SchemaReaction[] = [];
    vf.forEach((f) => {
      //被动联动依赖的字段
      const deps: string[] = [
        ...new Set(
          f.conditions?.flatMap((condition) => condition.field)
        ),
      ];
      obj = [
        ...obj,
        {
          dependencies: deps,
          when: whenElStr1(f, deps, form),
          fulfill: {
            state: {
              ...stateFulfill(f.actions.filter((ff) => ff.fill),form),
            },
          },
          otherwise: {
            state: {
              ...stateFulfill(f.actions.filter((ff) => !ff.fill),form),
            },
          },
        },
      ];
    });
  return obj;
}