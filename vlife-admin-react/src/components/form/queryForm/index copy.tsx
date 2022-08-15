/**
 * 根据vlife的req模型结合formily实现配置搜索组件功能
 */
/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 */
 import React, { useCallback, useEffect, useMemo, useState } from 'react';
 import { createForm, onFormInit,onFormValuesChange } from '@formily/core';
 import { createSchemaField,  FormProvider, observer, Schema, useFieldSchema, useForm } from '@formily/react';
 import { FormItem, Input ,FormGrid,GridColumn,ArrayItems,ArrayTable,FormTab,DatePicker} from '@formily/semi';
 import { fieldInfo, ModelInfo, TranDict } from '@src/types/vlife';
 import RelationInput from '@src/components/form/comp/RelationInput'
 import SearchInput from '@src/components/form/comp/SearchInput'
 import DictSelectTag from '@src/components/form/comp/DictSelectTag'
import Search from './search';
import { Select } from '@formily/antd';


 /**
  * 表单布局展示，需要固定卸载函数式组件之外
  */
  const SchemaField = createSchemaField({
   components: {
     Input,FormItem,FormGrid,GridColumn,Select,ArrayItems,ArrayTable,FormTab,DatePicker,
     RelationInput,//封装关系选择formily组件，
     SearchInput,
     DictSelectTag
   },
 })
  //表信息
 export interface FormProps {
   entityName:string,
   formData?:any, // form初始数据
   setFormData:(data:any)=>void //修改数据传出去
   setError?: () => void; //校验错误信息
   hideColumns?: string[]; //需要隐藏的不显示的列
   read?: boolean; //只读模式
   dicts?: TranDict[]; //字典信息
   layout?:string,// [] 横/纵布局
   modelInfo:ModelInfo|undefined;
   maxColumns?: number[];//列信息
   fkMap?:any;
   
 }

 export default ({entityName,maxColumns=[2,2,2],dicts,formData,setFormData,fkMap,modelInfo}:FormProps) => {
   
  const [schema,setSchema]=useState<any>({});
  /**
    * 动态表单数据初始化
    */
   const form = useMemo(
     () =>{
       return createForm({
         readPretty: false,
         initialValues: {
          ...formData
         },
         effects() {
           onFormInit((form)=>{
           }),
           onFormValuesChange((form) => {
             if(setFormData)
               setFormData({...form.values})
           })
         },
       })},
     [modelInfo]
   )

   /**
    * 排序后字段信息
    * 1. 搜索框最前面
    * 2. 字典，选项
    * 3. 日期过滤
    * 4. 排序
    */
   const sortFields=useMemo(()=>{
    console.log("modelInfo?.fields",modelInfo?.fields)
    return modelInfo?.fields||[];
   },[modelInfo?.fields])

   /**
    * 字典数据提取(字典显示有抖动这里需要测试)
    */
   const fieldEnum=useCallback((dictCode:string)=>{
     const dictEnum:{label:string,value:any}[]=[];
     if(dicts){
       const array=dicts.filter((sysDict)=>{
         //console.log(sysDict.column.toLowerCase()+"_"+dictCode.toLowerCase())
         if(sysDict.column.toLowerCase()===dictCode.toLowerCase()){
             return true;
         }
       })
       if(array){
         array[0].sysDict.forEach(d=>{
           dictEnum.push({label:d.title,value:d.val});
         })
       }
     }
     return dictEnum;
   },[dicts])
 
    /**
     * 动态表单formily的properties
     */
    const schemaProperties= useMemo(()=>{
    const pp:any={};
    sortFields.forEach((f)=>{
    const prop:any=pp[f.dataIndex]={};
    prop.title=f.title;

    prop['x-decorator']= 'FormItem';

    if(f.dictCode||f.type==='boolean'){
      prop['x-component']='DictSelectTag'
      if(f.dictCode)
        prop.enum=fieldEnum(f.dictCode);
      else
        prop.enum=[{label:'是',value:true},{label:'否',value:false}]
      prop['x-component-props']=f;
    }else if (f.dataIndex!=='id'&&
    (f.pathName.endsWith('Id')||f.pathName.endsWith('_id'))){
      // &&f.entityType!==modelInfo?.entityType 对应问题20
      prop['x-component']='RelationInput';
      prop['x-component-props']={...prop['x-component-props'],'fkMap':fkMap,...f};
    }else if (f.type==='date'){
      prop['x-component']='DatePicker';
      if(f.fieldType==='list'){
        prop['x-component-props']={...prop['x-component-props'],type:'dateRange','format':"yyyy/MM/dd"};
      }else{
        prop['x-component-props']={...prop['x-component-props'],'format':"yyyy/MM/dd"};
      }
    }else{
      prop['x-component']='SearchInput';
    }
    // layout?: 'vertical' | 'horizontal' | 'inline';
    prop[' x-decorator-props']={layout:'vertical',labelAlign:'left'};
    prop.type='string';
    })
    return pp;
   },[sortFields,entityName])
 
   useEffect(()=>{
      setSchema(
        {
             type: 'object',
             properties: {
               grid: {
                 type: 'void',
                 'x-component': 'FormGrid',
                 'x-component-props': {
                   maxColumns: maxColumns, //
                 },
                 properties:schemaProperties
               }
             },
           }
      )
    return ()=>{
      setSchema({});
    }
   },[entityName,schemaProperties])
   
  //  const schema =useMemo(()=> {
  //   return {
  //    type: 'object',
  //    properties: {
  //      grid: {
  //        type: 'void',
  //        'x-component': 'FormGrid',
  //        'x-component-props': {
  //          maxColumns: maxColumns, //
  //        },
  //        properties:schemaProperties
  //      }
  //    },
  //  }
  // },[schemaProperties,modelInfo?.entityType])
   return (
     <div>
        {/* {JSON.stringify({modelInfo})} */}
       {/* <Search obj={schema} ></Search> */}
       <FormProvider form={form}>
         <SchemaField schema={schema}></SchemaField>
       </FormProvider>
     </div>
     )
 }
 
 
 
 
