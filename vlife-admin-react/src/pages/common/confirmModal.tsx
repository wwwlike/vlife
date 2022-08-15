/**
 * 确认型弹出框
 */
 import NiceModal, { createNiceModal, useNiceModal } from '@src/store';
 import React, { useCallback, useMemo, useState } from 'react';
 import {BaseRequest, IdBean } from '@src/types/vlife';
 import FormPage, { FormPageProps } from './formPage';
import { Select } from '@douyinfe/semi-ui';
 
  /**
    * 1. 动态取数据，页面提供配置，然后存到前端 reactQuery方式缓存
    */
 export interface ConfirmModalProps extends Omit<FormPageProps,'setFormData'|'formData'>{
    saveFun?:(id:string)=>Promise<number>,
    title?:string,//默认删除的内容
    
 }


 
 /**
  * 传save则用传入的save进行保存，否则就用通用保存方法进行
  * 因为是modal窗口，固数据不需要传输出去
  * 
  */
 export const ConfirmModal=createNiceModal("confirmModal", ({saveFun,title="确认删除选中的记录么?"}:ConfirmModalProps) =>{
   const modal = useNiceModal("confirmModal");
   const handleSubmit = useCallback((id:string) => { //提交按钮触发的事件
   if(saveFun){    //通用保存
      saveFun(id).then(data=>{
        modal.resolve(data);
        modal.hide();
      });
   }
   }, [saveFun]);
 
   return (
   <NiceModal id="confirmModal" title={'删除确认'} width={350} onOk={handleSubmit}>
      <p>{title}</p>
   </NiceModal>)
 })
 
 export default ConfirmModal;