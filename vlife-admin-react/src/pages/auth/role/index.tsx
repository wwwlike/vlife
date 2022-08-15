import { Card } from '@douyinfe/semi-ui';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import React, { useState} from 'react';

/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  //2页面模块需要共享的查询条件状态
  const [pageReq,setPageReq]=useState({});
  const entityName="sysRole";
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='角色管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage type='queryForm' 
              maxColumns={[1,1,1]} 
              formData={pageReq} 
              onDataChange={setPageReq} 
              entityName={entityName}  
              modelName='sysRolePageReq' />
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='角色列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={pageReq}
                entityName={entityName} 
                // hideColumns={['createDate','modifyDate']}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


