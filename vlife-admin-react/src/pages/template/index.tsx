import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router'
import { Card } from '@douyinfe/semi-ui';
import TablePage from '@src/pages/common/tablePage';
import { useModelInfo } from '@src/provider/baseProvider';
import FormPage from '../common/formPage';
import { useTitle } from 'ahooks';


/**
 * CRUD配置模板页面
 * 1. 从template/xx路由页面取得entityName,模块信息
 * 2. 组装产生CRUD页面
 * - 存在该页面请求模型信息，table也请求的重复情况
 */
 export default ()=>{
  const params= useParams()
  const local=useLocation();
  
  const [title,setTitle]=useState<string>();
  useTitle(title||'配置表单');
  const entityName=useMemo<string>(()=>{
    const length=local.pathname.split("/").length;
    return  local.pathname.split("/")[length-1];
  },[params])
  const {data,runAsync}=useModelInfo({entityName})
  useEffect(()=>{
    runAsync(entityName).then(data=>{
      setTitle(data.data?.title||'')
      setFormData({})
    })
  },[entityName]);

  // //2页面模块需要共享的查询条件状态
  const [formData,setFormData]=useState<Partial<any>>({});
  if(title){
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title={title+'管理'}  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage type='queryForm' 
              maxColumns={[1,1,1]} 
              formData={formData} 
              onDataChange={setFormData} 
              entityName={entityName||''}  
              modelName={entityName+'PageReq'} />
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title={title+'列表'} 
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData}
                entityName={entityName||''} 
                hideColumns={['createDate','modifyDate','status','id','createId','modifyId']}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )}else{
    return <><b>
      <h3>
        {entityName?
          '路由地址/template/'+entityName+'       ['+entityName+']的模型名称不存在,请检查拼写':
          '路由地址/template/xxx还没有配置模型名称[xxx]'}
        </h3></b>
        </>
  }
  }


