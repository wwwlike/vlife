import {  Input, TagInput } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import React, {useEffect, useMemo, useRef, useState } from 'react';
import { useNiceModal } from '@src/store';
import { observer, useField, useForm } from '@formily/react';
import apiClient from '@src/utils/apiClient';
import { Result } from '@src/types/vlife';
import { useSelector } from 'react-redux';
import { stringLength } from '@formily/shared';
import { ArrayField } from '@formily/core';
import { useUpdateEffect } from 'ahooks';
/**
 * 外键关系展示[INPUT+TAG]组件
 * 1. 核心状态：
 * 展示内容
 * 使用了接口，不能成为组件，需要移到page模块里
 * 外键数据查询的组件
 * 1. 点击后弹出 外键表的table页面。
 * 2. 关闭(隐藏)Input如果在modal的页面
 * 3. 选择或者关闭弹出框后，原先的modal页面显示出来并赋值
 * 4. input框上要显示中文
 * 5. 调用table的弹出组件
 */

type tagObj={id:string,name:string}
interface RelationInputProps{
  project:tagObj[]
  onChange:(selected:this.project)=>void;
}

const RelationInput=(props:RelationInputProps)=>{

  const field = useField<ArrayField>()
  const form = useForm()
  const {show,hide,activeModalId} = useNiceModal("tableModal");
  const formModal = useNiceModal("formModal");
  // const [project,setProject] =useState<string[]>([]);//主题
  const [project,setProject] =useState<{id:string,name:string}[]>([]);//主题
  // 请求主键的名称考虑用reqctQuery缓存起来
  const [entityName,setEntityName]=useState('');
  //字段名
  const [fieldName,setFieldName]=useState(field.path.entire.toString());
  //判断是否选多个
  const selectMore=useMemo(()=>{
    return !(field.componentProps['type']==='string'&&field.componentProps['fieldType']==='basic')
  },[field.componentProps])
  
  useEffect(()=>{
    //待优化从form里取
   const fkmap= field?.componentProps.fkMap;
   let temp:{id:string,name:string}[]=[];
   for(const x in fkmap){
    if(typeof field.value==='string'&& x===field.value ){
      temp.push({id:x,name:fkmap[x]})
    }else{
      field.value.forEach(id=>{
        if(id===x){
          temp.push({id:x,name:fkmap[x]})
        }
      })
    }
   }
   setProject([...temp])
   setEntityName(fieldName.substring(0,fieldName.length-2))//去掉结尾的id当路径
  },[field])


  const gloable=useSelector(state=>state);
  //写成useCallback不在modal时会不弹出来
  //弹出列表
  const onFocus=()=>{
    if(activeModalId) {
      formModal.hide();
    };
    show({
      entityName,
      selected:project,
      btns:{}, //弹出组件不需要相关按钮
      select_more:selectMore,//选一个，这个要根据字段类型来决定
      select_show_field:'name',// 待从tableInfo里取目前写死了
      }).then((data:any)=>{
        // data 选中的数据
        hide()
        setTimeout(()=>{
          if(activeModalId){
            //弹出层展示->给initData赋值id,然后在请求name
            if(data.length===0){
              formModal.show({...formModal.args,initData:{...form.values,[fieldName]:undefined}});
            }else if(selectMore){
              formModal.show({...formModal.args,initData:{...form.values,[fieldName]:data.map((d:any)=>d.id)}});
            }else{
              formModal.show({...formModal.args,initData:{...form.values,[fieldName]:data.map((d:any)=>d.id)[0]}});
            }
            // setProject(data.map((d:any)=>{d.id,d.name}))
          }else{
            // 改form里的值
            if(data.length===0){
              form.setValuesIn(fieldName,undefined)
            }else if(selectMore){
              form.setValuesIn(fieldName,data.map((d:any)=>d.id))
            }else{
              form.setValuesIn(fieldName,data.map((d:any)=>d.id)[0])
            }
            //本页面input展示内容改变
            setProject(data)
          }
        },300)
    });
    };
  return <>
  {JSON.stringify(field.componentProps.fkMap)}
  <TagInput  
    showClear 
    placeholder={field.title} 
    value={project.map(m=>m.name)} 
    defaultValue={project.map(m=>m?.id)} 
    onFocus={onFocus} 
    // onRemove={(v,i) => {console.log(`onRemove，移除：${v}, 序号：${i}`);}} 
    onRemove={(v,i) => {
      setProject([...project.filter((d,index)=>{
          return i!==index
      })])
    }}
    /></>
}
export default RelationInput;