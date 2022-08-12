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
  * 
  */
 export const VlifeModal=createNiceModal("formModal", ({saveFun,initData,entityName,modelName,...props}:FormModalProps) =>{
   const modal = useNiceModal("formModal");
   const [formData,setFormData]=useState<any>(initData?{...initData}:{});//数据初始化
   const handleSubmit = useCallback(() => { //提交按钮触发的事件
   if(saveFun){    //通用保存
      saveFun(formData).then(data=>{
        // console.log('modal.resolve', modal.resolve);
       modal.resolve(data);
      //  pageRefresh();
       modal.hide();
     }
     )
   }else{
  
   }
   }, [formData]);
 
   return (
   <NiceModal id="formModal"  title={props.type==='dataForm'?(formData.id?"编辑":"新增"):'查看'} width={900} onOk={handleSubmit} >
      {/* {JSON.stringify(initData)} */}
      <FormPage 
        formData={formData} 
        setFormData={setFormData} 
        entityName={entityName} 
        modelName={modelName}
        {...props}
        />
   </NiceModal>)
 })
 
 export default VlifeModal;