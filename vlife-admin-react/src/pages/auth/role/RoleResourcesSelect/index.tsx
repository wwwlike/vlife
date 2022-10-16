import React, { useCallback, useMemo } from 'react';
import { observer, useField, useForm } from '@formily/react';
import { ArrayField } from '@formily/core';
import MENU_CONFIG from '@src/menu/config';
import { CheckboxGroup, Divider } from '@douyinfe/semi-ui';
import { SysResources } from '@src/mvc/SysResources';
/**
 * 资源选择组件，能适配所有业务的放在组件里，这个只能算是特定功能模块
 */

export interface RoleResourcesSelectProp{
  value:string[],
  datas:SysResources[],//进行选择需要展示的数据量
  onChange:(value:string[])=>void
}

const RoleResourcesSelect=({value,datas,onChange}:RoleResourcesSelectProp)=>{
/**
 * 菜单信息
 */
const menus=useMemo(():SysResources[]=>{
  if(datas){
    return datas.filter(f=>f.type==='1')||[]; //1是菜单
  }else{
    return []
  }
},[datas])

/**
 * 菜单下的资源信息获取方法
 */
const getResources=useCallback((menuCode:string):{label:string,value:string}[]=>{
  const resources:SysResources[]=datas.filter(f=>f.menuCode===menuCode);
  return  resources.map(r=>{
    return {label:r.name,value:r.id};
  })
},[datas])

return <>
  {menus.length===0?'没有请求到任何可分配的选项':
  menus.map(menu=>{
    return (<div  key={'div_'+menu.id}>
      <h3  style={{"marginTop":"20px"}}><b>{menu.name}</b></h3>
      <Divider margin='8px'/>
      <CheckboxGroup
        value={value} 
        onChange={onChange}
        options={getResources(menu.resourcesCode)} direction='horizontal'/>
    </div>);
  })}
</>
}

export default RoleResourcesSelect;