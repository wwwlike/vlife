import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { ITree } from '@src/api/base';

/**
 * 工具类函数非hooks
 */
 export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

 export const isVoid = (value: unknown) =>
   value === undefined || value === null || value === "";
 
 /**
  * 去除结尾的o
  */
 export const removeEnds0 = (value: string) => {
   return value.replace(/(0+)$/g, "");
 };
 
 /**
  * 把空的值的key删除掉,时解构进来的就回结构出去(...)
  * @param object
  * @returns
  */
 export const cleanObject = (object?: { [key: string]: unknown }) => {
   // Object.assign({}, object)
   if (!object) {
     return {};
   }
   const result = { ...object };
   Object.keys(result).forEach((key) => {
     const value = result[key];
     if (isVoid(value)) {
       delete result[key];
     }
   });
   return result;
 };
 /**
  * 检索是否是子数据
  * 根据itree的规范，
  * 42_01是42的子数据，42_01_01是42的孙子
  */
 export const checkSubData = (data: string, checkData: string): boolean => {
   if (
     checkData.startsWith(data + "_") && //以父类开头
     checkData.substring(data.length + 1).indexOf("_") === -1 //剩余部分不包含下划线
   ) {
     return true;
   }
   return false;
 }

 /**
  * 
  * @param value 判断是否为数字
  * @returns 
  */
export function isNumber(value: any): boolean {
  return typeof value === 'number';
}

/**
 *  删除对象里属性为空的属性
 * @param obj
 * @returns 
 */
export function removeNullProperties<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  ) as Partial<T>;
}

 /**
  * 传入一个对象，和键集合，返回对应的对象中的键值对
  * @param obj
  * @param keys
  */
 export const subset = <
   O extends { [key in string]: unknown },
   K extends keyof O
 >(
   obj: O,
   keys: K[]
 ) => {
   const filteredEntries = Object.entries(obj).filter(([key]) =>
     keys.includes(key as K)
   );
   return Object.fromEntries(filteredEntries) as Pick<O, K>;
 };
 
 export const isBasic=(obj:any):boolean=>{
   if(obj===String||obj===Number||obj==="string"||obj==="number"||obj===Boolean||obj==="boolean"||obj==="Icon"){
     return true
   }
   return false;
 }
 
  /**
      * 格式化时间
      * 调用formatDate(strDate, 'yyyy-MM-dd');
      * @param strDate（中国标准时间、时间戳等）
      * @param strFormat（返回格式）
      */
   export function formatDate(strDate: any, strFormat?: any){
     if (!strDate){ return; }
     if (!strFormat){ strFormat = 'yyyy-MM-dd'; }
     switch (typeof strDate) {
       case 'string':
         strDate = new Date(strDate.replace(/-/, '/'));
         break;
       case 'number':
         strDate = new Date(strDate);
         break;
     }
     if (strDate instanceof Date){
       const dict: any = {
         yyyy: strDate.getFullYear(),
         M: strDate.getMonth() + 1,
         d: strDate.getDate(),
         H: strDate.getHours(),
         m: strDate.getMinutes(),
         s: strDate.getSeconds(),
         MM: ('' + (strDate.getMonth() + 101)).substr(1),
         dd: ('' + (strDate.getDate() + 100)).substr(1),
         HH: ('' + (strDate.getHours() + 100)).substr(1),
         mm: ('' + (strDate.getMinutes() + 100)).substr(1),
         ss: ('' + (strDate.getSeconds() + 100)).substr(1),
       };
       return strFormat.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, function () {
         return dict[arguments[0]];
       });
     }
   }
 
 
  /**
   * @param rootCode itree数据转,datas数据
   * @param datas 
   * @returns 
   */
    export const arrayToTreeData =(datas:ITree[],valField:"id"|"code",rootCode?:string): TreeNodeData[] => {
      if(rootCode===undefined){
        rootCode===null
      }
      return datas.filter(d=>rootCode?d.pcode===rootCode:d.pcode===null).map((d:ITree)=>{
        return {key:d.id+"",label:d.name,value:d[valField],children:arrayToTreeData(datas,valField,d.code)}
      })
    }
   
    /**
     * 
     * @param all 查找根节点
     * @param sub 
     * @returns 
     */
    export const findTreeRoot=<T extends ITree>(all:T[],sub:T):T|undefined=>{
      if(sub.pcode===undefined||sub.pcode===null){
        return sub;
      }else{
       const result:T[]= all.filter(one=>one.code===sub.pcode);
       if(result.length>0){
        return findTreeRoot<T>(all,result[0])
       }else{
        return undefined;
       }
      }
    }


  /**
 * 过滤all里所有root的子节点(递归)
 */
  export const findSubs=<T extends ITree>(all:T[],root:T):T[]=>{
    const subs:T[]=[];
    const next=all.filter(a=>a.pcode===root.code)
    if(next&&next.length>0){
      subs.push(...next)
      next.forEach(n=>{
        subs.push(...findSubs(all,n));
      })
    }
    return subs;
  }

 
  /**
 * 随机生成一个字符串
 * @param {number} length 长度
 * @param {string} customStr 自定义字符串
 * @return {string} 随机字符串
 */
export const getRandomString = (length:number, customStr?:string) => {
  let chars = customStr
    ? customStr.split('')
    : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};


/**
 * 字符串中间1/3长度部分加密
 * @param input 
 * @returns 
 */
 export const safeStr=(input: string): string =>{
  if(input===null||input===undefined){
    return "-";
  }
  const length = input.length;
  if (length < 3) {
    return '*'.repeat(length);
  } else {
    const middleStart = Math.floor(length / 3);
    const middleEnd = Math.ceil((length / 3) * 2);
    const beforeMiddle = input.slice(0, middleStart);
    const middlePart = '*'.repeat(middleEnd - middleStart);
    const afterMiddle = input.slice(middleEnd);
    return beforeMiddle + middlePart + afterMiddle;
  }
}

/**
 * 判断a对象是否包b对象的所有属性，且值相等
 */
export const objectIncludes=(a:any,b:any):boolean=>{
 return  Object.keys(b).every(
    (key) => a.hasOwnProperty(key) && a[key] ===b[key]
  )
}


type FunctionWithParams<T extends (...args: any[]) => any> = (...args: T extends (...args: infer P) => any ? P : never) => string[];
/**
 * 返回函数的入参参数名 
 */
export function getParamNames<T extends (...args: any[]) => any>(func: T): FunctionWithParams<T> {
  const paramNames = func.toString()
    .match(/\(([^)]+)\)/)?.[1]
    .split(',')
    .map(param => param.trim()) || [];
  return (...args: any[]) => paramNames;
}

//首字母大写
export function capFirst(inputString: string): string {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}
//首字母小写
export function uncapFirst(inputString: string): string {
  return inputString.charAt(0).toLowerCase() + inputString.slice(1);
}


type PromiseFunction = () => Promise<any>;

export function isPromise(func: () => any): func is PromiseFunction {
  return typeof func === "function" && func() instanceof Promise;
}
