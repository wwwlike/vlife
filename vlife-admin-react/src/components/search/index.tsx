import { IconSearch } from '@douyinfe/semi-icons';
import { Input } from '@douyinfe/semi-ui';
import { useUrlQueryParam } from '@src/utils/lib';
import { useDebounce, useDebounceEffect } from 'ahooks';
import React, { useCallback, useEffect, useState } from 'react';



/**
 * 搜索的时候分页要初始化
 * [防抖改URL] 过滤组件
 * 1. 延迟回调父组件给的set方法
 * 2. 实时修改URL里的入参
 * 参数：
 * 1. 回调方法 延迟执行的回调方法
 * 2. 参数名称 paramName
 * 可优化：
 * 1. 防抖时间可以作为入参
 * 2. 接收入参的提示名称（按姓名/XXX等搜索）
 * 3. 支持传入样式(不用semi组件，使用原生组件)
 * 4. 搜索时候又分页则清空分页参数
 */

interface SearchProps{
  paramName:string,
  placeholder?:string,
  // pageInit?:string, //传值则搜索的时候page回到第一页
  params:any, //搜索的其他入参
  setParams:(val:any)=>void; //参数回传
}

export default ({placeholder="请输入",params,paramName,setParams}:SearchProps)=>{
  const [value, setValue] = useState<string>(params[paramName]);
  useDebounceEffect(()=>{
     let newParams:any={... params}
     //判断语句解决首次就会触发params变动的问题
     if(value||newParams[paramName]){ 
        newParams[paramName]=value?value:undefined;
        setParams(newParams)
      }
  },[value],{wait:500})
  return (
      <Input placeholder={placeholder} value={value} onChange={(e) => setValue(e)} prefix={<IconSearch />} showClear ></Input>
    )
}

