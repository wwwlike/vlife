/**
 * 选择组件,用于搜索查询页面模块使用，
 * 将搜索条件以信息块形式展示出来
 */
 import { Space, Tag } from '@douyinfe/semi-ui';
 import React, { useCallback, useEffect, useState } from 'react';
 type DictSelectTagProps={
   fieldName:string,
   datas:{label?:string,value?:number|string}[], //字典模式
   selected?:(number|string)[],//初始选中
   selectMore?:boolean,
   onSelected:(ids:(string|number|undefined)[])=>void//事件
   showMax?:number;//最多显示数量,待启用
 }
 /**
  * 1. 支持2种自定义选择模式
  * - 字典模式:
  * - 多字段模式 boolean类型的字段，选中则为true
  * 1. 组件排列
  * 2. 组件选中，及取消
  * 3. 当前选中数据传输出去
  * 4. 全部则表示(不选择)
  */
 const DictSelectTag =({fieldName,datas,selected,onSelected,selectMore=false,showMax=20,...props}:DictSelectTagProps)=>{
  const [selectedValues,setSelectedValues]=useState<((string|number|undefined)[])>(selected?{...selected}:[]);
  
  useEffect(()=>{
    if(selectedValues[0]===undefined){
      onSelected([]);
    }else{
      onSelected(selectedValues);
    }
        },[selectedValues])

   return (
     <Space wrap={true}>
        {/* {JSON.stringify(selectedValues)} */}
        {datas.map((d)=>{
          if(selectMore||d.value)//单选则不出现全部
          return (
          <Tag 
          onClick={()=>{
            if(d.value===undefined&&selectedValues.length>=1){
              setSelectedValues([d.value])
            }else{
            const has=selectedValues.filter(v=>d.value===v).length>0;
            //值之前存在则是取消
            if(has){ //点取消
              if(selectMore){
                setSelectedValues([...selectedValues.filter(v=>d.value!==v)])
              }else{
                setSelectedValues([])
              }
            }else{   //点选中
              // 全选要取消
              if(selectMore){
                selectedValues.push(d.value)
                if(d.value)
                  setSelectedValues([...selectedValues.filter(v=>v!==undefined)])
                else
                  setSelectedValues([...selectedValues])
              }else{
                setSelectedValues([d.value])
              }
            }
          }
          }}
          type={
            selectedValues.length>0?
            (selectedValues?.filter(v=>d.value===v).length>0?'solid':'ghost'):
            (d.value===undefined?'solid':'ghost')}
          size='large'
          key={"dict_select_tag"+d.value} 
          color='blue'>{d.label}</Tag>
          )
      })}
     </Space>
   )
 }
 export default DictSelectTag;
 