/**
 *
 *  vlife 新增，修改类型的弹出组件
 * 1. 提供外部调用的hook
 * 2. 对表信息进行拉取
 * 3. 完成model edit,add操作
 * 4. 也要与权限关联
 */
 import NiceModal, { createNiceModal, useNiceModal } from '@src/store';
 import React, { useCallback, useMemo, useState } from 'react';
 import {BaseRequest, IdBean } from '@src/types/vlife';
 import FormPage, { FormPageProps } from './formPage';
import { Form, IFormFeedback } from '@formily/core';
 
  /**
    * 1. 动态取数据，页面提供配置，然后存到前端 reactQuery方式缓存
    */
 export interface FormModalProps extends Omit<FormPageProps,'setFormData'|'formData'>{
    saveFun?: <T extends IdBean>(dto:Partial<T>)=>Promise<T>,
    initData?:Partial<IdBean>|Partial<BaseRequest>
 }
 
 /**
  * 传save则用传入的save进行保存，否则就用通用保存方法进行
  * 因为是modal窗口，固数据不需要传输出去
  * initData 数据初始化
  * formData 表单录入后的数据
  */
 export const VlifeModal=createNiceModal("formModal", ({saveFun,initData,entityName,modelName,onError,...props}:FormModalProps) =>{
   const modal = useNiceModal("formModal");
   const [formData,setFormData]=useState<any>();//
   const [form,setForm]=useState<Form>();//
   const [errors,setErrors]=useState<IFormFeedback[]>([]);
   const title=useMemo(()=>{
      if(props.type==='dataForm'){
        if((formData&&formData.id) ||(initData&&initData.id)){
          return "编辑";
        }else{
          return "新增";
        }
      }else{
        return '查看';
      }
   },[initData,formData,props.type])
   const handleSubmit = useCallback(() => { //提交按钮触发的事件
    if(saveFun&&form ){    //通用保存
        form.submit().then(data=>{
          saveFun(form.values).then(data=>{
            // console.log('modal.resolve', modal.resolve);
          modal.resolve(data);
          //  pageRefresh();
          modal.hide();
       })
        }).catch(e=>{
          // alert(e);
        })
      
    }
   }, [formData,form]);
 
   return (
   <NiceModal id="formModal"  
    title={title}
     width={900} onOk={handleSubmit}
    //  okButtonProps={
    //   {disabled:form&&form.errors.length>0}
    // }
     >
     {/* {JSON.stringify(form?.errors)} */}
      <FormPage 
        onError={setErrors}
        formData={initData} 
        onDataChange={setFormData}
        entityName={entityName} 
        modelName={modelName}
        onForm={setForm}
        {...props}
        />
   </NiceModal>)
 })
 
 export default VlifeModal;