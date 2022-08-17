/**
 * 外键选择的列表弹出组件
 * 1. 支持简单搜索
 * 2. 支持选中1个或者多个
 * 3. 支持列表双击选择后关闭
 * 4. 支持多个选择后点确定关闭
 * 5. 确定按钮diseased
 * 6. 
 */
import NiceModal, { createNiceModal, useNiceModal } from '@src/store';
import React, { useCallback, useState } from 'react';
import TablePage, { tablePageProps } from './tablePage';
 
export interface TableModalProps  extends tablePageProps {
 width:number
}
/**
 * selected ，列表初始选中的数据 仅仅包含name和id
 */
export const TableModal=createNiceModal("tableModal", ({width=900,selected:oldSelected,...props}:TableModalProps) =>{
  const modal = useNiceModal("tableModal");
  const [selects,setSelects]=useState<{id:string|number,name?:string}[]>([]);
  const handleSubmit = useCallback(() => { //提交按钮触发的事件
    modal.resolve(selects);//谁呼出来的回调
    modal.hide();
  }, [selects]);
  const onCancel = useCallback(() => { //点取消还原之前的选中项
    modal.resolve(oldSelected);//
    modal.hide();
  }, [oldSelected]);

  return (
  <NiceModal id="tableModal" title={'列表'}  width={width}
    onOk={handleSubmit} onCancel={onCancel}
    // okButtonProps={
    //   {disabled:selects.length===0}
    // }
  >
    {/* {JSON.stringify(oldSelected)} */}
    <TablePage 
      onSelected={(data)=>{
        setSelects(data)}} //table的选择事件
      selected={oldSelected}
      {...props} />
  </NiceModal>)
})

export default TableModal;

