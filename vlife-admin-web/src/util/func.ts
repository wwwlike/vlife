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
 };
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
   