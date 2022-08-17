import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer, useField, useForm } from '@formily/react';
import Search from '@src/components/search';
import DictSelectTag from '@src/components/select/DictSelectTag';
import { ArrayField } from '@formily/core';
interface FormliyDictSelectTagProps{
}
/**
 * 平铺tag的形式替代字典下拉框
 */
const FormliyDictSelectTag=observer((prop:FormliyDictSelectTagProps)=>{
  const field = useField<ArrayField>();
  const fieldName:string=field.path.entire.toString();
  const form = useForm();
  const selectMore=useMemo(()=>{
    return !(field.componentProps['type']==='string'&&field.componentProps['fieldType']==='basic')
  },[field.componentProps])
  const onSelected=useCallback((values:(string|number|undefined)[])=>{
    if(values.length>0){
      if(selectMore){
        form.setValuesIn(fieldName,values);
      }else{
        form.setValuesIn(fieldName,values[0]);
      }
    }else{
      form.setValuesIn(fieldName,undefined);
    }
  },[selectMore,fieldName])

  return <DictSelectTag 
    fieldName={fieldName} 
    selectMore={selectMore}
    onSelected={onSelected} 
    datas={field.dataSource} 
  />
}) 
export default FormliyDictSelectTag;