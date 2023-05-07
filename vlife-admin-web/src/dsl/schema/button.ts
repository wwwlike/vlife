/**
 * 和按钮相关的前端数据结构和函数
 */

 import { IdBean, Result } from '@src/api/base';
 import { FormPageProps } from '@src/pages/common/formPage';
 
 /*按钮类型 */
 export enum BtnType {
   EDIT,
   ADD,
   RM,
   VIEW,
 }
 export enum RecordNum {
   NONE,
   ONE,
   MORE,
 }
 
 
 //按钮数据结构，能转换成VlifeButton的数据结构
 export interface VfButton<T extends IdBean> {
   key:string,
   className?:string,
   title: string; //按钮名称
   code?: string; //权限code
   tooltip?:string;//按钮介绍
   icon?: React.ReactNode; //按钮图标
   enable_recordNum?:RecordNum, //按钮可用需要记录的条数
   enable_match?:Partial<T>,//按钮可用匹配的数据格式
   disable_hidden?:boolean,//检查不通过是否隐藏按钮
   statusCheckFunc?:((...record:T[])=>(string|void));
   // 进行模型编辑，一般时modal的展现形式 他和api,click 3选1. 优先级 
   model?: Partial<FormPageProps<any>> & {
     //弹框的参数
     entityType: string; //所属模块
     type: string; //模型名称 dto,entity
    //  validate?:{[fieldName:string]:(val:object,formVal:object)=>string|Promise<any>|void},
     formApi?:(record: T)=>Promise<Result<T>>//提交按钮需要的API
   };
   //非模型直接在列表上修改数据的api
   tableApi?:(
     (
     ...ids: string[]
   ) => Promise<Result<any>>),
   //点击按钮触发的事件，使用后则model,tableAPI,则无效
   click?: (btn: VfButton<T>, index: number, ...record: T[]) => void;
 }
 
 // /*按钮类型 */
 // export enum BtnState {
 //   enable = "enable", //可见可用
 //   disable = "disable", //可见不可用 可以有 prompt
 //   hide = "hide", //不可见
 // }
 
 
 
 /**
  *
  * @param qucikCheck 根据规则检查数据的数量
  * @param data
  * @returns
  */
 export const checkLineNumber = (
   optSize: RecordNum,
   ...data: any[]
 ): string|void => {
   if  (optSize ===  RecordNum.ONE && data && data.length !==1){
     return "只能选择一条记录进行操作";
   }
   if  (optSize ===  RecordNum.NONE && data && data.length >0){
     return "当前操作不能选择任何一条记录";
   }
   if  (optSize ===  RecordNum.MORE && (data===undefined || data.length===0)){
     return "请至少选择一条记录";
   }
 }
 
 /**
  *
  * @param qucikCheck 根据规则检查数据的内容是否满足
  * @param data
  * @returns
  */
 export const checkObjData = (eqObj: any, ...data: any[]): boolean => {
   if (eqObj === undefined) {
     return true;
   } else {
     let eq: boolean = true;
     Object.keys(eqObj).forEach((k) => {
       if (eq) {
         if (
           eqObj[k] != undefined &&
           data.filter((d) => {
             return d[k] === eqObj[k];
           }).length === data.length
         ) {
           eq = true;
         }
         eq = false;
       }
     });
     return eq;
   }
 };
 