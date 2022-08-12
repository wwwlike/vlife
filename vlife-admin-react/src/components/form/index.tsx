/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { createForm, onFormInit,onFormValuesChange } from '@formily/core';
import { createSchemaField, Field, FormProvider, observer, Schema, useFieldSchema, useForm } from '@formily/react';
import { FormItem, Input ,FormGrid,GridColumn,Select,ArrayItems,ArrayTable, Checkbox,DatePicker} from '@formily/semi';
import { BaseRequest, fieldInfo, IdBean, ModelInfo, TranDict } from '@src/types/vlife';
import RelationInput from '@src/components/form/comp/RelationInput'
import { useSetState } from 'ahooks';

/**
 * 表单布局展示，需要固定卸载函数式组件之外
 */
 const SchemaField = createSchemaField({
  components: {
    Input,FormItem,FormGrid,GridColumn,Select,ArrayItems,ArrayTable,Checkbox,DatePicker,
    RelationInput//封装关系选择formily组件
  },
})
 //表信息
export interface FormProps {
  formData?:any, // form初始数据
  setFormData:(data:any)=>void //修改数据传出去
  setError?: () => void; //校验错误信息
  hideColumns?: string[]; //需要隐藏的不显示的列
  read?: boolean; //只读模式
  dicts?: TranDict[]; //字典信息
  layout?:string,// [] 横/纵布局
  fkMap?:any; // 外键对象信息{ID,NAME}
  maxColumns?: number[];//列信息
  modelInfo:ModelInfo|undefined;

}

export default ({maxColumns=[2,2,2],dicts,formData,setFormData,read,fkMap,modelInfo}:FormProps) => {
  /**
   * 动态表单数据初始化
   * 使用参考：https://core.formilyjs.org/zh-CN/api/models/form
   */
  const form = useMemo(
    () =>
      createForm({
        readPretty: read,
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
      }),
    [read,formData,fkMap]
  )

  // useEffect(()=>{




  // },[])
  /**
   * 字典数据提取(字典显示有抖动这里需要测试)
   */
  const fieldEnum=useCallback((dictCode:string)=>{
    const dictEnum:{label:string,value:any}[]=[];
    if(dicts){
      const array=dicts.filter((dict)=>{
        //console.log(dict.column.toLowerCase()+"_"+dictCode.toLowerCase())
        if(dict.column.toLowerCase()===dictCode.toLowerCase()){
            return true;
        }
      })
      if(array){
        array[0].dict.forEach(d=>{
          dictEnum.push({label:d.title,value:d.val});
        })
      }
    }
    // console.log(dictEnum)
    return dictEnum;
  },[dicts])


  // const memoFkMap=useMemo(()=>{
  //   return {fkMap:fkMap}
  // },[fkMap])
   /**
    * 动态表单formily的properties
    *   
    */
   const schema= useMemo(()=>{
    const pp:any={};
      modelInfo?.fields.filter(f=>{
     return ((read&& f.dataIndex!=='id'&&
     f.dataIndex!=='status')||(f.dataIndex&&
      f.dataIndex!=='id'&&
      f.dataIndex!=='status'&&
      f.dataIndex!=='createId'&&
      f.dataIndex!=='modifyId'&&
      f.dataIndex!=='createDate'&&
      f.dataIndex!=='modifyDate'))
    }).forEach((f)=>{
      pp[f.dataIndex]={};
      const prop:any=pp[f.dataIndex];
      prop.title=f.title;
      prop['x-decorator']= 'FormItem';
      if(f.dictCode){
        prop['x-component']='Select';
        prop.enum=fieldEnum(f.dictCode);
      }else if (f.dataIndex!=='id'&&f.entityType!==modelInfo.entityType&&
      (f.pathName.endsWith('Id')||f.pathName.endsWith('_id'))){
        prop['x-component']='RelationInput';
        prop['x-component-props']={...prop['x-component-props'],'fkMap':fkMap,...f};
      }else if (f.type==='boolean'){
        prop['x-component']='Checkbox';
        // prop['x-component-props']={...prop['x-component-props'],'fkMap':fkMap,...f};
      }else if (f.type==='date'){
        prop['x-component']='DatePicker';
        prop['x-component-props']={...prop['x-component-props'],'format':"yyyy/MM/dd"};
      }else{
        prop['x-component']='Input';
      }
      prop.type='string'
    })
    return {
      type: 'object',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            maxColumns: maxColumns, //
          },
          properties:pp
        }
      },
    }
  },[modelInfo,fkMap])

  // const schema = {
  //   type: 'object',
  //   properties: {
  //     grid: {
  //       type: 'void',
  //       'x-component': 'FormGrid',
  //       'x-component-props': {
  //         maxColumns: maxColumns, //
  //       },
  //       properties:schemaProperties
  //     }
  //   },
  // }
  return (
      <FormProvider form={form}>
        <SchemaField schema={schema}></SchemaField>
      </FormProvider>
    )
}



